sap.ui.define(["sap/ui/base/EventProvider"],function(E){"use strict";var R=E.extend("sap.ui.vk.tools.RectSelectToolHandler",{metadata:{publicMethods:["beginGesture","endGesture","move","click","doubleClick","contextMenu"]},constructor:function(T){this._tool=T;this._rect=null;this._gesture=false;this._nomenu=false;this._selectionRect=null;}});R.prototype.destroy=function(){this._tool=null;this._rect=null;this._gesture=false;};R.prototype.activate=function(v){this._deactivate=false;if(v._loco){this._viewport=v;v._loco.addHandler(this,1);}};R.prototype.deactivate=function(){if(this._gesture){this._deactivate=true;}else if(this._viewport){this._deactivate=false;this._viewport._loco.removeHandler(this);this._viewport=null;}};R.prototype._getOffset=function(o){var r=o.getBoundingClientRect();var p={x:r.left+window.pageXOffset,y:r.top+window.pageYOffset};return p;};R.prototype._inside=function(a){var i=this._tool._viewport.getIdForLabel();var d=document.getElementById(i);if(d==null){return false;}var o=this._getOffset(d);this._rect={x:o.x,y:o.y,w:d.offsetWidth,h:d.offsetHeight};if(document.activeElement){try{document.activeElement.blur();}catch(e){}}d.focus();return(a.x>=this._rect.x&&a.x<=this._rect.x+this._rect.w&&a.y>=this._rect.y&&a.y<=this._rect.y+this._rect.h);};R.prototype.beginGesture=function(e){if(e.n===1&&this._inside(e)&&!this._gesture){this._gesture=true;e.handled=true;var x=e.x-this._rect.x,y=e.y-this._rect.y;this._selectionRect={x1:x,y1:y,x2:x,y2:y};return;}};R.prototype.move=function(e){if(this._gesture){e.handled=true;this._nomenu=true;if(this._selectionRect){this._selectionRect.x2=e.x-this._rect.x;this._selectionRect.y2=e.y-this._rect.y;if(this._viewport){this._viewport.setSelectionRect(this._selectionRect);}}}};R.prototype.endGesture=function(e){if(this._gesture){this._gesture=false;e.handled=true;if(this._selectionRect){if(this._viewport){var x=e.x-this._rect.x,y=e.y-this._rect.y;if(this._tool.isViewportType("sap.ui.vk.dvl.Viewport")){this._tool.select(this._selectionRect.x1,this._selectionRect.y1,x,y,null,null);}else if(this._tool.isViewportType("sap.ui.vk.threejs.Viewport")){this._tool.select(this._selectionRect.x1,this._selectionRect.y1,x,y,this._viewport.getScene(),this._viewport.getCamera());}}this._viewport.setSelectionRect(null);this._selectionRect=null;}if(this._deactivate){this.deactivate();}}};R.prototype.getViewport=function(){return this._viewport;};return R;});