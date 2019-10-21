// pm2的配置文件
module.exports = {
  // app是pm2执行命令的时候, 执行哪些应用, 是一个数组, 有多少个应用实例就有多少个对象
  apps: [
    {
      name: 'next-project',
      script: './server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}