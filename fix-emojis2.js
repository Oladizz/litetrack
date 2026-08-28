const fs = require('fs');

const EMOJI_MAP = {
  '📱': 'Smartphone',
  '🏢': 'Building',
  '👤': 'User',
  '🤖': 'Bot',
  '⚡': 'Zap',
  '📊': 'BarChart2',
  '🟢': 'CheckCircle',
  '⚙️': 'Settings',
  '🎓': 'GraduationCap',
  '🤝': 'Handshake',
  '📦': 'Package',
  '🔧': 'Wrench',
  '⛓️': 'Link2',
  '💬': 'MessageSquare',
  '💰': 'CircleDollarSign',
  '🎧': 'Headphones',
  '💻': 'Laptop',
  '📢': 'Megaphone',
  '🔒': 'Lock',
  '💼': 'Briefcase',
  '📚': 'BookOpen',
  '🔑': 'Key',
  '🚧': 'Construction',
  '💳': 'CreditCard',
  '⏸️': 'PauseCircle',
  '🗄️': 'Database',
  '☁️': 'Cloud',
  '🔌': 'Plug',
  '🌐': 'Globe',
  '🛠️': 'Tool',
  '📈': 'TrendingUp',
  '⚠️': 'AlertTriangle',
  '🔴': 'AlertCircle',
  '🛡️': 'Shield',
  '✅': 'CheckCircle2',
  '🖥️': 'Monitor',
  '🗂️': 'Folders',
};

const DATA_FILES = [
  'dashboard/src/components/enterprise-control/index.tsx',
  'dashboard/src/components/enterprise-control/digital-twin.tsx',
  'dashboard/src/components/workspace-engine/index.tsx',
  'dashboard/src/components/workspace-engine/active-canvas.tsx',
];

for (const path of DATA_FILES) {
  if (!fs.existsSync(path)) continue;
  let code = fs.readFileSync(path, 'utf8');
  for (const [emoji, name] of Object.entries(EMOJI_MAP)) {
    // Only replace within single quotes or in string literals to avoid accidental replacements in code (though emojis are rare)
    const re = new RegExp(emoji, 'g');
    code = code.replace(re, name); 
  }
  fs.writeFileSync(path, code);
}
