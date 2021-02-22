<template>
  <div class="container-fluid">
    <div class="row d-flex justify-content-center header align-items-center">
    </div>
    <div class="row d-flex align-content-right author align-items-center">
      Reference: {{reference}} | Contact: {{contact}}
    </div>
    <div v-if="NoFile">
      <DropFile v-on:childToParent="onChildClick"></DropFile>
    </div>
    <div v-else>
      <div class="row justify-content-center">
        <div>
          <h1>{{paragraphHeader}}</h1>
          <p class="textRow" v-html="paragraphText"></p>
        </div>
      </div>
      <b-container fluid>
      <b-row class="d-flex justify-content-center">
        <b-col id="component-graph" 
               v-for="field in fields" 
               v-on:graphDelete="onGraphDelete"
               v-on:graphToggleSize="onGraphDelete"
               v-bind:is="field.type" 
               :key="field.id" 
               :parentData="reportData"
               :parentID="field.id"
               class='borderclass d-flex justify-content-center'>
        </b-col>
        <b-col class=" borderclass d-flex justify-content-center">
          <button v-on:click="addGraph" class="addgraphbtn"><b-icon icon="plus-square" scale="2" class="addgraphicon"></b-icon></button>
        </b-col>
      </b-row>
      <b-row class="d-flex justify-content-center">
        
      </b-row>
    </b-container>

</div>
  </div>
</template>

<script>
//import Vue from 'vue'
import Graph from '../components/Graph';
import DropFile from '../components/DropFile'  
import Multiselect from 'vue-multiselect'

export default {
  name: 'demoDash',
  components: {
    Graph, DropFile, Multiselect
  },
  data: () => ({
    NoFile: true,
    contact: String,
    reference: String,
    options: [{text: '0', value: 0},
              {text: '1', value: 1},
              {text: '2', value: 2},
              {text: '3', value: 3},
              {text: '4', value: 4},
              {text: '5', value: 5},
              {text: '6', value: 6}],
    numberOfGraphs: 0,
    count: 0,
    fields: [],
    paragraphHeader: String,
    paragraphText: String,
    reportData: Array,
  }),
  methods: {
    setNumberOfGraphs(type) {
      if (this.count < this.numberOfGraphs) {
        this.fields.push({
        'type': type,
        id: this.count++})}
      else if (this.count - this.numberOfGraphs == 1) {
        this.fields.pop()
        this.count--}
      else if (this.count - this.numberOfGraphs == 2) {
        this.fields.pop()
        this.fields.pop()
        this.count--
        this.count--} 
      },
      onChildClick (data) {
        this.NoFile = false
        this.reference = data.reference
        this.contact = data.contact
        this.paragraphHeader = data.appendices[0].paragraphs[0].header
        this.paragraphText = data.appendices[0].paragraphs[0].body
        this.reportData = data.appendices[0].graphs
      },
      onGraphDelete (data) {
        for (var i=0 ; i < this.fields.length; i++){
          console.log("popping graph "+data)
          if (this.fields[i].id==data){this.fields.splice(i, 1)}
        }
      },
      addGraph(){
        this.fields.push({
        'type': "Graph",
        id: this.count++})
    }
    }
}


  
</script>

<style>
.addgraphbtn{
  width: 600px;
  height: 400px;
  background-color: transparent;
  border-radius: 10px;
  border: 0px;
  outline: none;
  transition-timing-function: ease-out;
  transition: 0.4s;
  border: 2px dashed #0927a2;
}

.addgraphbtn:hover{
  background-color: #e5eef2;
}

.addgraphbtn:focus{
  outline: none;
}

.addgraphicon{
  color: #0927a2ff;
}

.borderclass{
  border:0px dashed red;
}
.borderclass2{
  border: 0px solid blue;
}

h1 {
  color: #0927a2ff;
  font-family: Helvetica, Arial, sans-serif;
}

h2 {
  color: #0927a2ff;
  font-family: Helvetica, Arial, sans-serif;
}

h3 {
  color: black;
  font-family: Helvetica, Arial, sans-serif;
  font-weight: bold;
}

.logos_footer {
  width: 200px;
}

.textRow {
  max-width: 600px;
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
