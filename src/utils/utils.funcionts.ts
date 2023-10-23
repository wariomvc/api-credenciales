import PDFFont from 'pdf-lib/cjs/api/PDFFont';

import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import AdmZip from 'adm-zip';

export function fCurrency(num: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
}

export const wrapText = (text: string, width: number, font: PDFFont, fontSize: number) => {
  const words = text.split(' ');
  let line = '';
  let result = '';
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);
    if (testWidth > width) {
      result += line + '\n';
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  result += line;
  return result;
};

export const verifyOrCreateDir = async (dir: string) => {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
};
