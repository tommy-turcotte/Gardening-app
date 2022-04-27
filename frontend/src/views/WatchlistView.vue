<template>
    <NavBar />
    <div class="section is-small has-background-link">
        <div class="columns is-centered">
            <div class="column is-four-fifths">
                <div class="container has-text-centered pb-6">
                    <h2 class="title is-2">
                        Watch List
                    </h2>
                    <div class="tile is-ancestor">
                        <div class="tile is-vertical is-3">
                            <div class="tile is-parent is-vertical">
                                <article class="tile is-child container">
                                    <div id="dd" class="dropdown">
                                        <div id="trig" class="dropdown-trigger">
                                            <button class="button">
                                                <span>Select Columns</span>
                                            </button>
                                        </div>
                                        <div class="dropdown-menu" role="menu">
                                            <div class="dropdown-content">
                                                <a v-if="lon" class="dropdown-item is-active" @click="toggleAttribute('lon')">Longitude</a>
                                                <a v-else class="dropdown-item" @click="toggleAttribute('lon')">Longitude</a>
                                                <a v-if="lat" class="dropdown-item is-active" @click="toggleAttribute('lat')">Latitude</a>
                                                <a v-else class="dropdown-item" @click="toggleAttribute('lat')">Latitude</a>
                                                <a v-if="potass" class="dropdown-item is-active" @click="toggleAttribute('potass')">K Level</a>
                                                <a v-else class="dropdown-item" @click="toggleAttribute('potass')">K Level</a>
                                                <a v-if="nitro" class="dropdown-item is-active" @click="toggleAttribute('nitro')">N Level</a>
                                                <a v-else class="dropdown-item" @click="toggleAttribute('nitro')">N Level</a>
                                                <a v-if="phos" class="dropdown-item is-active" @click="toggleAttribute('phos')">P Level</a>
                                                <a v-else class="dropdown-item" @click="toggleAttribute('phos')">P Level</a>
                                                <a v-if="ph" class="dropdown-item is-active" @click="toggleAttribute('ph')">Acidity</a>
                                                <a v-else class="dropdown-item" @click="toggleAttribute('ph')">Acidity</a>
                                                <a v-if="temp" class="dropdown-item is-active" @click="toggleAttribute('temp')">Temperature</a>
                                                <a v-else class="dropdown-item" @click="toggleAttribute('temp')">Temperature</a>
                                                <a v-if="humid" class="dropdown-item is-active" @click="toggleAttribute('humid')">Humidity</a>
                                                <a v-else class="dropdown-item" @click="toggleAttribute('humid')">Humidity</a>
                                                <a v-if="rain" class="dropdown-item is-active" @click="toggleAttribute('rain')">Rainfall</a>
                                                <a v-else class="dropdown-item" @click="toggleAttribute('rain')">Rainfall</a>
                                                <a v-if="crop_rec" class="dropdown-item is-active" @click="toggleAttribute('crop_rec')">Recommended Crop</a>
                                                <a v-else class="dropdown-item" @click="toggleAttribute('crop_rec')">Recommended Crop</a>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </div>
                        <div class="tile is-vertical">
                            <div class="tile is-parent is-vertical">
                                <article class="tile is-child content is-warning is-medium has-text-white">
                                    <table class="table is-bordered is-striped is-narrow" id="table1">
                                        <thead>
                                            <tr id="headerrow">
                                                <th v-show="lon">Longitude</th>
                                                <th v-show="lat">Latitude</th>
                                                <th v-show="potass">k_lvl</th>
                                                <th v-show="nitro">n_lvl</th>
                                                <th v-show="phos">p_lvl</th>
                                                <th v-show="ph">pH</th>
                                                <th v-show="temp">Temperature</th>
                                                <th v-show="humid">Humidity</th>
                                                <th v-show="rain">Rainfall</th>
                                                <th v-show="crop_rec">Recommended Crop</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        </tbody>
                                   </table>
                                </article>
                                <div id="graph" class="tile is-child is-vertical is-8 is-warning">
                                
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
import axios from 'axios'
import NavBar from '../components/NavBar.vue'
import $ from 'jquery'
import * as d3 from 'd3';

