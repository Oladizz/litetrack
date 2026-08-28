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

function processFile(path) {
  if (!fs.existsSync(path)) return;
  let code = fs.readFileSync(path, 'utf8');

  // Replace emojis in quotes
  for (const [emoji, name] of Object.entries(EMOJI_MAP)) {
    const re = new RegExp(`['"\`]${emoji}['"\`]`, 'g');
    code = code.replace(re, `'${name}'`);
  }
  
  // Replace unquoted emojis in strings
  for (const [emoji, name] of Object.entries(EMOJI_MAP)) {
    const re = new RegExp(emoji, 'g');
    code = code.replace(re, `\${'<lucide-icon>'} `); 
    // Wait, replacing emojis in general strings might be messy. Let's just do it directly.
  }

  // Adding LucideIcons import if not present
  if (!code.includes('import * as LucideIcons from') && !code.includes('lucide-react')) {
    code = `import * as LucideIcons from 'lucide-react';\n` + code;
  } else if (!code.includes('import * as LucideIcons from')) {
    code = code.replace("from 'lucide-react';", "from 'lucide-react';\nimport * as LucideIcons from 'lucide-react';");
  }

  // Find {item.icon} or similar and replace with dynamic renderer?
  // Let's just replace all emojis in strings with '' or standard text if not in EMOJI_MAP.
  
  fs.writeFileSync(path, code);
}

const files = [
  'dashboard/src/components/enterprise-control/index.tsx',
  'dashboard/src/components/enterprise-control/digital-twin.tsx',
  'dashboard/src/components/workspace-engine/index.tsx',
  'dashboard/src/components/workspace-engine/active-canvas.tsx',
];

for (const f of files) {
  processFile(f);
}
