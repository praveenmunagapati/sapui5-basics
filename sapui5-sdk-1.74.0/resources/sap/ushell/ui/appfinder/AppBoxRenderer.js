/*!
 * Copyright (c) 2009-2017 SAP SE, All Rights Reserved
 */
sap.ui.define(['sap/ushell/resources','sap/ui/core/Icon'],function(r,I){"use strict";var A={};A.render=function(a,o){var c=o.getParent(),b=c.getAppBoxesContainer?c.getAppBoxesContainer():[],v=b.filter(function(o){return o.getVisible();}),C=v.indexOf(o)>-1?v.indexOf(o)+1:"",s=o.getTitle();s=o.getSubtitle()?s+" "+o.getSubtitle():s;var n=o.getNavigationMode();if(n){s=r.i18n.getText(n+"NavigationMode")+" "+s;}a.write("<li");a.writeControlData(o);a.addClass("sapUshellAppBox");a.writeAccessibilityState(o,{role:"option",posinset:C,setsize:v.length});a.writeAttributeEscaped("aria-label",s);a.writeAttribute("aria-describedby",o.getId());a.writeClasses();a.write(">");a.write("<div");a.addClass("sapUshellAppBoxInner");a.writeClasses();a.write(">");var h=o.getIcon();if(h){var i=new I({src:o.getIcon()});i.addStyleClass("sapUshellAppBoxIcon");a.renderControl(i);}a.write("<div");if(h){a.addClass("sapUshellAppBoxHeader");}else{a.addClass("sapUshellAppBoxHeaderNoIcon");}a.writeClasses();a.write(">");a.write("<div");a.addClass("sapUshellAppBoxTitle");a.writeClasses();a.write(">");a.writeEscaped(o.getTitle());a.write("</div>");if(o.getSubtitle()){a.write("<div");a.addClass("sapUshellAppBoxSubtitle");a.writeClasses();a.write(">");a.writeEscaped(o.getSubtitle());a.write("</div>");}a.write("</div>");a.write("</div>");a.write("<div");a.addClass("sapUshellAppBoxActionsArea");a.writeClasses();if(o.getTitle){a.writeAccessibilityState(o,{role:"toolbar",label:o.getTitle()});}a.write(">");a.renderControl(o.getPinButton());a.write("</div>");a.write("</li>");};return A;},true);