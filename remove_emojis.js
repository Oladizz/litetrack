const fs = require('fs');
const path = require('path');

const dir = 'dashboard/src/components/ioac/';
const files = fs.readdirSync(dir);

const emojiMap = {
  '👤': '<User className="w-4 h-4" />',
  '👥': '<Users className="w-4 h-4" />',
  '👑': '<Crown className="w-4 h-4" />',
  '🔑': '<Key className="w-4 h-4" />',
  '⚡': '<Zap className="w-4 h-4" />',
  '🤖': '<Bot className="w-4 h-4" />',
  '⭐': '<Star className="w-4 h-4" />',
};

files.forEach(file => {
  if (file.endsWith('.tsx') || file.endsWith('.ts')) {
    const fullPath = path.join(dir, file);
    let code = fs.readFileSync(fullPath, 'utf8');
    
    // Add Crown, Zap, Star to lucide-react imports if missing
    let hasChanges = false;
    
    // replace emojis in strings or jsx
    for (const [emoji, icon] of Object.entries(emojiMap)) {
      if (code.includes(emoji)) {
        hasChanges = true;
        // In some places they are inside strings, in others inside JSX
        // For identity-manager: icon: '👤' -> icon: <User className="w-4 h-4" />
        code = code.replace(new RegExp(\`'\\s*\${emoji}\\s*'\`, 'g'), icon);
        code = code.replace(new RegExp(\`"\\s*\${emoji}\\s*"\`, 'g'), icon);
        code = code.replace(new RegExp(emoji, 'g'), '');
      }
    }
    
    if (hasChanges) {
      if (!code.includes('Crown')) {
        code = code.replace(/import \{([^}]+)\} from 'lucide-react';/, "import { $1, Crown, Zap, Star, User, Users, Key, Bot } from 'lucide-react';");
      }
      fs.writeFileSync(fullPath, code);
      console.log('Updated', file);
    }
  }
});
