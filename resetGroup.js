const fs = require('fs')
const os = require('os')

const json03 = require('./03.json')
const json05 = require('./05.json')

const json3User = new Map()
const json5User = new Map()

for (const item of json03.users) {
  if ( item.objectClass.includes('user') ){
    // item.member.length
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

const date = Date.now()

const writeFile = (str) => {
  // 写入文件
  fs.appendFileSync(`./missMemberOf-${date}.ps1`, str + os.EOL)
}

fs.writeFileSync(`./missMemberOf-${date}.ps1`, '')

for (const sAMAccountName of json5User.keys()) {
  let group03 = json3User.get(sAMAccountName)?.memberOf || []
  if(!(group03 instanceof Array)){
    group03 = [group03]
  }
  let group05 = json5User.get(sAMAccountName)?.memberOf || []
  if(!(group05 instanceof Array)){
    group05 = [group05]
  }
  const groupList = group03.filter(item => {
    return !group05.includes(item)
  })
  for (const group of groupList) {
    writeFile(`Add-ADGroupMember -Identity '${group}' -Members '${sAMAccountName}';`)
  }
}


