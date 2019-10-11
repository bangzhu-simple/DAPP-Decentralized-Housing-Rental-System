import {mapState} from 'vuex'
import Web3 from 'web3'
import moment from 'moment'
import EthLayer from './EthLayer'

const template = `
<div class="media bg-light p-3">
  <img :src="imgUrl" class="mr-3" alt="..." style="width:200px">
  <div class="media-body">
    <h5 class="mt-0">{{data.listing.title}} </h5>
    <div class="mb-1">{{checkIn}} - {{checkOut}}，共 {{data.nights}} 晚 </div>
    <div class="mb-1">卖家：{{data.listing.seller}}</div>
    <div class="mb-1">买家：{{data.buyer}}</div>
    <div class="mb-1">买家订金：{{data.value}} WEI</div>
    <div class="btn-toolbar mt-3">
      <label class="mr-3">返还金额</label>
      <input type="number" v-model="refund" class="mr-1">
      <label class="mr-3">WEI</label>
      <button class="btn btn-secondary btn-sm" @click="arbitratorOffer">仲裁</button>  
    </div>
  </div>
</div>
`
const OfferItem = {
  template,
  props: {
    'data': {default: {listing:{}}}
  },
  data: function(){
    return {
      refund: 0
    }
  },
  computed: {
    imgUrl(){ 
      let imageHashes = this.data.listing.imageHash.split(',')
      return `${this.$store.state.ipfsGateway}/ipfs/${imageHashes[0]}` 
    },
    checkIn(){ return moment.unix(this.data.checkIn).format('YYYY-MM-DD')},
    checkOut(){ return moment.unix(this.data.checkOut).format('YYYY-MM-DD') },
    value(){ 
      let web3 = new Web3()
      return web3.fromWei(this.data.value,'ether')
    }
  },
  methods:{
    async arbitratorOffer(){
      let eth = new EthLayer()
      await eth.arbitrateOffer(this.data.listingId,this.data.offerId,+this.refund)
    },
    
  }
}

export default OfferItem