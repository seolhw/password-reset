import * as crypto from 'crypto';
import fs from 'fs'
import path from 'path'

// data 中复制上 username 和 encrypted_password
const data = [
  [
    'V52KcIohuexCeN7', 'Yq22xYLN3aEjhYOx6xLo1SqTloJdIuPy590VeCICshdO3kcc7eZakFrPXmaUDNF1H6h0ClOqwSTe4Eyvw2jAxPOKkXv3ml4N7LXUWfAfcLSXkJ0YCEZG00lUtdujosgAq1IIzZSJcAbiqF376P4tba8giX6doLFhkhuj3RoT+5Q='
  ],
  [
    '_vV6n7z_3LLJgaZegNQ',
    'hCg5GdivCsU9d8Zjn4pkPKl1km5O5sAlCTURJtdlz9Jy4GYxRAGIG8XvwqsawIkxlfrnEqjue7qf2FeJxtM+dc788uyCMOzN1JdxDRHn5xsbAvs68pyCcd3+6O0OfHzEnI8XiUiZSXbvPdTm0IqT73FB+lwhjccrm2IqlPCBZJs='
  ]
]

// 密钥
const privateKey = `
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

export const decrypt = (encrypted) => {
  const decryptText = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    Buffer.from(encrypted, 'base64'),
  );
  return decryptText.toString('utf-8');
};

data.forEach(item => {
  const [username, password] = item
  const p = decrypt(password)
  console.log(`${username}用户的密码是${p}`)
  fs.appendFileSync(path.resolve('./password-reset.ps1'), `
reset_password -samAccountName "${username}" -password "${p}"
  `)
})
