import * as fs from 'fs'
import os from 'os'

export const newPrivateKey = `
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACBUQPRCMO0BbshYTYwWfUlFbTfVWgJBFhZvvG8aQ/n2WQAAAKB9L5h1fS+Y
dQAAAAtzc2gtZWQyNTUxOQAAACBUQPRCMO0BbshYTYwWfUlFbTfVWgJBFhZvvG8aQ/n2WQ
AAAEAmytnWPyXuR6LrlBc53WVZP0If96Sxl6gCqlI0TuoHJlRA9EIw7QFuyFhNjBZ9SUVt
N9VaAkEWFm+8bxpD+fZZAAAAF3FpbmdjbG91ZEBsaWh1aXdhbmcubmV0AQIDBAUG
-----END OPENSSH PRIVATE KEY-----
`

// 旧密钥
export const oldPrivateKey = `
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

export const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cGRhdGVkX2F0IjoiMjAyMi0xMC0yNVQwMzozODo0NC42NzZaIiwiYWRkcmVzcyI6eyJjb3VudHJ5IjpudWxsLCJwb3N0YWxfY29kZSI6bnVsbCwicmVnaW9uIjpudWxsLCJmb3JtYXR0ZWQiOm51bGx9LCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOmZhbHNlLCJwaG9uZV9udW1iZXIiOm51bGwsImxvY2FsZSI6bnVsbCwiem9uZWluZm8iOm51bGwsImJpcnRoZGF0ZSI6bnVsbCwiZ2VuZGVyIjoiVSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZW1haWwiOiJsaWh1aXdhbmdAYXV0aGluZy5jbiIsIndlYnNpdGUiOm51bGwsInBpY3R1cmUiOiJodHRwczovL2ZpbGVzLmF1dGhpbmcuY28vYXV0aGluZy1jb25zb2xlL2RlZmF1bHQtdXNlci1hdmF0YXIucG5nIiwicHJvZmlsZSI6bnVsbCwicHJlZmVycmVkX3VzZXJuYW1lIjpudWxsLCJuaWNrbmFtZSI6bnVsbCwibWlkZGxlX25hbWUiOm51bGwsImZhbWlseV9uYW1lIjpudWxsLCJnaXZlbl9uYW1lIjpudWxsLCJuYW1lIjpudWxsLCJzdWIiOiI2MzIwOTcwNGY3NTVjZTQ3MGY5NWEzMjMiLCJleHRlcm5hbF9pZCI6bnVsbCwidW5pb25pZCI6bnVsbCwidXNlcm5hbWUiOm51bGwsImRhdGEiOnsidHlwZSI6InVzZXIiLCJ1c2VyUG9vbElkIjoiNTlmODZiNDgzMmViMjgwNzFiZGQ5MjE0IiwiYXBwSWQiOiI2MmViOGFlMDZjMjNjM2MzMzEyM2NkZDAiLCJpZCI6IjYzMjA5NzA0Zjc1NWNlNDcwZjk1YTMyMyIsInVzZXJJZCI6IjYzMjA5NzA0Zjc1NWNlNDcwZjk1YTMyMyIsIl9pZCI6IjYzMjA5NzA0Zjc1NWNlNDcwZjk1YTMyMyIsInBob25lIjpudWxsLCJlbWFpbCI6ImxpaHVpd2FuZ0BhdXRoaW5nLmNuIiwidXNlcm5hbWUiOm51bGwsInVuaW9uaWQiOm51bGwsIm9wZW5pZCI6bnVsbCwiY2xpZW50SWQiOiI1OWY4NmI0ODMyZWIyODA3MWJkZDkyMTQifSwidXNlcnBvb2xfaWQiOiI1OWY4NmI0ODMyZWIyODA3MWJkZDkyMTQiLCJhdWQiOiI2MmViOGFlMDZjMjNjM2MzMzEyM2NkZDAiLCJleHAiOjE2Njc4ODYzNzAsImlhdCI6MTY2NjY3Njc3MCwiaXNzIjoiaHR0cDovL2NvbnNvbGUuZGV2LmxpaHVpd2FuZy5uZXQ6MzAwMC9vaWRjIn0.jqAGgWT7HnrvBOsxYUQLozG5g0IhrAXjZrI7Zm4Thtc`

export const host = 'http://console.dev.lihuiwang.net:3000'

export const userPoolId = "63a1622694f6b3d71e4f120a"

// Provisioning Ticket Url 最后的 key
export const identityKeys = [
  {
    id: "gtKYI2uGt",
    name: "AD03"
  },
  {
    id: "19s5Am5i6",
    name: "AD03-j"
  },
  {
    id: "GiG7_LnOP",
    name: "AD04"
  },
  {
    id: "3qxvntCkf",
    name: "AD04-g"
  },
]


if(!fs.existsSync('./userId.txt')){
  throw Error("缺少用户数据文件 userId.txt")
}

const d = fs.readFileSync('./userId.txt', 'utf-8')

console.log(d.split(os.EOL).filter(Boolean))

export const userIds = d.split(os.EOL).filter(Boolean)

// export const userIds = [
//   '6328523ecf396436284db631', '632538193a3d488d71b0b7c9'
// ]