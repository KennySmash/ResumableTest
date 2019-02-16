<template>
  <div id="app">
    <div class="">
      <b-navbar toggleable="lg" type="dark" variant="info">
        <b-navbar-brand href="#">CloudBurst</b-navbar-brand>
        <b-button @click="pingSocket()" class="ml-auto">Socket Server is <span v-if="socketConnected">📡</span><span v-if="!socketConnected">🛑</span></b-button>&nbsp;
        <b-button class="" @click="getBucketObjects()">Bucket is UP</b-button>&nbsp;
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
    <div v-if="bucketStats.bucketName" class="container-fluid main-wrapper">
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
            <b-list-group-item class='file-list' :key="file.id" v-for="file in myFiles">
              <div class="row">
                <div class="col-12">
                  {{ file.id }} : {{ file.name }} ({{ formatFileSize(file.size) }})<br/>
                  <b-progress :value="file.progress"  :max="100" show-progress :animated='file.active'></b-progress>
                  <b-button size='sm' @click="startUpload(file.id)">Start</b-button>
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
    <h1 v-if="!bucketStats.bucketName" class="text-center">Loading Amazon Bucket Data</h1>
  </div>
</template>

<script>
import EventBus from './event-bus';
import config from './config';
import md5 from 'md5-file';

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
    pingBack: function(data) {
      console.log('socketServer pinged me back with ', data);
    },
    pong: function(){
      this.socketConnected = true;
      console.log('server ping`d us');
    },
    MoreData: function(data){
      console.log('tracking Data', data);
      var Placement = data['Place'] * ( this.chunk_size * 1024 );
      var myFileId = data['Meta'];
      var NewFile;
      var fileName = data.Meta.name;

      NewFile = this.myFiles[myFileId].file.slice(Placement, Placement + Math.min(this.chunk_size*1024, data['Meta'].size - Placement));
      FReader.readAsBinaryString(NewFile);
      
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
    startUpload(fileIndex){
      var SocketMain =  this.$socket;
      var theFile = this.myFiles[fileIndex];
      FReader = new FileReader();
      FReader.onload = function(evt){
        SocketMain.emit('file_upload', 
        { 
          'Name' : theFile.name,
          'Data' : evt.target.result,
        });
      }
      SocketMain.emit('start_upload', { 
        'Name' : this.myFiles[fileIndex].name, 
        'Size' : this.myFiles[fileIndex].size , 
        'chunk_size' : this.chunkInBytes,
        'ID' : this.myFiles[fileIndex].id,
        'Paused': false
      });
    },
    connectSocket(){
      console.log('Testing the Socket Connection');
      this.$socket.emit('wake', {message:'Gettem Up!'});
    },
    pingSocket(){
      this.$socket.emit('ping');
    },
    onFileChange(e){
      for(var i = 0; i < e.target.files.length;i++){
        var currentFile = e.target.files[i];
          this.myFiles.push({
            id: this.currentItems,
            name: currentFile.name,
            size: currentFile.size,
            progress: 0,
            active: false,
            canceled: false,
            paused: false,
            checkSum: 'md5.md5File.sync(currentFile.path)',
            file: currentFile
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

  },
  computed: {
    isAbleToUpload: function(){
      return this.bucketStats.currentUsage < this.bucketStats.allowedUsage;
    },
    queueFileSize: function(){
      var queueSize = 0;
      for(var i = 0; this.myFiles.length > i; i++){
        queueSize += this.myFiles[i].size;
      }
      return queueSize;
    },
    chunkInBytes: function(){
      return this.chunkSize*1024;
    }
  },
  data(){
    return {
      bucketStats: {
        name: '',
        allowedUsage: 0,
        currentUsage: 0,
      },
      chunkSize: 32,
      percentMax: 100,
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
