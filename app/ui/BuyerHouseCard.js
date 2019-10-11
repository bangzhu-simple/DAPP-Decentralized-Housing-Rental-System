import {mapState,mapMutations} from 'vuex'
import moment from 'moment'
import EthLayer from './EthLayer'
//房东页面 
const template = `
<div class="card mb-3" style="cursor:pointer" @click="$router.push(url)">
  <img :src="imgUrl" class="card-img-top" alt="house-image">
  <div class="card-body">
    <h5 class="card-title">{{data.title}}</h5>
    <p class="card-text">￥{{data.price}} | {{data.city}} </p>
    <p v-for="(stay,idx) in stays" :key="idx">{{stay.checkIn}} ~ {{stay.checkOut}}</p>
  </div>
</div>
`

const BuyerHouseCard = {
  template,
  data(){
    return {
      states: ['空闲','已预订','已租出']
    }
  },
  props:{
    data:{default:{listingId:'0'}}
  },
  computed:{
    imgUrl(){
      let imageHashes = this.data.imageHash.split(',')
      return `${this.$store.state.ipfsGateway}/ipfs/${imageHashes[0]}`
    },
    url(){
      return `/property/${this.data.listingId}`
    },
    stays(){
      if(!this.data || !this.data.offers) return  []
      return this.data.offers.map(offer => ({
        checkIn: moment.unix(offer.checkIn).format('YYYY-MM-DD'),
        checkOut: moment.unix(offer.checkOut).format('YYYY-MM-DD'),
        nights: offer.nights
      }))
    }
  },
  methods:{
    async cancelReserve(){
      let eth = new EthLayer()
      await eth.cancelReserve(this.data.onChainId)
    },
    async confirmRental(){
      let eth = new EthLayer()
      await eth.confirmRental(this.data.onChainId)
    }
  }
}

export default BuyerHouseCard
