import { useSQLiteContext } from 'expo-sqlite'
import {
  Transaction,
  TransactionCreate,
  TransactionsSummary,
} from '@/database/types'

type SummaryRow = TransactionsSummary
type TransactionRow = {
  id: number
  target_id: number
  amount: number
  observation: string | null
  created_at: string
  updated_at: string
}

export function useTransactionsDatabase() {
  const db = useSQLiteContext()

  async function create({ target_id, amount, observation }: TransactionCreate) {
    const result = await db.runAsync(
      `INSERT INTO transactions (target_id, amount, observation)
       VALUES ($target_id, $amount, $observation)`,
      {
        $target_id: target_id,
        $amount: amount,
        $observation: observation?.trim() || null,
      },
    )

    return result.lastInsertRowId
  }

  async function listByTargetId(target_id: number) {
    const result = await db.getAllAsync<TransactionRow>(
      `SELECT
         id,
         target_id,
         amount,
         observation,
         created_at,
         updated_at
       FROM transactions
       WHERE target_id = $target_id
       ORDER BY created_at DESC`,
      {
        $target_id: target_id,
      },
    )

    return result.map((item): Transaction => ({
      id: item.id,
      target_id: item.target_id,
      amount: item.amount,
      observation: item.observation ?? undefined,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }))
  }

  async function remove(id: number) {
    await db.runAsync('DELETE FROM transactions WHERE id = $id', {
      $id: id,
    })
  }

  async function getSummary() {
    const result = await db.getFirstAsync<SummaryRow>(
      `SELECT
         COALESCE(SUM(amount), 0) AS total,
         COALESCE(SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END), 0) AS input,
         COALESCE(ABS(SUM(CASE WHEN amount < 0 THEN amount ELSE 0 END)), 0) AS output
       FROM transactions`,
    )

    return (
      result ?? {
        total: 0,
        input: 0,
        output: 0,
      }
    )
  }

  return {
    create,
    listByTargetId,
    remove,
    getSummary,
  }
}
