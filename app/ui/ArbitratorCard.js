import {mapState} from 'vuex'
//仲裁页的页面  加载仲裁item
const template = `
<div class="card">
  <img src="/img/arbitrator.png" class="card-img-top" alt="user-image">
  <div class="card-body">
    <h5 class="card-title"></h5>
    <p class="card-text"></p>
  </div>
</div>
`

const ArbitratorCard = {
  template,
  computed: mapState(['arbitrator']),
  mounted: function(){
  }
}

export default ArbitratorCard
