/* eslint-disable import/prefer-default-export */

import { translate } from './translations'

// Gets an string in iso format and transforms to locale format
export const localDate = (isoDate) => {
  const localeDate = new Date(`${isoDate} `).toLocaleDateString()
  return localeDate === 'Invalid Date' ? translate('invalid_date') : localeDate
}

// Formats a number to money in Reais
export const numberToReais = (amount) => {
  let number = amount
  if (!amount) number = 0

  if (amount < 0) return translate('invalid_salary')

  return `R$ ${number.toLocaleString('pt-BR', {
    minimumIntegerDigits: 1,
    minimumFractionDigits: 2,
    useGrouping: true,
  })}`
}

// Formats a string properly to send in a url query
export const sanitizeStringToSearch = (text) => {
  let newText = text.trim().replace(/\s\s+/g, ' ')
  newText = encodeURI(newText)
  newText = newText.replaceAll('#', '%23')
  newText = newText.replaceAll('+', '%2B')
  return newText
}

// Append query on url based on condition
export const keepQueryOnUrl = (url, query, condition) =>
  condition ? `${url}?${query}` : url

// Para onde levar a pessoa depois do login ou do cadastro, a partir da query da URL:
// a vaga em que ela clicou em "Aplicar" (?vaga=<id>) ou a criação de vaga (?criarvaga=1)
export const postLoginPath = (search = {}) => {
  if (search.vaga) return `/vagas/${encodeURIComponent(search.vaga)}`
  if (search.criarvaga === '1') return '/formulariovaga/criar?home=1'
  return '/'
}

// Mantém essa informação ao alternar entre as telas de login e de cadastro
export const postLoginQuery = (search = {}) => {
  if (search.vaga) return `?vaga=${encodeURIComponent(search.vaga)}`
  if (search.criarvaga === '1') return '?criarvaga=1'
  return ''
}
