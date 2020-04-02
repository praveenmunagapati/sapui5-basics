/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/core/mvc/ControllerExtension","sap/ui/model/json/JSONModel","sap/f/FlexibleColumnLayoutSemanticHelper","sap/fe/core/CommonUtils","sap/ui/core/Component"],function(C,J,F,a,b){"use strict";var r,c="",d={};var E=C.extend("sap.fe.core.controllerextensions.ContextManager",{oTargetsAggregation:{},mTargetsFromRoutePattern:{},isFclEnabled:function(A){if(A){return A.getRouter().isA("sap.f.routing.Router");}else if(r){return r.isA("sap.f.routing.Router");}else if(this.base!==undefined&&this.base.getView().getController().getOwnerComponent().getRouter()){return this.base.getView().getController().getOwnerComponent().getRouter().isA("sap.f.routing.Router");}return false;},initializeTargetAggregation:function(A){var m=A.getManifest();var t=m["sap.ui5"].routing.targets;var e=this;Object.keys(t).forEach(function(T){var o=t[T];if(o.controlAggregation){e.oTargetsAggregation[T]={aggregation:o.controlAggregation,pattern:o.contextPattern};}else{e.oTargetsAggregation[T]={aggregation:"page",pattern:null};}});},_initializeRoutesInformation:function(A){var m=A.getManifest();var R=m["sap.ui5"].routing.routes;var t=this;R.forEach(function(e){t.mTargetsFromRoutePattern[e.pattern]=e.target;});},buildBindingContext:function(p,P){if(p.length===0){return"";}var B=p;var f=p.indexOf("{");if(f!=-1){var i=p.indexOf("}");var s=p.substr(f+1,i-f-1);B=p.substr(0,f)+P[s];B+=this.buildBindingContext(p.substr(i+1),P);}return B;},getTargetAggregation:function(){return this.oTargetsAggregation;},initializeFcl:function(A,f){if(this.isFclEnabled(A)){this.oManifest=A.getManifest();this.oFcl=f;r=A.getRouter();this.oModel=new J();this.oNavigationHelper=A.getNavigationHelper();A.setModel(this.oModel,"fcl");this.oFcl.bindProperty("layout","fcl>/layout");r.attachBeforeRouteMatched(this.onBeforeRouteMatched,this);r.attachRouteMatched(this.onRouteMatched,this);this.oFcl.attachStateChange(this.onStateChanged,this);this.oFcl.attachAfterEndColumnNavigate(this.onStateChanged,this);this.initializeTargetAggregation(A);this._initializeRoutesInformation(A);}else{r=null;}},onRouteMatched:function(e){var R=e.getParameter("name");this._updateUIstateForEachviews();c=R;d=e.getParameter("arguments");},onStateChanged:function(e){var i=e.getParameter("isNavigationArrow");if(d!==undefined){if(!d["query"]){d["query"]={};}d["query"].layout=e.getParameter("layout");}this._updateUIstateForEachviews();if(i){this.oNavigationHelper.navTo(c,d);}},_updateUIstateForEachviews:function(){var t=this;this._getAllCurrentViews().forEach(function(v){t._updateUIStateForView(v);});},_updateUIStateForView:function(v){var u=this.getHelper().getCurrentUIState();var f=["beginColumn","midColumn","endColumn"];var e=v.getViewData().FCLLevel;var g=f[e<=2?e:2];if(!v.getModel("fclhelper")){v.setModel(new J(),"fclhelper");}if(e>2){u.actionButtonsInfo.endColumn.exitFullScreen=null;u.actionButtonsInfo.endColumn.closeColumn=null;}u.actionButtonsInfo.beginColumn={fullScreen:null,exitFullScreen:null,closeColumn:null};v.getModel("fclhelper").setProperty("/actionButtonsInfo",Object.assign({},u.actionButtonsInfo[g]));},_getAllCurrentViews:function(){var v=[];var o;if((o=this.oFcl.getCurrentEndColumnPage())!==undefined){if(o.isA("sap.ui.core.ComponentContainer")){v.push(b.get(o.getComponent()).getRootControl());}else{v.push(o);}}if((o=this.oFcl.getCurrentMidColumnPage())!==undefined){if(o.isA("sap.ui.core.ComponentContainer")){v.push(b.get(o.getComponent()).getRootControl());}else{v.push(o);}}if((o=this.oFcl.getCurrentBeginColumnPage())!==undefined){if(o.isA("sap.ui.core.ComponentContainer")){v.push(b.get(o.getComponent()).getRootControl());}else{v.push(o);}}return v;},_getOwnerComponent:function(){return a.getAppComponent(this.base.getView());},onBeforeRouteMatched:function(e){var q=e.getParameters().arguments["?query"];var l=q?q.layout:null;if(!l){var n=this.getHelper().getNextUIState(0);l=n.layout;}var t=e.getParameter("config").target;l=this._correctLayoutForTargets(l,t);if(l){this.oModel.setProperty("/layout",l);}},getHelper:function(){var p=jQuery.sap.getUriParameters(),s={defaultTwoColumnLayoutType:sap.f.LayoutType.TwoColumnsMidExpanded,defaultThreeColumnLayoutType:sap.f.LayoutType.ThreeColumnsMidExpanded,mode:p.get("mode"),initialColumnsCount:p.get("initial"),maxColumnsCount:p.get("max")};return F.getInstanceFor(this.oFcl,s);},handleFullScreen:function(e){var n=e.getSource().getModel("fclhelper").getProperty("/actionButtonsInfo/fullScreen");if(!d["query"]){d["query"]={};}d["query"].layout=n;this._getOwnerComponent().getNavigationHelper().navTo(c,d);},handleExitFullScreen:function(e){var n=e.getSource().getModel("fclhelper").getProperty("/actionButtonsInfo/exitFullScreen");if(!d["query"]){d["query"]={};}d["query"].layout=n;this._getOwnerComponent().getNavigationHelper().navTo(c,d);},handleClose:function(e){var o=e.getSource().getBindingContext();this.base.routing.navigateBackFromContext(o);},updateFCLLevels:function(t,e){var v;if(t.length==1&&this.getTargetAggregation()[t[0]].aggregation==="endColumnPages"){v=e[0].getComponentInstance().getRootControl();v.getViewData().FCLLevel=3;this._updateUIStateForView(v);}else{for(var i=0;i<t.length;i++){var T=t[i];var o=this.getTargetAggregation()[T];v=e[i].getComponentInstance().getRootControl();switch(o.aggregation){case"beginColumnPages":v.getViewData().FCLLevel=0;break;case"midColumnPages":v.getViewData().FCLLevel=1;break;default:v.getViewData().FCLLevel=2;}this._updateUIStateForView(v);}}},getFCLLayout:function(n,h,p){if(!p){p=this.getHelper().getNextUIState(n).layout;}var R=r.getRouteByHash(h+"?layout="+p);var t=this.mTargetsFromRoutePattern[R.getPattern()];return this._correctLayoutForTargets(p,t);},_correctLayoutForTargets:function(p,t){var e={"2":["TwoColumnsMidExpanded","TwoColumnsBeginExpanded","MidColumnFullScreen"],"3":["ThreeColumnsMidExpanded","ThreeColumnsEndExpanded","ThreeColumnsMidExpandedEndHidden","ThreeColumnsBeginExpandedEndHidden","MidColumnFullScreen","EndColumnFullScreen"]};if(!t){return p;}else if(t.length>1){var l=e[t.length];if(l.indexOf(p)<0){p=l[0];}}else{switch(this.getTargetAggregation()[t[0]].aggregation){case"beginColumnPages":p="OneColumn";break;case"midColumnPages":p="MidColumnFullScreen";break;default:p="EndColumnFullScreen";break;}}return p;}});return E;});