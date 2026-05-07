export const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const percent = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatCurrency(value: number) {
  return brl.format(value)
}

export function formatPercentage(value: number) {
  return percent.format(value)
}

export function formatSignedCurrency(value: number) {
  const formatted = formatCurrency(Math.abs(value))

  if (value < 0) {
    return `-${formatted}`
  }

  return formatted
}

function toDate(value: Date | string) {
  if (value instanceof Date) {
    return value
  }

  return new Date(value.replace(' ', 'T'))
}

export function formatDateShort(value: Date | string) {
  const date = toDate(value)
  const day = String(date.getDate()).padStart(2, '0')
  const month = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'][
    date.getMonth()
  ]
  const year = date.getFullYear()

  return `${day} ${month} ${year}`
}
