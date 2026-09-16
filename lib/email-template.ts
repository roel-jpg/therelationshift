// Branded HTML e-mail in the style of the site: sunset gradient header, warm neutrals, coral accents.
// Written table-based with inline styles, because mail clients strip stylesheets and ignore modern CSS.

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://therelationshift.vercel.app';
const FONT = "'Open Sans', -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";
const GRADIENT = 'background-color:#F05F61;background-image:linear-gradient(to right,#F05F61 -20%,#FBB022 150%);';

export function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}

/** A paragraph of user-supplied text: escaped, with line breaks kept. */
export function paragraph(text: string): string {
  return `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#3a3b42;">${esc(text).replace(/\r?\n/g, '<br>')}</p>`;
}

/** A labelled line, e.g. "From — Anna <anna@example.com>". */
export function field(label: string, value: string): string {
  return `<p style="margin:0 0 6px;font-size:14px;line-height:1.5;color:#656772;">
    <span style="display:inline-block;min-width:74px;color:#9B9B9B;">${esc(label)}</span>
    <strong style="color:#3a3b42;font-weight:600;">${esc(value)}</strong>
  </p>`;
}

/** A quoted block, used for the message someone wrote. */
export function quote(text: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0;">
    <tr><td style="background:#faf8f5;border-left:4px solid #FBB022;border-radius:0 10px 10px 0;padding:16px 18px;">
      ${paragraph(text).replace('margin:0 0 14px', 'margin:0')}
    </td></tr>
  </table>`;
}

export function button(label: string, href: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0 4px;">
    <tr><td style="${GRADIENT}border-radius:20px;">
      <a href="${esc(href)}" style="display:inline-block;padding:11px 26px;font-family:${FONT};font-size:15px;color:#ffffff;text-decoration:none;">${esc(label)}</a>
    </td></tr>
  </table>`;
}

export function renderEmail({ title, preheader, body }: { title: string; preheader: string; body: string }): string {
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:#f4f4f4;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;font-family:${FONT};">
        <tr><td style="${GRADIENT}padding:20px 28px;">
          <img src="${SITE}/icons/icon-192.png" width="34" height="34" alt="" style="border-radius:8px;vertical-align:middle;border:0;">
          <span style="vertical-align:middle;padding-left:12px;font-family:${FONT};font-size:18px;color:#ffffff;letter-spacing:.2px;">The Relationshift<span style="font-size:11px;vertical-align:super;">®</span></span>
        </td></tr>
        <tr><td style="padding:28px 28px 24px;">
          <h1 style="margin:0 0 16px;font-family:${FONT};font-size:22px;font-weight:400;line-height:1.3;color:#3a3b42;">${esc(title)}</h1>
          ${body}
        </td></tr>
        <tr><td style="padding:16px 28px;background:#faf8f5;border-top:1px solid #f0ebe5;font-family:${FONT};font-size:12px;line-height:1.6;color:#9B9B9B;">
          The Relationshift® · Amsterdam · <a href="${SITE}" style="color:#F05F61;text-decoration:none;">${esc(SITE.replace(/^https?:\/\//, ''))}</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
