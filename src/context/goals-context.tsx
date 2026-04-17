import AsyncStorage from '@react-native-async-storage/async-storage'
import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Loading } from '@/components/Loading'
import { TransactionTypes } from '@/utils/TransactionTypes'
import { formatCurrency, formatDateShort, formatSignedCurrency } from '@/utils/format'

export type Goal = {
  id: string
  name: string
  targetValue: number
}

export type GoalTransaction = {
  id: string
  goalId: string
  type: TransactionTypes
  value: number
  reason?: string
  date: string
}

type GoalInput = {
  name: string
  targetValue: number
}

type NewTransactionInput = {
  type: TransactionTypes
  value: number
  reason?: string
}

type GoalProgress = {
  currentValue: number
  targetValue: number
  percentage: number
}

type HomeGoalCard = {
  id: string
  name: string
  current: string
  target: string
  percentage: number
}

type HomeSummary = {
  total: string
  input: {
    label: string
    value: string
  }
  output: {
    label: string
    value: string
  }
}

type GoalsStoragePayload = {
  goals: Goal[]
  transactions: GoalTransaction[]
}

type GoalsContextData = {
  goals: Goal[]
  homeGoals: HomeGoalCard[]
  homeSummary: HomeSummary
  getGoalById: (goalId: string) => Goal | undefined
  getGoalProgress: (goalId: string) => GoalProgress
  getTransactionsByGoalId: (goalId: string) => GoalTransaction[]
  createGoal: (input: GoalInput) => Goal
  updateGoal: (goalId: string, input: GoalInput) => Goal | undefined
  deleteGoal: (goalId: string) => void
  createTransaction: (goalId: string, input: NewTransactionInput) => GoalTransaction | undefined
  deleteTransaction: (goalId: string, transactionId: string) => void
}

const STORAGE_KEY = '@metafinanceira:data'
const EMPTY_STORAGE_PAYLOAD: GoalsStoragePayload = {
  goals: [],
  transactions: [],
}

const GoalsContext = createContext<GoalsContextData | null>(null)

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function parseGoal(value: unknown): Goal | null {
  if (!isRecord(value)) {
    return null
  }

  if (
    typeof value.id !== 'string' ||
    typeof value.name !== 'string' ||
    typeof value.targetValue !== 'number'
  ) {
    return null
  }

  return {
    id: value.id,
    name: value.name.trim(),
    targetValue: value.targetValue,
  }
}

function parseTransaction(value: unknown): GoalTransaction | null {
  if (!isRecord(value)) {
    return null
  }

  if (
    typeof value.id !== 'string' ||
    typeof value.goalId !== 'string' ||
    typeof value.value !== 'number' ||
    typeof value.date !== 'string'
  ) {
    return null
  }

  if (value.type !== TransactionTypes.Input && value.type !== TransactionTypes.Output) {
    return null
  }

  return {
    id: value.id,
    goalId: value.goalId,
    type: value.type,
    value: value.value,
    date: value.date,
    reason: typeof value.reason === 'string' && value.reason.trim() ? value.reason : undefined,
  }
}

function isGoal(value: Goal | null): value is Goal {
  return !!value
}

function generateId(prefix: 'goal' | 'transaction') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function sanitizeStoragePayload(value: unknown): GoalsStoragePayload {
  if (!isRecord(value)) {
    return EMPTY_STORAGE_PAYLOAD
  }

  const goals = Array.isArray(value.goals)
    ? value.goals
        .map(parseGoal)
        .filter(isGoal)
        .filter((goal, index, currentGoals) => {
          return (
            goal.name.length > 0 &&
            Number.isFinite(goal.targetValue) &&
            goal.targetValue > 0 &&
            currentGoals.findIndex((currentGoal) => currentGoal.id === goal.id) === index
          )
        })
    : []
  const goalIds = new Set(goals.map((goal) => goal.id))

  const transactions = Array.isArray(value.transactions)
    ? value.transactions
        .map(parseTransaction)
        .filter((transaction): transaction is GoalTransaction => {
          return (
            !!transaction &&
            Number.isFinite(transaction.value) &&
            transaction.value > 0 &&
            goalIds.has(transaction.goalId)
          )
        })
        .filter((transaction, index, currentTransactions) => {
          return (
            currentTransactions.findIndex((currentTransaction) => {
              return currentTransaction.id === transaction.id
            }) === index
          )
        })
    : []

  return { goals, transactions }
}

async function readGoalsStorage() {
  try {
    const storedValue = await AsyncStorage.getItem(STORAGE_KEY)

    if (!storedValue) {
      return EMPTY_STORAGE_PAYLOAD
    }

    return sanitizeStoragePayload(JSON.parse(storedValue))
  } catch (error) {
    console.warn(`[GoalsStorage] Falha ao ler a chave ${STORAGE_KEY}.`, error)
    return EMPTY_STORAGE_PAYLOAD
  }
}

async function writeGoalsStorage(payload: GoalsStoragePayload) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch (error) {
    console.warn(`[GoalsStorage] Falha ao salvar a chave ${STORAGE_KEY}.`, error)
  }
}

