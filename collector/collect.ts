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

const KEYWORDS = ['support', 'solutions', 'customer success', 'technical account']

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

function matchesKeywords(job: Job): boolean {
  const title = job.title.toLowerCase()
  return KEYWORDS.some((keyword) => title.includes(keyword))
}

async function main() {
  const jobs = await fetchGreenhouseJobs('gitlab')
  const matches = jobs.filter(matchesKeywords)

  console.log(`Fetched ${jobs.length} jobs, ${matches.length} match your keywords:\n`)
  for (const job of matches) {
    console.log(`- ${job.title} | ${job.location}`)
    console.log(`  ${job.url}`)
  }
}

main().catch((error) => {
  console.error('Collector failed:', error)
})