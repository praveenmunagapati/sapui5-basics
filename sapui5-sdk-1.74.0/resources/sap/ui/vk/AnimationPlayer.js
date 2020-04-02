/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/core/Element","./Core","./AnimationMath","./AnimationTrackType","./AnimationTrackValueType"],function(E,v,A,a,b){"use strict";var c=E.extend("sap.ui.vk.AnimationPlayer",{metadata:{associations:{viewStateManager:{type:"sap.ui.vk.ViewStateManagerBase",multiple:false}},events:{timeChanged:{time:{type:"float"},currentPlayback:{type:"sap.ui.vk.AnimationPlayback"}},stateChanged:{playing:{type:"boolean"},stopped:{type:"boolean"},endOfAnimation:{type:"boolean"}}}}});c.prototype._getViewStateManager=function(){var d=this.getViewStateManager();return d?sap.ui.getCore().byId(d):undefined;};c.prototype.init=function(){this._step=this._step.bind(this);this._playbackCollection=null;this._currentPlayback=null;this._time=0;v.getEventBus().subscribe("sap.ui.vk","readyForAnimation",this._onViewApplied,this);v.getEventBus().subscribe("sap.ui.vk","sequenceChanged",this._onSequenceChanged,this);};c.prototype.exit=function(){this._playbackCollection=null;this._currentPlayback=null;v.getEventBus().unsubscribe("sap.ui.vk","readyForAnimation",this._onViewApplied,this);v.getEventBus().unsubscribe("sap.ui.vk","sequenceChanged",this._onSequenceChanged,this);};c.prototype._onViewApplied=function(d,e,f){if(f.source.getId()!=this.getViewStateManager()){return;}var g=f.view;var i=f.ignoreAnimationPosition;this.activateView(g,i);};c.prototype._onSequenceChanged=function(d,e,f){if(this._currentPlayback){var g=this._getViewStateManager();var s=this._currentPlayback.getSequence();if(g&&s){if(s.getId()===f.sequenceId){g.setJoints(s.getJoint());}}}};c.prototype.setTime=function(t,p){if(!this._playbackCollection||!Array.isArray(this._playbackCollection.getPlaybacks())){this._currentPlayback=undefined;this._time=0;}else{if(p!=null){t=this._getAbsoluteTime(t,p);}var d=this._getViewStateManager();this._time=t;if(t>=0&&t<=this.getTotalDuration()){var e=this._currentPlayback;var n;if(p!=null){n=this._playbackCollection.getPlayback(p);}else{n=this._findPlaybackByAbsoluteTime(t);}this._currentPlayback=n;if(d&&this._currentPlayback&&e!==this._currentPlayback){var s=this._currentPlayback.getSequence();if(s){d.setJoints(s.getJoint());}}else if(!this._currentPlayback||!this._currentPlayback.getSequence()){d.setJoints(undefined);}}else if(d){d.setJoints(undefined);}if(d){var f={nodeRefs:[],positions:[]};var o={nodeRefs:[],values:[]};var g=this._collectNodeChanges();g.forEach(function(h,i){var j=d.getTransformation(i);var m=false;if(h.translate){m=true;j.translation=h.translate;}if(h.rotate){m=true;j.quaternion=h.rotate;}if(h.scale){m=true;j.scale=h.scale;}if(m){f.nodeRefs.push(i);f.positions.push(j);}if(h.opacity!==undefined){d.setOpacity(i,h.opacity);o.nodeRefs.push(i);o.values.push(h.opacity);}},this);d.setTransformation(f.nodeRefs,f.positions);d.setOpacity(o.nodeRefs,o.values);}}this.fireTimeChanged({time:this._time,currentPlayback:this._currentPlayback});return this;};c.prototype.getTime=function(){return this._time;};c.prototype.getCurrentPlayback=function(){return this._currentPlayback;};c.prototype.getCurrentPlaybackTime=function(){var t=this._time;var p=this._playbackCollection.getPlaybacks();if(!Array.isArray(p)||!this.getCurrentPlayback()){return-1;}var i=0;while(p[i]!=this.getCurrentPlayback()){t-=p[i].getDuration();i++;}return t;};c.prototype.getStartTime=function(p){if(!this._playbackCollection){return undefined;}if(typeof p==="number"){p=this._playbackCollection.getPlayback(p);}return p?p.getStartTime():undefined;};c.prototype.getTotalDuration=function(){if(!this._playbackCollection){return 0;}var t=0;this._playbackCollection.getPlaybacks().forEach(function(p){t+=p.getDuration();});return t;};c.prototype.shouldAnimateNextFrame=function(){return this.getTime()>=0&&this.getTime()<=this.getTotalDuration();};c.prototype._step=function(t){if(!this._lastFrameTimestamp){this._lastFrameTimestamp=t;}var p=t-this._lastFrameTimestamp;this._lastFrameTimestamp=t;this.setTime(this.getTime()+p/1000);if(this.shouldAnimateNextFrame()){this._frameId=window.requestAnimationFrame(this._step);}else{this.stop();}};c.prototype._interpolate=function(d,e,t){var q;if(!e.before&&!e.after){return undefined;}else if(!e.before){if(d===b.Euler){q=A.neutralEulerToGlMatrixQuat(e.after.value);return A.glMatrixQuatToNeutral(q);}else if(d===b.AngleAxis){q=A.neutralAngleAxisToGlMatrixQuat(e.after.value);return A.glMatrixQuatToNeutral(q);}else if(d===b.Quaternion){q=A.neutralQuatToGlMatrixQuat(e.after.value);return A.glMatrixQuatToNeutral(q);}return e.after.value;}else if(!e.after){if(d===b.Euler){q=A.neutralEulerToGlMatrixQuat(e.before.value);return A.glMatrixQuatToNeutral(q);}else if(d===b.AngleAxis){q=A.neutralAngleAxisToGlMatrixQuat(e.before.value);return A.glMatrixQuatToNeutral(q);}else if(d===b.Quaternion){q=A.neutralQuatToGlMatrixQuat(e.before.value);return A.glMatrixQuatToNeutral(q);}return e.before.value;}var k=0;if(e.before.time!==e.after.time){k=(e.time-e.before.time)/(e.after.time-e.before.time);}return A.interpolate(d,e.before,e.after,k,t);};c.getBoundaryKey=function(t,i){var d=t.getKeysCount();var e;if(i){e=t.getKey(0);}else{e=t.getKey(d-1);}var f=t.getKeysType();var q,r;if(f===b.Euler){q=A.neutralEulerToGlMatrixQuat(e.value);r={value:A.glMatrixQuatToNeutral(q),time:e.time};}else if(f===b.Quaternion){q=A.neutralQuatToGlMatrixQuat(e.value);r={value:A.glMatrixQuatToNeutral(q),time:e.time};}else if(f!==b.AngleAxis){r=e;}else{var g;var k=0;if(i){g=e;if(d>1){g=t.getKey(1);}k=0;}else{g=e;if(d>1){e=t.getKey(d-2);k=1;}}q=A.interpolate(f,e,g,k,t);r={value:q,time:i?e.time:g.time};}return r;};c.prototype._getKeyFramesBracket=function(t,d){var k=d.getKeysCount();var r={time:t,before:undefined,after:undefined};for(var i=0;i<k;i++){var e=d.getKey(i);if(e.time===t){r.before=r.after=e;}else if(e.time>t){r.before=(i===0?undefined:d.getKey(i-1));r.after=e;break;}}if(!r.before&&!r.after&&k>0){r.before=d.getKey(k-1);}if(k>1&&(!r.after||!r.before)&&(d.isCycleForward()||d.isCycleBackward())){var f=d.getKey(0).time;var g=d.getKey(k-1).time-f;var h=Math.floor((t-f)/g);var j=t-g*h;return this._getKeyFramesBracket(j,d);}return r;};c.prototype._collectNodeChangesFromSequenceBoundaryKeys=function(n,s,i,d,p){var e=s.getNodeAnimation();var f=function(g,h,k){if(!g||!h||!k){return;}var j=n.get(g);if(j&&j.hasOwnProperty(h)){if(j&&j.animationProperties&&j.animationProperties[h]){return;}if(j&&j.isFront&&!i){return;}if(j&&j.isFront&&i&&j.keyTime>k.time+p){return;}if(j&&!j.isFront&&!i&&j.keyTime<k.time+p){return;}}if(!j){j={};n.set(g,j);}j[h]=k.value;j.keyTime=k.time+p;j.isFront=i;};e.forEach(function(g){for(var t in a){var h=a[t];var j=g[h];if(j){var k=c.getBoundaryKey(j,(!i&&!d)||(i&&d));f(g.nodeRef,h,k);}}},this);};c.prototype._collectNodeChangesFromPlaybackBoundaryKeys=function(d,n,p){var s=p.getSequence();if(!s){return;}var t=d-p.getStartTime();var e=s.getDuration()*p.getTimeScale()*p.getRepeats();if(t<0){this._collectNodeChangesFromSequenceBoundaryKeys(n,s,false,p.getReversed(),p.getStartTime());}else if(t>p.getPreDelay()+e){this._collectNodeChangesFromSequenceBoundaryKeys(n,s,true,p.getReversed(),p.getStartTime());}};c.prototype._collectSequenceNodeChanges=function(t,n,s,i){var d=s.getNodeAnimation();var e=function(f,p,g){if(!f||!p||!g){return;}var h=n.get(f);if(!h){h={};h.animationProperties={};n.set(f,h);}h[p]=g;h.animationProperties[p]=true;};d.forEach(function(f){var k;for(var g in a){var h=a[g];var j=f[h];if(j&&(!i||(i&&j.isInfinite()))){k=this._getKeyFramesBracket(t,j);var l=this._interpolate(j.getKeysType(),k,j);e(f.nodeRef,h,l);}}},this);};c.prototype._collectPlaybackNodeChanges=function(d,n,p){var s=p.getSequence();if(!s){return;}var t=d-p.getStartTime();if(t<0){return;}var e=s.getDuration()*p.getTimeScale()*p.getRepeats();var f=(t-p.getPreDelay())/p.getTimeScale();if(f>0&&f%p.getSequence().getDuration()===0){f=s.getDuration();}else{f=f%p.getSequence().getDuration();}f=p.getReversed()?p.getSequence().getDuration()-f:f;if(t<p.getPreDelay()){}else if(t>p.getPreDelay()+e){this._collectSequenceNodeChanges(f,n,p.getSequence(),true);}else{this._collectSequenceNodeChanges(f,n,p.getSequence(),false);}};c.prototype._collectNodeChanges=function(){var n=new Map();var p=this._playbackCollection.getPlaybacks();var d=this.getTime();var i;for(i=0;i<p.length;i++){this._collectPlaybackNodeChanges(d,n,p[i]);}for(i=0;i<p.length;i++){this._collectNodeChangesFromPlaybackBoundaryKeys(d,n,p[i]);}return n;};c.prototype.play=function(){this._lastFrameTimestamp=undefined;this._frameId=window.requestAnimationFrame(this._step);v.getEventBus().publish("sap.ui.vk","animationPlayStateChanged",{source:this,view:this._playbackCollection,playing:true,stopped:false,endOfAnimation:false});this.fireStateChanged({playing:true,stopped:false});return this;};c.prototype.stop=function(){if(this._frameId){window.cancelAnimationFrame(this._frameId);this._frameId=undefined;}this._lastFrameTimestamp=undefined;this.fireStateChanged({playing:false,stopped:true,endOfAnimation:this.getTime()>=this.getTotalDuration()});v.getEventBus().publish("sap.ui.vk","animationPlayStateChanged",{source:this,view:this._playbackCollection,playing:false,stopped:true,endOfAnimation:this.getTime()>=this.getTotalDuration()});return this;};c.prototype.activateView=function(d,p){this.stop();this._currentPlayback=undefined;if(!p){this._playbackCollection=d;}else{this._playbackCollection=undefined;}this.setTime(0);if(p){this._playbackCollection=d;}return this;};c.prototype._getAbsoluteTime=function(t,p){if(!this._playbackCollection||!Array.isArray(this._playbackCollection.getPlaybacks())){return-1;}var d=this._playbackCollection.getPlaybacks();if(p<0||p>=d.length){return-1;}var e=this._playbackCollection.getPlayback(p);if(!e||e.getDuration()<t||t<0){return-1;}var f=t;var i=0;while(i<p){var g=d[i].getDuration();f+=g;i++;}return f;};c.prototype._findPlaybackByAbsoluteTime=function(t){if(!this._playbackCollection||!Array.isArray(this._playbackCollection.getPlaybacks())){return undefined;}var p=this._playbackCollection.getPlaybacks();var l=-1;var d=-1;p.forEach(function(f,g){if(f.getStartTime()>d){l=g;d=f.getStartTime();}});var i=0;while(i<p.length){var e=p[i].getDuration();var s=p[i].getStartTime();if((i!==l&&t>=s&&t<(s+e))||(i===l&&t>=s&&t<=(s+e))){return p[i];}i++;}return undefined;};return c;});