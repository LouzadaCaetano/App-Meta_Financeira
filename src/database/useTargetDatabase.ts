import { useSQLiteContext } from 'expo-sqlite'
import { Target, TargetCreate, TargetUpdate } from '@/database/types'

type TargetRow = {
  id: number
  name: string
  amount: number
  current: number
}

function mapTarget(row: TargetRow): Target {
  return {
    id: row.id,
    name: row.name,
    amount: row.amount,
    current: row.current,
    percentage: row.amount > 0 ? Math.min((row.current / row.amount) * 100, 100) : 0,
  }
}

export function useTargetDatabase() {
  const db = useSQLiteContext()

  async function create({ name, amount }: TargetCreate) {
    const result = await db.runAsync(
      'INSERT INTO targets (name, amount) VALUES ($name, $amount)',
      {
        $name: name,
        $amount: amount,
      },
    )

    return result.lastInsertRowId
  }

  async function update({ id, name, amount }: TargetUpdate) {
    await db.runAsync(
      `UPDATE targets
       SET name = $name,
           amount = $amount,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $id`,
      {
        $id: id,
        $name: name,
        $amount: amount,
      },
    )
  }

  async function remove(id: number) {
    await db.runAsync('DELETE FROM targets WHERE id = $id', {
      $id: id,
    })
  }

  async function show(id: number) {
    const result = await db.getFirstAsync<TargetRow>(
      `SELECT
         t.id,
         t.name,
         t.amount,
         COALESCE(SUM(tr.amount), 0) AS current
       FROM targets t
       LEFT JOIN transactions tr ON tr.target_id = t.id
       WHERE t.id = $id
       GROUP BY t.id`,
      {
        $id: id,
      },
    )

    return result ? mapTarget(result) : null
  }

  async function list() {
    const result = await db.getAllAsync<TargetRow>(
      `SELECT
         t.id,
         t.name,
         t.amount,
         COALESCE(SUM(tr.amount), 0) AS current
       FROM targets t
       LEFT JOIN transactions tr ON tr.target_id = t.id
       GROUP BY t.id
       ORDER BY
         CASE
           WHEN t.amount > 0 THEN COALESCE(SUM(tr.amount), 0) / t.amount
           ELSE 0
         END DESC,
         t.updated_at DESC`,
    )

    return result.map(mapTarget)
  }

  return {
    create,
    update,
    remove,
    show,
    list,
  }
}
