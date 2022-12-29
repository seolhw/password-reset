import fs from 'fs'
import client from './pg.mjs'
const userPoolId = '637a5ecaad58abdadefeebcb'
const orgId = '637b50b0a2b094f9320b8c34'
const nodeId = '637b50b0042711e9212d8f8f' // org 的 nodeId
const task_id = 4

const { rows: nodeIds } = await client.query(
  `SELECT descendant_id from node_closure_table WHERE ancestor_id = '${nodeId}' and userpool_id = '${userPoolId}'`
)
console.log("🚀 ~ file: a.mjs:11 ~ nodeIds", nodeIds)

for (const { descendant_id: nodeId } of nodeIds) {
  await client.query(`
    INSERT INTO node_connections 
    ("userpool_id", "provider_type", "org_id", "node_id", "third_party_department_id", "third_party_parent_department_id", "sync_identity_provider_id", "third_party_provider_code") VALUES 
    ('${userPoolId}', 'active-directory', '${orgId}', '${nodeId}', '', '', ${task_id}, NULL);
  `)
}

client.end()

// console.log("🚀 ~ file: a.mjs ~ line 2 ~ dep", dep.length)