export default {
  name: 'LoginView',
  components: {
        NavBar
    }, 
  data(){
      return{
          lon: true,
          lat: true,
          ph: true,
          temp: true,
          humid: true,
          rain: true,
          potass: true,
          nitro: true,
          phos: true,
          crop_rec: true,
          name: true,
          isReady:false,
      }
  },
  created(){
    axios.get(`http://127.0.0.1:4321/watchlist`)
    .then(response => {
        for(var i=0;i<response.data.length;i++){
            $("tbody").append("<tr><td>"+response.data[i].longitude+"</td>"+"<td>"+response.data[i].latitude+"</td>"+"<td>"+response.data[i].k_lvl+"</td>"+"<td>"+response.data[i].n_lvl+"</td>"+"<td>"+response.data[i].p_lvl+"</td>"+"<td>"+response.data[i].ph+"</td>"+"<td>"+response.data[i].temperature+"</td>"+"<td>"+response.data[i].humidity+"</td>"+"<td>"+response.data[i].rainfall+"</td>"+"<td>"+response.data[i].recommended_crop+"</td></tr>")
        }
    })
    .catch(error=> console.log(error));
  },
  methods: {
      toggleAttribute(attrname){
          if (this[attrname] == false){
            this[attrname] = true
          }
          else{
              this[attrname] = false
          }
          this.reloadTable()
      },
      reloadTable(){
          $("tbody").html("")
          axios.get(`http://127.0.0.1:4321/watchlist`)
            .then(response => {
                let appendString = ""
                for(var i=0;i<response.data.length;i++){
                    appendString=""
                    if(this.lon==true){
                        appendString+="<td>"+response.data[i].longitude+"</td>"
                    }
                    if(this.lat==true){
                        appendString+="<td>"+response.data[i].latitude+"</td>"
                    }
                    if(this.potass==true){
                        appendString+="<td>"+response.data[i].k_lvl+"</td>"
                    }
                    if(this.nitro==true){
                        appendString+="<td>"+response.data[i].n_lvl+"</td>"
                    }
                    if(this.phos==true){
                        appendString+="<td>"+response.data[i].p_lvl+"</td>"
                    }
                    if(this.ph==true){
                        appendString+="<td>"+response.data[i].ph+"</td>"
                    }
                    if(this.temp==true){
                        appendString+="<td>"+response.data[i].temperature+"</td>"
                    }
                    if(this.humid==true){
                          appendString+="<td>"+response.data[i].humidity+"</td>"
                    }
                    if(this.rain==true){
                        appendString+="<td>"+response.data[i].rainfall+"</td>"
                    }
                    if(this.crop_rec==true){
                        appendString+="<td>"+response.data[i].recommended_crop+"</td>"

                    }
                    $("tbody").append("<tr>"+appendString+"</tr>")
                }
            })
            .catch(error=> console.log(error));
      },
  },
  mounted(){
      $( "#dd" ).click(function(e) {
        e.stopPropagation()
        var test = document.getElementById("dd")
        test.classList.add("is-active")
      })
      $(window).click(function(){
        var test = document.getElementById("dd")
        test.classList.remove("is-active")
      })
      $( "#trig" ).click(function(e) {
        e.stopPropagation()
        var test = document.getElementById("dd")
        test.classList.toggle("is-active")
      })
      $("th").click(function(){
        var correction=0
        var index = $(this).index()+1

        $("#headerrow th").each(function(){
            if(index>$(this).index()+1 && !$(this).is(":visible")){
                correction+=1
            }
        })

        var computedIndex = $(this).index()+1-correction;
        var vals = [];
        $("table td").css("background-color","white")
        $("table td:nth-child("+computedIndex+")").css("background-color", "#e0e0ff")
        $("table td:nth-child("+computedIndex+")").each(function(){
        vals.push($(this).text())
        })

        // build the bar chart
        d3.select("svg").remove();
        const height = 600;
        const margin = 70; 
        const graphHeight = height - 2 * margin; 
        const width = 800; 
        const graphWidth = width - 2 * margin;

        var domain=[]
        var itemList=[]
        var holder;
        var max=Math.max(...vals)
        var min=Math.min(...vals)
        for (var i=0; i<vals.length;i++){
            domain.push(i+1)
            var xvalue = i+1
            xvalue = xvalue.toString();
            holder={'location': xvalue,'value' : vals[i]}
            itemList.push(holder)
        }
        // set x-axis and y-axis scaling 
        const yScale = d3.scaleLinear()
                            .domain([min-(0.3*Math.abs(max)), max+(0.1*Math.abs(max))])
                            .range([graphHeight, 0])
        const xScale = d3.scaleBand()
                            .padding(0.35)
                            .domain(itemList.map((itemList) => itemList.location))
                            .range([0, graphWidth])
        
        // set color range -> larger bins will be darker 
        const colors = d3.scaleLinear().range(['white', 'magenta']).domain([min-(0.3*Math.abs(max)), max+(0.1*Math.abs(max))])

        // create svg element to attach gragh to 
        let svgElement = d3.select('#graph').append('svg').attr('height', height).attr('width', width)
        
        svgElement.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "white");
        
        // graph title 
        svgElement.append('text')
                    .attr('y', 45)
                    .attr('x', width / 2)
                    .attr('text-anchor', 'middle')
                    .text('Column Stats')

        // x-axis label 
        svgElement.append('text')
                    .attr('y', height - 12)
                    .attr('x', width / 2)
                    .attr('text-anchor', 'middle')
                    .text('Location')

        // y-axis label 
        svgElement.append('text')
                    .attr('y', height / 2)
                    .attr('x', 10)
                    .attr('id', 'y-axis')
                    .attr('text-anchor', 'end')
                    .attr("transform", `rotate(-90, 25, 300)`)
                    .text('Value')

        // create graph element 
        let graph = svgElement.append('g').attr('transform', `translate(${margin}, ${margin})`)


        // add x and y axis 
        graph.append('g').call(d3.axisLeft(yScale))
        graph.append('g').attr('transform', `translate(0, ${graphHeight})`).call(d3.axisBottom(xScale))

        // insert rectangles (bars) in the graph for each bin 
        graph.selectAll('rect').data(itemList).enter()
                                .append('rect')
                                    .attr('y', (itemList) => yScale(itemList.value))
                                    .attr('x', (itemList) => xScale(itemList.location))
                                    .attr('height', (itemList) => (graphHeight - yScale(itemList.value)))
                                    .attr('width', xScale.bandwidth())
                                    .attr('fill', (itemList) => colors(itemList.value))
      })
  }
}
</script>
<style lang="scss">
  @import '~bulma';
</style>
