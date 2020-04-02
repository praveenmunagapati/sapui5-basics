/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/documentation/sdk/controller/SampleBaseController","sap/ui/model/json/JSONModel","sap/ui/core/Component","sap/ui/core/ComponentContainer","sap/ui/documentation/sdk/controller/util/ControlsInfo","sap/ui/documentation/sdk/util/ToggleFullScreenHandler","sap/m/Text","sap/ui/core/HTML","sap/m/library","sap/base/Log"],function(q,S,J,C,a,b,T,c,H,m,L){"use strict";var U=m.URLHelper;return S.extend("sap.ui.documentation.sdk.controller.Sample",{onInit:function(){this.getRouter().getRoute("sample").attachPatternMatched(this._onSampleMatched,this);this.oModel=new J({showNavButton:true,showNewTab:false});this._sId=null;this._sEntityId=null;this._codeCache={};Promise.all([sap.ui.getCore().loadLibrary("sap.ui.fl",{async:true}),sap.ui.getCore().loadLibrary("sap.ui.rta",{async:true})]).then(this._loadRTA.bind(this));this.getView().setModel(this.oModel);},_onSampleMatched:function(e){this._sId=e.getParameter("arguments").sampleId;this._sEntityId=e.getParameter("arguments").entityId;this.byId("page").setBusy(true);this.getModel("appView").setProperty("/bHasMaster",false);b.loadData().then(this._loadSample.bind(this));},_loadSample:function(d){var p=this.byId("page"),M=this.oModel.getData(),s=d.samples[this._sId],o,e;if(!s){setTimeout(function(){p.setBusy(false);},0);this.getRouter().myNavToWithoutHash("sap.ui.documentation.sdk.view.NotFound","XML",false);return;}this.entityId=this._sEntityId?this._sEntityId:s.entityId;M.sEntityId=this.entityId;if(s.previousSampleId||s.nextSampleId){M.previousSampleId=s.previousSampleId;M.nextSampleId=s.nextSampleId;}if(s.contexts){o=s.contexts[this.entityId];if(o){M.previousSampleId=o.previousSampleId;M.nextSampleId=o.nextSampleId;}else{this.getRouter().myNavToWithoutHash("sap.ui.documentation.sdk.view.NotFound","XML",false);return;}}M.title="Sample: "+s.name;try{e=this._createComponent();}catch(f){p.removeAllContent();p.addContent(new c({text:"Error while loading the sample: "+f}));setTimeout(function(){p.setBusy(false);},0);return;}this.getOwnerComponent()._oCurrentOpenedSample=e?e:undefined;var g=(this._oComp.getMetadata())?this._oComp.getMetadata().getConfig():null;var h=g&&g.sample||{};M.showNewTab=!!h.iframe;M.id=s.id;M.name=s.name;if(h){M.stretch=h.stretch;M.includeInDownload=h.additionalDownloadFiles;if(h.files){var r=sap.ui.require.toUrl((s.id).replace(/\./g,"/"));M.files=[];for(var i=0;i<h.files.length;i++){var F=h.files[i];var j=this.fetchSourceFile(r,F);M.files.push({name:F,raw:j});}}if(h.iframe){e=this._createIframe(e,h.iframe);M.iframe=h.iframe;}else{this.sIFrameUrl=null;}}var k=!!h.stretch;var l=k?"100%":null;p.setEnableScrolling(!k);if(e.setHeight){e.setHeight(l);}p.removeAllContent();p.addContent(e);p.scrollTo(0);this.getAPIReferenceCheckPromise(s.entityId).then(function(n){this.getView().byId("apiRefButton").setVisible(n);}.bind(this));this.oModel.setData(M);setTimeout(function(){p.setBusy(false);},0);},onAPIRefPress:function(){this.getRouter().navTo("apiId",{id:this.entityId});},onNewTab:function(){U.redirect(this.sIFrameUrl,true);},onPreviousSample:function(e){this.getRouter().navTo("sample",{entityId:this.entityId,sampleId:this.oModel.getProperty("/previousSampleId")});},onNextSample:function(e){this.getRouter().navTo("sample",{entityId:this.entityId,sampleId:this.oModel.getProperty("/nextSampleId")});},_resolveIframePath:function(s,I){var d=I.split("/"),i;for(i=0;i<d.length-1;i++){if(d[i]==".."){s=s.substring(0,s.lastIndexOf("."));}else{s+="."+d[i];}}return s;},_createIframe:function(i,I){var s=this._sId,d="",r=/\/([^\/]*)$/,e=/\..+$/,f,F,g;if(typeof I==="string"){d=this._resolveIframePath(s,I);f=r.exec(I);F=(f&&f.length>1?f[1]:I);g=e.exec(F)[0];var h=F.replace(e,"");this.sIFrameUrl=sap.ui.require.toUrl((d+"/"+h).replace(/\./g,"/"))+g||".html";}else{L.error("no iframe source was provided");return;}if(!this._oHtmlControl){this._oHtmlControl=new H({id:"sampleFrame",content:'<iframe src="'+this.sIFrameUrl+'" id="sampleFrame" frameBorder="0"></iframe>'}).addEventDelegate({onAfterRendering:function(){if(!this._oHtmlControl._jQueryHTMLControlLoadEventAttached){this._oHtmlControl.$().on("load",function(){var o=this._oHtmlControl.$()[0].contentWindow,j=o.sap.ui.getCore();o.sap.ui.getCore().attachInit(function(){var k=q(document.body).hasClass("sapUiSizeCompact");j.applyTheme(this._oCore.getConfiguration().getTheme());j.getConfiguration().setRTL(this._oCore.getConfiguration().getRTL());o.jQuery('body').toggleClass("sapUiSizeCompact",k).toggleClass("sapUiSizeCozy",!k);j.notifyContentDensityChanged();}.bind(this));}.bind(this));this._oHtmlControl._jQueryHTMLControlLoadEventAttached=true;}}.bind(this)});}else{this._oHtmlControl.getDomRef().src=this.sIFrameUrl;}return this._oHtmlControl;},_createComponent:function(){var s='sampleComp-'+this._sId;var d=this._sId;var M=this.getOwnerComponent();this._oComp=sap.ui.component(s);if(this._oComp){this._oComp.destroy();}return M.runAsOwner(function(){this._oComp=sap.ui.getCore().createComponent({id:s,name:d});return new a({component:this._oComp});}.bind(this));},onNavBack:function(e){this.getRouter().navTo("entity",{id:this.entityId});},onNavToCode:function(e){this.getRouter().navTo("code",{entityId:this.entityId,sampleId:this._sId},false);},onToggleFullScreen:function(e){T.updateMode(e,this.getView(),this);},_oRTA:null,_loadRTA:function(){sap.ui.require(["sap/ui/fl/Utils","sap/ui/fl/FakeLrepConnectorLocalStorage","sap/ui/core/util/reflection/JsControlTreeModifier"],function(d,F,e){e.checkControlId=function(){return true;};d.checkControlId=function(){return true;};F.enableFakeConnector({"isProductiveSystem":true});this.byId("toggleRTA").setVisible(true);this.getRouter().attachRouteMatched(function(){if(this._oRTA){this._oRTA.destroy();this._oRTA=null;}},this);}.bind(this));},onToggleAdaptationMode:function(e){sap.ui.require(["sap/ui/rta/RuntimeAuthoring"],function(R){if(!this._oRTA){this._oRTA=new R({rootControl:this.byId("page").getContent()[0],flexSettings:{developerMode:false}});this._oRTA.attachStop(function(){this._oRTA.destroy();delete this._oRTA;}.bind(this));this._oRTA.start();}}.bind(this));}});});