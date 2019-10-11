//数据库模型定义
const models = {
  listing: {
    txhash: String,
    listingId: Number,
    seller: String,
    deposit: String,
    status: Number,
    city: String,
    title: String,
    descHash: String,
    price: Number,
    imageHash: String,
    createAt: Number,
    CancelledAt: Number
  },
  offer:{
    txhash:String,
    listingId:Number,
    offerId:Number,
    buyer:String,
    value: Number,
    refund: { type: Number, default: 0 },
    status: { type: Number, default: 1},
    finalizes: { type: Number,default:0},
    arbitrator: String,
    checkIn: Number,
    checkOut:Number,
    nights: Number,
    cancelledBy: String,
    cancelledAt:Number,
    finalizedBy: String,
    finalizedAt:Number,
    disputedBy: String,
    disputedAt:Number,
    createAt:Number,
    acceptedAt: Number
  }
}

module.exports = models
