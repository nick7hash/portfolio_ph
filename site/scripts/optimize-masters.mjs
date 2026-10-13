import sharp from 'sharp';
import fs from 'fs';

async function optimizeMasters() {
  console.log('Optimizing first_header_image.png...');
  await sharp('d:/pOrtfOliO/asset/first_header_image.png')
    .resize({ width: 2560, fit: 'inside', withoutEnlargement: true })
    .png({ quality: 85, compressionLevel: 8 })
    .toFile('d:/pOrtfOliO/site/public/images/hero.png');

  console.log('Optimizing about_me_image.png...');
  await sharp('d:/pOrtfOliO/asset/about_me_image.png')
    .resize({ width: 2560, fit: 'inside', withoutEnlargement: true })
    .png({ quality: 85, compressionLevel: 8 })
    .toFile('d:/pOrtfOliO/site/public/images/about.png');

  console.log('Hero size:', Math.round(fs.statSync('d:/pOrtfOliO/site/public/images/hero.png').size / 1024), 'KB');
  console.log('About size:', Math.round(fs.statSync('d:/pOrtfOliO/site/public/images/about.png').size / 1024), 'KB');
}

optimizeMasters();
