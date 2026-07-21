import fs from "node:fs";
import path from "node:path";

const filesToFix = [
  'src/components/overlays/CartDrawer.tsx',
  'src/components/overlays/ProductAdvisorChat.tsx',
  'src/components/overlays/SearchOverlay.tsx',
  'src/components/layout/Header.tsx',
  'src/components/home/StickyProductStory.tsx',
  'src/components/home/FinalCTA.tsx',
  'src/components/home/CategoryStrip.tsx',
  'src/components/checkout/CheckoutPage.tsx',
  'src/components/home/Hero.tsx'
];

const alphaMap = {
  '30': '4d', '60': '99', '40': '66', '25': '40', '50': '80', '10': '1a', '20': '33', '70': 'b3', '80': 'cc', '90': 'e6'
};

filesToFix.forEach(file => {
  const filePath = path.join('/Users/abduljawadkt/Desktop/tech projects/client-premium-demo', file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(/(bg|border|text|shadow)-black\/(10|20|25|30|40|50|60|70|80|90)/g, (match, prefix, opacity) => {
    const hexAlpha = alphaMap[opacity];
    if (hexAlpha) {
      return `${prefix}-[\#000000${hexAlpha}]`;
    }
    return match;
  });

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});
