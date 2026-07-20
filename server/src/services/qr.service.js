import QRCode from 'qrcode';

const DEFAULT_OPTIONS = {
  margin: 1,
  width: 512,
  color: {
    dark: '#0A0E1A',
    light: '#FFFFFF',
  },
};

// Returned as data URIs / raw SVG strings so nothing ever touches the
// filesystem — required since Render's free web service has an ephemeral,
// ready-only-friendly disk that is wiped on every redeploy.
export async function generateQrPng(text, options = {}) {
  return QRCode.toDataURL(text, { ...DEFAULT_OPTIONS, ...options });
}

export async function generateQrSvg(text, options = {}) {
  return QRCode.toString(text, { type: 'svg', ...DEFAULT_OPTIONS, ...options });
}
