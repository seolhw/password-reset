import * as crypto from 'crypto';
import * as fs from 'fs';
import os from 'os'
import client from './pg.mjs'
import { oldPrivateKey, userPoolId } from './config.mjs'

const log = (str = '') => {
  console.log(str)
  fs.appendFileSync(`./log-check-${date}/log.log`, str + os.EOL)
}

export const decrypt = (encrypted) => {
  try {
    let decryptText = crypto.privateDecrypt(
      {
        key: oldPrivateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(encrypted, 'base64'),
    );
    return decryptText.toString('utf-8');
  } catch (err) {
    log('解密失败')
  }
}


const { rows, rowCount } = await client.query(`select id, encrypted_password, username from users WHERE encrypted_password is not NULL and userpool_id = '${userPoolId}'`)

const date = Date.now()
fs.mkdirSync(`./log-check-${date}`)
fs.writeFileSync(`./log-check-${date}/log.log`, '')

log(`旧密钥解密开始...`)
for (const [index, item] of rows.entries()) {
  const { id, encrypted_password, username } = item
  log(`开始${index + 1}/${rowCount}: ${username}`)

  const pass = decrypt(encrypted_password);
  if(pass){
    log(`${username}密码解密结果为 ${pass}`)
  }else{
    log(`${username}密码解密失败`)
  }

  log()
}
log(`旧密钥解密解决`)

client.end()

