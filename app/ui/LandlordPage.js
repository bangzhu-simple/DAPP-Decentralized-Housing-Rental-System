import {mapState,mapActions} from 'vuex'
import LandlordCard from './LandlordCard'

const template = `
<div class="container-fluid mt-3">
  <div class="row">
    <div class="col-lg-2">
      <ez-landlord-card/>
    </div>
    <div class="col-lg-10">
      <div>
        <nav class="nav nav-tabs">
          <li class="nav-item">
            <router-link to="/landlord" class="nav-link"  exact-active-class="active">我的房屋</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/landlord/offer" class="nav-link"  exact-active-class="active">我的订单</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/landlord/new" class="nav-link"  exact-active-class="active">上架新的房屋</router-link>
          </li>
        </nav>
      </div>

      <div class="mt-3"/>
        <router-view></router-view>
      </div>

    </div>
  </div>
</div>
`
const LandlordPage = {
  template,
  components:{
    'ez-landlord-card': LandlordCard
  },
  computed:mapState(['houses','offers']),
  mounted:function(){
    this.$store.dispatch('getLandlordHouses')
    this.$store.dispatch('getSellerOffers')
  }
}

export default LandlordPage
