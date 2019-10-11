import {mapState} from 'vuex'

const template = `
<div>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="#">
      <img src="/img/logo.png" style="height:30px">
    </a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link to="/" class="nav-link" exact-active-class="active">首页</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/landlord" class="nav-link" exact-active-class="active">房东后台</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/tenant" class="nav-link" exact-active-class="active">租户后台</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/arbitrator" class="nav-link" exact-active-class="active">仲裁后台</router-link>
        </li>
      </ul>

      <span class="navbar-text mr-3 badge badge-light" id="account-info">
        {{account}} | {{network}}
      </span>
    </div>
  </nav>
  <div class="line-spinner" :class="{invisible:!loading}"/>
</div>
`
const NavBar = {
  template: template,
  computed:{
    account(){ return this.$store.state.account},
    network(){
      switch(this.$store.state.network){
        case '1': return 'Mainnet'
        case '2': return 'Morden'
        case '3': return 'Ropsten'
        case '4': return 'Rinkeby'
        case '42': return 'Kovan'
        default: return `custom(${this.$store.state.network})`//chainId 每条链的标识
      }
    },
    loading(){ return this.$store.state.loading}
  }
}

export default NavBar
