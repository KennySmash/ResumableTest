<template>
  <div id="app">
    <div class="container-fluid">
      <div class='row'>
        <div class="col-md-8">
          <b-card title="Bucket Status"
              tag="article"
              class="mb-2">
            <p class="card-text">
              <code v-model="bucketStats.statusObj"></code>
              <p>App Status : Online</p>
            </p>
            <b-button @click="getBucketStats" variant="primary">Refresh</b-button>
          </b-card>
          <b-card title="Settings"
              tag="article"
              class="mb-2">
            <div class="card-text">
              <div class="form-group row">
                <label for="chunkSize" class="col-2 col-form-label">Chunk size (in kB)</label>
                <div class="col-5">
                  <input type="text" class="form-control" id="chunkSize" v-model.number="bucketStats.chunkSize" />
                </div> 
              </div>
            </div>
          </b-card>
          <b-card title="Dropzone"
              tag="article"
              class="mb-2">
            <p class="card-text">
              Drop your files here
            </p>
            <input @change="onFileChange" type="file" accept="image/*" multiple="true" />
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
          <b-list-group class="mb-2">
            <b-list-group-item class='file-list' :key="file.id" v-for="file in myFiles">
              <div class="row">
                <div class="col-12">
                  {{ file.id }} : {{ file.name }} ({{ formatFileSize(file.size) }})<br/>
                  <b-progress :value="file.progress"  :max="100" show-progress :animated='file.active'></b-progress>
                  <div>
                    <small>Chunks Left :  </small>
                    <b-badge variant="" 
                      class="mr-1" 
                      :class="{'badge-light': chunk.status == 0, 'badge-info': chunk.status == 1, 'badge-danger': chunk.status == 2, 'badge-success': chunk.status == 3}" 
                      :key="chunk.id" 
                      v-for="chunk in file.chunkArr" 
                      :status="chunk.status" >{{ chunk.id }}</b-badge>
                  </div>
                </div>
              </div>
            </b-list-group-item>
          </b-list-group>
        </div>
      </div>
        
    </div>
  </div>
</template>

<script>
import EventBus from './event-bus';

export default {
  name: 'app',
  components: {

  },
  mounted() {

  },
  methods: {
       getBucketStats: function (){
         var that = this;
         console.log('getting Status of Bucket')
          this.axios.get('/bucketStatus',{
            baseURL: 'http://localhost:3000',
            headers: {
              'Access-Control-Allow-Origin': '*',
            },
          }).then((response) => {
            that.bucketStats.statusObj = response;
          })
       },
       onFileChange(e) {
        const that = this;
        for(var i = 0; i < e.target.files.length;i++){
          var currentFile = e.target.files[i];
            that.myFiles.push({
            id: that.currentItems,
            name: currentFile.name,
            size: currentFile.size,
            progress: 0,
            active: false,
            chunkCount: 0,
            checkSum: '',
            file: currentFile
          });
          that.currentItems++;
        }
        e.target.files = null;
      },
      formatFileSize: function(bytes,decimalPoint) {
        if(bytes == 0) return '0 Bytes';
          var k = 1000,
              dm = decimalPoint || 2,
              sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
              i = Math.floor(Math.log(bytes) / Math.log(k));
          return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
      },
      calcChunkSize: function(number){
        return number * 1024;
      }
  },
  data: function () {
    return {
      bucketStats: {
        name: '',
        totalSpace: '',
        usedSpace: '',
        chunkSize: 32,
        statusObj: {},
      },
      currentItems: 0,
      rawFiles: [],
      myFiles: [],
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
