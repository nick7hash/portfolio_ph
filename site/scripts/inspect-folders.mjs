async function fetchFolderData(folderId, label) {
  try {
    const url = `https://drive.google.com/drive/folders/${folderId}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const html = await res.text();
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    console.log(`\n========================================`);
    console.log(`FOLDER: ${label} (ID: ${folderId})`);
    console.log(`Title: ${titleMatch ? titleMatch[1] : 'No title'}`);

    // In Google Drive folder HTML, folder contents are serialized in JS arrays:
    // Look for names like "Ling", "Ecommerce", "Restaurant", etc.
    const nameMatches = [...html.matchAll(/\["([a-zA-Z0-9_-]{28,35})",\["([^"]+)"/g)];
    if (nameMatches.length > 0) {
      console.log(`Found named items:`);
      for (const m of nameMatches.slice(0, 30)) {
        console.log(` - ID: ${m[1]} | Name: ${m[2]}`);
      }
    }

    // Also look for any occurrence of Ling or Ecommerce or Products in the html
    const keywords = ['Ling', 'Ecommerce', 'E-Commerce', 'Cafe', 'Restaurant', 'Zomato', 'Maternity'];
    for (const kw of keywords) {
      const idx = html.indexOf(kw);
      if (idx !== -1) {
        console.log(`Found keyword "${kw}" snippet:`, html.substring(Math.max(0, idx - 80), Math.min(html.length, idx + 120)).replace(/\n/g, ' '));
      }
    }

    // General file IDs:
    const matches = [...html.matchAll(/"([a-zA-Z0-9_-]{28,35})"/g)].map(m => m[1]);
    const fileIds = [...new Set(matches)].filter(id => id !== folderId && !id.startsWith('AAAA') && !id.startsWith('AA2Y'));
    console.log(`Total candidate IDs: ${fileIds.length}`);
    return fileIds;
  } catch (err) {
    console.error(`Error with ${label}:`, err.message);
    return [];
  }
}

async function main() {
  await fetchFolderData('1qAC5hy4_r4tW1Lwhx5rj-BWf6c9jHCta', 'Root Website Folder');
  await fetchFolderData('1vsnTXmos38kSDKDpDvoLhVJYcF11X06S', 'Products Folder');
}

main();
