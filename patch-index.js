const fs = require('fs');
let code = fs.readFileSync('api/src/index.ts', 'utf8');
code = code.replace(
  "import { listCollection, createDocument, updateDocument, deleteDocument } from './project-admin-proxy';",
  "import { listCollection, createDocument, updateDocument, deleteDocument, getDocument } from './project-admin-proxy';"
);

const newRoute = `// GET a single document
app.get('/api/project-admin/:projectId/:collection/:docId', async (c) => {
  try {
    const projectId = c.req.param('projectId');
    const collection = c.req.param('collection');
    const docId = c.req.param('docId');
    const databaseId = c.req.query('databaseId') || undefined;
    const doc = await getDocument(projectId, collection, docId, databaseId);
    if (!doc) return c.json({ error: 'Document not found' }, 404);
    return c.json({ data: doc });
  } catch (error: any) {
    console.error(\`Project Admin GET doc error:\`, error);
    return c.json({ error: error.message }, 500);
  }
});

app.post('/api/project-admin/:projectId/:collection',`;

code = code.replace("app.post('/api/project-admin/:projectId/:collection',", newRoute);

fs.writeFileSync('api/src/index.ts', code);
