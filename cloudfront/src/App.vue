<template>
  <div id="app">
    <div class="">
      <b-navbar toggleable="lg" type="dark" variant="info">
        <b-navbar-brand href="#">CloudBurst</b-navbar-brand>
        <b-button @click="pingSocket()" class="ml-auto">Socket Server is <span v-if="socketConnected">📡</span><span v-if="!socketConnected">🛑</span></b-button>&nbsp;
        <b-button v-b-modal.settingsModal class="">⚙️</b-button>&nbsp;
        <b-button-group>
          <b-button>Bucket Usage :</b-button>
          <b-button style="width: 250px; height: 38px;">
            <b-progress :max="bucketStats.allowedUsage">
              <b-progress-bar :value="bucketStats.currentUsage" variant="info" :label="''+formatFileSize(bucketStats.currentUsage, 2)" />
              <b-progress-bar v-if="myFiles" :value="queueFileSize" variant="warning" />
            </b-progress>  
          </b-button>
        </b-button-group>
      </b-navbar>
    </div>
    <div v-if="bucketStats.name" class="container-fluid main-wrapper">
      <div class='row'>
        <div class="col-md-6">
          <b-card v-if="isAbleToUpload" title="Dropzone"
              tag="article"
              class="mb-2">
            <p class="card-text">
              Drop your files here
            </p>
            <input @change="onFileChange" type="file" accept="image/*" multiple="true" />
          </b-card>
          <b-card v-else title="You have reached your Bucket Size Limit">
            <p class="card-text">Please Contact Guy at text@example.com to organize more space<br/>Or remove Items from your upload queue</p>
          </b-card>
        </div>
        <div class="col-md-6">
          <b-card title="Global Controls"
              tag="article"
              class="mb-2">
            <b-button href="#" @click="getQueue()" variant="dark">Get Server Queue</b-button>&nbsp;
            <b-button href="#" variant="primary">Start Upload</b-button>&nbsp;
            <b-button href="#" variant="info">Pause All</b-button>&nbsp;
            <b-button href="#" variant="danger">Cancel All</b-button>&nbsp;
            <b-button href="#" variant="warning">Tidy List</b-button>
          </b-card>
          <b-list-group class="mb-2">
            <b-list-group-item class='file-list' :key="file.meta.id" v-for="file in myFiles">
              <div class="row">
                <div class="col-3">
                  <b-button size='sm' @click="startUpload(file.meta.id)">Start</b-button>
                  
                </div>
                <div class="col-9">
                  {{ file.meta.id }} : {{ file.meta.name }} ({{ formatFileSize(file.meta.size) }})<br/>
                  <b-progress :value="progressBarVal(file.state.progress)"  :max="file.meta.size" show-progress :animated='file.state.active'></b-progress>
                </div>
              </div>
            </b-list-group-item>
          </b-list-group>
        </div>
      </div>
        

        <b-modal id="settingsModal" size="md" centered title="Settings" ok-only>
          <div class="form-group row">
            <label for="chunkSize" class="col-md-5 col-form-label">Chunk size (in kB)</label>
            <div class="col-md-5">
              <input type="text" class="form-control" id="chunkSize" v-model.number="chunkSize" />
            </div> 
          </div>
        </b-modal>
    </div>
    <div v-else class="d-flex justify-content-center align-content-center p-5">
      <p>
      <span class="loader">
        <span class="loader-inner"></span>
      </span></p>
    </div>
    <h1 v-if="!bucketStats.name" class="text-center">Loading Amazon Bucket Data</h1>
  </div>
</template>

<script>
import EventBus from './event-bus';
import config from './config';
import md5 from 'md5-file';
import imageChunk from './imageChunk';

var io = {};
var FReader;


