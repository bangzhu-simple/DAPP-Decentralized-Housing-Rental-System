import IndexPage from './IndexPage'
import LandlordPage from './LandlordPage'
import TenantPage from './TenantPage'
import ArbitratorPage from './ArbitratorPage'
import HousePage from './HousePage'
import ListingPage from './ListingPage'
import SellerOfferList from './SellerOfferList'
import SellerHouseList from './SellerHouseList'
import BuyerOfferList from './BuyerOfferList'
import BuyerHouseList from './BuyerHouseList'
//前端路由
const routes = [
  {'path': '/', component: IndexPage},
  {
    path: '/landlord',
    component: LandlordPage,
    children:[
      {path:'',component:SellerHouseList,alias:'listing'},
      {path:'offer',component:SellerOfferList},
      {path: 'new', component: ListingPage}
    ]
  },
  {
    path: '/tenant',
    component: TenantPage,
    children: [
      {path:'',component:BuyerHouseList,alias:'listing'},
      {path: 'offer',component:BuyerOfferList}
    ]
  },
  {'path': '/arbitrator', component: ArbitratorPage},
  {'path': '/property/:id',component: HousePage,props: route => route.params},
]

export default routes
