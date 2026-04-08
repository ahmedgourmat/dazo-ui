export type TeamRow = {
  id: string
  name: string
  role: string
  score: number
  status: 'Active' | 'Pending' | 'Inactive'
}
