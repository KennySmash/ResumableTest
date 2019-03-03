<template>
  <div id="app">
    <div class="">
      <b-navbar toggleable="lg" type="dark" variant="info">
        <b-navbar-brand href="#">CloudBurst</b-navbar-brand>
        <b-button @click="globalUpload(true)" class="ml-auto">Upload All</b-button>&nbsp;
        <b-button @click="pingSocket()" >Socket Server is <span v-if="socketConnected">📡</span><span v-if="!socketConnected">🛑</span></b-button>&nbsp;
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

          <b-card title="Completed Uploads" class='row' v-if="finishedFiles[0]">
            <a class="mr-3 mb-2" target="_blank" :href="link" v-for="(link, linkSpot ) in finishedFiles" :key="linkSpot">
              <b-img thumbnail width="150px" :src="link" :alt="link" />
            </a>
          </b-card>

        </div>
        <div class="col-md-6">
          <b-list-group class="mb-2">
            <b-list-group-item v-if="!file.state.completed" class='file-list' :key="file.meta.id" v-for="file in myFiles">
              <div class="row">
                <div class="col-3">
                  <b-button size='sm' v-if="!file.state.active && !file.state.paused && !file.state.started" @click="startUpload(file.meta.id)">Start</b-button>
                  <b-button size='sm' v-if="file.state.active && !file.state.paused" variant='info' @click="pauseUpload(file.meta.id)">⏸️</b-button>
                  <b-button size='sm' v-if="file.state.paused" variant='info' @click="resumeUpload(file.meta.id)">▶️</b-button>
                </div>
                <div class="col-9">
                  {{ file.meta.id }} : {{ file.meta.name }} ({{ formatFileSize(file.meta.size) }})<br/>
                  <b-progress :value="progressBarVal(file.state.progress)"  :max="file.meta.size" show-progress :animated='file.state.active'></b-progress>
                  <a v-if="file.meta.uploadPath" :href="file.meta.uploadPath">
                    <b-img thumbnail fluid :src="file.meta.uploadPath" :alt="file.meta.name" />
                  </a>
                  
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
// import config from './config';
import imageChunk from './imageChunk';
// import crc from 'crc/crc32';

// var io = {};

export default {
  name: 'app',
  mounted() {
    this.axios.defaults.baseURL = '//' + window.location.hostname + ':3000';
    
  },
  sockets: {
    connect: function() {
      // console.log('socket connected - ID:', this.$socket.id);
      this.getBucketStats();
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
        meta: this.myFiles[data.file_id].meta,
        state: this.myFiles[data.file_id].state,
      }
      // console.log(firstChunk)
      this.$socket.emit('upload_chunk', firstChunk);
    },
    /* 
    'upload_next'
    server is asking for the next chunk with the file id and the chunk id
    */
    upload_next: function(data){
      // console.log('upload_next',data);
      var thisFile = this.myFiles[data.file_id];
      thisFile.state.progress++;
      var nextChunk = {
        data: this.myFiles[data.file_id].data[data.chunk_id], 
        meta: this.myFiles[data.file_id].meta,
        state: this.myFiles[data.file_id].state
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
     let thisFile = this.myFiles[data.file_id];
     this.getBucketStats();
   },
   s3_done: function(data){
     console.log('S3 Upload is finished', data);
     var search = this.waitingList.indexOf(data.meta.id);
     if (search > -1){
       this.waitingList.splice(search, 1);
     }
      this.myFiles[data.meta.id].state.completed = true;
      if(this.finishedFiles.indexOf(data.data.response.Location) === -1){
        this.finishedFiles.push(data.data.response.Location)
      }
      this.transferSlots++;

   }
  },
  methods: {
    getBucketStats(){
      this.$http.get('/bucketStatus')
      .then((response) => {
        this.bucketStats = response.data;
      })
    },
    pingSocket(){
      this.$socket.emit('ping');
    },
    queueUpload(fileIndex){
      this.waitingList.push(fileIndex);
    },
    startQueue(){
      this.transferSlots = this.transferCap;
    },
    globalUpload(i){
      // console.log('global start', i);
      this.myFiles.forEach((item) => {
        if (!item.state.completed){
          this.queueUpload(item.meta.id);  
        }
      })
      this.startQueue();
    },
    startUpload(fileIndex){
      console.log('starting Upload of ID:', fileIndex);
      this.transferSlots--;
      var SocketMain =  this.$socket;
      var theFile = this.myFiles[fileIndex];
      var openingObj = {
        id: theFile.meta.id,
        name: theFile.meta.name,
        size: theFile.meta.size,
        chunk_count: Object.keys(theFile.data).length,
        meta: theFile.meta
      }
      if(!theFile.state.completed && !theFile.state.started){
        this.myFiles[fileIndex].state.started = true;
        this.myFiles[fileIndex].state.active = true;
        SocketMain.emit('upload_start', openingObj);
      } else {
        console.warn('client tried to reupload a file or a started file');
        this.transferSlots++;
      }
    },
    pauseUpload: function(id){
      this.myFiles[id].state.paused = true;
      this.myFiles[id].state.active = false;
    },
    resumeUpload: function(id){
      this.myFiles[id].state.paused = false;
      this.myFiles[id].state.active = true;
      let payload = {
        file_id: id,
        name: this.myFiles[id].meta.name
      }
      // console.log('upload Resume', payload);
      this.$socket.emit('upload_resume', payload);
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
              uploadPath: ""
            },
            state : {
              progress: 0,
              active: false,
              canceled: false,
              paused: false,
              completed: false,
              started: false,
            },
            data : imageChunk.chunkImage(this.chunkInBytes, this.currentItems, currentFile),
        });
        this.myFiles[i].meta.mime = this.myFiles[i].data[0].type;
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
        if (this.myFiles[i].state.completed !== true){
          queueSize += this.myFiles[i].meta.size;
        }
      }
      return queueSize;
    },
    chunkInBytes: function(){
      return this.chunkSize*1024;
    },
    currentQueSize: function(){
      return this.waitingList.length;
    },
    currentTransferSize: function(){
      return this.currentTransfers.length;
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
      socketConnected: false,
      currentItems: 0,
      transferCap: 4,
      transferSlots: 0,
      waitingListNumber: 0,
      waitingList: [],
      myFiles: [],
      finishedFiles: [],
    }
  },
  watch: {
    waitingList: function(newVal){
      if(newVal.length > 0){
        this.startUpload(newVal[0]);
      }
    },
    transferSlots: function(newVal, oldVal){
      console.log('transfer Slots changed from ', oldVal, ' to ', newVal)
      for(var slots = this.transferSlots; slots > 0; slots--){
        if(this.waitingList.length > 1){
          this.startUpload(this.waitingList[0]);
          this.waitingList.splice(0, 1);
        } else {
          console.warn('The Transfer Queue is full');
        }
      }
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
