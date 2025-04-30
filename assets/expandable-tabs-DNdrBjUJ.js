import{c as s,r as v,u as f,j as e}from"./index-et1T57Ff.js";import{c as r}from"./utils-fPxO0LcY.js";import{m as c,A as g}from"./proxy-B4liFZpl.js";/**
 * @license lucide-react v0.503.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]],V=s("bell",k);/**
 * @license lucide-react v0.503.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=[["path",{d:"M12 22v-9",key:"x3hkom"}],["path",{d:"M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.655 1.655 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z",key:"2ntwy6"}],["path",{d:"M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13",key:"1pmm1c"}],["path",{d:"M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.636 1.636 0 0 0 1.63 0z",key:"12ttoo"}]],E=s("package-open",j);/**
 * @license lucide-react v0.503.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]],$=s("user",b);/**
 * @license lucide-react v0.503.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M=[["path",{d:"M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2",key:"cjf0a3"}],["path",{d:"M7 2v20",key:"1473qp"}],["path",{d:"M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7",key:"j28e5"}]],z=s("utensils",M),w={initial:{gap:0,paddingLeft:".5rem",paddingRight:".5rem"},animate:a=>({gap:a?".5rem":0,paddingLeft:a?"1rem":".5rem",paddingRight:a?"1rem":".5rem"})},N={initial:{width:0,opacity:0},animate:{width:"auto",opacity:1},exit:{width:0,opacity:0}},d={delay:.1,type:"spring",bounce:0,duration:.6};function P({tabs:a,className:p,activeColor:m="text-primary",onChange:n}){const[o,l]=v.useState(0),u=f({from:"/home"}),h=t=>{l(t),n==null||n(t)},x=()=>e.jsx("div",{className:"mx-1 bg-border w-[1.2px] h-[24px]","aria-hidden":"true"});return e.jsx("div",{className:r("flex flex-wrap items-center gap-2 rounded-2xl border bg-background p-1 shadow-sm",p),children:a.map((t,i)=>{if(t.type==="separator")return e.jsx(x,{},`separator-${i}`);const y=t.icon;return e.jsxs(c.button,{variants:w,initial:!1,animate:"animate",custom:o===i,onClick:()=>{h(i),u({to:t.to})},transition:d,className:r("relative flex items-center flex-1 rounded-xl px-4 py-2 text-sm font-medium text-center justify-center transition-colors duration-300",o===i?r("bg-muted",m):"text-muted-foreground hover:bg-muted hover:text-foreground"),children:[e.jsx(y,{size:24}),e.jsx(g,{initial:!1,children:o===i&&e.jsx(c.span,{variants:N,initial:"initial",animate:"animate",exit:"exit",transition:d,className:"overflow-hidden",children:t.title})})]},t.title)})})}export{V as B,P as E,E as P,z as U,$ as a};
