import {mapState} from 'vuex'
import SellerOfferItem from './SellerOfferItem'

const template = `
<div>
  <ez-seller-offer-item v-for="(offer,idx) in offers" :data="offer" :key="idx"/>
</div>
`
const SellerOfferList = {
  template,
  components: {
    'ez-seller-offer-item': SellerOfferItem
  },
  computed: mapState(['offers'])
}

export default SellerOfferList