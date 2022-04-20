<script setup>
import Navbar from './components/NavBar.vue'
</script>

<template>
   <body>
       <Navbar />
    <router-view />
    <footer class="footer">
        <div class="container has-text-centered">
            <a id="gitlink" href="https://github.com/samuel-bazinet/WAD-Final-Project-Group-22">Project Github repository</a>
            <p id="names">By Samuel Bazinet, Tommy Turcotte, Liam Turcotte, and Guillaume Flores</p>
        </div>
    </footer>
   </body>
</template>

<style lang="scss">
  @import "../node_modules/bulma/bulma.sass";
  .footer {
    background-color: #363636!important;
  }
  #names {
      color: white;
  }
  #gitlink:hover{
      color: black;
  }
</style>

