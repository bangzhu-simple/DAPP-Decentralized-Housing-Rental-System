import {mapState,mapMutations} from 'vuex'
import Web3 from 'web3'
import EthLayer from './EthLayer'

const template = `
<div class="card mb-3" style="cursor:pointer" @click="$router.push(url)">
  <img :src="imgUrl" class="card-img-top" alt="house-image">
  <div class="card-body">
    <h5 class="card-title">{{data.title}}</h5>
    <p class="card-text">
      <span class="badge badge-info" title="价格">￥{{data.price}}/天</span>
      <span class="badge badge-info" title="城市">{{data.city}} </span>
      <span class="badge badge-success" title="房东保证金"> ~{{deposit}} ETH</span>
    </p>
  </div>
</div>
`

const HouseCard = {
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
    deposit(){
      let web3 = new Web3()
      let ethValue =  web3.fromWei(this.data.deposit,'ether')
      return parseFloat(ethValue).toFixed(5)
    }
  },
  methods:{
  }
}

export default HouseCard