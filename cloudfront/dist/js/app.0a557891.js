(function(t){function e(e){for(var a,o,i=e[0],c=e[1],u=e[2],f=0,p=[];f<i.length;f++)o=i[f],s[o]&&p.push(s[o][0]),s[o]=0;for(a in c)Object.prototype.hasOwnProperty.call(c,a)&&(t[a]=c[a]);l&&l(e);while(p.length)p.shift()();return r.push.apply(r,u||[]),n()}function n(){for(var t,e=0;e<r.length;e++){for(var n=r[e],a=!0,i=1;i<n.length;i++){var c=n[i];0!==s[c]&&(a=!1)}a&&(r.splice(e--,1),t=o(o.s=n[0]))}return t}var a={},s={app:0},r=[];function o(e){if(a[e])return a[e].exports;var n=a[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,o),n.l=!0,n.exports}o.m=t,o.c=a,o.d=function(t,e,n){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},o.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)o.d(n,a,function(e){return t[e]}.bind(null,a));return n},o.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="/";var i=window["webpackJsonp"]=window["webpackJsonp"]||[],c=i.push.bind(i);i.push=e,i=i.slice();for(var u=0;u<i.length;u++)e(i[u]);var l=c;r.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},"56d7":function(t,e,n){"use strict";n.r(e);n("cadf"),n("551c"),n("097d");var a=n("2b0e"),s=n("bc3a"),r=n.n(s),o=n("a7fe"),i=n.n(o),c=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("div",{staticClass:"container-fluid"},[n("div",{staticClass:"row"},[n("div",{staticClass:"col-md-8"},[n("b-card",{staticClass:"mb-2",attrs:{title:"Bucket Status",tag:"article"}},[n("p",{staticClass:"card-text"},[n("code",{model:{value:t.bucketStats.statusObj,callback:function(e){t.$set(t.bucketStats,"statusObj",e)},expression:"bucketStats.statusObj"}})]),n("p",[t._v("App Status : Online")]),n("p"),n("b-button",{attrs:{variant:"primary"},on:{click:t.getBucketStats}},[t._v("Refresh")])],1),n("b-card",{staticClass:"mb-2",attrs:{title:"Settings",tag:"article"}},[n("div",{staticClass:"card-text"},[n("div",{staticClass:"form-group row"},[n("label",{staticClass:"col-2 col-form-label",attrs:{for:"chunkSize"}},[t._v("Chunk size (in kB)")]),n("div",{staticClass:"col-5"},[n("input",{directives:[{name:"model",rawName:"v-model.number",value:t.bucketStats.chunkSize,expression:"bucketStats.chunkSize",modifiers:{number:!0}}],staticClass:"form-control",attrs:{type:"text",id:"chunkSize"},domProps:{value:t.bucketStats.chunkSize},on:{input:function(e){e.target.composing||t.$set(t.bucketStats,"chunkSize",t._n(e.target.value))},blur:function(e){t.$forceUpdate()}}})])])])]),n("b-card",{staticClass:"mb-2",attrs:{title:"Dropzone",tag:"article"}},[n("p",{staticClass:"card-text"},[t._v("\n            Drop your files here\n          ")]),n("input",{attrs:{type:"file",accept:"image/*",multiple:"true"},on:{change:t.onFileChange}})])],1),n("div",{staticClass:"col-md-4"},[n("b-card",{staticClass:"mb-2",attrs:{title:"Global Controls",tag:"article"}},[n("b-button",{attrs:{href:"#",variant:"primary"}},[t._v("Start Upload")]),t._v(" \n          "),n("b-button",{attrs:{href:"#",variant:"info"}},[t._v("Pause All")]),t._v(" \n          "),n("b-button",{attrs:{href:"#",variant:"danger"}},[t._v("Cancel All")]),t._v(" \n          "),n("b-button",{attrs:{href:"#",variant:"warning"}},[t._v("Tidy List")])],1),n("b-list-group",{staticClass:"mb-2"},t._l(t.myFiles,function(e){return n("b-list-group-item",{key:e.id,staticClass:"file-list"},[n("div",{staticClass:"row"},[n("div",{staticClass:"col-12"},[t._v("\n                "+t._s(e.id)+" : "+t._s(e.name)+" ("+t._s(t.formatFileSize(e.size))+")"),n("br"),n("b-progress",{attrs:{value:e.progress,max:100,"show-progress":"",animated:e.active}}),n("div",[n("small",[t._v("Chunks Left :  ")]),t._l(e.chunkArr,function(e){return n("b-badge",{key:e.id,staticClass:"mr-1",class:{"badge-light":0==e.status,"badge-info":1==e.status,"badge-danger":2==e.status,"badge-success":3==e.status},attrs:{variant:"",status:e.status}},[t._v(t._s(e.id))])})],2)],1)])])}),1)],1)])])])},u=[],l=n("59ad"),f=n.n(l),p=(n("7f7f"),new a["a"],{name:"app",components:{},mounted:function(){},methods:{getBucketStats:function(){var t=this;console.log("getting Status of Bucket"),this.axios.get("/bucketStatus",{baseURL:"http://localhost:3000",headers:{"Access-Control-Allow-Origin":"*"}}).then(function(e){t.bucketStats.statusObj=e})},onFileChange:function(t){for(var e=this,n=0;n<t.target.files.length;n++){var a=t.target.files[n];e.myFiles.push({id:e.currentItems,name:a.name,size:a.size,progress:0,active:!1,chunkCount:0,checkSum:"",file:a}),e.currentItems++}t.target.files=null},formatFileSize:function(t,e){if(0==t)return"0 Bytes";var n=1e3,a=e||2,s=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],r=Math.floor(Math.log(t)/Math.log(n));return f()((t/Math.pow(n,r)).toFixed(a))+" "+s[r]},calcChunkSize:function(t){return 1024*t}},data:function(){return{bucketStats:{name:"",totalSpace:"",usedSpace:"",chunkSize:32,statusObj:{}},currentItems:0,rawFiles:[],myFiles:[],dropzoneOptions:{url:"https://linkstorm-res-test.herokuapp.com/resumable",thumbnailWidth:150,query:{path:"10/1"},fileType:["gif","jpg","png","jpeg"],chunkSize:131072,simultaneousUploads:100,setChunkTypeFromFile:!0,prioritizeFirstAndLastChunk:!0,parallelChunkUploads:!0}}}}),d=p,b=(n("5c0b"),n("2877")),h=Object(b["a"])(d,c,u,!1,null,null,null),g=h.exports,v=n("2f62");a["a"].use(v["a"]);var m=new v["a"].Store({state:{},mutations:{},actions:{}}),k=n("9483");Object(k["a"])("".concat("/","service-worker.js"),{ready:function(){console.log("App is being served from cache by a service worker.\nFor more details, visit https://goo.gl/AFskqB")},registered:function(){console.log("Service worker has been registered.")},cached:function(){console.log("Content has been cached for offline use.")},updatefound:function(){console.log("New content is downloading.")},updated:function(){console.log("New content is available; please refresh.")},offline:function(){console.log("No internet connection found. App is running in offline mode.")},error:function(t){console.error("Error during service worker registration:",t)}});var S=n("9f7b"),C=n("cee2"),y=n.n(C);a["a"].config.productionTip=!1,a["a"].use(S["a"]),a["a"].use(y.a,{debug:!0,connection:"https://linkstorm-res-test.herokuapp.com/socket",vuex:{store:m,actionPrefix:"SOCKET_",mutationPrefix:"SOCKET_"}}),a["a"].use(i.a,r.a,{baseURL:"http://localhost:3000"}),new a["a"]({store:m,render:function(t){return t(g)}}).$mount("#app")},"5c0b":function(t,e,n){"use strict";var a=n("5e27"),s=n.n(a);s.a},"5e27":function(t,e,n){}});
//# sourceMappingURL=app.0a557891.js.map