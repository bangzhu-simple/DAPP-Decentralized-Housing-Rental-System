const template = `
<div id="indicators" class="carousel slide" data-ride="carousel">
  <ol class="carousel-indicators">
    <li data-target="#indicators" v-for="(image,idx) in images" :data-slide-to="idx" :key="idx" :class="{active:index==idx}"></li>
  </ol>
  <div class="carousel-inner">
    <div class="carousel-item" v-for="(image,idx) in images" :key="idx" :class="{active:index==idx}">
      <img :src="image" class="d-block w-100" alt="...">
    </div>
  </div>
  <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev" @click.prevent="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="sr-only">Previous</span>
  </a>
  <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next" @click.prevent="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="sr-only">Next</span>
  </a>
</div>
`

const ImageCarousel = {
  template,
  data:function(){
    return {
      index:0
    }
  },
  props: {
    images:{default:()=>[]}
  },
  methods:{
    prev(){
      if(this.index == 0 ) this.index = this.images.length - 1
      else this.index -= 1
    },
    next(){
      if(this.index == (this.images.length - 1)) this.index = 0 
      else this.index += 1
    }
  }
}

export default ImageCarousel