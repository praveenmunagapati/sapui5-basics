/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel","sap/fe/core/controllerextensions/Transaction","sap/fe/core/controllerextensions/Routing","sap/fe/core/controllerextensions/FlexibleColumnLayout","sap/fe/core/controllerextensions/EditFlow","sap/ui/model/odata/v4/ODataListBinding","sap/fe/macros/field/FieldRuntime","sap/base/Log","sap/base/util/merge","sap/fe/core/CommonUtils","sap/fe/navigation/SelectionVariant","sap/fe/macros/CommonHelper","sap/m/MessageBox","sap/fe/core/BusyLocker","sap/fe/navigation/NavigationHelper"],function(C,J,T,R,F,E,O,a,L,m,b,S,c,M,B,N){"use strict";var d;return C.extend("sap.fe.templates.ObjectPage.ObjectPageController",{transaction:T,routing:R,fcl:F,editFlow:E,onInit:function(){this.getView().setModel(this.editFlow.getUIStateModel(),"ui");this.getView().setModel(new J({sessionOn:false}),"localUI");var r=new J({visibility:false,items:null,visibilityBeforeEdit:false});this.getView().setModel(r,"relatedAppsModel");},getTableBinding:function(t){return t&&t._getRowBinding();},onBeforeBinding:function(o,p){var t=this,e=this._findTables(),f,g,h=this.byId("fe::op"),j=p.listBinding;if(h.getBindingContext()&&h.getBindingContext().hasPendingChanges()&&!(h.getBindingContext().getModel().hasPendingChanges("$auto")||h.getBindingContext().getModel().hasPendingChanges("$auto.associations"))){h.getBindingContext().getBinding().resetChanges();}for(var i=0;i<e.length;i++){f=e[i].getCreationRow();if(f){f.setBindingContext(null);}}if(p&&p.editable){if(o===null){g=true;}this.editFlow.setEditMode("Editable",g);}else{if(this.getView().getViewData().viewLevel===1){this.editFlow.setEditMode("Display",false);}else{this.editFlow.setEditMode(undefined,false);}}var s=function(k){if(!p.bPersistOPScroll){h.setSelectedSection(null);h.detachModelContextChange(s);}};h.attachModelContextChange(s);if(j&&j.isA("sap.ui.model.odata.v4.ODataListBinding")){var P=t.byId("fe::paginator");if(P){P.setListBinding(j);}}if(!p.editable){var l=this.getView().getModel("localUI");if(l.getProperty("/sessionOn")===true){l.setProperty("/sessionOn",false);}}},onAfterBinding:function(o,p){var e=this.byId("fe::op"),t=this,f=o.getModel(),g=this._findTables(),h;o=e.getBindingContext();h=this.editFlow.computeEditMode(o);function i(k,l){var n=k.getCreationRow(),q,r;if(n){h.then(function(){if(n.getVisible()){q=f.bindList(l.getPath(),l.getContext(),[],[],{$$updateGroupId:"doNotSubmit",$$groupId:"doNotSubmit"});r=q.create();n.setBindingContext(r);r.created().then(undefined,function(){L.trace("transient fast creation context deleted");});}});}}e._triggerVisibleSubSectionsEvents();function j(k){var l=t.getTableBinding(k);t.editFlow.handlePatchEvents(l);a.handlePatchEvents(l);i(k,l);}this.editFlow.handlePatchEvents(o).then(function(){g.forEach(function(k){k.done().then(j);});});a.handlePatchEvents(o);},onPageReady:function(p){if(p&&p.navBack&&p.lastFocusControl){var v=this.getView();var f=v.byId(p.lastFocusControl.controlId);if(f){f.applyFocusInfo(p.lastFocusControl.focusInfo);return;}}var o=this.byId("fe::op");var i=o.getModel("ui").getProperty("/editable")==="Display";var e;if(i){var A=o.getHeaderTitle().getActions();if(A.length){e=A.find(function(h){return h.mProperties["visible"];});if(e){e.focus();}}}else{var g=o._getFirstEditableInput();if(g){g.focus();}}},getPageTitleInformation:function(){var t=this;return new Promise(function(r,e){var o=t.byId("fe::op");var f={title:"",subtitle:"",intent:"",icon:""};var i=o.getCustomData().findIndex(function(h){return h.mProperties.key==="ObjectPageTitle";});var g=o.getCustomData().findIndex(function(h){return h.mProperties.key==="ObjectPageSubtitle";});if(o.getCustomData()[i].mProperties.value){f.title=o.getCustomData()[i].mProperties.value;}if(g>-1&&o.getCustomData()[g].getBinding("value")!==undefined){o.getCustomData()[g].getBinding("value").requestValue().then(function(v){f.subtitle=v;r(f);}).catch(function(){e();});}else{r(f);}});},executeHeaderShortcut:function(i){var s=this.getView().getId()+"--"+i,o=this.byId("fe::op").getHeaderTitle().getActions().find(function(e){return e.getId()===s;});this._pressButton(o);},executeFooterShortcut:function(i){var s=this.getView().getId()+"--"+i,o=this.byId("fe::op").getFooter().getContent().find(function(e){return e.getMetadata().getName()==="sap.m.Button"&&e.getId()===s;});this._pressButton(o);},getFooterVisiblity:function(e){d=e.getParameter("iMessageLength");var l=this.getView().getModel("localUI");d>0?l.setProperty("/showMessageFooter",true):l.setProperty("/showMessageFooter",false);},showMessagePopover:function(o){var e=o.oMessagePopover,i=e.getBinding("items");if(i.getLength()>0){e.openBy(o);}},saveDocument:function(o){var t=this;return this.editFlow.saveDocument(o).then(function(){var e=t.getView().byId("MessageButton");var D={onAfterRendering:function(f){t.showMessagePopover(e);e.removeEventDelegate(t._oDelegateOnAfter);delete t._oDelegateOnAfter;}};t._oDelegateOnAfter=D;e.addEventDelegate(D,t);}).catch(function(e){var f=t.getView().byId("MessageButton");if(f){t.showMessagePopover(f);}});},_updateRelatedApps:function(){var o=this.byId("fe::op");this.transaction.getProgrammingModel(o.getBindingContext()).then(function(p){var u=o.getModel("ui").getData();var r=o.getModel("relatedAppsModel");if(p==="Sticky"&&(u.createMode||u.editable==="Editable")){r.setProperty("/visibilityBeforeEdit",r.getProperty("/visibility"));r.setProperty("/visibility",false);}else{if(b.resolveStringtoBoolean(o.data("showRelatedApps"))){b.updateRelatedAppsDetails(o);}}});},_pressButton:function(o){if(o&&o.getVisible()&&o.getEnabled()){o.firePress();}},_findTables:function(){var o=this.byId("fe::op"),t=[];function f(p,i){for(var j=0;j<p.length;j++){var P=p[j].getAggregation("items")&&p[j].getAggregation("items")[0],k=P&&P.getAggregation("content");if(k&&k.isA("sap.ui.mdc.Table")){t.push(k);if(k.getType().isA("sap.ui.mdc.table.GridTableType")&&!i.hasStyleClass("sapUxAPObjectPageSubSectionFitContainer")){i.addStyleClass("sapUxAPObjectPageSubSectionFitContainer");}}}}var s=o.getSections();for(var e=0;e<s.length;e++){var g=s[e].getSubSections();for(var h=0;h<g.length;h++){f(g[h].getBlocks(),g[h]);f(g[h].getMoreBlocks(),g[h]);}}return t;},_mergePageAndLineContext:function(p,l){var o=m({},p,l),s=N.mixAttributesAndSelectionVariant(o,new S());return s;},handlers:{onDataRequested:function(e){var n=b.getAppComponent(this.getView()).getRootControl();B.lock(n);},onDataReceived:function(e){var s=e&&e.getParameter("error");var n=b.getAppComponent(this.getView()).getRootControl();B.unlock(n);var t=this;if(s){sap.ui.getCore().getLibraryResourceBundle("sap.fe.core",true).then(function(r){t.routing.navigateToMessagePage(r.getText("SAPFE_DATA_RECEIVED_ERROR"),{title:r.getText("SAPFE_ERROR"),description:s,navContainer:n});});}else{this._updateRelatedApps();}},onFieldValueChange:function(e){this.editFlow.syncTask(e.getParameter("promise"));a.handleChange(e);},onRelatedAppsItemPressed:function(e){var f=e.getSource().getCustomData(),p=e.getSource().getBindingContext(),t,g,h;for(var i=0;i<f.length;i++){var k=f[i].getKey();var v=f[i].getValue();if(k=="targetSemObject"){t=v;}else if(k=="targetAction"){g=v;}else if(k=="targetParams"){h=v;}}h=N.removeSensitiveData(p,h);var n={target:{semanticObject:t,action:g},params:h};sap.ushell.Container.getService("CrossApplicationNavigation").toExternal(n);},onCallAction:function(v,A,p){var o=v.getController();var t=o;return o.editFlow.onCallAction(A,p).then(function(){var e=t.getView().byId("MessageButton");if(e.isActive()){t.showMessagePopover(e);}else if(d){t._oDelegateOnAfter={onAfterRendering:function(f){t.showMessagePopover(e);e.removeEventDelegate(t._oDelegateOnAfter);delete t._oDelegateOnAfter;}};e.addEventDelegate(t._oDelegateOnAfter,t);}}).catch(function(e){var f=t.getView().byId("MessageButton");if(f){t.showMessagePopover(f);}});},onDataFieldForIntentBasedNavigation:function(o,s,A,l,r){var e;var p={};var f={};if(r||l){if(o.getView().getAggregation("content")[0].getBindingContext()){p=N.removeSensitiveData(o.getView().getAggregation("content")[0].getBindingContext());}if(l){if(l.length>1){var g=sap.ui.getCore().getLibraryResourceBundle("sap.fe.templates");M.error(g.getText("NAVIGATION_DISABLED_MULTIPLE_CONTEXTS"),{title:"Error"});return;}else if(l.length===1){f=N.removeSensitiveData(l[0]);}}e=o._mergePageAndLineContext(p,f);}c.navigateToExternalApp(o.getView(),e,s,A);},onChevronPressNavigateOutBound:function(o,s,e){var f=o.routing.getOutbounds(),g,D=f[s],p=N.removeSensitiveData(o.getView().getAggregation("content")[0].getBindingContext());var l=N.removeSensitiveData(e);if(D){if(e){g=o._mergePageAndLineContext(p,l);}c.navigateToExternalApp(o.getView(),g,D.semanticObject,D.action,c.showNavigateErrorMessage);return Promise.resolve();}else{throw new Error("outbound target "+s+" not found in cross navigation definition of manifest");}}}});});