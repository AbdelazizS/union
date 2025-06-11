import{c as l}from"./createLucideIcon-AWgR876W.js";import{b as p,u as m,h,M as y,a as C,f as M,c as V,j as r}from"./WebsiteLayout-DRrtWhni.js";import{r as u}from"./app-D5zgOKAD.js";/**
 * @license lucide-react v0.509.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=[["path",{d:"M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z",key:"nnexq3"}],["path",{d:"M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12",key:"mt58a7"}]],I=l("leaf",k);/**
 * @license lucide-react v0.509.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],b=l("shield-check",L);function x(...t){const e=!Array.isArray(t[0]),n=e?0:-1,o=t[0+n],s=t[1+n],c=t[2+n],a=t[3+n],f=p(s,c,a);return e?f(o):f}function A(t){const e=m(()=>h(t)),{isStatic:n}=u.useContext(y);if(n){const[,o]=u.useState(t);u.useEffect(()=>e.on("change",o),[])}return e}function d(t,e){const n=A(e()),o=()=>n.set(e());return o(),C(()=>{const s=()=>M.preRender(o,!1,!0),c=t.map(a=>a.on("change",s));return()=>{c.forEach(a=>a()),V(o)}}),n}function E(t){r.current=[],t();const e=d(r.current,t);return r.current=void 0,e}function z(t,e,n,o){if(typeof t=="function")return E(t);const s=typeof e=="function"?e:x(e,n,o);return Array.isArray(t)?i(t,s):i([t],([c])=>s(c))}function i(t,e){const n=m(()=>[]);return d(t,()=>{n.length=0;const o=t.length;for(let s=0;s<o;s++)n[s]=t[s].get();return e(n)})}export{I as L,b as S,z as a,A as u};
