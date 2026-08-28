import { BigQuery } from '@google-cloud/bigquery';

const bq = new BigQuery();
const DATASET = 'litetrack';

// --- Identities (Users) ---
export async function getIdentities() {
  const query = `SELECT * FROM \`${DATASET}.ioac_users\` ORDER BY created_at DESC`;
  const [rows] = await bq.query({ query });
  return rows;
}

export async function createIdentity(user: any) {
  const query = `
    INSERT INTO \`${DATASET}.ioac_users\` 
    (id, name, email, type, roleId, status, riskScore, mfaEnabled, created_at)
    VALUES (@id, @name, @email, @type, @roleId, @status, @riskScore, @mfaEnabled, CURRENT_TIMESTAMP())
  `;
  await bq.query({ query, params: user });
  return true;
}

// --- Organizations & Workspaces ---
export async function getOrgs() {
  const query = `SELECT * FROM \`${DATASET}.ioac_orgs\` ORDER BY created_at DESC`;
  const [rows] = await bq.query({ query });
  return rows;
}

export async function createOrg(org: any) {
  const query = `
    INSERT INTO \`${DATASET}.ioac_orgs\` 
    (id, name, tier, domain, created_at)
    VALUES (@id, @name, @tier, @domain, CURRENT_TIMESTAMP())
  `;
  await bq.query({ query, params: org });
  return true;
}

// --- Roles ---
export async function getRoles() {
  const query = `SELECT * FROM \`${DATASET}.ioac_roles\` ORDER BY created_at DESC`;
  const [rows] = await bq.query({ query });
  return rows;
}

export async function createRole(role: any) {
  const query = `
    INSERT INTO \`${DATASET}.ioac_roles\` 
    (id, name, description, matrix_json, created_at)
    VALUES (@id, @name, @description, @matrix_json, CURRENT_TIMESTAMP())
  `;
  await bq.query({ query, params: role });
  return true;
}

export async function updateRoleMatrix(id: string, matrix_json: string) {
  const query = `
    UPDATE \`${DATASET}.ioac_roles\` 
    SET matrix_json = @matrix_json
    WHERE id = @id
  `;
  await bq.query({ query, params: { id, matrix_json } });
  return true;
}

// --- Policies ---
export async function getPolicies() {
  const query = `SELECT * FROM \`${DATASET}.ioac_policies\` ORDER BY created_at DESC`;
  const [rows] = await bq.query({ query });
  return rows;
}

export async function createPolicy(policy: any) {
  const query = `
    INSERT INTO \`${DATASET}.ioac_policies\` 
    (id, name, description, conditions_json, actions_json, status, created_at)
    VALUES (@id, @name, @description, @conditions_json, @actions_json, @status, CURRENT_TIMESTAMP())
  `;
  await bq.query({ query, params: policy });
  return true;
}

export async function updatePolicyStatus(id: string, status: string) {
  const query = `
    UPDATE \`${DATASET}.ioac_policies\` 
    SET status = @status
    WHERE id = @id
  `;
  await bq.query({ query, params: { id, status } });
  return true;
}

// --- Workspaces ---
export async function getWorkspaces() {
  const query = `SELECT * FROM \`${DATASET}.ioac_workspaces\` ORDER BY created_at DESC`;
  const [rows] = await bq.query({ query });
  return rows;
}

export async function createWorkspace(ws: any) {
  const query = `
    INSERT INTO \`${DATASET}.ioac_workspaces\` 
    (id, name, category, allowedRoles, created_at)
    VALUES (@id, @name, @category, PARSE_JSON(@allowedRoles), CURRENT_TIMESTAMP())
  `;
  await bq.query({ query, params: ws });
  return true;
}

// --- Teams ---
export async function getTeams() {
  const query = `SELECT * FROM \`${DATASET}.ioac_teams\` ORDER BY created_at DESC`;
  const [rows] = await bq.query({ query });
  return rows;
}

export async function createTeam(team: any) {
  const query = `
    INSERT INTO \`${DATASET}.ioac_teams\` 
    (id, name, workspaceId, created_at)
    VALUES (@id, @name, @workspaceId, CURRENT_TIMESTAMP())
  `;
  await bq.query({ query, params: team });
  return true;
}
// --- Agents ---
export async function getAgents() {
  const query = `SELECT * FROM \`${DATASET}.ioac_agents\` ORDER BY created_at DESC`;
  const [rows] = await bq.query({ query });
  return rows;
}

export async function createAgent(agent: any) {
  const query = `
    INSERT INTO \`${DATASET}.ioac_agents\` 
    (id, name, description, spendingLimit, requiresApproval, canReadData, canUseTools, restrictedApps, created_at)
    VALUES (@id, @name, @description, @spendingLimit, @requiresApproval, PARSE_JSON(@canReadData), PARSE_JSON(@canUseTools), PARSE_JSON(@restrictedApps), CURRENT_TIMESTAMP())
  `;
  await bq.query({ query, params: agent });
  return true;
}

// --- Auth Settings ---
export async function getAuthSettings() {
  const query = `SELECT * FROM \`${DATASET}.ioac_auth_settings\` LIMIT 1`;
  const [rows] = await bq.query({ query });
  return rows[0] || null;
}

export async function saveAuthSettings(settings: any) {
  const query = `
    MERGE \`${DATASET}.ioac_auth_settings\` T
    USING (SELECT 'global' as id) S
    ON T.id = S.id
    WHEN MATCHED THEN
      UPDATE SET mfaEnforced = @mfaEnforced, ssoEnabled = @ssoEnabled, passwordExpiry = @passwordExpiry, updated_at = CURRENT_TIMESTAMP()
    WHEN NOT MATCHED THEN
      INSERT (id, mfaEnforced, ssoEnabled, passwordExpiry, updated_at)
      VALUES ('global', @mfaEnforced, @ssoEnabled, @passwordExpiry, CURRENT_TIMESTAMP())
  `;
  await bq.query({ query, params: settings });
  return true;
}

// --- Temp Grants ---
export async function getTempGrants() {
  const query = `SELECT * FROM \`${DATASET}.ioac_temp_grants\` ORDER BY grantedAt DESC`;
  const [rows] = await bq.query({ query });
  return rows;
}

export async function createTempGrant(grant: any) {
  const query = `
    INSERT INTO \`${DATASET}.ioac_temp_grants\` 
    (id, user_email, role_name, resource, grantedAt, expiresAt, status)
    VALUES (@id, @user_email, @role_name, @resource, CURRENT_TIMESTAMP(), TIMESTAMP_ADD(CURRENT_TIMESTAMP(), INTERVAL CAST(@days AS INT64) DAY), 'active')
  `;
  await bq.query({ query, params: grant });
  return true;
}

export async function revokeTempGrant(id: string) {
  const query = `UPDATE \`${DATASET}.ioac_temp_grants\` SET status = 'revoked' WHERE id = @id`;
  await bq.query({ query, params: { id } });
  return true;
}

// --- Audit Logs ---
export async function getAuditLogs() {
  const query = `SELECT * FROM \`${DATASET}.ioac_audit_logs\` ORDER BY event_timestamp DESC LIMIT 100`;
  const [rows] = await bq.query({ query });
  return rows;
}

export async function logAuditAction(log: any) {
  const query = `
    INSERT INTO \`${DATASET}.ioac_audit_logs\` 
    (id, event_timestamp, actor, action, target, ip, status)
    VALUES (@id, CURRENT_TIMESTAMP(), @actor, @action, @target, @ip, @status)
  `;
  await bq.query({ query, params: log });
  return true;
}
