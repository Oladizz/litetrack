const fs = require('fs');

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/<main[^>]+>/, '');
  fs.writeFileSync(file, content);
}

fixFile('src/app/(dashboard)/finances/page.tsx');
fixFile('src/app/(dashboard)/users/page.tsx');
