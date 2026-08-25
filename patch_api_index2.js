const fs = require('fs');

let content = fs.readFileSync('api/src/index.ts', 'utf8');

// Replace the incorrect path with the correct one
content = content.replace(
  "const trackerPath = path.join(__dirname, '../../tracker/src/tracker.js');",
  "const trackerPath = path.join(__dirname, '../public/tracker.js');"
);

fs.writeFileSync('api/src/index.ts', content);
