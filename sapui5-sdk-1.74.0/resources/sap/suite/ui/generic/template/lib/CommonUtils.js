sap.ui.define(["sap/ui/base/Object","sap/ui/base/Event","sap/ui/core/mvc/ControllerExtension","sap/ui/model/Context","sap/ui/model/Filter","sap/m/Table","sap/m/ListBase","sap/m/MessageBox","sap/ui/generic/app/navigation/service/NavigationHandler","sap/ui/generic/app/navigation/service/NavError","sap/suite/ui/generic/template/lib/testableHelper","sap/base/Log","sap/ui/model/analytics/odata4analytics","sap/suite/ui/generic/template/lib/MetadataAnalyser","sap/base/util/extend","sap/base/util/deepExtend"],function(B,E,C,a,F,R,L,M,N,b,t,c,o,d,f,g){"use strict";var h=sap.ui.getCore();function l(e,P){var i=sap.ui.require(P);return typeof i==="function"&&(e instanceof i);}function m(e){return l(e,"sap/ui/comp/smarttable/SmartTable");}function n(e){return l(e,"sap/ui/comp/smartchart/SmartChart");}function p(e){return l(e,"sap/ui/table/Table");}function q(e){return l(e,"sap/ui/table/AnalyticalTable");}function r(e){return l(e,"sap/ui/table/TreeTable");}function s(e){return l(e,"sap/m/Table");}function u(e){var T=e&&sap.ui.getCore().byId(e);if(T){T.focus();}}var m=t.testableStatic(m,"CommonUtils_isSmartTable");function v(w,S,x){var y;var z=Object.create(null);var O=Object.create(null);function P(e){var i;if(m(e)){i=e.getCustomToolbar();}else if(n(e)){i=e.getToolbar();}if(i){var j=Z(i);if(j&&j.annotatedActionIds){O[e.getId()]=JSON.parse(atob(j.annotatedActionIds));}if(j&&j.deleteButtonId){O[e.getId()].push({ID:j.deleteButtonId,RecordType:"CRUDActionDelete"});}}}function G(e){if(!O[e.getId()]){P(e);}return O[e.getId()];}function A(e){var i,j,k,T1;i=e.getEntitySet();j=w.getOwnerComponent().getModel().getMetaModel();k=j.getODataEntitySet(i);T1=j.getODataEntityType(k.entityType);return T1;}function D(e,i,j){var k=e instanceof E?e.getSource():e;var T1=k.getId();var U1=z[T1];if(!U1){if(j){return null;}U1={control:k,infoObject:Object.create(null),categories:[]};(i||Function.prototype)(U1.infoObject,U1.categories,k);z[T1]=U1;}return U1.infoObject;}function H(e,i){for(var j in z){var k=z[j];if(k.categories.indexOf(e)>=0){i(k.infoObject,k.control);}}}function I(e){S.oApplication.attachControlToParent(e,w.getView());}function J(e){if(e.getVisible&&!e.getVisible()){return null;}return e.getParent()||e.oContainer;}function K(e){var i=w.getView();var j=false;for(var k=i.getVisible()&&h.byId(e);k&&!j;k=J(k)){j=k===i;}return j;}function Q(e,j){var k="";for(var i=0;i<e.length;i++){var T1=e[i];if(K(T1)){if(j){var U1=h.byId(T1);if(m(U1)||s(U1)||p(U1)){k=k||T1;continue;}}return T1;}}return k;}function T(e,i,j,k){return S.oApplication.getDialogFragmentForView(w.getView(),e,i,j,k);}var U;function V(){var e=w.getOwnerComponent();U=U||e.getModel("i18n").getResourceBundle();return U.getText.apply(U,arguments);}function W(k,e,i,j){var T1,U1,V1,W1;var X1=w.getOwnerComponent();var Y1=e.indexOf("::"+X1.getEntitySet()+"--")+2;T1=e.substring(Y1,e.lastIndexOf("::"));T1=T1.replace(/--/g,"|").replace(/::/g,"|");U1=k+"|"+T1;V1=i||k;W1=V(U1,j);if(W1===U1){W1=V(V1,j);}return W1;}function X(e,i){var i=i||e.getSelectionBehavior();if(i==="DATAPOINT"){return{"dataPoints":e.getSelectedDataPoints().dataPoints,"count":e.getSelectedDataPoints().count};}else if(i==="CATEGORY"){return{"dataPoints":e.getSelectedCategories().categories,"count":e.getSelectedCategories().count};}else if(i==="SERIES"){return{"dataPoints":e.getSelectedSeries().series,"count":e.getSelectedSeries().count};}}function Y(e,j,k){var T1=[];if(m(e)){e=e.getTable();}else if(n(e)){e.getChartAsync().then(function(W1){e=W1;if(e&&e.getMetadata().getName()==="sap.chart.Chart"){var X1=false;j=j||e.getSelectionBehavior();k=k||X(e,j);if(k&&k.count>0){if(j==="DATAPOINT"){X1=true;}var Y1=k.dataPoints;var Z1=[];for(var i=0;i<Y1.length;i++){if(X1){if(Y1[i].context){T1.push(Y1[i].context);}}else{Z1.push(Y1[i].dimensions);}}if(!X1){T1[0]=Z1;}}}});}if(e instanceof L){T1=e.getSelectedContexts();}else if(p(e)){var U1=e.getPlugins().filter(function(W1){return W1.isA("sap.ui.table.plugins.SelectionPlugin");})[0];var V1=U1?U1.getSelectedIndices():e.getSelectedIndices();if(V1){for(var i=0;i<V1.length;i++){T1.push(e.getContextByIndex(V1[i]));}}}return T1;}function Z(e){var i={};if(e instanceof sap.ui.core.Element){e.getCustomData().forEach(function(j){i[j.getKey()]=j.getValue();});}return i;}function $(e){var j,k,T1;var U1=k1(e);if(!m(U1)&&!n(U1)){U1=U1.getParent();}var V1=Y(U1);var W1=U1.getModel();k=h1(U1);f1(k,V1,W1,U1);j=G(U1);for(var i=0;i<j.length;i++){T1=j[i];_(T1,W1,V1,U1);}}function _(e,i,j,k){var T1;if(e.RecordType==="CRUDActionDelete"){T1=d1(i,j,k);k.getModel("_templPriv").setProperty("/listReport/deleteEnabled",T1);}else if(e.RecordType==="com.sap.vocabularies.UI.v1.DataFieldForAction"||e.RecordType==="com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation"){var U1=i.getMetaModel();T1=c1(i,U1,j,e.RecordType,e.Action,k);}var V1=w.getView().byId(e.ID);if(V1&&/generic\/controlProperties/.test(V1.getBindingPath("enabled"))&&T1!==undefined){b1(e.ID,"enabled",T1);}}function a1(e){var i;var j=k1(e);var k=Y(j);var T1=e.getModel();i=i1();f1(i,k,T1,j);}function b1(i,e,j){var k=w.getView().getModel("_templPriv");var T1=k.getProperty("/generic/controlProperties/"+i);if(!T1){T1={};T1[e]=j;k.setProperty("/generic/controlProperties/"+i,T1);}else{k.setProperty("/generic/controlProperties/"+i+"/"+e,j);}}function c1(e,i,k,T1,U1,V1){var W1,X1,Y1,Z1;var $1=false;if(T1==="com.sap.vocabularies.UI.v1.DataFieldForAction"){W1=i.getODataFunctionImport(U1);Y1=W1&&W1["sap:action-for"];if(Y1&&Y1!==""&&Y1!==" "){if(k.length>0){Z1=W1["sap:applicable-path"];if(Z1&&Z1!==""&&Z1!==" "){for(var j=0;j<k.length;j++){if(!k[j]){continue;}X1=e.getObject(k[j].getPath());if(X1&&X1[Z1]){$1=true;break;}}}else{$1=true;}}}else{$1=true;}}else if(T1==="com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation"){if(k.length>0||(n(V1)&&V1.getDrillStackFilters().length>0)){$1=true;}}return $1;}function d1(e,i,j){if(i.length===0){return false;}var k=e1(j);var T1=k&&k.Deletable&&k.Deletable.Path;return i.some(function(U1){var V1=e.getObject(U1.getPath()+"/DraftAdministrativeData");var W1=!(V1&&V1.InProcessByUser&&!V1.DraftIsProcessedByMe);return W1&&!(T1&&!e.getProperty(T1,U1));});}function e1(e){var i=e.getModel()&&e.getModel().getMetaModel();var j=i&&i.getODataEntitySet(e.getEntitySet());var k=j&&j["Org.OData.Capabilities.V1.DeleteRestrictions"];return k;}function f1(e,i,j,k){var T1=j1(k);var U1=w.getView().getModel("_templPriv");var V1=U1.getProperty("/generic/listCommons/breakoutActionsEnabled");if(T1){var W1=w.byId("template::IconTabBar");var X1="";if(W1){X1=W1.getSelectedKey();}g1(V1,T1,e,i,j,X1,k);}U1.setProperty("/generic/listCommons/breakoutActionsEnabled",V1);}function g1(e,i,j,k,T1,U1,V1){var W1;for(var X1 in i){W1=true;var Y1=i[X1].id+((U1&&!i[X1].determining)?"-"+U1:"");if(V1&&V1.getId().indexOf("AnalyticalListPage")>-1){W1=!!e[Y1].enabled;}if(i[X1].requiresSelection){if(k.length>0){if(V1&&n(V1)){if(i[X1].filter==="chart"){W1=true;}}else if(V1&&m(V1)){if(i[X1].filter!=="chart"){W1=true;}}if(i[X1].applicablePath!==undefined&&i[X1].applicablePath!==""){W1=false;for(var Z1=0;Z1<k.length;Z1++){var $1="";var _1=i[X1].applicablePath.split("/");if(_1.length>1){for(var a2=0;a2<_1.length-1;a2++){$1+="/"+_1[a2];}}var b2=T1.getObject(k[Z1].getPath()+$1);var c2=_1[_1.length-1];if(b2[c2]===true){W1=true;break;}}}}else if(n(V1)){if((V1.getId().indexOf("AnalyticalListPage")>-1?i[X1].filter==="chart":true)){if(V1.getDrillStackFilters().length>0){W1=true;}else{W1=false;}}}else{if(i[X1].filter!=="chart"){W1=false;}}}e[Y1]={enabled:W1};}}function h1(e){var i=[];var j=j1(e);for(var k in j){i.push(j[k].id);}return i;}function i1(){var e=[];var i=j1();for(var j in i){if(i[j].determining){e.push(j);}}return e;}function j1(e){var i=w.getOwnerComponent();var j=i.getAppComponent().getManifestEntry("sap.ui5");var k=j.extends&&j.extends.extensions&&j.extends.extensions["sap.ui.controllerExtensions"];k=k&&k[i.getTemplateName()];k=k&&k["sap.ui.generic.app"];var T1=i.getEntitySet();var U1=Z(e).sectionId;if(!U1){return k&&k[T1]&&k[T1]["Actions"];}else{var V1=k&&k[T1]&&k[T1]["Sections"];return V1&&V1[U1]&&V1[U1].Actions;}}function k1(e){var i=e;while(i){if(i instanceof R||p(i)||m(i)||n(i)){return i;}i=i.getParent&&i.getParent();}return null;}function l1(e){if(m(e)){e=e.getTable();}if(p(e)){return e.getBindingInfo("rows");}else if(e instanceof R){return e.getBindingInfo("items");}return null;}function m1(e){var i=l1(e);if(i&&i.binding){i.binding.refresh();}else if(e&&e.rebindTable){e.rebindTable();}}function n1(e){var i=w.getOwnerComponent();var j=i.getModel();var k,T1;var U1=!S.oApplication.checkEtags();if(U1){T1=l1(e);if(T1){k=T1.path;var V1=e.getEntitySet();var W1=j.getMetaModel();var X1=W1.getODataEntitySet(V1);if(w.getMetadata().getName()==='sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage'&&o1(j,X1)){j.invalidateEntityType(X1.entityType);}else{j.invalidate(p1.bind(null,k));}var Y1=i.getId();var Z1=Object.create(null);Z1[Y1]=true;S.oApplication.refreshAllComponents(Z1);}}}function o1(e,i){var j=new o.Model(o.Model.ReferenceByModel(e));var k=j.findQueryResultByName(i.name);var T1=k&&k.getParameterization();return!!T1;}function p1(e,k,i){var j=e[0]==="/"?e.substr(1):e;if(k.split("(")[0]===j){return true;}else{return false;}}function q1(e){var i;if(x.isDraftEnabled()){i=S.oDraftController.isActiveEntity(e)?1:6;}else{var j=w.getOwnerComponent();i=j.getModel("ui").getProperty("/editable")?6:1;}x.navigateAccordingToContext(e,i,0);}function r1(e,i){if(e instanceof a){S.oNavigationController.navigateToContext(e,i&&i.navigationProperty,i&&i.replaceInHistory);return;}var j=i&&i.routeName;if(j){x.navigateRoute(j,e,null,i&&i.replaceInHistory);return;}c.warning("navigateToContext called without context or route");}function s1(e){if(e instanceof b){if(e.getErrorCode()==="NavigationHandler.isIntentSupported.notSupported"){M.show(V("ST_NAV_ERROR_NOT_AUTHORIZED_DESC"),{title:V("ST_GENERIC_ERROR_TITLE")});}else{M.show(e.getErrorCode(),{title:V("ST_GENERIC_ERROR_TITLE")});}}}function t1(e,i){I1(function(){y=O1();var j={semanticObject:e.semanticObject,action:e.action};var k=y.mixAttributesAndSelectionVariant(e.parameters);w.adaptNavigationParameterExtension(k,j);y.navigate(e.semanticObject,e.action,k.toJSONString(),null,s1);},Function.prototype,i,"LeavePage");}function u1(e){var T1=[],U1,V1,W1;var X1=w.getOwnerComponent();var Y1=X1.getModel().getMetaModel();if(!e){return{};}var Z1=X1.getAppComponent().getConfig().pages[0];if(!Z1){return{};}var $1=function(i){W1=Y1.getODataEntitySet(i.entitySet).entityType;V1=Y1.getODataEntityType(W1);U1={};U1={entitySet:i.entitySet,aKeys:Y1.getODataEntityType(W1).key.propertyRef,navigationProperty:i.navigationProperty};for(var j=0,a2=U1.aKeys.length;j<a2;j++){var k=0,b2=V1.property.length;for(k;k<b2;k++){if(U1.aKeys[j].name===V1.property[k].name){U1.aKeys[j].type=V1.property[k].type;break;}}}};var _1=function(e,Z1){if(!Z1.pages){return T1;}for(var i=0,j=Z1.pages.length;i<j;i++){if(!Z1.pages[i]){break;}if(e===Z1.pages[i].entitySet){$1(Z1.pages[i]);T1.splice(0,0,U1);break;}T1=_1(e,Z1.pages[i]);if(T1.length>0){$1(Z1.pages[i]);T1.splice(0,0,U1);}}return T1;};return _1(e,Z1);}function v1(k,e){var T1,U1,i,V1;for(i=0,V1=k.length;i<V1;i++){if(k[i].navigationProperty){U1+="/"+k[i].navigationProperty;}else{U1="/"+k[i].entitySet;}for(var j=0,W1=k[i].aKeys.length;j<W1;j++){if(j===0){U1+="(";T1="";}else{T1=",";}switch(k[i].aKeys[j].type){case"Edm.Guid":if(e.DraftAdministrativeData&&e.DraftAdministrativeData.DraftIsCreatedByMe){U1+=T1+k[i].aKeys[j].name+"="+"guid'"+e.DraftAdministrativeData[k[i].aKeys[j].name]+"'";}else{U1+=T1+k[i].aKeys[j].name+"="+"guid'"+e[k[i].aKeys[j].name]+"'";}break;case"Edm.Boolean":if(e.DraftAdministrativeData&&e.DraftAdministrativeData.DraftIsCreatedByMe){U1+=T1+k[i].aKeys[j].name+"="+false;}else{U1+=T1+k[i].aKeys[j].name+"="+e[k[i].aKeys[j].name];}break;default:if(typeof e[k[i].aKeys[j].name]==="string"){U1+=T1+k[i].aKeys[j].name+"="+"'"+e[k[i].aKeys[j].name]+"'";}else{U1+=T1+k[i].aKeys[j].name+"="+e[k[i].aKeys[j].name];}break;}if(j===(W1-1)){U1+=")";}}}return U1;}function w1(e,k,w){var T1,U1,V1,W1,X1,Y1,Z1;var $1={semanticObject:"",action:""};y=O1();T1=y.mixAttributesAndSelectionVariant({},k);for(W1 in e.semanticAttributesOfSemanticObjects){for(V1 in e.semanticAttributesOfSemanticObjects[W1]){if(!T1.getSelectOption(V1)){T1.addParameter(V1,"");}}X1=T1.getPropertyNames();$1.semanticObject=W1;w.adaptNavigationParameterExtension(T1,$1);Y1=T1.getSelectOptionsPropertyNames();Z1=T1.getParameterNames();for(var i=0,_1=X1.length;i<_1;i++){if(Y1.indexOf(X1[i])<0&&Z1.indexOf(X1[i])<0){delete e.semanticAttributesOfSemanticObjects[W1][X1[i]];T1.removeSelectOption(X1[i]);}}if(W1===e.semanticObject){var a2=e.semanticAttributesOfSemanticObjects[""];for(var j=0,_1=Z1.length;j<_1;j++){T1.removeParameter(Z1[j]);if(!(Z1[j]in a2)){var b2=e.semanticAttributesOfSemanticObjects[e.semanticObject][Z1[j]];b2=(typeof b2==="undefined"||b2===null)?"":String(b2);T1.addParameter(Z1[j],b2);}}T1=y.mixAttributesAndSelectionVariant(e.semanticAttributesOfSemanticObjects[W1],T1.toJSONString());U1=T1.toJSONString();}}delete e.semanticAttributes;y.processBeforeSmartLinkPopoverOpens(e,U1);}function x1(e,j){var k=function(X1){for(var i=0;i<X1.length;i++){j(X1[i].name);}};var T1=w.getView().getModel().getMetaModel();var U1=T1.getODataEntitySet(e,false);var V1=T1.getODataEntityType(U1.entityType,false);k(V1.key.propertyRef);var W1=S.oDraftController.getDraftContext();if(W1.isDraftEnabled(e)){k(W1.getSemanticKey(e));j("IsActiveEntity");j("HasDraftEntity");j("HasActiveEntity");}}function y1(e,i){if(!x.isDraftEnabled()||!e){return;}var j=e.getControlByKey("EditState");var k=j&&j.getSelectedKey()||"";switch(k){case"1":i.filters.push(new F("IsActiveEntity","EQ",true));i.filters.push(new F("HasDraftEntity","EQ",false));break;case"2":i.filters.push(new F("IsActiveEntity","EQ",false));break;case"3":i.filters.push(new F("IsActiveEntity","EQ",true));i.filters.push(new F("SiblingEntity/IsActiveEntity","EQ",null));i.filters.push(new F("DraftAdministrativeData/InProcessByUser","NE",""));break;case"4":i.filters.push(new F("IsActiveEntity","EQ",true));i.filters.push(new F("SiblingEntity/IsActiveEntity","EQ",null));i.filters.push(new F("DraftAdministrativeData/InProcessByUser","EQ",""));break;default:var T1=new F({filters:[new F("IsActiveEntity","EQ",false),new F("SiblingEntity/IsActiveEntity","EQ",null)],and:false});if(i.filters[0]&&i.filters[0].aFilters){var U1=i.filters[0];i.filters[0]=new F([U1,T1],true);}else{i.filters.push(T1);}break;}}function z1(e,i){if(i){e.filters.push(new F("IsActiveEntity","EQ",true));}else{var j=new F({filters:[new F("IsActiveEntity","EQ",false),new F("SiblingEntity/IsActiveEntity","EQ",null)],and:false});if(e.filters[0]&&e.filters[0].aFilters){var k=e.filters[0];e.filters[0]=new F([k,j],true);}else{e.filters.push(j);}}}function A1(i,j,k,T1,U1){if(T1&&k&&k.getAnalyticBindingPath&&k.getConsiderAnalyticalParameters()){try{var V1=k.getAnalyticBindingPath();var W1=i.getEntitySet();var X1=i.getModel();var Y1=X1.getMetaModel();var Z1=Y1.getODataEntitySet(W1);var $1=new d(w);var _1=$1.getParametersByEntitySet(W1);if(j){var V1=j(Z1,_1);}if(V1){T1(V1);}}catch(e){c.warning("Mandatory parameters have no values","",U1);}}}function B1(e,j,k){for(var i=0;i<j.length;i++){var T1=j[i];var U1=T1.lastIndexOf("/");var V1;if(U1<0){if(S.oApplication.getNavigationProperty(e,T1)){V1=T1;}else{continue;}}else{V1=T1.substring(0,U1);}if(k.indexOf(V1)===-1){k.push(V1);}}}function C1(e,i,j){var k=e.getParameter("bindingParams"),T1=e.getSource().getId();k.parameters=k.parameters||{};var U1=x.getTemplatePrivateModel();var V1=U1.getProperty("/listReport/vDraftState");var W1=U1.getProperty("/listReport/activeObjectEnabled");var X1=function(c2,d2,T1){if(i&&i[c2]){var e2=true;var f2=function(){var g2=arguments[0];if(!(g2 instanceof C)){throw new Error("Please provide a valid ControllerExtension in order to execute extension "+c2);}if(!e2){throw new Error("Extension "+c2+" must be executed synchronously");}var h2=Array.prototype.slice.call(arguments,1);d2.apply(null,h2);};i[c2](f2,T1);e2=false;}};var Y1=function(c2){if(!T1||w.byId(T1)===e.getSource()){k.filters.push(c2);}};if((w.getMetadata().getName()!=='sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage')||(w.getMetadata().getName()!=='sap.suite.ui.generic.template.ObjectPage.view.Details')){if(V1=="0"&&x.isDraftEnabled()){z1(k,W1);}else{y1(j,k);}}X1("addExtensionFilters",Y1,T1);var Z1=e.getSource();if(w.getMetadata().getName()!=='sap.suite.ui.generic.template.ObjectPage.view.Details'){A1(Z1,i.resolveParamaterizedEntitySet,j,i.setBindingPath,i.isAnalyticalListPage?"AnalyticalListPage":"ListReport");}var $1=Z1.getEntitySet();var _1=k.parameters.select&&k.parameters.select.split(",")||[];var a2=k.parameters.expand&&k.parameters.expand.split(",")||[];var b2=function(c2,T1){if(c2&&(!T1||w.byId(T1)===e.getSource())){var d2=c2.split(',');d2.forEach(function(e2){if(e2&&_1.indexOf(e2)===-1){_1.push(e2);}});}};if(!i.isAnalyticalListPage){x1($1,b2);}X1("ensureExtensionFields",b2,T1);(i.addNecessaryFields||Function.prototype)(_1,b2,$1);B1($1,_1,a2);if(a2.length>0){k.parameters.expand=a2.join(",");}if(_1.length>0){k.parameters.select=_1.join(",");}}function D1(e,i,j){if(!e){return V("DRAFT_OBJECT");}else if(i){return V(j?"LOCKED_OBJECT":"UNSAVED_CHANGES");}else{return"";}}function E1(){var e=T("sap.suite.ui.generic.template.fragments.DraftAdminDataPopover",{formatText:function(){var i=Array.prototype.slice.call(arguments,1);var k=arguments[0];if(!k){return"";}if(i.length>0&&(i[0]===null||i[0]===undefined||i[0]==="")){if(i.length>3&&(i[3]===null||i[3]===undefined||i[3]==="")){return(i.length>2&&(i[1]===null||i[1]===undefined||i[1]===""))?"":i[2];}else{return V(k,i[3]);}}else{return V(k,i[0]);}},closeDraftAdminPopover:function(){e.close();},formatDraftLockText:D1},"admin");return e;}function F1(e){var i={};if(e){i.discardPromise=e;}var j=w.getView();var k=j.getModel();if(k.hasPendingChanges()){j.setBindingContext(null);k.resetChanges();j.setBindingContext();}x.fire(w,"AfterCancel",{});}function G1(e,i,j,k,T1){var U1=S.oApplication.getBusyHelper();if(!T1&&U1.isBusy()){return;}if(!x.isDraftEnabled()){var V1=false;if(j&&j.aUnsavedDataCheckFunctions){V1=j.aUnsavedDataCheckFunctions.some(function(Z1){return Z1();});}var W1=w.getView();var X1=W1.getModel();if(V1||X1.hasPendingChanges()){var Y1;L1(function(){F1();Y1=e();},function(){Y1=i();},k,false);return Y1;}}return e();}function H1(e,i,j,k){var T1=false;if(j&&j.aUnsavedDataCheckFunctions){T1=j.aUnsavedDataCheckFunctions.some(function(V1){return V1();});}if(T1||w.getView().getModel().hasPendingChanges()){var U1;L1(function(){w.getView().getModel().resetChanges();x.fire(w,"AfterCancel",{});U1=e();},function(){U1=i();},k,true);return U1;}return e();}function I1(e,i,j,k,T1){if(T1){return G1(e,i,j,k,true);}S.oApplication.performAfterSideEffectExecution(G1.bind(null,e,i,j,k,false));}var J1;var K1;function L1(e,i,j,k){var T1;J1=e;K1=i;var U1=k?"sap.suite.ui.generic.template.fragments.DataLossTechnicalError":"sap.suite.ui.generic.template.fragments.DataLoss";var V1=T(U1,{onDataLossOK:function(){V1.close();J1();},onDataLossCancel:function(){V1.close();K1();}},"dataLoss");j=j||"LeavePage";T1=V1.getModel("dataLoss");T1.setProperty("/mode",j);V1.open();}function M1(e,i,j,k,T1,U1){if(i.busy.check&&k.isBusy()){U1();return;}var V1=i.busy.set?function(){k.setBusy(Promise.resolve(),false,{actionLabel:i.sActionLabel});return e();}:e;var W1=i.mConsiderObjectsAsDeleted?function(Y1){S.oApplication.prepareDeletion(i.mConsiderObjectsAsDeleted);return V1();}:V1;var X1=(i.dataloss.popup?I1(W1,U1,j,(i.dataloss.navigation?"LeavePage":"Proceed"),true):W1());if(X1 instanceof Promise){X1.then(T1,U1);}else{T1();}}function N1(e,i,j){i=g({busy:{set:true,check:true},dataloss:{popup:true,navigation:false}},i);var k=S.oApplication.getBusyHelper();var T1=new Promise(function(U1,V1){S.oApplication.performAfterSideEffectExecution(M1.bind(null,e,i,j,k,U1,V1));});if(i.busy.set){k.setBusy(T1,false,{actionLabel:i.sActionLabel});}return T1;}function O1(){y=y||new N(w);return y;}function P1(e){var i=e.getId()+"-variant";return sap.ui.getCore().byId(i).getDefaultVariantKey();}function Q1(e){var i=e.getId()+"-variant";return sap.ui.getCore().byId(i).getDefaultVariantKey();}function R1(e){var j;var k=x.getTemplatePrivateModel();var T1=w.getOwnerComponent();var U1,V1,W1,X1,Y1,Z1=[],$1=[],i,_1,a2,b2,c2,d2,e2;var f2,g2;U1=T1.getAppComponent();V1=sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService&&sap.ushell.Container.getService("CrossApplicationNavigation");W1=k.getProperty("/generic/supportedIntents/");if(n(e)){j=e.getToolbar();}else if(m(e)){j=e.getCustomToolbar();}X1=j.getContent();Y1=X1.length;for(i=0;i<Y1;i++){_1=Z(X1[i]);if(_1.hasOwnProperty("SemanticObject")&&_1.hasOwnProperty("Action")){a2=_1.SemanticObject;b2=_1.Action;c2={semanticObject:a2,action:b2,ui5Component:U1};Z1.push([c2]);d2=f({},c2);d2.bLinkIsSupported=false;$1.push(d2);}}if(Z1.length>0&&V1){e2=V1.getLinks(Z1);e2.done(function(h2){W1=k.getProperty("/generic/supportedIntents/");f2=h2.length;for(i=0;i<f2;i++){if(h2[i][0].length>0){$1[i].bLinkIsSupported=true;}a2=$1[i].semanticObject;b2=$1[i].action;g2=k.getProperty("/generic/supportedIntents/"+a2);if(!g2){W1[a2]={};W1[a2][b2]={"visible":$1[i].bLinkIsSupported};}else if(!g2[b2]){g2[b2]={"visible":$1[i].bLinkIsSupported};}else{g2[b2]["visible"]=$1[i].bLinkIsSupported;}}k.updateBindings();});}}function S1(e,i){var j=i&&w.byId(i);var k=(i&&!j)?Promise.reject():new Promise(function(T1,U1){S.oApplication.performAfterSideEffectExecution(function(){var V1=S.oApplication.getBusyHelper();if(V1.isBusy()){U1();return;}if(j&&(!j.getVisible()||(j.getEnabled&&!j.getEnabled()))){U1();return;}var k=j?e(j):e();if(k instanceof Promise){k.then(T1,U1);V1.setBusy(k);}else{T1(k);}});});k.catch(Function.prototype);return k;}var O1=t.testable(O1,"getNavigationHandler");var f1=t.testable(f1,"fillEnabledMapForBreakoutActions");var h1=t.testable(h1,"getBreakoutActionIds");var k1=t.testable(k1,"getOwnerControl");var Y=t.testable(Y,"getSelectedContexts");var G=t.testable(G,"fnGetToolbarCutomData");return{isSmartTable:m,isSmartChart:n,isUiTable:p,isAnalyticalTable:q,isTreeTable:r,isMTable:s,getPositionableControlId:Q,getMetaModelEntityType:A,getText:V,getContextText:W,getNavigationHandler:O1,getNavigationKeyProperties:u1,mergeNavigationKeyPropertiesWithValues:v1,executeGlobalSideEffect:function(){if(x.isDraftEnabled()){var e=w.getView();var i=w.getOwnerComponent();var j=i.getAppComponent();var k=j.getForceGlobalRefresh();var T1=i.getModel("ui");e.attachBrowserEvent("keydown",function(U1){var V1=U1.target.type==="search";var W1=U1.target.type==="textarea";var X1=U1.target.id.indexOf("rowAction")>-1;var Y1=U1.target.id.indexOf("ColumnListItem")>-1;if(U1.keyCode===13&&U1.ctrlKey!==true&&T1.getProperty("/editable")&&!V1&&!W1&&!X1&&!Y1){S.oApplication.addSideEffectPromise(new Promise(function(Z1){setTimeout(function(){var $1=S.oApplicationController.executeSideEffects(e.getBindingContext(),null,null,k);$1.then(function(){Z1();setTimeout(function(){var _1=document.getElementById(U1.target.id);if(_1){_1.focus();}});});});}));}});}},setEnabledToolbarButtons:$,setEnabledFooterButtons:a1,fillEnabledMapForBreakoutActions:f1,getBreakoutActions:j1,getSelectedContexts:Y,getSelectionPoints:X,getDeleteRestrictions:e1,getSmartTableDefaultVariant:P1,getSmartChartDefaultVariant:Q1,setPrivateModelControlProperty:b1,navigateFromListItem:q1,navigateToContext:r1,navigateExternal:t1,semanticObjectLinkNavigation:w1,getCustomData:function(e){var j=e.getSource().getCustomData();var k={};for(var i=0;i<j.length;i++){k[j[i].getKey()]=j[i].getValue();}return k;},getCustomDataText:function(e){return new Promise(function(j,k){e.getCustomData().forEach(function(T1){var U1=T1.getKey();if(U1==="text"){var V1=T1.getBinding("value");var W1=!V1&&T1.getBindingInfo("value");if(!V1&&!W1){j(T1.getValue());return;}var X1=function(Y1){j(Y1.getSource().getExternalValue());return;};if(V1){V1.attachChangeOnce(X1);}else{W1.events={change:X1};for(var i=0;i<W1.parts.length;i++){W1.parts[i].targetType="string";}}}});});},onBeforeRebindTableOrChart:C1,formatDraftLockText:D1,resetChangesAndFireCancelEvent:F1,showDraftPopover:function(e,i){var j=E1();var k=j.getModel("admin");k.setProperty("/IsActiveEntity",e.getProperty("IsActiveEntity"));k.setProperty("/HasDraftEntity",e.getProperty("HasDraftEntity"));j.bindElement({path:e.getPath()+"/DraftAdministrativeData"});if(j.getBindingContext()){j.openBy(i);}else{j.getObjectBinding().attachDataReceived(function(){j.openBy(i);});}},getContentDensityClass:function(){return S.oApplication.getContentDensityClass();},attachControlToView:I,getDialogFragment:T,processDataLossConfirmationIfNonDraft:I1,processDataLossTechnicalErrorConfirmation:H1,securedExecution:N1,getOwnerControl:k1,getTableBindingInfo:l1,refreshSmartTable:m1,refreshModel:n1,getElementCustomData:Z,triggerAction:function(e,i,j,k,T1){I1(function(){S.oCRUDManager.callAction({functionImportPath:j.Action,contexts:e,sourceControl:k,label:j.Label,operationGrouping:""}).then(function(U1){if(U1&&U1.length>0){var V1=U1[0];if(V1.response&&V1.response.context&&(!V1.actionContext||V1.actionContext&&V1.response.context.getPath()!==V1.actionContext.getPath())){S.oApplication.getBusyHelper().getUnbusy().then(S.oViewDependencyHelper.setMeToDirty.bind(null,w.getOwnerComponent(),i));}}});},Function.prototype,T1,"Proceed");},checkToolbarIntentsSupported:R1,executeIfControlReady:S1,getControlInformation:D,executeForAllInformationObjects:H,focusControl:u};}return B.extend("sap.suite.ui.generic.template.lib.CommonUtils",{constructor:function(e,S,i){f(this,v(e,S,i));}});});