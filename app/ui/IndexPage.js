import {mapActions} from 'vuex'
import CityPicker from './CityPicker'
import HouseFilter from './HouseFilter'
import HouseList from './HouseList'

const template = `
<div class="container-fluid mt-3">
  <div class="row">
    <div class="col-lg-2">
      <ez-city-picker/>
    </div>
  
    <div class="col-lg-10">
      <ez-house-filter/>
      <ez-house-list/>
    </div>
  </div>
</div>  

`

const IndexPage = {
  template: template,
  components: {
    'ez-city-picker': CityPicker,
    'ez-house-filter': HouseFilter,
    'ez-house-list': HouseList
  },
  mounted: function(){
    this.$store.dispatch('searchHouses')
  }
}

export default IndexPage