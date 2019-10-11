import {mapState,mapMutations,mapActions } from 'vuex'

const template = `
<form class="form-inline mb-3 p-3 bg-light" @submit.prevent="searchHouses">
  <label class="mr-3">价位区间</label>
  <input class="form-control mr-sm-1" type="search" placeholder="￥" style="width:100px" v-model="minPrice"> -
  <input class="form-control mr-sm-1 ml-sm-1" type="search" placeholder="￥" style="width:100px" v-model="maxPrice">
  <button class="btn btn-outline-secondary my-2 my-sm-0" type="submit">过滤房源</button>
</form>
`
//房屋搜索函数
const HouseFilter = {
  template,
  computed: {
    city(){ return this.$store.state.city },
    minPrice: {
      get(){ return this.$store.state.minPrice},
      set(v){ this.$store.commit('updateMinPrice',v) }
    },
    maxPrice: {
      get(){ return this.$store.state.maxPrice},
      set(v){ this.$store.commit('updateMaxPrice',v) }
    }
  },
  methods:mapActions(['searchHouses'])
}

export default HouseFilter
