(this["webpackJsonprummy-score-tracker"]=this["webpackJsonprummy-score-tracker"]||[]).push([[0],{66:function(e,t,c){"use strict";c.r(t);var r=c(1),a=c.n(r),n=c(32),s=c.n(n),i=c(69),o=c(9),u=c(37),l=c(0),j=c.n(l),b=c(2),d=c(51),O=c(19),x=c(25),h=Object(d.a)({apiKey:"AIzaSyDaSmceFuVUP36mJDmdqccjlxSxacjaVg0",authDomain:"rummy-score-tracker.firebaseapp.com",projectId:"rummy-score-tracker",storageBucket:"rummy-score-tracker.appspot.com",messagingSenderId:"420450892849",appId:"1:420450892849:web:acdc3c6f8d9c875d116910"}),p=Object(O.g)(h),v=Object(x.d)(h),m=new O.c,f=function(){var e=Object(b.a)(j.a.mark((function e(){var t,c,r;return j.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,Object(O.o)(p,m);case 3:return t=e.sent,c=t.user,r=Object(x.e)(Object(x.b)(v,"users"),Object(x.f)("uid","==",c.uid)),e.next=8,Object(x.c)(r);case 8:if(0!==e.sent.docs.length){e.next=12;break}return e.next=12,Object(x.a)(Object(x.b)(v,"users"),{uid:c.uid,name:c.displayName,authProvider:"google",email:c.email});case 12:e.next=18;break;case 14:e.prev=14,e.t0=e.catch(0),console.error(e.t0),alert(e.t0.message);case 18:case"end":return e.stop()}}),e,null,[[0,14]])})));return function(){return e.apply(this,arguments)}}(),g=function(){var e=Object(b.a)(j.a.mark((function e(t,c){return j.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,Object(O.m)(p,t,c);case 3:e.next=9;break;case 5:e.prev=5,e.t0=e.catch(0),console.error(e.t0),alert(e.t0.message);case 9:case"end":return e.stop()}}),e,null,[[0,5]])})));return function(t,c){return e.apply(this,arguments)}}(),_=function(){var e=Object(b.a)(j.a.mark((function e(t,c,r){var a,n;return j.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,Object(O.f)(p,c,r);case 3:return a=e.sent,n=a.user,e.next=7,Object(x.a)(Object(x.b)(v,"users"),{uid:n.uid,name:t,authProvider:"local",email:c});case 7:e.next=13;break;case 9:e.prev=9,e.t0=e.catch(0),console.error(e.t0),alert(e.t0.message);case 13:case"end":return e.stop()}}),e,null,[[0,9]])})));return function(t,c,r){return e.apply(this,arguments)}}(),k=function(){var e=Object(b.a)(j.a.mark((function e(t){return j.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,Object(O.k)(p,t);case 3:alert("Password reset link sent!"),e.next=10;break;case 6:e.prev=6,e.t0=e.catch(0),console.error(e.t0),alert(e.t0.message);case 10:case"end":return e.stop()}}),e,null,[[0,6]])})));return function(t){return e.apply(this,arguments)}}(),w=function(){Object(O.p)(p)},y=c(6),N=a.a.createContext();function S(e){var t=e.children,c=Object(r.useState)(),a=Object(o.a)(c,2),n=a[0],s=a[1],i=Object(r.useState)(!0),l=Object(o.a)(i,2),j=l[0],b=l[1];Object(r.useEffect)((function(){return p.onAuthStateChanged((function(e){s(e),b(!1)}))}),[]);var d={currentUser:n,signup:function(e,t){return Object(u.f)(p,e,t)}};return Object(y.jsx)(N.Provider,{value:d,children:!j&&t})}c(72),c(70),c(71),c(68);var C=c(29),E=c(14),P=c(31);var B=function(){var e=Object(r.useState)(""),t=Object(o.a)(e,2),c=t[0],a=t[1],n=Object(r.useState)(""),s=Object(o.a)(n,2),i=s[0],u=s[1],l=Object(P.a)(p),j=Object(o.a)(l,3),b=j[0],d=j[1],O=(j[2],Object(E.l)());return Object(r.useEffect)((function(){d||b&&O("/dashboard")}),[b,d]),Object(y.jsx)("div",{className:"login",children:Object(y.jsxs)("div",{className:"login__container",children:[Object(y.jsx)("input",{type:"text",className:"login__textBox",value:c,onChange:function(e){return a(e.target.value)},placeholder:"E-mail Address"}),Object(y.jsx)("input",{type:"password",className:"login__textBox",value:i,onChange:function(e){return u(e.target.value)},placeholder:"Password"}),Object(y.jsx)("button",{className:"login__btn",onClick:function(){return g(c,i)},children:"Login"}),Object(y.jsx)("button",{className:"login__btn login__google",onClick:f,children:"Login with Google"}),Object(y.jsx)("div",{children:Object(y.jsx)(C.b,{to:"/reset",children:"Forgot Password"})}),Object(y.jsxs)("div",{children:["Don't have an account? ",Object(y.jsx)(C.b,{to:"/register",children:"Register"})," now."]})]})})};var A=function(){var e=Object(r.useState)(""),t=Object(o.a)(e,2),c=t[0],a=t[1],n=Object(r.useState)(""),s=Object(o.a)(n,2),i=s[0],u=s[1],l=Object(r.useState)(""),j=Object(o.a)(l,2),b=j[0],d=j[1],O=Object(P.a)(p),x=Object(o.a)(O,3),h=x[0],v=x[1],m=(x[2],Object(E.l)());return Object(r.useEffect)((function(){v||h&&m("/dashboard")}),[h,v]),Object(y.jsx)("div",{className:"register",children:Object(y.jsxs)("div",{className:"register__container",children:[Object(y.jsx)("input",{type:"text",className:"register__textBox",value:b,onChange:function(e){return d(e.target.value)},placeholder:"Full Name"}),Object(y.jsx)("input",{type:"text",className:"register__textBox",value:c,onChange:function(e){return a(e.target.value)},placeholder:"E-mail Address"}),Object(y.jsx)("input",{type:"password",className:"register__textBox",value:i,onChange:function(e){return u(e.target.value)},placeholder:"Password"}),Object(y.jsx)("button",{className:"register__btn",onClick:function(){b||alert("Please enter name"),_(b,c,i)},children:"Register"}),Object(y.jsx)("button",{className:"register__btn register__google",onClick:f,children:"Register with Google"}),Object(y.jsxs)("div",{children:["Already have an account? ",Object(y.jsx)(C.b,{to:"/",children:"Login"})," now."]})]})})};var D=function(){var e=Object(r.useState)(""),t=Object(o.a)(e,2),c=t[0],a=t[1],n=Object(P.a)(p),s=Object(o.a)(n,3),i=s[0],u=s[1],l=(s[2],Object(E.l)());return Object(r.useEffect)((function(){u||i&&l("/dashboard")}),[i,u]),Object(y.jsx)("div",{className:"reset",children:Object(y.jsxs)("div",{className:"reset__container",children:[Object(y.jsx)("input",{type:"text",className:"reset__textBox",value:c,onChange:function(e){return a(e.target.value)},placeholder:"E-mail Address"}),Object(y.jsx)("button",{className:"reset__btn",onClick:function(){return k(c)},children:"Send password reset email"}),Object(y.jsxs)("div",{children:["Don't have an account? ",Object(y.jsx)(C.b,{to:"/register",children:"Register"})," now."]})]})})};var I=function(){var e=Object(P.a)(p),t=Object(o.a)(e,3),c=t[0],a=t[1],n=(t[2],Object(r.useState)("")),s=Object(o.a)(n,2),i=s[0],u=s[1],l=Object(E.l)(),d=function(){var e=Object(b.a)(j.a.mark((function e(){var t,r,a;return j.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,t=Object(x.e)(Object(x.b)(v,"users"),Object(x.f)("uid","==",null===c||void 0===c?void 0:c.uid)),e.next=4,Object(x.c)(t);case 4:r=e.sent,a=r.docs[0].data(),u(a.name),e.next=13;break;case 9:e.prev=9,e.t0=e.catch(0),console.error(e.t0),alert("An error occured while fetching user data");case 13:case"end":return e.stop()}}),e,null,[[0,9]])})));return function(){return e.apply(this,arguments)}}();return Object(r.useEffect)((function(){if(!a)return c?void d():l("/")}),[c,a]),Object(y.jsx)("div",{className:"dashboard",children:Object(y.jsxs)("div",{className:"dashboard__container",children:["Logged in as",Object(y.jsx)("div",{children:i}),Object(y.jsx)("div",{children:null===c||void 0===c?void 0:c.email}),Object(y.jsx)("button",{className:"dashboard__btn",onClick:w,children:"Logout"})]})})};var L=function(){return Object(y.jsx)(i.a,{className:"d-flex align-items-center justify-content-center",style:{minHeight:"100vh"},children:Object(y.jsx)("div",{className:"w-100",style:{maxWidth:"400px"},children:Object(y.jsx)(C.a,{basename:"rummy-score-tracker",children:Object(y.jsx)(S,{children:Object(y.jsxs)(E.c,{children:[Object(y.jsx)(E.a,{exact:!0,path:"/",element:Object(y.jsx)(B,{})}),Object(y.jsx)(E.a,{exact:!0,path:"/register",element:Object(y.jsx)(A,{})}),Object(y.jsx)(E.a,{exact:!0,path:"/reset",element:Object(y.jsx)(D,{})}),Object(y.jsx)(E.a,{exact:!0,path:"/dashboard",element:Object(y.jsx)(I,{})})]})})})})})};c(65);s.a.render(Object(y.jsx)(a.a.StrictMode,{children:Object(y.jsx)(L,{})}),document.getElementById("root"))}},[[66,1,2]]]);
//# sourceMappingURL=main.f80636e6.chunk.js.map