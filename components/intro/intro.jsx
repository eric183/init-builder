import React, { Component } from 'react';
import * as ReactDOM from 'react-dom';
import './intro.scss';
import {  TimelineMax, TweenMax, Bounce } from "gsap/all";



/**
 *  Indicator 先隐藏，后定位，在显示
 * 
 *  */


export default class IntroComponent extends Component {
        constructor(props){
                  super(props);
                  this.state = { 
                        currentStep : props.currentStep,
                        stepsNumber : 1,
                        totalSteps : props.steps.length
                    }
          }

     previousHandler = () => {}
     nextHandler = () => {}

      render(){

            let { totalSteps, stepsNumber, currentStep } = this.state;
            let { triangle, Indicator } = currentStep;

            return ReactDOM.createPortal(
                <div className="wow-intro">
                   <div className="Indicator" style={ Indicator.position }> 
                    <i className={['wow-intro-triangle', triangle.angle].join(' ')} style={ triangle.position }></i>
                    <em className="wow-intro-close"> X </em>
                     <section>
                           <h3>步骤 1</h3>
                           <p> lanrenzhijia.com</p>
                     </section>
                      <section className="wow-intro-footer">
                         <span> <b> { stepsNumber } </b> of { totalSteps } </span>
                          <ul>
                           <li><button type="button" onClick={ this.previousHandler }>« Previous</button></li>
                           <li><button type="button" onClick={ this.nextHandler } >Next »</button></li>
                          </ul>
                      </section>
                    </div>
                   <div className="wow-intro-cover"></div>
                </div>,            
                document.querySelector('#root')
            )
      }
}

IntroComponent.defaultProps  = {
      currentStep :  {
                  triangle : {
                        position : {
                              left : 0,
                              top : 0,     
                         },
                     angle : ''
                  },
                  Indicator : {
                   position : {
                        left : 0,
                        top : 0,     
                   }
                   
                  },
                  info : {
                        
                  },
                  step : 1
          },

      steps : []

}


