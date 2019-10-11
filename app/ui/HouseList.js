import {mapState,mapMutations} from 'vuex'
import HouseCard from './HouseCard'

const template = `
<div class="row" id="house-list">
  <div class="col-md-3" v-for="house in houses">
    <ez-house-card :data="house"/>
  </div>
</div>
`

const HouseList = {
  template,
  computed: mapState(['houses']),
  components:{
    'ez-house-card': HouseCard
  }
}

export default HouseList