import React, { PureComponent } from 'react';
export default class ZooComponent extends PureComponent {
     state = {
          infoUrl : 'boom.png',
          currentIndex : '0',
          monsters : [
              {
                  info : 'boom.png',
                  id : 1,
                  btnUrl : 'boom_btn.png'
              },
              {
                info : 't.png',
                id : 1,
                btnUrl : 't_btn.png'
            },
            {
                info : 'zero.png',
                id : 1,
                btnUrl : 'zero_btn.png'
            }
          ]
     }


     clickHandler(monster, index){
            this.setState({ infoUrl : monster.info, currentIndex : index })  
     }


    componentDidMount(){
        var clientHeight =  document.body.clientHeight;
        this.refs.monsterHut.style.height = ( clientHeight - 15 ) +'px';
    }
    render() {
        return ( <div className = "monster-hut" ref="monsterHut">
                     <a className="logo" href="javascript:void(0)">
                        <img src="/assets/toBoom/images/logo.png" alt=""/>
                      </a>

                      <a href="#/" className="m-btn-bk"></a>

                       <div className="monsters">
                            <ul>
                                {
                                   this.state.monsters.map(( monster, index ) => (
                                      <li className={ this.state.currentIndex == index ? 'active' : '' }
                                       key={ index } 
                                       onClick={ this.clickHandler.bind(this, monster, index ) }
                                       >
                                      <img src={`/assets/toBoom/images/${ monster.btnUrl }`} alt=""/>
                                      </li>
                                   ))
                                }
                            </ul>

                          <div className="infor"> <img src={ `/assets/toBoom/images/${this.state.infoUrl}` } alt=""/> </div>

                      </div>

                      <span className="footer-bg">
                         <img src="/assets/toBoom/images/w-bg.png" alt=""/>
                       </span>


                 <p className="rights"> Copyright &#169; 2018 WOW-TREND All Rights Reserved 深圳市星潮热点传播股份有限公司 </p>


                 </div>
        )
    }
}