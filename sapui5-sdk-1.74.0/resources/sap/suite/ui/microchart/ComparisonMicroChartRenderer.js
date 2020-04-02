/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */
sap.ui.define(['./library',"sap/base/security/encodeXML",'sap/suite/ui/microchart/MicroChartRenderUtils','sap/ui/core/theming/Parameters','sap/m/library'],function(l,e,M,P,m){"use strict";var V=m.ValueColor;var C={};C.render=function(r,c){if(!c._bThemeApplied){return;}if(c._hasData()){var a=c.getTooltip_AsString(c.hasListeners("press"));r.write("<div");this._writeMainProperties(r,c);if(c.getShrinkable()){r.addClass("sapSuiteCpMCShrinkable");r.addStyle("height","auto");}r.writeClasses();r.writeStyles();r.write(">");this._renderInnerContent(r,c,a);r.write("<div");r.writeAttribute("id",c.getId()+"-info");r.writeAttribute("aria-hidden","true");r.addStyle("display","none");r.writeStyles();r.write(">");r.writeEscaped(a);r.write("</div>");r.write("<div");r.writeAttribute("id",c.getId()+"-hidden");r.writeAttribute("aria-hidden","true");r.writeAttribute("focusable","false");r.writeStyles();r.write(">");r.write("</div>");r.write("</div>");}else{r.write("<div");this._writeMainProperties(r,c);r.writeClasses();r.writeStyles();r.write(">");this._renderNoData(r);r.write("</div>");}};C._writeMainProperties=function(r,c){var i=c.hasListeners("press");this._renderActiveProperties(r,c);var a=c.getTooltip_AsString(i);r.writeAttribute("role","img");if(c.getAriaLabelledBy().length){r.writeAccessibilityState(c);}else{r.writeAttributeEscaped("aria-label",a);}r.writeControlData(c);r.addClass("sapSuiteCpMC");r.addClass("sapSuiteCpMCChartContent");r.addClass(c._isResponsive()?"sapSuiteCpMCResponsive":"sapSuiteCpMCSize"+c.getSize());r.addClass("sapSuiteCpMCViewType"+c.getView());r.addStyle("width",c.getWidth());r.addStyle("height",c.getHeight());};C._renderInnerContent=function(r,c){var a=c.getColorPalette().length,b=0,d=c.getData(),f=c._calculateChartData();var n=function(s){if(a){if(b===a){b=0;}s=c.getColorPalette()[b++].trim();}return P.get(s)||s;};r.write("<div");r.addClass("sapSuiteCpMCVerticalAlignmentContainer");r.writeClasses();r.write(">");for(var i=0;i<f.length;i++){this._renderChartItem(r,c,f[i],i,n(d[i].getColor()));}r.write("</div>");};C._renderChartItem=function(r,c,o,i,s){var d=c.getData();r.write("<div");r.addClass("sapSuiteCpMCChartItem");r.writeElementData(d[i]);r.writeClasses();r.write(">");this._renderChartTitle(r,c,i);this._renderChartBar(r,c,o,i,s);this._renderChartValue(r,c,i,s);r.write("</div>");};C._renderChartBar=function(r,c,o,i,s){var d=c.getData()[i];r.write("<div");r.writeAttribute("id",c.getId()+"-chart-item-bar-"+i);r.addClass("sapSuiteCpMCChartBar");if(c.getData()[i].hasListeners("press")){if(i===0){r.writeAttribute("tabindex","0");}r.writeAttribute("role","presentation");r.writeAttributeEscaped("aria-label",c._getBarAltText(i));if(!l._isTooltipSuppressed(c._getBarAltText(i))){r.writeAttributeEscaped("title",c._getBarAltText(i));}else{r.writeAttribute("title","");}r.writeAttribute("data-bar-index",i);r.addClass("sapSuiteUiMicroChartPointer");}r.writeClasses();r.write(">");if(o.negativeNoValue>0){r.write("<div");r.writeAttribute("data-bar-index",i);r.addClass("sapSuiteCpMCChartBarNegNoValue");if(o.value>0||o.positiveNoValue>0){r.addClass("sapSuiteCpMCNotLastBarPart");}r.writeClasses();r.addStyle("width",e(o.negativeNoValue+"%"));r.writeStyles();r.write("></div>");}if(o.value>0){r.write("<div");r.writeAttribute("data-bar-index",i);r.addClass("sapSuiteCpMCChartBarValue");r.addClass(e("sapSuiteCpMCSemanticColor"+d.getColor()));r.writeClasses();r.addStyle("background-color",s?e(s):"");r.addStyle("width",e(o.value+"%"));r.writeStyles();r.write("></div>");}if(o.positiveNoValue>0){r.write("<div");r.writeAttribute("data-bar-index",i);r.addClass("sapSuiteCpMCChartBarNoValue");if(!!o.negativeNoValue&&!o.value){r.addClass("sapSuiteCpMCNegPosNoValue");}else if(!!o.negativeNoValue||!!o.value){r.addClass("sapSuiteCpMCNotFirstBarPart");}r.writeClasses();r.addStyle("width",e(o.positiveNoValue+"%"));r.writeStyles();r.write("></div>");}r.write("</div>");};C._renderChartTitle=function(r,c,i){var d=c.getData()[i];r.write("<div");r.writeAttribute("id",c.getId()+"-chart-item-"+i+"-title");r.addClass("sapSuiteCpMCChartItemTitle");r.writeClasses();r.write(">");r.writeEscaped(d.getTitle());r.write("</div>");};C._renderChartValue=function(r,c,i,s){var d=c.getData()[i];var S=c.getScale();var D=d.getDisplayValue();var a=D?D:""+d.getValue();var v=a+S;r.write("<div");r.writeAttribute("id",c.getId()+"-chart-item-"+i+"-value");r.addClass("sapSuiteCpMCChartItemValue");if(V[s]){r.addClass(e("sapSuiteCpMCSemanticColor"+d.getColor()));}if(d.getTitle()){r.addClass("sapSuiteCpMCTitle");}r.writeClasses();r.write(">");if(!isNaN(d.getValue())){r.writeEscaped(v);}r.write("</div>");};M.extendMicroChartRenderer(C);return C;},true);