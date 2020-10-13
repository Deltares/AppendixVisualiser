<template>
  <b-col>
    <b-dropdown text="Station" class="m-md-2" variant="outline-primary">
      <b-dropdown-item v-for="(item, key) in parentData" :key="key" @click="changeData(item)">
        {{ item.label }}
      </b-dropdown-item>
    </b-dropdown>
  
  <Plotly :data="data" :layout="layout" :display-mode-bar="true">

  </Plotly>
</b-col>

</template>

<script>
import { Plotly } from 'vue-plotly'

export default {
  name: "Graph",
  components: {
    Plotly
  },
  props: {
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
      fields: []
    }),
  methods: {
    changeData(item) {

      this.data[0].x = item.x
      this.data[0].y = item.y
      this.layout = {title: item.label}

    }
  }
}

</script>

<style>

.graphcontainer{
  width: 100px;
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
