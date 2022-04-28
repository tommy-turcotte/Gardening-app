<template>
    <NavBar />
    <div class="section is-medium has-background-link">
        <div class="columns is-centered is-mobile is-vcentered">
            <div class="column is-one-third">
                <div class="container has-text-centered pb-6">
                    <h2 class="title is-2">
                        Search Location
                    </h2>
                </div>
                 <div class="box">
                    <div v-if="!iscorrect" class="notification is-danger">
                        <button class="delete" @click="removeNotif()"></button>
                        No fields have correct inputs
                    </div>
                    <div v-if="wasAdded" class="notification is-success">
                        <button class="delete" @click="removeSuccess()"></button>
                        The Search was successfully Completed
                    </div>
                    <div v-if="!hasResults" class="notification is-danger">
                        <button class="delete" @click="removeResult()"></button>
                        No Locations Match your search
                    </div>                       
                    <h4 class="title is-4">
                        Climate Parameters
                    </h4>                                 
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

                    <label class="label">Location Name:</label>
                    <input v-model="name" class="input" type="text" placeholder="Mawlynnong, Meghalaya">

                    <div class="field is-grouped pt-4">
                        <p class="control">
                            <button class="button is-info" id="addLocbtn" @click="parseNums(ph, temp, humid, rain, potass, nitro, phos, name)">Search</button>
                        </p>
                    </div> 
                </div>

                <div class="container has-text-centered pb-6">
                    <h2 v-if="printTable" class="title is-2">
                        Search Results
                    </h2>
                </div>

                <div class="content has-text-centered">
                    <table v-if="printTable" class="table">
                        <thead>
                            <th>Longitude</th>
                            <th>Latitude</th>
                            <th>k_lvl</th>
                            <th>n_lvl</th>
                            <th>p_lvl</th>
                            <th>pH</th>
                            <th>Temperature</th>
                            <th>Humidity</th>
                            <th>Rainfall</th>
                            <th>Recommended Crop</th>
                        </thead>
                        <tbody>
                            <tr v-for="item in tableItems" :key="item.longitude">
                            <td>{{item.longitude}}</td>
                            <td>{{item.latitude}}</td>
                            <td>{{item.k_lvl}}</td>
                            <td>{{item.n_lvl}}</td>
                            <td>{{item.p_lvl}}</td>
                            <td>{{item.ph}}</td>
                            <td>{{item.temperature}}</td>
                            <td>{{item.humidity}}</td>
                            <td>{{item.rainfall}}</td>
                            <td>{{item.recommended_crop}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import NavBar from '../components/NavBar.vue'
import axios from 'axios'

export default{
    name: 'SearchView',
    components: {
         NavBar
    },
    data() {
        return{
            iscorrect: true,
            wasAdded: false,
            hasResults: true,
            printTable: false,
            ph: '',
            temp: '',
            humid: '',
            rain: '',
            potass: '',
            nitro: '',
            phos: '',
            name: '',
            tableItems: []
        }
    },
    methods: {
        addLocation(ph, temp, humid, rain, potass, nitro, phos, name){
            let first = true
            let url = `http://127.0.0.1:4321/searchResult?`;
            this.wasAdded=false
            if (name != ''){
                if(first){
                    url += `name=${name}`;
                    first=false
                }
                else {
                    url += `&name=${name}`; 
                }
            }
            if(first && !isNaN(ph)){
                url += `ph=${ph}`;
                first=false
            }
            else if(!isNaN(ph)) {
                url += `&ph=${ph}`; 
            }

            if(first && !isNaN(temp)){
                url += `temperature=${temp}`;
                first=false
            }
            else if(!isNaN(temp)){
                url += `&temperature=${temp}`; 
            }

            if(first && !isNaN(humid)){
                url += `humidity=${humid}`;
                first=false
            }
            else if(!isNaN(humid)){
                url += `&humidity=${humid}`; 
            }

            if(first && !isNaN(rain)){
                url += `rainfall=${rain}`;
                first=false
            }
            else if(!isNaN(rain)){
                url += `&rainfall=${rain}`; 
            }

            if(first && !isNaN(potass)){
                url += `k_lvl=${potass}`;
                first=false
            }
            else if(!isNaN(potass)){
                url += `&k_lvl=${potass}`; 
            }

            if(first && !isNaN(nitro)){
                url += `n_lvl=${nitro}`;
                first=false
            }
            else if(!isNaN(nitro)){
                url += `&n_lvl=${nitro}`; 
            }

            if(first && !isNaN(nitro)){
                url += `n_lvl=${nitro}`;
                first=false
            }
            else if(!isNaN(nitro)){
                url += `&n_lvl=${nitro}`; 
            }

            if(first && !isNaN(phos)){
                url += `p_lvl=${phos}`;
                first=false
            }
            else if(!isNaN(phos)){
                url += `&p_lvl=${phos}`; 
            }

            console.log(url)

            axios.get(url)
                    .then(response => {
                        console.log(response.data)
                        this.tableItems=[]
                        this.wasAdded=true
                        for(var i=0;i<response.data.length;i++){
                            let respHolder = {
                                "longitude": response.data[i].longitude,
                                "latitude": response.data[i].latitude,
                                "k_lvl": response.data[i].k_lvl,
                                "n_lvl": response.data[i].n_lvl,
                                "p_lvl": response.data[i].p_lvl,
                                "ph": response.data[i].ph,
                                "temperature": response.data[i].temperature,
                                "humidity": response.data[i].humidity,
                                "rainfall": response.data[i].rainfall,
                                "recommended_crop": response.data[i].recommended_crop
                            }
                            this.tableItems.push(respHolder)
                        }
                        this.printTable = true
                    })
                    .catch(error=> {
                        this.hasResults=false
                        console.log(error)});
        },
        parseNums(ph, temp, humid, rain, potass, nitro, phos, name){
            this.printTable=false
            this.iscorrect = true
            if(isNaN(parseFloat(ph)) && isNaN(parseFloat(temp)) && isNaN(parseFloat(humid)) && isNaN(parseFloat(rain)) && isNaN(parseInt(potass)) && isNaN(parseInt(nitro)) && isNaN(parseInt(phos)) && name==""){
                this.iscorrect = false
                return -1
            }
            else{
                
                
                this.addLocation(parseFloat(ph), parseFloat(temp), parseFloat(humid), parseFloat(rain), parseInt(potass), parseInt(nitro), parseInt(phos), name)
            }
        },
        removeNotif(){
            this.iscorrect=true
        },
        removeSuccess(){
            this.wasAdded=false
        },
        removeResult(){
            this.hasResults=true
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
