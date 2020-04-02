/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/thirdparty/jquery","./library","sap/m/Label","sap/rules/ui/RuleBase","sap/m/Panel","sap/ui/core/Title","sap/ui/layout/form/Form","sap/m/Toolbar","sap/m/ToolbarSpacer","sap/m/Text","sap/m/Button","sap/ui/layout/Grid","sap/ui/layout/form/FormContainer","sap/ui/layout/form/FormElement","sap/rules/ui/ExpressionAdvanced","sap/m/Link","sap/m/FlexBox","sap/m/Dialog","sap/rules/ui/TextRuleSettings","sap/rules/ui/oldast/lib/AstYamlConverter","sap/rules/ui/Constants","sap/rules/ui/AstExpressionBasic","sap/rules/ui/services/ExpressionLanguage","sap/rules/ui/services/AstExpressionLanguage"],function(q,l,L,R,P,T,F,a,b,c,B,G,d,f,E,g,h,D,k,A,C,m,n,o){"use strict";var p=R.extend("sap.rules.ui.TextRule",{metadata:{properties:{enableSettings:{type:"boolean",group:"Misc",defaultValue:false},enableElse:{type:"boolean",defaultValue:true},enableElseIf:{type:"boolean",defaultValue:true}},aggregations:{"_toolbar":{type:"sap.m.Toolbar",multiple:false,singularName:"_toolbar"},"_verticalLayout":{type:"sap.ui.core.Control",multiple:false,visibility:"visible",singularName:"_verticalLayout"}}},_addConditionBlock:function(e,t){var i=this;var j=this._getModel();var s=e.getSource();var r=s.getParent();if(t===this.typeElseIf&&!(r instanceof P)){r=s.getParent().getParent();}var v=r.getParent();var u=v.indexOfContent(r);var w=this._internalModel.getProperty("/ruleId");var x=this._internalModel.getProperty("/ruleVersion");var y=u+1;var z=false;var H;var K;var I={RuleId:w,RuleVersion:x};if(t===i.typeElse){K="/TextRuleDefaultBranches";z=true;}else{K="/TextRuleBranches";if(s.getParent()instanceof P){H=y;z=true;}else{H=y+1;}I.Sequence=H;}this._updateBusyState(true);var J={};J.properties=I;J.success=function(M){var N={};N.verticalLayout=v;N.nIndex=u;N.bfirst=z;i._addConditionSuccess(M,i,N);if(z){s.destroy();}};J.error=function(){q.sap.log.info("Error creating "+K+"entity");};j.createEntry(K,J);},_addConditionSuccess:function(e,t,i){var N;var j;var s=e.Id;var r=t._getModel();var H={RuleId:e.RuleId,Id:s,RuleVersion:e.RuleVersion};var u=r.createKey("/TextRuleConditions",H);var v=new sap.ui.model.Context(r,u);var w="TextRuleResultExpressions";if(this.getAstExpressionLanguage()){w="TextRuleResultExpressions/TextRuleResultExpressionASTs,TextRuleConditionASTs"}r.read(u,{urlParameters:{"$expand":w},success:function(x){var V=i.verticalLayout;t.getModel("displayModel").getProperty("/textRuleConditions").push(x);t.getModel("displayModel").setProperty("/bCancelButtonVisible("+x.Id+")",x.TextRuleResultExpressions.results.length>1);if(x.Type===t.typeElse){t.getModel("displayModel").getProperty("/textRuleConditions/Else").push(x);var y=t._createElseFormLayout(v,t.oBundle.getText("titleElse"),true);V.removeContent(i.nIndex);V.insertContent(y,i.nIndex);}else if(x.Type===t.typeElseIf){t.getModel("displayModel").getProperty("/textRuleConditions/ElseIf").push(x);if(i.bfirst){j=i.nIndex;V.removeContent(i.nIndex);}else{j=i.nIndex+1;}N=" ("+j+")";var z=t._createFormLayout(v,t.oBundle.getText("titleElseIf")+N,true);V.insertContent(z,j);t._adjustElseIfTitle(i.verticalLayout,j,true);}t._updateBusyState(false);},error:function(){q.sap.log.info("Error reading TextRuleResultExpressions");}});},_adjustElseIfTitle:function(v,e,i){var j=v.getContent();var s=this.oBundle.getText("titleElseIf");var r;if(i){r=e+1;}else{r=e;}for(;r<j.length;r++){var t=j[r];if(t.getHeaderText().indexOf(s)>-1&&t.getHeaderToolbar()){t.getHeaderToolbar().getContent()[0].setText(s+" ("+r+")");}}},_addToolBar:function(){var t=new a({design:"Transparent",enabled:"{TextRuleModel>/editable}"});var e=new sap.m.Title({text:this.oBundle.getText("textRule")});var s=new B({text:"",press:this._openTextRuleSettings.bind(this),visible:{parts:[{path:"TextRuleModel>/enableSettings"},{path:"TextRuleModel>/editable"}],formatter:this._decideSettingsEnablement},enabled:{parts:[{path:"TextRuleModel>/enableSettings"},{path:"TextRuleModel>/editable"}],formatter:this._decideSettingsEnablement}}).setTooltip(this.oBundle.getText("settings"));s.setIcon("sap-icon://action-settings");t.addContent(e);t.addContent(new b({}));t.addContent(s);t.addContent(new b({width:"1em"}));this.setAggregation("_toolbar",t,true);},_addTextRuleControl:function(){this.verticalLayout=new sap.ui.layout.VerticalLayout({width:"100%"});this.setAggregation("_verticalLayout",this.verticalLayout,true);},_bindRule:function(){var t=this;var M=this._getModel();var s=[this._getBindModelName(),this.getBindingContextPath()].join("");if(s&&M){M.setDeferredGroups(["read"]);M.read(s,{groupId:"read",urlParameters:{"$expand":"TextRule"}});var e=[s,"/TextRule/TextRuleResults"].join("");var i={groupId:"read"};if(this.getAstExpressionLanguage()){i.urlParameters={"$expand":"TextRuleResultASTs"};}M.read(e,i);var j="TextRuleResultExpressions";if(this.getAstExpressionLanguage()){j="TextRuleResultExpressions/TextRuleResultExpressionASTs,TextRuleConditionASTs"}e=[s,"/TextRule/TextRuleConditions"].join("");M.read(e,{groupId:"read",urlParameters:{"$expand":j}});M.submitChanges({groupId:"read",success:function(r){t._handleVerticalLayoutDataReceived(r);},error:function(){q.sap.log.info("Error reading TextRule data from backend");}});}},_bindVerticalLayout:function(){var I=this._getIfPanel();this.verticalLayout.addContent(I);if(this.getEnableElseIf()===true){var e=this._getElseIfPanel();for(var i=0;i<e.length;i++){this.verticalLayout.addContent(e[i]);}}if(this.getEnableElse()===true){var j=this._getElsePanel();this.verticalLayout.addContent(j[0]);}},_createFormLayout:function(e,t,i){var j=this;var r=new P({expandable:true,expanded:i,headerText:t,height:"100%",backgroundDesign:"Translucent",content:[new F({editable:true,layout:new sap.ui.layout.form.ResponsiveGridLayout({labelSpanXL:2,labelSpanL:2,labelSpanM:2,labelSpanS:12,adjustLabelSpan:false,emptySpanXL:4,emptySpanL:4,emptySpanM:4,emptySpanS:4,columnsL:1,columnsM:1}),formContainers:[j._createIfBlockFormContainer(e,t),]}),new F({editable:true,layout:new sap.ui.layout.form.ResponsiveGridLayout({labelSpanXL:2,labelSpanL:2,labelSpanM:2,labelSpanS:12,adjustLabelSpan:false,emptySpanXL:3,emptySpanL:3,emptySpanM:3,emptySpanS:3,columnsL:1,columnsM:1}),formContainers:[j._createThenFormContainer(e,this.oBundle.getText("then"))]})]}).addStyleClass("sapTextRulePanel");if(t===this.typeIf){r.setHeaderText(t);}else{var s=new a({design:"Transparent"});var u=new sap.m.Title({text:t});var v=new B({visible:{parts:[{path:"TextRuleModel>/enableSettings"},{path:"TextRuleModel>/editable"}],formatter:this._decideSettingsEnablement},text:this.oBundle.getText("addButton"),tooltip:this.oBundle.getText("addNewElseIf"),press:function(x){j._addConditionBlock(x,j.typeElseIf);}}).setBindingContext(e);var w=new B({text:this.oBundle.getText("deleteButton"),tooltip:this.oBundle.getText("deleteElseIf"),visible:{parts:[{path:"TextRuleModel>/enableSettings"},{path:"TextRuleModel>/editable"}],formatter:this._decideSettingsEnablement},press:function(x){j._deleteConditionBlock(x);}}).setBindingContext(e);s.addContent(u);s.addContent(new b());s.addContent(v);s.addContent(new b({width:"0.5px"}));s.addContent(w);r.setHeaderToolbar(s);}return r;},_createElseFormLayout:function(e,t,i){var j=this;var r=new a({design:"Transparent"});var s=new sap.m.Title({text:t});var u=new B({text:this.oBundle.getText("deleteButton"),tooltip:this.oBundle.getText("deleteElse"),visible:{parts:[{path:"TextRuleModel>/enableSettings"},{path:"TextRuleModel>/editable"}],formatter:this._decideSettingsEnablement},press:function(w){j._deleteConditionBlock(w);}}).setBindingContext(e);r.addContent(s);r.addContent(new b());r.addContent(u);var v=new P({expandable:true,expanded:i,height:"100%",backgroundDesign:"Translucent",content:new F({editable:true,layout:new sap.ui.layout.form.ResponsiveGridLayout({labelSpanXL:2,labelSpanL:2,labelSpanM:2,labelSpanS:12,adjustLabelSpan:false,emptySpanXL:3,emptySpanL:3,emptySpanM:3,emptySpanS:3,columnsL:1,columnsM:1}),formContainers:[this._createThenFormContainer(e,t)]})}).addStyleClass("sapTextRulePanel");v.setHeaderToolbar(r);return v;},_createIfBlockFormContainer:function(e,t){var i=e?e.getProperty("Expression"):"";var j=true;var r=new d({formElements:[new f({label:new L({text:""}),fields:[this._getExpressionAdvancedText(e,i,undefined,undefined,j)]})]});return r;},_createThenFormContainer:function(e,t){var r=new d({visible:false});if(e.getProperty("Type")!==this.typeElse){var s=new a({content:[new b({width:"2em"}),new L({text:t}).addStyleClass("sapTextRuleFontSize")]});r.setToolbar(s);}var u=e.getProperty("Id");var v=this.getModel("displayModel").getProperty("/textRuleConditions");for(var i=0;i<v.length;i++){if(u===v[i].Id){var w=v[i].TextRuleResultExpressions.results;if(w){for(var j=0;j<w.length;j++){var H={RuleId:w[j].RuleId,ConditionId:w[j].ConditionId,ResultId:w[j].ResultId,RuleVersion:w[j].RuleVersion};var x=this._getModel().createKey("/TextRuleResultExpressions",H);var y=new sap.ui.model.Context(this._getModel(),x);var z=w[j].BusinessDataType;if(this.getExpressionLanguage()){if(z===C.DATE_BUSINESS_TYPE||z===C.TIMESTAMP_BUSINESS_TYPE||z===C.NUMBER||z===C.STRING||z===C.BOOLEAN_BUSINESS_TYPE||z===C.BOOLEAN_ENHANCED_BUSINESS_TYPE){r.addFormElement(this._formElementsFactory(t+"result"+j,y));}}else{r.addFormElement(this._formElementsFactory(t+"result"+j,y));}}}}}var I=r.getFormElements();for(var J in I){if(I[J].getVisible()){r.setVisible(true);break;}}return r;},_createTextRuleSettings:function(){var M=this._getModel();var e=this.getBindingContext();var t=new k({newTextRule:this._internalModel.getProperty("/newTextRule")});if(this.getAstExpressionLanguage()){t.setAstExpressionLanguage(this.getAstExpressionLanguage());}else{t.setExpressionLanguage(this.getExpressionLanguage());}var s=JSON.stringify(this._settingsModel.getData());var i=JSON.parse(s);var j=new sap.ui.model.json.JSONModel(i);t.setModel(j);t.setModel(this._internalModel,"TextRuleModel");t.setModel(M,"oDataModel");t.setBindingContext(e,"dummy");return t;},_decideSettingsEnablement:function(e,i){return e&&i;},_deleteConditionBlock:function(e){var t=this;var i=this._getModel();var s=e.getSource();var j=s.getParent().getParent();var v=j.getParent();var r=v.indexOfContent(j);var u=s.getBindingContext();var w=u.getProperty("Id");var x=u.getProperty("Type");var K;if(x===t.typeElse){K="/TextRuleDefaultBranches";}else if(x===t.typeElseIf){K="/TextRuleBranches";}var H={RuleId:u.getProperty("RuleId"),Id:w,RuleVersion:u.getProperty("RuleVersion")};var y=i.createKey(K,H);var _=function(){var j;v.removeContent(r);if(x===t.typeElse){t.getModel("displayModel").setProperty("/textRuleConditions/Else",[]);j=t._getElsePanel();v.insertContent(j[0],r);}else{if(r===1&&v.getContent().length<=2){t.getModel("displayModel").setProperty("/textRuleConditions/ElseIf",[]);j=t._getElseIfPanel();v.insertContent(j[0],r);}else{var z=t.getModel("displayModel").getProperty("/textRuleConditions/ElseIf");for(var I in z){if(z[I].Id===w){z.splice(I,1);t.getModel("displayModel").setProperty("/textRuleConditions/ElseIf",z);break;}}}t._adjustElseIfTitle(v,r,false);}t._updateBusyState(false);};this._updateBusyState(true);i.remove(y,{success:function(z){_();},error:function(){q.sap.log.info("Error deleting "+K+"entity");}});},_formRuleData:function(e,i){var j=this.getBindingContextPath();var r=j.split("/")[2];var s=e.getProperty("RuleId");var v=e.getProperty("Version");var t=q.extend({},this.getModel().oData);t=t[r];if(!t){t={};}if(!t.DecisionTable){t.DecisionTable={};}t.Type="DT";t.DecisionTable.metadata={};t.DecisionTable.RuleID=s;t.DecisionTable.version=v;t.DecisionTable.HitPolicy="FM";t.DecisionTable.DecisionTableColumns={};t.DecisionTable.DecisionTableColumns.results=[];t.DecisionTable.DecisionTableColumns.results.push({"metadata":{},"RuleId":s,"Id":1,"Version":v,"Sequence":1,"Type":"CONDITION","Condition":{"metadata":{},"RuleId":s,"Id":1,"Version":v,"Expression":i,"Description":null,"ValueOnly":false,"FixedOperator":null},"Result":null});t.DecisionTable.DecisionTableRows={};t.DecisionTable.DecisionTableRows.results=[];t.DecisionTable.DecisionTableColumnsCondition={};t.DecisionTable.DecisionTableColumnsCondition.results=[];t.DecisionTable.DecisionTableColumnsResult={};t.DecisionTable.DecisionTableColumnsResult.results=[];return t;},_addTextRuleResultExpression:function(e){var t=this;var j=this._getModel();var s=e.getSource();var r=s.getParent();var u=r.getParent();var v=u.getParent().indexOfFormElement(u)+1;var w=this._internalModel.getProperty("/ruleId");var x=this._internalModel.getProperty("/ruleVersion");var y=v+1;var z=null;if(e&&e.oSource&&e.oSource.getBindingContext()&&e.oSource.getBindingContext().getModel()&&e.oSource.getBindingContext().getPath()&&e.oSource.getBindingContext().getModel().getProperty(e.oSource.getBindingContext().getPath())){z=e.oSource.getBindingContext().getModel().getProperty(e.oSource.getBindingContext().getPath()).ConditionId;}var K="/TextRuleResultExpressions";var H={RuleId:w,RuleVersion:x,ConditionId:z,Sequence:y,};var I={};I.properties=H;I.success=function(J){var M={RuleId:J.RuleId,ConditionId:J.ConditionId,ResultId:J.ResultId,RuleVersion:J.RuleVersion};var N=t._getModel().createKey("/TextRuleResultExpressions",M);var O=new sap.ui.model.Context(t._getModel(),N);var Q=t.getModel("displayModel").getProperty("/textRuleConditions");for(var i=0;i<Q.length;i++){if(z===Q[i].Id&&Q[i].TextRuleResultExpressions){var S=Q[i].TextRuleResultExpressions.results;if(S&&O){S.push(O.getModel().getProperty(O.getPath()));t.getModel("displayModel").setProperty("/bCancelButtonVisible("+z+")",S.length>1);}u.getParent().insertFormElement(t._formElementsFactory(t.oBundle.getText("then")+"result"+v,O),v);break;}}};I.error=function(){q.sap.log.info(t.oBundle.getText("errorCreating")+K+t.oBundle.getText("entity"));};j.createEntry(K,I);},_deleteTextRuleResultExpression:function(e){var t=this;var j=this._getModel();var s=e.getSource();var r=s.getParent();var u=r.getParent();var v=u.getParent().indexOfFormElement(u);var w=this._internalModel.getProperty("/ruleId");var x=this._internalModel.getProperty("/ruleVersion");var y=s.getBindingContext();var z=y.getProperty("ConditionId");var H=y.getProperty("ResultId");var K="/TextRuleResultExpressions";var I={RuleId:w,RuleVersion:x,ConditionId:z,ResultId:H,};var J=j.createKey(K,I);j.remove(J,{success:function(M){var N=t.getModel("displayModel").getProperty("/textRuleConditions");for(var i=0;i<N.length;i++){if(z===N[i].Id&&N[i].TextRuleResultExpressions){var O=N[i].TextRuleResultExpressions.results;if(O){for(var Q in O){if(O[Q].ResultId===H){O.splice(Q,1);}}}t.getModel("displayModel").setProperty("/bCancelButtonVisible("+z+")",O.length>1);u.getParent().removeFormElement(v);break;}}},error:function(){q.sap.log.info(t.oBundle.getText("errorDeleting")+sKeytext+t.oBundle.getText("entity"));}});},_decideCancelButtonEnablement:function(e,O,i){return e&&!O&&i==="2.0"?true:false;},_formElementsFactory:function(i,e){var t=this;var r=e.getProperty("ResultId"),j=e.getProperty("RuleId"),v=e.getProperty("RuleVersion"),s=e.getProperty("ConditionId"),V=true;var H={RuleId:j,Id:r,RuleVersion:v};if(this.getAstExpressionLanguage()){this._internalModel.setProperty("/expressionLanguageVersion","2.0");}else{this._internalModel.setProperty("/expressionLanguageVersion","1.0");}var u=e.getProperty("Expression");var w=e.getModel().createKey("/TextRuleResults",H);this._internalModel.getProperty("/textRuleResultExpressions").push(e.getModel().getProperty(e.getPath()));var x=e.getModel().getProperty(w+"/BusinessDataType");var y=e.getModel().getProperty(w+"/DataObjectAttributeName");var z=e.getModel().getProperty(w+"/DataObjectAttributeLabel");var I=z?z:y;var J=e.getModel().getProperty(w+"/AccessMode");var K=e.getModel().getProperty(w+"/DataObjectAttributeId");if(J===C.EDITABLE){V=true;}else if(J===C.HIDDEN){V=false;}var M=this._getExpressionAdvancedText(e,u,x,K,false);var N=M.getId();var O=new f({visible:V,label:new L({text:I,tooltip:I,labelFor:N}),fields:[M,new sap.ui.layout.HorizontalLayout({layoutData:new sap.ui.layout.GridData({span:"L1 M1 S1"}),content:[new sap.m.Button({enabled:"{TextRuleModel>/editable}",type:sap.m.ButtonType.Transparent,icon:sap.ui.core.IconPool.getIconURI("sys-cancel"),visible:{parts:[{path:"displayModel>/bCancelButtonVisible("+s+")"},{path:"TextRuleModel>/resultDataObjectId"},{path:"TextRuleModel>/expressionLanguageVersion"}],formatter:this._decideCancelButtonEnablement},press:function(Q){t._deleteTextRuleResultExpression(Q);}.bind(this)}).setTooltip(this.oBundle.getText("removeColumn")),new sap.m.Button({enabled:"{TextRuleModel>/editable}",type:sap.m.ButtonType.Transparent,icon:sap.ui.core.IconPool.getIconURI("add"),visible:t.bOperationsContext,press:function(Q){t._addTextRuleResultExpression(Q);}.bind(this)}).setTooltip(this.oBundle.getText("addColumn"))]})]}).setBindingContext(e);return O;},_getBindModelName:function(){var e="";var i=this.getModelName();if(i){e=i+">";}return e;},_getBlankContent:function(){var e=new L({text:this.oBundle.getText("startTextRule")});var s=new c();s.setText("\u00a0");var i=new g({enabled:{parts:[{path:"TextRuleModel>/enableSettings"},{path:"TextRuleModel>/editable"}],formatter:this._decideSettingsEnablement},text:" "+this.oBundle.getText("settings"),press:[this._openTextRuleSettings,this]}).addStyleClass("sapTextRuleLink");var j=new h({justifyContent:"Center",items:[e,s,i],visible:{parts:[{path:"TextRuleModel>/enableSettings"},{path:"TextRuleModel>/editable"}],formatter:this._decideSettingsEnablement}}).addStyleClass("sapUiMediumMargin");return j;},_getConvertedExpression:function(e,i,j){var r=sap.ui.getCore().byId(this.getExpressionLanguage());var s=this._formRuleData(j,e);var t;if(i){t=r.convertRuleToCodeValues(s);}else{t=r.convertRuleToDisplayValues(s);}s.Type="TextRule";return t;},_getDataLoadedPromise:function(){if(!this._dataLoaded){this._setDataLoadedPromise();}return this._dataLoaded.promise();},_getElseButton:function(){var t=this;this.oElseButton=new sap.m.Button({id:"_elseButton",text:this.oBundle.getText("addElse"),tooltip:this.oBundle.getText("addElse"),enabled:"{TextRuleModel>/editable}",press:function(e){t._addConditionBlock(e,t.typeElse);}});return this.oElseButton;},_getElseIfButton:function(){var t=this;this.oElseIfButton=new sap.m.Button({id:"_elseIfButton",text:this.oBundle.getText("addElseIf"),tooltip:this.oBundle.getText("addElseIf"),enabled:"{TextRuleModel>/editable}",press:function(e){t._addConditionBlock(e,t.typeElseIf);}});return this.oElseIfButton;},_getElseIfPanel:function(){var t=this.oBundle.getText("titleElseIf");var e=[];var j=this._displayModel.getProperty("/textRuleConditions/ElseIf");if(j.length>0){for(var i=0;i<j.length;i++){var H={RuleId:j[i].RuleId,Id:j[i].Id,RuleVersion:j[i].RuleVersion};var s=this._getModel().createKey("/TextRuleConditions",H);var r=new sap.ui.model.Context(this._getModel(),s);var u=i+1;var N=" ("+u+")";e.push(this._createFormLayout(r,t+N,false));}}else{var v=new P({headerText:t,visible:{parts:[{path:"TextRuleModel>/enableSettings"},{path:"TextRuleModel>/editable"}],formatter:this._decideSettingsEnablement},content:this._getElseIfButton()});e.push(v);}return e;},_getElsePanel:function(){var t=this.oBundle.getText("titleElse");var e=[];var i=this._displayModel.getProperty("/textRuleConditions/Else");if(i.length>0){var H={RuleId:i[0].RuleId,Id:i[0].Id,RuleVersion:i[0].RuleVersion};var s=this._getModel().createKey("/TextRuleConditions",H);var j=new sap.ui.model.Context(this._getModel(),s);e.push(this._createElseFormLayout(j,t),false);}else{var r=new P({headerText:t,visible:{parts:[{path:"TextRuleModel>/enableSettings"},{path:"TextRuleModel>/editable"}],formatter:this._decideSettingsEnablement},content:this._getElseButton()});e.push(r);}return e;},_getExpressionAdvancedText:function(i,j,r,s,t){var u=this;var v=null;var w="";var x=r?r:sap.rules.ui.ExpressionType.BooleanEnhanced;this.valueState="None";this.bOperationsContext=false;if(this.getAstExpressionLanguage()){v=sap.ui.getCore().byId(this.getAstExpressionLanguage());var y=this._getExpressionFromAstNodes(i);if(y&&y.relString){y.relString=y.relString.replace(/\\/g,"\\\\").replace(/{/g,"\\{").replace(/}/g,"\\}");}var z=this._internalModel.getProperty("/ruleBindingPath").split("/")[2];var H=i.getObject("/"+z).ResultDataObjectId;this._internalModel.setProperty("/resultDataObjectId",H);if(s){w="/"+H+"/"+s;}if(H){H=H;}if(!H&&!t){this.bOperationsContext=true;}return new m({astExpressionLanguage:v,value:y.relString,jsonData:y.JSON,attributeInfo:w,resultDataObjectId:H,conditionContext:t,operationsContext:this.bOperationsContext,editable:"{TextRuleModel>/editable}",placeholder:this.oBundle.getText("expressionPlaceHolder"),valueState:this.valueState,change:function(e){var S=e.getSource();var J=sap.ui.getCore().getEventBus();i=S.getBindingContext();var K=i.getPath();var M=e.getParameter("astNodes");if(M&&M[0].Type==="I"&&M[0].Value!=""&&M[0].Value!=undefined){e.oSource.setValueState("Error");}else{e.oSource.setValueState("None");}J.publish("sap.ui.rules","astCreating");var N=i.getModel();if(!N.hasPendingChanges()){u._removeAndUpdateExisitingNodes(K,i,M,j,N);}}.bind(this)}).setBindingContext(i);}else if(this.getExpressionLanguage()){v=sap.ui.getCore().byId(this.getExpressionLanguage());var I=u._getConvertedExpression(j,false,i);var y=u._getExpressionFromParseResults(j,I);y=y?y:j;return new E({expressionLanguage:v,placeholder:this.oBundle.getText("expressionPlaceHolder"),validateOnLoad:true,type:x,value:y,attributeInfo:s,editable:"{TextRuleModel>/editable}",change:function(J){var S=J.getSource();i=S.getBindingContext();var K=i.getPath();I=u._getConvertedExpression(S.getValue(),true,i);var M=u._getExpressionFromParseResults(S.getValue(),I);M=M?M:S.getValue();u._updateModelExpression(K,i,M);var N=I.output.decisionTableData.DecisionTable.DecisionTableColumns.results["0"].Condition.parserResults;if(N.status!=="Error"){u._astUtils.Id=0;var O=N.converted.ASTOutput;try{var Q=JSON.stringify(u._astUtils.parseConditionStatement(O));var U=i.oModel.oMetadata.mEntityTypes["/TextRuleConditions"].property;var V=0;if(U){for(var W=0;W<U.length;W++){if(U[W].name==="AST"){V=U[W].maxLength;}}if(Q&&Q.length<=V){u._updateModelExpressionModelAst(K,i,Q);}}}catch(e){q.sap.log.error("Exception while converting ast for expression"+S.getValue()+" :"+e.message);}}}.bind(this)}).setBindingContext(i);}},_removeAndUpdateExisitingNodes:function(s,e,i,j,M){var t=this;var r=sap.ui.getCore().getEventBus();M.setDeferredGroups(["astGroupId"]);M.update(e.getPath(),{"Expression":e.getProperty("Expression")},{groupId:"astGroupId"});t._removeExistingAstNodes(s,e,i,j,M);t._updateModelAstNodes(s,e,i,M);M.submitChanges({groupId:"astGroupId",success:function(u){r.publish("sap.ui.rules","astCreated");}});},_getExpressionFromParseResults:function(e,r){if(r&&r.output.decisionTableData.DecisionTable.DecisionTableColumns.results[0].Condition.parserResults&&r.output.decisionTableData.DecisionTable.DecisionTableColumns.results[0].Condition.parserResults.converted){return r.output.decisionTableData.DecisionTable.DecisionTableColumns.results[0].Condition.parserResults.converted.Expression;}else{return e;}},_getExpressionFromAstNodes:function(e){var t=this;var i=sap.ui.getCore().byId(this.getAstExpressionLanguage());var j="";var r=[];var s=[];if(t.includes(e.sPath,"TextRuleConditions")){r=e.getObject(e.sPath).TextRuleConditionASTs;}else{r=e.getObject(e.sPath).TextRuleResultExpressionASTs;}var u=i._astBunldeInstance.ASTUtil;u.clearNodes();r=r.__list;if(r&&r.length>0){for(var v in r){var w=r[v];t._addNodeObject(e.getObject("/"+w));}s=u.getNodes();j=u.toAstExpressionString(s);if(s&&s[0].Type==="I"&&s[0].Value!=""&&s[0].Value!=undefined){this.valueState="Error"}else{this.valueState="None"}}return j;},_addNodeObject:function(e){var N=[];var i=sap.ui.getCore().byId(this.getAstExpressionLanguage());var j=i._astBunldeInstance.ASTUtil;var u=[];u.Root=e.Root;u.SequenceNumber=e.Sequence;u.ParentId=e.ParentId;u.Reference=e.Reference;u.Id=e.NodeId;u.Type=e.Type;u.Value=e.Value?e.Value:"";if(e.Type==="I"){u.Value=e.IncompleteExpression;}if(e.Function){u.Function=e.Function;}if(e.Type!=="P"&&!e.Function){var O=[];O.BusinessDataType=e.Output?e.Output.BusinessDataType:e.BusinessDataType;O.DataObjectType=e.Output?e.Output.DataObjectType:e.DataObjectType;u.Output=O;}j.createNode(u);},_getIfPanel:function(){var t=this.oBundle.getText("titleIf");var i=this._displayModel.getProperty("/textRuleConditions/If");var H={RuleId:i[0].RuleId,Id:i[0].Id,RuleVersion:i[0].RuleVersion};var s=this._getModel()?this._getModel().createKey("/TextRuleConditions",H):"";var e=new sap.ui.model.Context(this._getModel(),s);return this._createFormLayout(e,t,true);},_getModel:function(){var e=this.getModelName();if(e){return this.getModel(e);}return this.getModel();},_handleVerticalLayoutDataReceived:function(r){var e=r.__batchResponses[1].data;if(e&&e.results){this._internalModel.setProperty("/textRuleResults",e.results);}var i=r.__batchResponses[2].data;var j;if(!i){return;}var v=this.getAggregation("_verticalLayout");if(i.results&&i.results.length===0){j=this._getBlankContent();v.addContent(j);this._internalModel.setProperty("/newTextRule",true);this._updateBusyState(false);}else{this._segregateTextRuleData(i.results);if(this._displayModel.getProperty("/textRuleConditions/If").length===0){j=this._getBlankContent();v.addContent(j);this._internalModel.setProperty("/newTextRule",true);this._updateBusyState(false);}else{this._bindVerticalLayout();this._internalModel.setProperty("/newTextRule",false);}}},_initDisplayModel:function(){var e={};e.textRuleConditions=[];e.textRuleConditions.If=[];e.textRuleConditions.ElseIf=[];e.textRuleConditions.Else=[];this._displayModel=new sap.ui.model.json.JSONModel(e);this.setModel(this._displayModel,"displayModel");},_initInternalModel:function(){var e={};e.editable=this.getEditable();e.newTextRule=true;e.enableSettings=true;e.projectId="";e.projectVersion="";e.ruleId="";e.ruleVersion="";e.ruleBindingPath="";e.textRuleResults=[];e.textRuleResultExpressions=[];e.resultDataObjectId="";e.expressionLanguageVersion="";this._internalModel=new sap.ui.model.json.JSONModel(e);this.setModel(this._internalModel,"TextRuleModel");},_initSettingsModel:function(){this._settingsModel=new sap.ui.model.json.JSONModel();this.setModel(this._settingsModel,"settingModel");},_openTextRuleSettings:function(){var t=this._createTextRuleSettings();var e=new D({contentWidth:"70%",contentHeight:"315px",title:this.oBundle.getText("textRuleSettings")});e.addContent(t);var j=t.getButtons(e);for(var i=0;i<j.length;i++){e.addButton(j[i]);}e.attachBeforeClose(function(r){var s=e.getState();if(s===sap.ui.core.ValueState.Success){if(this._internalModel.getProperty("/resultChanged")){var u=sap.ui.getCore().getEventBus();u.publish("sap.ui.rules","refreshTextRuleModel");}this._resetControl();}e.destroy();},this);e.open();},_resetControl:function(){this._unbindVerticalLayout();this._initInternalModel();this._initSettingsModel();this._initDisplayModel();this._updateBusyState(true);var M=this._getModel();M.removeData();var e=this.getBindingContextPath();if(!e||!M){return;}this._resetContent=false;var s=e.split("'");this._internalModel.setProperty("/projectId",s[1]);this._internalModel.setProperty("/projectVersion",s[3]);this._internalModel.setProperty("/ruleId",s[5]);this._internalModel.setProperty("/ruleVersion",s[7]);this._internalModel.setProperty("/ruleBindingPath",e);var i=new sap.ui.model.Context(M,e);this.setBindingContext(i);this._bindRule();},_segregateTextRuleData:function(e){var j=[];j.If=[];j.ElseIf=[];j.Else=[];for(var i=0;i<e.length;i++){j.push(e[i]);this.getModel("displayModel").setProperty("/bCancelButtonVisible("+e[i].Id+")",e[i].TextRuleResultExpressions.results.length>1);if(e[i].Type===this.typeIf){j.If.push(e[i]);}else if(e[i].Type===this.typeElseIf){j.ElseIf.push(e[i]);}else if(e[i].Type===this.typeElse){j.Else.push(e[i]);}}this.getModel("displayModel").setProperty("/textRuleConditions",j);},_updateBusyState:function(e){if(e){sap.ui.core.BusyIndicator.show(0);}else{setTimeout(function(){sap.ui.core.BusyIndicator.hide();},1500);}},_unbindVerticalLayout:function(){var v=this.getAggregation("_verticalLayout");if(v){v.destroyContent();}},_updateModelExpression:function(s,e,i){e.getModel().setProperty(s+"/Expression",i,e,true);},_updateModelAstNodes:function(s,e,i,M){var s=e.getPath();var r=this.getModel().getObject(s);var j=r.RuleId;var t=r.RuleVersion;var u="";var v={};if(this.includes(s,"TextRuleConditions")){v.Id=r.Id;u="/TextRuleConditionASTs";}else{v.ConditionId=r.ConditionId;v.ResultId=r.ResultId;u="/TextRuleResultExpressionASTs";}for(var w in i){var x={};if(i[w].Root){x.Sequence=1;x.Root=true;}else{x.Sequence=i[w].SequenceNumber;x.ParentId=i[w].ParentId;}if(i[w].Reference){x.Reference=i[w].Reference;}if(i[w].Function){x.Function=i[w].Function?i[w].Function:"";}if(i[w].Type!=="P"&&!i[w].Function){x.BusinessDataType=i[w].Output?i[w].Output.BusinessDataType:i[w].BusinessDataType;x.DataObjectType=i[w].Output?i[w].Output.DataObjectType:i[w].DataObjectType;x.Value=i[w].Value?i[w].Value:"";}if(i[w].Type==="I"){x.IncompleteExpression=i[w].Value;}x.NodeId=i[w].Id;x.Type=i[w].Type;x.RuleId=j;x.RuleVersion=t;for(var y in v){x[y]=v[y];}var z={};z.properties=x;z.groupId="astGroupId";M.createEntry(u,z);}},_removeExistingAstNodes:function(s,e,i,j,M){var t=this;var r=this.getModel().getObject(s);var u=r.RuleId;var v=r.RuleVersion;var w="";var x={};if(t.includes(s,"TextRuleConditions")){w="/DeleteTextRuleConditionASTDraft";}if(t.includes(s,"TextRuleResult")){w="/DeleteTextRuleResultASTDraft";}if(t.includes(s,"TextRuleResultExpression")){x.ConditionId=r.ConditionId;x.ResultId=r.ResultId;w="/DeleteTextRuleResultExpressionASTDraft";}x.Id=r.Id;x.RuleId=u;x.RuleVersion=v;M.callFunction(w,{method:"POST",groupId:"astGroupId",urlParameters:x});},_updateModelExpressionModelAst:function(s,e,i){if(e.getModel().getProperty(s+"/AST")){e.getModel().setProperty(s+"/AST",i,e,true);}},init:function(){this.oBundle=sap.ui.getCore().getLibraryResourceBundle("sap.rules.ui.i18n");this.typeIf="If";this.typeElseIf="ElseIf";this.typeElse="Else";this._resetContent=true;this._initInternalModel();this._initDisplayModel();this._initSettingsModel();this._addToolBar();this._addTextRuleControl();this._astUtils=A;},onAfterRendering:function(){var v=this.getAggregation("_verticalLayout");var t=this;v.addEventDelegate({"onAfterRendering":function(){t._updateBusyState(false);}},this);},onBeforeRendering:function(){if(this._resetContent){this._resetControl();}},setEnableSettings:function(v){this.setProperty("enableSettings",v,true);this._internalModel.setProperty("/enableSettings",v);return this;},setModelName:function(v){this.setProperty("modelName",v);this._resetContent=true;return this;},setExpressionLanguage:function(v){this.setAssociation("expressionLanguage",v,true);var e=(v instanceof Object)?v:sap.ui.getCore().byId(v);if(!e){return this;}var V=this.getAggregation("_verticalLayout");if(V){var i=V.getBinding("content");if(i){i.refresh();}}return this;},setAstExpressionLanguage:function(v){this.setAssociation("astExpressionLanguage",v,true);var e=(v instanceof Object)?v:sap.ui.getCore().byId(v);if(!e){return this;}var V=this.getAggregation("_verticalLayout");if(V){var i=V.getBinding("content");if(i){i.refresh();}}return this;},setEditable:function(v){this.setProperty("editable",v,true);this._internalModel.setProperty("/editable",v);return this;},setBindingContextPath:function(v){var e=this.getBindingContextPath();if(v&&(e!==v)){this._unbindVerticalLayout();this.setProperty("bindingContextPath",v);this._resetContent=true;}return this;},includes:function(e,s){var r=false;if(e.indexOf(s)!==-1){r=true;}return r;}});return p;},true);