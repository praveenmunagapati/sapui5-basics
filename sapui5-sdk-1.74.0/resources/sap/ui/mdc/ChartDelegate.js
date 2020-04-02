/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/base/SyncPromise","sap/ui/mdc/chart/MeasureItem","sap/ui/mdc/chart/DimensionItem"],function(S,M,D){"use strict";var C={};C.Metadata={items:[],properties:[],sortable:true,filterable:true};C.MetadataProperty={kind:"",role:"",contextDefiningProperties:[],className:"",aggregationMethod:"","default":true,custom:false,name:"",propertyPath:"",label:"",textProperty:"",sortable:true,sortDirection:"",filterable:true,allowedExpressions:[]};C.retrieveAllMetadata=function(c){return Promise.resolve(C.Metadata);};C.fetchProperties=function(c){var p=[this.MetadataProperty];return Promise.resolve(p);};C.retrieveAggregationItem=function(a,m){return{};};C.createChartItem=function(n,c,r){return this.fetchProperties(c).then(function(p){var P=p.find(function(b){return b.name===n;});if(!P){return null;}var o=null,i=c.getId()+"--"+n,s="create"+P.kind+"Item",I=this[s];if(typeof I==="function"){var a=this.retrieveAggregationItem(P.kind,P).settings;o=I.call(this,i,a);if(r){o.setRole(r);}}return o;}.bind(this));};C.createDimensionItem=function(i,s){return new D(i,s);};C.createMeasureItem=function(i,s){return new M(i,s);};C.beforeAddItem=function(p,c,P,r){if(typeof c.getModel==="function"){return this.createChartItem(p,c,r);}return S.resolve(null);};C.afterRemoveItem=function(c,o,p){return S.resolve(true);};return C;});