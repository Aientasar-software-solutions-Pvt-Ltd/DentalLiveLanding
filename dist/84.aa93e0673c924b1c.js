"use strict";(self.webpackChunkDentalLive_dev=self.webpackChunkDentalLive_dev||[]).push([[84],{995:(E,Z,d)=>{d.d(Z,{F:()=>a});var u=d(5861),F=d(520),C=d(2340),e=d(7206),g=d(5e3);let a=(()=>{class h{constructor(r){this.http=r}getUserDetails(){try{let r=sessionStorage.getItem("usr");if(!r)return!1;let f=JSON.parse(e.AES.decrypt(r,C.N.decryptKey).toString(e.enc.Utf8));return!(f.exp<Date.now())&&f}catch(r){return sessionStorage.removeItem("usr"),!1}}uploadBinaryData(r,f,m){var b=this;return new Promise(function(_,y){b.getPreSignedUrl(r,m,"put",f.type).then(x=>{b.saveDataS3(f,x.url).then(()=>{_(x.name)}).catch(w=>{console.log(w),y("Failed to Upload")})}).catch(x=>{console.log(x),y("Failed to Upload")})})}getPreSignedUrl(r,f,m="get",b){var _=this;return(0,u.Z)(function*(){let y=new F.WM,x=sessionStorage.getItem("usr");return y=y.set("authorization",x),yield _.http.get(`https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/objectUrl?name=${r}&module=${f}&type=${m}&media=${b}`,{headers:y}).toPromise()})()}saveDataS3(r,f){var m=this;return(0,u.Z)(function*(){if(yield m.http.put(f,r).toPromise())return!0})()}}return h.\u0275fac=function(r){return new(r||h)(g.LFG(F.eN))},h.\u0275prov=g.Yz7({token:h,factory:h.\u0275fac,providedIn:"root"}),h})()},2084:(E,Z,d)=>{d.r(Z),d.d(Z,{FilesModule:()=>z});var u=d(9808),F=d(6090),C=d(5415),e=d(5e3);let p=(()=>{class s{constructor(){}ngOnInit(){}}return s.\u0275fac=function(i){return new(i||s)},s.\u0275cmp=e.Xpm({type:s,selectors:[["app-files"]],decls:1,vars:0,template:function(i,t){1&i&&e._UZ(0,"router-outlet")},directives:[F.lC],encapsulation:2}),s})();var g=d(5226),a=d.n(g),h=d(9114),v=d(2290),r=d(3762),f=d(995),m=d(2382);function b(s,c){1&s&&e._UZ(0,"img",70)}function _(s,c){1&s&&e._UZ(0,"img",71)}function y(s,c){if(1&s){const i=e.EpF();e.TgZ(0,"div",64)(1,"div",65)(2,"a",66),e.NdJ("click",function(){e.CHM(i);const l=e.oxw().$implicit;return e.oxw().viewFilesDetails(l.fileUploadId)}),e.YNc(3,b,1,0,"img",67),e.YNc(4,_,1,0,"ng-template",null,68,e.W1O),e.TgZ(6,"p",69),e._uU(7),e.qZA()()()()}if(2&s){const i=e.MAs(5),t=e.oxw().$implicit;e.xp6(3),e.Q6J("ngIf",t.files[0].url)("ngIfElse",i),e.xp6(4),e.Oqu(t.files[0].name)}}function x(s,c){1&s&&e._UZ(0,"img",73)}function w(s,c){1&s&&e._UZ(0,"img",71)}function I(s,c){if(1&s){const i=e.EpF();e.TgZ(0,"div",64)(1,"div",65)(2,"a",66),e.NdJ("click",function(){e.CHM(i);const l=e.oxw().$implicit;return e.oxw().viewFilesDetails(l.fileUploadId)}),e.YNc(3,x,1,0,"img",72),e.YNc(4,w,1,0,"ng-template",null,68,e.W1O),e.TgZ(6,"p",69),e._uU(7),e.qZA()()()()}if(2&s){const i=e.MAs(5),t=e.oxw().$implicit;e.xp6(3),e.Q6J("ngIf",t.files[0].url)("ngIfElse",i),e.xp6(4),e.Oqu(t.files[0].name)}}function M(s,c){1&s&&e._UZ(0,"img",70)}function N(s,c){1&s&&e._UZ(0,"img",71)}function S(s,c){if(1&s){const i=e.EpF();e.TgZ(0,"div",64)(1,"div",65)(2,"a",66),e.NdJ("click",function(){e.CHM(i);const l=e.oxw().$implicit;return e.oxw().viewFilesDetails(l.fileUploadId)}),e.YNc(3,M,1,0,"img",67),e.YNc(4,N,1,0,"ng-template",null,68,e.W1O),e.TgZ(6,"p",69),e._uU(7),e.qZA()()()()}if(2&s){const i=e.MAs(5),t=e.oxw().$implicit;e.xp6(3),e.Q6J("ngIf",t.files[0].url)("ngIfElse",i),e.xp6(4),e.Oqu(t.files[0].name)}}function O(s,c){1&s&&e._UZ(0,"img",75)}function P(s,c){1&s&&e._UZ(0,"img",71)}function L(s,c){if(1&s){const i=e.EpF();e.TgZ(0,"div",64)(1,"div",65)(2,"a",66),e.NdJ("click",function(){e.CHM(i);const l=e.oxw().$implicit;return e.oxw().viewFilesDetails(l.fileUploadId)}),e.YNc(3,O,1,0,"img",74),e.YNc(4,P,1,0,"ng-template",null,68,e.W1O),e.TgZ(6,"p",69),e._uU(7),e.qZA()()()()}if(2&s){const i=e.MAs(5),t=e.oxw().$implicit;e.xp6(3),e.Q6J("ngIf",t.files[0].url)("ngIfElse",i),e.xp6(4),e.Oqu(t.files[0].name)}}function Y(s,c){if(1&s&&(e.TgZ(0,"div",62),e.YNc(1,y,8,3,"div",63),e.YNc(2,I,8,3,"div",63),e.YNc(3,S,8,3,"div",63),e.YNc(4,L,8,3,"div",63),e.qZA()),2&s){const i=c.$implicit;e.xp6(1),e.Q6J("ngIf","application/pdf"==i.files[0].mediaType||"audio/mpeg"==i.files[0].mediaType),e.xp6(1),e.Q6J("ngIf","video/mp4"==i.files[0].mediaType||"video/avi"==i.files[0].mediaType||"video/3gp"==i.files[0].mediaType),e.xp6(1),e.Q6J("ngIf","application/msword"==i.files[0].mediaType),e.xp6(1),e.Q6J("ngIf","image/jpeg"==i.files[0].mediaType||"image/png"==i.files[0].mediaType||"image/jpg"==i.files[0].mediaType)}}let j=(()=>{class s{constructor(i,t,l,o,n,T){this.dataService=i,this.utility=t,this.usr=l,this.router=o,this.utilitydev=n,this.route=T,this.attachmentUploadFiles=[],this.UploadFiles=[],this.module="patient",this.jsonObj={ownerName:"",caseId:"",patientId:"",patientName:"",dateCreated:0,files:Array()},this.dateCreated=this.route.snapshot.paramMap.get("dateCreated"),this.getcaseId=this.route.snapshot.paramMap.get("caseId")}ngOnInit(){this.getAllFiles(),this.getCaseDetails()}getTimeStamp(i){var t=i.split("/");return new Date(t[2],t[0]-1,t[1]).getTime()}setcvFast(i){if(i.length>0){for(var t=0;t<i.length;t++)this.dataService.getallData("https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/objectUrl?name="+i[t].files[0].name+"&module="+this.module+"&type=get",!0).subscribe(n=>{n&&(this.allfilesdata[t-1].files[0].url=n)},n=>{404===n.status?a().fire("E-Mail ID does not exists,please signup to continue"):403===n.status?a().fire("Account Disabled,contact Dental-Live"):400===n.status?a().fire("Wrong Password,please try again"):401===n.status?a().fire("Account Not Verified,Please activate the account from the Email sent to the Email address."):428===n.status?a().fire(n.error):a().fire("Unable to fetch the data, please try again")});this.allfile=this.allfilesdata}}getAllFiles(){let i=this.utility.apiData.userCaseFiles.ApiUrl,l=Number(this.dateCreated),o=new Date(l).toLocaleDateString("en-US"),n=this.getTimeStamp(o),D=this.getcaseId;""!=D&&(i+="?caseId="+D),n&&(i+="&dateFrom="+n+"&dateTo="+(n+864e5)),this.dataService.getallData(i,!0).subscribe(U=>{U&&(this.allfilesdata=JSON.parse(U.toString()),this.setcvFast(this.allfilesdata))},U=>{404===U.status?a().fire("E-Mail ID does not exists,please signup to continue"):403===U.status?a().fire("Account Disabled,contact Dental-Live"):400===U.status?a().fire("Wrong Password,please try again"):401===U.status?a().fire("Account Not Verified,Please activate the account from the Email sent to the Email address."):428===U.status?a().fire(U.error):a().fire("Unable to fetch the data, please try again")})}viewFilesDetails(i){this.router.navigate(["/files/file-details/"+i+"/"+this.getcaseId])}getCaseDetails(){this.tabledata="";let i=this.utility.apiData.userCases.ApiUrl,t=this.getcaseId;""!=t&&(i+="?caseId="+t),this.dataService.getallData(i,!0).subscribe(l=>{l&&(this.tabledata=JSON.parse(l.toString()))},l=>{404===l.status?a().fire("E-Mail ID does not exists,please signup to continue"):403===l.status?a().fire("Account Disabled,contact Dental-Live"):400===l.status?a().fire("Wrong Password,please try again"):401===l.status?a().fire("Account Not Verified,Please activate the account from the Email sent to the Email address."):428===l.status?a().fire(l.error):a().fire("Unable to fetch the data, please try again")})}onSubmit(i){let t=this.utility.apiData.userCaseFiles.ApiUrl,o=i.value.ownerName.split(" ");""!=o[0]&&(t+="?ownerName="+o[0]),o.length>1&&""!=o[1]&&(t+=""!=o[0]?"&lastName="+o[1]:"?lastName="+o[1]),this.dataService.getallData(t,!0).subscribe(n=>{n&&(this.allfilesdata=JSON.parse(n.toString()))},n=>{404===n.status?a().fire("E-Mail ID does not exists,please signup to continue"):403===n.status?a().fire("Account Disabled,contact Dental-Live"):400===n.status?a().fire("Wrong Password,please try again"):401===n.status?a().fire("Account Not Verified,Please activate the account from the Email sent to the Email address."):428===n.status?a().fire(n.error):a().fire("Unable to fetch the data, please try again")})}getUniqueName(i){let t=0;return t>0&&(i=i.split(".")[0]+"_"+t+"."+i.split(".")[1]),t++,i}loadFiles(i){if(i.target.files.length>0){if(!["image","video","audio","pdf","msword","ms-excel","docx","doc","xls","xlsx","txt"].some(l=>i.target.files[0].type.includes(l)))return void a().fire("File Extenion Not Allowed");this.attachmentUploadFiles=Array(),this.attachmentUploadFiles.push({name:this.getUniqueName(i.target.files[0].name),binaryData:i.target.files[0],size:i.target.files[0].size,type:i.target.files[0].type})}}onGetdateData(i){this.jsonObj.ownerName=i.resorceowner,this.jsonObj.caseId=i.caseid,this.jsonObj.patientId=i.patientid,this.jsonObj.patientName=i.patientname,i.uploadfile&&(this.jsonObj.files=this.UploadFiles),this.dataService.postData(this.utility.apiData.userCaseFiles.ApiUrl,JSON.stringify(this.jsonObj),!0).subscribe(t=>{t&&(t=JSON.parse(t.toString())),a().fire("Files added successfully"),window.location.reload()},t=>{404===t.status?a().fire("E-Mail ID does not exists,please signup to continue"):403===t.status?a().fire("Account Disabled,contact Dental-Live"):400===t.status?a().fire("Wrong Password,please try again"):401===t.status?a().fire("Account Not Verified,Please activate the account from the Email sent to the Email address."):428===t.status?a().fire(t.error):a().fire("Unable to fetch the data, please try again")})}onSubmitFiles(i){if(i.invalid)i.form.markAllAsTouched();else if(i.value.uploadfile){a().fire({html:'<div class="sweet_loader"><img style="width:50px;" src="https://www.boasnotas.com/img/loading2.gif"/></div>',icon:"https://www.boasnotas.com/img/loading2.gif",showConfirmButton:!1,allowOutsideClick:!1,closeOnClickOutside:!1,timer:2200});let l=this.attachmentUploadFiles[0].type,o=Math.round(this.attachmentUploadFiles[0].size/1024),n=this.attachmentUploadFiles.map(T=>this.utilitydev.uploadBinaryData(T.name,T.binaryData,this.module));Promise.all(n).then(T=>{this.attachmentUploadFiles=[];let D=T[0];this.dataService.getallData("https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/objectUrl?name="+D+"&module="+this.module+"&type=get",!0).subscribe(A=>{A&&(this.UploadFiles=Array(),this.UploadFiles.push({url:A,name:D,mediaType:l,mediaSize:o.toString()}),this.onGetdateData(i.value))},A=>{404===A.status?a().fire("E-Mail ID does not exists,please signup to continue"):403===A.status?a().fire("Account Disabled,contact Dental-Live"):400===A.status?a().fire("Wrong Password,please try again"):401===A.status?a().fire("Account Not Verified,Please activate the account from the Email sent to the Email address."):428===A.status?a().fire(A.error):a().fire("Unable to fetch the data, please try again")})}).catch(T=>(console.log(T),!1))}else this.onGetdateData(i.value)}}return s.\u0275fac=function(i){return new(i||s)(e.Y36(h.T),e.Y36(v.t),e.Y36(r.f),e.Y36(F.F0),e.Y36(f.F),e.Y36(F.gz))},s.\u0275cmp=e.Xpm({type:s,selectors:[["app-all-files"]],decls:87,vars:9,consts:[[1,"breadcrumb"],[1,"breadcrumb-item"],["routerLink","/dashboard"],["aria-hidden","true",1,"bx","bxs-home"],["aria-current","page",1,"breadcrumb-item","active"],[1,"page-header","row","align-items-center","gx-0"],[1,"col-md-6"],[1,"d-inline-block"],[1,"mt-2","fw-normal"],[1,"fw-bold","d-block"],[1,"progress","progress-sm","mt-2"],["role","progressbar","aria-valuenow","55","aria-valuemin","0","aria-valuemax","100",1,"progress-bar","bg-primary",2,"width","55%"],[1,"col-md-6","text-end"],["id","priceList",1,"row","pt-2"],[1,"col-md-12"],[1,"card","pb-4","shadow-sm"],[1,"card-header","border-bottom-0","bg-white"],[1,"row"],[1,"col-md-5","align-self-center"],[1,"body1","card-title","my-2"],[1,"col-md-7"],[1,"d-flex","align-items-center","flex-wrap","justify-content-end"],["data-bs-toggle","modal","data-bs-target","#filterModal",1,"btn","filter-btn","me-2","my-2"],[1,"bx","bx-filter-alt"],[1,"d-none","d-sm-inline-block","ms-2"],["data-bs-toggle","modal","data-bs-target","#uploadFileModal",1,"btn","btn-default"],[1,"bx","bx-upload"],[1,"table","table-hover","table-nowrap","align-middle"],[1,"thead-light"],[2,"text-transform","uppercase"],[1,"body2"],[1,"container"],["class","col-md-2",4,"ngFor","ngForOf"],["id","filterModal","tabindex","-1","aria-labelledby","exampleModalLabel","aria-hidden","true",1,"modal","fade"],[1,"modal-dialog"],[1,"modal-content"],[1,"modal-header"],["id","exampleModalLabel",1,"modal-title"],["type","button","data-bs-dismiss","modal","aria-label","Close",1,"btn-close"],["id","mainForm",3,"ngSubmit"],["f","ngForm"],[1,"modal-body"],[1,"search","my-2"],[1,"bx","bx-search"],["type","text","ngModel","","name","ownerName","id","ownerName","placeholder","Search by Owner Name",1,"form-control"],[1,"modal-footer"],["type","button","data-bs-dismiss","modal",1,"btn","btn-secondary"],["type","submit","data-bs-dismiss","modal",1,"btn","btn-default"],["id","uploadFileModal","tabindex","-1","aria-labelledby","uploadModalLabel","aria-hidden","true",1,"modal","fade"],[1,"modal-dialog","modal-dialog-centered"],["id","uploadModalLabel",1,"modal-title","body1"],["id","filesForm",3,"ngSubmit"],["filesForm","ngForm"],[1,"row","gy-3"],[1,"form-label","body2","text-dark"],["type","file","ngModel","","name","uploadfile","id","uploadfile","required","","accept",".doc,.docx,application/msword,.txt,.xls,.xlsx,image/*,video/*,.pdf,.ppt,.pptx",1,"form-control",2,"line-height","2.2","background-color","#EFF3F7","border","2px dashed #AEB4BF",3,"change"],["type","hidden","name","resorceowner","id","resorceowner",3,"ngModel"],["type","hidden","name","caseid","id","caseid",3,"ngModel"],["type","hidden","name","patientid","id","patientid",3,"ngModel"],["type","hidden","name","patientname","id","patientname",3,"ngModel"],["type","hidden","name","datecreated","id","datecreated",3,"ngModel"],["type","submit","data-bs-dismiss","modal","data-bs-dismiss","modal",1,"btn","btn-default",3,"disabled"],[1,"col-md-2"],["class","card mb-3","style","max-width: 18rem;border: 1px solid #D0D6DE;",4,"ngIf"],[1,"card","mb-3",2,"max-width","18rem","border","1px solid #D0D6DE"],[1,"card-body","text-center"],["href","javascript:void(0);",1,"text-dark",3,"click"],["src","assets/images/file.png","height","58px",4,"ngIf","ngIfElse"],["noimage",""],[1,"card-text"],["src","assets/images/file.png","height","58px"],["src","assets/images/no-image.png","height","58px"],["src","assets/images/video.png","height","58px",4,"ngIf","ngIfElse"],["src","assets/images/video.png","height","58px"],["src","assets/images/image-icon.png","height","58px",4,"ngIf","ngIfElse"],["src","assets/images/image-icon.png","height","58px"]],template:function(i,t){if(1&i){const l=e.EpF();e.TgZ(0,"ol",0)(1,"li",1)(2,"a",2),e._UZ(3,"i",3),e._uU(4," Dashboard"),e.qZA()(),e.TgZ(5,"li",4),e._uU(6," Files "),e.qZA()(),e.TgZ(7,"div",5)(8,"div",6)(9,"div",7)(10,"h3",8),e._uU(11),e.TgZ(12,"span",9),e._uU(13),e.qZA(),e.TgZ(14,"div",10),e._UZ(15,"div",11),e.qZA()()()(),e._UZ(16,"div",12),e.qZA(),e.TgZ(17,"div",13)(18,"div",14)(19,"div",15)(20,"div",16)(21,"div",17)(22,"div",18)(23,"h5",19),e._uU(24,"Files"),e.qZA()(),e.TgZ(25,"div",20)(26,"div",21)(27,"button",22),e._UZ(28,"i",23),e.TgZ(29,"span",24),e._uU(30,"Filter"),e.qZA()(),e.TgZ(31,"button",25),e._UZ(32,"i",26),e._uU(33," Upload Files "),e.qZA()()()()(),e.TgZ(34,"table",27)(35,"thead",28)(36,"tr",29)(37,"th",30),e._uU(38,"Files"),e.qZA()()()(),e.TgZ(39,"div",31)(40,"div",17),e.YNc(41,Y,5,4,"div",32),e.qZA()()()()(),e.TgZ(42,"div",33)(43,"div",34)(44,"div",35)(45,"div",36)(46,"h5",37),e._uU(47,"Filter"),e.qZA(),e._UZ(48,"button",38),e.qZA(),e.TgZ(49,"form",39,40),e.NdJ("ngSubmit",function(){e.CHM(l);const n=e.MAs(50);return t.onSubmit(n)}),e.TgZ(51,"div",41)(52,"div",17)(53,"div",14)(54,"div",42),e._UZ(55,"i",43)(56,"input",44),e.qZA()()()(),e.TgZ(57,"div",45)(58,"button",46),e._uU(59,"Close"),e.qZA(),e.TgZ(60,"button",47),e._uU(61,"Apply"),e.qZA()()()()()(),e.TgZ(62,"div",48)(63,"div",49)(64,"div",35)(65,"div",36)(66,"h5",50),e._uU(67,"Upload Files"),e.qZA(),e._UZ(68,"button",38),e.qZA(),e.TgZ(69,"form",51,52),e.NdJ("ngSubmit",function(){e.CHM(l);const n=e.MAs(70);return t.onSubmitFiles(n)}),e.TgZ(71,"div",41)(72,"div",53)(73,"div",14)(74,"label",54),e._uU(75,"Upload File"),e.qZA(),e.TgZ(76,"input",55),e.NdJ("change",function(n){return t.loadFiles(n)}),e.qZA()()()(),e.TgZ(77,"div",45),e._UZ(78,"input",56)(79,"input",57)(80,"input",58)(81,"input",59)(82,"input",60),e.TgZ(83,"button",61),e._uU(84,"Save"),e.qZA(),e.TgZ(85,"button",46),e._uU(86,"Cancel"),e.qZA()()()()()()}if(2&i){const l=e.MAs(70);e.xp6(11),e.hij("",t.tabledata.patientName," "),e.xp6(2),e.Oqu(t.tabledata.title),e.xp6(28),e.Q6J("ngForOf",t.allfile),e.xp6(37),e.s9C("ngModel",t.tabledata.fetchedData[0].data[0].resorceOwner),e.xp6(1),e.s9C("ngModel",t.tabledata.caseId),e.xp6(1),e.s9C("ngModel",t.tabledata.patientId),e.xp6(1),e.s9C("ngModel",t.tabledata.patientName),e.xp6(1),e.s9C("ngModel",t.tabledata.dateCreated),e.xp6(1),e.Q6J("disabled",!l.form.valid)}},directives:[F.yS,u.sg,u.O5,m._Y,m.JL,m.F,m.Fj,m.JJ,m.On,m.Q7],styles:[".progress[_ngcontent-%COMP%]   .bg-primary[_ngcontent-%COMP%]{background-color:#1991eb!important}.progress-sm[_ngcontent-%COMP%]{height:.5rem}"]}),s})();var J=d(8306),q=d(2313);function k(s,c){if(1&s&&e._UZ(0,"img",39),2&s){const i=e.oxw();e.s9C("src",i.filedetails.files[0].url,e.LSH)}}function B(s,c){if(1&s&&e._UZ(0,"iframe",40),2&s){const i=e.oxw();e.Q6J("src",i.urlSafe,e.uOi)}}const W=[{path:"",component:p,children:[{path:"",redirectTo:"files",pathMatch:"full"},{path:"files/:dateCreated/:caseId",component:j},{path:"file-details/:filesId/:caseId",component:(()=>{class s{constructor(i,t,l,o,n,T,D){this.dataService=i,this.utility=t,this.usr=l,this.router=o,this.utilitydev=n,this.sanitizer=T,this.route=D,this.module="patient",this.filesId=this.route.snapshot.paramMap.get("filesId"),this.getcaseId=this.route.snapshot.paramMap.get("caseId")}ngOnInit(){this.filedetails="",this.getFileDetails(),this.getCaseDetails()}getFileDetails(){let i=this.utility.apiData.userCaseFiles.ApiUrl,t=this.filesId;""!=t&&(i+="?fileUploadId="+t),this.dataService.getallData(i,!0).subscribe(l=>{l&&(this.allfilesdata=JSON.parse(l.toString()),this.setcvFast(this.allfilesdata))},l=>{404===l.status?a().fire("E-Mail ID does not exists,please signup to continue"):403===l.status?a().fire("Account Disabled,contact Dental-Live"):400===l.status?a().fire("Wrong Password,please try again"):401===l.status?a().fire("Account Not Verified,Please activate the account from the Email sent to the Email address."):428===l.status?a().fire(l.error):a().fire("Unable to fetch the data, please try again")})}setcvFast(i){if(i.files.length>0){for(var t=0;t<i.files.length;t++)this.dataService.getallData("https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/objectUrl?name="+i.files[0].name+"&module="+this.module+"&type=get",!0).subscribe(n=>{n&&(this.urlSafe=this.sanitizer.bypassSecurityTrustResourceUrl(n),this.allfilesdata.files[0].url=n)},n=>{404===n.status?a().fire("E-Mail ID does not exists,please signup to continue"):403===n.status?a().fire("Account Disabled,contact Dental-Live"):400===n.status?a().fire("Wrong Password,please try again"):401===n.status?a().fire("Account Not Verified,Please activate the account from the Email sent to the Email address."):428===n.status?a().fire(n.error):a().fire("Unable to fetch the data, please try again")});this.filedetails=this.allfilesdata}}getCaseDetails(){this.tabledata="";let i=this.utility.apiData.userCases.ApiUrl,t=this.getcaseId;""!=t&&(i+="?caseId="+t),this.dataService.getallData(i,!0).subscribe(l=>{l&&(this.tabledata=JSON.parse(l.toString()))},l=>{404===l.status?a().fire("E-Mail ID does not exists,please signup to continue"):403===l.status?a().fire("Account Disabled,contact Dental-Live"):400===l.status?a().fire("Wrong Password,please try again"):401===l.status?a().fire("Account Not Verified,Please activate the account from the Email sent to the Email address."):428===l.status?a().fire(l.error):a().fire("Unable to fetch the data, please try again")})}deleteFile(i){this.dataService.deleteFilesData(this.utility.apiData.userCaseFiles.ApiUrl,i).subscribe(l=>{a().fire("Case Files deleted successfully")},l=>(a().fire("Unable to fetch data, please try again"),!1)),this.router.navigate(["files/files"])}downloadImg(i,t){this.getBase64ImageFromURL(i).subscribe(o=>{this.base64Image="data:image/jpg;base64,"+o;var n=document.createElement("a");document.body.appendChild(n),n.setAttribute("href",this.base64Image),n.setAttribute("download",t),n.click()})}getBase64ImageFromURL(i){return J.y.create(t=>{const l=new Image;l.crossOrigin="Anonymous",l.src=i,l.complete?(t.next(this.getBase64Image(l)),t.complete()):(l.onload=()=>{t.next(this.getBase64Image(l)),t.complete()},l.onerror=o=>{t.error(o)})})}getBase64Image(i){const t=document.createElement("canvas");return t.width=i.width,t.height=i.height,t.getContext("2d").drawImage(i,0,0),t.toDataURL("image/png").replace(/^data:image\/(png|jpg);base64,/,"")}}return s.\u0275fac=function(i){return new(i||s)(e.Y36(h.T),e.Y36(v.t),e.Y36(r.f),e.Y36(F.F0),e.Y36(f.F),e.Y36(q.H7),e.Y36(F.gz))},s.\u0275cmp=e.Xpm({type:s,selectors:[["app-file-details"]],decls:62,vars:12,consts:[[1,"breadcrumb"],[1,"breadcrumb-item"],["routerLink","/dashboard"],["aria-hidden","true",1,"bx","bxs-home"],["routerLink","/files"],["aria-current","page",1,"breadcrumb-item","active"],[1,"page-header","row","align-items-center","gx-0"],[1,"col-md-6"],[1,"d-inline-block"],[1,"mt-2","fw-normal"],[1,"fw-bold","d-block"],[1,"progress","progress-sm","mt-2"],["role","progressbar","aria-valuenow","55","aria-valuemin","0","aria-valuemax","100",1,"progress-bar","bg-primary",2,"width","55%"],[1,"col-md-6","text-end"],[1,"row","align-items-center","pt-2"],[1,"col-md-12"],[1,"card","shadow-sm"],[1,"card-header","bg-white"],[1,"row"],["aria-label","breadcrumb",1,"my-2"],[1,"breadcrumb","fw-bold","mb-0"],["routerLink","/files",2,"color","#5D6A7E"],[1,"breadcrumb-item","active",2,"color","#011A3E"],[1,"card-body"],[1,"col-md-8"],["width","420px","height","238px",3,"src",4,"ngIf"],["frameBorder","0",3,"src",4,"ngIf"],["target","_tblank",3,"href"],[1,"body2","mt-3"],[1,"badge","badge-pill","badge-warning","body2","w-auto","px-3"],[1,"mb-1","row"],[1,"col-sm-5","col-form-label","body2","text-dark"],[1,"col-sm-7"],["type","text","readonly","",1,"form-control-plaintext","body2","text-muted",3,"value"],[1,"col-md-12","mb-2"],["href","javascript:void(0);","role","button",1,"btn","btn-default","mt-3","me-2",2,"padding","10px 31px",3,"click"],["aria-hidden","true",1,"bx","bx-download","me-2"],["href","javascript:void(0);",1,"btn","btn-pink","mt-3",2,"padding","10px 31px",3,"click"],["aria-hidden","true",1,"bx","bx-trash","me-2"],["width","420px","height","238px",3,"src"],["frameBorder","0",3,"src"]],template:function(i,t){1&i&&(e.TgZ(0,"ol",0)(1,"li",1)(2,"a",2),e._UZ(3,"i",3),e._uU(4," Dashboard"),e.qZA()(),e.TgZ(5,"li",1)(6,"a",4),e._uU(7,"Files"),e.qZA()(),e.TgZ(8,"li",5),e._uU(9," Files Details "),e.qZA()(),e.TgZ(10,"div",6)(11,"div",7)(12,"div",8)(13,"h3",9),e._uU(14),e.TgZ(15,"span",10),e._uU(16),e.qZA(),e.TgZ(17,"div",11),e._UZ(18,"div",12),e.qZA()()()(),e._UZ(19,"div",13),e.qZA(),e.TgZ(20,"div",14)(21,"div",15)(22,"div",16)(23,"div",17)(24,"div",18)(25,"div",15)(26,"nav",19)(27,"ol",20)(28,"li",1)(29,"a",21),e._uU(30,"Files List"),e.qZA()(),e.TgZ(31,"li",22),e._uU(32,"File Details"),e.qZA()()()()()(),e.TgZ(33,"div",23)(34,"div",18)(35,"div",24),e.YNc(36,k,1,1,"img",25),e.YNc(37,B,1,1,"iframe",26),e.TgZ(38,"a",27)(39,"p",28),e._uU(40),e.qZA()(),e.TgZ(41,"span",29),e._uU(42),e.qZA(),e.TgZ(43,"div",30)(44,"label",31),e._uU(45,"Created Date"),e.qZA(),e.TgZ(46,"div",32),e._UZ(47,"input",33),e.ALo(48,"date"),e.qZA()(),e.TgZ(49,"div",30)(50,"label",31),e._uU(51,"File Size"),e.qZA(),e.TgZ(52,"div",32),e._UZ(53,"input",33),e.qZA()()()()()()()(),e.TgZ(54,"div",18)(55,"div",34)(56,"a",35),e.NdJ("click",function(){return t.downloadImg(t.filedetails.files[0].url,t.filedetails.files[0].name)}),e._UZ(57,"i",36),e._uU(58,"Download File "),e.qZA(),e.TgZ(59,"a",37),e.NdJ("click",function(){return t.deleteFile(t.filedetails.fileUploadId)}),e._UZ(60,"i",38),e._uU(61," Delete File "),e.qZA()()()),2&i&&(e.xp6(14),e.hij("",t.tabledata.patientName," "),e.xp6(2),e.Oqu(t.tabledata.title),e.xp6(20),e.Q6J("ngIf","image/jpeg"==t.filedetails.files[0].mediaType||"image/png"==t.filedetails.files[0].mediaType||"image/jpg"==t.filedetails.files[0].mediaType),e.xp6(1),e.Q6J("ngIf","video/mp4"==t.filedetails.files[0].mediaType||"video/avi"==t.filedetails.files[0].mediaType||"video/3gp"==t.filedetails.files[0].mediaType||"application/pdf"==t.filedetails.files[0].mediaType||"application/PDF"==t.filedetails.files[0].mediaType||"audio/mpeg"==t.filedetails.files[0].mediaType),e.xp6(1),e.s9C("href",t.filedetails.files[0].url,e.LSH),e.xp6(2),e.Oqu(t.filedetails.files[0].name),e.xp6(2),e.hij(".",t.filedetails.files[0].name.split(".").pop(),""),e.xp6(5),e.s9C("value",e.xi3(48,9,t.filedetails.dateCreated,"MM/dd/YYYY")),e.xp6(6),e.MGl("value","",t.filedetails.files[0].mediaSize," KB"))},directives:[F.yS,u.O5],pipes:[u.uU],styles:[".progress[_ngcontent-%COMP%]   .bg-primary[_ngcontent-%COMP%]{background-color:#1991eb!important}.progress-sm[_ngcontent-%COMP%]{height:.5rem}"]}),s})()}]}];let z=(()=>{class s{}return s.\u0275fac=function(i){return new(i||s)},s.\u0275mod=e.oAB({type:s}),s.\u0275inj=e.cJS({imports:[[u.ez,F.Bz.forChild(W),C.T,m.u5,m.UX]]}),s})()},5415:(E,Z,d)=>{d.d(Z,{G:()=>F,T:()=>e});var u=d(5e3),F=function(){function p(g,a,h){this.el=g,this.vcr=a,this.renderer=h,this.dtOptions={}}return p.prototype.ngOnInit=function(){var g=this;this.dtTrigger?this.dtTrigger.subscribe(function(a){g.displayTable(a)}):this.displayTable(null)},p.prototype.ngOnDestroy=function(){this.dtTrigger&&this.dtTrigger.unsubscribe(),this.dt&&this.dt.destroy(!0)},p.prototype.displayTable=function(g){var a=this;g&&(this.dtOptions=g),this.dtInstance=new Promise(function(h,v){Promise.resolve(a.dtOptions).then(function(r){0===Object.keys(r).length&&0===$("tbody tr",a.el.nativeElement).length?v("Both the table and dtOptions cannot be empty"):setTimeout(function(){var m={rowCallback:function(b,_,y){if(r.columns){var x=r.columns;a.applyNgPipeTransform(b,x),a.applyNgRefTemplate(b,x,_)}r.rowCallback&&r.rowCallback(b,_,y)}};m=Object.assign({},r,m),a.dt=$(a.el.nativeElement).DataTable(m),h(a.dt)})})})},p.prototype.applyNgPipeTransform=function(g,a){a.filter(function(v){return v.ngPipeInstance&&!v.ngTemplateRef}).forEach(function(v){var r=v.ngPipeInstance,f=a.findIndex(function(y){return y.data===v.data}),m=g.childNodes.item(f),b=$(m).text(),_=r.transform(b);$(m).text(_)})},p.prototype.applyNgRefTemplate=function(g,a,h){var v=this;a.filter(function(f){return f.ngTemplateRef&&!f.ngPipeInstance}).forEach(function(f){var m=f.ngTemplateRef,b=m.ref,_=m.context,y=a.findIndex(function(M){return M.data===f.data}),x=g.childNodes.item(y);$(x).html("");var w=Object.assign({},_,null==_?void 0:_.userData,{adtData:h}),I=v.vcr.createEmbeddedView(b,w);v.renderer.appendChild(x,I.rootNodes[0])})},p.\u0275fac=function(a){return new(a||p)(u.Y36(u.SBq),u.Y36(u.s_b),u.Y36(u.Qsj))},p.\u0275dir=u.lG2({type:p,selectors:[["","datatable",""]],inputs:{dtOptions:"dtOptions",dtTrigger:"dtTrigger"}}),p}(),C=d(9808),e=function(){function p(){}return p.forRoot=function(){return{ngModule:p}},p.\u0275fac=function(a){return new(a||p)},p.\u0275mod=u.oAB({type:p}),p.\u0275inj=u.cJS({imports:[[C.ez]]}),p}()}}]);