import {mapState,mapActions} from 'vuex'
import TenantCard from './TenantCard'
import HouseList from './HouseList'
import BuyerOfferItem from './BuyerOfferItem'

const template = `
<div class="container-fluid mt-3">
  <div class="row">
    <div class="col-lg-2">
      <ez-tenant-card/>
    </div>
    <div class="col-lg-10">
      <nav class="nav nav-tabs">
        <li class="nav-item">
          <router-link to="/tenant" class="nav-link"  exact exact-active-class="active">我的房屋</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/tenant/offer" class="nav-link"  exact-active-class="active">我的订单</router-link>
        </li>
      </nav>
    
      <router-view></router-view>
      <!--div class="mt-3"/>
        <ez-buyer-offer-item v-for="offer in offers" :data="offer"/>
      </div-->

      <!--ez-house-list class="mb-3 mr-3"/-->
    </div>
  </div>
</div>  
`
const TenantPage = {
  template,
  components:{
    'ez-tenant-card': TenantCard,
    'ez-house-list': HouseList,
    'ez-buyer-offer-item': BuyerOfferItem
  },
  computed: mapState(['houses','offers']),
  mounted: function(){
    this.$store.dispatch('getTenantHouses')
    this.$store.dispatch('getBuyerOffers')
  }
}

export default TenantPage