import {mapState,mapMutations} from 'vuex'
import BuyerHouseCard from './BuyerHouseCard'

const template = `
<div class="row mt-3">
  <div class="col-md-3" v-for="house in houses">
    <ez-buyer-house-card :data="house"/>
  </div>
</div>
`

const BuyerHouseList = {
  template,
  computed: mapState(['houses']),
  components:{
    'ez-buyer-house-card': BuyerHouseCard
  }
}

export default BuyerHouseList