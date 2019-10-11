import 'bootstrap/dist/css/bootstrap.css'
import './app.css'
import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'

import NavBar from './NavBar'
import Wallet from './Wallet'
import Util from './Util'

import reducer from './reducer'
import routes from './routes'

async function main(){//前端入口js
  Vue.use(Vuex)//状态管理
  Vue.use(VueRouter)//路由管理

  const store = new Vuex.Store(reducer)//IPFS处理器和智能合约，由各路由的状态去调用IPFS的函数和智能合约函数
  store.subscribe((mutation,state)=>console.log('debug =>',state))//每次重新加载时的状态

  const router = new VueRouter({routes,linkExactActiveClass:'active'})

  const wallet = new Wallet()//加载钱包地址
  wallet.onAccountChange = account => {
    store.commit('switchAccount',account)
  }
  wallet.onNetworkChange = network => {
    store.commit('switchNetwork',network)
  }
  await wallet.connectMetamask()

  let rate = await Util.getExchangeRate('CNY','ETH')
  store.commit('updateExchangeRate',rate)

  new Vue({
    el:'#app',
    template:`<div>
                <ez-navbar/>
                <router-view/>
              </div>`,
    store,
    router,//路由
    components:{
      'ez-navbar': NavBar,
    }
  })
}

main()
