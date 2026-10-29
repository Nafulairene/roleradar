// Our own clean shape for a job, the same for every source
export type Job = {
  source: 'greenhouse'
  company: string
  externalId: string
  title: string
  location: string
  url: string
  updatedAt: string
}