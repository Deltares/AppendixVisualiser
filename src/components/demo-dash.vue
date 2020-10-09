<template>
  <div class="container-fluid">
    <div class="row d-flex justify-content-center header align-items-center">
      <h1>Appendix 1</h1>
    </div>
    <div class="row d-flex align-content-right author align-items-center">
      Bijlage bij rapport 11200939-102-ZWS-00. Contact: xx@deltares.nl
    </div>

    <div  class="row justify-content-center">
      <div>
        <h2>Rating curves</h2>
        <p class="textRow">
          Rating curves describe the relationship between discharge and water level. These graphs are valuable in determining the variability in expected water levels. Use the interface below to view and compare rating curves for various locations. 
        </p>
      </div>
    </div>
    <b-row class="text-center justify-content-center">
      <!--Number of Graphs:{{numberOfGraphs}}-->
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
        </div>
    </b-row>
    <b-row sm=3>
    <div id="component-graph" v-for="field in fields" v-bind:is="field.type" :key="field.id">
    </div>
  </b-row>
  </div>
</template>

<script>
  //import Vue from 'vue'
  import Graph from '../components/Graph';

//Vue.component('dynamic_graph', {
//  data: function () {
//    return {
//fields: [],
//    count: 0,
//    }
//  },
//  template: `<b-col><div id="plygraph">L1ullo</div></bcol>`,
//})

  export default {
    name: 'demoDash',
    components: {
      Graph
    },
    data: () => ({
      options: [{text: '0', value: 0},
                {text: '1', value: 1},
                {text: '2', value: 2},
                {text: '3', value: 3}],
      numberOfGraphs: 0,
      count: 0,
      fields: [],
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
        }
      }
  }


  
</script>

<style>

h2 {
  color: #0927a2ff;
  font-family: Helvetica, Arial, sans-serif;
}

.logos_footer {
  width: 200px;
}

.textRow {
  max-width: 400px;
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

.graphcontainer{
  border: 2px solid red;
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
