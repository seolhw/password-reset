import pg from 'pg'

const client = new pg.Client({
  user: 'postgres',           // 数据库用户名
  database: 'authing-server-main',       // 数据库
  password: 'postgres',       // 数据库密码
  host: '127.0.0.1',        // 数据库所在IP
  port: '5432'                // 连接端口
})

client.connect()

export default client
