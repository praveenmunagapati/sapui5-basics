/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/Log","sap/ui/core/mvc/Controller","sap/ui/core/library","sap/ui/rta/plugin/iframe/URLBuilderDialog"],function(L,C,c,U){"use strict";var V=c.ValueState;var _=["frameUrl"];var a=["frameWidth","frameHeight"];var b=["asNewSection","frameWidthUnit","frameHeightUnit"];return C.extend("sap.ui.rta.plugin.iframe.SettingsDialogController",{constructor:function(j,s){this._oJSONModel=j;this._importSettings(s);},onValidationSuccess:function(e){e.getSource().setValueState(V.None);this._oJSONModel.setProperty("/areAllFieldsValid",this._areAllTextFieldsValid()&&this._areAllValueStateNones());},onValidationError:function(e){e.getSource().setValueState(V.Error);this._oJSONModel.setProperty("/areAllFieldsValid",false);},onSavePress:function(){if(this._areAllTextFieldsValid()&&this._areAllValueStateNones()){this._close(this._buildReturnedSettings());}},onURLBuilderPress:function(){var u=this._createURLBuilderDialog();u.open({editURL:this._oJSONModel.getProperty("/frameUrl/value"),parameters:this._oJSONModel.getProperty("/urlBuilderParameters/value")}).then(function(s){if(s){this._oJSONModel.setProperty("/frameUrl/value",s);}}.bind(this)).catch(function(e){L.error("Error closing URLBuilderDialog: ",e);});},_createURLBuilderDialog:function(){return new U();},onCancelPress:function(){this._close();},_close:function(s){var S=sap.ui.getCore().byId("sapUiRtaSettingsDialog");this._mSettings=s;S.close();},getSettings:function(){return this._mSettings;},_areAllValueStateNones:function(){var d=this._oJSONModel.getData();return _.concat(a).every(function(f){return d[f]["valueState"]===V.None;},this);},_areAllTextFieldsValid:function(){var v=true;var d=this._oJSONModel.getData();_.forEach(function(f){if(d[f]["value"].trim()===""){v=false;this._oJSONModel.setProperty("/"+f+"/valueState",V.Error);}},this);return v;},_buildReturnedSettings:function(){var s={};var d=this._oJSONModel.getData();_.concat(a,b).forEach(function(f){s[f]=d[f].value;});return s;},_importSettings:function(s){if(s){Object.keys(s).forEach(function(f){if(f==="frameWidth"||f==="frameHeight"){this._importIframeSize(f,s[f]);}else{this._oJSONModel.setProperty("/"+f+"/value",s[f]);}},this);}},_importIframeSize:function(f,s){var r=s.split(/(px|rem|%)/);if(r.length>=2){this._oJSONModel.setProperty("/"+f+"/value",parseInt(r[0]));this._oJSONModel.setProperty("/"+f+"Unit/value",r[1]);}}});});