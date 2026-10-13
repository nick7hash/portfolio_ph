import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const targetDir = 'd:/pOrtfOliO/site/public/images';
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

const downloads = [
  // E-Commerce (6 photos)
  { id: '1DDp-9n8dt3i4uPrhq-ZUZAxd9ssbbhPd', filename: 'ecommerce-1.jpg' },
  { id: '1L7MRIAeF3kRwZadowsqSfAwC6n0boiUB', filename: 'ecommerce-2.jpg' },
  { id: '1gCCiarktEjMZRXGOuNHSFwgxdLX4uN0o', filename: 'ecommerce-3.jpg' },
  { id: '1XIoCPY44FRwk2KRuq-KXJD-QeJ0f3xk0', filename: 'ecommerce-4.jpg' },
  { id: '1zuH5yAmoeBjthuNeCI685v9KAvMzh4Wa', filename: 'ecommerce-5.jpg' },
  { id: '1j8zqs11tnuKl7f2POZRWruN4MospKzxr', filename: 'ecommerce-6.jpg' },

  // Ling's (6 photos)
  { id: '1nTrBQKdPS68ROfJbeIaIZXmXm1_VF5Bj', filename: 'ling-1.jpg' },
  { id: '1NKJYty57Jj8bvvBFot_K6BHPjRo39cHh', filename: 'ling-2.jpg' },
  { id: '1Azk_RuW-pF4RWlb0SIFsQNE7PuclvXAt', filename: 'ling-3.jpg' },
  { id: '1muGFK98oop1Zu13MQvmpQZENvhUI4YMT', filename: 'ling-4.jpg' },
  { id: '1RtUJqFqLrUS-4bZWdz1LMKJdL2dap1E-', filename: 'ling-5.jpg' },
  { id: '180gAoLkw7PttX-QRyKnWz2lZ7rZr7vns', filename: 'ling-6.jpg' },

  // Restaurant & Cafe (6 photos from the dedicated Restaurant & Cafe folder)
  { id: '1xdI4FecWZC0_XeHI9L4HyueLy7oN5woQ', filename: 'cafe-1.jpg' },
  { id: '1weRaJkdGu5fGf9ZlJAla6EJ4NgA3Mwwe', filename: 'cafe-2.jpg' },
  { id: '1d3vZjbshoHdHtJQIJHm4sriBqB7CreeW', filename: 'cafe-3.jpg' },
  { id: '1Tm0RL9qBsQaV1pG8E9-PemeNQxHLZGwb', filename: 'cafe-4.jpg' },
  { id: '133YbjPbHh-BBtt3ryvglg3Rcic9qZ7L8', filename: 'cafe-5.jpg' },
  { id: '1Ooy-zic9bI9bbniwO5u7XmDyYCnxTSPF', filename: 'cafe-6.jpg' },
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

    // Optimize with sharp: resize to max 2200px width/height, mozjpeg 85 quality
    const optimized = await sharp(buffer)
      .rotate()
      .resize({ width: 2200, height: 2200, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85, mozjpeg: true })
      .toBuffer();

    fs.writeFileSync(destPath, optimized);
    console.log(`Saved ${item.filename} (${Math.round(optimized.length / 1024)} KB)`);
  } catch (err) {
    console.error(`Error processing ${item.filename}:`, err.message);
  }
}

async function run() {
  for (const item of downloads) {
    await downloadAndOptimize(item);
  }
  console.log('Finished downloading all category images!');
}

run();
