const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Web3 = require('web3')
const moment = require('moment')
const models = require('./models')
//数据库接口 包括 查询接口  监听接口后调用的接口
mongoose.Promise = global.Promise

class DbStore {
  constructor(config){
    this.config = config
  }

  async connect(){
    return new Promise((resolve,reject) => {

      for(let name in models){
        mongoose.model(name,new Schema(models[name]))
      }

      mongoose.connect(this.config.mongodb.url)

      const db = mongoose.connection;
      db.on('error', error => {
        console.log('mongodb error => ',error)
        reject(error)
      })
      db.on('open', () => {
        console.log('mongodb connected')
        resolve(db)
      })
    })
  }

  async createListing(listing){
    let record = await mongoose.model('listing').findOne({ 'txhash': listing.txhash }).exec()
    if(record != null) return

    if(!listing.createAt) listing.createAt = parseInt(Date.now() / 1000)
    return await mongoose.model('listing').create(listing)
  }

  async cancelListing(event){
    if(!event.cancelledAt) event.cancelledAt = parseInt(Date.now() / 1000)
    let condition = {listingId:event.listingId.toNumber()}
    let update = {$set:{status:9,cancelledAt:event.cancelled}}
    return await mongoose.model('listing').findOneAndUpdate(condition,update).exec()
  }

  async findListing(condition){
    return await mongoose.model('listing').find(condition).sort({createAt:-1}).exec()
  }

  async findListingPlusAvailability(id){
    let listing = await mongoose.model('listing').findOne({listingId:id}).exec()
    if(!listing) return
    let today = moment().startOf('today').unix()
    //todo: add status = 2
    let offers = await mongoose.model('offer').find({listingId:id,checkIn:{$gte:today},status:{$in:[2,4]}},{checkIn:1,checkOut:1,nights:1,status:1}).exec()
    let ret = Object.assign({},listing._doc,{offers})
    return ret
  }

  async findSellerListing(addr){
    let condition = {seller:addr}
    return await this.findListing(condition)
  }

  async findBuyerListing(addr){
    let offers = await mongoose.model('offer').find({buyer:addr},{listingId:1,checkIn:1,checkOut:1,nights:1,status:1}).exec()
    if(offers.length == 0) return []
    let offerDict = {}
    offers.forEach(offer => {
      let listingId = offer.listingId
    //  if(!offerDict[listingId]) offerDict[listingId] = []
      offerDict[listingId].push(offer)
    })
    let listingIds = offers.map(offer => offer.listingId)
    listingIds = [...new Set(listingIds)]
    let listings = await mongoose.model('listing').find({listingId:{$in:listingIds}})
    let ret = listings.map(listing => ({...listing._doc,offers:offerDict[listing.listingId]}))
    return ret
  }

  async createOffer(offer){
    let record = await mongoose.model('offer').findOne({ 'txhash': offer.txhash }).exec()
    if(record != null) return

    if(!offer.createAt) offer.createAt = parseInt(Date.now() / 1000)
    return await mongoose.model('offer').create(offer)
  }

  async findOffer(condition){
    return await mongoose.model('offer').find(condition).exec()
  }

  async findListingOffer(id){
    return await mongoose.model('offer').find({listingId:id}).exec()
  }

  async findOfferPlusListing(condition){
    let offers = await mongoose.model('offer').find(condition).sort({createAt:-1}).exec()
    let listingIds = offers.map(offer => offer.listingId)
    listingIds = [...new Set(listingIds)]
    let listings = await mongoose.model('listing').find({listingId:{$in:listingIds}}).exec()
    let listingDict = {}
    listings.forEach(listing => listingDict[listing.listingId] = listing)
    let ret = offers.map(offer => Object.assign({},offer._doc,{listing:listingDict[offer.listingId]}))
    return ret
  }

  async findSellerOffer(addr){
    let listings = await mongoose.model('listing').find({seller:addr},{listingId:1}).exec()
    let listingIds = listings.map(listing => listing.listingId)
    let offers = await this.findOfferPlusListing({listingId:{$in:listingIds}})
    return offers
  }

  async findBuyerOffer(addr){
    let offers = await this.findOfferPlusListing({buyer:addr})
    return offers
  }

  async findArbitratorOffer(addr){
    let offers = await this.findOfferPlusListing({status:3})
    return offers
  }

  async acceptOffer(event){
    if(!event.acceptedAt) event.acceptedAt = parseInt(Date.now()/1000)
    let condition = {listingId:event.listingId.toNumber(),offerId:event.offerId.toNumber()}
    let update = {$set:{status:2,finalizes:event.finalizes.toNumber(),acceptedAt:event.acceptedAt}}
    let ret = await mongoose.model('offer').findOneAndUpdate(condition,update).exec()
    return ret
  }

  async cancelOffer(event){
    if(!event.cancelledAt) event.cancelledAt = parseInt(Date.now()/1000)
    let condition = {listingId:event.listingId.toNumber(),offerId:event.offerId.toNumber()}
    let update = {$set:{status:9,cancelledBy:event.who,cancelledAt:event.cancelledAt}}
    let ret = await mongoose.model('offer').findOneAndUpdate(condition,update).exec()
    return ret
  }

  async finalizeOffer(event){
    if(!event.finalizedAt) event.finalizedAt = parseInt(Date.now()/1000)
    let condition = {listingId:event.listingId.toNumber(),offerId:event.offerId.toNumber()}
    let update = {$set:{status:4,finalizedBy:event.who,finalizedAt:event.finalizedAt}}
    let ret = await mongoose.model('offer').findOneAndUpdate(condition,update).exec()
    return ret
  }

  async disputeOffer(event){
    if(!event.disputedAt) event.disputedAt = parseInt(Date.now()/1000)
    let condition = {listingId:event.listingId.toNumber(),offerId:event.offerId.toNumber()}
    let update = {$set:{status:3,disputedBy:event.who,disputedAt:event.disputedAt}}
    let ret = await mongoose.model('offer').findOneAndUpdate(condition,update).exec()
    return ret
  }

  async arbitrateOffer(event){
    if(!event.arbitratedAt) event.arbitratedAt = parseInt(Date.now()/1000)
    let condition = {listingId:event.listingId.toNumber(),offerId:event.offerId.toNumber()}
    let update = {$set:{status:5,refund:event.refund}}
    let ret = await mongoose.model('offer').findOneAndUpdate(condition,update).exec()
    return ret
  }

}

module.exports = DbStore
