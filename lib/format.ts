export function formatNumber(value: any) {
  if (value === undefined || value === null) return '0'

  const num = Number(value)
  if (isNaN(num)) return '0'

  return num.toLocaleString()
}

export function formatDate(value: any) {
  if (!value) return '-'

  try {
    const date = value?.toDate ? value.toDate() : new Date(value)

    if (isNaN(date.getTime())) return '-'

    return date.toLocaleDateString('pt-BR')
  } catch {
    return '-'
  }
}
