import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = 'd:/pOrtfOliO/site/public';
const imagesDir = path.join(publicDir, 'images');
const backupDir = path.join(publicDir, 'raw-backup');

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Backup originals first if not already backed up
const files = fs.readdirSync(imagesDir);
for (const file of files) {
  const src = path.join(imagesDir, file);
  const dest = path.join(backupDir, file);
  if (!fs.existsSync(dest) && fs.statSync(src).isFile()) {
    fs.copyFileSync(src, dest);
  }
}

// Optimize logo if in public
const logoSrc = path.join(publicDir, 'logo.png');
const logoBackup = path.join(backupDir, 'logo-original.png');
if (fs.existsSync(logoSrc)) {
  if (!fs.existsSync(logoBackup)) {
    fs.copyFileSync(logoSrc, logoBackup);
  }
  // Resize logo to max 500px, crisp png
  const logoBuffer = await sharp(logoBackup)
    .resize(500, 500, { fit: 'inside', withoutEnlargement: true })
    .png({ quality: 90, compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(logoSrc, logoBuffer);
  console.log('Optimized logo.png:', Math.round(logoBuffer.length / 1024), 'KB');
}

// Optimize images in imagesDir
for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  const baseName = path.basename(file, ext);
  const rawFile = path.join(backupDir, file);
  const targetFile = path.join(imagesDir, file);

  if (!fs.existsSync(rawFile) || !fs.statSync(rawFile).isFile()) continue;

  try {
    let pipeline = sharp(rawFile).rotate(); // auto-orient
    const metadata = await pipeline.metadata();

    // Resize to max 2400px width/height for retina 4K clarity
    pipeline = pipeline.resize({
      width: Math.min(metadata.width || 2400, 2400),
      height: Math.min(metadata.height || 2400, 2400),
      fit: 'inside',
      withoutEnlargement: true,
    });

    if (ext === '.png') {
      await pipeline.png({ quality: 85, compressionLevel: 8 }).toFile(targetFile + '.tmp');
    } else {
      await pipeline.jpeg({ quality: 85, mozjpeg: true }).toFile(targetFile + '.tmp');
    }

    // Replace original in imagesDir
    fs.renameSync(targetFile + '.tmp', targetFile);
    const newSize = Math.round(fs.statSync(targetFile).size / 1024);
    console.log(`Optimized ${file}: ${newSize} KB`);
  } catch (err) {
    console.error(`Failed to optimize ${file}:`, err.message);
  }
}

console.log('Image optimization complete!');
