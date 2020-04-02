/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/core/UIComponent","sap/m/NavContainer","sap/f/FlexibleColumnLayout","sap/fe/core/controllerextensions/Routing","sap/fe/core/controllerextensions/FlexibleColumnLayout","sap/fe/core/NavigationHelper"],function(U,N,F,R,a,b){"use strict";var A=U.extend("sap.fe.core.AppComponent",{metadata:{config:{fullWidth:true},manifest:{"sap.ui5":{services:{resourceModel:{factoryName:"sap.fe.core.services.ResourceModelService","startup":"waitFor","settings":{"bundles":["sap.fe.core"],"modelName":"sap.fe.i18n"}},namedBindingModel:{factoryName:"sap.fe.core.services.NamedBindingModelService","startup":"waitFor"},draftModel:{"factoryName":"sap.fe.core.services.DraftModelService","startup":"waitFor"},ShellUIService:{factoryName:"sap.ushell.ui5service.ShellUIService"},navigation:{factoryName:"sap.fe.core.services.NavigationService"}},routing:{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","controlAggregation":"pages","async":true,"containerOptions":{"propagateModel":true}}}}},designtime:"sap/fe/core/designtime/AppComponent.designtime",library:"sap.fe"},_oFcl:null,_oNavigationHelper:null,getFcl:function(){return this._oFcl;},getNavigationHelper:function(){return this._oNavigationHelper;},constructor:function(){this._oRouting=new R();this._oFcl=new a();this._oTemplateContract={oAppComponent:this};this._oNavigationHelper=new b();U.apply(this,arguments);return this.getInterface();},init:function(){var t=this;var o=this.getManifestEntry("/sap.ui5/routing");if(!o.config||!o.config.controlId){var c=this.getMetadata().getParent();if(c.getName()==="sap.fe.AppComponent"){c=c.getParent();}var m=c.getManifestObject()._oManifest["sap.ui5"].routing.config;if(m){m.controlId=this.createId("appContent");}}var M=this.getModel();if(M){U.prototype.init.apply(this,arguments);this.getFcl().initializeFcl(this,this._oTemplateContract.oNavContainer);this._oRouting.initializeRouting(this).then(function(){t.getNavigationHelper().init(t);});this.getService("draftModel").then(function(d){if(d.isDraftModel()){t.setModel(d.getDraftAccessModel(),"$draft");}});M.getMetaModel().requestObject("/$EntityContainer/").catch(function(e){var n=this.getRootControl(),r=sap.ui.getCore().getLibraryResourceBundle("sap.fe.core");t._oRouting.navigateToMessagePage(r.getText("SAPFE_APPSTART_TECHNICAL_ISSUES"),{title:r.getText("SAPFE_ERROR"),description:e.message,navContainer:n});}.bind(this));}},exit:function(){this._oRouting.fireOnAfterNavigation();},createContent:function(){if(!this._oTemplateContract.bContentCreated){var m=this.getManifestEntry("sap.ui5");if(!m.rootView){if(this.getFcl().isFclEnabled(this)){this._oTemplateContract.oNavContainer=new F({id:this.createId("appContent"),backgroundDesign:"Solid"});}else{this._oTemplateContract.oNavContainer=new N({id:this.createId("appContent"),autoFocus:false});}}else{this._oTemplateContract.oNavContainer=U.prototype.createContent.apply(this,arguments);}this._oTemplateContract.bContentCreated=true;}return this._oTemplateContract.oNavContainer;},getMetaModel:function(){return this.getModel().getMetaModel();}});return A;});