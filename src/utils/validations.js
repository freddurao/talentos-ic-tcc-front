/* eslint-disable import/prefer-default-export */

// Checks if an email is valid
export const isEmailValid = (email) => {
  return email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}

export const isPasswordValid = (password) => {
  return password.length >= 6
}

export const isCNPJValid = (cnpj) => {
  if (!cnpj) return false

  const cleanCNPJ = cnpj.replace(/[^\d]+/g, '')

  if (cleanCNPJ.length !== 14) return false

  if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false

  let length = cleanCNPJ.length - 2
  let numbers = cleanCNPJ.substring(0, length)
  const digits = cleanCNPJ.substring(length)
  let sum = 0
  let pos = length - 7

  for (let i = length; i >= 1; i -= 1) {
    sum += Number(numbers.charAt(length - i)) * pos
    pos -= 1
    if (pos < 2) pos = 9
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== Number(digits.charAt(0))) return false

  length += 1
  numbers = cleanCNPJ.substring(0, length)
  sum = 0
  pos = length - 7

  for (let i = length; i >= 1; i -= 1) {
    sum += Number(numbers.charAt(length - i)) * pos
    pos -= 1
    if (pos < 2) pos = 9
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== Number(digits.charAt(1))) return false

  return true
}

// Data de hoje no fuso de quem está usando, no formato AAAA-MM-DD (o mesmo do <input type="date">)
export const todayDateString = () => {
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

// Valida o período de candidatura da vaga. Devolve a mensagem de erro ou null.
// Mesmas regras do backend (utils/validation.js): fim depois do início e não no passado.
export const getJobDatesError = (
  startingDate,
  endingDate,
  today = todayDateString()
) => {
  if (!startingDate || !endingDate)
    return 'Informe o início e o fim do período de candidatura.'
  if (endingDate < startingDate)
    return 'O fim do período de candidatura não pode ser antes do início.'
  if (endingDate < today)
    return 'O fim do período de candidatura não pode estar no passado.'
  return null
}
