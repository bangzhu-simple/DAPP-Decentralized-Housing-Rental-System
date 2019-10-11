const express = require('express')
//后端路由 将查询的相关数据放入到 api 中
const api = function(config,db){
  let router = express.Router()

  router.get('/listing',async (req,rsp)=>{
    let q = {}
    if(req.query.city){
      q.city = req.query.city
    }
    if(req.query.p1 && !req.query.p2){
      q.price = {$gte:parseInt(req.query.p1)}
    }
    if(req.query.p1 && req.query.p2){
      q.price = {$gte:parseInt(req.query.p1),$lte:parseInt(req.query.p2)}
    }
    if(!req.query.p1 && req.query.p2){
      q.price = {$lte:parseInt(req.query.p2)}
    }
    q.status = 1

    let ret = await db.findListing(q)//查找数据库
    //console.log(ret)
    rsp.send(ret)
  })

  router.get('/listing/:id',async (req,rsp)=>{


    let ret = await db.findListingPlusAvailability(req.params.id)
    if(!ret) return rsp.status(404).send('')
    else rsp.send(ret)
  })

  router.get('/listing/:id/offer',async (req,rsp) => {
    let ret = await db.findListingOffer(req.params.id)
    rsp.send(ret)
  })

  router.get('/seller/:addr/listing',async (req,rsp)=>{
    let ret = await db.findSellerListing(req.params.addr)
    rsp.send(ret)
  })

  router.get('/buyer/:addr/listing',async (req,rsp)=>{
    let ret = await db.findBuyerListing(req.params.addr)
    rsp.send(ret)
  })

  router.get('/user/:addr/stats',async (req,rsp) => {
    let ret = await db.getStats(req.params.addr)
    rsp.send(ret)
  })

  router.get('/offer',async (req,rsp)=>{
    let q = {}
    let ret = await db.findOfferPlusListing(q)
    rsp.send(ret)
  })

  router.get('/seller/:addr/offer',async (req,rsp) => {
    let ret = await db.findSellerOffer(req.params.addr)
    rsp.send(ret)
  })

  router.get('/buyer/:addr/offer',async (req,rsp) => {
    let ret = await db.findBuyerOffer(req.params.addr)
    rsp.send(ret)
  })

  router.get('/arbitrator/:addr/offer',async (req,rsp) => {
    let ret = await db.findArbitratorOffer(req.params.addr)
    rsp.send(ret)
  })

  return router
}

module.exports = api
