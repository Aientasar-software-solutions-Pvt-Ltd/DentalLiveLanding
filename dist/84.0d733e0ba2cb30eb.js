"use strict";(self.webpackChunkDentalLive_dev=self.webpackChunkDentalLive_dev||[]).push([[84],{995:(D,U,r)=>{r.d(U,{F:()=>l});var f=r(5861),h=r(520),C=r(2340),e=r(7206),v=r(5e3);let l=(()=>{class p{constructor(d){this.http=d}getUserDetails(){try{let d=sessionStorage.getItem("usr");if(!d)return!1;let u=JSON.parse(e.AES.decrypt(d,C.N.decryptKey).toString(e.enc.Utf8));return!(u.exp<Date.now())&&u}catch(d){return sessionStorage.removeItem("usr"),!1}}uploadBinaryData(d,u,b){console.log(u);var _=this;return new Promise(function(x,y){_.getPreSignedUrl(d,b,"put",u.type).then(T=>{_.saveDataS3(u,T.url).then(()=>{x(T.name)}).catch(w=>{console.log(w),y("Failed to Upload")})}).catch(T=>{console.log(T),y("Failed to Upload")})})}getPreSignedUrl(d,u,b="get",_){var x=this;return(0,f.Z)(function*(){let y=new h.WM,T=sessionStorage.getItem("usr");return y=y.set("authorization",T),yield x.http.get(`https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/objectUrl?name=${d}&module=${u}&type=${b}&media=${_}`,{headers:y}).toPromise()})()}saveDataS3(d,u){var b=this;return(0,f.Z)(function*(){if(yield b.http.put(u,d).toPromise())return!0})()}}return p.\u0275fac=function(d){return new(d||p)(v.LFG(h.eN))},p.\u0275prov=v.Yz7({token:p,factory:p.\u0275fac,providedIn:"root"}),p})()},2084:(D,U,r)=>{r.r(U),r.d(U,{FilesModule:()=>le});var f=r(9808),h=r(1879),C=r(5415),e=r(5e3);let g=(()=>{class i{constructor(){}ngOnInit(){}}return i.\u0275fac=function(t){return new(t||i)},i.\u0275cmp=e.Xpm({type:i,selectors:[["app-files"]],decls:1,vars:0,template:function(t,a){1&t&&e._UZ(0,"router-outlet")},directives:[h.lC],encapsulation:2}),i})();var v=r(1373),l=r.n(v),p=r(9114),m=r(2290),d=r(3762),u=r(995),b=r(9506),_=r(2382);function x(i,o){if(1&i&&(e.TgZ(0,"div",53)(1,"h3",54),e._uU(2),e.TgZ(3,"span",55),e._uU(4),e.qZA(),e.TgZ(5,"div",56),e._UZ(6,"div",57),e.qZA()()()),2&i){const t=e.oxw();e.xp6(2),e.hij("",t.tabledata.patientName," "),e.xp6(2),e.Oqu(t.tabledata.title)}}function y(i,o){1&i&&e._UZ(0,"ngx-shimmer-loading",61),2&i&&e.Q6J("width","100%")("height","50px")("margin","20px")}function T(i,o){if(1&i&&(e.ynx(0,58),e._UZ(1,"div",59),e.YNc(2,y,1,3,"ngx-shimmer-loading",60),e.BQk()),2&i){const t=e.oxw();e.xp6(2),e.Q6J("ngForOf",t.shimmer(10).fill(1))}}function w(i,o){1&i&&e._UZ(0,"img",73)}function I(i,o){1&i&&e._UZ(0,"img",74)}function M(i,o){if(1&i&&(e.TgZ(0,"div",67)(1,"div",68)(2,"a",69),e.YNc(3,w,1,0,"img",70),e.YNc(4,I,1,0,"ng-template",null,71,e.W1O),e.TgZ(6,"p",72),e._uU(7),e.qZA()()()()),2&i){const t=e.MAs(5),a=e.oxw().$implicit,s=e.oxw(3);e.xp6(2),e.hYB("routerLink","/casefiles/file-details/",a.fileUploadId,"/",s.getcaseId,""),e.xp6(1),e.Q6J("ngIf",a.files[0].url)("ngIfElse",t),e.xp6(4),e.Oqu(a.files[0].name)}}function N(i,o){1&i&&e._UZ(0,"img",76)}function S(i,o){1&i&&e._UZ(0,"img",74)}function O(i,o){if(1&i&&(e.TgZ(0,"div",67)(1,"div",68)(2,"a",69),e.YNc(3,N,1,0,"img",75),e.YNc(4,S,1,0,"ng-template",null,71,e.W1O),e.TgZ(6,"p",72),e._uU(7),e.qZA()()()()),2&i){const t=e.MAs(5),a=e.oxw().$implicit,s=e.oxw(3);e.xp6(2),e.hYB("routerLink","/casefiles/file-details/",a.fileUploadId,"/",s.getcaseId,""),e.xp6(1),e.Q6J("ngIf",a.files[0].url)("ngIfElse",t),e.xp6(4),e.Oqu(a.files[0].name)}}function E(i,o){1&i&&e._UZ(0,"img",73)}function k(i,o){1&i&&e._UZ(0,"img",74)}function L(i,o){if(1&i&&(e.TgZ(0,"div",67)(1,"div",68)(2,"a",69),e.YNc(3,E,1,0,"img",70),e.YNc(4,k,1,0,"ng-template",null,71,e.W1O),e.TgZ(6,"p",72),e._uU(7),e.qZA()()()()),2&i){const t=e.MAs(5),a=e.oxw().$implicit,s=e.oxw(3);e.xp6(2),e.hYB("routerLink","/casefiles/file-details/",a.fileUploadId,"/",s.getcaseId,""),e.xp6(1),e.Q6J("ngIf",a.files[0].url)("ngIfElse",t),e.xp6(4),e.Oqu(a.files[0].name)}}function Y(i,o){1&i&&e._UZ(0,"img",78)}function J(i,o){1&i&&e._UZ(0,"img",74)}function P(i,o){if(1&i&&(e.TgZ(0,"div",67)(1,"div",68)(2,"a",69),e.YNc(3,Y,1,0,"img",77),e.YNc(4,J,1,0,"ng-template",null,71,e.W1O),e.TgZ(6,"p",72),e._uU(7),e.qZA()()()()),2&i){const t=e.MAs(5),a=e.oxw().$implicit,s=e.oxw(3);e.xp6(2),e.hYB("routerLink","/casefiles/file-details/",a.fileUploadId,"/",s.getcaseId,""),e.xp6(1),e.Q6J("ngIf",a.files[0].url)("ngIfElse",t),e.xp6(4),e.Oqu(a.files[0].name)}}function q(i,o){if(1&i&&(e.TgZ(0,"div",65),e.YNc(1,M,8,5,"div",66),e.YNc(2,O,8,5,"div",66),e.YNc(3,L,8,5,"div",66),e.YNc(4,P,8,5,"div",66),e.qZA()),2&i){const t=o.$implicit;e.xp6(1),e.Q6J("ngIf","application/pdf"==t.files[0].mediaType||"audio/mpeg"==t.files[0].mediaType),e.xp6(1),e.Q6J("ngIf","video/mp4"==t.files[0].mediaType||"video/avi"==t.files[0].mediaType||"video/3gp"==t.files[0].mediaType),e.xp6(1),e.Q6J("ngIf","application/msword"==t.files[0].mediaType),e.xp6(1),e.Q6J("ngIf","image/jpeg"==t.files[0].mediaType||"image/png"==t.files[0].mediaType||"image/jpg"==t.files[0].mediaType)}}function j(i,o){if(1&i&&(e.TgZ(0,"div",13),e.YNc(1,q,5,4,"div",64),e.qZA()),2&i){const t=e.oxw(2);e.xp6(1),e.Q6J("ngForOf",t.allfile)}}function B(i,o){if(1&i&&(e.TgZ(0,"div",62),e.YNc(1,j,2,1,"div",63),e.qZA()),2&i){const t=e.oxw();e.xp6(1),e.Q6J("ngIf",t.allfile)}}function Q(i,o){if(1&i&&(e.TgZ(0,"div",41),e._UZ(1,"input",79)(2,"input",80)(3,"input",81)(4,"input",82)(5,"input",83),e.TgZ(6,"button",84),e._uU(7,"Save"),e.qZA(),e.TgZ(8,"button",42),e._uU(9,"Cancel"),e.qZA()()),2&i){const t=e.oxw(),a=e.MAs(63);e.xp6(1),e.s9C("ngModel",t.tabledata.fetchedData[0].data[0].resorceOwner),e.xp6(1),e.s9C("ngModel",t.tabledata.caseId),e.xp6(1),e.s9C("ngModel",t.tabledata.patientId),e.xp6(1),e.s9C("ngModel",t.tabledata.patientName),e.xp6(1),e.s9C("ngModel",t.tabledata.dateCreated),e.xp6(1),e.Q6J("disabled",!a.form.valid)}}let R=(()=>{class i{constructor(t,a,s,c,n,Z){this.dataService=t,this.utility=a,this.usr=s,this.router=c,this.route=n,this.UtilityDev=Z,this.isLoadingData=!0,this.attachmentUploadFiles=[],this.UploadFiles=[],this.module="patient",this.jsonObj={ownerName:"",caseId:"",patientId:"",patientName:"",dateCreated:0,files:Array()},this.shimmer=Array,this.dateCreated=this.route.snapshot.paramMap.get("dateCreated"),this.getcaseId=this.route.snapshot.paramMap.get("caseId")}ngOnInit(){this.getAllFiles(),this.getCaseDetails()}getTimeStamp(t){var a=t.split("/");return new Date(a[2],a[0]-1,a[1]).getTime()}setcvFast(t){if(t.length>0){for(var a=0;a<t.length;a++)this.dataService.getallData("https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/objectUrl?name="+t[a].files[0].name+"&module="+this.module+"&type=get",!0).subscribe(n=>{n&&(this.allfilesdata[a-1].files[0].url=n)},n=>{n.status?l()(n.error):l()("Unable to fetch the data, please try again")});this.allfile=this.allfilesdata}}getAllFiles(){sessionStorage.setItem("dateCreated",this.dateCreated);let t=this.utility.apiData.userCaseFiles.ApiUrl,s=Number(this.dateCreated),c=new Date(s).toLocaleDateString("en-US"),n=this.getTimeStamp(c),A=this.getcaseId;""!=A&&(t+="?caseId="+A),n&&(t+="&dateFrom="+n+"&dateTo="+(n+864e5)),this.dataService.getallData(t,!0).subscribe(F=>{F&&(this.allfilesdata=JSON.parse(F.toString()),this.setcvFast(this.allfilesdata),this.isLoadingData=!1)},F=>{F.status?l()(F.error):l()("Unable to fetch the data, please try again")})}getCaseDetails(){this.tabledata="";let t=this.utility.apiData.userCases.ApiUrl,a=this.getcaseId;""!=a&&(t+="?caseId="+a),this.dataService.getallData(t,!0).subscribe(s=>{s&&(this.tabledata=JSON.parse(s.toString()))},s=>{s.status?l()(s.error):l()("Unable to fetch the data, please try again")})}onSubmit(t){let a=this.utility.apiData.userCaseFiles.ApiUrl,c=t.value.ownerName.split(" ");""!=c[0]&&(a+="?ownerName="+c[0]),c.length>1&&""!=c[1]&&(a+=""!=c[0]?"&lastName="+c[1]:"?lastName="+c[1]),this.dataService.getallData(a,!0).subscribe(n=>{n&&(this.allfilesdata=JSON.parse(n.toString()),this.isLoadingData=!1)},n=>{n.status?l()(n.error):l()("Unable to fetch the data, please try again")})}getUniqueName(t){let a=0;return a>0&&(t=t.split(".")[0]+"_"+a+"."+t.split(".")[1]),a++,t}loadFiles(t){if(t.target.files.length>0){if(!["image","video","audio","pdf","msword","ms-excel"].some(s=>t.target.files[0].type.includes(s)))return void l()("File Extenion Not Allowed");this.attachmentUploadFiles=Array(),this.attachmentUploadFiles.push({name:this.getUniqueName(t.target.files[0].name),binaryData:t.target.files[0],size:t.target.files[0].size,type:t.target.files[0].type})}}onGetdateData(t){this.jsonObj.ownerName=t.resorceowner,this.jsonObj.caseId=t.caseid,this.jsonObj.patientId=t.patientid,this.jsonObj.patientName=t.patientname,t.uploadfile&&(this.jsonObj.files=this.UploadFiles),this.dataService.postData(this.utility.apiData.userCaseFiles.ApiUrl,JSON.stringify(this.jsonObj),!0).subscribe(a=>{a&&(a=JSON.parse(a.toString())),this.isLoadingData=!1,l()("Files added successfully"),window.location.reload()},a=>{a.status?l()(a.error):l()("Unable to fetch the data, please try again")})}onSubmitFiles(t){if(t.invalid)t.form.markAllAsTouched();else if(t.value.uploadfile){if(this.attachmentUploadFiles.length>0){l()("Processing...please wait...",{buttons:[!1,!1],closeOnClickOutside:!1});let a=this.attachmentUploadFiles[0].type,s=Math.round(this.attachmentUploadFiles[0].size/1024),c=this.attachmentUploadFiles.map(n=>this.UtilityDev.uploadBinaryData(n.name,n.binaryData,this.module));Promise.all(c).then(n=>{this.attachmentUploadFiles=[];let Z=n[0];this.dataService.getallData("https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/objectUrl?name="+Z+"&module="+this.module+"&type=get",!0).subscribe(F=>{F&&(this.UploadFiles=Array(),this.UploadFiles.push({url:F,name:Z,mediaType:a,mediaSize:s.toString()}),this.onGetdateData(t.value))},F=>{F.status?l()(F.error):l()("Unable to fetch the data, please try again")})}).catch(n=>(console.log(n),!1))}}else this.onGetdateData(t.value)}}return i.\u0275fac=function(t){return new(t||i)(e.Y36(p.T),e.Y36(m.t),e.Y36(d.f),e.Y36(h.F0),e.Y36(h.gz),e.Y36(u.F))},i.\u0275cmp=e.Xpm({type:i,selectors:[["app-all-files"]],decls:71,vars:4,consts:[[1,"breadcrumb"],[1,"breadcrumb-item"],["routerLink","/dashboard"],["aria-hidden","true",1,"bx","bxs-home"],["aria-current","page",1,"breadcrumb-item","active"],[1,"page-header","row","align-items-center","gx-0"],[1,"col-md-6"],["class","d-inline-block",4,"ngIf"],[1,"col-md-6","text-end"],["id","priceList",1,"row","pt-2"],[1,"col-md-12"],[1,"card","pb-4","shadow-sm"],[1,"card-header","border-bottom-0","bg-white"],[1,"row"],[1,"col-md-5","align-self-center"],[1,"body1","card-title","my-2"],[1,"col-md-7"],[1,"d-flex","align-items-center","flex-wrap","justify-content-end"],["data-bs-toggle","modal","data-bs-target","#filterModal",1,"btn","filter-btn","me-2","my-2"],[1,"bx","bx-filter-alt"],[1,"d-none","d-sm-inline-block","ms-2"],["data-bs-toggle","modal","data-bs-target","#uploadFileModal",1,"btn","btn-default"],[1,"bx","bx-upload"],[1,"table","table-hover","table-nowrap","align-middle"],[1,"thead-light"],[2,"text-transform","uppercase"],[1,"body2"],["class","mt-3",4,"ngIf"],["class","container",4,"ngIf"],["id","filterModal","tabindex","-1","aria-labelledby","exampleModalLabel","aria-hidden","true",1,"modal","fade"],[1,"modal-dialog"],[1,"modal-content"],[1,"modal-header"],["id","exampleModalLabel",1,"modal-title"],["type","button","data-bs-dismiss","modal","aria-label","Close",1,"btn-close"],["id","mainForm",3,"ngSubmit"],["f","ngForm"],[1,"modal-body"],[1,"search","my-2"],[1,"bx","bx-search"],["type","text","ngModel","","name","ownerName","id","ownerName","placeholder","Search by Owner Name",1,"form-control"],[1,"modal-footer"],["type","button","data-bs-dismiss","modal",1,"btn","btn-secondary"],["type","submit","data-bs-dismiss","modal",1,"btn","btn-default"],["id","uploadFileModal","tabindex","-1","aria-labelledby","uploadModalLabel","aria-hidden","true",1,"modal","fade"],[1,"modal-dialog","modal-dialog-centered"],["id","uploadModalLabel",1,"modal-title","body1"],["id","filesForm",3,"ngSubmit"],["filesForm","ngForm"],[1,"row","gy-3"],[1,"form-label","body2","text-dark"],["type","file","ngModel","","name","uploadfile","id","uploadfile","required","","accept","application/msword,.xls,.xlsx,image/*,video/*,audio/*,.pdf",1,"form-control",2,"line-height","2.2","background-color","#EFF3F7","border","2px dashed #AEB4BF",3,"change"],["class","modal-footer",4,"ngIf"],[1,"d-inline-block"],[1,"mt-2","fw-normal"],[1,"fw-bold","d-block"],[1,"progress","progress-sm","mt-2"],["role","progressbar","aria-valuenow","55","aria-valuemin","0","aria-valuemax","100",1,"progress-bar","bg-primary",2,"width","55%"],[1,"mt-3"],[1,"mt-5","w-100"],["style","margin-top: 1.5em;display: block;transition: all 1s;","class","vh-100",3,"width","height","margin",4,"ngFor","ngForOf"],[1,"vh-100",2,"margin-top","1.5em","display","block","transition","all 1s",3,"width","height","margin"],[1,"container"],["class","row",4,"ngIf"],["class","col-md-2",4,"ngFor","ngForOf"],[1,"col-md-2"],["class","card mb-3","style","max-width: 18rem;border: 1px solid #D0D6DE;",4,"ngIf"],[1,"card","mb-3",2,"max-width","18rem","border","1px solid #D0D6DE"],[1,"card-body","text-center"],[1,"text-dark",3,"routerLink"],["src","assets/images/file.png","height","58px",4,"ngIf","ngIfElse"],["noimage",""],[1,"card-text"],["src","assets/images/file.png","height","58px"],["src","assets/images/no-image.png","height","58px"],["src","assets/images/video.png","height","58px",4,"ngIf","ngIfElse"],["src","assets/images/video.png","height","58px"],["src","assets/images/image-icon.png","height","58px",4,"ngIf","ngIfElse"],["src","assets/images/image-icon.png","height","58px"],["type","hidden","name","resorceowner","id","resorceowner",3,"ngModel"],["type","hidden","name","caseid","id","caseid",3,"ngModel"],["type","hidden","name","patientid","id","patientid",3,"ngModel"],["type","hidden","name","patientname","id","patientname",3,"ngModel"],["type","hidden","name","datecreated","id","datecreated",3,"ngModel"],["type","submit","data-bs-dismiss","modal","data-bs-dismiss","modal",1,"btn","btn-default",3,"disabled"]],template:function(t,a){if(1&t){const s=e.EpF();e.TgZ(0,"ol",0)(1,"li",1)(2,"a",2),e._UZ(3,"i",3),e._uU(4," Dashboard"),e.qZA()(),e.TgZ(5,"li",4),e._uU(6," Files "),e.qZA()(),e.TgZ(7,"div",5)(8,"div",6),e.YNc(9,x,7,2,"div",7),e.qZA(),e._UZ(10,"div",8),e.qZA(),e.TgZ(11,"div",9)(12,"div",10)(13,"div",11)(14,"div",12)(15,"div",13)(16,"div",14)(17,"h5",15),e._uU(18,"Files"),e.qZA()(),e.TgZ(19,"div",16)(20,"div",17)(21,"button",18),e._UZ(22,"i",19),e.TgZ(23,"span",20),e._uU(24,"Filter"),e.qZA()(),e.TgZ(25,"button",21),e._UZ(26,"i",22),e._uU(27," Upload Files "),e.qZA()()()()(),e.TgZ(28,"table",23)(29,"thead",24)(30,"tr",25)(31,"th",26),e._uU(32,"Files"),e.qZA()()()(),e.YNc(33,T,3,1,"ng-container",27),e.YNc(34,B,2,1,"div",28),e.qZA()()(),e.TgZ(35,"div",29)(36,"div",30)(37,"div",31)(38,"div",32)(39,"h5",33),e._uU(40,"Filter"),e.qZA(),e._UZ(41,"button",34),e.qZA(),e.TgZ(42,"form",35,36),e.NdJ("ngSubmit",function(){e.CHM(s);const n=e.MAs(43);return a.onSubmit(n)}),e.TgZ(44,"div",37)(45,"div",13)(46,"div",10)(47,"div",38),e._UZ(48,"i",39)(49,"input",40),e.qZA()()()(),e.TgZ(50,"div",41)(51,"button",42),e._uU(52,"Close"),e.qZA(),e.TgZ(53,"button",43),e._uU(54,"Apply"),e.qZA()()()()()(),e.TgZ(55,"div",44)(56,"div",45)(57,"div",31)(58,"div",32)(59,"h5",46),e._uU(60,"Upload Files"),e.qZA(),e._UZ(61,"button",34),e.qZA(),e.TgZ(62,"form",47,48),e.NdJ("ngSubmit",function(){e.CHM(s);const n=e.MAs(63);return a.onSubmitFiles(n)}),e.TgZ(64,"div",37)(65,"div",49)(66,"div",10)(67,"label",50),e._uU(68,"Upload File"),e.qZA(),e.TgZ(69,"input",51),e.NdJ("change",function(n){return a.loadFiles(n)}),e.qZA()()()(),e.YNc(70,Q,10,6,"div",52),e.qZA()()()()}2&t&&(e.xp6(9),e.Q6J("ngIf",a.tabledata),e.xp6(24),e.Q6J("ngIf",a.isLoadingData),e.xp6(1),e.Q6J("ngIf",!a.isLoadingData),e.xp6(36),e.Q6J("ngIf",a.tabledata))},directives:[h.yS,f.O5,f.sg,b.w,_._Y,_.JL,_.F,_.Fj,_.JJ,_.On,_.Q7],styles:[".progress[_ngcontent-%COMP%]   .bg-primary[_ngcontent-%COMP%]{background-color:#1991eb!important}.progress-sm[_ngcontent-%COMP%]{height:.5rem}"]}),i})();var z=r(8306),W=r(2313);function K(i,o){if(1&i&&(e.TgZ(0,"div",21)(1,"div",22)(2,"h3",23),e._uU(3),e.TgZ(4,"span",24),e._uU(5),e.qZA(),e.TgZ(6,"div",25),e._UZ(7,"div",26),e.qZA()()()()),2&i){const t=e.oxw();e.xp6(3),e.hij("",t.tabledata.patientName," "),e.xp6(2),e.Oqu(t.tabledata.title)}}function H(i,o){if(1&i&&e._UZ(0,"img",37),2&i){const t=e.oxw(2);e.s9C("src",t.filedetails.files[0].url,e.LSH)}}function G(i,o){if(1&i&&e._UZ(0,"iframe",38),2&i){const t=e.oxw(2);e.Q6J("src",t.urlSafe,e.uOi)}}function V(i,o){if(1&i&&(e.TgZ(0,"div",13)(1,"div",27),e.YNc(2,H,1,1,"img",28),e.YNc(3,G,1,1,"iframe",29),e.TgZ(4,"a",30)(5,"p",31),e._uU(6),e.qZA()(),e.TgZ(7,"span",32),e._uU(8),e.qZA(),e.TgZ(9,"div",33)(10,"label",34),e._uU(11,"Created Date"),e.qZA(),e.TgZ(12,"div",35),e._UZ(13,"input",36),e.ALo(14,"date"),e.qZA()(),e.TgZ(15,"div",33)(16,"label",34),e._uU(17,"File Size"),e.qZA(),e.TgZ(18,"div",35),e._UZ(19,"input",36),e.qZA()()()()),2&i){const t=e.oxw();e.xp6(2),e.Q6J("ngIf","image/jpeg"==t.filedetails.files[0].mediaType||"image/png"==t.filedetails.files[0].mediaType||"image/jpg"==t.filedetails.files[0].mediaType),e.xp6(1),e.Q6J("ngIf","video/mp4"==t.filedetails.files[0].mediaType||"video/avi"==t.filedetails.files[0].mediaType||"video/3gp"==t.filedetails.files[0].mediaType||"application/pdf"==t.filedetails.files[0].mediaType||"application/PDF"==t.filedetails.files[0].mediaType||"audio/mpeg"==t.filedetails.files[0].mediaType),e.xp6(1),e.s9C("href",t.filedetails.files[0].url,e.LSH),e.xp6(2),e.Oqu(t.filedetails.files[0].name),e.xp6(2),e.hij(".",t.filedetails.files[0].name.split(".").pop(),""),e.xp6(5),e.s9C("value",e.xi3(14,7,t.filedetails.dateCreated,"MM/dd/YYYY")),e.xp6(6),e.MGl("value","",t.filedetails.files[0].mediaSize," KB")}}function X(i,o){if(1&i){const t=e.EpF();e.TgZ(0,"a",43),e.NdJ("click",function(){e.CHM(t);const s=e.oxw(2);return s.downloadImg(s.filedetails.files[0].url,s.filedetails.files[0].name)}),e._UZ(1,"i",44),e._uU(2,"Download File "),e.qZA()}}function ee(i,o){if(1&i&&(e.TgZ(0,"a",45),e._UZ(1,"i",44),e._uU(2,"Download File "),e.qZA()),2&i){const t=e.oxw(2);e.s9C("href",t.filedetails.files[0].url,e.LSH)}}function te(i,o){if(1&i){const t=e.EpF();e.TgZ(0,"a",46),e.NdJ("click",function(){e.CHM(t);const s=e.oxw(2);return s.deleteFile(s.filedetails.fileUploadId)}),e._UZ(1,"i",47),e._uU(2," Delete File "),e.qZA()}}function ie(i,o){if(1&i&&(e.TgZ(0,"div",39),e.YNc(1,X,3,0,"a",40),e.YNc(2,ee,3,1,"a",41),e.YNc(3,te,3,0,"a",42),e.qZA()),2&i){const t=e.oxw();e.xp6(1),e.Q6J("ngIf","image/jpeg"==t.filedetails.files[0].mediaType||"image/png"==t.filedetails.files[0].mediaType||"image/jpg"==t.filedetails.files[0].mediaType),e.xp6(1),e.Q6J("ngIf","video/mp4"==t.filedetails.files[0].mediaType||"video/avi"==t.filedetails.files[0].mediaType||"video/3gp"==t.filedetails.files[0].mediaType||"application/pdf"==t.filedetails.files[0].mediaType||"application/PDF"==t.filedetails.files[0].mediaType||"audio/mpeg"==t.filedetails.files[0].mediaType||"application/msword"==t.filedetails.files[0].mediaType),e.xp6(1),e.Q6J("ngIf",t.filedetails.resourceOwner==t.userDeatils.emailAddress)}}const ae=[{path:"",component:g,children:[{path:"",redirectTo:"casefiles",pathMatch:"full"},{path:":dateCreated/:caseId",component:R},{path:"file-details/:filesId/:caseId",component:(()=>{class i{constructor(t,a,s,c,n,Z,A,F){this.location=t,this.dataService=a,this.utility=s,this.usr=c,this.router=n,this.utilitydev=Z,this.sanitizer=A,this.route=F,this.module="patient",this.filesId=this.route.snapshot.paramMap.get("filesId"),this.getcaseId=this.route.snapshot.paramMap.get("caseId")}back(){this.location.back()}ngOnInit(){this.userDeatils=this.usr.getUserDetails(!1),this.filedetails="",this.getFileDetails(),this.getCaseDetails()}getFileDetails(){l()("Processing...please wait...",{buttons:[!1,!1],closeOnClickOutside:!1});let t=this.utility.apiData.userCaseFiles.ApiUrl,a=this.filesId;""!=a&&(t+="?fileUploadId="+a),this.dataService.getallData(t,!0).subscribe(s=>{s&&(l().close(),this.allfilesdata=JSON.parse(s.toString()),this.setcvFast(this.allfilesdata))},s=>{s.status?l()(s.error):l()("Unable to fetch the data, please try again")})}setcvFast(t){if(t.files.length>0){for(var a=0;a<t.files.length;a++)this.dataService.getallData("https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/objectUrl?name="+t.files[0].name+"&module="+this.module+"&type=get",!0).subscribe(n=>{n&&(this.urlSafe=this.sanitizer.bypassSecurityTrustResourceUrl(n),this.allfilesdata.files[0].url=n)},n=>{n.status?l()(n.error):l()("Unable to fetch the data, please try again")});this.filedetails=this.allfilesdata}}getCaseDetails(){this.tabledata="";let t=this.utility.apiData.userCases.ApiUrl,a=this.getcaseId;""!=a&&(t+="?caseId="+a),this.dataService.getallData(t,!0).subscribe(s=>{s&&(this.tabledata=JSON.parse(s.toString()))},s=>{s.status?l()(s.error):l()("Unable to fetch the data, please try again")})}deleteFile(t){let a=sessionStorage.getItem("dateCreated");this.dataService.deleteFilesData(this.utility.apiData.userCaseFiles.ApiUrl,t).subscribe(c=>{l()("Case Files deleted successfully")},c=>(c.status?l()(c.error):l()("Unable to fetch the data, please try again"),!1)),this.router.navigate(["casefiles/"+a+"/"+this.getcaseId])}downloadImg(t,a){this.getBase64ImageFromURL(t).subscribe(c=>{this.base64Image="data:image/jpg;base64,"+c;var n=document.createElement("a");document.body.appendChild(n),n.setAttribute("href",this.base64Image),n.setAttribute("download",a),n.click()})}getBase64ImageFromURL(t){return z.y.create(a=>{const s=new Image;s.crossOrigin="Anonymous",s.src=t,s.complete?(a.next(this.getBase64Image(s)),a.complete()):(s.onload=()=>{a.next(this.getBase64Image(s)),a.complete()},s.onerror=c=>{a.error(c)})})}getBase64Image(t){const a=document.createElement("canvas");return a.width=t.width,a.height=t.height,a.getContext("2d").drawImage(t,0,0),a.toDataURL("image/png").replace(/^data:image\/(png|jpg);base64,/,"")}}return i.\u0275fac=function(t){return new(t||i)(e.Y36(f.Ye),e.Y36(p.T),e.Y36(m.t),e.Y36(d.f),e.Y36(h.F0),e.Y36(u.F),e.Y36(W.H7),e.Y36(h.gz))},i.\u0275cmp=e.Xpm({type:i,selectors:[["app-file-details"]],decls:30,vars:3,consts:[[1,"breadcrumb"],[1,"breadcrumb-item"],["routerLink","/dashboard"],["aria-hidden","true",1,"bx","bxs-home"],["href","javascript:void(0);",3,"click"],["aria-current","page",1,"breadcrumb-item","active"],[1,"page-header","row","align-items-center","gx-0"],["class","col-md-6",4,"ngIf"],[1,"col-md-6","text-end"],[1,"row","align-items-center","pt-2"],[1,"col-md-12"],[1,"card","shadow-sm"],[1,"card-header","bg-white"],[1,"row"],["aria-label","breadcrumb",1,"my-2"],[1,"breadcrumb","fw-bold","mb-0"],["href","javascript:void(0);",2,"color","#5D6A7E",3,"click"],[1,"breadcrumb-item","active",2,"color","#011A3E"],[1,"card-body"],["class","row",4,"ngIf"],["class","col-md-12 mb-2",4,"ngIf"],[1,"col-md-6"],[1,"d-inline-block"],[1,"mt-2","fw-normal"],[1,"fw-bold","d-block"],[1,"progress","progress-sm","mt-2"],["role","progressbar","aria-valuenow","55","aria-valuemin","0","aria-valuemax","100",1,"progress-bar","bg-primary",2,"width","55%"],[1,"col-md-8"],["width","420px","height","238px",3,"src",4,"ngIf"],["frameBorder","0",3,"src",4,"ngIf"],["target","_tblank",3,"href"],[1,"body2","mt-3"],[1,"badge","badge-pill","badge-warning","body2","w-auto","px-3"],[1,"mb-1","row"],[1,"col-sm-5","col-form-label","body2","text-dark"],[1,"col-sm-7"],["type","text","readonly","",1,"form-control-plaintext","body2","text-muted",3,"value"],["width","420px","height","238px",3,"src"],["frameBorder","0",3,"src"],[1,"col-md-12","mb-2"],["style","cursor: pointer;","class","btn btn-default mt-3 me-2","role","button","style","padding:10px 31px;",3,"click",4,"ngIf"],["style","cursor: pointer;","class","btn btn-default mt-3 me-2","role","button","style","padding:10px 31px;","target","_tblank","download","",3,"href",4,"ngIf"],["style","cursor: pointer;","class","btn btn-pink mt-3","style","padding:10px 31px;",3,"click",4,"ngIf"],["role","button",1,"btn","btn-default","mt-3","me-2",2,"padding","10px 31px",3,"click"],["aria-hidden","true",1,"bx","bx-download","me-2"],["role","button","target","_tblank","download","",1,"btn","btn-default","mt-3","me-2",2,"padding","10px 31px",3,"href"],[1,"btn","btn-pink","mt-3",2,"padding","10px 31px",3,"click"],["aria-hidden","true",1,"bx","bx-trash","me-2"]],template:function(t,a){1&t&&(e.TgZ(0,"ol",0)(1,"li",1)(2,"a",2),e._UZ(3,"i",3),e._uU(4," Dashboard"),e.qZA()(),e.TgZ(5,"li",1)(6,"a",4),e.NdJ("click",function(){return a.back()}),e._uU(7,"Files"),e.qZA()(),e.TgZ(8,"li",5),e._uU(9," Files Details "),e.qZA()(),e.TgZ(10,"div",6),e.YNc(11,K,8,2,"div",7),e._UZ(12,"div",8),e.qZA(),e.TgZ(13,"div",9)(14,"div",10)(15,"div",11)(16,"div",12)(17,"div",13)(18,"div",10)(19,"nav",14)(20,"ol",15)(21,"li",1)(22,"a",16),e.NdJ("click",function(){return a.back()}),e._uU(23,"Files List"),e.qZA()(),e.TgZ(24,"li",17),e._uU(25,"File Details"),e.qZA()()()()()(),e.TgZ(26,"div",18),e.YNc(27,V,20,10,"div",19),e.qZA()()()(),e.TgZ(28,"div",13),e.YNc(29,ie,4,3,"div",20),e.qZA()),2&t&&(e.xp6(11),e.Q6J("ngIf",a.tabledata),e.xp6(16),e.Q6J("ngIf",a.filedetails),e.xp6(2),e.Q6J("ngIf",a.filedetails))},directives:[h.yS,f.O5],pipes:[f.uU],styles:[".progress[_ngcontent-%COMP%]   .bg-primary[_ngcontent-%COMP%]{background-color:#1991eb!important}.progress-sm[_ngcontent-%COMP%]{height:.5rem}"]}),i})()}]}];let le=(()=>{class i{}return i.\u0275fac=function(t){return new(t||i)},i.\u0275mod=e.oAB({type:i}),i.\u0275inj=e.cJS({imports:[[f.ez,h.Bz.forChild(ae),C.T,_.u5,_.UX,b.x]]}),i})()},5415:(D,U,r)=>{r.d(U,{G:()=>h,T:()=>e});var f=r(5e3),h=function(){function g(v,l,p){this.el=v,this.vcr=l,this.renderer=p,this.dtOptions={}}return g.prototype.ngOnInit=function(){var v=this;this.dtTrigger?this.dtTrigger.subscribe(function(l){v.displayTable(l)}):this.displayTable(null)},g.prototype.ngOnDestroy=function(){this.dtTrigger&&this.dtTrigger.unsubscribe(),this.dt&&this.dt.destroy(!0)},g.prototype.displayTable=function(v){var l=this;v&&(this.dtOptions=v),this.dtInstance=new Promise(function(p,m){Promise.resolve(l.dtOptions).then(function(d){0===Object.keys(d).length&&0===$("tbody tr",l.el.nativeElement).length?m("Both the table and dtOptions cannot be empty"):setTimeout(function(){var b={rowCallback:function(_,x,y){if(d.columns){var T=d.columns;l.applyNgPipeTransform(_,T),l.applyNgRefTemplate(_,T,x)}d.rowCallback&&d.rowCallback(_,x,y)}};b=Object.assign({},d,b),l.dt=$(l.el.nativeElement).DataTable(b),p(l.dt)})})})},g.prototype.applyNgPipeTransform=function(v,l){l.filter(function(m){return m.ngPipeInstance&&!m.ngTemplateRef}).forEach(function(m){var d=m.ngPipeInstance,u=l.findIndex(function(y){return y.data===m.data}),b=v.childNodes.item(u),_=$(b).text(),x=d.transform(_);$(b).text(x)})},g.prototype.applyNgRefTemplate=function(v,l,p){var m=this;l.filter(function(u){return u.ngTemplateRef&&!u.ngPipeInstance}).forEach(function(u){var b=u.ngTemplateRef,_=b.ref,x=b.context,y=l.findIndex(function(M){return M.data===u.data}),T=v.childNodes.item(y);$(T).html("");var w=Object.assign({},x,null==x?void 0:x.userData,{adtData:p}),I=m.vcr.createEmbeddedView(_,w);m.renderer.appendChild(T,I.rootNodes[0])})},g.\u0275fac=function(l){return new(l||g)(f.Y36(f.SBq),f.Y36(f.s_b),f.Y36(f.Qsj))},g.\u0275dir=f.lG2({type:g,selectors:[["","datatable",""]],inputs:{dtOptions:"dtOptions",dtTrigger:"dtTrigger"}}),g}(),C=r(9808),e=function(){function g(){}return g.forRoot=function(){return{ngModule:g}},g.\u0275fac=function(l){return new(l||g)},g.\u0275mod=f.oAB({type:g}),g.\u0275inj=f.cJS({imports:[[C.ez]]}),g}()},9506:(D,U,r)=>{r.d(U,{x:()=>v,w:()=>g});var f=r(9808),h=r(5e3);const C=function(l,p,m){return{width:l,height:p,borderRadius:m}},e=function(l){return{rtl:l}};let g=(()=>{class l{constructor(){this.class="shimmer-loading",this.width="80%",this.height="12px",this.shape="rect",this.borderRadius="5px",this.direction="ltr"}ngOnInit(){}get shimmerHeight(){switch(this.shape){case"circle":case"square":return this.width;default:return this.height}}get shimmerBorderRadius(){return"circle"===this.shape?"50%":this.borderRadius}}return l.\u0275fac=function(m){return new(m||l)},l.\u0275cmp=h.Xpm({type:l,selectors:[["ngx-shimmer-loading"]],hostVars:2,hostBindings:function(m,d){2&m&&h.Tol(d.class)},inputs:{width:"width",height:"height",shape:"shape",borderRadius:"borderRadius",direction:"direction"},decls:1,vars:8,consts:[[1,"ngx-shimmer",3,"ngStyle","ngClass"]],template:function(m,d){1&m&&h._UZ(0,"div",0),2&m&&h.Q6J("ngStyle",h.kEZ(2,C,d.width,d.shimmerHeight,d.shimmerBorderRadius))("ngClass",h.VKq(6,e,"rtl"===d.direction))},directives:[f.PC,f.mk],styles:[":host{display:block;line-height:1.75}.ngx-shimmer{display:inline-block;width:100%;height:12px;background-color:#f6f7f8;background-image:linear-gradient(to right,#f6f7f8 0,#edeef1 20%,#f6f7f8 40%,#f6f7f8 100%);background-position:0 0;background-repeat:no-repeat;background-size:1000px 1000px;-webkit-animation:1s linear infinite forwards shimmerEffect;animation:1s linear infinite forwards shimmerEffect}.ngx-shimmer.rtl{-webkit-animation:1s linear infinite forwards shimmerEffectRTL;animation:1s linear infinite forwards shimmerEffectRTL}@-webkit-keyframes shimmerEffect{0%{background-position:-1000px 0}100%{background-position:1000px 0}}@keyframes shimmerEffect{0%{background-position:-1000px 0}100%{background-position:1000px 0}}@-webkit-keyframes shimmerEffectRTL{0%{background-position:1000px 0}100%{background-position:-1000px 0}}@keyframes shimmerEffectRTL{0%{background-position:1000px 0}100%{background-position:-1000px 0}}"],encapsulation:2}),l})(),v=(()=>{class l{}return l.\u0275fac=function(m){return new(m||l)},l.\u0275mod=h.oAB({type:l}),l.\u0275inj=h.cJS({imports:[[f.ez]]}),l})()}}]);