import { extFromLabel } from '@/utils/file-ext'
import { describe, expect, it } from 'vitest'

describe('extFromLabel', () => {
  it('extracts and uppercases the extension', () => {
    expect(extFromLabel('Vesper.exe')).toBe('EXE')
    expect(extFromLabel('Worth_Systems.doc')).toBe('DOC')
    expect(extFromLabel('QuintaGroup.js')).toBe('JS')
  })

  it('takes only the last extension', () => {
    expect(extFromLabel('archive.tar.gz')).toBe('GZ')
  })

  it('returns null when there is no extension', () => {
    expect(extFromLabel('Recycle Bin')).toBe(null)
    expect(extFromLabel('')).toBe(null)
  })
})
