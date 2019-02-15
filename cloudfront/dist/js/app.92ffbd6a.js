(function(t){function e(e){for(var n,i,o=e[0],c=e[1],u=e[2],f=0,d=[];f<o.length;f++)i=o[f],s[i]&&d.push(s[i][0]),s[i]=0;for(n in c)Object.prototype.hasOwnProperty.call(c,n)&&(t[n]=c[n]);l&&l(e);while(d.length)d.shift()();return r.push.apply(r,u||[]),a()}function a(){for(var t,e=0;e<r.length;e++){for(var a=r[e],n=!0,o=1;o<a.length;o++){var c=a[o];0!==s[c]&&(n=!1)}n&&(r.splice(e--,1),t=i(i.s=a[0]))}return t}var n={},s={app:0},r=[];function i(e){if(n[e])return n[e].exports;var a=n[e]={i:e,l:!1,exports:{}};return t[e].call(a.exports,a,a.exports,i),a.l=!0,a.exports}i.m=t,i.c=n,i.d=function(t,e,a){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},i.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(i.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)i.d(a,n,function(e){return t[e]}.bind(null,n));return a},i.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="/";var o=window["webpackJsonp"]=window["webpackJsonp"]||[],c=o.push.bind(o);o.push=e,o=o.slice();for(var u=0;u<o.length;u++)e(o[u]);var l=c;r.push([0,"chunk-vendors"]),a()})({0:function(t,e,a){t.exports=a("56d7")},"56d7":function(t,e,a){"use strict";a.r(e);a("cadf"),a("551c"),a("097d");var n=a("2b0e"),s=a("bc3a"),r=a.n(s),i=a("a7fe"),o=a.n(i),c=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{attrs:{id:"app"}},[a("div",{staticClass:"container-fluid"},[a("div",{staticClass:"row"},[a("div",{staticClass:"col-md-8"},[a("b-card",{staticClass:"mb-2",attrs:{title:"Bucket Status",tag:"article"}},[a("p",{staticClass:"card-text"},[a("code",{model:{value:t.bucketStats.statusObj,callback:function(e){t.$set(t.bucketStats,"statusObj",e)},expression:"bucketStats.statusObj"}})]),a("b-button",{attrs:{variant:"primary"},on:{click:t.getBucketStats}},[t._v("Refresh")])],1),a("b-card",{staticClass:"mb-2",attrs:{title:"Settings",tag:"article"}},[a("div",{staticClass:"card-text"},[a("div",{staticClass:"form-group row"},[a("label",{staticClass:"col-2 col-form-label",attrs:{for:"chunkSize"}},[t._v("Chunk size (in kB)")]),a("div",{staticClass:"col-5"},[a("input",{directives:[{name:"model",rawName:"v-model.number",value:t.bucketStats.chunkSize,expression:"bucketStats.chunkSize",modifiers:{number:!0}}],staticClass:"form-control",attrs:{type:"text",id:"chunkSize"},domProps:{value:t.bucketStats.chunkSize},on:{input:function(e){e.target.composing||t.$set(t.bucketStats,"chunkSize",t._n(e.target.value))},blur:function(e){t.$forceUpdate()}}})])])])]),a("b-card",{staticClass:"mb-2",attrs:{title:"Dropzone",tag:"article"}},[a("p",{staticClass:"card-text"},[t._v("\n            Drop your files here\n          ")]),a("input",{attrs:{type:"file",accept:"image/*",multiple:"true"},on:{change:t.onFileChange}})])],1),a("div",{staticClass:"col-md-4"},[a("b-card",{staticClass:"mb-2",attrs:{title:"Global Controls",tag:"article"}},[a("b-button",{attrs:{href:"#",variant:"primary"}},[t._v("Start Upload")]),t._v(" \n          "),a("b-button",{attrs:{href:"#",variant:"info"}},[t._v("Pause All")]),t._v(" \n          "),a("b-button",{attrs:{href:"#",variant:"danger"}},[t._v("Cancel All")]),t._v(" \n          "),a("b-button",{attrs:{href:"#",variant:"warning"}},[t._v("Tidy List")])],1),a("b-list-group",{staticClass:"mb-2"},t._l(t.myFiles,function(e){return a("b-list-group-item",{key:e.id,staticClass:"file-list"},[a("div",{staticClass:"row"},[a("div",{staticClass:"col-12"},[t._v("\n                "+t._s(e.id)+" : "+t._s(e.name)+" ("+t._s(t.formatFileSize(e.size))+")"),a("br"),a("b-progress",{attrs:{value:e.progress,max:100,"show-progress":"",animated:e.active}}),a("div",[a("small",[t._v("Chunks Left :  ")]),t._l(e.chunkArr,function(e){return a("b-badge",{key:e.id,staticClass:"mr-1",class:{"badge-light":0==e.status,"badge-info":1==e.status,"badge-danger":2==e.status,"badge-success":3==e.status},attrs:{variant:"",status:e.status}},[t._v(t._s(e.id))])})],2)],1)])])}),1)],1)])])])},u=[],l=a("59ad"),f=a.n(l),d=(a("7f7f"),a("7618")),p=new n["a"],b=p,h={name:"app",components:{},mounted:function(){var t=this;b.$on("chunkImages",function(e){if(console.log("Starting to chunk a image",e),void 0!=Object(d["a"])(t.$data.myFiles[e].file)){var a=[],n=t.$data.myFiles[e].file,s=t.$data.bucketStats.chunkSize,r=t.calcChunkSize(s),i=Math.ceil(n.size/r,r),o=0;t.$data.myFiles[e].chunkCount=i;while(o<i){var c=o*r;a.push({id:o,data:n.slice(c,r),status:0}),o++}t.$data.myFiles[e].chunkArr=a}})},methods:{getBucketStats:function(){var t=this;console.log("getting Status of Bucket"),this.axios.get("/bucketStatus",{baseURL:"http://localhost:3000",headers:{"Access-Control-Allow-Origin":"*"}}).then(function(e){t.bucketStats.statusObj=e})},onFileChange:function(t){for(var e=this,a=0;a<t.target.files.length;a++){var n=t.target.files[a];e.myFiles.push({id:e.currentItems,name:n.name,size:n.size,progress:0,active:!1,chunkCount:0,checkSum:"",chunkArr:[],file:n}),b.$emit("chunkImages",e.currentItems),e.currentItems++}t.target.files=null},formatFileSize:function(t,e){if(0==t)return"0 Bytes";var a=1e3,n=e||2,s=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],r=Math.floor(Math.log(t)/Math.log(a));return f()((t/Math.pow(a,r)).toFixed(n))+" "+s[r]},calcChunkSize:function(t){return 1024*t}},data:function(){return{bucketStats:{name:"",totalSpace:"",usedSpace:"",chunkSize:32,statusObj:{}},currentItems:0,rawFiles:[],myFiles:[],dropzoneOptions:{url:"https://linkstorm-res-test.herokuapp.com/resumable",thumbnailWidth:150,query:{path:"10/1"},fileType:["gif","jpg","png","jpeg"],chunkSize:131072,simultaneousUploads:100,setChunkTypeFromFile:!0,prioritizeFirstAndLastChunk:!0,parallelChunkUploads:!0}}}},g=h,m=(a("5c0b"),a("2877")),v=Object(m["a"])(g,c,u,!1,null,null,null),k=v.exports,S=a("2f62");n["a"].use(S["a"]);var y=new S["a"].Store({state:{},mutations:{},actions:{}}),C=a("9483");Object(C["a"])("".concat("/","service-worker.js"),{ready:function(){console.log("App is being served from cache by a service worker.\nFor more details, visit https://goo.gl/AFskqB")},registered:function(){console.log("Service worker has been registered.")},cached:function(){console.log("Content has been cached for offline use.")},updatefound:function(){console.log("New content is downloading.")},updated:function(){console.log("New content is available; please refresh.")},offline:function(){console.log("No internet connection found. App is running in offline mode.")},error:function(t){console.error("Error during service worker registration:",t)}});var _=a("9f7b"),w=a("cee2"),z=a.n(w);n["a"].config.productionTip=!1,n["a"].use(_["a"]),n["a"].use(z.a,{debug:!0,connection:"https://linkstorm-res-test.herokuapp.com/socket",vuex:{store:y,actionPrefix:"SOCKET_",mutationPrefix:"SOCKET_"}}),n["a"].use(o.a,r.a,{baseURL:"http://localhost:3000"}),new n["a"]({store:y,render:function(t){return t(k)}}).$mount("#app")},"5c0b":function(t,e,a){"use strict";var n=a("5e27"),s=a.n(n);s.a},"5e27":function(t,e,a){}});
//# sourceMappingURL=app.92ffbd6a.js.map