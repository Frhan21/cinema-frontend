export function parseJakartaDateTime(value: string) {
  if (value.includes('T')) return new Date(value)
  return new Date(`${value.replace(' ', 'T')}:00+07:00`)
}

export function formatJakartaDateTime(value: string) {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  }).format(parseJakartaDateTime(value))
}
