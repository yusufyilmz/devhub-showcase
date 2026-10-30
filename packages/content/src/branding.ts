/** A consistent name mark for navigation, icons and sharing artwork. */
export function getNameInitials(name: string): string {
  const words = name.normalize('NFC').match(/[\p{L}\p{N}]+/gu) ?? []
  const selected =
    words.length > 1 ? [words[0] ?? '', words[words.length - 1] ?? ''] : words
  return (
    selected
      .map((word) => Array.from(word)[0])
      .join('')
      .toLocaleUpperCase('en')
      .slice(0, 4) || '?'
  )
}
