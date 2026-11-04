(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,49440,e=>{"use strict";var t=e.i(43476),a=e.i(71645);e.s(["default",0,function(){let[e,r]=(0,a.useState)(!1);return(0,a.useEffect)(()=>{window.dispatchEvent(new CustomEvent("pyranthus:motion",{detail:{paused:e}}))},[e]),(0,t.jsx)("button",{className:"field-control",type:"button","aria-pressed":e,onClick:()=>r(!e),children:e?"Play background":"Pause background"})}])},64885,e=>{"use strict";var t=e.i(71645),a=["#0d0c0b","#16120f","#221511","#361a11","#521f12","#7b2915","#b23a1d","#ff5b2b","#ff8f63"],r=2/3,n=1e3/30,i=`
precision highp float;
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uAspect;
uniform float uSeed;
uniform float uWell;
uniform vec3 uRamp[16];
uniform float uSteps;
uniform float uBloom;
uniform vec4 uFlower;
uniform sampler2D uMask;
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){
  vec2 i=floor(p);vec2 f=fract(p);vec2 u=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),u.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),u.x),u.y);
}
float fbm(vec2 p){
  float v=0.0;float a=0.5;mat2 m=mat2(1.62,1.18,-1.18,1.62);
  for(int i=0;i<5;i++){v+=a*noise(p);p=m*p;a*=0.5;}
  return v;
}
float b2(float x,float y){return mod(2.0*x+3.0*y,4.0);}
float bayer4(vec2 p){
  float x=floor(mod(p.x,4.0));float y=floor(mod(p.y,4.0));
  return (4.0*b2(mod(x,2.0),mod(y,2.0))+b2(floor(x/2.0),floor(y/2.0)))/16.0;
}
vec3 ramp(float idx){
  vec3 c=uRamp[0];
  for(int i=1;i<16;i++){if(float(i)<=idx)c=uRamp[i];}
  return c;
}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  vec2 p=(uv-0.5)*uAspect*2.5+uSeed;
  float t=uTime*0.11;
  vec2 q=vec2(fbm(p+vec2(0.0,t)),fbm(p+vec2(5.2,-t*0.8)));
  vec2 r=vec2(fbm(p+2.6*q+vec2(1.7,9.2)+t*0.22),fbm(p+2.6*q+vec2(8.3,2.8)-t*0.17));
  float f=fbm(p+3.1*r);
  float ripple=sin((r.x*3.4+r.y*2.2+f*5.6)*3.6-t*2.6);
  float ripple2=sin((q.x-q.y)*6.2+t*1.7);
  float v=0.03+f*0.54+ripple*0.26+ripple2*0.09;
  float lift=1.0-clamp(distance(uv,vec2(0.24,0.84))*0.95,0.0,1.0);
  v+=0.08*pow(lift,2.2);
  v-=0.08*pow(1.0-clamp(distance(uv,vec2(0.86,0.12))*1.4,0.0,1.0),1.4);
  float centre=distance(uv,vec2(0.5));
  v-=uWell*0.34*smoothstep(0.42,0.02,centre);
  float glint=noise(p*1.7+vec2(t*0.9,-t*0.6));
  float crest=smoothstep(0.94,1.0,ripple)*0.85;
  if(uBloom>0.0){
    vec2 fu=(gl_FragCoord.xy-uFlower.xy)/uFlower.z+0.5;
    vec2 mk=texture2D(uMask,fu).rg;
    float b=uBloom;
    // Each cell inside the petals gets a fixed random threshold, so as bloom
    // rises the embers light up scattered and fill the flower, and drop out
    // the same way as it falls. glint keeps the edge of the fill moving.
    float inside=smoothstep(0.42,0.58,mk.r);
    float rnd=hash(floor(gl_FragCoord.xy)+vec2(17.0,3.0));
    float m=inside*step(rnd*0.86+0.14*glint,b);
    // Cool the fire around and between the petals so the seams read.
    v*=1.0-b*(0.35+0.5*mk.g*(1.0-m));
    v=max(v,m*uFlower.w*(0.94+0.2*(f-0.45)));
    crest*=1.0-b*mk.g*(1.0-m);
  }
  v=pow(clamp(v,0.0,1.0),1.55);
  crest*=mix(0.4,1.0,smoothstep(0.3,0.7,glint));
  crest*=mix(0.55,1.0,smoothstep(0.1,0.45,v));
  crest*=mix(1.0,smoothstep(0.22,0.42,centre),uWell);
  float d=bayer4(gl_FragCoord.xy);
  float n=uSteps-1.0;
  float s=v*n*0.75;
  float knee=n*0.5;
  if(s>knee)s=knee+(s-knee)*1.3;
  float idx=clamp(floor(s+d),0.0,n);
  float h=floor(crest*2.0+d);
  if(h>1.5)idx=n;
  else if(h>0.5)idx=max(idx,n-floor(n/4.0+0.5));
  gl_FragColor=vec4(ramp(idx),1.0);
}`;function o(e,t,a){var r=e.createShader(t);return r?(e.shaderSource(r,a),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS))?r:(console.warn("[stacked-dither]",e.getShaderInfoLog(r)),null):null}function l(e,t){return e.addEventListener?e.addEventListener("change",t):e.addListener(t),function(){e.removeEventListener?e.removeEventListener("change",t):e.removeListener(t)}}function s(e,t,a,r){for(var n=e,i=new Float32Array(n.length),o=0;o<r;o++)for(var l=0;l<2;l++){for(var s=0;s<t;s++)for(var c=0;c<t;c++){for(var d=0,u=-a;u<=a;u++){var f=l?c:Math.min(t-1,Math.max(0,c+u));d+=n[(l?Math.min(t-1,Math.max(0,s+u)):s)*t+f]}i[s*t+c]=d/(2*a+1)}var m=n;n=i,i=m}return n}function c(){for(var e=new Float32Array(16384),t=0;t<128;t++)for(var a=0;a<128;a++){var r=(a+.5)/128-.5,n=.5-(t+.5)/128,i=Math.sqrt(r*r+n*n)/.42,o=Math.atan2(r,n);e[128*t+a]=+(i<=Math.sqrt(Math.abs(Math.cos(2.5*o)))&&i>.08)}return e}function d(e){return .5-.5*Math.cos(Math.PI*Math.min(1,Math.max(0,e)))}function u(e){e.style.backgroundImage="url(/ember-poster.png)",e.style.backgroundSize="cover",e.style.backgroundPosition="right center"}let f=function(e){var t=window.__ember={frames:0,cells:0,bloom:0,mask:"none"},f=window.matchMedia("(max-width: 640px)"),m=window.matchMedia("(prefers-reduced-motion: reduce)"),h=e.parentNode;e.style.backgroundColor=a[0],e.style.imageRendering="pixelated";var v=null;try{v=e.getContext("webgl",{antialias:!1,alpha:!1,depth:!1,stencil:!1})}catch(e){v=null}if(!v)return u(e);var p=v.createProgram(),g=o(v,v.VERTEX_SHADER,"attribute vec2 aPos;void main(){gl_Position=vec4(aPos,0.0,1.0);}"),x=o(v,v.FRAGMENT_SHADER,i);if(!p||!g||!x)return u(e);if(v.attachShader(p,g),v.attachShader(p,x),v.bindAttribLocation(p,0,"aPos"),v.linkProgram(p),!v.getProgramParameter(p,v.LINK_STATUS))return console.warn("[stacked-dither]",v.getProgramInfoLog(p)),u(e);function y(){cancelAnimationFrame(G),G=0,P=!0,u(e)}v.useProgram(p),e.addEventListener("webglcontextlost",y);var b=v.createBuffer();v.bindBuffer(v.ARRAY_BUFFER,b),v.bufferData(v.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),v.STATIC_DRAW),v.enableVertexAttribArray(0),v.vertexAttribPointer(0,2,v.FLOAT,!1,0,0);var w={};["uTime","uRes","uAspect","uSeed","uWell","uRamp","uSteps","uBloom","uFlower","uMask"].forEach(function(e){w[e]=v.getUniformLocation(p,e)});var R=new Float32Array(48);a.forEach(function(e,t){var a;R.set([((a=parseInt(e.slice(1),16))>>16)/255,(a>>8&255)/255,(255&a)/255],3*t)}),v.uniform3fv(w.uRamp,R),v.uniform1f(w.uSteps,a.length),v.uniform1f(w.uSeed,0),v.uniform1f(w.uWell,0),v.uniform1i(w.uMask,0);var E=v.createTexture(),_=!1;function T(e,a){P||(v.bindTexture(v.TEXTURE_2D,E),v.texParameteri(v.TEXTURE_2D,v.TEXTURE_MIN_FILTER,v.LINEAR),v.texParameteri(v.TEXTURE_2D,v.TEXTURE_MAG_FILTER,v.LINEAR),v.texParameteri(v.TEXTURE_2D,v.TEXTURE_WRAP_S,v.CLAMP_TO_EDGE),v.texParameteri(v.TEXTURE_2D,v.TEXTURE_WRAP_T,v.CLAMP_TO_EDGE),v.texImage2D(v.TEXTURE_2D,0,v.RGBA,128,128,0,v.RGBA,v.UNSIGNED_BYTE,function(e){for(var t=s(function(e){for(var t=e,a=0;a<2;a++){for(var r=new Float32Array(t.length),n=0;n<128;n++)for(var i=0;i<128;i++){for(var o=1,l=-2;l<=2;l++){var s=a?i:Math.min(127,Math.max(0,i+l));o=Math.min(o,t[(a?Math.min(127,Math.max(0,n+l)):n)*128+s])}r[128*n+i]=o}t=r}return t}(e),128,1,1),a=s(e,128,4,3),r=new Uint8Array(65536),n=0;n<16384;n++){var i=((127-Math.floor(n/128))*128+n%128)*4;r[i]=Math.round(255*Math.min(1,t[n])),r[i+1]=Math.round(255*Math.min(1,1.6*a[n])),r[i+3]=255}return r}(e)),_=!0,t.mask=a,Y())}var M=new Image;M.onload=function(){var e=null;try{e=function(e){var t=document.createElement("canvas");t.width=t.height=128;var a=t.getContext("2d");if(!a)return null;a.drawImage(e,10,10,108,108);for(var r=a.getImageData(0,0,128,128).data,n=new Float32Array(16384),i=0,o=0;o<n.length;o++)n[o]=r[4*o+3]/255,i+=n[o];return i>.1*n.length&&i<.8*n.length?n:null}(M)}catch(t){e=null}T(e||c(),e?"mark":"rose")},M.onerror=function(){T(c(),"rose")},M.src="/pyranthus-P2-ember.svg";var A=0,S=0,j=0,G=0,k=!0,N=!1,P=!1;function Y(){if(!P){var e,a=m.matches,r=_?a?1:(e=(S+3)%13.5)<7?0:(e-=7)<2.5?d(e/2.5):(e-=2.5)<1.5?1:1-d((e-1.5)/2.5):0;t.bloom=r,v.uniform1f(w.uTime,a?20:A),v.uniform1f(w.uBloom,r),v.drawArrays(v.TRIANGLES,0,3),t.frames++}}function F(){if(!P&&!P){var a=e.getBoundingClientRect();if(!(a.width<1)&&!(a.height<1)){var r=f.matches?5:4,n=Math.max(2,Math.round(a.width/r)),i=Math.max(2,Math.round(a.height/r));if(!function(e,a){var r,n,i,o;if(f.matches){var l=function(e){var t=e.width,a=e.height,r=h&&h.querySelector("[data-ember-avoid]"),n=.62*a,i=.75*a,o=.62*t;if(r){var l=r.getBoundingClientRect();n=l.top-e.top,i=l.bottom-e.top,o=0;for(var s=0;s<r.children.length;s++)o=Math.max(o,r.children[s].getBoundingClientRect().right-e.left)}var c=o+12,d=t-8,u=n-20,f=a-10,m=Math.min(150,(d-c)/.84,(f-u)/.84);return m>=112?{cx:(c+d)/2,cy:(u+f)/2,size:m}:(u=i+6,{cx:d-.84*(m=Math.min(150,((f=a-6)-u)/.84))*.5,cy:(u+f)/2,size:m})}(e);i=l.size,r=l.cx,n=e.height-l.cy,o=1.3,h&&(h.style.setProperty("--flower-x",l.cx.toFixed(1)+"px"),h.style.setProperty("--flower-y",l.cy.toFixed(1)+"px"),h.style.setProperty("--flower-r",(.5*l.size).toFixed(1)+"px")),t.flower=[Math.round(l.cx),Math.round(l.cy),Math.round(l.size)]}else i=Math.min(.56*e.height,.32*e.width),r=.76*e.width,n=.52*e.height,o=.94,h&&["--flower-x","--flower-y","--flower-r"].forEach(function(e){h.style.removeProperty(e)}),t.flower=null;v.uniform4f(w.uFlower,r/a,n/a,i/a,o)}(a,a.width/n),n===e.width&&i===e.height&&t.cells)return Y();e.width=n,e.height=i,t.cells=n*i,v.viewport(0,0,n,i),v.uniform2f(w.uRes,n,i);var o=a.width/a.height;v.uniform2f(w.uAspect,o>=1?o:1,o>=1?1:1/o),Y()}}}function L(e){if(G=requestAnimationFrame(L),!(e-j<n-1)){var t=Math.min(.1,(e-j)/1e3);j=e,A+=t*r,S+=t,Y()}}function Q(){cancelAnimationFrame(G),G=0,P||N||!k||document.hidden||m.matches||(j=performance.now(),G=requestAnimationFrame(L))}function B(t){N=!!(t.detail&&t.detail.paused),e.dataset.motionPaused=String(N),Q()}window.addEventListener("pyranthus:motion",B);var C=new ResizeObserver(F);C.observe(e);var I=new IntersectionObserver(function(e){k=e[0].isIntersecting,Q()});I.observe(e),document.addEventListener("visibilitychange",Q);var U=l(f,F),D=l(m,function(){Y(),Q()});return F(),Q(),document.fonts&&document.fonts.ready&&document.fonts.ready.then(F),function(){P=!0,cancelAnimationFrame(G),C.disconnect(),I.disconnect(),document.removeEventListener("visibilitychange",Q),e.removeEventListener("webglcontextlost",y),U(),D(),window.removeEventListener("pyranthus:motion",B),M.onload=M.onerror=null,v.deleteTexture(E),v.deleteBuffer(b),v.deleteProgram(p),v.deleteShader(g),v.deleteShader(x)}};e.s(["default",0,function(){return(0,t.useEffect)(()=>{let e=document.querySelector("canvas[data-ember]");if(e)return f(e)},[]),null}],64885)},35570,e=>{"use strict";var t=e.i(43476),a=e.i(71645),r=e.i(31917);let n="(prefers-reduced-motion: reduce)";function i(e){let t=window.matchMedia(n);return t.addEventListener("change",e),()=>t.removeEventListener("change",e)}let o=e=>({"--i":e}),l={you:"You",agent:"Agent",mora:"Mora"};function s({line:e,i:a}){return(0,t.jsxs)("li",{className:r.default.item,"data-kind":e.kind,style:o(a),children:[e.kind in l?(0,t.jsx)("span",{className:r.default.who,children:l[e.kind]}):null,(0,t.jsx)("span",{className:r.default.text,children:e.text})]})}function c({beat:e,n:a,total:n,active:i}){let l=0;return(0,t.jsxs)("div",{className:r.default.layer,"data-active":i||void 0,"data-beat":e.id,"aria-hidden":"true",children:[(0,t.jsxs)("div",{className:r.default.head,children:[(0,t.jsx)("span",{className:r.default.session,children:e.session}),(0,t.jsx)("span",{className:r.default.chip,"data-status":e.chip.status,children:e.chip.text})]}),e.lines.length?(0,t.jsx)("ol",{className:r.default.lines,children:e.lines.map(e=>(0,t.jsx)(s,{line:e,i:l++},e.text+l))}):null,e.card?(0,t.jsxs)("div",{className:`${r.default.card} ${r.default.item}`,style:o(l++),children:[(0,t.jsxs)("span",{className:r.default.cardText,children:[(0,t.jsxs)("span",{className:r.default.cardTitle,children:["Mora · ",e.card.title]})," ",e.card.text.split("`").map((e,a)=>a%2?(0,t.jsx)("code",{children:e},a):e)]}),(0,t.jsxs)("span",{className:r.default.cardState,style:o(l+(e.after?.length??0)),children:[(0,t.jsx)("span",{"data-approval-state":"pending",className:r.default.pending,children:e.card.pending}),(0,t.jsx)("span",{"data-approval-state":"saved",className:r.default.saved,children:e.card.saved})]})]}):null,e.after?.length?(0,t.jsx)("ol",{className:r.default.lines,children:e.after.map(e=>(0,t.jsx)(s,{line:e,i:l++},e.text))}):null,(0,t.jsxs)("span",{className:r.default.beatTitle,children:[a+1," of ",n,". ",e.title]})]})}e.s(["default",0,function({loop:e,compact:o=!1}){let s=(0,a.useSyncExternalStore)(i,()=>window.matchMedia(n).matches,()=>!0),[d,u]=(0,a.useState)(e.stillBeat),[f,m]=(0,a.useState)(!1),[h,v]=(0,a.useState)(!1),p=(0,a.useRef)(null);(0,a.useEffect)(()=>{let e=p.current;if(!e)return;let t=new IntersectionObserver(([e])=>v(e.isIntersecting&&!document.hidden),{threshold:.25}),a=()=>v(!document.hidden&&e.getBoundingClientRect().bottom>0);return t.observe(e),document.addEventListener("visibilitychange",a),()=>{t.disconnect(),document.removeEventListener("visibilitychange",a)}},[]),(0,a.useEffect)(()=>{window.dispatchEvent(new CustomEvent("pyranthus:motion",{detail:{paused:f}}))},[f]);let g=!o&&!s&&!f&&h;(0,a.useEffect)(()=>{if(!g)return;let t=window.setTimeout(()=>u(t=>(t+1)%e.beats.length),e.beats[d].ms);return()=>window.clearTimeout(t)},[g,d,e.beats]);let x=o?0:s?e.stillBeat:d;return(0,t.jsxs)("figure",{ref:p,className:`${r.default.frame} ${o?"compact-loop":""}`,"data-running":g||void 0,"aria-label":o?"Mora approval illustration. Agent proposals wait for your approval.":void 0,children:[(0,t.jsxs)("div",{className:r.default.titleBar,children:[(0,t.jsxs)("span",{className:r.default.dots,"aria-hidden":"true",children:[(0,t.jsx)("i",{}),(0,t.jsx)("i",{}),(0,t.jsx)("i",{})]}),(0,t.jsx)("span",{className:r.default.label,children:e.label}),o||s?null:(0,t.jsx)("button",{type:"button",className:r.default.toggle,onClick:()=>m(e=>!e),"aria-pressed":f,children:f?e.play:e.pause})]}),(0,t.jsx)("div",{className:r.default.stage,children:e.beats.map((a,r)=>(0,t.jsx)(c,{beat:a,n:r,total:e.beats.length,active:r===x},a.id))}),(0,t.jsx)("ol",{className:r.default.progress,"aria-hidden":"true",children:e.beats.map((e,a)=>(0,t.jsx)("li",{"data-on":a===x||void 0},e.id))}),(0,t.jsx)("ol",{className:r.default.srOnly,children:e.beats.map(e=>(0,t.jsxs)("li",{children:[e.title,". ",e.chip.text,"."," ",e.lines.map(e=>`${e.kind in l?l[e.kind]+": ":""}${e.text}`).join(" "),e.card?` Mora, ${e.card.title} ${e.card.text.replaceAll("`","")}. ${e.card.pending} ${(e.after??[]).map(e=>e.text).join(" ")} ${e.card.saved}`:""]},e.id))}),(0,t.jsx)("figcaption",{className:r.default.caption,children:e.caption})]})}])},31917,e=>{e.v({barLabel:"YRyQ9G_barLabel",barRow:"YRyQ9G_barRow",bars:"YRyQ9G_bars",beatTitle:"YRyQ9G_beatTitle",caption:"YRyQ9G_caption",card:"YRyQ9G_card",cardState:"YRyQ9G_cardState",cardText:"YRyQ9G_cardText",cardTitle:"YRyQ9G_cardTitle",chip:"YRyQ9G_chip",dots:"YRyQ9G_dots",fill:"YRyQ9G_fill",fine:"YRyQ9G_fine",frame:"YRyQ9G_frame",head:"YRyQ9G_head",item:"YRyQ9G_item",label:"YRyQ9G_label",layer:"YRyQ9G_layer",lines:"YRyQ9G_lines",pending:"YRyQ9G_pending",progress:"YRyQ9G_progress",saved:"YRyQ9G_saved",session:"YRyQ9G_session",srOnly:"YRyQ9G_srOnly",stage:"YRyQ9G_stage",text:"YRyQ9G_text",titleBar:"YRyQ9G_titleBar",toggle:"YRyQ9G_toggle",track:"YRyQ9G_track",who:"YRyQ9G_who"})}]);