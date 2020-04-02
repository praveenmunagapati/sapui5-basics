// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/utils/type","sap/base/util/ObjectPath"],function(t,O){"use strict";var r={};r.getGroupsArrayFromSite=function(s){var l=[];s.site.payload.groupsOrder.forEach(function(g,i){var G=s.groups[g];if(G){G.payload=G.payload||{};l.push(G);}});return l;};r.getGroupsMapFromSite=function(s){return s.groups;};r.getGroupIdsFromSite=function(s){return s.site.payload.groupsOrder;};r.getGroupFromSite=function(s,g){return s.groups[g];};r.getDefaultGroup=function(g){var d=g.filter(function(G){return G.payload.hasOwnProperty("isDefaultGroup");});if(d.length>0){return d[0];}return undefined;};r.getGroupId=function(g){return g.identification&&g.identification.id;};r.getGroupTitle=function(g){return g.identification.title;};r.isGroupPreset=function(g){if(!g.payload.hasOwnProperty("isPreset")){return true;}return!!g.payload.isPreset;};r.isGroupLocked=function(g){return!!g.payload.locked;};r.isGroupVisible=function(g){return!!(g.identification.isVisible===undefined||g.identification.isVisible===true);};r.getGroupTiles=function(g){if(g.payload.tiles&&t.isArray(g.payload.tiles)&&g.payload.tiles.length>0){return g.payload.tiles;}return[];};r.getGroupLinks=function(g){if(g.payload.links&&t.isArray(g.payload.links)&&g.payload.links.length>0){return g.payload.links;}return[];};r.getTileId=function(T){return T.id;};r.getTileVizId=function(T){return T.vizId;};r.getTileTitle=function(R,T){var o;if(T&&T.isBookmark){return T.title;}o=R[T.id];if(o){return T.title||o.tileResolutionResult.title;}return undefined;};r.getTileSubtitle=function(R,T){var o;if(T.isBookmark){return T.subTitle;}o=R[T.id];if(o){return T.subTitle||o.tileResolutionResult.subTitle;}return undefined;};r.getTileInfo=function(R,T){var o;if(T.isBookmark){return T.info;}o=R[T.id];return T.info||o.tileResolutionResult.info;};r.getTileIcon=function(R,T){var o;if(T.isBookmark){return T.icon;}o=R[T.id];if(o){return T.icon||o.tileResolutionResult.icon;}return undefined;};r.getTileIndicatorDataSource=function(R,T){var o;if(T.isBookmark){return T.icon;}o=R[T.id];if(o){return T.icon||o.tileResolutionResult.icon;}return undefined;};r.getTileSize=function(R,T){var o=R[T.id];if(o&&o.tileResolutionResult&&o.tileResolutionResult.size){return o.tileResolutionResult.size;}};r.isLink=function(R,T){var o=R[T.id];if(o){return!!o.isLink;}return false;};r.isCard=function(R,i){var o=R[i.id];if(o){return!!o.tileResolutionResult.isCard;}return false;};r.isGroupTile=function(T){return!!(T&&T.id&&!T.isCatalogTile);};r.supportsFormFactor=function(a,f){return a.deviceTypes&&a.deviceTypes[f];};r.getInbound=function(a,i){var I=O.get(["sap.app","crossNavigation","inbounds",i],a);return I&&{key:i,inbound:I};};return r;},true);