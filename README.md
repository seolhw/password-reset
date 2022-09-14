# 长鑫密码同步脚本

**操作步骤**

1. 在 main.mjs 中替换 username 和对应的 encrypted_password 字段(数据库user表),以及私钥
2. 执行命令 `.\node\node.exe main.mjs`
3. 检查 password-reset.ps1 文件,复制该文件到 102 域控服务器中,执行该脚本 `powershell.exe password-reset.ps1`
4. 检查密码是否重置成功
