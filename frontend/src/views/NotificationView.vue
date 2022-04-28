<template>
    <NavBar />
    <div class="section has-background-link">
        <div class="columns is-centered">
            <div class="column is-half">
                <div class="container has-text-centered pb-6">
                    <h2 class="title is-2">
                        Notifications
                    </h2>
                    <div class="box">
                        <div v-for="notifs in notifList" :key="notifs.date_time">
                            <div class="block pb-3">
                                <div v-if="notifs.new" class="notification is-link">
                                    <h5 class="title is-5">Location: {{notifs.longitude}}, {{notifs.latitude}}</h5>
                                    <h5 class="subtitle is-5">{{notifs.text}}</h5>
                                    <p>{{notifs.time}} on {{notifs.date}}</p>
                                </div>    
                                <div v-else class="notification is-link is-light">
                                    <h5 class="title is-5">Location: {{notifs.longitude}}, {{notifs.latitude}}</h5>
                                    <h5 class="subtitle is-5">{{notifs.text}}</h5>
                                    <p>{{notifs.time}} on {{notifs.date}}</p>
                                </div>         
                            </div>  
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
import NavBar from '../components/NavBar.vue'
import axios from 'axios'

export default{
  name: 'NotificationView',
  components: {
         NavBar
    },
  data (){
    return{
        notifList : []
    }
  },
  created(){
      axios.get(`http://127.0.0.1:4321/notifications`)
        .then(response => {
            for(var i=0;i<response.data.length;i++){
                let dateHolder = new Date(response.data[i].date_time)
                let notifHolder = {
                    "date": dateHolder.toISOString().substring(0, 10),
                    "time": dateHolder.toISOString().substring(11, 19),
                    "latitude": response.data[i].latitude,
                    "longitude": response.data[i].longitude,
                    "new": response.data[i].new,
                    "text": response.data[i].text
                }
                this.notifList.push(notifHolder)
            }
        })
        .catch(error=> console.log(error));
  }
}
</script>

<style lang="scss">
  @import '~bulma';
</style>
