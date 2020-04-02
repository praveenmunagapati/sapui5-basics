/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/ui/base/Object","./Utilities","./thirdparty/three","./thirdparty/ColladaLoader","./thirdparty/DecalGeometry","./thirdparty/html2canvas"],function(q,B,U,T,C,D,h){"use strict";var a="sap.ui.vbm.adapter3d.SceneBuilder";var b=q.sap.log;var d=T.Math.degToRad;var c=T.Box3;var F=T.Face3;var M=T.Matrix4;var V=T.Vector2;var f=T.Vector3;var r="_sapRefCount";var g;var n;var o;var x;var y=U.toBoolean;var A=U.toFloat;var E=U.toVector3;var G=U.toColor;var H=U.toDeltaColor;var I=U.applyColor;var J=U.makeDataUri;var K=U.applyColorBorder;var S=B.extend("sap.ui.vbm.adapter3d.SceneBuilder",{constructor:function(e,v){B.call(this);this._context=e;this._viewport=v;this._root=v.getRoot();this._scene=v.getScene();this._textureLoader=null;this._colladaLoader=null;this._decalHelper=null;this._textures=new Map();this._boxGeometryWith4SidedTexture=null;this._boxGeometryWith6SidedTexture=null;this._cylinderGeometryWithCaps=null;this._cylinderGeometry=null;this._cylinderGeometryDefaultSize=0.1;}});S.prototype.destroy=function(){if(this._decalHelper){this._decalHelper.geometry.dispose();this._scene.remove(this._decalHelper);this._decalHelper=null;}this._root=null;this._scene=null;this._viewport=null;this._context=null;B.prototype.destroy.call(this);};S.prototype.synchronize=function(){var t=this;return new Promise(function(e,i){var m=new Map();var j=function(O){if(m.has(O)){m.get(O).refCount+=1;}else{m.set(O,{object3D:null,refCount:1});}};var k=new Set();var l=[];var p=[];var w=sap.ui.vbm.findInArray(t._context.windows,function(w){return w.type==="default";});var s=w&&sap.ui.vbm.findInArray(t._context.scenes,function(s){return s.id===w.refScene;});if(!s){e();return;}t._context.scene=s;if(t._context.setupView){var u=t._context.setupView;t._setupView(u.position,u.zoom,u.pitch,u.yaw,u.home,u.flyTo);t._context.setupView=undefined;}var v=t._context.voQueues.toAdd.get(s)||[];var z=t._context.voQueues.toUpdate.get(s)||[];var L=t._context.voQueues.toRemove.get(s)||[];var N=[].concat(v,z);N.forEach(function(O){if(O.isColladaModel&&O.model&&O.model!==O._lastModel){j(O.model);}if(O.texture&&O.texture!==O._lastTexture){k.add(O.texture);}if(O.textureCap&&O.textureCap!==O._lastTextureCap){k.add(O.textureCap);}if(O.isDecal&&O.text&&(O.text!==O._lastText||O.size!==O._lastSize)){p.push(O);}});t._loadTextures(k).then(function(){return t._loadModels(m);}).then(function(){return t._renderTexts(p);}).then(function(){L.forEach(t._destroyVisualObjectInstance.bind(t));z.forEach(t._updateVisualObjectInstance.bind(t,m,l));v.forEach(t._addVisualObjectInstance.bind(t,m,l));var O=new Map();t._root.traverse(function(P){if(P._sapInstance&&P._sapInstance.dataInstance){var Q=P._sapInstance.voGroup.keyAttributeName;if(Q){var R=P._sapInstance.dataInstance[Q];if(R&&!O.get(R)){O.set(R,P);}var W=P._sapInstance.voGroup.id+"."+R;if(W&&!O.get(W)){O.set(W,P);}}}});l.forEach(function(P){var Q=O.get(P.target);if(Q){var R=t._findMesh(Q);if(R){t._createDecal(P,R);t._assignDecalProperties(P);if(P.object3D){t._scene.add(P.object3D);}}else{b.error("Unable to create decal: target object does not have geometry","",a);}}else{b.error("Unable to create decal: target object is missing","",a);}});t._cleanupCache();e();}).catch(function(O){i(O);});});};S.prototype._findMesh=function(e){var m=null;e.traverse(function(i){if(!m&&i.isMesh){m=i;}});return m;};S.prototype._getGeometrySize=function(){return 2.0;};S.prototype._getZoomFactor=function(p,t){var e=new f();e.subVectors(t,p);return(this._getGeometrySize()*2)/e.length();};S.prototype._setupView=function(p,z,e,i,j,k){var l=new f(0,0,-5);var m=new f(0,0,0);p=p||"0;0;0";var t=p.split(";");p=new f(parseFloat(t[0]),parseFloat(t[1]),parseFloat(t[2]));var s=new f(p.x,p.z,-p.y);this._root.position.copy(s);z=parseFloat(z||"1");if(z===0){z=1;}else if(z<0){z=0.1;}var u=this._getGeometrySize()*2/z;e=parseFloat(e||"0");i=parseFloat(i||"0");e=(e%180===0?e+1:e);var v=new M();v.makeRotationX(d(e+180));var w=new M();w.makeRotationZ(d(-(i+180)));var L=new M();L.multiplyMatrices(w,v);var N=new f();N.subVectors(m,l);N.normalize();N.multiplyScalar(u);N.applyMatrix4(L);var O={zoom:1.0,target:m.clone(),position:new f(-N.x,-N.z,N.y)};if(j){this._viewport._setCameraHome(O);this._viewport._applyCamera(O,k);}else{this._viewport._applyCamera(O,k);}};S.prototype._getDecalTextKey=function(i){return i.size+";"+i.text;};S.prototype._renderTexts=function(i){var p=[];i.forEach(function(e){if(!this._textures.has(this._getDecalTextKey(e))){p.push(this._renderText(e));}},this);return Promise.all(p);};S.prototype._renderText=function(i){var t=this;return new Promise(function(e,j){var s=E(i.size);s=new f(s[0],s[1],s[2]);if(s.length()<1E-6){b.error("Unable render text to html: decal size is invalid","",a);e();}else{var k=512;var l=s.x/s.y;var w=Math.ceil(l>=1?k:k*l);var m=Math.ceil(l<=1?k:k/l);var p=document.createElement("iframe");p.style.visibility="hidden";p.width=w;p.height=m;document.body.appendChild(p);var u=p.contentDocument||p.contentWindow.document;u.open();u.close();u.body.innerHTML=i.text;var v=document.createElement("canvas");v.width=p.width*window.devicePixelRatio;v.height=p.height*window.devicePixelRatio;v.style.width=p.width+"px";v.style.height=p.height+"px";var z=v.getContext("2d");z.scale(window.devicePixelRatio,window.devicePixelRatio);h(u.body,{canvas:v,width:w,height:m,backgroundColor:null}).then(function(L){if(L.width>0&&L.height>0){var N=new T.Texture(L);N.needsUpdate=true;N[r]=0;t._textures.set(t._getDecalTextKey(i),N);}else{b.error("Failed render text to html","",a);}e();});}});};S.prototype._loadTextures=function(t){var p=[];t.forEach(function(e){if(!this._textures.has(e)){p.push(this._loadTexture(e));}},this);return Promise.all(p);};S.prototype._loadTexture=function(t){var e=this;var i=this._context.resources.get(t);if(!i){b.error("Failed to get texture from context: "+t,"",a);return Promise.resolve();}return new Promise(function(j,k){e._getTextureLoader().load(J(i),function(l){l.flipY=false;l[r]=0;e._textures.set(t,l);j();},null,function(l){b.error("Failed to load texture from Data URI: "+t,"status: "+l.status+", status text: "+l.statusText,a);j();});});};S.prototype._loadModels=function(m){var p=[];m.forEach(function(e,i){p.push(this._loadModel(i,e));},this);return Promise.all(p);};S.prototype._loadModel=function(m,e){var t=this;var i=this._context.resources.get(m);if(!i){b.error("Failed to get model from context: "+m,"",a);return Promise.resolve();}return new Promise(function(j,k){if(atob(i.slice(0,8)).startsWith("glTF")){j();}else{try{t._getColladaLoader().parse(atob(i),function(p){o(p.scene);e.object3D=p.scene;p.scene.scale.set(1,1,-1);j();});}catch(l){try{j();}catch(l){b.error("Failed to parse model: "+m,"",a);j();}}}});};S.prototype._releaseTexture=function(t){if(t.hasOwnProperty(r)){t[r]-=1;}else{t.dispose();}return this;};S.prototype._addRefTexture=function(t){if(!t.hasOwnProperty(r)){t[r]=0;}t[r]+=1;return this;};S.prototype._releaseGeometry=function(e){if(e.hasOwnProperty(r)){e[r]-=1;}else{e.dispose();}return this;};S.prototype._addRefGeometry=function(e){if(!e.hasOwnProperty(r)){e[r]=0;}e[r]+=1;return this;};S.prototype._cleanupCache=function(){this._textures.forEach(function(t){if(t[r]===0){t.dispose();this._textures.delete(t);}},this);if(this._boxGeometryWith4SidedTexture&&this._boxGeometryWith4SidedTexture[r]===0){this._boxGeometryWith4SidedTexture.dispose();this._boxGeometryWith4SidedTexture=null;}if(this._boxGeometryWith6SidedTexture&&this._boxGeometryWith6SidedTexture[r]===0){this._boxGeometryWith6SidedTexture.dispose();this._boxGeometryWith6SidedTexture=null;}if(this._cylinderGeometryWithCaps&&this._cylinderGeometryWithCaps[r]===0){this._cylinderGeometryWithCaps.dispose();this._cylinderGeometryWithCaps=null;}if(this._cylinderGeometry&&this._cylinderGeometry[r]===0){this._cylinderGeometry.dispose();this._cylinderGeometry=null;}return this;};S.prototype._destroyVisualObjectInstance=function(i){if(i.object3D){var t=this;i.object3D.traverse(function(e){if(e.isMesh){var j=e.material;var k;[].concat(j).filter(function(m){return m;}).forEach(function(m){k=m.map;if(k){t._releaseTexture(k);m.map=null;}m.dispose();});e.material=null;var l=e.geometry;if(l){t._releaseGeometry(l);e.geometry=null;}}});i.object3D.parent.remove(i.object3D);i.object3D=null;i._lastModel=null;i._lastTexture=null;i._lastTextureCap=null;i._lastTexture6=null;}return this;};S.prototype._updateVisualObjectInstance=function(m,e,i){if(i.isColladaModel){if(i.model!==i._lastModel){this._destroyVisualObjectInstance(i)._addVisualObjectInstance(m,e,i);}this._assignColladaModelProperties(i);}else if(i.isBox){this._assignBoxProperties(i);}else if(i.isCylinder){this._assignCylinderProperties(i);}else if(i.isPolygon){this._destroyVisualObjectInstance(i)._addVisualObjectInstance(m,e,i);}else if(i.isDecal){if(i.position!==i._lastPosition||i.direction!==i._lastDirection||i.rotation!==i._lastRotation||i.size!==i._lastSize||i.target!==i._lastTarget||i.planeOrigin!==i._lastPlaneOrigin||i.planeNormal!==i._lastPlaneNormal){this._destroyVisualObjectInstance(i)._addVisualObjectInstance(m,e,i);}else{this._assignDecalProperties(i);}}return this;};S.prototype._addVisualObjectInstance=function(m,e,i){if(i.isColladaModel){i._lastModel=i.model;var j=m.get(i.model);var k=--j.refCount===0?j.object3D:j.object3D.clone();i.object3D=new T.Group();i.object3D.add(k);if(y(i.normalize)){x(k);}this._assignMaterial(i.object3D,this._createMaterial());this._assignColladaModelProperties(i);}else if(i.isBox){i.object3D=new T.Group();i.object3D.add(new T.Mesh(undefined,this._createMaterial()));this._assignBoxProperties(i);}else if(i.isCylinder){i.object3D=new T.Group();if(i.textureCap){i.object3D.add(new T.Mesh(undefined,[this._createMaterial(true),this._createMaterial(true)]));}else{i.object3D.add(new T.Mesh(undefined,this._createMaterial(true)));}this._assignCylinderProperties(i);}else if(i.isPolygon){i.object3D=new T.Group();i.object3D.add(new T.Mesh(undefined,this._createMaterial(true)));this._assignPolygonProperties(i);}else if(i.isDecal){if(i.target){e.push(i);}else if(i.planeOrigin&&i.planeNormal){var p=this._createPlane(i);if(p){this._root.add(p);this._createDecal(i,p);p.geometry.dispose();this._root.remove(p);this._assignDecalProperties(i);}}else{b.error("unable to create decal: no target or no plane defined","",a);}}if(i.object3D){if(i.isDecal){this._scene.add(i.object3D);}else{this._root.add(i.object3D);}}return this;};S.prototype._assignColladaModelProperties=function(i){this._assignProperties(i);return this;};S.prototype._assignDecalProperties=function(i){if((i._lastTexture&&i._lastTexture!==i.texture)||(i._lastText&&i._lastText!==i.text)){this._removeTexture(i);}if(i.texture||i.text){this._assignTexture(i,true);}i._lastText=i.text;i._lastTexture=i.texture;return this;};S.prototype._assignBoxProperties=function(i){if(i._lastTexture6!==i.texture6){var e=i.object3D.children[0];if(e.geometry){this._releaseGeometry(e.geometry);}e.geometry=this._getBoxGeometry(y(i.texture6));this._addRefGeometry(e.geometry);if(y(i.normalize)){x(e);}i._lastTexture6=i.texture6;}if(i._lastColorBorder&&i._lastColorBorder!==i.colorBorder){this._removeColorBorder(i);}if(i.colorBorder&&i._lastColorBorder!==i.colorBorder){this._assignColorBorder(i);}i._lastColorBorder=i.colorBorder;this._assignProperties(i);return this;};S.prototype._assignCylinderProperties=function(i){if(i._lastTexture!==i.texture){var e=i.object3D.children[0];if(e.geometry){this._releaseGeometry(e.geometry);}e.geometry=this._getCylinderGeometry(y(i.isOpen));this._addRefGeometry(e.geometry);if(y(i.normalize)){x(e);}i._lastTexture=i.texture;i._lastTextureCap=i.textureCap;}if(i._lastColorBorder&&i._lastColorBorder!==i.colorBorder){this._removeColorBorder(i);}if(i.colorBorder&&i._lastColorBorder!==i.colorBorder){this._assignColorBorder(i);}i._lastColorBorder=i.colorBorder;this._assignProperties(i);return this;};S.prototype._createDecal=function(i,t){this._root.updateMatrixWorld(true);var p=E(i.position);p=new f(p[0],p[1],p[2]);var e=E(i.direction);e=new f(e[0],e[1],e[2]);e.normalize();if(e.length()<1E-6){b.error("Unable create decal: direction is invalid","",a);return;}var j=d(A(i.rotation));var s=E(i.size);s=new f(s[0],s[1],s[2]);if(s.length()<1E-6){b.error("Unable create decal: size is invalid","",a);return;}p.applyMatrix4(t.matrixWorld);e.transformDirection(t.matrixWorld);var k=new T.Raycaster(p,e);var l=k.intersectObject(t);if(!l.length){b.error("Unable create decal: cannot project decal to plane","",a);return;}if(!this._decalHelper){this._decalHelper=new T.Mesh(new T.BoxBufferGeometry(1,1,5));this._decalHelper.visible=false;this._decalHelper.up.set(0,1,0);this._scene.add(this._decalHelper);}var m=l[0];var u=m.point;var v=e.clone().negate();var w=new c().setFromObject(t);var z=w.max.clone().sub(w.min).length();v.multiplyScalar(z);v.add(u);this._decalHelper.position.copy(u);this._decalHelper.lookAt(v);this._decalHelper.rotation.z+=j;var L=new T.MeshPhongMaterial({specular:0x444444,shininess:0,transparent:true,depthTest:true,depthWrite:false,polygonOffset:true,polygonOffsetUnits:0.1,polygonOffsetFactor:-1});i.object3D=new T.Mesh(new T.DecalGeometry(t,u,this._decalHelper.rotation,s),L);i._lastPosition=i.position;i._lastDirection=i.direction;i._lastRotation=i.rotation;i._lastSize=i.size;i._lastTarget=i.target;};S.prototype._createPlane=function(i){var e=E(i.planeOrigin);e=new f(e[0],e[1],e[2]);var j=E(i.planeNormal);j=new f(j[0],j[1],j[2]);j.normalize();if(j.length()<1E-6){b.error("Unable to create plane for decal: normal is invalid","",a);return null;}var k=new f(j.x===0?10:-j.x,j.y===0?-10:j.y,j.z===0?10:-j.z);var p=e.clone(e).add(k);p.sub(j.clone().multiplyScalar(j.dot(p.clone().sub(e))));var P=10000;k=p.clone().sub(e).normalize();var l=j.clone().cross(k).normalize();k.multiplyScalar(P);l.multiplyScalar(P);var m=e.clone().add(k);var s=e.clone().sub(k);var t=e.clone().add(l);var u=e.clone().sub(l);var v=new T.Geometry();v.vertices.push(m,t,s,u);v.faces.push(new F(0,1,2,j),new F(2,3,0,j));i._lastPlaneOrigin=i.planeOrigin;i._lastPlaneNormal=i.planeNormal;return new T.Mesh(v);};S.prototype._getPolygonGeometry=function(m,O,z){var L=function(e,p){var i=function(v,s,u){return Math.abs((v.x*(s.y-u.y)+s.x*(u.y-v.y)+u.x*(v.y-s.y))/2);};var t=i(e.vertex1,e.vertex2,e.vertex3);var j=i(p,e.vertex2,e.vertex3);var k=i(e.vertex1,p,e.vertex3);var l=i(e.vertex1,e.vertex2,p);return t===j+k+l;};var N=function(e,u,v,w,i,j,k){var l;var s=1.00000001e-10;var t={vertex1:{x:0.0,y:0.0},vertex2:{x:0.0,y:0.0},vertex3:{x:0.0,y:0.0}};if(j.x){t.vertex1.x=e[k[u]].y;t.vertex1.y=e[k[u]].z;t.vertex2.x=e[k[v]].y;t.vertex2.y=e[k[v]].z;t.vertex3.x=e[k[w]].y;t.vertex3.y=e[k[w]].z;l=Math.sign(j.x);}else if(j.y){t.vertex1.x=e[k[u]].z;t.vertex1.y=e[k[u]].x;t.vertex2.x=e[k[v]].z;t.vertex2.y=e[k[v]].x;t.vertex3.x=e[k[w]].z;t.vertex3.y=e[k[w]].x;l=Math.sign(j.y);}else if(j.z){t.vertex1.x=e[k[u]].x;t.vertex1.y=e[k[u]].y;t.vertex2.x=e[k[v]].x;t.vertex2.y=e[k[v]].y;t.vertex3.x=e[k[w]].x;t.vertex3.y=e[k[w]].y;l=Math.sign(j.z);}var b1=l*(((t.vertex2.x-t.vertex1.x)*(t.vertex3.y-t.vertex1.y))-((t.vertex2.y-t.vertex1.y)*(t.vertex3.x-t.vertex1.x)));if(b1<s){return false;}var c1={x:0.0,y:0.0};for(var p=0;p<i;p++){if((p===u)||(p===v)||(p===w)){continue;}if(j.x){c1.x=e[k[p]].y;c1.y=e[k[p]].z;}else if(j.y){c1.x=e[k[p]].z;c1.y=e[k[p]].x;}else if(j.z){c1.x=e[k[p]].x;c1.y=e[k[p]].y;}if(L(t,c1)){return false;}}return true;};var P=function(e,p){var b1=[];if(e.length<3){return b1;}var c1=1;if(p.x){c1=Math.sign(p.x);}else if(p.y){c1=Math.sign(p.y);}else if(p.z){c1=Math.sign(p.z);}var d1=function(e){var i1=0.0;for(var i=e.length-1,j=0;j<e.length;i=j++){if(p.x){i1+=e[i].y*e[j].z-e[i].z*e[j].y;}else if(p.y){i1+=e[i].z*e[j].x-e[i].x*e[j].z;}else if(p.z){i1+=e[i].x*e[j].y-e[i].y*e[j].x;}}return i1*0.5;};var e1=c1*d1(e);var f1=[];if(0.0<e1){for(var j=0;j<e.length;j++){f1[j]=j;}}else{for(var k=0;k<e.length;k++){f1[k]=(e.length-1)-k;}}var g1=e.length;var h1=2*g1;for(var l=0,v=g1-1;g1>2;){if(0>=h1--){b.error(e.map(function(v){return v.x+":"+v.y+":"+v.z;}).join(";")+" do not form a simple polygon");}var u=v;if(g1<=u){u=0;}v=u+1;if(g1<=v){v=0;}var w=v+1;if(g1<=w){w=0;}if(N(e,u,v,w,g1,p,f1)){var s,t;b1.push(f1[u]);b1.push(f1[w]);b1.push(f1[v]);l++;for(s=v,t=v+1;t<g1;s++,t++){f1[s]=f1[t];}g1--;h1=2*g1;}}return b1;};var Q=function(m,O){var e={x:parseFloat("0.0"),y:parseFloat("0.0"),z:parseFloat("1.0")};var v=[];if(O){var i=O.split(";").map(parseFloat);if(i.length===3){e={x:i[0],y:i[1],z:i[2]};}}if(m){var j=m.split(";").map(parseFloat);while(j.length>0){var k=j.splice(0,3);v.push({x:k[0],y:k[1],z:k[2]})}}return P(v,e);};var R=O?O.split(";").map(parseFloat):[0.0,0.0,1];var W=G(z);var X=[];X.push(W.rgb.r,W.rgb.g,W.rgb.b);var Y=[];var Z=[];var $=[];m.split(";").forEach(function(e,i){Y.push(parseFloat(e));Z.push(R[i%3]);$.push(X[i%3]);});var _=new T.BufferGeometry();var a1=Q(m,O);_.setIndex(a1);_.addAttribute("position",new T.Float32BufferAttribute(Y,3));_.addAttribute("normal",new T.Float32BufferAttribute(Z,3));_.addAttribute("color",new T.Float32BufferAttribute($,3));_.computeBoundingSphere();_.computeVertexNormals();return _;};S.prototype._assignPolygonProperties=function(i){var e=i.object3D.children[0];e.geometry=this._getPolygonGeometry(i.posarray,i.OuterNormal,i.color);if(i._lastColorBorder&&i._lastColorBorder!==i.colorBorder){this._removeColorBorder(i);}if(i.colorBorder&&i._lastColorBorder!==i.colorBorder){this._assignColorBorder(i);}i._lastColorBorder=i.colorBorder;this._assignProperties(i);return this;};S.prototype._assignProperties=function(i){if(i._lastTexture&&i._lastTexture!==i.texture){this._removeTexture(i);}if(i.texture){this._assignTexture(i);}i._lastTexture=i.texture;I(i,i[y(i["VB:s"])?"selectColor":"color"]);var s=E(i.scale);i.object3D.scale.set(s[0],s[1],s[2]);var e=E(i.rot);i.object3D.rotation.set(d(e[0]),d(e[1]),d(e[2]),"YXZ");var j;if(i.isBox||i.isCylinder){j=new f(0,0,-1);}else if(i.isPolygon){j=new f(0,0,0);}else{var k=i.object3D.children[0].vbBox;j=new f(0,0,-1.0*(k.min.z>0?k.min.z:k.max.z));}var m=new M();m.makeRotationFromEuler(new T.Euler(d(e[0]),d(e[1]),d(e[2]),"YXZ"));var l=new M();l.makeScale(s[0],s[1],s[2]);l.multiply(m);j.applyMatrix4(l);j.z=-j.z;var p=E(i.pos);var t=new f(p[0],p[1],p[2]);t.sub(j);i.object3D.position.set(t.x,t.y,t.z);i.object3D.traverse(function(u){u._sapInstance=i;});return this;};S.prototype._removeTexture=function(e){if(e.object3D){var t=this;e.object3D.traverse(function(j){if(j.isMesh&&j.material&&j.material.map){t._releaseTexture(j.material.texture);j.material.map=null;}else if(j.isMesh&&j.material&&j.material.length!=0){for(var i=0;i<j.material.length;i++){t._releaseTexture(j.material[i].texture||j.material[i].map);j.material[i].map=null;}}});}return this;};S.prototype._assignTexture=function(i,e){var t=this;var j,k;if(i.object3D){j=this._textures.get(i.texture);if(i.isDecal&&i.text){j=this._textures.get(this._getDecalTextKey(i));}if(i.isCylinder&&i.textureCap){k=this._textures.get(i.textureCap);}i.object3D.traverse(function(l){if(l.isMesh&&l.material){if(e){j.flipY=e;}if(i.isCylinder&&i.textureCap){l.material[0].map=j;l.material[1].map=k;t._addRefTexture(j);t._addRefTexture(k);}else{l.material.map=j;t._addRefTexture(j);}}});}return this;};S.prototype._removeColorBorder=function(i){if(i.object3D){i.object3D.traverse(function(e){var w=sap.ui.vbm.findIndexInArray(e.children,function(k){return k.isLineSegments;});if(w!==-1){var j=e.children[w];e.remove(j);j.geometry.dispose();j.material.dispose();j=undefined;}});}return this;};S.prototype._assignColorBorder=function(i){var m=i.object3D.children[0];if(i.isCylinder){m.add(new T.LineSegments(new T.EdgesGeometry(m.geometry,60),this._createLineBasicMaterial()));}else{m.add(new T.LineSegments(new T.EdgesGeometry(m.geometry),this._createLineBasicMaterial()));}K(i,i.colorBorder);return this;};S.prototype._createMaterial=function(e){return new T.MeshPhongMaterial({shininess:1,specular:0x101009,side:e?T.DoubleSide:T.FrontSide});};S.prototype._createLineBasicMaterial=function(){return new T.LineBasicMaterial({linewidth:1});};S.prototype._assignMaterial=function(e,m){e.traverse(function(i){if(i.isMesh){i.material=m;}});return this;};S.prototype._getBoxGeometry=function(e){var i=e?"_boxGeometryWith6SidedTexture":"_boxGeometryWith4SidedTexture";return this[i]||(this[i]=g(e));};S.prototype._getCylinderGeometry=function(i){var e;if(i){e="_cylinderGeometryWithCaps";}else{e="_cylinderGeometry";}return this[e]||(this[e]=n(i));};S.prototype._getTextureLoader=function(){return this._textureLoader||(this._textureLoader=new T.TextureLoader());};S.prototype._getColladaLoader=function(){return this._colladaLoader||(this._colladaLoader=new C());};o=function(e){var i=[];e.traverse(function(j){if(j.isLight||j.isCamera){i.push(j);}});i.forEach(function(j){while(j&&j!==e){var p=j.parent;if(j.children.length===0){p.remove(j);}j=p;}});return e;};x=function(e){var i=new c().setFromObject(e);var j=i.getCenter();i.min.sub(new f(j.x,j.y,-j.z));i.max.sub(new f(j.x,j.y,-j.z));var s=Math.max(Math.abs(i.min.x),Math.abs(i.min.y),Math.abs(i.min.z),Math.abs(i.max.x),Math.abs(i.max.y),Math.abs(i.max.z));if(s){s=1/s;}i.min.set(i.min.x*s,i.min.y*s,-i.min.z*s);i.max.set(i.max.x*s,i.max.y*s,-i.max.z*s);U.swap(i,"min","max");e.vbBox=i;var m=new M().makeScale(s,s,s);var k=new M().makeTranslation(-j.x,-j.y,-j.z);e.updateMatrix();m.multiply(k);m.multiply(e.matrix);m.decompose(e.position,e.quaternion,e.scale);return e;};g=function(e){var i=new T.Geometry();var j=0.1;i.vertices.push(new f(j,j,-j),new f(j,-j,-j),new f(-j,-j,-j),new f(-j,j,-j),new f(j,j,j),new f(-j,j,j),new f(-j,-j,j),new f(j,-j,j),new f(j,j,-j),new f(j,j,j),new f(j,-j,j),new f(j,-j,-j),new f(j,-j,-j),new f(j,-j,j),new f(-j,-j,j),new f(-j,-j,-j),new f(-j,-j,-j),new f(-j,-j,j),new f(-j,j,j),new f(-j,j,-j),new f(j,j,j),new f(j,j,-j),new f(-j,j,-j),new f(-j,j,j));var k=new T.Color(0.5,0.5,0.5);i.faces.push(new F(0,2,3,new f(0,0,-1),k),new F(0,1,2,new f(0,0,-1),k),new F(4,5,6,new f(0,0,1),k),new F(4,6,7,new f(0,0,1),k),new F(8,10,11,new f(1,0,0),k),new F(8,9,10,new f(1,0,0),k),new F(12,14,15,new f(0,-1,0),k),new F(12,13,14,new f(0,-1,0),k),new F(16,18,19,new f(-1,0,0),k),new F(16,17,18,new f(-1,0,0),k),new F(20,22,23,new f(0,1,0),k),new F(20,21,22,new f(0,1,0),k));var u;if(e){u=[new V(2/3,0.5),new V(1.0,0.5),new V(1.0,1.0),new V(2/3,1.0),new V(2/3,0.5),new V(2/3,0.0),new V(1.0,0.0),new V(1.0,0.5),new V(2/3,0.5),new V(2/3,1.0),new V(1/3,1.0),new V(1/3,0.5),new V(2/3,0.0),new V(2/3,0.5),new V(1/3,0.5),new V(1/3,0.0),new V(1/3,0.5),new V(1/3,1.0),new V(0.0,1.0),new V(0.0,0.5),new V(0.0,0.5),new V(0.0,0.0),new V(1/3,0.0),new V(1/3,0.5)];}else{u=[new V(0.5,0.5),new V(1.0,0.5),new V(1.0,1.0),new V(0.5,1.0),new V(0.5,0.5),new V(1.0,0.5),new V(1.0,1.0),new V(0.5,1.0),new V(0.5,0.5),new V(0.5,1.0),new V(0.0,1.0),new V(0.0,0.5),new V(0.5,0.5),new V(0.5,0.0),new V(1.0,0.0),new V(1.0,0.5),new V(0.5,0.5),new V(0.5,1.0),new V(0.0,1.0),new V(0.0,0.5),new V(0.0,0.5),new V(0.0,0.0),new V(0.5,0.0),new V(0.5,0.5)];}i.faceVertexUvs[0].push([u[0],u[2],u[3]],[u[0],u[1],u[2]],[u[5],u[6],u[7]],[u[5],u[7],u[4]],[u[8],u[10],u[11]],[u[8],u[9],u[10]],[u[12],u[14],u[15]],[u[12],u[13],u[14]],[u[16],u[18],u[19]],[u[16],u[17],u[18]],[u[20],u[22],u[23]],[u[20],u[21],u[22]]);return i;};n=function(i){var e=0.1;var j=new T.CylinderGeometry(e,e,2*e,32,1,i);if(!i){var k=e/2;for(var z=0;z<j.faces.length;z++){var l=j.faces[z];if(l.normal.y!==0){j.faceVertexUvs[0][z][0].u=(j.vertices[l.a].x+k)/e;j.faceVertexUvs[0][z][0].v=(j.vertices[l.a].z+k)/e;j.faceVertexUvs[0][z][1].u=(j.vertices[l.b].x+k)/e;j.faceVertexUvs[0][z][1].v=(j.vertices[l.b].z+k)/e;j.faceVertexUvs[0][z][2].u=(j.vertices[l.c].x+k)/e;j.faceVertexUvs[0][z][2].v=(j.vertices[l.c].z+k)/e;l.materialIndex=1;}else{l.materialIndex=0;}}}return j;};return S;});