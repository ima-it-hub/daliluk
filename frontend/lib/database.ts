import { Pool } from "pg";
import type { AnswerMap, EvaluationResult, Profile } from "@/lib/assessment";

const globalForDatabase = globalThis as unknown as {
  postgresPool?: Pool;
  assessmentTableReady?: Promise<void>;
};

function getPool() {
  if (!process.env.POSTGRES_CONNECTION_STRING) {
    throw new Error("POSTGRES_CONNECTION_STRING is not configured");
  }

  if (!globalForDatabase.postgresPool) {
    globalForDatabase.postgresPool = new Pool({
      connectionString: process.env.POSTGRES_CONNECTION_STRING,
      max: 5,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 10000,
      ssl: { rejectUnauthorized: false },
    });
  }

  return globalForDatabase.postgresPool;
}

async function ensureAssessmentTable() {
  if (!globalForDatabase.assessmentTableReady) {
    globalForDatabase.assessmentTableReady = getPool()
      .query(`
        CREATE TABLE IF NOT EXISTS career_assessments (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          full_name TEXT NOT NULL,
          phone TEXT NOT NULL,
          country_dial TEXT,
          residence_city TEXT,
          age TEXT,
          qualification TEXT,
          desired_role TEXT,
          answers JSONB NOT NULL,
          recommended_role TEXT NOT NULL,
          related_roles JSONB NOT NULL DEFAULT '[]'::jsonb,
          summary JSONB NOT NULL,
          whatsapp_message TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `)
      .then(() =>
        getPool().query(`
          ALTER TABLE career_assessments
            ADD COLUMN IF NOT EXISTS residence_city TEXT,
            ADD COLUMN IF NOT EXISTS related_roles JSONB NOT NULL DEFAULT '[]'::jsonb
        `),
      )
      .then(() => undefined)
      .catch((error) => {
        globalForDatabase.assessmentTableReady = undefined;
        throw error;
      });
  }

  await globalForDatabase.assessmentTableReady;
}

export async function saveAssessment(
  profile: Profile,
  answers: AnswerMap,
  result: EvaluationResult,
) {
  await ensureAssessmentTable();

  await getPool().query(
    `
      INSERT INTO career_assessments (
        full_name,
        phone,
        country_dial,
        residence_city,
        age,
        qualification,
        desired_role,
        answers,
        recommended_role,
        related_roles,
        summary,
        whatsapp_message
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, $10::jsonb, $11::jsonb, $12)
    `,
    [
      profile.fullName,
      profile.phone,
      profile.countryDial || null,
      profile.residenceCity || null,
      profile.age || null,
      profile.qualification || null,
      profile.desiredRole || null,
      JSON.stringify(answers),
      result.recommendedRole,
      JSON.stringify(result.relatedRoles),
      JSON.stringify(result.summary),
      result.whatsappMessage,
    ],
  );
}
