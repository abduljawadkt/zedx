import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const filesToFix = [
  'src/components/overlays/CartDrawer.tsx',
  'src/components/overlays/ProductAdvisorChat.tsx',
  'src/components/overlays/SearchOverlay.tsx',
  'src/components/layout/Header.tsx',
  'src/components/home/StickyProductStory.tsx',
  'src/components/home/FinalCTA.tsx',
  'src/components/home/CategoryStrip.tsx',
  'src/components/checkout/CheckoutPage.tsx',
  'src/components/home/Hero.tsx' // Just in case any are left
];

const alphaMap = {
  '5': '0d', '10': '1a', '15': '26', '20': '33', '25': '40', '30': '4d',
  '35': '59', '40': '66', '42': '6b', '45': '73', '48': '7a', '50': '80', '55': '8c',
  '60': '99', '65': 'a6', '70': 'b3', '75': 'bf', '80': 'cc', '90': 'e6',
  '[0.02]': '05', '[0.03]': '08', '[0.035]': '09', '[0.04]': '0a',
  '[0.045]': '0b', '[0.05]': '0d', '[0.06]': '0f', '[0.08]': '14',
  '[0.1]': '1a', '[0.15]': '26', '[0.2]': '33', '[0.25]': '40'
};

filesToFix.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(/(bg|border|text)-white\/(5|10|15|20|25|30|35|40|42|45|48|50|55|60|65|70|75|80|90|\[0\.[0-9]+\])/g, (match, prefix, opacity) => {
    const hexAlpha = alphaMap[opacity];
    if (hexAlpha) {
      return `${prefix}-[\#ffffff${hexAlpha}]`;
    }
    return match;
  });

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});
