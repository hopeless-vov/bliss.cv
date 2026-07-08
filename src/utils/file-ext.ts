/* "Vesper.exe" → "EXE"; labels without an extension (e.g. "Recycle Bin") → null. */
export function extFromLabel(label: string): string | null {
  const match = /\.([a-z0-9]+)$/i.exec(label.trim())
  return match ? match[1].toUpperCase() : null
}
