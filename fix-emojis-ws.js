const fs = require('fs');
let code = fs.readFileSync('dashboard/src/components/workspace-engine/index.tsx', 'utf8');

const EMOJI_MAP = {
  '🧠': 'Brain',
  '🕐': 'Clock',
  '🔮': 'Orbit',
  '📝': 'FileText',
  '🔐': 'Lock',
  '🔍': 'Search',
  '👑': 'Crown',
  '📋': 'ClipboardList',
  '📄': 'File',
  '📁': 'Folder',
};

for (const [emoji, name] of Object.entries(EMOJI_MAP)) {
  const re = new RegExp(emoji, 'g');
  code = code.replace(re, name); 
}

fs.writeFileSync('dashboard/src/components/workspace-engine/index.tsx', code);
