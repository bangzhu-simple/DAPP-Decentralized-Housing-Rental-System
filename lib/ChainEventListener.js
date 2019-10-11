const Web3 = require('web3')
const contract = require('truffle-contract')
const marketplaceArtifacts = require('../build/contracts/Marketplace.json')
//链上事件监听
class ChainEventListener{
  constructor(config,db){
    this.config = config
    this.db = db

    let url = config.ethereum.url

    let provider = new Web3.providers.HttpProvider(url);
    this.marketplaceContract = contract(marketplaceArtifacts)
    this.marketplaceContract.setProvider(provider)
  }

  async sleep(duration = 1000){
    return new Promise(resolve => setTimeout(resolve,duration))
  }

  async startOne(name,handler) {
    let inst = await this.marketplaceContract.deployed()
    let event = inst[name]({fromBlock: 0, toBlock: 'latest'});
    event.watch(async (err, ret) => {
      if (err) return console.log(err)
      console.log('event captured => ',ret)
      await this.db[handler]({...ret.args,txhash:ret.transactionHash})
    })
  }

  async start(){
    let events = [
      {name: 'ListingCreated',handler:'createListing'},
      {name: 'ListingCancelled',handler:'cancelListing'},
      {name: 'OfferCreated',handler: 'createOffer'},
      {name: 'OfferAccepted',handler: 'acceptOffer'},
      {name: 'OfferCancelled',handler: 'cancelOffer'},
      {name: 'OfferFinalized',handler: 'finalizeOffer'},
      {name: 'OfferDisputed', handler: 'disputeOffer'},
      {name: 'OfferArbitrated',handler: 'arbitrateOffer'}
    ]
    events.forEach(event => this.startOne(event.name,event.handler))
    console.log('chain event listener started')
  }
}

module.exports = ChainEventListener
