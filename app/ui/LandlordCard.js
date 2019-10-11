import {mapState} from 'vuex'
//房东后台页面
const template = `
<div class="card">
  <img src="/img/landlord.jpg" class="card-img-top" alt="user-image">
  <div class="card-body">
    <h5 class="card-title"></h5>
    <p class="card-text"></p>
  </div>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">房屋总数：<span id="houses">{{landlord.houses}}</span></li>
    <li class="list-group-item">信誉积分：<span id="credit">{{+landlord.credit + 100}}</span></li>
  </ul>
</div>
`

const LandlordCard = {
  template,
  props: {
    houses: {default:0},
    credit: {default:0}
  },
  computed:mapState(['landlord']),
  mounted:function(){
    this.$store.dispatch('getLandlordHouses')
    this.$store.dispatch('getLandlordCredit')
  }
}

export default LandlordCard
