export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatSignedCurrency(value: number) {
  const formatted = formatCurrency(Math.abs(value))

  if (value < 0) {
    return `-${formatted}`
  }

  return formatted
}

export function formatDateShort(date: Date) {
  const day = String(date.getDate()).padStart(2, '0')
  const month = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'][
    date.getMonth()
  ]
  const year = date.getFullYear()

  return `${day} ${month} ${year}`
}
