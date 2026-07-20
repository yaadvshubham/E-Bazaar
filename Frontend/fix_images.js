const fs = require('fs');
let script = fs.readFileSync('Frontend/js/script.js', 'utf8');

// Find the MASTER_PRODUCTS array
const startPattern = 'const MASTER_PRODUCTS = [';
const startIdx = script.indexOf(startPattern);
if (startIdx === -1) {
  console.log('MASTER_PRODUCTS not found');
  process.exit(1);
}

const endPattern = '];\n';
let endIdx = script.indexOf(endPattern, startIdx);
if (endIdx === -1) {
    endIdx = script.indexOf('];\r\n', startIdx);
}

if (endIdx === -1) {
  console.log('End of MASTER_PRODUCTS not found');
  process.exit(1);
}

// Extract the array content
let arrayStr = script.substring(startIdx + 'const MASTER_PRODUCTS = '.length, endIdx + 1);

try {
  let arr = JSON.parse(arrayStr);
  
  // Valid URLs
  const phoneURLs = [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=800&auto=format&fit=crop&q=80'
  ];
  
  const laptopURLs = [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80'
  ];
  
  const watchURLs = [
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80'
  ];
  
  const gogglesURL = 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&auto=format&fit=crop&q=80';
  
  // Apply valid URLs to my custom products
  let pIdx = 0;
  let lIdx = 0;
  let wIdx = 0;
  
  arr = arr.map(p => {
      if (p.id.toString().startsWith('custom_')) {
          if (p.title.includes('Goggles') || p.title.includes('Vision Pro') || p.title.includes('PlayStation')) {
              p.image = gogglesURL; // Just using VR goggles for PS6 too
          }
          else if (p.category === 'laptops') {
              p.image = laptopURLs[lIdx % laptopURLs.length];
              lIdx++;
          }
          else if (p.category === 'smartphones') {
              p.image = phoneURLs[pIdx % phoneURLs.length];
              pIdx++;
          }
          else if (p.category === 'gadgets') {
              p.image = watchURLs[wIdx % watchURLs.length];
              wIdx++;
          }
      }
      return p;
  });
  
  const newScript = script.substring(0, startIdx) + 'const MASTER_PRODUCTS = ' + JSON.stringify(arr, null, 2) + script.substring(endIdx + 1);
  fs.writeFileSync('Frontend/js/script.js', newScript);
  console.log('Successfully fixed image URLs.');
  
} catch (e) {
  console.error('Failed to parse or inject JSON:', e);
}