export default {
  name: 'app',
  mounted() {
    this.axios.defaults.baseURL = config.axios.baseURL;
    this.getBucketStats();
  },
  sockets: {
    connect: function() {
      console.log('socket connected - ID:', this.$socket.id);
      this.socketConnected = true;
    },
    disconnect: function() {
      this.socketConnected = false;
    },
    reconnecting: function() {
      this.socketConnected = false;
    },
    pong: function(){
      this.socketConnected = true;
      // console.log('server ping`d us');
    },
    upload_begin: function(data){
      console.log('upload_begin', data);
      this.myFiles[data.file_id].state.active = true;
      var firstChunk = {
        data: this.myFiles[data.file_id].data[0], 
        meta: this.myFiles[data.file_id].meta
      }
      console.log(firstChunk)
      this.$socket.emit('upload_chunk', firstChunk);
    },
    /* 
    'upload_next'
    server is asking for the next chunk with the file id and the chunk id
    */
    upload_next: function(data){
      console.log('upload_next',data);
      var thisFile = this.myFiles[data.file_id];
      thisFile.state.progress++;
      var nextChunk = {
        data: this.myFiles[data.file_id].data[data.chunk_id], 
        meta: this.myFiles[data.file_id].meta
      }
      this.$socket.emit('upload_chunk', nextChunk);
    },
   /*
    'chunk_finished'
    the server is saying the chunk of file id and chunk id is done
    
    'upload_done'
    the file id provided is done so it can be removed from the transfer Q
    and next in waiting can go in

    */
   upload_done: function(data){
     console.log('Ding Dong, Files Done',data);
     this.myFiles[data.file_id].state.active = false;
     this.myFiles[data.file_id].state.completed = false;
   }
  },
  methods: {
    getBucketStats(){
      this.$http.get('/bucketStatus')
      .then((response) => {
        this.bucketStats = response.data;
      })
    },
    getQueue(){
      this.$http.get('/queueStatus')
      .then((response) => {
        console.log(response.data);
      })
    },
    pingSocket(){
      this.$socket.emit('ping');
    },
    startUpload(fileIndex){
      var SocketMain =  this.$socket;
      var theFile = this.myFiles[fileIndex];
      var openingObj = {
        id: theFile.meta.id,
        name: theFile.meta.name,
        size: theFile.meta.size,
        chunk_count: Object.keys(theFile.data).length,
      }
      SocketMain.emit('upload_start', openingObj);
    },
    onFileChange(e){
      for(var i = 0; i < e.target.files.length;i++){
        var currentFile = e.target.files[i];
          this.myFiles.push({
            file: currentFile,
            meta : {
              id: this.currentItems,
              name: currentFile.name,
              size: currentFile.size,
            },
            state : {
              progress: 0,
              active: false,
              canceled: false,
              paused: false,
              completed: false,
            },
            data : imageChunk.chunkImage(this.chunkInBytes, this.currentItems, currentFile)
            
        });
        this.currentItems++;
      }
      e.target.files = null;
    },
      formatFileSize(bytes,decimalPoint){
        if(bytes == 0) return '0 Bytes';
          var k = 1000,
              dm = decimalPoint || 2,
              sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
              i = Math.floor(Math.log(bytes) / Math.log(k));
          return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
      },
      progressBarVal: function(chunkCount){
      return chunkCount * this.chunkSize * 1024;
    }

  },
  computed: {
    isAbleToUpload: function(){
      return this.bucketStats.currentUsage < this.bucketStats.allowedUsage;
    },
    queueFileSize: function(){
      var queueSize = 0;
      for(var i = 0; this.myFiles.length > i; i++){
        queueSize += this.myFiles[i].meta.size;
      }
      return queueSize;
    },
    chunkInBytes: function(){
      return this.chunkSize*1024;
    },
    arrSize: function(objArray){
      return Object.keys(array).length;
    },
    

  },
  data(){
    return {
      bucketStats: {
        name: '',
        allowedUsage: 0,
        currentUsage: 0,
      },
      chunkSize: 32,
      socketConnected: false,
      currentItems: 0,
      rawFiles: [],
      myFiles: []
    }
  }
}
</script>

<style lang="scss">
@import '../node_modules/bootstrap-vue/dist/bootstrap-vue.css';
@import '../node_modules/bootstrap/scss/bootstrap.scss';
@import '../node_modules/vue2-dropzone/dist/vue2Dropzone.min.css';
.main-wrapper{
  margin-top: 15px;
}
.progress{
  background-color: #444;
}
.loader {
  display: inline-block;
  width: 50px;
  height: 50px;
  position: relative;
  border: 4px solid #0074D9;
  top: 50%;
  animation: loader 2s infinite ease;
}

.loader-inner {
  vertical-align: top;
  display: inline-block;
  width: 100%;
  background-color: #7FDBFF;
  animation: loader-inner 2s infinite ease-in;
}

@keyframes loader {
  0% { transform: rotate(0deg);}
  25% { transform: rotate(180deg);}
  50% { transform: rotate(180deg);}
  75% { transform: rotate(360deg);}
  100% { transform: rotate(360deg);}
}

@keyframes loader-inner {
  0% { height: 0%; }
  25% { height: 0%; }
  50% { height: 100%; }
  75% { height: 100%; }
  100% { height: 0%; }
}
</style>
