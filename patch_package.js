const fs = require('fs');
let content = fs.readFileSync('functions/package.json', 'utf8');
content = content.replace('"start": "node dist/index.js"', '"start": "npx @google-cloud/functions-framework --target=ingestEvent"');
fs.writeFileSync('functions/package.json', content);
