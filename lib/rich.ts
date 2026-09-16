// Texts imported from the 2016 database sometimes start a list item with a literal "- ",
// because the old stylesheet hid the list markers. We render real bullets, so strip the dash
// to avoid showing it twice.
export function richHtml(html: string | null | undefined): string {
  if (!html) return '';
  return html.replace(/(<li\b[^>]*>(?:\s|&nbsp;|<br\s*\/?>)*)(?:[-–—•])\s+/gi, '$1');
}
