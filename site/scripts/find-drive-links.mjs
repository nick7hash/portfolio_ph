import fs from 'fs';

const files = ['temp_edge_history', 'temp_chrome_history', 'temp_brave_history'];
for (const file of files) {
  const filepath = `d:/pOrtfOliO/${file}`;
  if (!fs.existsSync(filepath)) continue;
  console.log(`Checking ${file}...`);
  const buf = fs.readFileSync(filepath, 'utf8');
  const matches = [...buf.matchAll(/https:\/\/drive\.google\.com\/drive\/folders\/([a-zA-Z0-9_-]+)/g)];
  const ids = [...new Set(matches.map(m => m[1]))];
  console.log(`Found ${ids.length} folder IDs in ${file}:`, ids);
  
  // Also search for "Ling" or "Ecommerce" or "Products" around drive links
  const textMatches = [...buf.matchAll(/.{0,50}(?:Ling|Ecommerce|E-Commerce|Restaurant|Website|drive\.google\.com\/drive\/u\/[0-9]\/folders\/[a-zA-Z0-9_-]+).{0,50}/gi)];
  console.log(`Text matches in ${file}:`, textMatches.slice(0, 10).map(m => m[0]));
}
