// Fetches open roles from a company's Greenhouse job board
// and prints the ones that match our keywords.

// 1. One job, as Greenhouse sends it (only the fields we use)
type GreenhouseJob = {
  id: number
  title: string
  location: { name: string }
  absolute_url: string
  updated_at: string
}

// 2. The whole response from Greenhouse
type GreenhouseResponse = {
  jobs: GreenhouseJob[]
}

// 3. Our own clean shape for a job, the same for every source
type Job = {
  source: 'greenhouse'
  company: string
  externalId: string
  title: string
  location: string
  url: string
  updatedAt: string
}

// Roles we want, matched as whole phrases rather than single words
const ROLE_PHRASES = [
  'support engineer',
  'solutions engineer',
  'solutions architect',
  'solution architect',
  'customer success engineer',
  'technical account manager',
  'implementation engineer',
]

// Leadership titles to skip, matched only at the start of the title
const EXCLUDE_PREFIXES = ['director', 'senior manager', 'manager', 'head of', 'vp']

// Companies to watch: their Greenhouse board tokens
const WATCHLIST = ['gitlab', 'cloudflare', 'datadog']

function isRelevant(job: Job): boolean {
  const title = job.title.toLowerCase()

  const isLeadershipRole = EXCLUDE_PREFIXES.some((prefix) => title.startsWith(prefix))
  if (isLeadershipRole) return false

  return ROLE_PHRASES.some((phrase) => title.includes(phrase))
}

async function fetchGreenhouseJobs(boardToken: string): Promise<Job[]> {
  const url = `https://boards-api.greenhouse.io/v1/boards/${boardToken}/jobs`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Greenhouse returned ${response.status} for board "${boardToken}"`)
  }

  const data = (await response.json()) as GreenhouseResponse

  return data.jobs.map((job): Job => ({
    source: 'greenhouse',
    company: boardToken,
    externalId: String(job.id),
    title: job.title.trim(),
    location: job.location.name.trim(),
    url: job.absolute_url,
    updatedAt: job.updated_at,
  }))
}

async function main() {
  const allJobs: Job[] = []

  for (const company of WATCHLIST) {
    try {
      const jobs = await fetchGreenhouseJobs(company)
      allJobs.push(...jobs)
      console.log(`✓ ${company}: ${jobs.length} jobs`)
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error)
      console.error(`✗ ${company}: skipped (${reason})`)
    }
  }

  const matches = allJobs.filter(isRelevant)

  console.log(`\nFetched ${allJobs.length} jobs from ${WATCHLIST.length} companies, ${matches.length} relevant roles:\n`)
  for (const job of matches) {
    console.log(`- [${job.company}] ${job.title} | ${job.location}`)
    console.log(`  ${job.url}`)
  }
}

main().catch((error) => {
  console.error('Collector failed:', error)
})