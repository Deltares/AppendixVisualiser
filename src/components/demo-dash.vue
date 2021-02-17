<template>
  <div class="container-fluid">
    <div class="row d-flex justify-content-center header align-items-center">
      <h1>Appendix 1</h1>
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
          <h2>{{paragraphHeader}}</h2>
          <p class="textRow" v-html="paragraphText"></p>
        </div>
      </div>
      <b-row class="text-center justify-content-center borderclass2">
        <!--Number of Graphs:{{numberOfGraphs}}-->
        <!--
        <div>
          Set number of graphs
            <b-form-group type="primary">
              <b-form-radio-group
                id="btn-radios-1"
                v-model="numberOfGraphs"
                :options="options"
                buttons
                name="radios-btn-default"
                @change.native="setNumberOfGraphs('Graph')"
              ></b-form-radio-group>
            </b-form-group>
          </div>-->
      </b-row>
      <b-container fluid>
      <b-row class="borderclass2">
        <b-col id="component-graph" 
               v-for="field in fields" 
               v-on:graphToParent="onGraphDelete"
               v-bind:is="field.type" 
               :key="field.id" 
               :parentData="reportData"
               :parentID="field.id"
               class='borderclass d-flex justify-content-center'></b-col>

      </b-row>
      <b-row class="borderclass2 d-flex justify-content-center">
        <button v-on:click="addGraph">Add graph</button>
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

.borderclass{
  border: 0px solid red;
}
.borderclass2{
  border: 0px solid blue;
}

h2 {
  color: #0927a2ff;
  font-family: Helvetica, Arial, sans-serif;
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
