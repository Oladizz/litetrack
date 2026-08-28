const fs = require('fs');
let code = fs.readFileSync('dashboard/src/app/(dashboard)/admin/[projectSlug]/page.tsx', 'utf8');
code = code.replace("import React, { useState } from 'react';\nimport { useParams } from 'next/navigation';\nimport React from 'react';\nimport { useParams, useSearchParams, useRouter } from 'next/navigation';", 
"import React, { useState } from 'react';\nimport { useParams, useSearchParams, useRouter } from 'next/navigation';");
fs.writeFileSync('dashboard/src/app/(dashboard)/admin/[projectSlug]/page.tsx', code);
