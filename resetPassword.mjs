import * as crypto from 'crypto';
import * as fs from 'fs';
import os from 'os'

const newPrivateKey = `
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACBUQPRCMO0BbshYTYwWfUlFbTfVWgJBFhZvvG8aQ/n2WQAAAKB9L5h1fS+Y
dQAAAAtzc2gtZWQyNTUxOQAAACBUQPRCMO0BbshYTYwWfUlFbTfVWgJBFhZvvG8aQ/n2WQ
AAAEAmytnWPyXuR6LrlBc53WVZP0If96Sxl6gCqlI0TuoHJlRA9EIw7QFuyFhNjBZ9SUVt
N9VaAkEWFm+8bxpD+fZZAAAAF3FpbmdjbG91ZEBsaWh1aXdhbmcubmV0AQIDBAUG
-----END OPENSSH PRIVATE KEY-----
`

// 旧密钥
const oldPrivateKey = `
-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQC4xKeUgQ+Aoz7TLfAfs9+paePb5KIofVthEopwrXFkp8OCeoca
THt9ICjTT2QeJh6cZaDaArfZ873GPUn00eOIZ7Ae+TiA2BKHbCvloW3w5Lnqm70i
SsUi5Fmu9/2+68GZRH9L7Mlh8cFksCicW2Y2W2uMGKl64GDcIq3au+aqJQIDAQAB
AoGAezeiLhXXecjj57816F5zJK6aJxWU0n2ux9CuhDAWc7KxXj1KBc7Fd49PyoOi
V7zCIzhfCaRQaUfz4dUTkfG60yVbbA1NzOJEl+ePo8wC40XbuShvt6Ebx2893FrE
ZqUDzMhAlVQLhFbBu5Spa+7/r53JANRrYEdZLLSRN3a8fi0CQQDhDAL3q0bUnGFO
/ho3x+kwB/RfH813KlqFRTgVi1kZaqyd9lSCaFy4y8fxSv38pGnb+F9/VjxiEmQM
uDHh/7ePAkEA0i5pxu5fEr8mOXAazoEIYwTTwMVrXHks4RuZ5BCg6kC/0TjVRk3I
QyslvkSqUp9jdxBy98gAo+ohbp/Ug05JCwJAbNgTY1gahOAxjDQH2Cy/ErT2Mz+9
b0Izz7s/uePQryNR44BtNTlmhxZAWOqtVxDqBjLldT/vKnu8mg5ISgcU7wJBAMmV
Sk5JgVXxjy+3nX5Bs1GE57MTpYzji2+7kTVz3WHPCCoaYDM1lsUVNPXv1Yu44yTm
2d1cLYEIpVf8Y04sX1ECQH+k1+G08/ZId8Tp1eZs+TxujY4d66QVxTjzSQMXSNMA
oPtSPEaerH43ji6VPSgi9ICBiHj4oJogtQeseJ3opFw=
-----END RSA PRIVATE KEY-----
`

