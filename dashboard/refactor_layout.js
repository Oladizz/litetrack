const fs = require('fs');

const { execSync } = require('child_process');
const files = execSync('grep -rl "<Sidebar" src/app/').toString().trim().split('\n');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace imports
  if (!content.includes('DashboardLayout')) {
    content = content.replace(/import \{ Sidebar \} from '[^']+';/, "import { DashboardLayout } from '@/components/ui/dashboard-layout';");
  }
  
  // Replace the layout wrappers
  content = content.replace(/<div className="min-h-screen[^>]+>[\s\S]*?<Sidebar \/>[\s\S]*?<main[^>]+>/, '<DashboardLayout>');
  content = content.replace(/<\/main>[\s\S]*?<\/div>/, '</DashboardLayout>');
  
  fs.writeFileSync(file, content);
  console.log('Refactored:', file);
});
