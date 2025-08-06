import { cn, generateSlug } from '../utils'

describe('cn', () => {
  it('should combine class names', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2')
    expect(cn('class1', 'class2', 'class3')).toBe('class1 class2 class3')
  })

  it('should handle conditional classes', () => {
    expect(cn('base', true && 'conditional')).toBe('base conditional')
    expect(cn('base', false && 'conditional')).toBe('base')
  })

  it('should handle arrays and objects', () => {
    expect(cn('base', ['class1', 'class2'])).toBe('base class1 class2')
    expect(cn('base', { class1: true, class2: false, class3: true })).toBe('base class1 class3')
  })

  it('should merge Tailwind classes correctly', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
    expect(cn('p-4', 'p-2')).toBe('p-2')
    // The order might vary, so we'll check that both classes are present
    const result = cn('bg-red-500 text-white', 'bg-blue-500')
    expect(result).toContain('bg-blue-500')
    expect(result).toContain('text-white')
  })

  it('should handle empty inputs', () => {
    expect(cn()).toBe('')
    expect(cn('')).toBe('')
    expect(cn('', '')).toBe('')
  })
})

describe('generateSlug', () => {
  it('should generate valid slugs from product names', () => {
    expect(generateSlug('MacBook Pro 16-inch')).toBe('macbook-pro-16-inch')
    expect(generateSlug('iPhone 15 Pro')).toBe('iphone-15-pro')
    expect(generateSlug('Samsung Galaxy S24')).toBe('samsung-galaxy-s24')
    expect(generateSlug('ASUS ROG Strix G15')).toBe('asus-rog-strix-g15')
  })

  it('should handle special characters', () => {
    expect(generateSlug('Product & More!')).toBe('product-more')
    expect(generateSlug('Product (Special)')).toBe('product-special')
    expect(generateSlug('Product@#$%')).toBe('product')
  })

  it('should handle multiple spaces and hyphens', () => {
    expect(generateSlug('Product   Name')).toBe('product-name')
    expect(generateSlug('Product--Name')).toBe('product-name')
    expect(generateSlug('  Product Name  ')).toBe('product-name')
  })

  it('should handle edge cases', () => {
    expect(generateSlug('')).toBe('product')
    expect(generateSlug('   ')).toBe('product')
    expect(generateSlug('@#$%')).toBe('product')
    expect(generateSlug('---')).toBe('product')
    expect(generateSlug(null as any)).toBe('product')
    expect(generateSlug(undefined as any)).toBe('product')
  })

  it('should generate slugs that match the backend regex pattern', () => {
    const slugRegex = /^[a-z0-9-]+$/
    
    const testCases = [
      'MacBook Pro 16-inch',
      'iPhone 15 Pro',
      'Samsung Galaxy S24',
      'ASUS ROG Strix G15',
      'Product & More!',
      'Product (Special)',
      'Product@#$%',
      'Product   Name',
      'Product--Name',
      '  Product Name  ',
      '',
      '   ',
      '@#$%',
      '---'
    ]
    
    testCases.forEach(name => {
      const slug = generateSlug(name)
      expect(slug).toMatch(slugRegex)
      expect(slug.length).toBeGreaterThan(0)
      expect(slug.length).toBeLessThanOrEqual(200)
    })
  })
}) 