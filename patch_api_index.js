const fs = require('fs');

let content = fs.readFileSync('api/src/index.ts', 'utf8');

const serveTracker = `
app.get('/tracker.js', async (c) => {
  const fs = require('fs');
  const path = require('path');
  try {
    const trackerPath = path.join(__dirname, '../../tracker/src/tracker.js');
    const trackerCode = fs.readFileSync(trackerPath, 'utf8');
    return c.text(trackerCode, 200, {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=3600'
    });
  } catch (e) {
    return c.text('Not found', 404);
  }
});
`;

// Insert it right before "const port = process.env.PORT"
content = content.replace('const port = process.env.PORT', serveTracker + '\nconst port = process.env.PORT');

fs.writeFileSync('api/src/index.ts', content);
