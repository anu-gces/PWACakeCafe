import{c as a,s as l,f as n,G as d,h,i as u,k as m,l as p,m as g,n as k,o as y,j as e}from"./index-Cqcx5OyV.js";import{B as w}from"./button-BfsSAjqZ.js";import{D as x,a as j,b as M,c as r}from"./dropdown-menu-Clx9PG_f.js";/**
 * @license lucide-react v0.503.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]],C=a("moon",f);/**
 * @license lucide-react v0.503.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]],v=a("sun",D),S=async()=>{const s=new d;s.setCustomParameters({prompt:"select_account"});try{const t=await h(n,s),i=u(m,"users",t.user.uid),c=await p(i);let o=!0;return c.exists()?o=await k():(await g(t.user.uid,t.user.email,t.user.photoURL),o=!1),{...t,isProfileComplete:o}}catch(t){throw console.error("Error signing in with Google: ",t),t}},T=async()=>{try{return await l(n),!0}catch(s){throw console.error("Error signing out: ",s),s}};function _(){const{setTheme:s}=y();return e.jsxs(x,{children:[e.jsx(j,{asChild:!0,children:e.jsxs(w,{variant:"outline",size:"icon",onClick:()=>console.log("bruh"),children:[e.jsx(v,{className:"w-[1.2rem] h-[1.2rem] transition-all rotate-0 scale-100 dark:-rotate-90 dark:scale-0"}),e.jsx(C,{className:"absolute w-[1.2rem] h-[1.2rem] transition-all rotate-90 scale-0 dark:rotate-0 dark:scale-100"}),e.jsx("span",{className:"sr-only",children:"Toggle theme"})]})}),e.jsxs(M,{align:"end",children:[e.jsx(r,{onClick:()=>s("light"),children:"Light"}),e.jsx(r,{onClick:()=>s("dark"),children:"Dark"}),e.jsx(r,{onClick:()=>s("system"),children:"System"})]})]})}export{_ as M,S as a,T as d};
