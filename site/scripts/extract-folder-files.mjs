async function getFolderFiles(folderId, label) {
  try {
    const url = `https://drive.google.com/drive/folders/${folderId}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const html = await res.text();
    // Look for file IDs in the page data
    // In drive pages, items usually appear in JS with their ID and filename or thumbnail
    const matches = [...html.matchAll(/"([a-zA-Z0-9_-]{28,35})"/g)].map(m => m[1]);
    const fileIds = [...new Set(matches)].filter(id => id !== folderId && !id.startsWith('AAAA') && !id.startsWith('AA2Y'));
    console.log(`=== ${label} (${folderId}) ===`);
    console.log(`Found ${fileIds.length} candidate file IDs`);
    console.log(fileIds.slice(0, 15));
    return fileIds;
  } catch (err) {
    console.error(`Error checking ${label}:`, err.message);
    return [];
  }
}

async function main() {
  const ecom = await getFolderFiles('1vsnTXmos38kSDKDpDvoLhVJYcF11X06S', 'Products - E-Commerce');
  const cafe = await getFolderFiles('1JrTgHTPmMuwvKuQwD1T7qNB1290PyqnM', 'Restaurant & Cafe');
  const ling = await getFolderFiles('1kVihyybiqxEd0oK_oWJDTqzubiOwhffH', 'Ling');
}

main();
