<template>
  <b-col>
    <div class="graphcontainer ">
    <b-row fluid class="d-flex justify-content-between toolbar">
    <multiselect v-model="showGraph" :options="getMultiSelectOptions()" placeholder="Choose from available graphs" class="multiselector">tt</multiselect>  

    <button class="btn" v-on:click="deleteMe"> <b-icon icon="x" scale="2" variant="danger"></b-icon></button>
  </b-row>
  <b-row>
    <Plotly :data="data" :layout="layout">
  </Plotly>
</b-row>
</div>
</b-col>
</template>

<script>
import { Plotly } from 'vue-plotly'
import Multiselect from 'vue-multiselect'

export default {
  name: "Graph",
  components: {
    Plotly,
    Multiselect
  },
  props: {
    parentID: Number,
    parentData: Array,
  },
  data: () => ({
      data: [{x: [1, 2, 3, 4],
              y: [0, 0, 0, 0],
              type:"scatter"
            }],
      layout: {title: {text: "dummy"}, 
               xaxis: {title: "x Axis", 
                       linecolor: "#000000",
                       linewidth: 2,
                       font : {family: 'helvetica, arial'}}
                       },
      count: 0,
      fields: [],
      value: null,
      options:  ['list', 'of', 'options']      
    }),
    computed: {
      showGraph: {
      get(){return this.value},
      set(selectedVal){
        this.value=selectedVal;
        for (let item in this.parentData) {
          if (this.parentData[item].title == selectedVal){
            this.changeData(this.parentData[item])
          }
        }
      }
    },
  },
    methods: {
    getMultiSelectOptions(){
      let array = [];
      for (let item in this.parentData) {
        array.push(this.parentData[item].title)
      }
      return array
    },
    deleteMe(){
        console.log('emitting from graphy')
        this.$emit('graphToParent', this.parentID)
    },
    changeData(item) {
      
      this.data = item.data
      this.layout = {title: item.title,
                     xaxis: {title: item.xlabel,
                             linewidth: 4},
                     yaxis: {title: item.ylabel,
                             linewidth: 4}}

    }
  }
}

</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style>

.toolbar{
  padding-left: 40px;
  padding-right: 40px;
}

.btn {
  background-color: DodgerBlue; /* Blue background */
  border: none; /* Remove borders */
  color: white; /* White text */
  padding: 12px 16px; /* Some padding */
  font-size: 16px; /* Set a font size */
  cursor: pointer; /* Mouse pointer on hover */
}

/* Darker background on mouse-over */
.btn:hover {
  background-color: RoyalBlue;
}


.redborder{
  border: 1px solid red;
}

.graphcontainer{
  min-width: 600px;
}

.multiselector{
  width: 400px;
}

.logos_footer {
  width: 200px;
}

.header {
  background-color: red;
  background-image: url(../assets/header.png);
  height: 200px;
  color: white;
  background-size: cover;
  background-repeat: no-repeat;
  box-shadow: 0px 2px 8px 0px rgba(0,0,0,0.75);
}


.author {
  background-color: white;
  box-shadow:0px 10px 10px 0px rgba(0,0,0,0.25);
  margin-bottom: 30px;
  font-size: 10px;
  padding-left: 20px;
}

.footer {
  background-color: white;
  box-shadow:0px 0px 10px 0px rgba(0,0,0,0.25);
}

.caption {
  font-size: 12px; 
}

</style>
