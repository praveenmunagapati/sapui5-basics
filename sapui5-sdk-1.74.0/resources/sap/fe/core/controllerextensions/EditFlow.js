/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/core/mvc/ControllerExtension","sap/fe/core/actions/messageHandling","sap/ui/core/XMLTemplateProcessor","sap/ui/core/util/XMLPreprocessor","sap/ui/core/Fragment","sap/fe/core/actions/sticky","sap/base/Log","sap/m/Text","sap/m/Button","sap/m/Dialog","sap/ui/model/json/JSONModel","sap/ui/core/routing/HashChanger","sap/fe/core/CommonUtils","sap/fe/core/BusyLocker"],function(C,m,X,a,F,s,L,T,B,D,J,H,b,c){"use strict";var f="sap.fe.core.controls.field.DraftPopOverAdminData",p=X.loadTemplate(f,"fragment"),u={};var E=C.extend("sap.fe.core.controllerextensions.EditFlow",{syncTask:function(t){var n;if(t instanceof Promise){n=function(){return t;};}else if(typeof t==="function"){n=t;}this._pTasks=this._pTasks||Promise.resolve();if(!!n){this._pTasks=this._pTasks.then(n).catch(function(){return Promise.resolve();});}return this._pTasks;},createDocument:function(l,P){var t=this;function h(o,d){d.then(function(n){var e=t.base.getView().getBindingContext();if(!b.hasTransientContext(o)){t.requestSideEffects(o.getPath(),e);}});}return this.syncTask().then(function(){return new Promise(function(r,d){var g,e,o,M;P=P||{};if(typeof l==="object"){g=Promise.resolve(l);}else{throw new Error("Binding object expected");}g.then(function(i){o=i;M=o.getModel();var j=P.creationMode;if((!j||j==="NewPage")&&t.base.getView().getViewData()._creationMode==="Inplace"){j="Inline";}return t.base.transaction.getProgrammingModel(o).then(function(k){e=k;if(j&&j!=="NewPage"){return j;}else{switch(e){case"Draft":case"Sticky":if(!o.isRelative()){var n=M.getMetaModel(),q=o.getPath(),N=e==="Draft"?n.getObject(q+"@com.sap.vocabularies.Common.v1.DraftRoot/NewAction"):n.getObject(q+"@com.sap.vocabularies.Session.v1.StickySessionSupported/NewAction"),v=(N&&n.getObject("/"+N+"/@$ui5.overload/0/$Parameter"))||[];if(v.length>1){return"Deferred";}}return"Async";case"NonDraft":return"Sync";}}});}).then(function(i){var j,A,k=P.creationRow,n,v=Promise.resolve();if(i!=="Deferred"){if(i==="CreationRow"){P.data=P.creationRow.getBindingContext().getObject();n=k.getBindingContext();v=t.checkForValidationErrors(n);}if(i==="CreationRow"||i==="Inline"){P.keepTransientContextOnFailed=true;P.busyMode="Local";if(i==="CreationRow"){P.busyMode="None";}if(i==="Inline"){P.keepTransientContextOnFailed=false;}t.handleCreateEvents(o);}j=v.then(function(){return t.base.transaction.createDocument(o,P);});}var N=new Promise(function(r){switch(i){case"Deferred":t.base.routing.navigateForwardToContext(o,{deferredContext:true,noHistoryEntry:P.noHistoryEntry,editable:true}).then(function(){r();});break;case"Async":t.base.routing.navigateForwardToContext(o,{asyncContext:j,noHistoryEntry:P.noHistoryEntry,editable:true}).then(function(){r();});break;case"Sync":A={noHistoryEntry:P.noHistoryEntry,editable:true};if(e=="Sticky"){A.transient=true;}j.then(function(w){t.base.routing.navigateForwardToContext(w,A).then(function(){r();});});break;case"Inline":h(o,j);r();break;case"CreationRow":v.then(function(){var w=n.getBinding(),x;h(o,j);x=w.create();k.setBindingContext(x);n.created().then(undefined,function(){L.trace("transient fast creation context deleted");});n.delete("$direct");});r();break;}});var q=t.base.getView().getModel("localUI");if(e==="Sticky"){q.setProperty("/sessionOn",true);}if(j){Promise.all([j,N]).then(function(w){var x=w[0];if(x){t.base.routing.setUIStateDirty();if(e==="Sticky"){t._handleStickyOn(x);}}r();},d);}else{r();}});});});},editDocument:function(o){var t=this;this.base.transaction.editDocument(o).then(function(n){t.base.transaction.getProgrammingModel(o).then(function(P){var N;if(P==="Sticky"){var l=t.base.getView().getModel("localUI");l.setProperty("/sessionOn",true);t._handleStickyOn(n);N=true;}if(n!==o){t.handleNewContext(n,true,N,true,true,true);}});});},saveDocument:function(o){var t=this;return(this.syncTask().then(this._submitOpenChanges.bind(this,o)).then(this.checkForValidationErrors.bind(this,o)).then(this.base.transaction.saveDocument.bind(this.base.transaction,o)).then(function(A){return t.base.transaction.getProgrammingModel(o).then(function(P){var n;if(P==="Sticky"){var l=t.base.getView().getModel("localUI");l.setProperty("/sessionOn",false);var h=A.getModel().bindContext(A.getPath(),undefined,{$$groupId:"$auto"});A=h.getBoundContext();t._handleStickyOff(o);if(o.getPath()===A.getPath()){n=true;}}if(A!==o){t.handleNewContext(A,true,n,false,true,false);}});}));},cancelDocument:function(o,P){var t=this;this.syncTask().then(this.base.transaction.cancelDocument.bind(this.base.transaction,o,P)).then(function(A){t.base.transaction.getProgrammingModel(o).then(function(d){var n;if(d==="Sticky"){var l=t.base.getView().getModel("localUI");l.setProperty("/sessionOn",false);t._handleStickyOff(o);n=true;var r=t.getView().getModel("relatedAppsModel");r.setProperty("/visibility",r.getProperty("/visibilityBeforeEdit"));}if(!A){t.base.routing.setUIStateDirty();t.base.routing.navigateBackFromContext(o);}else{t.handleNewContext(A,true,n,false,true,true);}});});},requestSideEffects:function(n,o){var M=this.base.getView().getModel().getMetaModel(),d="/"+M.getObject(M.getMetaPath(o.getPath()))["$Type"],A=M.getObject(d+"@"),S=Object.keys(A).filter(function(j){return j.indexOf("@com.sap.vocabularies.Common.v1.SideEffects")>-1;}),e=[],P,g=[],h=[],i;S.forEach(function(j){var k=A[j];if(k.SourceEntities){k.SourceEntities.forEach(function(l){if(l["$NavigationPropertyPath"]===n){e.push(j);}});}if(k.SourceProperties&&e.indexOf(j)===-1){k.SourceProperties.forEach(function(l){if(e.indexOf(j)===-1&&l["$PropertyPath"].indexOf(n+"/")===0){e.push(j);}});}});e.forEach(function(j){var k=[],l=A[j],t=l.TargetProperties||[],q=l.TargetEntities||[];t=t.map(function(r){return r["$PropertyPath"];}).filter(function(r){return g.indexOf(r)<0;});t.forEach(function(r){var v=M.getObject(d+"/"+r+"@com.sap.vocabularies.Common.v1.Text");if(v&&v["$Path"]){k.push(v["$Path"]);}});q=q.map(function(r){return r["$NavigationPropertyPath"];}).filter(function(r){return h.indexOf(r)<0;});g=g.concat(t).concat(k);h=h.concat(q);});P=g.map(function(j){return{"$PropertyPath":j};}).concat(h.map(function(j){return{"$NavigationPropertyPath":j};}));if(P.length){i=b.getContextForSideEffects(o);i.requestSideEffects(P);}},deleteSingleDocument:function(o,P){var t=this;this._deleteDocumentTransaction(o,P).then(function(){t.base.routing.setUIStateDirty();t.base.routing.navigateBackFromContext(o);});},deleteMultipleDocuments:function(o,P){var t=this;this._deleteDocumentTransaction(o,P).then(function(){var d=t.getView().byId(P.controlId);if(d&&d.isA("sap.ui.mdc.Table")){d.clearSelection();}var e=t.base.getView().getBindingContext();if(e&&Array.isArray(o)){var l=o[0].getBinding();if(!b.hasTransientContext(l)){t.requestSideEffects(l.getPath(),e);}}var n=b.getAppComponent(t.base.getView())._oNavigationHelper;var i=false;for(var g=0;!i&&g<o.length;g++){if(n.isCurrentStateImpactedBy(o[g].getPath())){i=true;t.base.routing.navigateBackFromContext(o[g]);}}});},_deleteDocumentTransaction:function(o,P){var t=this,l=this.base.getView().getModel("localUI");P=P||{};return this.syncTask().then(this.base.transaction.deleteDocument.bind(this.base.transaction,o,P,l)).then(function(){var l=t.base.getView().getModel("localUI");l.setProperty("/sessionOn",false);});},applyDocument:function(o){var t=this,U=this.base.getView().getModel("ui");c.lock(U);return this._submitOpenChanges(o).then(function(){c.unlock(U);m.showUnboundMessages();t.base.routing.navigateBackFromContext(o);return true;}).catch(function(e){var d=[];d.push({text:t.base.transaction.getText("SAPFE_APPLY_ERROR"),type:"Error"});c.unlock(U);m.showUnboundMessages(d);return false;});},_submitOpenChanges:function(o){var M=o.getModel();var P=[];P.push(M.submitBatch("$auto"));P.push(M.submitBatch("$auto.associations"));return Promise.all(P).then(function(){if(M.hasPendingChanges("$auto")||M.hasPendingChanges("$auto.associations")){return Promise.reject("submit of open changes failed");}});},_handleStickyOn:function(o){var A=b.getAppComponent(this.base.getView());if(!this.bStickyOn){this.bStickyOn=true;var r=H.getInstance().getHash(),h=r;if(sap.ushell){this.fnDirtyStateProvider=function(){var d=H.getInstance().getHash(),e;if(A.getNavigationHelper().isCurrentHashTransient()){e=false;}else if(h===d){e=true;}else if(d!==""&&r.indexOf(d.split("/")[0])===0){h=d;e=false;}else{e=true;}if(e){setTimeout(function(){sap.ushell.Container.setDirtyFlag(false);},0);}return e;};sap.ushell.Container.registerDirtyStateProvider(this.fnDirtyStateProvider);}var i=this.base.getView().getModel("sap.fe.i18n"),t=this;this.fnHandleSessionTimeout=function(){m.removeBoundTransitionMessages();m.removeUnboundTransitionMessages();var d=new D({title:"{sap.fe.i18n>OBJECT_PAGE_SESSION_EXPIRED_DIALOG_TITLE}",state:"Warning",content:new T({text:"{sap.fe.i18n>OBJECT_PAGE_SESSION_EXPIRED_DIALOG_MESSAGE}"}),beginButton:new B({text:"{sap.fe.i18n>SAPFE_OK}",type:"Emphasized",press:function(){t._handleStickyOff();t.base.routing.navigateBackFromContext(o);}}),afterClose:function(){d.destroy();}});d.addStyleClass("sapUiContentPadding");d.setModel(i,"sap.fe.i18n");t.base.getView().addDependent(d);d.open();};this.base.getView().getModel().attachSessionTimeout(this.fnHandleSessionTimeout);this.fnStickyDiscard=function(){var d=H.getInstance().getHash();if(!d||r.indexOf(d.split("/")[0])===-1){s.discardDocument(o);t._handleStickyOff();}};this.base.routing.attachOnAfterNavigation(this.fnStickyDiscard);}},_handleStickyOff:function(){if(sap.ushell){if(this.fnDirtyStateProvider){sap.ushell.Container.deregisterDirtyStateProvider(this.fnDirtyStateProvider);this.fnDirtyStateProvider=null;}}if(this.base.getView().getModel()&&this.fnHandleSessionTimeout){this.base.getView().getModel().detachSessionTimeout(this.fnHandleSessionTimeout);}this.base.routing.detachOnAfterNavigation(this.fnStickyDiscard);this.fnStickyDiscard=null;this.bStickyOn=false;},handleNewContext:function(o,n,N,e,P,U){this.base.routing.setUIStateDirty();this.base.routing.navigateToContext(o,{noHistoryEntry:n,noHashChange:N,editable:e,bPersistOPScroll:P,useHash:U});},onCallAction:function(A,P){var t=this;return this.syncTask().then(t.base.transaction.onCallAction.bind(t.base.transaction,A,P)).then(function(){if(P.contexts){t.base.routing.setUIStateDirty();}});},formatDraftOwnerText:function(d,e,g,h,i){var j="";var U=e||d||h||g;if(i){j+=d?this.base.transaction.getText("DRAFTINFO_GENERIC_LOCKED_OBJECT_POPOVER_TEXT")+" ":this.base.transaction.getText("DRAFTINFO_LAST_CHANGE_USER_TEXT")+" ";}j+=U?this.base.transaction.getText("DRAFTINFO_OWNER",[U]):this.base.transaction.getText("DRAFTINFO_ANOTHER_USER");return j;},formatDraftOwnerTextInline:function(d,e,g,h){return this.formatDraftOwnerText(d,g,e,h,false);},formatDraftOwnerTextInPopover:function(d,e,g,h){return this.formatDraftOwnerText(d,g,e,h,true);},onDraftLinkPressed:function(e,d){var t=this,o=e.getSource(),g=o.getBindingContext(),v=this.base.getView(),M=v.getModel().getMetaModel(),h=v.getController(),O=function(){var P=t._oPopover.getModel("draftInfo");P.setProperty("/bIsActive",g.getProperty("IsActiveEntity"));P.setProperty("/bHasDraft",g.getProperty("HasDraftEntity"));t._oPopover.getModel().bindContext(g.getPath(),undefined,{$$groupId:"$auto"});t._oPopover.openBy(o);};if(!this._oPopover||!this._oPopover.oPopup){Promise.resolve(t._oFragment||a.process(p,{name:f},{bindingContexts:{entitySet:M.createBindingContext("/"+d)},models:{entitySet:M}})).then(function(i){t._oFragment=i;return F.load({definition:i,controller:h});}).then(function(P){t._oPopover=P;v.addDependent(t._oPopover);var i=new J({bIsActive:undefined,bHasDraft:undefined});t._oPopover.setModel(i,"draftInfo");O();});}else{O();}},closeDraftAdminPopover:function(){this._oPopover.close();},handlePatchEvents:function(o){var t=this.transactionStateModel;t.setProperty("/draftStatus","Clear");var d=this;return d.base.transaction.getProgrammingModel(o).then(function(P){o=(o.getBinding&&o.getBinding())||o;o.attachEvent("patchSent",function(){d.base.transaction.handleDocumentModifications();d.base.routing.setUIStateDirty();if(P==="Draft"){t.setProperty("/draftStatus","Saving");}});o.attachEvent("patchCompleted",function(e){if(P==="Draft"){t.setProperty("/draftStatus",e.getParameter("success")?"Saved":"Clear");}m.showUnboundMessages();});});},handleCreateEvents:function(o){var t=this.transactionStateModel;t.setProperty("/draftStatus","Clear");var d=this;return d.base.transaction.getProgrammingModel(o).then(function(P){o=(o.getBinding&&o.getBinding())||o;o.attachEvent("createSent",function(){d.base.transaction.handleDocumentModifications();if(P==="Draft"){t.setProperty("/draftStatus","Saving");}});o.attachEvent("createCompleted",function(e){if(P==="Draft"){t.setProperty("/draftStatus",e.getParameter("success")?"Saved":"Clear");}m.showUnboundMessages();});});},handleErrorOfTable:function(e){if(e.getParameter("error")){setTimeout(m.showUnboundMessages,0);}},getUIStateModel:function(){var A,t=this;if(!this.editFlowStateModel){A=b.getAppComponent(this.base.getView()).getId();if(!u[A]){u[A]=this.base.transaction.getUIStateModel();}else{this.base.transaction.setUIStateModel(u[A]);}this.transactionStateModel=u[A];this.editFlowStateModel=new J(this.transactionStateModel.getData());this.transactionStateModel.bindList("/").attachChange(function(){var d=t.editFlowStateModel.getProperty("/createMode");t.editFlowStateModel.setJSON(t.transactionStateModel.getJSON());t.editFlowStateModel.setProperty("/createMode",d);});}return this.editFlowStateModel;},computeEditMode:function(o){var t=this;return new Promise(function(r,d){var e=t.getUIStateModel(),g=t.transactionStateModel;t.base.transaction.getProgrammingModel(o).then(function(P){if(P==="Draft"){o.requestObject("IsActiveEntity").then(function(i){if(i===false){g.setProperty("/editable","Editable");o.requestObject("HasActiveEntity").then(function(h){if(h){e.setProperty("/createMode",false);}else{e.setProperty("/createMode",true);}r();});}else{g.setProperty("/editable","Display");r();}});}else{r();}});});},setEditMode:function(e,d){var o=this.getUIStateModel(),t=this.transactionStateModel;if(e){t.setProperty("/editable",e);}if(d!==undefined){o.setProperty("/createMode",d);}},checkForValidationErrors:function(o){return this.syncTask().then(function(){var P=o.getPath(),M=sap.ui.getCore().getMessageManager().getMessageModel().getData(),d,e;for(var i=0;i<M.length;i++){e=M[i];if(e.validation){d=sap.ui.getCore().byId(e.getControlId());if(d&&d.getBindingContext()&&d.getBindingContext().getPath().indexOf(P)===0){return Promise.reject("validation errors exist");}}}});}});return E;});