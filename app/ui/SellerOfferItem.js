import {mapState} from 'vuex'
import moment from 'moment'
import EthLayer from './EthLayer'

const template = `
<div class="media bg-light p-3">
  <img :src="imgUrl" class="mr-3" alt="..." style="width:200px">
  <div class="media-body">
    <h5 class="mt-0">{{data.listing.title}} </h5>
    <div class="mb-1">{{status}} <span :class="{'d-none':data.status!=2}">，支付截止时间：{{finalizes}}</span></div> 
    <div class="mb-1">{{checkIn}} - {{checkOut}}，共 {{data.nights}} 晚 </div>
    <div class="mb-1">{{data.buyer}}</div>
    <div class="btn-toolbar mt-3">
      <div class="btn-group mr-3">
        <button class="btn btn-secondary btn-sm" @click="rejectOffer" :disabled="data.status!=1">拒绝</button>
        <button class="btn btn-secondary btn-sm" @click="acceptOffer" :disabled="data.status!=1">接受</button> 
      </div>
      
      <div class="btn-group mr-3">
        <button class="btn btn-secondary btn-sm" @click="finalizeOffer":disabled="data.status!=2">完成订单</button>
      </div>
      
      <div class="btn-group mr-3">
        <button class="btn btn-secondary btn-sm" @click="disputeOffer" :disabled="data.status!=2">申请仲裁</button>
      </div>
    </div>
  </div>
</div>
`
const OfferItem = {
  template,
  props: {
    data:{default:{listing:{}}}
  },
  computed: {
    imgUrl(){ 
      let imageHashes = this.data.listing.imageHash.split(',')
      return `${this.$store.state.ipfsGateway}/ipfs/${imageHashes[0]}`
    },
    checkIn(){ return moment.unix(this.data.checkIn).format('YYYY-MM-DD')},
    checkOut(){ return moment.unix(this.data.checkOut).format('YYYY-MM-DD') },
    status(){
      switch(this.data.status){
        case 0: return '无效订单'
        case 1: return '新订单'
        case 2: return '订单已接受'
        case 3: return '订单存在争议'
        case 4: return '订单已支付'
        case 5: return '争议订单已解决'
        case 9: return '订单已取消'
      }
    },
    finalizes(){ return moment.unix(this.data.finalizes).format('YYYY-MM-DD hh:mm:ss a') }
  },
  methods:{
    async rejectOffer(){
      let eth = new EthLayer()
      await eth.cancelOffer(this.data.listingId,this.data.offerId)
    },
    async acceptOffer(){
      let eth = new EthLayer()
      await eth.acceptOffer(this.data.listingId,this.data.offerId)
    },
    async finalizeOffer(){
      let eth = new EthLayer()
      await eth.finalizeOffer(this.data.listingId,this.data.offerId)
    },
    async disputeOffer(){
      let eth = new EthLayer()
      await eth.disputeOffer(this.data.listingId,this.data.offerId)
    }    
  }
}

export default OfferItem