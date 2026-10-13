async function checkFolder(folderId, label) {
  try {
    const url = `https://drive.google.com/drive/folders/${folderId}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const html = await res.text();
    // Look for file IDs in the page data
    const matches = [...html.matchAll(/"([a-zA-Z0-9_-]{28,35})"/g)].map(m => m[1]);
    const fileIds = [...new Set(matches)].filter(id => id !== folderId && !id.startsWith('AAAA') && !id.startsWith('AA2Y'));
    console.log(`=== ${label} (${folderId}) ===`);
    console.log(`Found ${fileIds.length} candidate file IDs`);
    console.log(fileIds.slice(0, 10));
    return fileIds;
  } catch (err) {
    console.error(`Error checking ${label}:`, err.message);
    return [];
  }
}

async function main() {
  await checkFolder('1YPCMOleepYW-T1T3PgKzCCc-mcbWGdg4', 'Clothing - Lifestyle');
  await checkFolder('1AGugHSmWTWzZkeD1yxvES1qtRIu0AVJS', 'Fine dine');
  await checkFolder('1yt86RxxlcuQcs5_straZiABGyd8woGYO', 'Maternity');
}

main();
