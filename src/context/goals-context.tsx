import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react'
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
  createTransaction: (goalId: string, input: NewTransactionInput) => GoalTransaction
  deleteTransaction: (goalId: string, transactionId: string) => void
}

const initialGoals: Goal[] = [
  {
    id: '1',
    name: 'Viagem para o Rio',
    targetValue: 1780,
  },
  {
    id: '2',
    name: 'Notebook',
    targetValue: 4000,
  },
]

const initialTransactions: GoalTransaction[] = [
  {
    id: 't1',
    goalId: '1',
    type: TransactionTypes.Input,
    value: 600,
    date: '12 abr 2026',
    reason: 'Transferência feita para acelerar a reserva da viagem.',
  },
  {
    id: 't2',
    goalId: '1',
    type: TransactionTypes.Output,
    value: 20,
    date: '08 abr 2026',
    reason: 'Ajuste pontual para cobrir um gasto inesperado.',
  },
  {
    id: 't3',
    goalId: '2',
    type: TransactionTypes.Input,
    value: 1200,
    date: '05 abr 2026',
    reason: 'Parte do bônus mensal direcionado para o notebook.',
  },
]

const GoalsContext = createContext<GoalsContextData | null>(null)

export function GoalsProvider({ children }: PropsWithChildren) {
  const [goals, setGoals] = useState<Goal[]>(initialGoals)
  const [transactions, setTransactions] = useState<GoalTransaction[]>(initialTransactions)

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
      id: Date.now().toString(),
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
    const nextTransaction: GoalTransaction = {
      id: `t-${Date.now()}`,
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

  return <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>
}

export function useGoals() {
  const context = useContext(GoalsContext)

  if (!context) {
    throw new Error('useGoals deve ser usado dentro de GoalsProvider.')
  }

  return context
}
