(function(e){"function"==typeof define&&define.amd?define(e):e()})(function(){'use strict';class e extends HTMLElement{constructor(){super(),this.props=this.constructor.defaults,this.root=this.attachShadow({mode:"open"})}connectedCallback(){this.update()}attributeChangedCallback(e,i,o){this.props[e]=o||this.constructor.defaults[e],this.update()}style(){throw new Error("style method must be implemented")}template(){throw new Error("template method must be implemented")}update(){const e=`
      <style>
        * { box-sizing: border-box; }

        :host           { display: block; }
        :host([hidden]) { display: none; }

        ${this.style(this.props)}
      </style>
    `,i=this.template(this.props);this.root.innerHTML=`${e}${i}`}}class i extends e{static get is(){return"atom-spinner"}static get defaults(){return{color:"#ff1d5e",duration:1,size:60}}static get observedAttributes(){return["color","duration","size"]}get color(){return`var(--atom-spinner__color, ${this.props.color})`}get duration(){return`var(--atom-spinner__duration, ${this.props.duration}s)`}get size(){return`var(--atom-spinner__size, ${this.props.size}px)`}style(){return`
      .atom-spinner {
        height: ${this.size};
        overflow: hidden;
        width: ${this.size};
      }

      .atom-spinner .spinner-inner {
        display: block;
        height: 100%;
        position: relative;
        width: 100%;
      }

      .atom-spinner .spinner-circle {
        color: ${this.color};
        display: block;
        font-size: calc(${this.size} * 0.24);
        left: 50%;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
      }

      .atom-spinner .spinner-line {
        border-left: calc(${this.size} / 25) solid ${this.color};
        border-radius: 50%;
        border-top: calc(${this.size} / 25) solid transparent;
        height: 100%;
        position: absolute;
        width: 100%;
      }

      .atom-spinner .spinner-line:nth-child(1) {
        animation: atom-spinner-animation-1 ${this.duration} linear infinite;
        transform: rotateZ(120deg) rotateX(66deg) rotateZ(0deg);
      }

      .atom-spinner .spinner-line:nth-child(2) {
        animation: atom-spinner-animation-2 ${this.duration} linear infinite;
        transform: rotateZ(240deg) rotateX(66deg) rotateZ(0deg);
      }

      .atom-spinner .spinner-line:nth-child(3) {
        animation: atom-spinner-animation-3 ${this.duration} linear infinite;
        transform: rotateZ(360deg) rotateX(66deg) rotateZ(0deg);
      }

      @keyframes atom-spinner-animation-1 {
        100% {
          transform: rotateZ(120deg) rotateX(66deg) rotateZ(360deg);
        }
      }

      @keyframes atom-spinner-animation-2 {
        100% {
          transform: rotateZ(240deg) rotateX(66deg) rotateZ(360deg);
        }
      }

      @keyframes atom-spinner-animation-3 {
        100% {
          transform: rotateZ(360deg) rotateX(66deg) rotateZ(360deg);
        }
      }
    `}template(){return`
      <div class="atom-spinner">
        <div class="spinner-inner">
          <div class="spinner-line"></div>
          <div class="spinner-line"></div>
          <div class="spinner-line"></div>

          <!--Chrome renders little circles malformed :(-->
          <div class="spinner-circle">&#9679;</div>
        </div>
      </div>
    `}}customElements.define(i.is,i);class o extends e{static get is(){return"breeding-rhombus-spinner"}static get defaults(){return{color:"#ff1d5e",duration:2,size:65}}static get observedAttributes(){return["color","duration","size"]}get color(){return`var(--breeding-rhombus-spinner__color, ${this.props.color})`}get duration(){return`var(--breeding-rhombus-spinner__duration, ${this.props.duration}s)`}get size(){return`var(--breeding-rhombus-spinner__size, ${this.props.size}px)`}style(){return`
      .breeding-rhombus-spinner {
        height: ${this.size};
        width: ${this.size};
        position: relative;
        transform: rotate(45deg);
      }

      .breeding-rhombus-spinner, .breeding-rhombus-spinner * {
        box-sizing: border-box;
      }

      .breeding-rhombus-spinner .rhombus {
        animation-duration: ${this.duration};
        animation-iteration-count: infinite;
        background-color: ${this.color};
        height: calc(${this.size} / 7.5);
        left: calc(${this.size} / 2.3077);
        position: absolute;
        top: calc(${this.size} / 2.3077);
        width: calc(${this.size} / 7.5);
      }

      .breeding-rhombus-spinner .rhombus:nth-child(2n+0) {
        margin-right: 0;
      }

      .breeding-rhombus-spinner .rhombus.child-1 {
        animation-delay: calc(100ms * 1);
        animation-name: breeding-rhombus-spinner-animation-child-1;
      }

      .breeding-rhombus-spinner .rhombus.child-2 {
        animation-delay: calc(100ms * 2);
        animation-name: breeding-rhombus-spinner-animation-child-2;
      }

      .breeding-rhombus-spinner .rhombus.child-3 {
        animation-delay: calc(100ms * 3);
        animation-name: breeding-rhombus-spinner-animation-child-3;
      }

      .breeding-rhombus-spinner .rhombus.child-4 {
        animation-delay: calc(100ms * 4);
        animation-name: breeding-rhombus-spinner-animation-child-4;
      }

      .breeding-rhombus-spinner .rhombus.child-5 {
        animation-delay: calc(100ms * 5);
        animation-name: breeding-rhombus-spinner-animation-child-5;
      }

      .breeding-rhombus-spinner .rhombus.child-6 {
        animation-delay: calc(100ms * 6);
        animation-name: breeding-rhombus-spinner-animation-child-6;
      }

      .breeding-rhombus-spinner .rhombus.child-7 {
        animation-delay: calc(100ms * 7);
        animation-name: breeding-rhombus-spinner-animation-child-7;
      }

      .breeding-rhombus-spinner .rhombus.child-8 {
        animation-delay: calc(100ms * 8);
        animation-name: breeding-rhombus-spinner-animation-child-8;
      }

      .breeding-rhombus-spinner .rhombus.big {
        animation-delay: 0.5s;
        animation: breeding-rhombus-spinner-animation-child-big ${this.duration} infinite;
        background-color: ${this.color};
        height: calc(${this.size} / 3);
        left: calc(${this.size} / 3);
        top: calc(${this.size} / 3);
        width: calc(${this.size} / 3);
      }

      @keyframes breeding-rhombus-spinner-animation-child-1 {
        50% {
          transform: translate(-325%, -325%);
        }
      }

      @keyframes breeding-rhombus-spinner-animation-child-2 {
        50% {
          transform: translate(0, -325%);
        }
      }

      @keyframes breeding-rhombus-spinner-animation-child-3 {
        50% {
          transform: translate(325%, -325%);
        }
      }

      @keyframes breeding-rhombus-spinner-animation-child-4 {
        50% {
          transform: translate(325%, 0);
        }
      }

      @keyframes breeding-rhombus-spinner-animation-child-5 {
        50% {
          transform: translate(325%, 325%);
        }
      }

      @keyframes breeding-rhombus-spinner-animation-child-6 {
        50% {
          transform: translate(0, 325%);
        }
      }

      @keyframes breeding-rhombus-spinner-animation-child-7 {
        50% {
          transform: translate(-325%, 325%);
        }
      }

      @keyframes breeding-rhombus-spinner-animation-child-8 {
        50% {
          transform: translate(-325%, 0);
        }
      }

      @keyframes breeding-rhombus-spinner-animation-child-big {
        50% {
          transform: scale(0.5);
        }
      }
    `}template(){return`
      <div class="breeding-rhombus-spinner">
        <div class="rhombus child-1"></div>
        <div class="rhombus child-2"></div>
        <div class="rhombus child-3"></div>
        <div class="rhombus child-4"></div>
        <div class="rhombus child-5"></div>
        <div class="rhombus child-6"></div>
        <div class="rhombus child-7"></div>
        <div class="rhombus child-8"></div>
        <div class="rhombus big"></div>
      </div>
    `}}customElements.define(o.is,o);class n extends e{static get is(){return"circles-to-rhombuses-spinner"}static get defaults(){return{color:"#ff1d5e",count:3,duration:1.2,size:15}}static get observedAttributes(){return["color","count","duration","size"]}get color(){return`var(--circles-to-rhombuses-spinner__color, ${this.props.color})`}get duration(){return`var(--circles-to-rhombuses-spinner__duration, ${this.props.duration}s)`}get size(){return`var(--circles-to-rhombuses-spinner__size, ${this.props.size}px)`}style({count:e}){const o=[];for(let n=2;n<=e;n++)o.push(`
        .circles-to-rhombuses-spinner .circle:nth-child(${n}) {
          animation-delay: calc(${this.duration} / 8 * ${n});
        }
      `);return`
      .circles-to-rhombuses-spinner, .circles-to-rhombuses-spinner * {
        box-sizing: border-box;
      }

      .circles-to-rhombuses-spinner {
        align-items: center;
        display: flex;
        height: ${this.size};
        justify-content: center
        width: calc((${this.size} + ${this.size} * 1.125) * ${e});
      }

      .circles-to-rhombuses-spinner .circle {
        animation: circles-to-rhombuses-animation ${this.duration} linear infinite;
        background: transparent;
        border-radius: 10%;
        border: 3px solid ${this.color};
        height: ${this.size};
        margin-left: calc(${this.size} * 1.125);
        overflow: hidden;
        transform: rotate(45deg);
        width: ${this.size};
      }

      .circles-to-rhombuses-spinner .circle:nth-child(1) {
        animation-delay: calc(${this.duration} / 8 * 1);
        margin-left: 0;
      }

      ${o.join("")}

      @keyframes circles-to-rhombuses-animation {
        0% {
          border-radius: 10%;
        }
        17.5% {
          border-radius: 10%;
        }
        50% {
          border-radius: 100%;
        }
        93.5% {
          border-radius: 10%;
        }
        100% {
          border-radius: 10%;
        }
      }

      @keyframes circles-to-rhombuses-background-animation {
        50% {
          opacity: 0.4;
        }
      }
    `}template({count:e}){const o=[];for(let n=2;n<=e;n++)o.push("<div class=\"circle\"></div>");return`
      <div class="circles-to-rhombuses-spinner">
        <div class="circle"></div>
        ${o.join("")}
      </div>
    `}}customElements.define(n.is,n);class d extends e{static get is(){return"fingerprint-spinner"}static get defaults(){return{color:"#ff1d5e",duration:1.5,size:64}}static get observedAttributes(){return["color","duration","size"]}get color(){return`var(--fingerprint-spinner__color, ${this.props.color})`}get duration(){return`var(--fingerprint-spinner__duration, ${this.props.duration}s)`}get size(){return`var(--fingerprint-spinner__size, ${this.props.size}px)`}style(){return`
      .fingerprint-spinner {
        height: ${this.size};
        overflow: hidden;
        padding: 2px;
        position: relative;
        width: ${this.size};
      }

      .fingerprint-spinner .spinner-ring {
        animation: fingerprint-spinner-animation ${this.duration} cubic-bezier(0.680, -0.750, 0.265, 1.750) infinite forwards;
        border-bottom-color: transparent;
        border-left-color: transparent;
        border-radius: 50%;
        border-right-color: transparent;
        border-style: solid;
        border-top-color: ${this.color};
        border-width: 2px;
        bottom: 0;
        left: 0;
        margin: auto;
        position: absolute;
        right: 0;
        top: 0;
      }

      .fingerprint-spinner .spinner-ring:nth-child(1) {
        animation-delay: calc(50ms * 1);
        height: calc(${this.size} / 9 + 0 * ${this.size} / 9);
        width: calc(${this.size} / 9 + 0 * ${this.size} / 9);
      }

      .fingerprint-spinner .spinner-ring:nth-child(2) {
        animation-delay: calc(50ms * 2);
        height: calc(${this.size} / 9 + 1 * ${this.size} / 9);
        width: calc(${this.size} / 9 + 1 * ${this.size} / 9);
      }

      .fingerprint-spinner .spinner-ring:nth-child(3) {
        animation-delay: calc(50ms * 3);
        height: calc(${this.size} / 9 + 2 * ${this.size} / 9);
        width: calc(${this.size} / 9 + 2 * ${this.size} / 9);
      }

      .fingerprint-spinner .spinner-ring:nth-child(4) {
        animation-delay: calc(50ms * 4);
        height: calc(${this.size} / 9 + 3 * ${this.size} / 9);
        width: calc(${this.size} / 9 + 3 * ${this.size} / 9);
      }

      .fingerprint-spinner .spinner-ring:nth-child(5) {
        animation-delay: calc(50ms * 5);
        height: calc(${this.size} / 9 + 4 * ${this.size} / 9);
        width: calc(${this.size} / 9 + 4 * ${this.size} / 9);
      }

      .fingerprint-spinner .spinner-ring:nth-child(6) {
        animation-delay: calc(50ms * 6);
        height: calc(${this.size} / 9 + 5 * ${this.size} / 9);
        width: calc(${this.size} / 9 + 5 * ${this.size} / 9);
      }

      .fingerprint-spinner .spinner-ring:nth-child(7) {
        animation-delay: calc(50ms * 7);
        height: calc(${this.size} / 9 + 6 * ${this.size} / 9);
        width: calc(${this.size} / 9 + 6 * ${this.size} / 9);
      }

      .fingerprint-spinner .spinner-ring:nth-child(8) {
        animation-delay: calc(50ms * 8);
        height: calc(${this.size} / 9 + 7 * ${this.size} / 9);
        width: calc(${this.size} / 9 + 7 * ${this.size} / 9);
      }

      .fingerprint-spinner .spinner-ring:nth-child(9) {
        animation-delay: calc(50ms * 9);
        height: calc(${this.size} / 9 + 8 * ${this.size} / 9);
        width: calc(${this.size} / 9 + 8 * ${this.size} / 9);
      }

      @keyframes fingerprint-spinner-animation {
        100% {
          transform: rotate( 360deg );
        }
      }
    `}template(){return`
      <div class="fingerprint-spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
    `}}customElements.define(d.is,d);class s extends e{static get is(){return"flower-spinner"}static get defaults(){return{color:"#ff1d5e",duration:2.5,size:70}}static get observedAttributes(){return["color","duration","size"]}get color(){return`var(--flower-spinner__color, ${this.props.color})`}get duration(){return`var(--flower-spinner__duration, ${this.props.duration}s)`}get size(){return`var(--flower-spinner__size, ${this.props.size}px)`}style(){return`
      .flower-spinner {
        align-items: center;
        display: flex;
        flex-direction: row;
        height: ${this.size};
        justify-content: center;
        width: ${this.size};
      }

      .flower-spinner .dots-container {
        height: calc(${this.size} / 7);
        width: calc(${this.size} / 7);
      }

      .flower-spinner .smaller-dot {
        animation: flower-spinner-smaller-dot-animation ${this.duration} 0s infinite both;
        background: ${this.color};
        border-radius: 50%;
        height: 100%;
        width: 100%;
      }

      .flower-spinner .bigger-dot {
        animation: flower-spinner-bigger-dot-animation ${this.duration} 0s infinite both;
        background: ${this.color};
        border-radius: 50%;
        height: 100%;
        padding: 10%;
        width: 100%;
      }

      @keyframes flower-spinner-bigger-dot-animation {
        0%, 100% {
          box-shadow: ${this.color} 0px 0px 0px,
                      ${this.color} 0px 0px 0px,
                      ${this.color} 0px 0px 0px,
                      ${this.color} 0px 0px 0px,
                      ${this.color} 0px 0px 0px,
                      ${this.color} 0px 0px 0px,
                      ${this.color} 0px 0px 0px,
                      ${this.color} 0px 0px 0px;
        }
        50% {
          transform: rotate(180deg);
        }
        25%, 75% {
          box-shadow: ${this.color} 26px 0px 0px,
                      ${this.color} -26px 0px 0px,
                      ${this.color} 0px 26px 0px,
                      ${this.color} 0px -26px 0px,
                      ${this.color} 19px -19px 0px,
                      ${this.color} 19px 19px 0px,
                      ${this.color} -19px -19px 0px,
                      ${this.color} -19px 19px 0px;
        }
        100% {
          transform: rotate(360deg);
          box-shadow: ${this.color} 0px 0px 0px,
                      ${this.color} 0px 0px 0px,
                      ${this.color} 0px 0px 0px,
                      ${this.color} 0px 0px 0px,
                      ${this.color} 0px 0px 0px,
                      ${this.color} 0px 0px 0px,
                      ${this.color} 0px 0px 0px,
                      ${this.color} 0px 0px 0px;
        }
      }

      @keyframes flower-spinner-smaller-dot-animation {
        0%, 100% {
          box-shadow: ${this.color} 0px 0px 0px,
                      ${this.color} 0px 0px 0px,
                      ${this.color} 0px 0px 0px,
                      ${this.color} 0px 0px 0px,
                      ${this.color} 0px 0px 0px,
                      ${this.color} 0px 0px 0px,
                      ${this.color} 0px 0px 0px,
                      ${this.color} 0px 0px 0px;
        }
        25%, 75% {
          box-shadow: ${this.color} 14px 0px 0px,
                      ${this.color} -14px 0px 0px,
                      ${this.color} 0px 14px 0px,
                      ${this.color} 0px -14px 0px,
                      ${this.color} 10px -10px 0px,
                      ${this.color} 10px 10px 0px,
                      ${this.color} -10px -10px 0px,
                      ${this.color} -10px 10px 0px;
        }
        100% {
          box-shadow: ${this.color} 0px 0px 0px,
                      ${this.color} 0px 0px 0px,
                      ${this.color} 0px 0px 0px,
                      ${this.color} 0px 0px 0px,
                      ${this.color} 0px 0px 0px,
                      ${this.color} 0px 0px 0px,
                      ${this.color} 0px 0px 0px,
                      ${this.color} 0px 0px 0px;
        }
      }
    `}template(){return`
      <div class="flower-spinner">
        <div class="dots-container">
          <div class="bigger-dot">
            <div class="smaller-dot"></div>
          </div>
        </div>
      </div>
    `}}customElements.define(s.is,s);class r extends e{static get is(){return"fulfilling-bouncing-circle-spinner"}static get defaults(){return{color:"#ff1d5e",duration:4,size:50}}static get observedAttributes(){return["color","duration","size"]}get color(){return`var(--fulfilling-bouncing-circle-spinner__color, ${this.props.color})`}get duration(){return`var(--fulfilling-bouncing-circle-spinner__duration, ${this.props.duration}s)`}get size(){return`var(--fulfilling-bouncing-circle-spinner__size, ${this.props.size}px)`}style(){return`
      .fulfilling-bouncing-circle-spinner {
        animation: fulfilling-bouncing-circle-spinner-animation infinite ${this.duration} ease;
        height: ${this.size};
        position: relative;
        width: ${this.size};
      }

      .fulfilling-bouncing-circle-spinner .orbit {
        animation: fulfilling-bouncing-circle-spinner-orbit-animation infinite ${this.duration} ease;
        border-radius: 50%;
        border: calc(${this.size} * 0.03) solid ${this.color};
        height: ${this.size};
        left: 0;
        position: absolute;
        top: 0;
        width: ${this.size};
      }

      .fulfilling-bouncing-circle-spinner .circle {
        animation: fulfilling-bouncing-circle-spinner-circle-animation infinite ${this.duration} ease;
        border-radius: 50%;
        border: calc(${this.size} * 0.1) solid ${this.color};
        color: ${this.color};
        display: block;
        height: ${this.size};
        position: relative;
        transform: rotate(0deg) scale(1);
        width: ${this.size};
      }

      @keyframes fulfilling-bouncing-circle-spinner-animation {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      @keyframes fulfilling-bouncing-circle-spinner-orbit-animation {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1);
        }
        62.5% {
          transform: scale(0.8);
        }
        75% {
          transform: scale(1);
        }
        87.5% {
          transform: scale(0.8);
        }
        100% {
          transform: scale(1);
        }
      }

      @keyframes fulfilling-bouncing-circle-spinner-circle-animation {
        0% {
          border-bottom-color: transparent;
          border-left-color: transparent;
          border-right-color: transparent;
          border-top-color: inherit;
          transform: scale(1);
        }

        16.7% {
          border-bottom-color: transparent;
          border-left-color: transparent;
          border-right-color: initial;
          border-top-color: initial;
        }

        33.4% {
          border-bottom-color: inherit;
          border-left-color: transparent;
          border-right-color: inherit;
          border-top-color: inherit;
        }

        50% {
          border-color: inherit;
          transform: scale(1);
        }

        62.5% {
          border-color: inherit;
          transform: scale(1.4);
        }

        75% {
          border-color: inherit;
          opacity: 1;
          transform: scale(1);
        }

        87.5% {
          border-color: inherit;
          transform: scale(1.4);
        }

        100% {
          border-color: transparent;
          border-top-color: inherit;
          transform: scale(1);
        }
      }
    `}template(){return`
      <div class="fulfilling-bouncing-circle-spinner">
        <div class="circle"></div>
        <div class="orbit"></div>
      </div>
    `}}customElements.define(r.is,r);class z extends e{static get is(){return"fulfilling-square-spinner"}static get defaults(){return{color:"#ff1d5e",duration:4,size:50}}static get observedAttributes(){return["color","duration","size"]}get color(){return`var(--fulfilling-square-spinner__color, ${this.props.color})`}get duration(){return`var(--fulfilling-square-spinner__duration, ${this.props.duration}s)`}get size(){return`var(--fulfilling-square-spinner__size, ${this.props.size}px)`}style(){return`
      .fulfilling-square-spinner {
        height: ${this.size};
        width: ${this.size};
        position: relative;
        border: 4px solid ${this.color};
        animation: fulfilling-square-spinner-animation ${this.duration} infinite ease;
      }

      .fulfilling-square-spinner .spinner-inner {
        vertical-align: top;
        display: inline-block;
        background-color: ${this.color};
        width: 100%;
        opacity: 1;
        animation: fulfilling-square-spinner-inner-animation ${this.duration} infinite ease-in;
      }

      @keyframes fulfilling-square-spinner-animation {
        0%   { transform: rotate(0deg); }
        25%  { transform: rotate(180deg); }
        50%  { transform: rotate(180deg); }
        75%  { transform: rotate(360deg); }
        100% { transform: rotate(360deg); }
      }

      @keyframes fulfilling-square-spinner-inner-animation {
        0%   { height: 0%; }
        25%  { height: 0%; }
        50%  { height: 100%; }
        75%  { height: 100%; }
        100% { height: 0%; }
      }
    `}template(){return`
      <div class="fulfilling-square-spinner">
        <div class="spinner-inner"></div>
      </div>
    `}}customElements.define(z.is,z);class u extends e{static get is(){return"half-circle-spinner"}static get defaults(){return{color:"#ff1d5e",duration:1,size:60}}static get observedAttributes(){return["color","duration","size"]}get color(){return`var(--half-circle-spinner__color, ${this.props.color})`}get duration(){return`var(--half-circle-spinner__duration, ${this.props.duration}s)`}get size(){return`var(--half-circle-spinner__size, ${this.props.size}px)`}style(){return`
      .half-circle-spinner {
        border-radius: 100%;
        height: ${this.size};
        position: relative;
        width: ${this.size};
      }

      .half-circle-spinner .circle {
        border-radius: 100%;
        border: calc(${this.size} / 10) solid transparent;
        content: "";
        height: 100%;
        position: absolute;
        width: 100%;
      }

      .half-circle-spinner .circle.circle-1 {
        animation: half-circle-spinner-animation ${this.duration} infinite;
        border-top-color: ${this.color};
      }

      .half-circle-spinner .circle.circle-2 {
        animation: half-circle-spinner-animation ${this.duration} infinite alternate;
        border-bottom-color: ${this.color};
      }

      @keyframes half-circle-spinner-animation {
        0%   { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}template(){return`
      <div class="half-circle-spinner">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
      </div>
    `}}customElements.define(u.is,u);class l extends e{static get is(){return"hollow-dots-spinner"}static get defaults(){return{color:"#ff1d5e",count:3,duration:1,size:15}}static get observedAttributes(){return["color","count","duration","size"]}get color(){return`var(--hollow-dots-spinner__color, ${this.props.color})`}get duration(){return`var(--hollow-dots-spinner__duration, ${this.props.duration}s)`}get size(){return`var(--hollow-dots-spinner__size, ${this.props.size}px)`}style({count:e}){const o=[];for(let n=1;n<=e;n++)o.push(`
        .hollow-dots-spinner .dot:nth-child(${n}) {
          animation-delay: calc(${this.duration} / ${e} * ${n});
        }
      `);return`
      * {
        box-sizing: border-box;
      }

      :host {
        display: block;
      }

      .hollow-dots-spinner {
        height: ${this.size};
        width: calc(${this.size} * 2 * ${e});
      }

      .hollow-dots-spinner .dot {
        animation: hollow-dots-spinner-animation ${this.duration} ease infinite 0ms;
        border-radius: 50%;
        border: calc(${this.size} / 5) solid ${this.color};
        float: left;
        height: ${this.size};
        margin: 0 calc(${this.size} / 2);
        transform: scale(0);
        width: ${this.size};
      }

      ${o.join("")}

      @keyframes hollow-dots-spinner-animation {
        50% {
          transform: scale(1);
          opacity: 1;
        }

        100% {
          opacity: 0;
        }
      }
    `}template({count:e}){const o=[];for(let n=1;n<=e;n++)o.push("<div class=\"dot\"></div>");return`
      <div class="hollow-dots-spinner">
        ${o.join("")}
      </div>
    `}}customElements.define(l.is,l);class f extends e{static get is(){return"intersecting-circles-spinner"}static get defaults(){return{color:"#ff1d5e",duration:1.2,size:35}}static get observedAttributes(){return["color","duration","size"]}get color(){return`var(--intersecting-circles-spinner__color, ${this.props.color})`}get duration(){return`var(--intersecting-circles-spinner__duration, ${this.props.duration}s)`}get size(){return`var(--intersecting-circles-spinner__size, ${this.props.size}px)`}style(){return`
      .intersecting-circles-spinner {
        height: calc(${this.size} * 2);
        width: calc(${this.size} * 2);
        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
      }

      .intersecting-circles-spinner .spinnerBlock {
        animation: intersecting-circles-spinner-animation ${this.duration} linear infinite;
        transform-origin: center;
        display: block;
        height: ${this.size};
        width: ${this.size};
      }

      .intersecting-circles-spinner .circle {
        display: block;
        border: 2px solid ${this.color};
        border-radius: 50%;
        height: 100%;
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
      }

      .intersecting-circles-spinner .circle:nth-child(1) {
        left: 0;
        top: 0;
      }

      .intersecting-circles-spinner .circle:nth-child(2) {
        left: calc(${this.size} * -0.36);
        top: calc(${this.size} * 0.2);
      }

      .intersecting-circles-spinner .circle:nth-child(3) {
        left: calc(${this.size} * -0.36);
        top: calc(${this.size} * -0.2);
      }

      .intersecting-circles-spinner .circle:nth-child(4) {
        left: 0;
        top: calc(${this.size} * -0.36);
      }

      .intersecting-circles-spinner .circle:nth-child(5) {
        left: calc(${this.size} * 0.36);
        top: calc(${this.size} * -0.2);
      }

      .intersecting-circles-spinner .circle:nth-child(6) {
        left: calc(${this.size} * 0.36);
        top: calc(${this.size} * 0.2);
      }

      .intersecting-circles-spinner .circle:nth-child(7) {
        left: 0;
        top: calc(${this.size} * 0.36);
      }

      @keyframes intersecting-circles-spinner-animation {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }
    `}template(){return`
      <div class="intersecting-circles-spinner">
        <div class="spinnerBlock">
          <span class="circle"></span>
          <span class="circle"></span>
          <span class="circle"></span>
          <span class="circle"></span>
          <span class="circle"></span>
          <span class="circle"></span>
          <span class="circle"></span>
        </div>
      </div>
    `}}customElements.define(f.is,f);class c extends e{static get is(){return"looping-rhombuses-spinner"}static get defaults(){return{color:"#ff1d5e",duration:2.5,size:15}}static get observedAttributes(){return["color","duration","size"]}get color(){return`var(--looping-rhombuses-spinner__color, ${this.props.color})`}get duration(){return`var(--looping-rhombuses-spinner__duration, ${this.props.duration}s)`}get size(){return`var(--looping-rhombuses-spinner__size, ${this.props.size}px)`}style(){return`
      .looping-rhombuses-spinner {
        height: ${this.size};
        position: relative;
        width: calc(${this.size} * 4);
      }

      .looping-rhombuses-spinner .rhombus {
        animation: looping-rhombuses-spinner-animation ${this.duration} linear infinite;
        background-color: ${this.color};
        border-radius: 2px;
        height: ${this.size};
        left: calc(${this.size} * 4);
        margin: 0 auto;
        position: absolute;
        transform: translateY(0) rotate(45deg) scale(0);
        width: ${this.size};
      }

      .looping-rhombuses-spinner .rhombus:nth-child(1) {
        animation-delay: calc(${this.duration} * 1 / -1.5);
      }

      .looping-rhombuses-spinner .rhombus:nth-child(2) {
        animation-delay: calc(${this.duration} * 2 / -1.5);
      }

      .looping-rhombuses-spinner .rhombus:nth-child(3) {
        animation-delay: calc(${this.duration} * 3 / -1.5);
      }

      @keyframes looping-rhombuses-spinner-animation {
        0%   { transform: translateX(0)     rotate(45deg) scale(0); }
        50%  { transform: translateX(-233%) rotate(45deg) scale(1); }
        100% { transform: translateX(-466%) rotate(45deg) scale(0); }
      }
    `}template(){return`
      <div class="looping-rhombuses-spinner">
        <div class="rhombus"></div>
        <div class="rhombus"></div>
        <div class="rhombus"></div>
      </div>
    `}}customElements.define(c.is,c);class p extends e{static get is(){return"orbit-spinner"}static get defaults(){return{color:"#ff1d5e",duration:1.2,size:55}}static get observedAttributes(){return["color","duration","size"]}get color(){return`var(--orbit-spinner__color, ${this.props.color})`}get duration(){return`var(--orbit-spinner__duration, ${this.props.duration}s)`}get size(){return`var(--orbit-spinner__size, ${this.props.size}px)`}style(){return`
      .orbit-spinner {
        border-radius: 50%;
        height: ${this.size};
        perspective: 800px;
        width: ${this.size};
      }

      .orbit-spinner .orbit {
        border-radius: 50%;
        box-sizing: border-box;
        height: 100%;
        position: absolute;
        width: 100%;
      }

      .orbit-spinner .orbit:nth-child(1) {
        animation: orbit-spinner-orbit-one-animation ${this.duration} linear infinite;
        border-bottom: 3px solid ${this.color};
        left: 0%;
        top: 0%;
      }

      .orbit-spinner .orbit:nth-child(2) {
        animation: orbit-spinner-orbit-two-animation ${this.duration} linear infinite;
        border-right: 3px solid ${this.color};
        right: 0%;
        top: 0%;
      }

      .orbit-spinner .orbit:nth-child(3) {
        animation: orbit-spinner-orbit-three-animation ${this.duration} linear infinite;
        border-top: 3px solid ${this.color};
        bottom: 0%;
        right: 0%;
      }

      @keyframes orbit-spinner-orbit-one-animation {
        0%   { transform: rotateX(35deg) rotateY(-45deg) rotateZ(0deg); }
        100% { transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg); }
      }

      @keyframes orbit-spinner-orbit-two-animation {
        0%   { transform: rotateX(50deg) rotateY(10deg) rotateZ(0deg); }
        100% { transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg); }
      }

      @keyframes orbit-spinner-orbit-three-animation {
        0%   { transform: rotateX(35deg) rotateY(55deg) rotateZ(0deg); }
        100% { transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg);
        }
      }
    `}template(){return`
      <div class="orbit-spinner">
        <div class="orbit"></div>
        <div class="orbit"></div>
        <div class="orbit"></div>
      </div>
    `}}customElements.define(p.is,p);class a extends e{static get is(){return"pixel-spinner"}static get defaults(){return{color:"#ff1d5e",duration:2,size:70}}static get observedAttributes(){return["color","duration","size"]}get color(){return`var(--pixel-spinner__color, ${this.props.color})`}get duration(){return`var(--pixel-spinner__duration, ${this.props.duration}s)`}get size(){return`var(--pixel-spinner__size, ${this.props.size}px)`}style(){return`
      .pixel-spinner {
        align-items: center;
        display: flex;
        flex-direction: row;
        height: ${this.size};
        justify-content: center;
        width: ${this.size};
      }

      .pixel-spinner .pixel-spinner-inner {
        animation: pixel-spinner-animation ${this.duration} linear infinite;
        background-color: ${this.color};
        box-shadow: 15px 15px  0 0,
                    -15px -15px  0 0,
                    15px -15px  0 0,
                    -15px 15px  0 0,
                    0 15px  0 0,
                    15px 0  0 0,
                    -15px 0  0 0,
                    0 -15px 0 0;
        color: ${this.color};
        height: calc(${this.size} / 7);
        width: calc(${this.size} / 7);
      }

      @keyframes pixel-spinner-animation {
        50% {
          box-shadow: 20px 20px 0px 0px,
                      -20px -20px 0px 0px,
                      20px -20px 0px 0px,
                      -20px 20px 0px 0px,
                      0px 10px 0px 0px,
                      10px 0px 0px 0px,
                      -10px 0px 0px 0px,
                      0px -10px 0px 0px;
        }

        75% {
          box-shadow: 20px 20px 0px 0px,
                      -20px -20px 0px 0px,
                      20px -20px 0px 0px,
                      -20px 20px 0px 0px,
                      0px 10px 0px 0px,
                      10px 0px 0px 0px,
                      -10px 0px 0px 0px,
                      0px -10px 0px 0px;
        }

        100% {
          transform: rotate(360deg);
        }
      }
    `}template(){return`
      <div class="pixel-spinner">
        <div class="pixel-spinner-inner"></div>
      </div>
    `}}customElements.define(a.is,a);class t extends e{static get is(){return"radar-spinner"}static get defaults(){return{color:"#ff1d5e",duration:2,size:60}}static get observedAttributes(){return["color","duration","size"]}get color(){return`var(--radar-spinner__color, ${this.props.color})`}get duration(){return`var(--radar-spinner__duration, ${this.props.duration}s)`}get size(){return`var(--radar-spinner__size, ${this.props.size}px)`}style(){return`
      .radar-spinner {
        height: ${this.size};
        position: relative;
        width: ${this.size};
      }

      .radar-spinner .circle {
        animation: radar-spinner-animation ${this.duration} infinite;
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        width: 100%;
      }

      .radar-spinner .circle:nth-child(1) {
        animation-delay: calc(${this.duration} / 6.67);
        padding: calc(${this.size} * 5 * 2 * 0 / 110);
      }

      .radar-spinner .circle:nth-child(2) {
        animation-delay: calc(${this.duration} / 6.67);
        padding: calc(${this.size} * 5 * 2 * 1 / 110);
      }

      .radar-spinner .circle:nth-child(3) {
        animation-delay: calc(${this.duration} / 6.67);
        padding: calc(${this.size} * 5 * 2 * 2 / 110);
      }

      .radar-spinner .circle:nth-child(4) {
        animation-delay: 0ms;
        padding: calc(${this.size} * 5 * 2 * 3 / 110);
      }

      .radar-spinner .circle-inner, .radar-spinner .circle-inner-container {
        border-radius: 50%;
        border: calc(${this.size} * 5 / 110) solid transparent;
        height: 100%;
        width: 100%;
      }

      .radar-spinner .circle-inner {
        border-left-color: ${this.color};
        border-right-color: ${this.color};
      }

      @keyframes radar-spinner-animation {
        50%  { transform: rotate(180deg); }
        100% { transform: rotate(0deg); }
      }
    `}template(){return`
      <div class="radar-spinner">
        <div class="circle">
          <div class="circle-inner-container">
            <div class="circle-inner"></div>
          </div>
        </div>

        <div class="circle">
          <div class="circle-inner-container">
            <div class="circle-inner"></div>
          </div>
        </div>

        <div class="circle">
          <div class="circle-inner-container">
            <div class="circle-inner"></div>
          </div>
        </div>

        <div class="circle">
          <div class="circle-inner-container">
            <div class="circle-inner"></div>
          </div>
        </div>
      </div>
    `}}customElements.define(t.is,t);class g extends e{static get is(){return"scaling-squares-spinner"}static get defaults(){return{color:"#ff1d5e",duration:1.25,size:65}}static get observedAttributes(){return["color","duration","size"]}get color(){return`var(--scaling-squares-spinner__color, ${this.props.color})`}get duration(){return`var(--scaling-squares-spinner__duration, ${this.props.duration}s)`}get size(){return`var(--scaling-squares-spinner__size, ${this.props.size}px)`}style(){return`
      .scaling-squares-spinner {
        align-items: center;
        animation: scaling-squares-animation ${this.duration} infinite;
        display: flex;
        flex-direction: row;
        height: ${this.size};
        justify-content: center;
        position: relative;
        transform: rotate(0deg);
        width: ${this.size};
      }

      .scaling-squares-spinner .square {
        animation-duration: ${this.duration};
        animation-iteration-count: infinite;
        border: calc(${this.size} * 0.04 / 1.3) solid ${this.color};
        height: calc(${this.size} * 0.25 / 1.3);
        margin-left: auto;
        margin-right: auto;
        position: absolute;
        width: calc(${this.size} * 0.25 / 1.3);
      }

      .scaling-squares-spinner .square:nth-child(1) {
        animation-name: scaling-squares-spinner-animation-child-1;
      }

      .scaling-squares-spinner .square:nth-child(2) {
        animation-name: scaling-squares-spinner-animation-child-2;
      }

      .scaling-squares-spinner .square:nth-child(3) {
        animation-name: scaling-squares-spinner-animation-child-3;
      }

      .scaling-squares-spinner .square:nth-child(4) {
        animation-name: scaling-squares-spinner-animation-child-4;
      }

      @keyframes scaling-squares-animation {
        50%  { transform: rotate(90deg); }
        100% { transform: rotate(180deg); }
      }

      @keyframes scaling-squares-spinner-animation-child-1 {
        50% { transform: translate(150%,150%) scale(2,2); }
      }

      @keyframes scaling-squares-spinner-animation-child-2 {
        50% { transform: translate(-150%,150%) scale(2,2); }
      }

      @keyframes scaling-squares-spinner-animation-child-3 {
        50% { transform: translate(-150%,-150%) scale(2,2); }
      }

      @keyframes scaling-squares-spinner-animation-child-4 {
        50% { transform: translate(150%,-150%) scale(2,2); }
      }
    `}template(){return`
      <div class="scaling-squares-spinner">
        <div class="square"></div>
        <div class="square"></div>
        <div class="square"></div>
        <div class="square"></div>
      </div>
    `}}customElements.define(g.is,g);class h extends e{static get is(){return"self-building-square-spinner"}static get defaults(){return{color:"#ff1d5e",duration:6,size:10}}static get observedAttributes(){return["color","duration","size"]}get color(){return`var(--self-building-square-spinner__color, ${this.props.color})`}get duration(){return`var(--self-building-square-spinner__duration, ${this.props.duration}s)`}get size(){return`var(--self-building-square-spinner__size, ${this.props.size}px)`}style(){return`
      .self-building-square-spinner {
        height: calc(${this.size} * 4);
        top: calc(${this.size} * 2 / 3);
        width: calc(${this.size} * 4);
      }
      .self-building-square-spinner .square {
        animation: self-building-square-spinner ${this.duration} infinite;
        background: ${this.color};
        float: left;
        height: ${this.size};
        margin-right: calc(${this.size} / 3);
        margin-top: calc(${this.size} / 3);
        opacity: 0;
        position:relative;
        top: calc(${this.size} * -2 / 3);
        width: ${this.size};
      }

      .self-building-square-spinner .square:nth-child(1) {
        animation-delay: calc(${this.duration} / 20 * 6);
      }

      .self-building-square-spinner .square:nth-child(2) {
        animation-delay: calc(${this.duration} / 20 * 7);
      }

      .self-building-square-spinner .square:nth-child(3) {
        animation-delay: calc(${this.duration} / 20 * 8);
      }

      .self-building-square-spinner .square:nth-child(4) {
        animation-delay: calc(${this.duration} / 20 * 3);
      }

      .self-building-square-spinner .square:nth-child(5) {
        animation-delay: calc(${this.duration} / 20 * 4);
      }

      .self-building-square-spinner .square:nth-child(6) {
        animation-delay: calc(${this.duration} / 20 * 5);
      }

      .self-building-square-spinner .square:nth-child(7) {
        animation-delay: calc(${this.duration} / 20 * 0);
      }

      .self-building-square-spinner .square:nth-child(8) {
        animation-delay: calc(${this.duration} / 20 * 1);
      }

      .self-building-square-spinner .square:nth-child(9) {
        animation-delay: calc(${this.duration} / 20 * 2);
      }

      .self-building-square-spinner .clear {
        clear: both;
      }

      @keyframes self-building-square-spinner {
        0% {
          opacity: 0;
        }

        5% {
          opacity: 1;
          top: 0;
        }

        50.9% {
          opacity: 1;
          top: 0;
        }

        55.9% {
          opacity: 0;
          top: inherit;
        }
      }
    `}template(){return`
      <div class="self-building-square-spinner">
        <div class="square"></div>
        <div class="square"></div>
        <div class="square"></div>
        <div class="square clear"></div>
        <div class="square"></div>
        <div class="square"></div>
        <div class="square clear"></div>
        <div class="square"></div>
        <div class="square"></div>
      </div>
    `}}customElements.define(h.is,h);class m extends e{static get is(){return"semipolar-spinner"}static get defaults(){return{color:"#ff1d5e",duration:2,size:65}}static get observedAttributes(){return["color","duration","size"]}get color(){return`var(--semipolar-spinner__color, ${this.props.color})`}get duration(){return`var(--semipolar-spinner__duration, ${this.props.duration}s)`}get size(){return`var(--semipolar-spinner__size, ${this.props.size}px)`}style(){return`
      .semipolar-spinner {
        height: ${this.size};
        position: relative;
        width: ${this.size};
      }

      .semipolar-spinner .ring {
        animation: semipolar-spinner-animation ${this.duration} infinite;
        border-bottom-color: transparent;
        border-left-color: ${this.color};
        border-radius: 50%;
        border-right-color: transparent;
        border-style: solid;
        border-top-color: ${this.color};
        border-width: calc(${this.size} * 0.05);
        position: absolute;
      }

      .semipolar-spinner .ring:nth-child(1) {
        animation-delay: calc(${this.duration} * 0.1 * 4);
        height: calc(${this.size} - ${this.size} * 0.2 * 0);
        left: calc(${this.size} * 0.1 * 0);
        top: calc(${this.size} * 0.1 * 0);
        width: calc(${this.size} - ${this.size} * 0.2 * 0);
        z-index: 5;
      }

      .semipolar-spinner .ring:nth-child(2) {
        animation-delay: calc(${this.duration} * 0.1 * 3);
        height: calc(${this.size} - ${this.size} * 0.2 * 1);
        left: calc(${this.size} * 0.1 * 1);
        top: calc(${this.size} * 0.1 * 1);
        width: calc(${this.size} - ${this.size} * 0.2 * 1);
        z-index: 4;
      }

      .semipolar-spinner .ring:nth-child(3) {
        animation-delay: calc(${this.duration} * 0.1 * 2);
        height: calc(${this.size} - ${this.size} * 0.2 * 2);
        left: calc(${this.size} * 0.1 * 2);
        top: calc(${this.size} * 0.1 * 2);
        width: calc(${this.size} - ${this.size} * 0.2 * 2);
        z-index: 3;
      }

      .semipolar-spinner .ring:nth-child(4) {
        animation-delay: calc(${this.duration} * 0.1 * 1);
        height: calc(${this.size} - ${this.size} * 0.2 * 3);
        left: calc(${this.size} * 0.1 * 3);
        top: calc(${this.size} * 0.1 * 3);
        width: calc(${this.size} - ${this.size} * 0.2 * 3);
        z-index: 2;
      }

      .semipolar-spinner .ring:nth-child(5) {
        animation-delay: calc(${this.duration} * 0.1 * 0);
        height: calc(${this.size} - ${this.size} * 0.2 * 4);
        left: calc(${this.size} * 0.1 * 4);
        top: calc(${this.size} * 0.1 * 4);
        width: calc(${this.size} - ${this.size} * 0.2 * 4);
        z-index: 1;
      }

      @keyframes semipolar-spinner-animation {
        50% { transform: rotate(360deg) scale(0.7); }
      }
    `}template(){return`
      <div class="semipolar-spinner">
        <div class="ring"></div>
        <div class="ring"></div>
        <div class="ring"></div>
        <div class="ring"></div>
        <div class="ring"></div>
      </div>
    `}}customElements.define(m.is,m);class b extends e{static get is(){return"spring-spinner"}static get defaults(){return{color:"#ff1d5e",duration:3,size:60}}static get observedAttributes(){return["color","duration","size"]}get color(){return`var(--spring-spinner__color, ${this.props.color})`}get duration(){return`var(--spring-spinner__duration, ${this.props.duration}s)`}get size(){return`var(--spring-spinner__size, ${this.props.size}px)`}style(){return`
      .spring-spinner {
        height: ${this.size};
        width: ${this.size};
      }

      .spring-spinner .spring-spinner-part {
        height: calc(${this.size} / 2);
        overflow: hidden;
        width: ${this.size};
      }

      .spring-spinner  .spring-spinner-part.bottom {
          transform: rotate(180deg) scale(-1, 1);
      }

      .spring-spinner .spring-spinner-rotator {
        animation: spring-spinner-animation ${this.duration} ease-in-out infinite;
        border-bottom-color: transparent;
        border-left-color: transparent;
        border-radius: 50%;
        border-right-color: ${this.color};
        border-style: solid;
        border-top-color: ${this.color};
        border-width: calc(${this.size} / 7);
        height: ${this.size};
        transform: rotate(-200deg);
        width: ${this.size};
      }

      @keyframes spring-spinner-animation {
        0% {
          border-width: calc(${this.size} / 7);
        }

        25% {
          border-width: calc(${this.size} / 23.33);
        }

        50% {
          transform: rotate(115deg);
          border-width: calc(${this.size} / 7);
        }

        75% {
          border-width: calc(${this.size} / 23.33);
        }

        100% {
          border-width: calc(${this.size} / 7);
        }
      }
    `}template(){return`
      <div class="spring-spinner">
        <div class="spring-spinner-part top">
          <div class="spring-spinner-rotator"></div>
        </div>

        <div class="spring-spinner-part bottom">
          <div class="spring-spinner-rotator"></div>
        </div>
      </div>
    `}}customElements.define(b.is,b);class w extends e{static get is(){return"swapping-squares-spinner"}static get defaults(){return{color:"#ff1d5e",duration:1,size:65}}static get observedAttributes(){return["color","duration","size"]}get color(){return`var(--swapping-squares-spinner__color, ${this.props.color})`}get duration(){return`var(--swapping-squares-spinner__duration, ${this.props.duration}s)`}get size(){return`var(--swapping-squares-spinner__size, ${this.props.size}px)`}style(){return`
      .swapping-squares-spinner {
        align-items: center;
        display: flex;
        flex-direction: row;
        height: ${this.size};
        justify-content: center;
        position: relative;
        width: ${this.size};
      }

      .swapping-squares-spinner .square {
        animation-duration: ${this.duration};
        animation-iteration-count: infinite;
        border: calc(${this.size} * 0.04 / 1.3) solid ${this.color};
        height: calc(${this.size} * 0.25 / 1.3);
        margin-left: auto;
        margin-right: auto;
        position: absolute;
        width: calc(${this.size} * 0.25 / 1.3);
      }

      .swapping-squares-spinner .square:nth-child(1) {
        animation-delay: calc(${this.duration} / 2);
        animation-name: swapping-squares-animation-child-1;
      }

      .swapping-squares-spinner .square:nth-child(2) {
        animation-delay: 0ms;
        animation-name: swapping-squares-animation-child-2;
      }

      .swapping-squares-spinner .square:nth-child(3) {
        animation-delay: calc(${this.duration} / 2);
        animation-name: swapping-squares-animation-child-3;
      }

      .swapping-squares-spinner .square:nth-child(4) {
        animation-delay: 0ms;
        animation-name: swapping-squares-animation-child-4;
      }

      @keyframes swapping-squares-animation-child-1 {
        50% { transform: translate(150%,150%) scale(2,2); }
      }

      @keyframes swapping-squares-animation-child-2 {
        50% { transform: translate(-150%,150%) scale(2,2); }
      }

      @keyframes swapping-squares-animation-child-3 {
        50% { transform: translate(-150%,-150%) scale(2,2); }
      }

      @keyframes swapping-squares-animation-child-4 {
        50% { transform: translate(150%,-150%) scale(2,2); }
      }
    `}template(){return`
      <div class="swapping-squares-spinner" :style="spinnerStyle">
        <div class="square"></div>
        <div class="square"></div>
        <div class="square"></div>
        <div class="square"></div>
      </div>
    `}}customElements.define(w.is,w);class C extends e{static get is(){return"trinity-rings-spinner"}static get defaults(){return{color:"#ff1d5e",duration:1.5,size:60}}static get observedAttributes(){return["color","duration","size"]}get color(){return`var(--trinity-rings-spinner__color, ${this.props.color})`}get duration(){return`var(--trinity-rings-spinner__duration, ${this.props.duration}s)`}get size(){return`var(--trinity-rings-spinner__size, ${this.props.size}px)`}style(){return`
      .trinity-rings-spinner {
        align-items: center;
        display: flex;
        flex-direction: row;
        height: calc(${this.size} * 2);
        justify-content: center;
        overflow: hidden;
        padding: 3px;
        position: relative;
        width: calc(${this.size} * 2);
      }

      .trinity-rings-spinner .circle {
        border-radius: 50%;
        border: 3px solid ${this.color};
        display: block;
        opacity: 1;
        position: absolute;
      }

      .trinity-rings-spinner .circle:nth-child(1) {
        animation: trinity-rings-spinner-circle1-animation ${this.duration} infinite linear;
        border-width: 3px;
        height: ${this.size};
        width: ${this.size};
      }

      .trinity-rings-spinner .circle:nth-child(2) {
        animation: trinity-rings-spinner-circle2-animation ${this.duration} infinite linear;
        border-width: 2px;
        height: calc(${this.size} * 0.65);
        width: calc(${this.size} * 0.65);
      }

      .trinity-rings-spinner .circle:nth-child(3) {
        animation:trinity-rings-spinner-circle3-animation ${this.duration} infinite linear;
        border-width: 1px;
        height: calc(${this.size} * 0.1);
        width: calc(${this.size} * 0.1);
      }

      @keyframes trinity-rings-spinner-circle1-animation{
        0%   { transform: rotateZ(20deg)  rotateY(0deg); }
        100% { transform: rotateZ(100deg) rotateY(360deg); }
      }

      @keyframes trinity-rings-spinner-circle2-animation{
        0%   { transform: rotateZ(100deg) rotateX(0deg); }
        100% { transform: rotateZ(0deg)   rotateX(360deg); }
      }

      @keyframes trinity-rings-spinner-circle3-animation{
        0%   { transform: rotateZ(100deg)  rotateX(-360deg); }
        100% { transform: rotateZ(-360deg) rotateX(360deg); }
      }
    `}template(){return`
      <div class="trinity-rings-spinner">
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
      </div>
    `}}customElements.define(C.is,C);class y extends e{static get is(){return"bar-spinner"}static get defaults(){return{color:"#36d7b7",height:4,width:100}}static get observedAttributes(){return["color","height","width"]}get color(){return`var(--bar-spinner__color, ${this.props.color})`}get height(){return`var(--bar-spinner__height, ${this.props.height}px)`}get width(){return`var(--bar-spinner__width, ${this.props.width}px)`}style(){return`
      .bar-spinner {
        height: ${this.height};
        overflow: hidden;
        position: relative;
        width: ${this.width};
      }

      .background {
        background-color: ${this.color};
        height: ${this.height};
        opacity: 0.2;
        position: absolute;
        width: ${this.width};
      }

      .long {
        animation-fill-mode: forwards;
        animation: long 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
        background-color: ${this.color};
        border-radius: 2px;
        height: ${this.height};
        position: absolute;
        will-change: left, right;
      }

      .short {
        animation-fill-mode: forwards;
        animation: short 2.1s 1.15s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
        background-color: ${this.color};
        border-radius: 2px;
        height: ${this.height};
        position: absolute;
        will-change: left, right;
      }

      @keyframes long {
        0%   { left: -35%; right: 100% }
        60%  { left: 100%; right: -90% }
        100% { left: 100%; right: -90% }
      }

      @keyframes short {
        0%   { left: -200%; right: 100% }
        60%  { left: 107%; right: -8% }
        100% { left: 107%; right: -8% }
      }
    `}template(){return`
      <div class="bar-spinner">
        <div class="background"></div>
        <div class="long"></div>
        <div class="short"></div>
      </div>
    `}}customElements.define(y.is,y);class A extends e{static get is(){return"beat-spinner"}static get defaults(){return{color:"#36d7b7",margin:2,size:15}}static get observedAttributes(){return["color","margin","size"]}get color(){return`var(--beat-spinner__color, ${this.props.color})`}get margin(){return`var(--beat-spinner__margin, ${this.props.margin}px)`}get size(){return`var(--beat-spinner__size, ${this.props.size}px)`}style(){return`
      .beat {
        animation-fill-mode: both;
        animation: beat 0.7s infinite linear;
        background-color: ${this.color};
        border-radius: 100%;
        display: inline-block;
        height: ${this.size};
        margin: ${this.margin};
        width: ${this.size};
      }

      .beat:nth-child(odd)  { animation-delay: 0s; }
      .beat:nth-child(even) { animation-delay: 0.35s; }

      @keyframes beat {
        50%  { transform: scale(0.75); opacity: 0.2 }
        100% { transform: scale(1);    opacity: 1 }
      }
    `}template(){return`
      <div class="beat-spinner">
        <div class="beat"></div>
        <div class="beat"></div>
        <div class="beat"></div>
      </div>
    `}}customElements.define(A.is,A);class L extends e{static get is(){return"bounce-spinner"}static get defaults(){return{color:"#36d7b7",size:60}}static get observedAttributes(){return["color","size"]}get color(){return`var(--bounce-spinner__color, ${this.props.color})`}get size(){return`var(--bounce-spinner__size, ${this.props.size}px)`}style(){return`
      .bounce-spinner {
        height: ${this.size};
        position: relative;
        width: ${this.size};
      }

      .bounce {
        animation-fill-mode: both;
        animation: bounce 2.1s infinite ease-in-out;
        background-color: ${this.color};
        border-radius: 100%;
        height: ${this.size};
        left: 0;
        opacity: 0.6;
        position: absolute;
        top: 0;
        width: ${this.size};
      }

      .bounce:nth-child(1) { animation-delay: 1s; }
      .bounce:nth-child(2) { animation-delay: 0s; }

      @keyframes bounce {
        0%   { transform: scale(0); }
        50%  { transform: scale(1.0); }
        100% { transform: scale(0); }
      }
    `}template(){return`
      <div class="bounce-spinner">
        <div class="bounce"></div>
        <div class="bounce"></div>
      </div>
    `}}customElements.define(L.is,L);class S extends e{static get is(){return"circle-spinner"}static get defaults(){return{color:"#36d7b7",size:60}}static get observedAttributes(){return["color","size"]}get color(){return`var(--circle-spinner__color, ${this.props.color})`}get size(){return`var(--circle-spinner__size, ${this.props.size}px)`}calculateCircle(e){return`
      animation-delay: ${-.2*e}s;
      height: calc(${this.size} * ${1-e/10});
      left: ${2.5*(.7*e)}%;
      top: ${2.5*(.35*e)}%;
      width: calc(${this.size} * ${1-e/10});
    `}style(){return`
      .circle-spinner {
        height: ${this.size};
        position: relative;
        width: ${this.size};
      }

      .circle {
        animation-fill-mode: "";
        animation: circle 1s infinite linear;
        border-top-color: ${this.color};
        border-left-color: ${this.color};
        border-radius: 100%;
        border-style: solid none none solid;
        border-width: 1px 1px;
        position: absolute;
        transition: all 2s ease 0s;
      }

      .circle:nth-child(1) { ${this.calculateCircle(0)} }
      .circle:nth-child(2) { ${this.calculateCircle(1)} }
      .circle:nth-child(3) { ${this.calculateCircle(2)} }
      .circle:nth-child(4) { ${this.calculateCircle(3)} }
      .circle:nth-child(5) { ${this.calculateCircle(4)} }

      @keyframes circle {
        0%   { transform: rotate(0deg); }
        50%  { transform: rotate(180deg); }
        100% { transform: rotate(360deg); }
      }
    `}template(){return`
      <div class="circle-spinner">
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
      </div>
    `}}customElements.define(S.is,S);class k extends e{static get is(){return"climbing-box-spinner"}static get defaults(){return{color:"#36d7b7",size:15}}static get observedAttributes(){return["color","size"]}get color(){return`var(--climbing-box-spinner__color, ${this.props.color})`}get size(){return`var(--climbing-box-spinner__size, ${this.props.size}px)`}style(){return`
      .climbing-box-spinner {
        height: 7.1em;
        position: relative;
        width: 7.1em;
      }

      .box {
        animation-fill-mode: both;
        animation: climbingBox 2.5s infinite cubic-bezier(0.79, 0, 0.47, 0.97);
        background-color: transparent;
        border-radius: 15%;
        border: 0.25em solid ${this.color};
        bottom: -0.1em;
        box-sizing: content-box;
        height: 1em;
        left: 0;
        position: absolute;
        transform: translate(0, -1em) rotate(-45deg);
        width: 1em;
      }

      .hill {
        border-left: 0.25em solid ${this.color};
        height: 7.1em;
        left: 1.7em;
        position: absolute;
        top: 1.7em;
        transform: rotate(45deg);
        width: 7.1em;
      }

      .wrapper {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -2.7em;
        margin-left: -2.7em;
        width: 5.4em;
        height: 5.4em;
        font-size: ${this.size};
      }

      @keyframes climbingBox {
        0%   { transform: translate(0, -1em)   rotate(-45deg) }
        5%   { transform: translate(0, -1em)   rotate(-50deg) }
        20%  { transform: translate(1em, -2em) rotate(47deg) }
        25%  { transform: translate(1em, -2em) rotate(45deg) }
        30%  { transform: translate(1em, -2em) rotate(40deg) }
        45%  { transform: translate(2em, -3em) rotate(137deg) }
        50%  { transform: translate(2em, -3em) rotate(135deg) }
        55%  { transform: translate(2em, -3em) rotate(130deg) }
        70%  { transform: translate(3em, -4em) rotate(217deg) }
        75%  { transform: translate(3em, -4em) rotate(220deg) }
        100% { transform: translate(0, -1em)   rotate(-225deg) }
      }
    `}template(){return`
      <div class="climbing-box-spinner">
        <div class="wrapper">
          <div class="box"></div>
          <div class="hill"></div>
        </div>
      </div>
    `}}customElements.define(k.is,k);class v extends e{static get is(){return"clip-spinner"}static get defaults(){return{color:"#36d7b7",size:35}}static get observedAttributes(){return["color","size"]}get color(){return`var(--clip-spinner__color, ${this.props.color})`}get size(){return`var(--clip-spinner__size, ${this.props.size}px)`}style(){return`
      .clip-spinner {
        animation-fill-mode: both;
        animation: clip 0.75s 0s infinite linear;
        background: transparent !important;
        border-bottom-color: transparent;
        border-left-color: ${this.color};
        border-radius: 100%;
        border-right-color: ${this.color};
        border-style: solid;
        border-top-color: ${this.color};
        border-width: 2px;
        height: ${this.size};
        width: ${this.size};
      }

      @keyframes clip {
        0%   { transform: rotate(0deg)   scale(1); }
        50%  { transform: rotate(180deg) scale(0.8); }
        100% { transform: rotate(360deg) scale(1); }
      }
    `}template(){return`
      <div class="clip-spinner"></div>
    `}}customElements.define(v.is,v);class q extends e{static get is(){return"dot-spinner"}static get defaults(){return{color:"#36d7b7",size:60}}static get observedAttributes(){return["color","size"]}get color(){return`var(--dot-spinner__color, ${this.props.color})`}get size(){return`var(--dot-spinner__size, ${this.props.size}px)`}style(){return`
      .dot-spinner {
        animation-fill-mode: forwards;
        animation: rotate 2s 0s infinite linear;
        height: ${this.size};
        position: relative;
        width: ${this.size};
      }

      .dot {
        animation-fill-mode: forwards;
        animation: bounce 2s infinite linear;
        background-color: ${this.color};
        border-radius: 100%;
        height: calc(${this.size} / 2);
        position: absolute;
        width: calc(${this.size} / 2);
      }

      .dot:nth-child(1) {
        animation-delay: 0s;
        bottom: auto;
        top: 0;
      }

      .dot:nth-child(2) {
        animation-delay: -1s;
        bottom: 0;
        top: auto;
      }

      @keyframes bounce {
        0%   { transform: scale(0); }
        50%  { transform: scale(1.0); }
        100% { transform: scale(0); }
      }

      @keyframes rotate {
        100% { transform: rotate(360deg); }
      }
    `}template(){return`
      <div class="dot-spinner">
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    `}}customElements.define(q.is,q);class D extends e{static get is(){return"fade-spinner"}static get defaults(){return{color:"#36d7b7",height:15,radius:10,width:5}}static get observedAttributes(){return["color","height","radius","width"]}get color(){return`var(--fade-spinner__color, ${this.props.color})`}get height(){return`var(--fade-spinner__height, ${this.props.height}px)`}get radius(){return`var(--fade-spinner__radius, ${this.props.radius}px)`}get width(){return`var(--fade-spinner__width, ${this.props.width}px)`}get center(){return`calc(${this.radius} + ${this.height})`}buildLine(e){return`
      .container:nth-child(${e}) { transform: rotate(${45*(e-1)}deg); }
      .container:nth-child(${e}) .line { animation-delay: calc(${e-1} * .12s); }
    `}style(){return`
      .fade-spinner {
        font-size: 0;
        height: calc(${this.center} * 2);
        width: calc(${this.center} * 2);
        position: relative;
      }

      .container {
        height: calc(${this.center} * 2);
        width: ${this.width};
        position: absolute;
        top: 0;
        left: calc(${this.center} - ${this.width} / 2);
      }

      .line {
        animation-fill-mode: both;
        animation: fade 1.2s infinite ease-in-out;
        background-color: ${this.color};
        border-radius: 4px;
        height: ${this.height};
        transition: 2s;
        width: ${this.width};
      }

      ${this.buildLine(1)}
      ${this.buildLine(2)}
      ${this.buildLine(3)}
      ${this.buildLine(4)}
      ${this.buildLine(5)}
      ${this.buildLine(6)}
      ${this.buildLine(7)}
      ${this.buildLine(8)}

      @keyframes fade {
        50%  { opacity: 0.3; }
        100% { opacity: 1; }
      }
    `}template(){return`
      <div class="fade-spinner">
        <div class="container">
          <div class="line"></div>
        </div>

        <div class="container">
          <div class="line"></div>
        </div>

        <div class="container">
          <div class="line"></div>
        </div>

        <div class="container">
          <div class="line"></div>
        </div>

        <div class="container">
          <div class="line"></div>
        </div>

        <div class="container">
          <div class="line"></div>
        </div>

        <div class="container">
          <div class="line"></div>
        </div>

        <div class="container">
          <div class="line"></div>
        </div>
      </div>
    `}}customElements.define(D.is,D);class j extends e{static get is(){return"grid-spinner"}static get defaults(){return{color:"#36d7b7",margin:2,size:15}}static get observedAttributes(){return["color","margin","size"]}get color(){return`var(--grid-spinner__color, ${this.props.color})`}get margin(){return`var(--grid-spinner__margin, ${this.props.margin}px)`}get size(){return`var(--grid-spinner__size, ${this.props.size}px)`}generateCellAnimation(){const e=Math.random();return`
      animation-duration: ${e+.6}s;
      animation-delay: ${e-.2}s;
    `}style(){return`
      .grid-spinner {
        font-size: 0;
        width: calc(${this.size} * 3 + ${this.margin} * 6);
      }

      .cell {
        animation-fill-mode: both;
        animation: grid infinite ease;
        background-color: ${this.color};
        border-radius: 100%;
        display: inline-block;
        height: ${this.size};
        margin: ${this.margin};
        width: ${this.size};
      }

      .cell:nth-child(1) { ${this.generateCellAnimation()} }
      .cell:nth-child(2) { ${this.generateCellAnimation()} }
      .cell:nth-child(3) { ${this.generateCellAnimation()} }
      .cell:nth-child(4) { ${this.generateCellAnimation()} }
      .cell:nth-child(5) { ${this.generateCellAnimation()} }
      .cell:nth-child(6) { ${this.generateCellAnimation()} }
      .cell:nth-child(7) { ${this.generateCellAnimation()} }
      .cell:nth-child(8) { ${this.generateCellAnimation()} }
      .cell:nth-child(9) { ${this.generateCellAnimation()} }

      @keyframes grid {
        0%   { transform: scale(1); }
        50%  { transform: scale(0.5); opacity: 0.7; }
        100% { transform: scale(1); opacity: 1; }
      }
    `}template(){return`
      <div class="grid-spinner">
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
      </div>
    `}}customElements.define(j.is,j);class x extends e{static get is(){return"hash-spinner"}static get defaults(){return{color:"#36d7b7",size:50}}static get observedAttributes(){return["color","size"]}get color(){return`var(--hash-spinner__color, ${this.props.color})`}get lat(){return`calc(calc(${this.size} - ${this.thickness}) / 2)`}get offset(){return`calc(${this.lat} - ${this.thickness})`}get size(){return`var(--hash-spinner__size, ${this.props.size}px)`}get thickness(){return`calc(${this.size} / 5)`}style(){return`
      .hash-spinner {
        height: ${this.size};
        position: relative;
        transform: rotate(165deg);
        width: ${this.size};
      }

      .hash {
        animation-duration: 2s;
        animation-fill-mode: none;
        animation-iteration-count: infinite;
        border-radius: calc(${this.size} / 10);
        content: "";
        display: block;
        height: calc(${this.size} / 5);
        left: 50%;
        opacity: .8;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: calc(${this.size} / 5);
      }

      .hash:nth-child(1) { animation-name: before; }
      .hash:nth-child(2) { animation-name: after; }

      @keyframes before {
        0% {
          box-shadow: ${this.lat} calc(${this.offset} * -1) ${this.color},
                      calc(${this.lat} * -1) ${this.offset} ${this.color};
          width: ${this.thickness};
        }

        35% {
          box-shadow: 0 calc(${this.offset} * -1) ${this.color},
                      0 ${this.offset} ${this.color};
          width: ${this.size};
        }

        70% {
          box-shadow: calc(${this.lat} * -1) calc(${this.offset} * -1) ${this.color},
                      ${this.lat} ${this.offset} ${this.color};
          width: ${this.thickness};
        }

        100% {
          box-shadow: ${this.lat} calc(${this.offset} * -1) ${this.color},
                      calc(${this.lat} * -1) ${this.offset} ${this.color};
        }
      }

      @keyframes after {
        0% {
          box-shadow: ${this.offset} ${this.lat} ${this.color},
                      calc(${this.offset} * -1) calc(${this.lat} * -1) ${this.color};
          height: ${this.thickness};
        }

        35% {
          box-shadow: ${this.offset} 0 ${this.color},
                      calc(${this.offset} * -1) 0 ${this.color};
          height: ${this.size};
        }

        70% {
          box-shadow: ${this.offset} calc(${this.lat} * -1) ${this.color},
                      calc(${this.offset} * -1) ${this.lat} ${this.color};
          height: ${this.thickness};
        }

        100% {
          box-shadow: ${this.offset} ${this.lat} ${this.color},
                      calc(${this.offset} * -1) calc(${this.lat} * -1) ${this.color};
        }
      }
    `}template(){return`
      <div class="hash-spinner">
        <div class="hash"></div>
        <div class="hash"></div>
      </div>
    `}}customElements.define(x.is,x);class H extends e{static get is(){return"moon-spinner"}static get defaults(){return{color:"#36d7b7",size:60}}static get observedAttributes(){return["color","size"]}get color(){return`var(--moon-spinner__color, ${this.props.color})`}get moonSize(){return`calc(${this.size} / 7)`}get size(){return`var(--moon-spinner__size, ${this.props.size}px)`}ballStyle(e){return`
      border-radius: 100%;
      height: ${e};
      width: ${e};
    `}style(){return`
      .moon-spinner {
        animation-fill-mode: forwards;
        animation: moon 0.6s 0s infinite linear;
        height: calc(${this.size} + ${this.moonSize} * 2);
        position: relative;
        width: calc(${this.size} + ${this.moonSize} * 2);
      }

      .ball {
        ${this.ballStyle(this.moonSize)};
        animation-fill-mode: forwards;
        animation: moon 0.6s 0s infinite linear;
        background-color: ${this.color};
        opacity: 0.8;
        position: absolute;
        top: calc(${this.size} / 2 - ${this.moonSize} / 2);
      }

      .circle {
        ${this.ballStyle(this.size)};
        border: ${this.moonSize} solid ${this.color};
        box-sizing: content-box;
        opacity: 0.1;
      }

      @keyframes moon {
        100% { transform: rotate(360deg); }
      }
    `}template(){return`
      <div class="moon-spinner">
        <div class="ball"></div>
        <div class="circle"></div>
      </div>
    `}}customElements.define(H.is,H);class M extends e{static get is(){return"pacman-spinner"}static get defaults(){return{color:"#36d7b7",margin:2,size:25}}static get observedAttributes(){return["color","margin","size"]}get color(){return`var(--pacman-spinner__color, ${this.props.color})`}get margin(){return`var(--pacman-spinner__margin, ${this.props.margin}px)`}get size(){return`var(--pacman-spinner__size, ${this.props.size}px)`}ballDelay(e){return`animation-delay: ${.25*e}s;`}style(){return`
      .pacman-spinner {
        font-size: 0;
        height: calc(${this.size} * 2);
        position: relative;
        width: calc(${this.size} * 2);
      }

      .pacman-top {
        animation-fill-mode: both;
        animation: pacman1 0.8s infinite ease-in-out;
        border-bottom: ${this.size} solid ${this.color};
        border-left: ${this.size} solid ${this.color};
        border-radius: ${this.size};
        border-right: ${this.size} solid transparent;
        border-top: ${this.size} solid transparent;
        height: 0;
        position: absolute;
        width: 0;
      }

      .pacman-bottom {
        animation-fill-mode: both;
        animation: pacman2 0.8s infinite ease-in-out;
        border-bottom: ${this.size} solid transparent;
        border-left: ${this.size} solid ${this.color};
        border-radius: ${this.size};
        border-right: ${this.size} solid transparent;
        border-top: ${this.size} solid ${this.color};
        height: 0;
        position: absolute;
        width: 0;
      }

      .ball {
        animation-fill-mode: both;
        animation: ball 1s infinite linear;
        background-color: ${this.color};
        border-radius: 100%;
        height: calc(${this.size} / 2.5);
        left: calc(${this.size} * 4);
        margin: ${this.margin};
        position: absolute;
        top: ${this.size};
        transform: translate(0, calc(${this.size} / -4));
        width: calc(${this.size} / 2.5);
      }

      .ball:nth-child(3) { ${this.ballDelay(-3)} }
      .ball:nth-child(4) { ${this.ballDelay(-2)} }
      .ball:nth-child(5) { ${this.ballDelay(-1)} }
      .ball:nth-child(6) { ${this.ballDelay(0)} }

      @keyframes ball {
        75%  { opacity: 0.7; }

        100% {
          transform: translate(calc(${this.size} * -4), calc(${this.size} / -4));
        }
      }

      @keyframes pacman1 {
        0%  { transform: rotate(0deg); }
        50% { transform: rotate(-44deg); }
      }

      @keyframes pacman2 {
        0%  { transform: rotate(0deg); }
        50% { transform: rotate(44deg); }
      }
    `}template(){return`
      <div class="pacman-spinner">
        <div class="pacman-top"></div>
        <div class="pacman-bottom"></div>
        <div class="ball"></div>
        <div class="ball"></div>
        <div class="ball"></div>
        <div class="ball"></div>
      </div>
    `}}customElements.define(M.is,M);class T extends e{static get is(){return"propagate-spinner"}static get defaults(){return{color:"#36d7b7",size:15}}static get observedAttributes(){return["color","size"]}get color(){return`var(--propagate-spinner__color, ${this.props.color})`}get size(){return`var(--propagate-spinner__size, ${this.props.size}px)`}style(){const e=[1,3,5];return`
      .propagate-spinner {
        position: relative;
      }

      .ball {
        animation-duration: 1.5s;
        animation-fill-mode: forwards;
        animation-iteration-count: infinite;
        background: ${this.color};
        border-radius: 50%;
        font-size: calc(${this.size} / 3);
        height: ${this.size};
        left: calc(${this.size} / -2);
        position: absolute;
        top: calc(${this.size} / -2);
        width: ${this.size};
      }

      .ball:nth-child(1) { animation-name: ball1; }
      .ball:nth-child(2) { animation-name: ball2; }
      .ball:nth-child(3) { animation-name: ball3; }
      .ball:nth-child(4) { animation-name: ball4; }
      .ball:nth-child(5) { animation-name: ball5; }
      .ball:nth-child(6) { animation-name: ball6; }

      @keyframes ball1 {
        25% { transform: translateX(-${e[0]}rem) scale(0.75); }
        50% { transform: translateX(-${e[1]}rem) scale(0.6); }
        75% { transform: translateX(-${e[2]}rem) scale(0.5); }
        95% { transform: translateX(0rem)               scale(1); }
      }

      @keyframes ball2 {
        25% { transform: translateX(-${e[0]}rem) scale(0.75); }
        50% { transform: translateX(-${e[1]}rem) scale(0.6); }
        75% { transform: translateX(-${e[1]}rem) scale(0.6); }
        95% { transform: translateX(0rem)               scale(1); }
      }

      @keyframes ball3 {
        25% { transform: translateX(-${e[0]}rem) scale(0.75); }
        75% { transform: translateX(-${e[0]}rem) scale(0.75); }
        95% { transform: translateX(0rem)               scale(1); }
      }

      @keyframes ball4 {
        25% { transform: translateX(${e[0]}rem) scale(0.75); }
        75% { transform: translateX(${e[0]}rem) scale(0.75); }
        95% { transform: translateX(0rem)              scale(1); }
      }

      @keyframes ball5 {
        25% { transform: translateX(${e[0]}rem) scale(0.75); }
        50% { transform: translateX(${e[1]}rem) scale(0.6); }
        75% { transform: translateX(${e[1]}rem) scale(0.6); }
        95% { transform: translateX(0rem)              scale(1); }
      }

      @keyframes ball6 {
        25% { transform: translateX(${e[0]}rem) scale(0.75); }
        50% { transform: translateX(${e[1]}rem) scale(0.6); }
        75% { transform: translateX(${e[2]}rem) scale(0.5); }
        95% { transform: translateX(0rem)              scale(1); }
      }
    `}template(){return`
      <div class="propagate-spinner">
        <div class="ball"></div>
        <div class="ball"></div>
        <div class="ball"></div>
        <div class="ball"></div>
        <div class="ball"></div>
        <div class="ball"></div>
      </div>
    `}}customElements.define(T.is,T);class I extends e{static get is(){return"pulse-spinner"}static get defaults(){return{color:"#36d7b7",margin:2,size:15}}static get observedAttributes(){return["color","margin","size"]}get color(){return`var(--pulse-spinner__color, ${this.props.color})`}get margin(){return`var(--pulse-spinner__margin, ${this.props.margin}px)`}get size(){return`var(--pulse-spinner__size, ${this.props.size}px)`}style(){return`
      .pulse-spinner {
        display: flex;
        align-items: center;
      }

      .ball {
        animation-fill-mode: both;
        animation: pulse 0.75s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);
        background-color: ${this.color};
        border-radius: 100%;
        display: inline-block;
        height: ${this.size};
        margin: ${this.margin};
        width: ${this.size};
      }

      .ball:nth-child(1) { animation-delay: 0s; }
      .ball:nth-child(2) { animation-delay: .12s; }
      .ball:nth-child(3) { animation-delay: .24s; }

      @keyframes pulse {
        0%  { transform: scale(1);   opacity: 1; }
        45% { transform: scale(0.1); opacity: 0.7; }
        80% { transform: scale(1);   opacity: 1; }
      }
    `}template(){return`
      <div class="pulse-spinner">
        <div class="ball"></div>
        <div class="ball"></div>
        <div class="ball"></div>
      </div>
    `}}customElements.define(I.is,I);class J extends e{static get is(){return"ring-spinner"}static get defaults(){return{color:"#36d7b7",size:60}}static get observedAttributes(){return["color","size"]}get color(){return`var(--ring-spinner__color, ${this.props.color})`}get size(){return`var(--ring-spinner__size, ${this.props.size}px)`}style(){return`
      .ring-spinner {
        height: ${this.size};
        position: relative;
        width: ${this.size};
      }

      .ring {
        animation-fill-mode: forwards;
        animation: 2s 0s infinite linear;
        border-radius: 100%;
        border: calc(${this.size} / 10) solid ${this.color};
        height: ${this.size};
        left: 0;
        opacity: 0.4;
        perspective: 800px;
        position: absolute;
        top: 0;
        width: ${this.size};
      }

      .ring:nth-child(1) { animation-name: right; }
      .ring:nth-child(2) { animation-name: left; }

      @keyframes left {
        0%   { transform: rotateX(0deg)   rotateY(0deg)   rotateZ(0deg); }
        100% { transform: rotateX(360deg) rotateY(180deg) rotateZ(360deg); }
      }

      @keyframes right {
        0%   { transform: rotateX(0deg)   rotateY(0deg)   rotateZ(0deg); }
        100% { transform: rotateX(180deg) rotateY(360deg) rotateZ(360deg); }
      }
    `}template(){return`
      <div class="ring-spinner">
        <div class="ring"></div>
        <div class="ring"></div>
      </div>
    `}}customElements.define(J.is,J);class K extends e{static get is(){return"rise-spinner"}static get defaults(){return{color:"#36d7b7",margin:2,size:15}}static get observedAttributes(){return["color","margin","size"]}get color(){return`var(--rise-spinner__color, ${this.props.color})`}get margin(){return`var(--rise-spinner__margin, ${this.props.margin}px)`}get size(){return`var(--rise-spinner__size, ${this.props.size}px)`}style(){return`
      .ball {
        animation-fill-mode: both;
        animation: 1s 0s infinite cubic-bezier(0.15, 0.46, 0.9, 0.6);
        background-color: ${this.color};
        border-radius: 100%;
        display: inline-block;
        height: ${this.size};
        margin: ${this.margin};
        width: ${this.size};
      }

      .ball:nth-child(even) { animation-name: even; }
      .ball:nth-child(odd) { animation-name: odd; }

      @keyframes even {
        0%   { transform: scale(1.1); }
        25%  { translateY(-30px); }
        50%  { transform: scale(0.4); }
        75%  { transform: translateY(30px); }
        100% { transform: translateY(0) scale(1.0); }
      }

      @keyframes odd {
        0%   { transform: scale(0.4); }
        25%  { translateY(30px); }
        50%  { transform: scale(1.1); }
        75%  { transform: translateY(-30px); }
        100% { transform: translateY(0) scale(0.75); }
      }
    `}template(){return`
      <div class="rise-spinner">
        <div class="ball"></div>
        <div class="ball"></div>
        <div class="ball"></div>
        <div class="ball"></div>
        <div class="ball"></div>
      </div>
    `}}customElements.define(K.is,K);class E extends e{static get is(){return"rotate-spinner"}static get defaults(){return{color:"#36d7b7",margin:5,size:15}}static get observedAttributes(){return["color","margin","size"]}get color(){return`var(--rotate-spinner__color, ${this.props.color})`}get margin(){return`var(--rotate-spinner__margin, ${this.props.margin}px)`}get size(){return`var(--rotate-spinner__size, ${this.props.size}px)`}style(){return`
      .rotate-spinner {
        animation-fill-mode: both;
        animation: rotate 1s 0s infinite cubic-bezier(0.7, -0.13, 0.22, 0.86);
        display: flex;
        position: relative;
      }

      .ball {
        background-color: ${this.color};
        border-radius: 100%;
        height: ${this.size};
        margin: ${this.margin};
        width: ${this.size};
      }

      @keyframes rotate {
        0%   { transform: rotate(0deg); }
        50%  { transform: rotate(180deg); }
        100% { transform: rotate(360deg); }
      }
    `}template(){return`
      <div class="rotate-spinner">
        <div class="ball"></div>
        <div class="ball"></div>
        <div class="ball"></div>
      </div>
    `}}customElements.define(E.is,E);class F extends e{static get is(){return"scale-spinner"}static get defaults(){return{color:"#36d7b7",height:35,margin:2,radius:2,width:4}}static get observedAttributes(){return["color","height","margin","radius","width"]}get color(){return`var(--scale-spinner__color, ${this.props.color})`}get height(){return`var(--scale-spinner__height, ${this.props.height}px)`}get margin(){return`var(--scale-spinner__margin, ${this.props.margin}px)`}get radius(){return`var(--scale-spinner__radius, ${this.props.radius}px)`}get width(){return`var(--scale-spinner__width, ${this.props.width}px)`}get size(){return`var(--scale-spinner__size, ${this.props.size}px)`}style(){return`
      .scale-spinner {
        animation-fill-mode: both;
        animation: rotate 1s 0s infinite cubic-bezier(0.7, -0.13, 0.22, 0.86);
        display: flex;
        position: relative;
      }

      .line {
        animation-fill-mode: both;
        animation: scale 1s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);
        background-color: ${this.color};
        border-radius: ${this.radius};
        display: inline-block;
        height: ${this.height};
        margin: ${this.margin};
        width: ${this.width};
      }

      .line:nth-child(1) { animation-delay: 0.1s; }
      .line:nth-child(2) { animation-delay: 0.2s; }
      .line:nth-child(3) { animation-delay: 0.3s; }
      .line:nth-child(4) { animation-delay: 0.4s; }
      .line:nth-child(5) { animation-delay: 0.5s; }

      @keyframes scale {
        0%   { transform: scaley(1.0); }
        50%  { transform: scaley(0.4); }
        100% { transform: scaley(1.0); }
      }
    `}template(){return`
      <div class="scale-spinner">
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
      </div>
    `}}customElements.define(F.is,F);class N extends e{static get is(){return"skew-spinner"}static get defaults(){return{color:"#36d7b7",size:20}}static get observedAttributes(){return["color","size"]}get color(){return`var(--skew-spinner__color, ${this.props.color})`}get size(){return`var(--skew-spinner__size, ${this.props.size}px)`}style(){return`
      .skew-spinner {
        animation-fill-mode: both;
        animation: skew 3s 0s infinite cubic-bezier(0.09, 0.57, 0.49, 0.9);
        border-bottom: ${this.size} solid ${this.color};
        border-left: ${this.size} solid transparent;
        border-right: ${this.size} solid transparent;
        display: inline-block;
        height: 0;
        width: 0;
      }

      @keyframes skew {
        25%  { transform: perspective(100px) rotateX(180deg) rotateY(0); }
        50%  { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
        75%  { transform: perspective(100px) rotateX(0)      rotateY(180deg); }
        100% { transform: perspective(100px) rotateX(0)      rotateY(0); }
      }
    `}template(){return`
      <div class="skew-spinner"></div>
    `}}customElements.define(N.is,N);class O extends e{static get is(){return"square-spinner"}static get defaults(){return{color:"#36d7b7",size:50}}static get observedAttributes(){return["color","size"]}get color(){return`var(--square-spinner__color, ${this.props.color})`}get size(){return`var(--square-spinner__size, ${this.props.size}px)`}style(){return`
      .square-spinner {
        animation-fill-mode: both;
        animation: square 3s 0s infinite cubic-bezier(0.09, 0.57, 0.49, 0.9);
        background-color: ${this.color};
        display: inline-block;
        height: ${this.size};
        width: ${this.size};
      }

      @keyframes square {
        25%  { transform: rotateX(180deg) rotateY(0); }
        50%  { transform: rotateX(180deg) rotateY(180deg); }
        75%  { transform: rotateX(0)      rotateY(180deg); }
        100% { transform: rotateX(0)      rotateY(0); }
      }
    `}template(){return`
      <div class="square-spinner"></div>
    `}}customElements.define(O.is,O);class P extends e{static get is(){return"sync-spinner"}static get defaults(){return{color:"#36d7b7",margin:2,size:15}}static get observedAttributes(){return["color","margin","size"]}get color(){return`var(--sync-spinner__color, ${this.props.color})`}get margin(){return`var(--sync-spinner__margin, ${this.props.margin}px)`}get size(){return`var(--sync-spinner__size, ${this.props.size}px)`}style(){return`
      .sync-spinner {
        display: flex;
      }

      .ball {
        animation-fill-mode: both;
        animation: sync 0.6s infinite ease-in-out;
        background-color: ${this.color};
        border-radius: 100%;
        height: ${this.size};
        margin: ${this.margin};
        width: ${this.size};
      }

      .ball:nth-child(1) { animation-delay: 0s; }
      .ball:nth-child(2) { animation-delay: 0.07s; }
      .ball:nth-child(3) { animation-delay: 0.14s; }

      @keyframes sync {
        33%  { transform: translateY(10px); }
        66%  { transform: translateY(-10px); }
        100% { transform: translateY(0); }
      }
    `}template(){return`
      <div class="sync-spinner">
        <div class="ball"></div>
        <div class="ball"></div>
        <div class="ball"></div>
      </div>
    `}}customElements.define(P.is,P);class Q extends e{static get is(){return"rsc-circle-spinner"}static get defaults(){return{color:"#7f58af",size:64}}static get observedAttributes(){return["color","size"]}get color(){return`var(--rsc-circle-spinner__color, ${this.props.color})`}get size(){return`var(--rsc-circle-spinner__size, ${this.props.size}px)`}style(){return`
      .lds-circle {
        animation: lds-circle 2.4s cubic-bezier(0, 0.2, 0.8, 1) infinite;
        background: ${this.color};
        border-radius: 50%;
        display: inline-block;
        height: ${this.size};
        margin: 8px;
        width: ${this.size};
      }

      @keyframes lds-circle {
        0% {
          animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5);
          transform: rotateY(0deg);
        }

        50% {
          animation-timing-function: cubic-bezier(0, 0.5, 0.5, 1);
          transform: rotateY(1800deg);
        }

        100% {
          animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5);
          transform: rotateY(3600deg);
        }
      }
    `}template(){return"<div class=\"lds-circle\"></div>"}}customElements.define(Q.is,Q);class R extends e{static get is(){return"default-spinner"}static get defaults(){return{color:"#7f58af",size:80}}static get observedAttributes(){return["color","size"]}get color(){return`var(--default-spinner__color, ${this.props.color})`}get size(){return`var(--default-spinner__size, ${this.props.size}px)`}style(){return`
      .lds-default {
        display: inline-block;
        height: 80px;
        position: relative;
        width: 80px;
      }

      .lds-default div {
        animation: lds-default 1.2s linear infinite;
        background: #fff;
        background: ${this.color};
        border-radius: 50%;
        height: 6px;
        height: calc(${this.size} * 0.075);
        position: absolute;
        width: 6px;
        width: calc(${this.size} * 0.075);
      }

      .lds-default div:nth-child(1) {
        animation-delay: 0s;
        left: 82.5%;
        top: 46.25%;
      }

      .lds-default div:nth-child(2) {
        animation-delay: -0.1s;
        left: 77.5%;
        top: 27.5%;
      }

      .lds-default div:nth-child(3) {
        animation-delay: -0.2s;
        left: 65%;
        top: 13.75%;
      }

      .lds-default div:nth-child(4) {
        animation-delay: -0.3s;
        left: 46.25%;
        top: 8.75%;
      }

      .lds-default div:nth-child(5) {
        animation-delay: -0.4s;
        left: 27.5%;
        top: 13.75%;
      }

      .lds-default div:nth-child(6) {
        animation-delay: -0.5s;
        left: 13.75%;
        top: 27.5%;
      }

      .lds-default div:nth-child(7) {
        animation-delay: -0.6s;
        left: 8.75%;
        top: 46.25%;
      }

      .lds-default div:nth-child(8) {
        animation-delay: -0.7s;
        left: 13.75%;
        top: 65%;
      }

      .lds-default div:nth-child(9) {
        animation-delay: -0.8s;
        left: 27.5%;
        top: 77.5%;
      }

      .lds-default div:nth-child(10) {
        animation-delay: -0.9s;
        left: 46.25%;
        top: 82.5%;
      }

      .lds-default div:nth-child(11) {
        animation-delay: -1s;
        left: 65%;
        top: 77.5%;
      }

      .lds-default div:nth-child(12) {
        animation-delay: -1.1s;
        left: 77.5%;
        top: 65%;
      }

      @keyframes lds-default {
        0%, 20%, 80%, 100% { transform: scale(1); }
        50% { transform: scale(1.5); }
      }
    `}template(){return`
      <div class="lds-default"}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    `}}customElements.define(R.is,R);class G extends e{static get is(){return"dual-ring-spinner"}static get defaults(){return{color:"#7f58af",size:80}}static get observedAttributes(){return["color","size"]}get color(){return`var(--dual-ring-spinner__color, ${this.props.color})`}get size(){return`var(--dual-ring-spinner__size, ${this.props.size}px)`}style(){return`
      .lds-dual-ring {
        display: inline-block;
        height: ${this.size};
        width: ${this.size};
      }

      .lds-dual-ring-after {
        box-sizing: content-box;
        animation: lds-dual-ring 1.2s linear infinite;
        border-color: ${this.color} transparent;
        border-radius: 50%;
        border-style: solid;
        border-width: calc(${this.size} * 0.1);
        content: " ";
        display: block;
        height: calc(calc(${this.size} * 0.7) - 6px);
        margin: 8px;
        width: calc(calc(${this.size} * 0.7) - 6px);
      }

      @keyframes lds-dual-ring {
        0%   { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}template(){return`
      <div class="lds-dual-ring">
        <div class="lds-dual-ring-after"></div>
      </div>
    `}}customElements.define(G.is,G);class _ extends e{static get is(){return"ellipsis-spinner"}static get defaults(){return{color:"#7f58af",size:80}}static get observedAttributes(){return["color","size"]}get color(){return`var(--ellipsis-spinner__color, ${this.props.color})`}get size(){return`var(--ellipsis-spinner__size, ${this.props.size}px)`}style(){return`
      .lds-ellipsis {
        display: inline-block;
        height: ${this.size};
        position: relative;
        width: ${this.size};
      }

      .lds-ellipsis div {
        animation-timing-function: cubic-bezier(0, 1, 1, 0);
        background: ${this.color};
        border-radius: 50%;
        height: 16.25%;
        position: absolute;
        top: 41.25%;
        width: 16.25%;
      }

      .lds-ellipsis div:nth-child(1) {
        animation: lds-ellipsis1 0.6s infinite;
        left: 10%;
      }

      .lds-ellipsis div:nth-child(2) {
        animation: lds-ellipsis2 0.6s infinite;
        left: 10%;
      }

      .lds-ellipsis div:nth-child(3) {
        animation: lds-ellipsis2 0.6s infinite;
        left: 40%;
      }

      .lds-ellipsis div:nth-child(4) {
        animation: lds-ellipsis3 0.6s infinite;
        left: 70%;
      }

      @keyframes lds-ellipsis1 {
        0%   { transform: scale(0); }
        100% { transform: scale(1); }
      }

      @keyframes lds-ellipsis3 {
        0%   { transform: scale(1); }
        100% { transform: scale(0); }
      }

      @keyframes lds-ellipsis2 {
        0%   { transform: translate(0, 0); }
        100% { transform: translate(184.61%, 0); }
      }
    `}template(){return`
      <div class="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    `}}customElements.define(_.is,_);class U extends e{static get is(){return"facebook-spinner"}static get defaults(){return{color:"#7f58af",size:80}}static get observedAttributes(){return["color","size"]}get color(){return`var(--facebook-spinner__color, ${this.props.color})`}get size(){return`var(--facebook-spinner__size, ${this.props.size}px)`}style(){return`
      .lds-facebook {
        display: inline-block;
        height: ${this.size};
        position: relative;
        width: ${this.size};
      }

      .lds-facebook div {
        animation: lds-facebook 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
        background: ${this.color};
        display: inline-block;
        left: 10%;
        position: absolute;
        width: 20%;
      }

      .lds-facebook div:nth-child(1) {
        animation-delay: -0.24s;
        left: 10%;
      }

      .lds-facebook div:nth-child(2) {
        animation-delay: -0.12s;
        left: 40%;
      }

      .lds-facebook div:nth-child(3) {
        animation-delay: 0;
        left: 70%;
      }

      @keyframes lds-facebook {
        0% {
          height: 80%;
          top: 10%;
        }

        50%, 100% {
          height: 40%;
          top: 30%;
        }
      }
    `}template(){return`
      <div class="lds-facebook">
        <div></div>
        <div></div>
        <div></div>
      </div>
    `}}customElements.define(U.is,U);class V extends e{static get is(){return"rsc-grid-spinner"}static get defaults(){return{color:"#7f58af",size:80}}static get observedAttributes(){return["color","size"]}get color(){return`var(--rsc-grid-spinner__color, ${this.props.color})`}get size(){return`var(--rsc-grid-spinner__size, ${this.props.size}px)`}style(){return`
      .lds-grid {
        display: inline-block;
        height: ${this.size};
        position: relative;
        width: ${this.size};
      }

      .lds-grid div {
        animation: lds-grid 1.2s linear infinite;
        background: ${this.color};
        border-radius: 50%;
        height: 20%;
        position: absolute;
        width: 20%;
      }

      .lds-grid div:nth-child(1) {
        animation-delay: 0s;
        left: 10%;
        top: 10%;
      }

      .lds-grid div:nth-child(2) {
        animation-delay: -0.4s;
        left: 40%;
        top: 10%;
      }

      .lds-grid div:nth-child(3) {
        animation-delay: -0.8s;
        left: 70%;
        top: 10%;
      }

      .lds-grid div:nth-child(4) {
        animation-delay: -0.4s;
        left: 10%;
        top: 40%;
      }

      .lds-grid div:nth-child(5) {
        animation-delay: -0.8s;
        left: 40%;
        top: 40%;
      }

      .lds-grid div:nth-child(6) {
        animation-delay: -1.2s;
        left: 70%;
        top: 40%;
      }

      .lds-grid div:nth-child(7) {
        animation-delay: -0.8s;
        left: 10%;
        top: 70%;
      }

      .lds-grid div:nth-child(8) {
        animation-delay: -1.2s;
        left: 40%;
        top: 70%;
      }

      .lds-grid div:nth-child(9) {
        animation-delay: -1.6s;
        left: 70%;
        top: 70%;
      }

      @keyframes lds-grid {
        0%, 100% { opacity: 1; }
        50%      { opacity: 0.5; }
      }
    `}template(){return`
      <div class="lds-grid">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    `}}customElements.define(V.is,V);class W extends e{static get is(){return"heart-spinner"}static get defaults(){return{color:"#7f58af",size:80}}static get observedAttributes(){return["color","size"]}get color(){return`var(--heart-spinner__color, ${this.props.color})`}get size(){return`var(--heart-spinner__size, ${this.props.size}px)`}style(){return`
      .lds-heart {
        display: inline-block;
        height: ${this.size};
        position: relative;
        transform-origin: calc(${this.size} / 2) calc(${this.size} / 2);
        transform: rotate(45deg);
        width: ${this.size};
      }

      .lds-heart > div {
        animation: lds-heart 1.2s infinite cubic-bezier(0.215, 0.61, 0.355, 1);
        background: ${this.color};
        height: calc(${this.size} * .4);
        left: calc(${this.size} * .3);
        position: absolute;
        top: calc(${this.size} * .3);
        width: calc(${this.size} * .4);
      }

      .lds-heart .div-after,
      .lds-heart .div-before {
        background: ${this.color};
        content: " ";
        display: block;
        height: calc(${this.size} * .4);
        position: absolute;
        width: calc(${this.size} * .4);
      }

      .lds-heart .div-before {
        border-radius: 50% 0 0 50%;
        left: calc(${this.size} * -0.3);
      }

      .lds-heart .div-after {
        border-radius: 50% 50% 0 0;
        top: calc(${this.size} * -0.3);
      }

      @keyframes lds-heart {
        0%   { transform: scale(0.95); }
        5%   { transform: scale(1.1); }
        39%  { transform: scale(0.85); }
        45%  { transform: scale(1); }
        60%  { transform: scale(0.95); }
        100% { transform: scale(0.9); }
      }
    `}template(){return`
      <div class="lds-heart">
        <div>
            <div class="div-before"></div>
            <div class="div-after"></div>
        </div>
      </div>
    `}}customElements.define(W.is,W);class X extends e{static get is(){return"hourglass-spinner"}static get defaults(){return{color:"#7f58af",size:80}}static get observedAttributes(){return["color","size"]}get color(){return`var(--hourglass-spinner__color, ${this.props.color})`}get size(){return`var(--hourglass-spinner__size, ${this.props.size}px)`}style(){return`
      .lds-hourglass {
        display: inline-block;
        height: ${this.size};
        position: relative;
        width: ${this.size};
      }

      .lds-hourglass-after {
        animation: lds-hourglass 1.2s infinite;
        border-color: ${this.color} transparent ${this.color} transparent;
        border-radius: 50%;
        border-style: solid;
        border-width: calc(${this.size} * 0.4);
        box-sizing: border-box;
        content: " ";
        display: block;
        height: 0;
        margin: 8px;
        width: 0;
      }

      @keyframes lds-hourglass {
        0% {
          animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
          transform: rotate(0);
        }

        50% {
          animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
          transform: rotate(900deg);
        }

        100% {
          transform: rotate(1800deg);
        }
      }
    `}template(){return`
      <div class="lds-hourglass">
        <div class="lds-hourglass-after"></div>
      </div>
    `}}customElements.define(X.is,X);class Y extends e{static get is(){return"orbitals-spinner"}static get defaults(){return{color:"#7f58af"}}static get observedAttributes(){return["color"]}get color(){return`var(--orbitals-spinner__color, ${this.props.color})`}style(){return`
      .lds-orbitals {
        display: inline-block;
        height: 80px;
        position: relative;
        width: 80px;
      }

      .lds-orbitals * {
        --center: translate(-50%, -50%);
        box-sizing: content-box;
      }

      .center {
        background: ${this.color};
        border-radius: 50%;
        height: 15px;
        left: 50%;
        position: absolute;
        top: 50%;
        transform: var(--center);
        width: 15px;
      }

      .inner-spin,
      .outer-spin {
        left: 50%;
        position: absolute;
        top: 50%;
      }

      .inner-arc {
        position: absolute;
        width: 31px;
        height: 31px;
        border-radius: 50%;
        border: 3px solid;
      }

      .inner-arc_start-a {
        border-color: ${this.color};
        transform: var(--center) rotate(45deg);
      }

      .inner-arc_end-a {
        border-color: ${this.color};
        transform: var(--center) rotate(25deg);
      }

      .inner-moon-a,
      .inner-moon-b {
        background: ${this.color};
        border-radius: 50%;
        height: 8px;
        left: 50%;
        position: absolute;
        top: 50%;
        width: 8px;
      }

      .inner-moon-a {
        transform: var(--center) translate(17px, 0);
      }

      .inner-moon-b {
        transform: var(--center) translate(-17px, 0);
      }

      .inner-arc_start-b {
        border-color: ${this.color};
        transform: var(--center) rotate(65deg) scale(-1, -1);
      }

      .inner-arc_end-b {
        border-color: ${this.color};
        transform: var(--center) rotate(45deg) scale(-1, -1);
      }

      .outer-arc {
        border-radius: 50%;
        border: 3px solid;
        height: 60px;
        position: absolute;
        width: 60px;
      }

      .outer-arc_start-a {
        border-color: ${this.color};
        transform: var(--center) rotate(65deg);
      }

      .outer-arc_end-a {
        border-color: ${this.color};
        transform: var(--center) rotate(45deg);
      }

      .outer-moon-a,
      .outer-moon-b {
        background: ${this.color};
        border-radius: 50%;
        height: 9px;
        left: 50%;
        position: absolute;
        top: 50%;
        width: 9px;
      }

      .outer-moon-a {
        transform: var(--center) translate(32px, 0);
      }

      .outer-moon-b {
        transform: var(--center) translate(-32px, 0);
      }

      .outer-arc_start-b {
        border-color: ${this.color};
        transform: var(--center) rotate(65deg) scale(-1, -1);
      }

      .outer-arc_end-b {
        border-color: ${this.color};
        transform: var(--center) rotate(45deg) scale(-1, -1);
      }

      .outer-spin {
        animation: spin 4s linear infinite;
      }

      .inner-spin {
        animation: spin 3s linear infinite;
      }

      @keyframes spin {
        100% { transform: rotate(360deg); }
      }
    `}template(){return`
      <div class="lds-orbitals">
        <div class="center"></div>

        <div class="inner-spin">
          <div class="inner-arc inner-arc_start-a"></div>
          <div class="inner-arc inner-arc_end-a"></div>
          <div class="inner-arc inner-arc_start-b"></div>
          <div class="inner-arc inner-arc_end-b"></div>
          <div class="inner-moon-a"></div>
          <div class="inner-moon-b"></div>
        </div>

        <div class="outer-spin">
          <div class="outer-arc outer-arc_start-a"></div>
          <div class="outer-arc outer-arc_end-a"></div>
          <div class="outer-arc outer-arc_start-b"></div>
          <div class="outer-arc outer-arc_end-b"></div>
          <div class="outer-moon-a"></div>
          <div class="outer-moon-b"></div>
        </div>
      </div>
    `}}customElements.define(Y.is,Y);class Z extends e{static get is(){return"ouroboro-spinner"}static get defaults(){return{color:"#7f58af"}}static get observedAttributes(){return["color"]}get color(){return`var(--ouroboro-spinner__color, ${this.props.color})`}style(){return`
      .lds-ouroboro {
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(0,0,0,.1) inset, 0 0 25px rgba(0,0,255,0.075);
        display: inline-block;
        height: 64px;
        margin: 0.5em;
        overflow: hidden;
        position: relative;
        width: 64px;
      }

      .lds-ouroboro:after {
        background: none repeat scroll 0 0 #f2f2f2;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(0,0,0,.1);
        content: "";
        display: block;
        height: 70%; width:70%;
        position: relative;
        top: 15%; left: 15%;
      }

      .lds-ouroboro > span {
        height: 100%; width: 50%;
        overflow: hidden;
        position: absolute;
      }

      .lds-ouroboro > .left  { left:0 }
      .lds-ouroboro > .right { left:50% }

      .lds-ouroboro > .left > .anim,
      .lds-ouroboro > .right > .anim {
        animation: lds-ouroboro-rotate 3s infinite;
        background: none repeat scroll 0 0;
        background-color: ${this.color};
        border-radius: 999px;
        height: 100%; width: 100%;
        left: 100%; top: 0;
        opacity: 0.8;
        position: absolute;
        transform-origin: 0 50% 0;
      }

      .lds-ouroboro > .left > .anim {
        border-bottom-left-radius: 0;
        border-top-left-radius: 0;
      }

      .lds-ouroboro > .right > .anim {
        border-bottom-right-radius: 0;
        border-top-right-radius: 0;
        left: -100%;
        transform-origin: 100% 50% 0;
      }

      @keyframes lds-ouroboro-rotate{
        0%   { transform:rotate(0deg) }
        25%  { transform:rotate(0deg) }
        50%  { transform:rotate(180deg) }
        75%  { transform:rotate(180deg) }
        100% { transform:rotate(360deg) }
      }
    `}template(){return`
      <div class="lds-ouroboro">
        <span class="left">
          <span class="anim" style={{ background: color }}></span>
        </span>

        <span class="right">
          <span class="anim" style={{ background: color }}></span>
        </span>
      </div>
    `}}customElements.define(Z.is,Z);class $ extends e{static get is(){return"rsc-ring-spinner"}static get defaults(){return{color:"#7f58af",size:80}}static get observedAttributes(){return["color","size"]}get color(){return`var(--rsc-ring-spinner__color, ${this.props.color})`}get size(){return`var(--rsc-ring-spinner__size, ${this.props.size}px)`}style(){return`
      .lds-ring {
        display: inline-block;
        height: ${this.size};
        position: relative;
        width: ${this.size};
      }

      .lds-ring div {
        animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        border-color: ${this.color} transparent transparent transparent;
        border-radius: 50%;
        border-style: solid;
        border-width: calc(${this.size} * 0.1);
        box-sizing: border-box;
        display: block;
        height: calc(${this.size} * 0.8);
        margin: calc(${this.size} * 0.1);
        position: absolute;
        width: calc(${this.size} * 0.8);
      }

      .lds-ring div:nth-child(1) { animation-delay: -0.45s; }
      .lds-ring div:nth-child(2) { animation-delay: -0.3s; }
      .lds-ring div:nth-child(3) { animation-delay: -0.15s; }

      @keyframes lds-ring {
        0%   { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}template(){return`
      <div class="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    `}}customElements.define($.is,$);class B extends e{static get is(){return"ripple-spinner"}static get defaults(){return{color:"#7f58af",size:80}}static get observedAttributes(){return["color","size"]}get color(){return`var(--ripple-spinner__color, ${this.props.color})`}get size(){return`var(--ripple-spinner__size, ${this.props.size}px)`}style(){return`
      .lds-ripple {
        display: inline-block;
        height: ${this.size};
        position: relative;
        width: ${this.size};
      }

      .lds-ripple div {
        animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
        border-color: ${this.color};
        border-radius: 50%;
        border-style: solid;
        border-width: calc(${this.size} * 0.05);
        position: absolute;
      }

      .lds-ripple div:nth-child(2) {
        animation-delay: -0.5s;
      }

      @keyframes lds-ripple {
        0% {
          height: 0;
          left: 50%;
          opacity: 1;
          top: 50%;
          width: 0;
        }

        100% {
          height: 100%;
          left: 0px;
          opacity: 0;
          top: 0px;
          width: 100%;
        }
      }
    `}template(){return`
      <div class="lds-ripple">
        <div></div>
        <div></div>
      </div>
    `}}customElements.define(B.is,B);class ee extends e{static get is(){return"roller-spinner"}static get defaults(){return{color:"#7f58af"}}static get observedAttributes(){return["color"]}get color(){return`var(--roller-spinner__color, ${this.props.color})`}style(){return`
      .lds-roller {
        display: inline-block;
        position: relative;
        width: 80px;
        height: 80px;
      }

      .lds-roller > div {
        animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        transform-origin: 40px 40px;
      }

      .lds-roller div .div-after {
        background: ${this.color};
        border-radius: 50%;
        content: " ";
        display: block;
        height: 7px;
        margin: -4px 0 0 -4px;
        position: absolute;
        width: 7px;
      }

      .lds-roller div:nth-child(1) {
        animation-delay: -0.036s;
      }

      .lds-roller div:nth-child(1) .div-after {
        left: 63px;
        top: 63px;
      }

      .lds-roller div:nth-child(2) {
        animation-delay: -0.072s;
      }

      .lds-roller div:nth-child(2) .div-after {
        left: 56px;
        top: 68px;
      }

      .lds-roller div:nth-child(3) {
        animation-delay: -0.108s;
      }

      .lds-roller div:nth-child(3) .div-after {
        left: 48px;
        top: 71px;
      }

      .lds-roller div:nth-child(4) {
        animation-delay: -0.144s;
      }

      .lds-roller div:nth-child(4) .div-after {
        left: 40px;
        top: 72px;
      }

      .lds-roller div:nth-child(5) {
        animation-delay: -0.18s;
      }

      .lds-roller div:nth-child(5) .div-after {
        left: 32px;
        top: 71px;
      }

      .lds-roller div:nth-child(6) {
        animation-delay: -0.216s;
      }

      .lds-roller div:nth-child(6) .div-after {
        left: 24px;
        top: 68px;
      }

      .lds-roller div:nth-child(7) {
        animation-delay: -0.252s;
      }

      .lds-roller div:nth-child(7) .div-after {
        left: 17px;
        top: 63px;
      }

      .lds-roller div:nth-child(8) {
        animation-delay: -0.288s;
      }

      .lds-roller div:nth-child(8) .div-after {
        left: 12px;
        top: 56px;
      }

      @keyframes lds-roller {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}template(){return`
      <div class="lds-roller">
        <div>
          <div class="div-after"></div>
        </div>

        <div>
          <div class="div-after"></div>
        </div>

        <div>
          <div class="div-after"></div>
        </div>

        <div>
          <div class="div-after"></div>
        </div>

        <div>
          <div class="div-after"></div>
        </div>

        <div>
          <div class="div-after"></div>
        </div>

        <div>
          <div class="div-after"></div>
        </div>

        <div>
          <div class="div-after"></div>
        </div>
      </div>
    `}}customElements.define(ee.is,ee);class ie extends e{static get is(){return"spinner-spinner"}static get defaults(){return{color:"#7f58af"}}static get observedAttributes(){return["color"]}get color(){return`var(--spinner-spinner__color, ${this.props.color})`}style(){return`
      .lds-spinner {
        color: official;
        display: inline-block;
        height: 80px;
        position: relative;
        width: 80px;
      }

      .lds-spinner div {
        animation: lds-spinner 1.2s linear infinite;
        transform-origin: 40px 40px;
      }

      .lds-spinner div .div-after {
        background: ${this.color};
        border-radius: 20%;
        content: " ";
        display: block;
        height: 18px;
        left: 37px;
        position: absolute;
        top: 3px;
        width: 6px;
      }

      .lds-spinner div:nth-child(1) {
        animation-delay: -1.1s;
        transform: rotate(0deg);
      }

      .lds-spinner div:nth-child(2) {
        animation-delay: -1s;
        transform: rotate(30deg);
      }

      .lds-spinner div:nth-child(3) {
        animation-delay: -0.9s;
        transform: rotate(60deg);
      }

      .lds-spinner div:nth-child(4) {
        animation-delay: -0.8s;
        transform: rotate(90deg);
      }

      .lds-spinner div:nth-child(5) {
        animation-delay: -0.7s;
        transform: rotate(120deg);
      }

      .lds-spinner div:nth-child(6) {
        animation-delay: -0.6s;
        transform: rotate(150deg);
      }

      .lds-spinner div:nth-child(7) {
        animation-delay: -0.5s;
        transform: rotate(180deg);
      }

      .lds-spinner div:nth-child(8) {
        animation-delay: -0.4s;
        transform: rotate(210deg);
      }

      .lds-spinner div:nth-child(9) {
        animation-delay: -0.3s;
        transform: rotate(240deg);
      }

      .lds-spinner div:nth-child(10) {
        animation-delay: -0.2s;
        transform: rotate(270deg);
      }

      .lds-spinner div:nth-child(11) {
        animation-delay: -0.1s;
        transform: rotate(300deg);
      }

      .lds-spinner div:nth-child(12) {
        animation-delay: 0s;
        transform: rotate(330deg);
      }

      @keyframes lds-spinner {
        0%   { opacity: 1; }
        100% { opacity: 0; }
      }
    `}template(){return`
      <div class="lds-spinner">
        <div>
          <div class="div-after"></div>
        </div>

        <div>
          <div class="div-after"></div>
        </div>

        <div>
          <div class="div-after"></div>
        </div>

        <div>
          <div class="div-after"></div>
        </div>

        <div>
          <div class="div-after"></div>
        </div>

        <div>
          <div class="div-after"></div>
        </div>

        <div>
          <div class="div-after"></div>
        </div>

        <div>
          <div class="div-after"></div>
        </div>

        <div>
          <div class="div-after"></div>
        </div>

        <div>
          <div class="div-after"></div>
        </div>

        <div>
          <div class="div-after"></div>
        </div>

        <div>
          <div class="div-after"></div>
        </div>
      </div>
    `}}customElements.define(ie.is,ie)});
