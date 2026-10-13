import sharp from 'sharp';

const input = 'C:/Users/nikhi/.gemini/antigravity-ide/brain/5d79e87b-0a63-49df-b95e-813a9b46328d/google_drive_inventory_1791821249979.webp';
const meta = await sharp(input, { animated: true }).metadata();
console.log('Pages:', meta.pages);

// Extract first frame
await sharp(input, { page: 0 }).png().toFile('C:/Users/nikhi/.gemini/antigravity-ide/brain/5d79e87b-0a63-49df-b95e-813a9b46328d/gdrive_first_frame.png');
// Extract middle frame
if (meta.pages > 5) {
  await sharp(input, { page: Math.floor(meta.pages / 2) }).png().toFile('C:/Users/nikhi/.gemini/antigravity-ide/brain/5d79e87b-0a63-49df-b95e-813a9b46328d/gdrive_mid_frame.png');
}
console.log('Extracted frames successfully');
