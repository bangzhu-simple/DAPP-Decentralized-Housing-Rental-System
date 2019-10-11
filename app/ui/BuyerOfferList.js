import {mapState} from 'vuex'
import BuyerOfferItem from './BuyerOfferItem'

const template = `
<div>
  <ez-buyer-offer-item v-for="(offer,idx) in offers" :data="offer" :key="idx"/>
</div>
`
const BuyerOfferList = {
  template,
  components: {
    'ez-buyer-offer-item': BuyerOfferItem
  },
  computed: mapState(['offers'])
}

export default BuyerOfferList