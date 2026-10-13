import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const targetDir = 'd:/pOrtfOliO/site/public/images';
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

const downloads = [
  // Fine dine / Restaurant & Cafe (6 photos)
  { id: '1h3J0JxrBcgjdnCWVBX7BaCjVTsN8xtH-', filename: 'restaurant-1.jpg' },
  { id: '1QOTo1fvk4RTw1nhwSIwGfVu4pNztIwZy', filename: 'restaurant-2.jpg' },
  { id: '12epDFDrB_tVEcGmX6drzEC0hBUIfmJSM', filename: 'restaurant-3.jpg' },
  { id: '1zSdsiWYo1Lmln1VDtHmWSgxxJLqAubE1', filename: 'restaurant-4.jpg' },
  { id: '1YsXSnlCuxQDA1OcXpD2ozNHQfJ2RmVhV', filename: 'restaurant-5.jpg' },
  { id: '1xwBvC2LVxQxWFZGfeelDoeraaDNnESuc', filename: 'restaurant-6.jpg' },

  // Clothing - Lifestyle (6 photos)
  { id: '1ug6craVKRi0MxG1ZSqGfQH4nEXCK2lGW', filename: 'lifestyle-1.jpg' },
  { id: '19PS5wpCDLpm14_XM1oN3rME55zvv5UhL', filename: 'lifestyle-2.jpg' },
  { id: '1SKf-jWdN1AbEGAh9MLBhtZSsDyE9RKJ_', filename: 'lifestyle-3.jpg' },
  { id: '1UFYoEEqbVtYpQYFpmYoFlpHLO-IWuxDX', filename: 'lifestyle-4.jpg' },
  { id: '1JACo811BkciSw1N-Z69EVInStibn73wJ', filename: 'lifestyle-5.jpg' },
  { id: '13lDtaOETABSaxlhBSiM970Am9ctK7ill', filename: 'lifestyle-6.jpg' },
];

async function downloadAndOptimize(item) {
  const destPath = path.join(targetDir, item.filename);
  console.log(`Downloading ${item.filename} (ID: ${item.id})...`);
  try {
    const url = `https://drive.google.com/uc?export=download&id=${item.id}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    if (!res.ok) {
      console.log(`Failed to fetch ${item.filename}: HTTP ${res.status}`);
      return;
    }
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Optimize with sharp
    const optimized = await sharp(buffer)
      .rotate()
      .resize({ width: 2200, height: 2200, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85, mozjpeg: true })
      .toBuffer();

    fs.writeFileSync(destPath, optimized);
    console.log(`Successfully saved ${item.filename} (${Math.round(optimized.length / 1024)} KB)`);
  } catch (err) {
    console.error(`Error processing ${item.filename}:`, err.message);
  }
}

async function run() {
  for (const item of downloads) {
    await downloadAndOptimize(item);
  }
  console.log('All downloads & optimizations complete!');
}

run();
