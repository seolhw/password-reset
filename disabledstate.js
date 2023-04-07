import * as crypto from 'crypto';
import * as fs from 'fs';
import os from 'os'
import client from './pg.mjs'
import { oldPrivateKey, userPoolId } from './config.mjs'
import json03 from './03.json'
import json05 from './05.json'

const log = (str = '') => {
  console.log(str)
  fs.appendFileSync(`./log-check-${date}/log.log`, str + os.EOL)
}

const date = Date.now()
fs.mkdirSync(`./log-check-${date}`)
fs.writeFileSync(`./log-check-${date}/log.log`, '')


const json3User = new Map()
const json5User = new Map()

for (const item of json03.users) {
  if ( item.objectClass.includes('user') ){
    json3User.set(item.sAMAccountName, item)
  }
}
console.log('json3共有人', json3User.size, '个');


for (const item of json05.users) {
  if ( item.objectClass.includes('user') ){
    json5User.set(item.sAMAccountName, item)
  }
}
console.log('json5共有人', json5User.size, '个');



const { rows, rowCount } = await client.query(`select id, encrypted_password, username from users WHERE encrypted_password is not NULL and userpool_id = '${userPoolId}'`)




client.end()

