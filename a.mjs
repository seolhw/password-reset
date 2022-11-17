import fs from 'fs'
import client from './pg.mjs'
const userPoolId = '636c93ad62034685815f6b75'
const orgId = '636cef1e4771aff336e8676b'
const task_id = 2

const dep = JSON.parse(fs.readFileSync('./dep.json', 'utf-8'))

for (const item of dep) {
  const { rows } = await client.query(`
    SELECT id, code from nodes WHERE code = '${item.code}' and org_id = '${orgId}' and userpool_id = '${userPoolId}'
  `)
  if (rows.length) {
    const nodeId = rows[0]?.id
    await client.query(`
      INSERT INTO node_connections 
      ("userpool_id", "provider_type", "org_id", "node_id", "third_party_department_id", "third_party_parent_department_id", "sync_identity_provider_id", "third_party_provider_code") VALUES 
      ('${userPoolId}', 'custom', '${orgId}', '${nodeId}', '${item.id}', '${item.parentId}', ${task_id}, NULL);
    `)
  } else {
    console.log("没有找到数据", item)
  }
}

client.end()

console.log("🚀 ~ file: a.mjs ~ line 2 ~ dep", dep.length)








