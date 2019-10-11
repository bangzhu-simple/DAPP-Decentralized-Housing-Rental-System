import {mapState} from 'vuex'
import IpfsLayer from './IpfsLayer'
import EthLayer from './EthLayer'
//上架房屋页面
const template = `
<div class="container">
 <div class="row">
  <div style="display: none;" class="alert alert-success col-sm-8" id="msg"></div>
 </div>
 <div class="row">
  <form class="col-md-8" id="add-item-to-store">


   <div class="form-group row">
    <label for="deposit" class="col-sm-2 control-label">发布保证金</label>
    <div class="col-sm-10">
     <input type="number" class="form-control" name="price" required="required" v-model="house.deposit">
    </div>
   </div>

   <div class="form-group row">
    <label for="city" class="col-sm-2 control-label">所在城市</label>
    <div class="col-sm-10">
     <select class="form-control" v-model="house.city">
      <option v-for="(city,idx) in cities" :key="idx">{{city}}</option>
     </select>
    </div>
   </div>

   <div class="form-group row">
    <label for="title" class="col-sm-2 control-label">标题</label>
    <div class="col-sm-10">
     <input type="text" name="title" class="form-control" placeholder="房型、面积、朝向等" required="required" v-model="house.title">
    </div>
   </div>

   <div class="form-group row">
    <label for="desc" class="col-sm-2 control-label">简介</label>
    <div class="col-sm-10">
     <textarea class="form-control" name="desc" rows="10" placeholder="房屋的详细信息" required="required" v-model="house.desc"></textarea>
    </div>
   </div>

   <div class="form-group row">
    <label for="price" class="col-sm-2 control-label">出租价格</label>
    <div class="col-sm-10">
     <input type="number" class="form-control" name="price" required="required" v-model="house.price">
    </div>
   </div>

   <div class="form-group row">
    <label for="image" class="col-sm-2 control-label">上传图片</label>
    <div class="col-sm-10">
      <input type="file" multiple class="form-control" required="required" @change="updateImageReader">
      <div class="preview row mt-3">
        <div v-for="(image,idx) in images" :key="idx" class="col-sm-4">
          <img  :src="getBlobUrl(image)" style="width:100%;max-width:100%">
        </div>
    </div>
    </div>
   </div>

   <div class="form-group row">
    <div class="col-sm-offset-2 col-sm-10">
     <button type="submit" class="btn btn-primary" id="list" @click.prevent="listing">确认上架</button>
    </div>
   </div>

  </form>

  <div class="col-md-4 ">

  </div>
 </div>
</div>

`

const ListingPage = {
  template,
  data:function(){
    return {
      images: [],
      house:{
        deposit: '200',
        city: '北京',
        title:'大三居，主卧朝阳',
        price: '300',
        desc:'随时看房',
        image:''
      }
    }
  },
  computed:mapState(['ipfsApi','ipfsGateway','account','exchangeRate','cities']),
  methods:{
    updateImageReader(event){
      let files = Array.prototype.slice.call(event.target.files,0)
      this.images = this.images.concat(files)
      console.log(this.images)
      /*
      if(event.target.files.length === 0) {
        this.reader = null
        return
      }
      let file = event.target.files[0]
      console.log(file)
      this.reader = new window.FileReader()
      this.reader.addEventListener('progress',function(){console.log('progress => ',arguments)})
      this.reader.readAsArrayBuffer(file)
      */
    },
    getBlobUrl(file){
      return URL.createObjectURL(file)
    },
    async getBlobReader(file){
      return new Promise((resolve,reject) => {
        let reader = new window.FileReader
        reader.addEventListener('load',()=>resolve(reader))
        reader.readAsArrayBuffer(file)
      })
    },
    async listing(){
      //let eth = new EthLayer()
      //await eth.setHashes()
      //return
      let ipfs = new IpfsLayer(this.ipfsApi,this.ipfsGateway)
      let imageHashes = []
      for(let i=0;i<this.images.length;i++){
        let reader = await this.getBlobReader(this.images[i])
        let imageHash = await ipfs.uploadByReader(reader)
        imageHashes.push(imageHash)
      }
      //console.log(imageHashes)
      //return
      this.house.imageHash = imageHashes.join(',')
      this.house.descHash = await ipfs.uploadText(this.house.desc)
      //this.house.deposit = web3.toWei(0.01,'ether')
      this.house.depositWei = web3.toWei( +this.house.deposit * this.exchangeRate,'ether')
      console.log(this.house)
      let eth = new EthLayer()
      await eth.createListing(this.house)
    }
  }
}

export default ListingPage
