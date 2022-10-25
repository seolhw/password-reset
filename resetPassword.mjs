import * as crypto from 'crypto';
import * as fs from 'fs';
import os from 'os'
import client from './pg.mjs'
import { newPrivateKey, oldPrivateKey, token, host, userPoolId, identityKeys, userIds } from './config.mjs'

var myHeaders = new Headers();
myHeaders.append("Authorization", token);
myHeaders.append("x-authing-userpool-id", userPoolId);
myHeaders.append("User-Agent", "apifox/1.0.0 (https://www.apifox.cn)");
myHeaders.append("Content-Type", "application/json");

const sleep = (time) => new Promise((reslove) => setTimeout(reslove, time * 1000))

export const decrypt = (encrypted) => {
  let decryptText = null;
  try {
    decryptText = crypto.privateDecrypt(
      {
        key: newPrivateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(encrypted, 'base64'),
    );
  } catch (err) {
    decryptText = crypto.privateDecrypt(
      {
        key: oldPrivateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(encrypted, 'base64'),
    );
  }

  return decryptText.toString('utf-8');
}

const log = (str = '') => {
  console.log(str)
  fs.appendFileSync(`./log-${date}/log.log`, str + os.EOL)
}

const updateUser = async (userId, pass, username) => {
  const res = await fetch(`${host}/api/v3/update-user`, {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify({
      userId,
      password: pass, //'authing@885'
    }),
    redirect: 'follow'
  })
    .then(response => response.json())

  if (res.statusCode === 200) {
    log(`${username} 密码更新成功`)
    return true
  } else {
    log(`${username} 密码更新失败: ${res}`)
    return false
  }
}

const { rows, rowCount } = await client.query(`select id, encrypted_password, username from users WHERE encrypted_password is not NULL and userpool_id = '${userPoolId}' and id In (${userIds.map(e => "'" + e + "'").join()})`)

const date = Date.now()
fs.mkdirSync(`./log-${date}`)
fs.writeFileSync(`./log-${date}/log.log`, '')

log(`批量同步密码开始...`)
for (const [index, item] of rows.entries()) {
  const { id, encrypted_password, username } = item
  log(`开始${index + 1}/${rowCount}: ${username}`)
  const userId = id

  const pass = decrypt(encrypted_password);
  log(`${username}密码解密结果为 ${pass}`)

  const updateResult = await updateUser(userId, pass, username)
  if (!updateResult) {
    continue
  }
  log(`更新密码成功，${index + 1}/${rowCount}: ${username}：${pass}`)
  log()
}
log(`批量同步密码结束`)
log()
log(`等待20s后批量验证`)
await sleep(20)
log()
log(`批量验证密码开始...`)
for (const [index, item] of rows.entries()) {
  const { id, encrypted_password, username } = item
  log(`开始${index + 1}/${rowCount}: ${username}`)

  const pass = decrypt(encrypted_password);
  log(`${username}密码解密结果为 ${pass}`)
  

  for (const { id: identity, name } of identityKeys) {
    const res = await fetch(`${host}/api/v2/ad/verify-user-test`, {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        username: username,
        password: pass,// pass,
        ticketList: [identity]
      }),
      redirect: 'follow'
    })
      .then(response => response.json())

    if (res.statusCode) {
      log(`${username},${name}(${identity}) 密码验证失败`)
    } else {
      log(`${username},${name}(${identity}) 密码验证成功`)
    }
  }
  log(`验证密码结束，${index + 1}/${rowCount}: ${username}：${pass}`)
  log()
}
log(`批量验证密码结束`)

client.end()

