(function(t){function e(e){for(var a,i,o=e[0],c=e[1],u=e[2],f=0,d=[];f<o.length;f++)i=o[f],r[i]&&d.push(r[i][0]),r[i]=0;for(a in c)Object.prototype.hasOwnProperty.call(c,a)&&(t[a]=c[a]);l&&l(e);while(d.length)d.shift()();return s.push.apply(s,u||[]),n()}function n(){for(var t,e=0;e<s.length;e++){for(var n=s[e],a=!0,o=1;o<n.length;o++){var c=n[o];0!==r[c]&&(a=!1)}a&&(s.splice(e--,1),t=i(i.s=n[0]))}return t}var a={},r={app:0},s=[];function i(e){if(a[e])return a[e].exports;var n=a[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=t,i.c=a,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},i.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)i.d(n,a,function(e){return t[e]}.bind(null,a));return n},i.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="/";var o=window["webpackJsonp"]=window["webpackJsonp"]||[],c=o.push.bind(o);o.push=e,o=o.slice();for(var u=0;u<o.length;u++)e(o[u]);var l=c;s.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},"56d7":function(t,e,n){"use strict";n.r(e);n("cadf"),n("551c"),n("097d");var a=n("2b0e"),r=n("bc3a"),s=n.n(r),i=n("a7fe"),o=n.n(i),c=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("div",{staticClass:"container-fluid"},[n("div",{staticClass:"row"},[n("div",{staticClass:"col-md-8"},[n("b-card",{staticClass:"mb-2",attrs:{title:"Bucket Status",tag:"article"}},[n("p",{staticClass:"card-text"},[t._v("\n            Data is gonna go here soon\n          ")]),n("b-button",{attrs:{variant:"primary"},on:{click:t.getBucketStats}},[t._v("Refresh")])],1),n("b-card",{staticClass:"mb-2",attrs:{title:"Settings",tag:"article"}},[n("div",{staticClass:"card-text"},[n("div",{staticClass:"form-group row"},[n("label",{staticClass:"col-2 col-form-label",attrs:{for:"chunkSize"}},[t._v("Chunk size (in kB)")]),n("div",{staticClass:"col-5"},[n("input",{directives:[{name:"model",rawName:"v-model.number",value:t.bucketStats.chunkSize,expression:"bucketStats.chunkSize",modifiers:{number:!0}}],staticClass:"form-control",attrs:{type:"text",id:"chunkSize"},domProps:{value:t.bucketStats.chunkSize},on:{input:function(e){e.target.composing||t.$set(t.bucketStats,"chunkSize",t._n(e.target.value))},blur:function(e){t.$forceUpdate()}}})])])])]),n("b-card",{staticClass:"mb-2",attrs:{title:"Dropzone",tag:"article"}},[n("p",{staticClass:"card-text"},[t._v("\n            Drop your files here\n          ")]),n("input",{attrs:{type:"file",accept:"image/*",multiple:"true"},on:{change:t.onFileChange}})])],1),n("div",{staticClass:"col-md-4"},[n("b-card",{staticClass:"mb-2",attrs:{title:"Global Controls",tag:"article"}},[n("b-button",{attrs:{href:"#",variant:"primary"}},[t._v("Start Upload")]),t._v(" \n          "),n("b-button",{attrs:{href:"#",variant:"info"}},[t._v("Pause All")]),t._v(" \n          "),n("b-button",{attrs:{href:"#",variant:"danger"}},[t._v("Cancel All")]),t._v(" \n          "),n("b-button",{attrs:{href:"#",variant:"warning"}},[t._v("Tidy List")])],1),n("b-list-group",{staticClass:"mb-2"},t._l(t.myFiles,function(e){return n("b-list-group-item",{key:e.id,staticClass:"file-list"},[n("div",{staticClass:"row"},[n("div",{staticClass:"col-12"},[t._v("\n                "+t._s(e.id)+" : "+t._s(e.name)+" ("+t._s(t.formatFileSize(e.size))+")"),n("br"),n("b-progress",{attrs:{value:e.progress,max:100,"show-progress":"",animated:e.active}}),n("div",[n("small",[t._v("Chunks Left :  ")]),t._l(e.chunkArr,function(e){return n("b-badge",{key:e.id,staticClass:"mr-1",class:{"badge-light":0==e.status,"badge-info":1==e.status,"badge-danger":2==e.status,"badge-success":3==e.status},attrs:{variant:"",status:e.status}},[t._v(t._s(e.id))])})],2)],1)])])}),1)],1)])])])},u=[],l=n("59ad"),f=n.n(l),d=(n("7f7f"),n("7618")),p=new a["a"],h=p,g={name:"app",components:{},mounted:function(){var t=this;h.$on("chunkImages",function(e){if(console.log("Starting to chunk a image",e),void 0!=Object(d["a"])(t.$data.myFiles[e].file)){var n=[],a=t.$data.myFiles[e].file,r=t.$data.bucketStats.chunkSize,s=t.calcChunkSize(r),i=Math.ceil(a.size/s,s),o=0;t.$data.myFiles[e].chunkCount=i;while(o<i){var c=o*s;n.push({id:o,data:a.slice(c,s),status:0}),o++}t.$data.myFiles[e].chunkArr=n}}),this.getBucketStats()},methods:{getBucketStats:function(){console.log("getting Status of Bucket"),this.axios.get("/bucketStatus",{headers:{"Access-Control-Allow-Origin":"*"}}).then(function(t){console.log(t.data)})},onFileChange:function(t){for(var e=this,n=0;n<t.target.files.length;n++){var a=t.target.files[n];e.myFiles.push({id:e.currentItems,name:a.name,size:a.size,progress:0,active:!1,chunkCount:0,checkSum:"",chunkArr:[],file:a}),h.$emit("chunkImages",e.currentItems),e.currentItems++}t.target.files=null},formatFileSize:function(t,e){if(0==t)return"0 Bytes";var n=1e3,a=e||2,r=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],s=Math.floor(Math.log(t)/Math.log(n));return f()((t/Math.pow(n,s)).toFixed(a))+" "+r[s]},calcChunkSize:function(t){return 1024*t}},data:function(){return{bucketStats:{name:"",totalSpace:"",usedSpace:"",chunkSize:32},currentItems:0,rawFiles:[],myFiles:[],dropzoneOptions:{url:"https://linkstorm-res-test.herokuapp.com/resumable",thumbnailWidth:150,query:{path:"10/1"},fileType:["gif","jpg","png","jpeg"],chunkSize:131072,simultaneousUploads:100,setChunkTypeFromFile:!0,prioritizeFirstAndLastChunk:!0,parallelChunkUploads:!0}}}},b=g,m=(n("5c0b"),n("2877")),v=Object(m["a"])(b,c,u,!1,null,null,null),k=v.exports,S=n("2f62");a["a"].use(S["a"]);var y=new S["a"].Store({state:{},mutations:{},actions:{}}),C=n("9483");Object(C["a"])("".concat("/","service-worker.js"),{ready:function(){console.log("App is being served from cache by a service worker.\nFor more details, visit https://goo.gl/AFskqB")},registered:function(){console.log("Service worker has been registered.")},cached:function(){console.log("Content has been cached for offline use.")},updatefound:function(){console.log("New content is downloading.")},updated:function(){console.log("New content is available; please refresh.")},offline:function(){console.log("No internet connection found. App is running in offline mode.")},error:function(t){console.error("Error during service worker registration:",t)}});var _=n("9f7b"),w=n("cee2"),z=n.n(w);a["a"].config.productionTip=!1,a["a"].use(_["a"]),a["a"].use(z.a,{debug:!0,connection:"https://linkstorm-res-test.herokuapp.com/socket",vuex:{store:y,actionPrefix:"SOCKET_",mutationPrefix:"SOCKET_"}}),a["a"].use(o.a,s.a),new a["a"]({store:y,render:function(t){return t(k)}}).$mount("#app")},"5c0b":function(t,e,n){"use strict";var a=n("5e27"),r=n.n(a);r.a},"5e27":function(t,e,n){}});
//# sourceMappingURL=app.5cb183d1.js.map