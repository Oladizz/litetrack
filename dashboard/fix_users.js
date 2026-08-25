const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/users/page.tsx', 'utf8');
const lastIndex = content.lastIndexOf('</>');
if (lastIndex !== -1) {
  content = content.substring(0, lastIndex) + '</div>' + content.substring(lastIndex + 3);
}
fs.writeFileSync('src/app/(dashboard)/users/page.tsx', content);
