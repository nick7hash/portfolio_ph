async function checkFolder(folderId) {
  try {
    const url = `https://drive.google.com/drive/folders/${folderId}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const html = await res.text();
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    console.log(`=== ID: ${folderId} ===`);
    console.log('Title:', titleMatch ? titleMatch[1] : 'No title');
    const matches = [...html.matchAll(/"([a-zA-Z0-9_-]{28,35})"/g)].map(m => m[1]);
    const fileIds = [...new Set(matches)].filter(id => id !== folderId && !id.startsWith('AAAA') && !id.startsWith('AA2Y'));
    console.log(`Found ${fileIds.length} candidate file IDs`);
    console.log(fileIds.slice(0, 5));
  } catch (err) {
    console.error(`Error checking ${folderId}:`, err.message);
  }
}

async function main() {
  await checkFolder('1-4S7LHxIjHUo1oaghS4KtvGtvOFqCjEt');
  await checkFolder('1v3DD814fWlyDG0-pUD2Y8RaNDmqdiWZg');
}

main();
