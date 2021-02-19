<template>
  <div class="row d-flex justify-content-center align-items-center">
  <div class="drop" 
    :class="getClasses" 
    @dragover.prevent="dragOver" 
    @dragleave.prevent="dragLeave"
    @drop.prevent="drop($event)">

      <textarea v-model="textSource" v-if="textSource"></textarea>
      <h3 v-if="wrongFile">Wrong file type</h3>
      <h3 v-if="!textSource && !wrongFile">Drop datafile or <label for="uploadmytextfile">upload</label> </h3>

      <input type="file" id="uploadmytextfile" @change="requestUploadFile" />

  </div></div>
</template>



<script>
export default {
  name: 'DropFile',
  data(){
    return{
      isDragging:false,
      wrongFile:false,
      textSource:null,
    }
  },
  computed:{
    getClasses(){
      return {isDragging: this.isDragging}
    }
  },
  methods:{
    dragOver(){
      this.isDragging = true
    },
    dragLeave(){
      this.isDragging = false
    },
    drop(e){
      let files = e.dataTransfer.files
      this.process(files)
    },

    requestUploadFile(){
      var src = this.$el.querySelector('#uploadmytextfile')
      let files = src.files
      this.process(files)
    },

    process(files){
      this.wrongFile = false

      // allows only 1 file
      if (files.length === 1) {

        let file = files[0]

        // allows text only
        if (file.type.indexOf('application/json') >= 0) {

          var reader = new FileReader()
          reader.onload = f => {
            this.textSource = JSON.parse(f.target.result)
            this.isDragging = false
            this.emitToParent()
          }

          // this is the method to read a text file content
          reader.readAsText(file)

        }else{
          this.wrongFile = true
          this.textSource = null
          this.isDragging = false
        }
      }
    },

    emitToParent() {
        console.log('emitting')
        this.$emit('childToParent', this.textSource)
    }

    
  }
}
</script>



<style scoped>

h3{
  font-family: Helvetica, Arial, sans-serif;
  font-size: 28px;
  color: #0927a2ff;
}

.drop{
  width: 50%;
  height: 100%;
  background-color: #e5eef2;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 10rem;
  transition: background-color .2s ease-in-out;
  border-radius: 10px;
  
}

.isDragging{
  width: 50%;
  height: 100%;
  background-color: #fff;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 10rem;
  transition: background-color .2s ease-in-out;

  font-family: Helvetica, sans-serif;
  border: 3px solid #0927a2ff;
}

textarea{
  width: 100%;
  height: 100%;
  object-fit: contain;
  resize: none;
}

input[type="file"]{
  display: none;
}

label{
  text-decoration: underline;
}
</style>