import pg from 'pg'

const client = new pg.Client({
  user: 'postgres',           // 数据库用户名
  database: 'authing-server-test',       // 数据库
  password: 'H1pC98RIogJPJCc',       // 数据库密码
  host: '127.0.0.1',        // 数据库所在IP
  port: '5656'                // 连接端口
})

client.connect()

export default client
