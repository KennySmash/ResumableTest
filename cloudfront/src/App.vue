<template>
  <div id="app">
    <div class="container-fluid">
      <div class='row'>
        <div class="col-md-8">
          <b-card title="Bucket Status"
              tag="article"
              class="mb-2">
            <p class="card-text">
              Data is gonna go here soon
            </p>
            <b-button href="#" :click="getBucketStats" variant="primary">Refresh</b-button>
          </b-card>
          <b-card title="Dropzone"
              tag="article"
              class="mb-2">
            <p class="card-text">
              Drop your files here
            </p>
            <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"></vue-dropzone>
          </b-card>
        </div>
        <div class="col-md-4">
          <b-card title="Global Controls"
              tag="article"
              class="mb-2">
            <b-button href="#" variant="primary">Start Upload</b-button>&nbsp;
            <b-button href="#" variant="info">Pause All</b-button>&nbsp;
            <b-button href="#" variant="danger">Cancel All</b-button>&nbsp;
            <b-button href="#" variant="warning">Tidy List</b-button>
          </b-card>
          <b-card class="mb-2">
            <div class='file-list' :key="file.id" v-for="file in myFiles">
              {{ file }}
            </div>
          </b-card>
        </div>
      </div>
        
      
    </div>
  </div>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone';

export default {
  name: 'app',
  components: {
    vueDropzone: vue2Dropzone
  },
  methods: {
       getBucketStats: function (){
          this.$socket.emit('emit_method', {
            message: 'hi'
          })
       }
  },
  data: function () {
    return {
      bucketStats: {
        name: '',
        totalSpace: '',
        usedSpace: '',
      },
      myFiles: {
          0 : {
            id: 1,
            name: 'meep.jpg',
            size: 1500203,
            progress: 0
          }
      },
      dropzoneOptions: {
        url: 'https://linkstorm-res-test.herokuapp.com/resumable',
        thumbnailWidth: 150,
        query: { path: '10/1' },
        fileType: ['gif', 'jpg', 'png', 'jpeg'],
        chunkSize: 128*1024,
        simultaneousUploads: 100,
        setChunkTypeFromFile: true,
        prioritizeFirstAndLastChunk: true,
        parallelChunkUploads: true
      }
    }
  }
}
</script>

<style lang="scss">
@import '../node_modules/bootstrap-vue/dist/bootstrap-vue.css';
@import '../node_modules/bootstrap/scss/bootstrap.scss';
@import '../node_modules/vue2-dropzone/dist/vue2Dropzone.min.css';
#app{
  margin-top: 15px;
}
</style>
