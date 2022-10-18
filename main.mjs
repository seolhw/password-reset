import * as crypto from 'crypto';
import fs from 'fs'
import path from 'path'
import client from './pg.mjs'

// 新密钥
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

const publicKey = `
-----BEGIN PUBLIC KEY-----
AAAAC3NzaC1lZDI1NTE5AAAAIFRA9EIw7QFuyFhNjBZ9SUVtN9VaAkEWFm+8bxpD+fZZ
-----END PUBLIC KEY-----
`

// 解密
export const decrypt = (encrypted, privateKey) => {
  let decryptText = null;
  try {
    decryptText = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(encrypted, 'base64'),
    );
  } catch (err) {
    return false;
  }

  return decryptText.toString('utf-8');
};

// 加密
const encrypt = (plainText) => {
  const encrypted = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    Buffer.from(plainText),
  );
  return encrypted.toString('base64');
}

(async () => {
  const data = await client.query('select id, encrypted_password,encrypted_password_backup, username from users WHERE encrypted_password is not NULL;')

  const oldData = data.rows.filter(item => {
    const password = decrypt(item.encrypted_password, oldPrivateKey)
    return Boolean(password)
  })

  const newData = data.rows.filter(item => {
    const password = decrypt(item.encrypted_password, newPrivateKey)
    return Boolean(password)
  })
  
  console.log(`
    存在密码的用户有: ${data.rowCount},
    使用旧密钥的用户有：${oldData.length},
    使用新密钥的用户有：${newData.length},
  `)

  // 双密钥解密
  // for (const element of data.rows) {
  //   const password = decrypt(element.encrypted_password)
  //   const encry_password = encrypt(password)
  //   console.log("🚀 ~ file: main.mjs ~ line 75 ~ password", element.username, password)
  //   // await client.query(`UPDATE users SET encrypted_password = '${encry_password}' WHERE id = '${element.id}';`)
  // }

  client.end()

})()



// // data 中复制上 username 和 encrypted_password
// const data = [
//   [
//     'V52KcIohuexCeN7', 'Yq22xYLN3aEjhYOx6xLo1SqTloJdIuPy590VeCICshdO3kcc7eZakFrPXmaUDNF1H6h0ClOqwSTe4Eyvw2jAxPOKkXv3ml4N7LXUWfAfcLSXkJ0YCEZG00lUtdujosgAq1IIzZSJcAbiqF376P4tba8giX6doLFhkhuj3RoT+5Q='
//   ],
//   [
//     '_vV6n7z_3LLJgaZegNQ',
//     'hCg5GdivCsU9d8Zjn4pkPKl1km5O5sAlCTURJtdlz9Jy4GYxRAGIG8XvwqsawIkxlfrnEqjue7qf2FeJxtM+dc788uyCMOzN1JdxDRHn5xsbAvs68pyCcd3+6O0OfHzEnI8XiUiZSXbvPdTm0IqT73FB+lwhjccrm2IqlPCBZJs='
//   ]
// ]

// // 密钥




// data.forEach(item => {
//   const [username, password] = item
//   const p = decrypt(password)
//   console.log(`${username}用户的密码是${p}`)
//   fs.appendFileSync(path.resolve('./password-reset.ps1'), `
// reset_password -samAccountName "${username}" -password "${p}"
//   `)
// })


// export const decrypt = (encrypted) => {
//   let decryptText = null;
//   try {
//     decryptText = crypto.privateDecrypt(
//       {
//         key: privateKey,
//         padding: crypto.constants.RSA_PKCS1_PADDING,
//       },
//       Buffer.from(encrypted, 'base64'),
//     );
//   } catch (err) {
//     decryptText = crypto.privateDecrypt(
//       {
//         key: otherPrivateKey,
//         padding: crypto.constants.RSA_PKCS1_PADDING,
//       },
//       Buffer.from(encrypted, 'base64'),
//     );
//   }

//   return decryptText.toString('utf-8');
// };