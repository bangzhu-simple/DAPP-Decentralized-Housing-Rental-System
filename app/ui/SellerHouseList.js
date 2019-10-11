import {mapState,mapMutations} from 'vuex'
import SellerHouseCard from './SellerHouseCard'

const template = `
<div class="row" id="house-list">
  <div class="col-md-3" v-for="house in houses">
    <ez-seller-house-card :data="house"/>
  </div>
</div>
`

const SellerHouseList = {
  template,
  computed: mapState(['houses']),
  components:{
    'ez-seller-house-card': SellerHouseCard
  }
}

export default SellerHouseList