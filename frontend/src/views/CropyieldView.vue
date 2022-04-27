

<template>
    <NavBar />
    <div class="section is-medium has-background-link">
        <div class="columns is-centered">
            <div class="column is-half">
                <div class="container has-text-centered pb-6">
                    <h2 class="title is-2">
                        Crops and Yields
                    </h2>
                </div>
                <table class="table is-hoverable">
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
                        <tr v-for="(response, index) in responseData" :key="response.longitude" @click="getLocData(index)">
                            <td>{{response.longitude}}</td>
                            <td>{{response.latitude}}</td>
                            <td>{{response.k_lvl}}</td>
                            <td>{{response.n_lvl}}</td>
                            <td>{{response.p_lvl}}</td>
                            <td>{{response.ph}}</td>
                            <td>{{response.temperature}}</td>
                            <td>{{response.humidity}}</td>
                            <td>{{response.rainfall}}</td>
                            <td>{{response.recommended_crop}}</td>
                        </tr>
                    </tbody>
                </table>
                <div>
                    <div class="section">
                        <div class="columns is-centered">
                            <div class="column">
                                <h3 v-if="tableBuild" class="title is-3">Crop Quality</h3>
                                <h3 v-if="tableBuild" class="title is-3">for Selected Location:</h3>
                                <div v-if="broken" @click="removeNotif()" class="notification is-danger">
                                    <button class="delete"></button>
                                    No yield data for Location
                                </div>
                                <div v-if="wrongField" @click="removeWrong()" class="notification is-danger">
                                    <button class="delete"></button>
                                    Incorrect Fields
                                </div>
                            </div>
                            <div class="column">
                                <table v-if="tableBuild" class="table is-bordered">
                                    <thead>
                                        <th>Crop</th>
                                        <th>Yield</th>
                                        <th>Quality</th>
                                    </thead>
                                    <tbody>
                                        <tr v-for="yields in yieldData" :key="yields.yield">
                                            <td>{{yields.crop}}</td>
                                            <td>{{yields.yield}}</td>
                                            <td>{{yields.label}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="init" class="section">
                    <div class="box">
                        <div class="field is-grouped is-grouped-centered is-grouped-multiline">
                            <p class="control">
                            <label class="label">Enter Crop:</label>
                            <input v-model="incCrop" class="input" type="text" placeholder="Maize">
                        </p>
                        <p class="control">
                            <label class="label">Enter Yield:</label>
                            <input v-model="incYield" class="input" type="text" placeholder="4.43">
                        </p>
                        </div>
                        <div class="field is-grouped pt-4">
                            <p class="control">
                                <button class="button is-info" @click="sendVals(incCrop, incYield, index)">Add Crop</button>
                            </p>
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
import $ from 'jquery'

export default{
    name:'CropyieldView',
    components: {
         NavBar
    },
    data(){
        return{
            responseData: [],
            yieldData: [],
            tableBuild: false,
            broken: false,
            init: false,
            wrongField: false,
            incYield: "",
            incCrop:"",
            index:Number,
        }
    },
    beforeCreate(){
      axios.get(`http://127.0.0.1:4321/watchlist`)
        .then(response => {
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
                this.responseData.push(respHolder)
            }
        })
        .catch(error=> console.log(error));
    },
    methods: {
        getLocData(index){
            this.deselectRows()
            $("table tr:eq("+index+")").addClass("is-selected")
            this.tableBuild = false
            this.index=index
            this.init=true

            axios.get(`http://127.0.0.1:4321/locationYields?longitude=${this.responseData[index].longitude}&latitude=${this.responseData[index].latitude}`)
                .then(response => {
                    this.yieldData=[]
                    if(response.status==200){
                        for(var i=0;i<response.data.length;i++){
                        let respHolder = {
                            "crop": response.data[i].crop,
                            "yield": response.data[i].yield,
                            "label": this.cropQualityString(response.data[i].label),
                        }
                        this.yieldData.push(respHolder)
                    }
                    }
                    else{
                        this.broken = true
                    }
                    this.tableBuild = true
                })
                .catch(error=> {
                    console.log(error)
                    this.broken=true
                });

        },
        deselectRows(){
            for(var i=0;i<this.responseData.length;i++){
                $("table tr:eq("+i+")").removeClass("is-selected")
            }
        },
        cropQualityString(value){
            if(value==1){
                return "minimal"
            }
            else if(value==2){
                return "low"
            }
            else if(value==3){
                return "average"
            }
            else if(value==4){
                return "high"
            }
            else if(value==5){
                return "excellent"
            }
        },
        removeNotif(){
            this.broken = false
        },
        removeWrong(){
            this.wrongField = false
        },
        sendVals(crop, yiel, index){
            if(isNaN(parseFloat(yiel)) || crop==""){
                this.wrongField=true
            }
            else{
                axios.get(`http://127.0.0.1:4321/addCropYield?longitude=${this.responseData[index].longitude}&latitude=${this.responseData[index].latitude}&crop=${crop}&yield=${parseFloat(yiel)}`)
                .then(response => {
                    console.log(response.status)
                })
                .catch(error=> {
                    console.log(error)
                    this.broken=true
                });
            }
        }
    }
}
</script>
<style lang="scss">
@import '~bulma';

h3{
    color:white!important
}
</style>
