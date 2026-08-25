const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/finances/page.tsx', 'utf8');
content = content.replace(/<>/, '<div className="min-h-screen font-sans flex text-[#fafafa] bg-[#0a0a0f]">');
const lastIndex = content.lastIndexOf('</>');
if (lastIndex !== -1) {
  content = content.substring(0, lastIndex) + '</div>' + content.substring(lastIndex + 3);
}
fs.writeFileSync('src/app/(dashboard)/finances/page.tsx', content);
