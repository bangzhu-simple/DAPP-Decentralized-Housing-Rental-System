const express = require('express')
//后端UI路由
const ui = function(){
  let router = express.Router()

  router.get('/',(req,rsp)=>{
    rsp.render('app')
  })

  return router
}

module.exports = ui
