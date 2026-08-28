const { BigQuery } = require('@google-cloud/bigquery');
const bq = new BigQuery();
const DATASET = 'litetrack';

async function createTables() {
  const dataset = bq.dataset(DATASET);

  const schemas = {
    ioac_users: [
      { name: 'id', type: 'STRING', mode: 'REQUIRED' },
      { name: 'name', type: 'STRING' },
      { name: 'email', type: 'STRING' },
      { name: 'type', type: 'STRING' }, // admin, standard, service
      { name: 'roleId', type: 'STRING' },
      { name: 'status', type: 'STRING' },
      { name: 'riskScore', type: 'INTEGER' },
      { name: 'mfaEnabled', type: 'BOOLEAN' },
      { name: 'created_at', type: 'TIMESTAMP' }
    ],
    ioac_orgs: [
      { name: 'id', type: 'STRING', mode: 'REQUIRED' },
      { name: 'name', type: 'STRING' },
      { name: 'tier', type: 'STRING' }, // Enterprise, Pro, Starter
      { name: 'domain', type: 'STRING' },
      { name: 'created_at', type: 'TIMESTAMP' }
    ],
    ioac_roles: [
      { name: 'id', type: 'STRING', mode: 'REQUIRED' },
      { name: 'name', type: 'STRING' },
      { name: 'description', type: 'STRING' },
      { name: 'matrix_json', type: 'STRING' }, // JSON string of resource permissions
      { name: 'created_at', type: 'TIMESTAMP' }
    ],
    ioac_policies: [
      { name: 'id', type: 'STRING', mode: 'REQUIRED' },
      { name: 'name', type: 'STRING' },
      { name: 'description', type: 'STRING' },
      { name: 'conditions_json', type: 'STRING' },
      { name: 'actions_json', type: 'STRING' },
      { name: 'status', type: 'STRING' },
      { name: 'created_at', type: 'TIMESTAMP' }
    ]
  };

  for (const [tableName, schema] of Object.entries(schemas)) {
    const table = dataset.table(tableName);
    const [exists] = await table.exists();
    if (!exists) {
      console.log(`Creating table ${tableName}...`);
      await dataset.createTable(tableName, { schema });
      console.log(`Created ${tableName}`);
    } else {
      console.log(`Table ${tableName} already exists`);
    }
  }
}

createTables().catch(console.error);
