"use strict";(self.webpackChunkDentalLive_dev=self.webpackChunkDentalLive_dev||[]).push([[84],{995:(I,U,d)=>{d.d(U,{F:()=>a});var f=d(5861),g=d(520),A=d(2340),e=d(7206),_=d(5e3);let a=(()=>{class p{constructor(o){this.http=o}getUserDetails(){try{let o=sessionStorage.getItem("usr");if(!o)return!1;let h=JSON.parse(e.AES.decrypt(o,A.N.decryptKey).toString(e.enc.Utf8));return!(h.exp<Date.now())&&h}catch(o){return sessionStorage.removeItem("usr"),!1}}uploadBinaryData(o,h,y){var v=this;return new Promise(function(x,T){v.getPreSignedUrl(o,y,"put",h.type).then(D=>{v.saveDataS3(h,D.url).then(()=>{x(D.name)}).catch(Z=>{console.log(Z),T("Failed to Upload")})}).catch(D=>{console.log(D),T("Failed to Upload")})})}getPreSignedUrl(o,h,y="get",v){var x=this;return(0,f.Z)(function*(){let T=new g.WM,D=sessionStorage.getItem("usr");return T=T.set("authorization",D),yield x.http.get(`https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/objectUrl?name=${o}&module=${h}&type=${y}&media=${v}`,{headers:T}).toPromise()})()}saveDataS3(o,h){var y=this;return(0,f.Z)(function*(){if(yield y.http.put(h,o).toPromise())return!0})()}}return p.\u0275fac=function(o){return new(o||p)(_.LFG(g.eN))},p.\u0275prov=_.Yz7({token:p,factory:p.\u0275fac,providedIn:"root"}),p})()},2084:(I,U,d)=>{d.r(U),d.d(U,{FilesModule:()=>V});var f=d(9808),g=d(1879),A=d(5415),e=d(5e3);let u=(()=>{class l{constructor(){}ngOnInit(){}}return l.\u0275fac=function(i){return new(i||l)},l.\u0275cmp=e.Xpm({type:l,selectors:[["app-files"]],decls:1,vars:0,template:function(i,t){1&i&&e._UZ(0,"router-outlet")},directives:[g.lC],encapsulation:2}),l})();var _=d(1373),a=d.n(_),p=d(9114),m=d(2290),o=d(3762),h=d(995),y=d(9506),v=d(2382);function x(l,r){1&l&&e._UZ(0,"ngx-shimmer-loading",65),2&l&&e.Q6J("width","100%")("height","50px")("margin","20px")}function T(l,r){if(1&l&&(e.ynx(0,62),e._UZ(1,"div",63),e.YNc(2,x,1,3,"ngx-shimmer-loading",64),e.BQk()),2&l){const i=e.oxw();e.xp6(2),e.Q6J("ngForOf",i.shimmer(10).fill(1))}}function D(l,r){1&l&&e._UZ(0,"img",76)}function Z(l,r){1&l&&e._UZ(0,"img",77)}function C(l,r){if(1&l&&(e.TgZ(0,"div",70)(1,"div",71)(2,"a",72),e.YNc(3,D,1,0,"img",73),e.YNc(4,Z,1,0,"ng-template",null,74,e.W1O),e.TgZ(6,"p",75),e._uU(7),e.qZA()()()()),2&l){const i=e.MAs(5),t=e.oxw().$implicit,s=e.oxw(2);e.xp6(2),e.hYB("href","casefiles/file-details/",t.fileUploadId,"/",s.getcaseId,"",e.LSH),e.xp6(1),e.Q6J("ngIf",t.files[0].url)("ngIfElse",i),e.xp6(4),e.Oqu(t.files[0].name)}}function M(l,r){1&l&&e._UZ(0,"img",79)}function E(l,r){1&l&&e._UZ(0,"img",77)}function S(l,r){if(1&l&&(e.TgZ(0,"div",70)(1,"div",71)(2,"a",72),e.YNc(3,M,1,0,"img",78),e.YNc(4,E,1,0,"ng-template",null,74,e.W1O),e.TgZ(6,"p",75),e._uU(7),e.qZA()()()()),2&l){const i=e.MAs(5),t=e.oxw().$implicit,s=e.oxw(2);e.xp6(2),e.hYB("href","casefiles/file-details/",t.fileUploadId,"/",s.getcaseId,"",e.LSH),e.xp6(1),e.Q6J("ngIf",t.files[0].url)("ngIfElse",i),e.xp6(4),e.Oqu(t.files[0].name)}}function N(l,r){1&l&&e._UZ(0,"img",76)}function O(l,r){1&l&&e._UZ(0,"img",77)}function L(l,r){if(1&l&&(e.TgZ(0,"div",70)(1,"div",71)(2,"a",72),e.YNc(3,N,1,0,"img",73),e.YNc(4,O,1,0,"ng-template",null,74,e.W1O),e.TgZ(6,"p",75),e._uU(7),e.qZA()()()()),2&l){const i=e.MAs(5),t=e.oxw().$implicit,s=e.oxw(2);e.xp6(2),e.hYB("href","casefiles/file-details/",t.fileUploadId,"/",s.getcaseId,"",e.LSH),e.xp6(1),e.Q6J("ngIf",t.files[0].url)("ngIfElse",i),e.xp6(4),e.Oqu(t.files[0].name)}}function P(l,r){1&l&&e._UZ(0,"img",81)}function Y(l,r){1&l&&e._UZ(0,"img",77)}function k(l,r){if(1&l&&(e.TgZ(0,"div",70)(1,"div",71)(2,"a",72),e.YNc(3,P,1,0,"img",80),e.YNc(4,Y,1,0,"ng-template",null,74,e.W1O),e.TgZ(6,"p",75),e._uU(7),e.qZA()()()()),2&l){const i=e.MAs(5),t=e.oxw().$implicit,s=e.oxw(2);e.xp6(2),e.hYB("href","casefiles/file-details/",t.fileUploadId,"/",s.getcaseId,"",e.LSH),e.xp6(1),e.Q6J("ngIf",t.files[0].url)("ngIfElse",i),e.xp6(4),e.Oqu(t.files[0].name)}}function J(l,r){if(1&l&&(e.TgZ(0,"div",68),e.YNc(1,C,8,5,"div",69),e.YNc(2,S,8,5,"div",69),e.YNc(3,L,8,5,"div",69),e.YNc(4,k,8,5,"div",69),e.qZA()),2&l){const i=r.$implicit;e.xp6(1),e.Q6J("ngIf","application/pdf"==i.files[0].mediaType||"audio/mpeg"==i.files[0].mediaType),e.xp6(1),e.Q6J("ngIf","video/mp4"==i.files[0].mediaType||"video/avi"==i.files[0].mediaType||"video/3gp"==i.files[0].mediaType),e.xp6(1),e.Q6J("ngIf","application/msword"==i.files[0].mediaType),e.xp6(1),e.Q6J("ngIf","image/jpeg"==i.files[0].mediaType||"image/png"==i.files[0].mediaType||"image/jpg"==i.files[0].mediaType)}}function B(l,r){if(1&l&&(e.TgZ(0,"div",66)(1,"div",17),e.YNc(2,J,5,4,"div",67),e.qZA()()),2&l){const i=e.oxw();e.xp6(2),e.Q6J("ngForOf",i.allfile)}}let j=(()=>{class l{constructor(i,t,s,c,n,F){this.dataService=i,this.utility=t,this.usr=s,this.router=c,this.utilitydev=n,this.route=F,this.isLoadingData=!0,this.attachmentUploadFiles=[],this.UploadFiles=[],this.module="patient",this.jsonObj={ownerName:"",caseId:"",patientId:"",patientName:"",dateCreated:0,files:Array()},this.shimmer=Array,this.dateCreated=this.route.snapshot.paramMap.get("dateCreated"),this.getcaseId=this.route.snapshot.paramMap.get("caseId")}ngOnInit(){this.getAllFiles(),this.getCaseDetails()}getTimeStamp(i){var t=i.split("/");return new Date(t[2],t[0]-1,t[1]).getTime()}setcvFast(i){if(i.length>0){for(var t=0;t<i.length;t++)this.dataService.getallData("https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/objectUrl?name="+i[t].files[0].name+"&module="+this.module+"&type=get",!0).subscribe(n=>{n&&(this.allfilesdata[t-1].files[0].url=n)},n=>{404===n.status?a()("E-Mail ID does not exists,please signup to continue"):403===n.status?a()("Account Disabled,contact Dental-Live"):400===n.status?a()("Wrong Password,please try again"):401===n.status?a()("Account Not Verified,Please activate the account from the Email sent to the Email address."):428===n.status?a()(n.error):a()("Unable to fetch the data, please try again")});this.allfile=this.allfilesdata}}getAllFiles(){let i=this.utility.apiData.userCaseFiles.ApiUrl,s=Number(this.dateCreated),c=new Date(s).toLocaleDateString("en-US"),n=this.getTimeStamp(c),w=this.getcaseId;""!=w&&(i+="?caseId="+w),n&&(i+="&dateFrom="+n+"&dateTo="+(n+864e5)),this.dataService.getallData(i,!0).subscribe(b=>{b&&(this.allfilesdata=JSON.parse(b.toString()),this.setcvFast(this.allfilesdata),this.isLoadingData=!1)},b=>{404===b.status?a()("E-Mail ID does not exists,please signup to continue"):403===b.status?a()("Account Disabled,contact Dental-Live"):400===b.status?a()("Wrong Password,please try again"):401===b.status?a()("Account Not Verified,Please activate the account from the Email sent to the Email address."):428===b.status?a()(b.error):a()("Unable to fetch the data, please try again")})}getCaseDetails(){this.tabledata="";let i=this.utility.apiData.userCases.ApiUrl,t=this.getcaseId;""!=t&&(i+="?caseId="+t),this.dataService.getallData(i,!0).subscribe(s=>{s&&(this.tabledata=JSON.parse(s.toString()))},s=>{404===s.status?a()("E-Mail ID does not exists,please signup to continue"):403===s.status?a()("Account Disabled,contact Dental-Live"):400===s.status?a()("Wrong Password,please try again"):401===s.status?a()("Account Not Verified,Please activate the account from the Email sent to the Email address."):428===s.status?a()(s.error):a()("Unable to fetch the data, please try again")})}onSubmit(i){let t=this.utility.apiData.userCaseFiles.ApiUrl,c=i.value.ownerName.split(" ");""!=c[0]&&(t+="?ownerName="+c[0]),c.length>1&&""!=c[1]&&(t+=""!=c[0]?"&lastName="+c[1]:"?lastName="+c[1]),this.dataService.getallData(t,!0).subscribe(n=>{n&&(this.allfilesdata=JSON.parse(n.toString()),this.isLoadingData=!1)},n=>{404===n.status?a()("E-Mail ID does not exists,please signup to continue"):403===n.status?a()("Account Disabled,contact Dental-Live"):400===n.status?a()("Wrong Password,please try again"):401===n.status?a()("Account Not Verified,Please activate the account from the Email sent to the Email address."):428===n.status?a()(n.error):a()("Unable to fetch the data, please try again")})}getUniqueName(i){let t=0;return t>0&&(i=i.split(".")[0]+"_"+t+"."+i.split(".")[1]),t++,i}loadFiles(i){if(i.target.files.length>0){if(!["image","video","audio","pdf","msword","ms-excel","docx","doc","xls","xlsx","txt"].some(s=>i.target.files[0].type.includes(s)))return void a()("File Extenion Not Allowed");this.attachmentUploadFiles=Array(),this.attachmentUploadFiles.push({name:this.getUniqueName(i.target.files[0].name),binaryData:i.target.files[0],size:i.target.files[0].size,type:i.target.files[0].type})}}onGetdateData(i){this.jsonObj.ownerName=i.resorceowner,this.jsonObj.caseId=i.caseid,this.jsonObj.patientId=i.patientid,this.jsonObj.patientName=i.patientname,i.uploadfile&&(this.jsonObj.files=this.UploadFiles),this.dataService.postData(this.utility.apiData.userCaseFiles.ApiUrl,JSON.stringify(this.jsonObj),!0).subscribe(t=>{t&&(t=JSON.parse(t.toString())),this.isLoadingData=!1,a()("Files added successfully"),window.location.reload()},t=>{404===t.status?a()("E-Mail ID does not exists,please signup to continue"):403===t.status?a()("Account Disabled,contact Dental-Live"):400===t.status?a()("Wrong Password,please try again"):401===t.status?a()("Account Not Verified,Please activate the account from the Email sent to the Email address."):428===t.status?a()(t.error):a()("Unable to fetch the data, please try again")})}onSubmitFiles(i){if(i.invalid)i.form.markAllAsTouched();else if(i.value.uploadfile){a()("Processing...please wait...",{buttons:[!1,!1],closeOnClickOutside:!1});let t=this.attachmentUploadFiles[0].type,s=Math.round(this.attachmentUploadFiles[0].size/1024),c=this.attachmentUploadFiles.map(n=>this.utilitydev.uploadBinaryData(n.name,n.binaryData,this.module));Promise.all(c).then(n=>{this.attachmentUploadFiles=[];let F=n[0];this.dataService.getallData("https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/objectUrl?name="+F+"&module="+this.module+"&type=get",!0).subscribe(b=>{b&&(this.UploadFiles=Array(),this.UploadFiles.push({url:b,name:F,mediaType:t,mediaSize:s.toString()}),this.onGetdateData(i.value))},b=>{404===b.status?a()("E-Mail ID does not exists,please signup to continue"):403===b.status?a()("Account Disabled,contact Dental-Live"):400===b.status?a()("Wrong Password,please try again"):401===b.status?a()("Account Not Verified,Please activate the account from the Email sent to the Email address."):428===b.status?a()(b.error):a()("Unable to fetch the data, please try again")})}).catch(n=>(console.log(n),!1))}else this.onGetdateData(i.value)}}return l.\u0275fac=function(i){return new(i||l)(e.Y36(p.T),e.Y36(m.t),e.Y36(o.f),e.Y36(g.F0),e.Y36(h.F),e.Y36(g.gz))},l.\u0275cmp=e.Xpm({type:l,selectors:[["app-all-files"]],decls:86,vars:10,consts:[[1,"breadcrumb"],[1,"breadcrumb-item"],["routerLink","/dashboard"],["aria-hidden","true",1,"bx","bxs-home"],["aria-current","page",1,"breadcrumb-item","active"],[1,"page-header","row","align-items-center","gx-0"],[1,"col-md-6"],[1,"d-inline-block"],[1,"mt-2","fw-normal"],[1,"fw-bold","d-block"],[1,"progress","progress-sm","mt-2"],["role","progressbar","aria-valuenow","55","aria-valuemin","0","aria-valuemax","100",1,"progress-bar","bg-primary",2,"width","55%"],[1,"col-md-6","text-end"],["id","priceList",1,"row","pt-2"],[1,"col-md-12"],[1,"card","pb-4","shadow-sm"],[1,"card-header","border-bottom-0","bg-white"],[1,"row"],[1,"col-md-5","align-self-center"],[1,"body1","card-title","my-2"],[1,"col-md-7"],[1,"d-flex","align-items-center","flex-wrap","justify-content-end"],["data-bs-toggle","modal","data-bs-target","#filterModal",1,"btn","filter-btn","me-2","my-2"],[1,"bx","bx-filter-alt"],[1,"d-none","d-sm-inline-block","ms-2"],["data-bs-toggle","modal","data-bs-target","#uploadFileModal",1,"btn","btn-default"],[1,"bx","bx-upload"],[1,"table","table-hover","table-nowrap","align-middle"],[1,"thead-light"],[2,"text-transform","uppercase"],[1,"body2"],["class","mt-3",4,"ngIf"],["class","container",4,"ngIf"],["id","filterModal","tabindex","-1","aria-labelledby","exampleModalLabel","aria-hidden","true",1,"modal","fade"],[1,"modal-dialog"],[1,"modal-content"],[1,"modal-header"],["id","exampleModalLabel",1,"modal-title"],["type","button","data-bs-dismiss","modal","aria-label","Close",1,"btn-close"],["id","mainForm",3,"ngSubmit"],["f","ngForm"],[1,"modal-body"],[1,"search","my-2"],[1,"bx","bx-search"],["type","text","ngModel","","name","ownerName","id","ownerName","placeholder","Search by Owner Name",1,"form-control"],[1,"modal-footer"],["type","button","data-bs-dismiss","modal",1,"btn","btn-secondary"],["type","submit","data-bs-dismiss","modal",1,"btn","btn-default"],["id","uploadFileModal","tabindex","-1","aria-labelledby","uploadModalLabel","aria-hidden","true",1,"modal","fade"],[1,"modal-dialog","modal-dialog-centered"],["id","uploadModalLabel",1,"modal-title","body1"],["id","filesForm",3,"ngSubmit"],["filesForm","ngForm"],[1,"row","gy-3"],[1,"form-label","body2","text-dark"],["type","file","ngModel","","name","uploadfile","id","uploadfile","required","","accept",".doc,.docx,application/msword,.txt,.xls,.xlsx,image/*,video/*,.pdf,.ppt,.pptx",1,"form-control",2,"line-height","2.2","background-color","#EFF3F7","border","2px dashed #AEB4BF",3,"change"],["type","hidden","name","resorceowner","id","resorceowner",3,"ngModel"],["type","hidden","name","caseid","id","caseid",3,"ngModel"],["type","hidden","name","patientid","id","patientid",3,"ngModel"],["type","hidden","name","patientname","id","patientname",3,"ngModel"],["type","hidden","name","datecreated","id","datecreated",3,"ngModel"],["type","submit","data-bs-dismiss","modal","data-bs-dismiss","modal",1,"btn","btn-default",3,"disabled"],[1,"mt-3"],[1,"mt-5","w-100"],["style","margin-top: 1.5em;display: block;transition: all 1s;","class","vh-100",3,"width","height","margin",4,"ngFor","ngForOf"],[1,"vh-100",2,"margin-top","1.5em","display","block","transition","all 1s",3,"width","height","margin"],[1,"container"],["class","col-md-2",4,"ngFor","ngForOf"],[1,"col-md-2"],["class","card mb-3","style","max-width: 18rem;border: 1px solid #D0D6DE;",4,"ngIf"],[1,"card","mb-3",2,"max-width","18rem","border","1px solid #D0D6DE"],[1,"card-body","text-center"],[1,"text-dark",3,"href"],["src","assets/images/file.png","height","58px",4,"ngIf","ngIfElse"],["noimage",""],[1,"card-text"],["src","assets/images/file.png","height","58px"],["src","assets/images/no-image.png","height","58px"],["src","assets/images/video.png","height","58px",4,"ngIf","ngIfElse"],["src","assets/images/video.png","height","58px"],["src","assets/images/image-icon.png","height","58px",4,"ngIf","ngIfElse"],["src","assets/images/image-icon.png","height","58px"]],template:function(i,t){if(1&i){const s=e.EpF();e.TgZ(0,"ol",0)(1,"li",1)(2,"a",2),e._UZ(3,"i",3),e._uU(4," Dashboard"),e.qZA()(),e.TgZ(5,"li",4),e._uU(6," Files "),e.qZA()(),e.TgZ(7,"div",5)(8,"div",6)(9,"div",7)(10,"h3",8),e._uU(11),e.TgZ(12,"span",9),e._uU(13),e.qZA(),e.TgZ(14,"div",10),e._UZ(15,"div",11),e.qZA()()()(),e._UZ(16,"div",12),e.qZA(),e.TgZ(17,"div",13)(18,"div",14)(19,"div",15)(20,"div",16)(21,"div",17)(22,"div",18)(23,"h5",19),e._uU(24,"Files"),e.qZA()(),e.TgZ(25,"div",20)(26,"div",21)(27,"button",22),e._UZ(28,"i",23),e.TgZ(29,"span",24),e._uU(30,"Filter"),e.qZA()(),e.TgZ(31,"button",25),e._UZ(32,"i",26),e._uU(33," Upload Files "),e.qZA()()()()(),e.TgZ(34,"table",27)(35,"thead",28)(36,"tr",29)(37,"th",30),e._uU(38,"Files"),e.qZA()()()(),e.YNc(39,T,3,1,"ng-container",31),e.YNc(40,B,3,1,"div",32),e.qZA()()(),e.TgZ(41,"div",33)(42,"div",34)(43,"div",35)(44,"div",36)(45,"h5",37),e._uU(46,"Filter"),e.qZA(),e._UZ(47,"button",38),e.qZA(),e.TgZ(48,"form",39,40),e.NdJ("ngSubmit",function(){e.CHM(s);const n=e.MAs(49);return t.onSubmit(n)}),e.TgZ(50,"div",41)(51,"div",17)(52,"div",14)(53,"div",42),e._UZ(54,"i",43)(55,"input",44),e.qZA()()()(),e.TgZ(56,"div",45)(57,"button",46),e._uU(58,"Close"),e.qZA(),e.TgZ(59,"button",47),e._uU(60,"Apply"),e.qZA()()()()()(),e.TgZ(61,"div",48)(62,"div",49)(63,"div",35)(64,"div",36)(65,"h5",50),e._uU(66,"Upload Files"),e.qZA(),e._UZ(67,"button",38),e.qZA(),e.TgZ(68,"form",51,52),e.NdJ("ngSubmit",function(){e.CHM(s);const n=e.MAs(69);return t.onSubmitFiles(n)}),e.TgZ(70,"div",41)(71,"div",53)(72,"div",14)(73,"label",54),e._uU(74,"Upload File"),e.qZA(),e.TgZ(75,"input",55),e.NdJ("change",function(n){return t.loadFiles(n)}),e.qZA()()()(),e.TgZ(76,"div",45),e._UZ(77,"input",56)(78,"input",57)(79,"input",58)(80,"input",59)(81,"input",60),e.TgZ(82,"button",61),e._uU(83,"Save"),e.qZA(),e.TgZ(84,"button",46),e._uU(85,"Cancel"),e.qZA()()()()()()}if(2&i){const s=e.MAs(69);e.xp6(11),e.hij("",t.tabledata.patientName," "),e.xp6(2),e.Oqu(t.tabledata.title),e.xp6(26),e.Q6J("ngIf",t.isLoadingData),e.xp6(1),e.Q6J("ngIf",!t.isLoadingData),e.xp6(37),e.s9C("ngModel",t.tabledata.fetchedData[0].data[0].resorceOwner),e.xp6(1),e.s9C("ngModel",t.tabledata.caseId),e.xp6(1),e.s9C("ngModel",t.tabledata.patientId),e.xp6(1),e.s9C("ngModel",t.tabledata.patientName),e.xp6(1),e.s9C("ngModel",t.tabledata.dateCreated),e.xp6(1),e.Q6J("disabled",!s.form.valid)}},directives:[g.yS,f.O5,f.sg,y.w,v._Y,v.JL,v.F,v.Fj,v.JJ,v.On,v.Q7],styles:[".progress[_ngcontent-%COMP%]   .bg-primary[_ngcontent-%COMP%]{background-color:#1991eb!important}.progress-sm[_ngcontent-%COMP%]{height:.5rem}"]}),l})();var q=d(8306),W=d(2313);function R(l,r){if(1&l&&e._UZ(0,"img",39),2&l){const i=e.oxw();e.s9C("src",i.filedetails.files[0].url,e.LSH)}}function z(l,r){if(1&l&&e._UZ(0,"iframe",40),2&l){const i=e.oxw();e.Q6J("src",i.urlSafe,e.uOi)}}const Q=[{path:"",component:u,children:[{path:"",redirectTo:"casefiles",pathMatch:"full"},{path:":dateCreated/:caseId",component:j},{path:"file-details/:filesId/:caseId",component:(()=>{class l{constructor(i,t,s,c,n,F,w){this.dataService=i,this.utility=t,this.usr=s,this.router=c,this.utilitydev=n,this.sanitizer=F,this.route=w,this.module="patient",this.filesId=this.route.snapshot.paramMap.get("filesId"),this.getcaseId=this.route.snapshot.paramMap.get("caseId")}ngOnInit(){this.filedetails="",this.getFileDetails(),this.getCaseDetails()}getFileDetails(){a()("Processing...please wait...",{buttons:[!1,!1],closeOnClickOutside:!1});let i=this.utility.apiData.userCaseFiles.ApiUrl,t=this.filesId;""!=t&&(i+="?fileUploadId="+t),this.dataService.getallData(i,!0).subscribe(s=>{s&&(a().close(),this.allfilesdata=JSON.parse(s.toString()),this.setcvFast(this.allfilesdata))},s=>{404===s.status?a().fire("E-Mail ID does not exists,please signup to continue"):403===s.status?a().fire("Account Disabled,contact Dental-Live"):400===s.status?a().fire("Wrong Password,please try again"):401===s.status?a().fire("Account Not Verified,Please activate the account from the Email sent to the Email address."):428===s.status?a().fire(s.error):a().fire("Unable to fetch the data, please try again")})}setcvFast(i){if(i.files.length>0){for(var t=0;t<i.files.length;t++)this.dataService.getallData("https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/objectUrl?name="+i.files[0].name+"&module="+this.module+"&type=get",!0).subscribe(n=>{n&&(this.urlSafe=this.sanitizer.bypassSecurityTrustResourceUrl(n),this.allfilesdata.files[0].url=n)},n=>{404===n.status?a().fire("E-Mail ID does not exists,please signup to continue"):403===n.status?a().fire("Account Disabled,contact Dental-Live"):400===n.status?a().fire("Wrong Password,please try again"):401===n.status?a().fire("Account Not Verified,Please activate the account from the Email sent to the Email address."):428===n.status?a().fire(n.error):a().fire("Unable to fetch the data, please try again")});this.filedetails=this.allfilesdata}}getCaseDetails(){this.tabledata="";let i=this.utility.apiData.userCases.ApiUrl,t=this.getcaseId;""!=t&&(i+="?caseId="+t),this.dataService.getallData(i,!0).subscribe(s=>{s&&(this.tabledata=JSON.parse(s.toString()))},s=>{404===s.status?a().fire("E-Mail ID does not exists,please signup to continue"):403===s.status?a().fire("Account Disabled,contact Dental-Live"):400===s.status?a().fire("Wrong Password,please try again"):401===s.status?a().fire("Account Not Verified,Please activate the account from the Email sent to the Email address."):428===s.status?a().fire(s.error):a().fire("Unable to fetch the data, please try again")})}deleteFile(i){this.dataService.deleteFilesData(this.utility.apiData.userCaseFiles.ApiUrl,i).subscribe(s=>{a().fire("Case Files deleted successfully")},s=>(a().fire("Unable to fetch data, please try again"),!1)),this.router.navigate(["files/files"])}downloadImg(i,t){this.getBase64ImageFromURL(i).subscribe(c=>{this.base64Image="data:image/jpg;base64,"+c;var n=document.createElement("a");document.body.appendChild(n),n.setAttribute("href",this.base64Image),n.setAttribute("download",t),n.click()})}getBase64ImageFromURL(i){return q.y.create(t=>{const s=new Image;s.crossOrigin="Anonymous",s.src=i,s.complete?(t.next(this.getBase64Image(s)),t.complete()):(s.onload=()=>{t.next(this.getBase64Image(s)),t.complete()},s.onerror=c=>{t.error(c)})})}getBase64Image(i){const t=document.createElement("canvas");return t.width=i.width,t.height=i.height,t.getContext("2d").drawImage(i,0,0),t.toDataURL("image/png").replace(/^data:image\/(png|jpg);base64,/,"")}}return l.\u0275fac=function(i){return new(i||l)(e.Y36(p.T),e.Y36(m.t),e.Y36(o.f),e.Y36(g.F0),e.Y36(h.F),e.Y36(W.H7),e.Y36(g.gz))},l.\u0275cmp=e.Xpm({type:l,selectors:[["app-file-details"]],decls:62,vars:12,consts:[[1,"breadcrumb"],[1,"breadcrumb-item"],["routerLink","/dashboard"],["aria-hidden","true",1,"bx","bxs-home"],["routerLink","/files"],["aria-current","page",1,"breadcrumb-item","active"],[1,"page-header","row","align-items-center","gx-0"],[1,"col-md-6"],[1,"d-inline-block"],[1,"mt-2","fw-normal"],[1,"fw-bold","d-block"],[1,"progress","progress-sm","mt-2"],["role","progressbar","aria-valuenow","55","aria-valuemin","0","aria-valuemax","100",1,"progress-bar","bg-primary",2,"width","55%"],[1,"col-md-6","text-end"],[1,"row","align-items-center","pt-2"],[1,"col-md-12"],[1,"card","shadow-sm"],[1,"card-header","bg-white"],[1,"row"],["aria-label","breadcrumb",1,"my-2"],[1,"breadcrumb","fw-bold","mb-0"],["routerLink","/files",2,"color","#5D6A7E"],[1,"breadcrumb-item","active",2,"color","#011A3E"],[1,"card-body"],[1,"col-md-8"],["width","420px","height","238px",3,"src",4,"ngIf"],["frameBorder","0",3,"src",4,"ngIf"],["target","_tblank",3,"href"],[1,"body2","mt-3"],[1,"badge","badge-pill","badge-warning","body2","w-auto","px-3"],[1,"mb-1","row"],[1,"col-sm-5","col-form-label","body2","text-dark"],[1,"col-sm-7"],["type","text","readonly","",1,"form-control-plaintext","body2","text-muted",3,"value"],[1,"col-md-12","mb-2"],["href","javascript:void(0);","role","button",1,"btn","btn-default","mt-3","me-2",2,"padding","10px 31px",3,"click"],["aria-hidden","true",1,"bx","bx-download","me-2"],["href","javascript:void(0);",1,"btn","btn-pink","mt-3",2,"padding","10px 31px",3,"click"],["aria-hidden","true",1,"bx","bx-trash","me-2"],["width","420px","height","238px",3,"src"],["frameBorder","0",3,"src"]],template:function(i,t){1&i&&(e.TgZ(0,"ol",0)(1,"li",1)(2,"a",2),e._UZ(3,"i",3),e._uU(4," Dashboard"),e.qZA()(),e.TgZ(5,"li",1)(6,"a",4),e._uU(7,"Files"),e.qZA()(),e.TgZ(8,"li",5),e._uU(9," Files Details "),e.qZA()(),e.TgZ(10,"div",6)(11,"div",7)(12,"div",8)(13,"h3",9),e._uU(14),e.TgZ(15,"span",10),e._uU(16),e.qZA(),e.TgZ(17,"div",11),e._UZ(18,"div",12),e.qZA()()()(),e._UZ(19,"div",13),e.qZA(),e.TgZ(20,"div",14)(21,"div",15)(22,"div",16)(23,"div",17)(24,"div",18)(25,"div",15)(26,"nav",19)(27,"ol",20)(28,"li",1)(29,"a",21),e._uU(30,"Files List"),e.qZA()(),e.TgZ(31,"li",22),e._uU(32,"File Details"),e.qZA()()()()()(),e.TgZ(33,"div",23)(34,"div",18)(35,"div",24),e.YNc(36,R,1,1,"img",25),e.YNc(37,z,1,1,"iframe",26),e.TgZ(38,"a",27)(39,"p",28),e._uU(40),e.qZA()(),e.TgZ(41,"span",29),e._uU(42),e.qZA(),e.TgZ(43,"div",30)(44,"label",31),e._uU(45,"Created Date"),e.qZA(),e.TgZ(46,"div",32),e._UZ(47,"input",33),e.ALo(48,"date"),e.qZA()(),e.TgZ(49,"div",30)(50,"label",31),e._uU(51,"File Size"),e.qZA(),e.TgZ(52,"div",32),e._UZ(53,"input",33),e.qZA()()()()()()()(),e.TgZ(54,"div",18)(55,"div",34)(56,"a",35),e.NdJ("click",function(){return t.downloadImg(t.filedetails.files[0].url,t.filedetails.files[0].name)}),e._UZ(57,"i",36),e._uU(58,"Download File "),e.qZA(),e.TgZ(59,"a",37),e.NdJ("click",function(){return t.deleteFile(t.filedetails.fileUploadId)}),e._UZ(60,"i",38),e._uU(61," Delete File "),e.qZA()()()),2&i&&(e.xp6(14),e.hij("",t.tabledata.patientName," "),e.xp6(2),e.Oqu(t.tabledata.title),e.xp6(20),e.Q6J("ngIf","image/jpeg"==t.filedetails.files[0].mediaType||"image/png"==t.filedetails.files[0].mediaType||"image/jpg"==t.filedetails.files[0].mediaType),e.xp6(1),e.Q6J("ngIf","video/mp4"==t.filedetails.files[0].mediaType||"video/avi"==t.filedetails.files[0].mediaType||"video/3gp"==t.filedetails.files[0].mediaType||"application/pdf"==t.filedetails.files[0].mediaType||"application/PDF"==t.filedetails.files[0].mediaType||"audio/mpeg"==t.filedetails.files[0].mediaType),e.xp6(1),e.s9C("href",t.filedetails.files[0].url,e.LSH),e.xp6(2),e.Oqu(t.filedetails.files[0].name),e.xp6(2),e.hij(".",t.filedetails.files[0].name.split(".").pop(),""),e.xp6(5),e.s9C("value",e.xi3(48,9,t.filedetails.dateCreated,"MM/dd/YYYY")),e.xp6(6),e.MGl("value","",t.filedetails.files[0].mediaSize," KB"))},directives:[g.yS,f.O5],pipes:[f.uU],styles:[".progress[_ngcontent-%COMP%]   .bg-primary[_ngcontent-%COMP%]{background-color:#1991eb!important}.progress-sm[_ngcontent-%COMP%]{height:.5rem}"]}),l})()}]}];let V=(()=>{class l{}return l.\u0275fac=function(i){return new(i||l)},l.\u0275mod=e.oAB({type:l}),l.\u0275inj=e.cJS({imports:[[f.ez,g.Bz.forChild(Q),A.T,v.u5,v.UX,y.x]]}),l})()},5415:(I,U,d)=>{d.d(U,{G:()=>g,T:()=>e});var f=d(5e3),g=function(){function u(_,a,p){this.el=_,this.vcr=a,this.renderer=p,this.dtOptions={}}return u.prototype.ngOnInit=function(){var _=this;this.dtTrigger?this.dtTrigger.subscribe(function(a){_.displayTable(a)}):this.displayTable(null)},u.prototype.ngOnDestroy=function(){this.dtTrigger&&this.dtTrigger.unsubscribe(),this.dt&&this.dt.destroy(!0)},u.prototype.displayTable=function(_){var a=this;_&&(this.dtOptions=_),this.dtInstance=new Promise(function(p,m){Promise.resolve(a.dtOptions).then(function(o){0===Object.keys(o).length&&0===$("tbody tr",a.el.nativeElement).length?m("Both the table and dtOptions cannot be empty"):setTimeout(function(){var y={rowCallback:function(v,x,T){if(o.columns){var D=o.columns;a.applyNgPipeTransform(v,D),a.applyNgRefTemplate(v,D,x)}o.rowCallback&&o.rowCallback(v,x,T)}};y=Object.assign({},o,y),a.dt=$(a.el.nativeElement).DataTable(y),p(a.dt)})})})},u.prototype.applyNgPipeTransform=function(_,a){a.filter(function(m){return m.ngPipeInstance&&!m.ngTemplateRef}).forEach(function(m){var o=m.ngPipeInstance,h=a.findIndex(function(T){return T.data===m.data}),y=_.childNodes.item(h),v=$(y).text(),x=o.transform(v);$(y).text(x)})},u.prototype.applyNgRefTemplate=function(_,a,p){var m=this;a.filter(function(h){return h.ngTemplateRef&&!h.ngPipeInstance}).forEach(function(h){var y=h.ngTemplateRef,v=y.ref,x=y.context,T=a.findIndex(function(M){return M.data===h.data}),D=_.childNodes.item(T);$(D).html("");var Z=Object.assign({},x,null==x?void 0:x.userData,{adtData:p}),C=m.vcr.createEmbeddedView(v,Z);m.renderer.appendChild(D,C.rootNodes[0])})},u.\u0275fac=function(a){return new(a||u)(f.Y36(f.SBq),f.Y36(f.s_b),f.Y36(f.Qsj))},u.\u0275dir=f.lG2({type:u,selectors:[["","datatable",""]],inputs:{dtOptions:"dtOptions",dtTrigger:"dtTrigger"}}),u}(),A=d(9808),e=function(){function u(){}return u.forRoot=function(){return{ngModule:u}},u.\u0275fac=function(a){return new(a||u)},u.\u0275mod=f.oAB({type:u}),u.\u0275inj=f.cJS({imports:[[A.ez]]}),u}()},9506:(I,U,d)=>{d.d(U,{x:()=>_,w:()=>u});var f=d(9808),g=d(5e3);const A=function(a,p,m){return{width:a,height:p,borderRadius:m}},e=function(a){return{rtl:a}};let u=(()=>{class a{constructor(){this.class="shimmer-loading",this.width="80%",this.height="12px",this.shape="rect",this.borderRadius="5px",this.direction="ltr"}ngOnInit(){}get shimmerHeight(){switch(this.shape){case"circle":case"square":return this.width;default:return this.height}}get shimmerBorderRadius(){return"circle"===this.shape?"50%":this.borderRadius}}return a.\u0275fac=function(m){return new(m||a)},a.\u0275cmp=g.Xpm({type:a,selectors:[["ngx-shimmer-loading"]],hostVars:2,hostBindings:function(m,o){2&m&&g.Tol(o.class)},inputs:{width:"width",height:"height",shape:"shape",borderRadius:"borderRadius",direction:"direction"},decls:1,vars:8,consts:[[1,"ngx-shimmer",3,"ngStyle","ngClass"]],template:function(m,o){1&m&&g._UZ(0,"div",0),2&m&&g.Q6J("ngStyle",g.kEZ(2,A,o.width,o.shimmerHeight,o.shimmerBorderRadius))("ngClass",g.VKq(6,e,"rtl"===o.direction))},directives:[f.PC,f.mk],styles:[":host{display:block;line-height:1.75}.ngx-shimmer{display:inline-block;width:100%;height:12px;background-color:#f6f7f8;background-image:linear-gradient(to right,#f6f7f8 0,#edeef1 20%,#f6f7f8 40%,#f6f7f8 100%);background-position:0 0;background-repeat:no-repeat;background-size:1000px 1000px;-webkit-animation:1s linear infinite forwards shimmerEffect;animation:1s linear infinite forwards shimmerEffect}.ngx-shimmer.rtl{-webkit-animation:1s linear infinite forwards shimmerEffectRTL;animation:1s linear infinite forwards shimmerEffectRTL}@-webkit-keyframes shimmerEffect{0%{background-position:-1000px 0}100%{background-position:1000px 0}}@keyframes shimmerEffect{0%{background-position:-1000px 0}100%{background-position:1000px 0}}@-webkit-keyframes shimmerEffectRTL{0%{background-position:1000px 0}100%{background-position:-1000px 0}}@keyframes shimmerEffectRTL{0%{background-position:1000px 0}100%{background-position:-1000px 0}}"],encapsulation:2}),a})(),_=(()=>{class a{}return a.\u0275fac=function(m){return new(m||a)},a.\u0275mod=g.oAB({type:a}),a.\u0275inj=g.cJS({imports:[[f.ez]]}),a})()}}]);