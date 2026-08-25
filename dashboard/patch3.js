const fs = require('fs');
const content = fs.readFileSync('src/app/page.tsx', 'utf8');

const startTag = '<div className="p-6 max-w-[1600px] mx-auto space-y-8">';
const startIndex = content.indexOf(startTag);

if (startIndex === -1) {
  console.log("Not found");
  process.exit(1);
}

const beforeContent = content.substring(0, startIndex + startTag.length);
const afterContent = content.substring(startIndex + startTag.length);

const adminUIPatch = `
          {adminViewMode === 'admin' ? (
            <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-6 h-[50vh] animate-in fade-in slide-in-from-bottom-2 duration-300 mt-8">
              <div className="w-16 h-16 bg-[#2266ec]/10 border border-[#2266ec]/20 rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-[#2266ec]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Site Admin Panel</h2>
                <p className="text-[#a6a6a6] max-w-md mx-auto text-sm">
                  Full site administration, user management, and database operations have been moved to the dedicated Data Manager.
                </p>
              </div>
              <div className="flex items-center gap-4 pt-4">
                <Link href="/data-manager/users" className="bg-[#2266ec] hover:bg-[#1d57cc] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                  <Users className="w-4 h-4" /> Manage Users
                </Link>
                <Link href="/settings" className="bg-[#262626] hover:bg-[#333] border border-[#404040] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                  <Settings className="w-4 h-4" /> Site Settings
                </Link>
              </div>
            </div>
          ) : (
            <>
`;

const endTarget = '        </div>\n        <SlidePanel';
const endTargetIndex = afterContent.indexOf(endTarget);
const innerContent = afterContent.substring(0, endTargetIndex);
const remainingContent = afterContent.substring(endTargetIndex);

const newContent = beforeContent + adminUIPatch + innerContent + "            </>\n          )}\n" + remainingContent;

fs.writeFileSync('src/app/page.tsx', newContent);
console.log("Patched 3!");
