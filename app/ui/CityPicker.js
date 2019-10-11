import {mapState,mapMutations,mapActions} from 'vuex'

const CityPicker = {
  template:`<div class="list-group" id="city-list">
              <a href="#" class="list-group-item" :class="{active: c == city}" v-for="c in cities" @click="selectCity(c)">{{c}}</a>
            </div>`,
  computed: mapState(['city','cities']),
  methods: {
    selectCity(c){
      this.$store.commit('switchCity',c)
      this.$store.dispatch('searchHouses')
    }
  }
}

export default CityPicker