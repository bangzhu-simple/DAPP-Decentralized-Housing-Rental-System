import {mapState} from 'vuex'

const template = `
<div class="card">
  <img src="/img/tenant.jpg" class="card-img-top" alt="user-image">
  <div class="card-body">
    <h5 class="card-title"></h5>
    <p class="card-text"></p>
  </div>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">房屋总数：<span id="houses">{{tenant.houses}}</span></li>
    <li class="list-group-item">信誉积分：<span id="credit">{{+tenant.credit + 100}}</span></li>
  </ul>
</div>
`

const TenantCard = {
  template,
  computed: mapState(['tenant']),
  mounted: function(){
    this.$store.dispatch('getTenantCredit')
  }
}

export default TenantCard