export function GoalsProvider({ children }: PropsWithChildren) {
  const [goals, setGoals] = useState<Goal[]>([])
  const [transactions, setTransactions] = useState<GoalTransaction[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function hydrateStorage() {
      const payload = await readGoalsStorage()

      if (!isMounted) {
        return
      }

      setGoals(payload.goals)
      setTransactions(payload.transactions)
      setIsHydrated(true)
    }

    hydrateStorage()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!isHydrated) {
      return
    }

    writeGoalsStorage({ goals, transactions })
  }, [goals, isHydrated, transactions])

  const progressByGoal = useMemo(() => {
    return goals.reduce<Record<string, GoalProgress>>((accumulator, goal) => {
      const currentValue = transactions
        .filter((transaction) => transaction.goalId === goal.id)
        .reduce((total, transaction) => {
          const signedValue =
            transaction.type === TransactionTypes.Input ? transaction.value : -transaction.value

          return total + signedValue
        }, 0)

      const safeCurrentValue = Math.max(currentValue, 0)
      const percentage =
        goal.targetValue > 0 ? Math.round((safeCurrentValue / goal.targetValue) * 100) : 0

      accumulator[goal.id] = {
        currentValue: safeCurrentValue,
        targetValue: goal.targetValue,
        percentage: Math.max(0, Math.min(percentage, 100)),
      }

      return accumulator
    }, {})
  }, [goals, transactions])

  const homeGoals = useMemo<HomeGoalCard[]>(() => {
    return goals.map((goal) => {
      const progress = progressByGoal[goal.id] ?? {
        currentValue: 0,
        targetValue: goal.targetValue,
        percentage: 0,
      }

      return {
        id: goal.id,
        name: goal.name,
        current: formatCurrency(progress.currentValue),
        target: formatCurrency(progress.targetValue),
        percentage: progress.percentage,
      }
    })
  }, [goals, progressByGoal])

  const homeSummary = useMemo<HomeSummary>(() => {
    const total = Object.values(progressByGoal).reduce(
      (sum, goalProgress) => sum + goalProgress.currentValue,
      0,
    )

    const inputTotal = transactions
      .filter((transaction) => transaction.type === TransactionTypes.Input)
      .reduce((sum, transaction) => sum + transaction.value, 0)

    const outputTotal = transactions
      .filter((transaction) => transaction.type === TransactionTypes.Output)
      .reduce((sum, transaction) => sum + transaction.value, 0)

    return {
      total: formatCurrency(total),
      input: {
        label: 'Entradas',
        value: formatCurrency(inputTotal),
      },
      output: {
        label: 'Saídas',
        value: formatSignedCurrency(-outputTotal),
      },
    }
  }, [progressByGoal, transactions])

  function getGoalById(goalId: string) {
    return goals.find((goal) => goal.id === goalId)
  }

  function getGoalProgress(goalId: string) {
    return (
      progressByGoal[goalId] ?? {
        currentValue: 0,
        targetValue: 0,
        percentage: 0,
      }
    )
  }

  function getTransactionsByGoalId(goalId: string) {
    return transactions.filter((transaction) => transaction.goalId === goalId)
  }

  function createGoal(input: GoalInput) {
    const nextGoal: Goal = {
      id: generateId('goal'),
      name: input.name.trim(),
      targetValue: input.targetValue,
    }

    setGoals((currentGoals) => [...currentGoals, nextGoal])

    return nextGoal
  }

  function updateGoal(goalId: string, input: GoalInput) {
    let updatedGoal: Goal | undefined

    setGoals((currentGoals) =>
      currentGoals.map((goal) => {
        if (goal.id !== goalId) {
          return goal
        }

        updatedGoal = {
          ...goal,
          name: input.name.trim(),
          targetValue: input.targetValue,
        }

        return updatedGoal
      }),
    )

    return updatedGoal
  }

  function deleteGoal(goalId: string) {
    setGoals((currentGoals) => currentGoals.filter((goal) => goal.id !== goalId))
    setTransactions((currentTransactions) =>
      currentTransactions.filter((transaction) => transaction.goalId !== goalId),
    )
  }

  function createTransaction(goalId: string, input: NewTransactionInput) {
    if (!getGoalById(goalId)) {
      return undefined
    }

    const nextTransaction: GoalTransaction = {
      id: generateId('transaction'),
      goalId,
      type: input.type,
      value: input.value,
      reason: input.reason?.trim() || undefined,
      date: formatDateShort(new Date()),
    }

    setTransactions((currentTransactions) => [nextTransaction, ...currentTransactions])

    return nextTransaction
  }

  function deleteTransaction(goalId: string, transactionId: string) {
    setTransactions((currentTransactions) =>
      currentTransactions.filter(
        (transaction) =>
          !(transaction.goalId === goalId && transaction.id === transactionId),
      ),
    )
  }

  const value: GoalsContextData = {
    goals,
    homeGoals,
    homeSummary,
    getGoalById,
    getGoalProgress,
    getTransactionsByGoalId,
    createGoal,
    updateGoal,
    deleteGoal,
    createTransaction,
    deleteTransaction,
  }

  if (!isHydrated) {
    return <Loading />
  }

  return <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>
}

export function useGoals() {
  const context = useContext(GoalsContext)

  if (!context) {
    throw new Error('useGoals deve ser usado dentro de GoalsProvider.')
  }

  return context
}
