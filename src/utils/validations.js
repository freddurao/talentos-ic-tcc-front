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
