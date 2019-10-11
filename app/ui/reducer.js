import Vue from 'vue'
import Toasted from 'vue-toasted'
import IpfsLayer from './IpfsLayer'
import EthLayer from './EthLayer'

Vue.use(Toasted,{
  position:'bottom-center',
  theme: 'bubble',
  duration: 5000,
  action: {
    text:'close',
    onClick: (e,toastObject) => toastObject.goAway(0)
  }
})

const reducer = {//同步各状态 并获取
  strict:true,
  state: {
    ipfsApi: {host:IPFS_API_HOST,port:IPFS_API_PORT,protocol:'http'},
    ipfsGateway: IPFS_GATEWAY_URL,
    arbitrator: ARBITRATOR,
    cities: CITIES.split(','),
    city: CITY,
    exchangeRate: 0.0005,  // 1 cny -> ... eth
    loading:false,
    account: '...',
    network: '...',
    minPrice: '',
    maxPrice: '',
    houses:[],
    house:{},
    landlord:{},
    tenant:{},
    offers:[]
  },
  mutations:{
    updateLoading(state,flag){
      state.loading = flag//重新加载
    },
    switchAccount(state,account){
      state.account = account
    },
    switchNetwork(state,network){
      state.network = network
    },
    updateExchangeRate(state,rate){
      state.exchangeRate = rate
    },
    switchCity(state,city){
      state.city = city
    },
    updateMinPrice(state,value){
      state.minPrice = value
    },
    updateMaxPrice(state,value){
      state.maxPrice = value
    },
    updateHouses(state,value){
      state.houses = value
    },
    updateHouse(state,value){
      state.house = value
    },
    updateLandlord(state,value){
      state.landlord = Object.assign({},state.landlord,value)
    },
    updateTenant(state,value){
      state.tenant = Object.assign({},state.tenant,value)
    },
    updateOffers(state,value){
      state.offers = value
    }
  },
  actions:{
    async searchHouses({commit,state}){
      let url = '/api/listing?t'
      if(state.city) url = url + `&city=${state.city}`
      if(state.minPrice) url = url + `&p1=${state.minPrice}`
      if(state.maxPrice) url = url + `&p2=${state.maxPrice}`
      try{
        commit('updateLoading',true)
        let rsp = await fetch(url)
        let houses = await rsp.json()
        commit('updateHouses',houses)
      }catch(e){
        Vue.toasted.error('搜索房源信息失败!')
      }finally{
        commit('updateLoading',false)
      }
    },
    async getHouse({commit,state},id){
      try{
        commit('updateLoading',true)
        let url = `/api/listing/${id}`
        let rsp = await fetch(url)
        let house = await rsp.json()
        let ipfs = new IpfsLayer(state.ipfsApi,state.ipfsGateway)
        let imageHashes = house.imageHash.split(',')
        house.imageUrls = imageHashes.map(hash => `${state.ipfsGateway}/ipfs/${hash}`)
        house.imageUrl = house.imageUrls[0]
        house.desc = await ipfs.fetchText(house.descHash)
        commit('updateHouse',house)
      }catch(e){
        Vue.toasted.error(`读取${id}#房屋数据失败!`)
      }finally{
        commit('updateLoading',false)
      }
    },
    async getLandlordHouses({commit,state}){
      try{
        commit('updateLoading',true)
        let url = `/api/seller/${state.account}/listing`
        let rsp = await fetch(url)
        let houses = await rsp.json()
        commit('updateHouses',houses)
        commit('updateLandlord',{houses: houses.length})
      }catch(e){
        Vue.toasted.error(`获取卖家房屋信息失败!`)
      }finally{
        commit('updateLoading',false)
      }
    },
    async getLandlordCredit({commit,state}){
      try{
        commit('updateLoading',true)
        let eth = new EthLayer()
        let credits = await eth.getUserCredit()
        commit('updateLandlord',{credit:credits[0].toString()})
      }catch(e){
        Vue.toasted.error(`获取卖家积分信息失败!`)
      }finally{
        commit('updateLoading',false)
      }
    },
    async getTenantHouses({commit,state}){
      try{
        commit('updateLoading',true)
        let url = `/api/buyer/${state.account}/listing`
        let rsp = await fetch(url)
        let houses = await rsp.json()
        commit('updateHouses',houses)
        commit('updateTenant',{houses: houses.length})
      }catch(e){
        Vue.toasted.error(`获取买家房屋信息失败!`)
      }finally{
        commit('updateLoading',false)
      }
    },
    async getTenantCredit({commit,state}){
      try{
        commit('updateLoading',true)
        let eth = new EthLayer()
        let credits = await eth.getUserCredit()
        commit('updateTenant',{credit:credits[1].toString()})
      }catch(e){
        Vue.toasted.error(`获取买家积分信息失败!`)
      }finally{
        commit('updateLoading',false)
      }
    },
    async getSellerOffers({commit,state}){
      try{
        commit('updateLoading',true)
        let url = `api/seller/${state.account}/offer`
        let rsp = await fetch(url)
        let offers = await rsp.json()
        commit('updateOffers',offers)
      }catch(e){
        Vue.toasted.error(`获取卖家订单信息失败!`)
      }finally{
        commit('updateLoading',false)
      }
    },
    async getBuyerOffers({commit,state}){
      try{
        commit('updateLoading',true)
        let url = `api/buyer/${state.account}/offer`
        let rsp = await fetch(url)
        let offers = await rsp.json()
        commit('updateOffers',offers)
      }catch(e){
        Vue.toasted.error(`获取买家订单信息失败!`)
      }finally{
        commit('updateLoading',false)
      }
    },
    async getArbitratorOffers({commit,state}){
      try{
        commit('updateLoading',true)
        let url = `api/arbitrator/${state.arbitrator}/offer`
        let rsp = await fetch(url)
        let offers = await rsp.json()
        commit('updateOffers',offers)
      }catch(e){
        Vue.toasted.error(`获取仲裁数据失败!`)
      }finally{
        commit('updateLoading',false)
      }
    }
  }
}

export default reducer
