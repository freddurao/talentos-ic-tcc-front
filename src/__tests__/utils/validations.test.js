import '@testing-library/jest-dom/extend-expect'
import { getJobDatesError, isEmailValid } from '../../utils/validations'

describe('testing isEmailValid function', () => {
  describe('when string is empty', () => {
    it('should return false', () => {
      expect(isEmailValid('')).toBeFalsy()
    })
  })

  describe('when string has a valid email', () => {
    it('should return true', () => {
      expect(isEmailValid('fulano.silva@email.com.br')).toBeTruthy()
      expect(isEmailValid('fulano@email.com')).toBeTruthy()
    })
  })

  describe('when string has an invalid email', () => {
    it('should return false', () => {
      expect(isEmailValid('fulano.silva')).toBeFalsy()
      expect(isEmailValid('@email.com')).toBeFalsy()
      expect(isEmailValid('fulano@email')).toBeFalsy()
      expect(isEmailValid('fulano@email.')).toBeFalsy()
    })
  })
})

describe('testing getJobDatesError function', () => {
  const today = '2026-11-26'

  it('should accept a valid period', () => {
    expect(getJobDatesError('2026-12-01', '2026-12-20', today)).toBeNull()
  })

  it('should accept a period ending today', () => {
    expect(getJobDatesError(today, today, today)).toBeNull()
  })

  it('should accept a period that started in the past', () => {
    expect(getJobDatesError('2026-11-01', '2026-12-20', today)).toBeNull()
  })

  it('should reject missing dates', () => {
    expect(getJobDatesError('', '2026-12-20', today)).toMatch(/Informe/)
    expect(getJobDatesError('2026-12-01', '', today)).toMatch(/Informe/)
  })

  it('should reject an end before the start', () => {
    expect(getJobDatesError('2026-12-20', '2026-12-01', today)).toMatch(
      /antes do início/
    )
  })

  it('should reject an end in the past', () => {
    expect(getJobDatesError('2026-11-01', '2026-11-25', today)).toMatch(
      /passado/
    )
  })
})
