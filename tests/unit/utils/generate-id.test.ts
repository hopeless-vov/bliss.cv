import { generateId } from '@/utils/generate-id'
import { describe, expect, it } from 'vitest'

describe('generateId', () => {
  it('combines a base36 timestamp with a random suffix', () => {
    const id = generateId(() => 0.123456789)
    expect(id).toMatch(/^[a-z0-9]+-[a-z0-9]+$/)
  })

  it('produces different ids for different random values', () => {
    expect(generateId(() => 0.1)).not.toBe(generateId(() => 0.9))
  })
})
