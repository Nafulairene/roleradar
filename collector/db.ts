import pg from 'pg'
import type { Job } from './types'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL is not set. Check your .env file.')
}

export const pool = new pg.Pool({ connectionString })

// Create the jobs table the first time; do nothing if it already exists
export async function setupDatabase(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS jobs (
      id            SERIAL PRIMARY KEY,
      source        TEXT NOT NULL,
      company       TEXT NOT NULL,
      external_id   TEXT NOT NULL,
      title         TEXT NOT NULL,
      location      TEXT NOT NULL,
      url           TEXT NOT NULL,
      updated_at    TIMESTAMPTZ NOT NULL,
      first_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE (source, company, external_id)
    )
  `)
}

// Save jobs, skipping any already in the table. Returns how many were new.
export async function saveJobs(jobs: Job[]): Promise<number> {
  let newCount = 0

  for (const job of jobs) {
    const result = await pool.query(
      `INSERT INTO jobs (source, company, external_id, title, location, url, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (source, company, external_id) DO NOTHING`,
      [job.source, job.company, job.externalId, job.title, job.location, job.url, job.updatedAt],
    )
    newCount += result.rowCount ?? 0
  }

  return newCount
}