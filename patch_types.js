const fs = require('fs');
let code = fs.readFileSync('dashboard/src/components/ioac/types.ts', 'utf8');
code = "import React from 'react';\n" + code;
code = code.replace("icon: string;", "icon: React.ReactNode;");
fs.writeFileSync('dashboard/src/components/ioac/types.ts', code);
