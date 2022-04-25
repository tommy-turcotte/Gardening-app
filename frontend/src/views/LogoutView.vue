<template>
    <NavBar />
    <p> Please Wait to be redirected to home</p>
</template>
<script>
import NavBar from '../components/NavBar.vue'
import axios from 'axios'

export default{
    name: 'LogOut',
    components: {
        NavBar
    }, 
    created(){
        axios.get("http://127.0.0.1:4321/logout")
        .then(response=> {
          if (response.status == 200){
            console.log("successfully logged out")
            this.$router.push('/');
          }
        })
        .catch(error=> console.log(error));
     }
}
</script>