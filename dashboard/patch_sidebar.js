const fs = require('fs');
const content = fs.readFileSync('src/components/ui/sidebar.tsx', 'utf8');

const importReplacement = `import { 
  LogOut, LayoutDashboard, Activity, Settings, ChevronDown, ChevronUp, BookOpen, MessageSquare, Plus, Check, Search, 
  Sparkles, Calendar, Clock, Filter, Lock, Maximize2, LineChart as LineChartIcon, Map as MapIcon, Link as LinkIcon, DollarSign,
  Monitor, Globe, Shield, CreditCard, FileText, Briefcase
} from 'lucide-react';`;

let newContent = content.replace(/import {[^}]+} from 'lucide-react';/, importReplacement);

const activeSiteLogic = `
  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname.startsWith(path);
  };

  const activeSite = sites.find(s => s.site_id === state.project);
  const template = activeSite?.template || 'saas';
`;
newContent = newContent.replace(/  const isActive = \([\s\S]*?  \};/, activeSiteLogic);

const oldLinks = `              <Link href="/data-manager/users" className={\`w-full flex items-center gap-2 px-2 py-1.5 text-[13px] font-medium rounded transition-colors \${isActive('/data-manager/users') ? 'bg-[#262626] text-white' : 'text-[#a6a6a6] hover:text-white hover:bg-[#262626]/50'}\`}>
                <Users className="w-4 h-4" /> Users
              </Link>
              <Link href="/data-manager/products" className={\`w-full flex items-center gap-2 px-2 py-1.5 text-[13px] font-medium rounded transition-colors \${isActive('/data-manager/products') ? 'bg-[#262626] text-white' : 'text-[#a6a6a6] hover:text-white hover:bg-[#262626]/50'}\`}>
                <Database className="w-4 h-4" /> Data & Collections
              </Link>
              <Link href="/data-manager/orders" className={\`w-full flex items-center gap-2 px-2 py-1.5 text-[13px] font-medium rounded transition-colors \${isActive('/data-manager/orders') ? 'bg-[#262626] text-white' : 'text-[#a6a6a6] hover:text-white hover:bg-[#262626]/50'}\`}>
                <ShoppingCart className="w-4 h-4" /> Transactions
              </Link>`;

const newLinks = `              
              {template === 'saas' && (
                <>
                  <Link href="/data-manager/users" className={\`w-full flex items-center gap-2 px-2 py-1.5 text-[13px] font-medium rounded transition-colors \${isActive('/data-manager/users') ? 'bg-[#262626] text-white' : 'text-[#a6a6a6] hover:text-white hover:bg-[#262626]/50'}\`}>
                    <Users className="w-4 h-4" /> Users
                  </Link>
                  <Link href="/data-manager/subscriptions" className={\`w-full flex items-center gap-2 px-2 py-1.5 text-[13px] font-medium rounded transition-colors \${isActive('/data-manager/subscriptions') ? 'bg-[#262626] text-white' : 'text-[#a6a6a6] hover:text-white hover:bg-[#262626]/50'}\`}>
                    <CreditCard className="w-4 h-4" /> Subscriptions
                  </Link>
                </>
              )}

              {template === 'ecommerce' && (
                <>
                  <Link href="/data-manager/products" className={\`w-full flex items-center gap-2 px-2 py-1.5 text-[13px] font-medium rounded transition-colors \${isActive('/data-manager/products') ? 'bg-[#262626] text-white' : 'text-[#a6a6a6] hover:text-white hover:bg-[#262626]/50'}\`}>
                    <Database className="w-4 h-4" /> Inventory
                  </Link>
                  <Link href="/data-manager/orders" className={\`w-full flex items-center gap-2 px-2 py-1.5 text-[13px] font-medium rounded transition-colors \${isActive('/data-manager/orders') ? 'bg-[#262626] text-white' : 'text-[#a6a6a6] hover:text-white hover:bg-[#262626]/50'}\`}>
                    <ShoppingCart className="w-4 h-4" /> Transactions
                  </Link>
                  <Link href="/data-manager/customers" className={\`w-full flex items-center gap-2 px-2 py-1.5 text-[13px] font-medium rounded transition-colors \${isActive('/data-manager/customers') ? 'bg-[#262626] text-white' : 'text-[#a6a6a6] hover:text-white hover:bg-[#262626]/50'}\`}>
                    <Users className="w-4 h-4" /> Customers
                  </Link>
                </>
              )}

              {template === 'blog' && (
                <>
                  <Link href="/data-manager/posts" className={\`w-full flex items-center gap-2 px-2 py-1.5 text-[13px] font-medium rounded transition-colors \${isActive('/data-manager/posts') ? 'bg-[#262626] text-white' : 'text-[#a6a6a6] hover:text-white hover:bg-[#262626]/50'}\`}>
                    <FileText className="w-4 h-4" /> Posts
                  </Link>
                  <Link href="/data-manager/comments" className={\`w-full flex items-center gap-2 px-2 py-1.5 text-[13px] font-medium rounded transition-colors \${isActive('/data-manager/comments') ? 'bg-[#262626] text-white' : 'text-[#a6a6a6] hover:text-white hover:bg-[#262626]/50'}\`}>
                    <MessageSquare className="w-4 h-4" /> Comments
                  </Link>
                  <Link href="/data-manager/subscribers" className={\`w-full flex items-center gap-2 px-2 py-1.5 text-[13px] font-medium rounded transition-colors \${isActive('/data-manager/subscribers') ? 'bg-[#262626] text-white' : 'text-[#a6a6a6] hover:text-white hover:bg-[#262626]/50'}\`}>
                    <Users className="w-4 h-4" /> Subscribers
                  </Link>
                </>
              )}

              {template === 'portfolio' && (
                <>
                  <Link href="/data-manager/projects" className={\`w-full flex items-center gap-2 px-2 py-1.5 text-[13px] font-medium rounded transition-colors \${isActive('/data-manager/projects') ? 'bg-[#262626] text-white' : 'text-[#a6a6a6] hover:text-white hover:bg-[#262626]/50'}\`}>
                    <Briefcase className="w-4 h-4" /> Projects
                  </Link>
                  <Link href="/data-manager/messages" className={\`w-full flex items-center gap-2 px-2 py-1.5 text-[13px] font-medium rounded transition-colors \${isActive('/data-manager/messages') ? 'bg-[#262626] text-white' : 'text-[#a6a6a6] hover:text-white hover:bg-[#262626]/50'}\`}>
                    <MessageSquare className="w-4 h-4" /> Messages
                  </Link>
                </>
              )}
`;

newContent = newContent.replace(oldLinks, newLinks);
fs.writeFileSync('src/components/ui/sidebar.tsx', newContent);
console.log("Patched Sidebar!");