const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cGRhdGVkX2F0IjoiMjAyMi0xMC0xM1QwNToyNjo1Ni44NTVaIiwiYWRkcmVzcyI6eyJjb3VudHJ5IjpudWxsLCJwb3N0YWxfY29kZSI6bnVsbCwicmVnaW9uIjpudWxsLCJmb3JtYXR0ZWQiOm51bGx9LCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOmZhbHNlLCJwaG9uZV9udW1iZXIiOm51bGwsImxvY2FsZSI6bnVsbCwiem9uZWluZm8iOm51bGwsImJpcnRoZGF0ZSI6bnVsbCwiZ2VuZGVyIjoiVSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZW1haWwiOiJsaWh1aXdhbmdAYXV0aGluZy5jbiIsIndlYnNpdGUiOm51bGwsInBpY3R1cmUiOiJodHRwczovL2ZpbGVzLmF1dGhpbmcuY28vYXV0aGluZy1jb25zb2xlL2RlZmF1bHQtdXNlci1hdmF0YXIucG5nIiwicHJvZmlsZSI6bnVsbCwicHJlZmVycmVkX3VzZXJuYW1lIjpudWxsLCJuaWNrbmFtZSI6bnVsbCwibWlkZGxlX25hbWUiOm51bGwsImZhbWlseV9uYW1lIjpudWxsLCJnaXZlbl9uYW1lIjpudWxsLCJuYW1lIjpudWxsLCJzdWIiOiI2MzIwOTcwNGY3NTVjZTQ3MGY5NWEzMjMiLCJleHRlcm5hbF9pZCI6bnVsbCwidW5pb25pZCI6bnVsbCwidXNlcm5hbWUiOm51bGwsImRhdGEiOnsidHlwZSI6InVzZXIiLCJ1c2VyUG9vbElkIjoiNTlmODZiNDgzMmViMjgwNzFiZGQ5MjE0IiwiYXBwSWQiOiI2MmViOGFlMDZjMjNjM2MzMzEyM2NkZDAiLCJpZCI6IjYzMjA5NzA0Zjc1NWNlNDcwZjk1YTMyMyIsInVzZXJJZCI6IjYzMjA5NzA0Zjc1NWNlNDcwZjk1YTMyMyIsIl9pZCI6IjYzMjA5NzA0Zjc1NWNlNDcwZjk1YTMyMyIsInBob25lIjpudWxsLCJlbWFpbCI6ImxpaHVpd2FuZ0BhdXRoaW5nLmNuIiwidXNlcm5hbWUiOm51bGwsInVuaW9uaWQiOm51bGwsIm9wZW5pZCI6bnVsbCwiY2xpZW50SWQiOiI1OWY4NmI0ODMyZWIyODA3MWJkZDkyMTQifSwidXNlcnBvb2xfaWQiOiI1OWY4NmI0ODMyZWIyODA3MWJkZDkyMTQiLCJhdWQiOiI2MmViOGFlMDZjMjNjM2MzMzEyM2NkZDAiLCJleHAiOjE2NjY4NjI2MjAsImlhdCI6MTY2NTY1MzAyMCwiaXNzIjoiaHR0cDovL2NvbnNvbGUuZGV2LmxpaHVpd2FuZy5uZXQ6MzAwMC9vaWRjIn0.fTsPXcix2zigABkVqWvO0cvWqMNhdqI3-bBd_WGCDTs`

const host = 'http://console.dev.lihuiwang.net:3000'

const userPoolId = "632097202de90ee8c53ec9d2"

// Provisioning Ticket Url 最后的 key
const identityKeys = ['gtKYI2uGt', '19s5Am5i6', 'GiG7_LnOP', '3qxvntCkf']


// 重置密码
const data = [
  ['test-140001', 'keV4VRbc/mTU7mqjyfRGuasX++jgx7fabauAXyhA3InxFSTkI7NVUWc0/MH3mWZgm8HUfLS9+2cBV4+CCdFh9swKRftu7/rwSCVRrSsQT9oCInH7YU0wKyaBtXoagA3ZO1eJVifSpoPhOQ/BPQAJWvxCiftsl6u9hIam8FUIX58='],
  ['test-14001', 'keV4VRbc/mTU7mqjyfRGuasX++jgx7fabauAXyhA3InxFSTkI7NVUWc0/MH3mWZgm8HUfLS9+2cBV4+CCdFh9swKRftu7/rwSCVRrSsQT9oCInH7YU0wKyaBtXoagA3ZO1eJVifSpoPhOQ/BPQAJWvxCiftsl6u9hIam8FUIX58=']
]

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

const date = Date.now()
fs.mkdirSync(`./log-${date}`)
fs.writeFileSync(`./log-${date}/log.log`, '')

const log = (str = '') => {
  console.log(str)
  fs.appendFileSync(`./log-${date}/log.log`, str + os.EOL)
}

const getUserID = async (username) => {
  const { data: userInfo } = await fetch(`${host}/api/v3/get-user?userId=${username}&userIdType=username`, {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  }).then(response => response.json())
  if (!userInfo?.userId) {
    log(`用户${item[0]}，不存在`)
  }
  return userInfo?.userId
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

for (const [index, item] of data.entries()) {
  log(`开始${index + 1}/${data.length}: ${item[0]}`)
  const userId = await getUserID(item[0])
  if(!userId){
    continue
  }

  const pass = decrypt(item[1]);
  log(`${item[0]}密码解密结果为 ${pass}`)

  const updateResult = await updateUser(userId, pass, item[0])
  if(!updateResult){
    continue
  }

  log(`等待5s后验证该用户 ${item[0]}`)
  await sleep(5)

  for (const identity of identityKeys) {
    const res = await fetch(`${host}/api/v2/ad/verify-user-test`, {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        username: item[0],
        password: pass,// pass,
        ticketList: [identity]
      }),
      redirect: 'follow'
    })
      .then(response => response.json())

    if (res.statusCode) {
      log(`${item[0]},${identity} 密码验证失败`)
    } else {
      log(`${item[0]},${identity} 密码验证成功`)
    }
  }
  log(`结束${index + 1}/${data.length}: ${item[0]}`)
  log()
}

