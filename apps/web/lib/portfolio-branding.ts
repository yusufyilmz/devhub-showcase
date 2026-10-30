import { getNameInitials, type PortfolioProfile } from '@shared/content'
export function brandColor(profile: PortfolioProfile) {
  const colors = {
    cyan: '#22d3ee',
    emerald: '#34d399',
    violet: '#a78bfa',
    amber: '#fbbf24',
    rose: '#fb7185'
  }
  return colors[profile.appearance?.accent ?? 'cyan'] ?? colors.cyan
}
function escapeXml(text: string) {
  return text.replace(
    /[<>&"']/g,
    (character) =>
      ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&apos;'
      })[character] as string
  )
}
export function portfolioIcon(profile: PortfolioProfile) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><title>${escapeXml(profile.name)}</title><rect width="64" height="64" rx="16" fill="#111827"/><text x="32" y="42" text-anchor="middle" font-family="Arial,sans-serif" font-size="27" font-weight="700" fill="${brandColor(profile)}">${escapeXml(getNameInitials(profile.name))}</text></svg>`
}
