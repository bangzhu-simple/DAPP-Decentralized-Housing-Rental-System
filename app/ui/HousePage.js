import Vue from 'vue'
import {mapState } from 'vuex'
import moment from 'moment'
import VCalendar from 'v-calendar'
import 'v-calendar/lib/v-calendar.min.css'
import Web3 from 'web3'
import EthLayer from './EthLayer'
import ImageCarousel from './ImageCarousel'
//查看房屋详情页页面
Vue.use(VCalendar, {
  firstDayOfWeek: 2,  // 
});

const template = `
<div class="container mt-3">
  <h1>{{house.title}}</h1>
  <address>城市：{{house.city}} | 房东保证金：~{{deposit}} ETH</address>
  <div class="row">
    <div class="col-md-8">
      <ez-image-carousel :images="house.imageUrls"/>
      <div id="desc" class="my-3" style="white-space:pre-wrap">{{house.desc}}</div>
    </div>
    <div class="col-md-4">
      <form class="p-3 bg-light">
        <h4>￥{{house.price}}/晚 ~{{ethPrice}} ETH</h4>
        <div class="form-group">
          <label>入住日期</label>
          <input type="date" class="form-control" v-model="checkIn">
        </div>
        <div class="form-group">
          <label>退房日期</label>
          <input type="date" class="form-control" v-model="checkOut">
        </div>
        <button class="btn btn-primary btn-block" @click.prevent="makeOffer">马上预定</button>
      </form>
      <v-calendar class="mt-3" style="width:100%" :attributes="calendarAttrs"></v-calendar>
    </div>
  </div>
</div>
`

const HousePage = {
  template,
  props:{
    id: {default:0}
  },
  data:function(){
    return {
      states: ['空闲','已预定','已租出'],
      checkIn: moment().format('YYYY-MM-DD'),
      checkOut: moment().add(1,'days').format('YYYY-MM-DD'),

    }
  },
  methods:{
    async makeOffer(){
      let d1 = moment(this.checkIn)
      let d2 = moment(this.checkOut)
      let nights = moment.duration(d2.diff(d1)).days()
      let web3 = new Web3()
      let value = web3.toWei(this.house.price * nights * this.exchangeRate,'ether')
      let offer = {
        listingId: this.house.listingId,
        value:value,
        checkIn: d1.unix(),
        nights:nights,
        arbitrator: this.arbitrator
      }
      console.log(offer)
      let eth = new EthLayer()
      await eth.makeOffer(offer)
    },

    async reserve(){
      let eth = new EthLayer()
      await eth.reserveHouse(this.id)
      this.$store.dispatch('getHouse',this.id)
    }
  },
  computed:{
    house(){ return this.$store.state.house},
    exchangeRate() { return this.$store.state.exchangeRate},
    ethPrice() { return (this.exchangeRate * this.house.price).toFixed(5)},
    arbitrator(){ return this.$store.state.arbitrator},
    calendarAttrs(){
      return [
        {
          key: 'today',
          highlight: {
            backgroundColor: '#ff8080',
          },
          dates:(this.$store.state.house && this.$store.state.house.offers) ? this.$store.state.house.offers.map(o => ({start:moment.unix(o.checkIn).toDate(),span:o.nights})): []
        }
      ]
    },
    deposit(){
      let web3 = new Web3()
      let ethValue =  web3.fromWei(this.house.deposit,'ether')
      return parseFloat(ethValue).toFixed(5)
    }
  },
  mounted:function(){
    this.$store.dispatch('getHouse',this.id)
  },
  components:{
    'ez-image-carousel': ImageCarousel
  }
}

export default HousePage
