import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom'
import {observer} from 'mobx-react';
import { computed, observable, autorun } from 'mobx';
import * as mobx from 'mobx';


export default class ImageComponent extends React.Component  {
    state = {
          
           visiable : false,
           reverseSrc : undefined,
           defaultStyle : {
               width : 100,
               height : 100,
           }
    }

    mouseoverAction = (e) => { 
              this.setState({
                    reverseSrc : this.props.source.reverse.path,
                    visiable : true
              });
     }

    mouseoutAction = (e) => { 
              this.setState({
                  reverseSrc : undefined,
                  visiable : false
                 
          });

    
      }


    collectionAction = () => { 
         let { onCollection,  source  } = this.props;
         onCollection( source );
    }


    downLoadAction = () => { 
      let { onDownLoad,  source  } = this.props;
         
          onDownLoad( source );
    }

    
    handleGoNewDesign = (event) => {
        this.props.handleGoNewDesign( event )
    }


   
    render(){
       let { visiable, reverseSrc } = this.state;
       let { source } = this.props;
       let { use_count, all_count } = mobx.toJS( this.props.store.worksTotalNumberInfo.worksTotalNumberInfo );

       return (
         <div
          style={ this.props.style || this.state.defaultStyle }
          onMouseEnter={ this.mouseoverAction }
          onMouseLeave={ this.mouseoutAction }
          className={['image-element', this.props.classname].join(' ')}
          >
          <i className="vertical"></i>
          <img className="image-img" 
              onClick={ this.handleGoNewDesign }
              data-gonewdesign={ `#design-do?id=${ source.front.id }&isCreate=true` }
             src={ reverseSrc || source.front.path } alt=""/>

            {/* 2018-12-07 把 开始设计 按钮,注释掉 start */}
            {/* <button 
                type="button" 
                style={{ display : visiable ? 'block' : 'none' }} 
                onClick={ this.handleGoNewDesign }
                className="p-contrl-design"
                data-gonewdesign={ `#design-do?id=${ source.front.id }&isCreate=true` }
            >  
                开始设计             
            </button> */}
            {/* 2018-12-07 把 开始设计 按钮,注释掉 end */}

               <button type="button" 
                 style={{ display : visiable ? 'block' : 'none' }}  
                 onClick={ this.collectionAction }  
                 className={['p-contrl-collect', source.collect == 1 ? 'active' : '' ].join(' ')}>
                 <i className="iconfont kuanshituku-shoucang"></i>
                 </button>
           <button type="button"  style={{ display :visiable ? 'block' : 'none' }}   onClick={ this.downLoadAction } className="p-contrl-download"> <i className="iconfont kuanshituku-xiazai"></i>  </button>
       </div>
       )
    }
}


ImageComponent.defaultProps = {
    onDownLoad : function(){},
    onCollection : function(){},
    source : {}
}