//服务器启动初始化加载路径
const path = require('path')
const express = require('express')
const app = express()

const DbStore = require('./lib/DbStore')
const ChainEventListener = require('./lib/ChainEventListener')
const ui = require('./lib/ui')
const api = require('./lib/api')

const config = {
  mongodb: {
    url: 'mongodb://localhost:27017/marketplace'
  },
  ethereum: {
    url: 'http://localhost:8545'
  }
}

async function main(){
  let db = new DbStore(config)
  await db.connect()

  let chainEventListener = new ChainEventListener(config,db)
  await chainEventListener.start()

  app.use(express.static(__dirname + '/build'))

  app.set("views", path.join(__dirname ,'views'))
  app.set("view engine","html");
  app.engine("html",require("ejs").__express);

  app.use('/',ui())
  app.use('/api',api(config,db))

  app.listen(9000, function() {
   console.log('dapp server listening on port 9000');
  });
}

main()
