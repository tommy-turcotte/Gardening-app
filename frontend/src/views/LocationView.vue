<template>
    <NavBar />
    <div class="section is-medium has-background-link">
        <div class="columns is-centered is-mobile is-vcentered">
            <div class="column is-one-third">
                <div class="container has-text-centered pb-6">
                    <h2 class="title is-2">
                        Add Location
                    </h2>
                </div>
                 <div class="box">
                    <div v-if="!iscorrect" class="notification is-danger">
                        <button class="delete" @click="removeNotif()"></button>
                        One or more fields have incorrect inputs
                    </div>
                    <div v-if="wasAdded" class="notification is-success">
                        <button class="delete" @click="removeSuccess()"></button>
                        The Location was successfully added
                    </div>                   
                    <h4 class="title is-4">
                        Location Parameters
                    </h4>                                 
                    <div class="field is-grouped is-grouped-centered is-grouped-multiline">
                        <p class="control">
                            <label class="label">Enter Longitude:</label>
                            <input v-model="lon" class="input" type="text" placeholder="38.8897">
                        </p>
                        <p class="control">
                            <label class="label">Enter Latitude:</label>
                            <input v-model="lat" class="input" type="text" placeholder="-77.0089">
                        </p>
                    </div>
                    <div class="field is-grouped is-grouped-centered is-grouped-multiline">
                        <p class="control">
                            <label class="label"> Acidity (pH):</label>
                            <input v-model="ph" class="input" type="text" placeholder="1.87">
                        </p>
                        <p class="control">
                            <label class="label"> Temperature(C):</label>
                            <input v-model="temp" class="input" type="text" placeholder="43">
                        </p>
                    </div>
                    <div class="field is-grouped is-grouped-centered is-grouped-multiline">
                        <p class="control">
                            <label class="label"> Humidity (%):</label>
                            <input v-model="humid" class="input" type="text" placeholder="53">
                        </p>
                        <p class="control">
                            <label class="label"> Rainfall (mm):</label>
                            <input v-model="rain" class="input" type="text" placeholder="210">
                        </p>
                    </div>
                    
                    <h4 class="title is-4">
                        Nutrient Levels in Soil
                    </h4>
                    <div class="field is-grouped is-grouped-centered is-grouped-multiline">
                        <p class="control">
                            <label class="label">Potassium:</label>
                            <input v-model="potass" class="input" type="text" placeholder="90">
                        </p>
                        <p class="control">
                            <label class="label">Nitrogen:</label>
                            <input v-model="nitro" class="input" type="text" placeholder="43">
                        </p>
                        <p class="control">
                            <label class="label">Phosphorus:</label>
                            <input v-model="phos" class="input" type="text" placeholder="52">
                        </p>
                    </div>

                    <label class="label">Enter Location Name (Optional):</label>
                    <input v-model="name" class="input" type="text" placeholder="Mawlynnong, Meghalaya">

                    <div class="field is-grouped pt-4">
                        <p class="control">
                            <button class="button is-info" id="addLocbtn" @click="parseNums(lon, lat, ph, temp, humid, rain, potass, nitro, phos, name, addToWatchList)">Add Location</button>
                        </p>
                        <p class="control">
                            <label class="checkbox">
                                <input v-model="addToWatchList" type="checkbox">
                                Add this Location to my watch list
                            </label>
                        </p>
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
    name: 'RegisterView',
    components: {
         NavBar
    },
    data() {
        return{
            iscorrect: true,
            wasAdded: false,
            lon: '',
            lat: '',
            ph: '',
            temp: '',
            humid: '',
            rain: '',
            potass: '',
            nitro: '',
            phos: '',
            name: '',
            addToWatchList: false,
        }
    },
    methods: {
        addLocation(lon, lat, ph, temp, humid, rain, potass, nitro, phos, name, addToWatchList){
            let url = `http://127.0.0.1:4321/addlocation?longitude=${lon}&latitude=${lat}&k_lvl=${potass}&n_lvl=${nitro}&p_lvl=${phos}&ph=${ph}&temperature=${temp}&humidity=${humid}&rainfall=${rain}&addToWatchList=${addToWatchList}`;
            this.wasAdded=false
            if (name != ''){
                url += `&name=${name}`; 
            }
            axios.get(url)
                    .then(response => {
                        if(response.status === 201){
                            this.wasAdded=true
                        }
                    })
                    .catch(error=> console.log(error));
        },
        parseNums(lon, lat, ph, temp, humid, rain, potass, nitro, phos, name, addToWatchList){
            this.iscorrect = true
            if( isNaN(parseFloat(lon)) || isNaN(parseFloat(lat)) || isNaN(parseFloat(ph)) || isNaN(parseFloat(temp)) || isNaN(parseFloat(humid)) || isNaN(parseFloat(rain)) || isNaN(parseInt(potass)) || isNaN(parseInt(nitro)) || isNaN(parseInt(phos)) ){
                this.iscorrect = false
            }
            else{
                var watchListHolder = 0;
                if (addToWatchList == true){
                    watchListHolder = 1
                }
                else {
                    watchListHolder = 0
                }
                this.addLocation(parseFloat(lon), parseFloat(lat), parseFloat(ph), parseFloat(temp), parseFloat(humid), parseFloat(rain), parseInt(potass), parseInt(nitro), parseInt(phos), name, watchListHolder)
            }
        },
        removeNotif(){
            this.iscorrect=true
        },
        removeSuccess(){
            this.wasAdded=false
        }
    }
}

</script>

<style lang="scss">
  @import '~bulma';
  h2 {
      color: white!important;
  }
</style>
