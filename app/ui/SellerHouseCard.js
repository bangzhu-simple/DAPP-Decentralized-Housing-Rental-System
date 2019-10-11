import {mapState,mapMutations} from 'vuex'
import moment from 'moment'
import Web3 from 'web3'
import EthLayer from './EthLayer'
//租户后台页面
const template = `
<div class="card mb-3" style="cursor:pointer" @click="$router.push(url)">
  <img :src="imgUrl" class="card-img-top" alt="house-image">
  <div class="card-body">
    <h5 class="card-title">{{data.title}}</h5>
    <p class="card-text">
      <span class="badge badge-secondary" title="价格">￥{{data.price}}/天 </span>
      <span class="badge badge-secondary" title="城市">{{data.city}} </span>
      <span class="badge badge-secondary" title="保证金">~{{deposit}} ETH</span>
      <span class="badge badge-danger" :class="{'d-none':data.status!=9}">已下架</span>
    </p>
    <a href="#" class="card-link" :class="{disabled:data.status==9}" @click.prevent.stop="cancelListing">下架这个房屋</a>
  </div>
</div>
`

const SellerHouseCard = {
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
      if(!this.data.imageHash) return ''
      let imageHashes = this.data.imageHash.split(',')
      return `${this.$store.state.ipfsGateway}/ipfs/${imageHashes[0]}`
    },
    url(){
      return `/property/${this.data.listingId}`
    },
    createAt(){
      return moment.unix(this.data.createAt).format('YYYY-MM-DD')
    },
    deposit(){
      let web3 = new Web3()
      let ethValue = web3.fromWei(this.data.deposit,'ether')
      return parseFloat(ethValue).toFixed(5)
    }
  },
  methods:{
    async cancelListing(event){
      //event.preventDefault()
      //event.stopPropagation()
      //console.log('here')
      let eth = new EthLayer()
      await eth.cancelListing(this.data.listingId)
    }
  }
}

export default SellerHouseCard
