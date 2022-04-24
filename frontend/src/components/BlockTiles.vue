<template>
    <div class="container has-text-centered">
            <img id="tileimg" :src="src_" width="800" height="450">
            <p></p>
            <button @click="changeSelect('tile1')" class="button is-rounded is-dark px-4">1</button>
            <button @click="changeSelect('tile2')" class="button is-rounded is-dark px-4">2</button>
    </div>
</template>
<script>
export default{
  name: 'BlockTiles',
  data (){
    return{
      src_: require("../assets/Home-loggedin.png")
    }
  },
  methods: {
    changeSelect(tnum) {
      if(tnum == "tile1"){
          this.src_=require("../assets/Home-loggedin.png");
      }
      else if(tnum == "tile2"){
          this.src_ = require("../assets/Watch_List-loggedin.png");
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
