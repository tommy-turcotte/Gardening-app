<template>
    <div class="container has-text-centered">
            <img id="tileimg" :src="src_" width="800" height="450">
            <p></p>
            <button @click="changeSelect('tile1')" class="button is-rounded is-dark px-4">1</button>
            <button @click="changeSelect('tile2')" class="button is-rounded is-dark px-4">2</button>
            <button @click="changeSelect('tile3')" class="button is-rounded is-dark px-4">3</button>
            <button @click="changeSelect('tile4')" class="button is-rounded is-dark px-4">4</button>
            <button @click="changeSelect('tile5')" class="button is-rounded is-dark px-4">5</button>
            <button @click="changeSelect('tile6')" class="button is-rounded is-dark px-4">6</button>
    </div>
</template>
<script>
export default{
  name: 'BlockTiles',
  data (){
    return{
      src_: require("../assets/watchlist_demo.png")
    }
  },
  methods: {
    changeSelect(tnum) {
            if(tnum == "tile1"){
                this.src_=require("../assets/watchlist_demo.png");
            }
            else if(tnum == "tile2"){
                this.src_ = require("../assets/cropyield_demo.png");
            }
            else if(tnum == "tile3"){
                this.src_ = require("../assets/search_demo.png");
            }
            else if(tnum == "tile4"){
                this.src_ = require("../assets/location_demo.png");
            }
            else if(tnum == "tile5"){
                this.src_ = require("../assets/account_demo.png");
            }
            else if(tnum == "tile6"){
                this.src_ = require("../assets/notification_demo.png");
            }
            else{
                console.log("error: no tile selected")
            }
    }
  }
}

</script>

<style lang="scss">
  @import '~bulma';

  template {
      background-color: black;
  }
</style>
