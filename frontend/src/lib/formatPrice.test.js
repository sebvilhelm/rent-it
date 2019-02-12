import formatPrice from './formatPrice'

describe('formatPrice', () => {
  it('formats correctly', () => {
    expect(formatPrice(100)).toBe('DKK 1')
    expect(formatPrice(101)).toBe('DKK 1.01')
    expect(formatPrice(1010)).toBe('DKK 10.10')
    expect(formatPrice(123127831827374380)).toBe('DKK 1,231,278,318,273,743.80')
  })
})
