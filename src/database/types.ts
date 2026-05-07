export type TargetCreate = {
  name: string
  amount: number
}

export type TargetUpdate = {
  id: number
  name: string
  amount: number
}

export type Target = {
  id: number
  name: string
  amount: number
  current: number
  percentage: number
}

export type TransactionCreate = {
  target_id: number
  amount: number
  observation?: string
}

export type Transaction = {
  id: number
  target_id: number
  amount: number
  observation?: string
  created_at: string
  updated_at: string
}

export type TransactionsSummary = {
  total: number
  input: number
  output: number
}
