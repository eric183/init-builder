import React, { PureComponent } from 'react';
import {  TimelineMax, TweenMax, Bounce } from "gsap/all";

import qs from 'qs';
import RequestConfig from   '../../config/request-config';   // './config/request-config';



export default class WelcomeComponent extends PureComponent {

      animationContrl(){ 
         var { bgElement, sunElement, mElement, aElement, tElement, sElement, bElement } = this.refs,
               mountainHeight = this.refs.mElement.clientHeight,
               backgroundHeight =  this.refs.bgElement.clientHeight;
               bgElement.style.bottom = -backgroundHeight + 'px';
               bgElement.style.visibility = 'visible';
               mElement.style.bottom = -mountainHeight + 'px';
               mElement.style.visibility = 'visible';
               aElement.style.bottom = ( mountainHeight - aElement.clientHeight - 50 ) + 'px';
               sunElement.style.bottom = ( mountainHeight - sunElement.clientHeight ) + 'px';
               bElement.style.bottom = Math.ceil( mountainHeight * 0.3 ) + 'px';

       var tl = new TimelineMax();
         tl. to(bgElement, 0.5, { bottom : 0 })
             .to( mElement, 0.5, { bottom : 0 })
             .to(tElement, 0.5,  { bottom: Math.ceil( mountainHeight * 0.5 )  })    
             .to(sElement, 0.4, { bottom : Math.ceil( mountainHeight * 0.8 )  } , '1.4') 
             .to(aElement, 0.5, { visibility : 'visible', bottom : "+=" + aElement.clientHeight }  )
             .to( sunElement, 1, { visibility : 'visible', ease:Bounce.easeOut,  bottom : "+=" + Math.ceil( sunElement.clientHeight / 2 ) } )
             .to( bElement, 1, { opacity : 1 } );
      }


      mouseEnterHandler = () =>{
            TweenMax.to(this.refs.btn_emElement,0.3, { width : 200 })
      }
      mouseLeaveHandler = () =>{
            TweenMax.to(this.refs.btn_emElement,0.3, { width : 0 })
      }

      goHome = () =>{

            this.props.location.history.push('/')
      }

      componentDidMount(){

         /*
            *  checking Token whether effective
            *  created by Kuangkuang
            */
            const HREFTOKEN = /\?token\=.+/.exec(location.href);
            const TOKENKEEPER = qs.parse(HREFTOKEN && HREFTOKEN[0].slice(1));
            if(TOKENKEEPER.token) {
                  RequestConfig.resetToken(TOKENKEEPER.token);
                  history.replaceState({ page: history.length }, "",   location.origin + location.pathname + location.hash.replace(/\?token.+/, '') );
            } 

            var clientHeight =  document.body.clientHeight;
            this.refs.welcomeElem.style.height = ( clientHeight - 15 ) +'px';
            setTimeout(() => {    this.animationContrl()  }, 1000)
      }

        render(){
             return (

                  <div className="welcome-container" ref="welcomeElem">
                         <a href="#/" className="logo"> <img src="/assets/toBoom/images/W-WOW-TOBOOM.png" alt=""/></a>
                                     <span ref="bgElement" className="w-background"> <img src="/assets/toBoom/images/w-bg.png" alt=""/> </span>
                                     <span ref="mElement" className="w-mountain"> <img src="/assets/toBoom/images/w-mountbg.png" alt=""/> </span>
                                     <span ref="tElement" className="w-title">   <img src="/assets/toBoom/images/DESIGNED.png" alt=""/>  </span>
                                     <span ref="sElement" className="w-strip">   <img src="/assets/toBoom/images/WOWTOBOOM.png" alt=""/>  </span>
                                     <span ref="aElement" className="w-animal">  <img src="/assets/toBoom/images/w-animal.png" alt=""/>   </span>
                                     <span ref="sunElement" className="w-sun"><img src="/assets/toBoom/images/w-sun.png" alt=""/> </span>
                                     <button ref="bElement" type="button" onClick={ this.goHome } className="btn" onMouseEnter={ this.mouseEnterHandler } onMouseLeave={ this.mouseLeaveHandler } > 
                                       <em ref="btn_emElement"></em>
                                       <i>CLICK ME</i>
                                      </button>
                         <p className="rights"> Copyright &#169; 2018 WOW-TREND All Rights Reserved 深圳市星潮热点传播股份有限公司 </p>
                   </div>
             )
        }
}