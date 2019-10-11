import {mapState,mapActions} from 'vuex'
import ArbitratorCard from './ArbitratorCard'
import ArbitratorOfferItem from './ArbitratorOfferItem'

const template = `
<div class="container-fluid mt-3">
  <div class="row">
    <div class="col-lg-2">
      <ez-arbitrator-card/>
    </div>
    <div class="col-lg-10">
    
      <div class="mt-3"/>
        <ez-arbitrator-offer-item v-for="(offer,idx) in offers" :data="offer" :key="idx"/>
      </div>

    </div>
  </div>
</div>  
`
const TenantPage = {
  template,
  components:{
    'ez-arbitrator-card': ArbitratorCard,
    'ez-arbitrator-offer-item': ArbitratorOfferItem
  },
  computed: mapState(['offers']),
  mounted: function(){
    this.$store.dispatch('getArbitratorOffers')
  }
}

export default TenantPage