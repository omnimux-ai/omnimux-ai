/**
 * Generate the macOS Dock icon from a 1024 RGBA source (v1: ICC optional).
 *
 * Source constraint: build/app-icon.png must be a FULL-BLEED square with
 * SQUARE corners (produced by scripts/generate-app-icon-source-omnimux.mjs
 * from the canonical octo_ghost vector). Never feed a pre-rounded brand-kit
 * variant (`rx="280"`): this script already applies the 22.37% Apple corner
 * mask, and a rounded source would double-round and eat the Dock safe area.
 */

import { writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

/** Pixel width and height of the generated macOS icon canvas. */
export const MAC_APP_ICON_CANVAS_SIZE = 1024
/** Pixel width and height of the centered source artwork. */
export const MAC_APP_ICON_ARTWORK_SIZE = 824
/** Transparent inset on each edge of the generated macOS icon. */
export const MAC_APP_ICON_INSET = (MAC_APP_ICON_CANVAS_SIZE - MAC_APP_ICON_ARTWORK_SIZE) / 2
/**
 * Apple macOS / iOS app-icon corner radius as a fraction of the icon edge.
 * Matches the Grid / continuous-corner approximation used by icon templates (~22.37%).
 */
export const MAC_APP_ICON_CORNER_RADIUS_RATIO = 0.2237

const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const sourcePath = join(packageRoot, 'build', 'app-icon.png')
const outputPath = join(packageRoot, 'build', 'app-icon-mac.png')

/**
 * Build an SVG rounded-rect alpha mask for a square canvas.
 * @param {number} size
 * @param {number} radius
 */
export function roundedRectMaskSvg(size, radius) {
  const r = Math.max(0, Math.min(radius, size / 2))
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
      `<rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="#fff"/>` +
      `</svg>`,
  )
}

/**
 * Apply an Apple-ratio rounded-rect mask to a square RGBA PNG buffer.
 * @param {Buffer} png
 * @param {number} size
 */
export async function applyAppleIconCornerMask(png, size) {
  const radius = size * MAC_APP_ICON_CORNER_RADIUS_RATIO
  const mask = await sharp(roundedRectMaskSvg(size, radius))
    .resize(size, size)
    .ensureAlpha()
    .png()
    .toBuffer()
  return sharp(png, { failOn: 'none' })
    .ensureAlpha()
    .composite([{ input: mask, blend: 'dest-in' }])
    .png({ compressionLevel: 9 })
    .toBuffer()
}

export async function generateMacAppIconOmnimux(
  source = sourcePath,
  output = outputPath,
) {
  if (resolve(source) === resolve(output)) {
    throw new Error('generate-mac-app-icon-omnimux: output must not overwrite the source icon')
  }
  const metadata = await sharp(source).metadata()
  if (
    metadata.format !== 'png'
    || metadata.width !== MAC_APP_ICON_CANVAS_SIZE
    || metadata.height !== MAC_APP_ICON_CANVAS_SIZE
    || metadata.hasAlpha !== true
  ) {
    throw new Error(
      `generate-mac-app-icon-omnimux: source must be a ${MAC_APP_ICON_CANVAS_SIZE}x${MAC_APP_ICON_CANVAS_SIZE} RGBA PNG`,
    )
  }
  const artwork = await sharp(source, { failOn: 'none' })
    .resize({
      width: MAC_APP_ICON_ARTWORK_SIZE,
      height: MAC_APP_ICON_ARTWORK_SIZE,
      fit: 'fill',
      kernel: sharp.kernel.lanczos3,
    })
    .png()
    .toBuffer()
  const maskedArtwork = await applyAppleIconCornerMask(artwork, MAC_APP_ICON_ARTWORK_SIZE)
  const rendered = await sharp(maskedArtwork, { failOn: 'none' })
    .extend({
      top: MAC_APP_ICON_INSET,
      bottom: MAC_APP_ICON_INSET,
      left: MAC_APP_ICON_INSET,
      right: MAC_APP_ICON_INSET,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toBuffer()
  await writeFile(output, rendered)
}

const invokedPath = process.argv[1]
if (invokedPath !== undefined && resolve(invokedPath) === fileURLToPath(import.meta.url)) {
  await generateMacAppIconOmnimux()
}
