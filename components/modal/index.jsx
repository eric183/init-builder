import React from 'react';
import { createPortal } from 'react-dom';
import { Line, Circle } from 'rc-progress';
import './index.scss';


class MaterialModal extends React.Component {
    state = {
        top: 0,
        left: 0,
        show: this.props.show
    }
    clickEventHandler(props, event) {

        let eventTarget = event.target.nodeName == 'LI' ? event.target : event.target.parentElement;

                let clientRect = eventTarget.getClientRects()[0];
        
                if(eventTarget.dataset.attr) {
                    this.setState({
                        top: clientRect.top + clientRect.height,
                        left: clientRect.left
                    });
                    
                }
        
        window.removeEventListener('click', this.clickEventHandler.bind(this));


    }




    cancelBinder() {
        // debugger;
        this.setState({    show: false   })
    }


    componentWillUnmount(){   this.setState({ top :0, left : 0 })  }

    componentDidMount() {
        // let _this = this;
        window.addEventListener('click', this.clickEventHandler.bind(this, this.props));

        //初始化定位
        let clientRect = document.getElementById('ribbon').getClientRects()[0];
        this.setState({
            top: clientRect.top + clientRect.height,
            left: clientRect.left
        });


    }
    componentWillReceiveProps(next) {
        // debugger
        
        this.setState(next);
        
    }
    render() {
        // console.log(this.state.show);
        return (
            <div 
                // onClick={()=>{alert('hello')}}
                
                className={`material-modal modal-wrapper ${this.props.show ? 'modal-show' : 'modal-hide'}`}>
                
                <div 
                    style={{top: this.state.top, left: this.state.left}}
                    className="material-content">

                    {this.props.children}
                </div>
                <div className="modal-hider" onClick={this.props.onCancel}></div>
            </div>
        )
    }
}








class Modal extends React.Component {
    state = {
        top: 0,
        left: 0,
        show: this.props.show,
        // showCascader: true
    }
    clickEventHandler(event) {
        let clientRect = event.target.getClientRects()[0];
        this.setState({
            top: clientRect.y + clientRect.height,
            left: clientRect.x
        }, ()=> {
            window.removeEventListener('click', this.clickEventHandler.bind(this));
        });
        // }
    }


    crossBinder() {
        if(this.props.handleCross) {
            this.props.onCross();
            // this.props.onCross();

           // this.props.parentRef.setState({   showCascader: false  })

            // this.setState({ show: false  });


        } else {
            this.props.onCancel
        }
    }
   // 有可能是 取消按钮 ，或 有可能是 注册按钮
    cancelBinder() {

       // debugger;
       

            
           if( this.props.cancelText == '取消'||this.props.cancelText == '否' ){
                    this.props.onCancel();
           } 

           if(this.props.cancelText == '注册') {
                location.href = "http://www.wow-trend.com/join/login/from/aHR0cDovL3d3dy53b3ctdHJlbmQuY29tLw==/gender/2.shtml";
           }

            if( this.props.cancelText == '确认'){
                this.props.onCancel();
            }


            this.setState({  show: false });



           // this.props.parentRef.setState({  showCascader: false,  })
        
            //this.props.onCancel();

            // setTimeout(()=>{
            //     this.setState({
            //         show: false
            //     });
            // },2000)
        

    }



    componentDidMount() {
        // let _this = this;
        
    }
    componentWillReceiveProps(next) {
        // this.setState(next);
        // this.setState(next, ()=> {
        //     if(this.props.show) {
        //         window.addEventListener('click', this.clickEventHandler.bind(this));
        //     }
        // });
        document.body.style.overflow = next.show ? 'hidden' : 'auto';
        // if(next.show) {
        // //  debugger;
        //     // this.refs.modalWrapper

        //     document.body.style.overflow = "hidden";
        // }
    }
    render() {

        return (
            <div 
                ref="modalWrapper"
                className={`modal-wrapper ${this.props.show ? 'modal-show' : 'modal-hide'}`}>
                <div className="modal-content">
                    <header>
                        <span>{this.props.title || ''}</span>
                        <i className="iconfont shanchu"  onClick={this.props.onCross} data-type="close" ></i>
                    </header>
                    <div className="modal-article">
                        {
                            this.props.isAlert && (
                                <div className="info-wrapper">
                                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                        <div style={{width: 64 + 'px', height: 56 + 'px', display : this.props.isNeedAlert ? 'block' : 'none' }} >
                                            <img src="/assets/toBoom/images/warn.png" alt="" style={{width: 100 + '%', height: 100 + '%' }}/>
                                        </div>

                                        <span style={{marginLeft: 30 + 'px', fontSize: 18 + 'px'}}>{this.props.text}</span>
                                    </div>
                                </div>
                            )
                        }
                        {
                            this.props.children
                        }
                    </div>
                    <footer>
                        <section>
                            <button 
                                onClick={this.props.onConfirm.bind(this)} 
                                data-type="submit" style={{backgroundImage: 'url("/assets/toBoom/images/designbtn.png")'}}>{ this.props.confirmText || '确定'}</button>
                               { !this.props.hideCancel && 
                                   (<button onClick={this.cancelBinder.bind(this)  }  
                                    style={{backgroundImage: 'url("/assets/toBoom/images/bottomBG.png")'}}>{ this.props.cancelText }</button>) 
                                 }
                        </section>
                        
                    </footer>
                </div>
                <div className="modal-hider"  onClick={this.props.onCancel}></div>
            </div>
        )
    }
}


Modal.defaultProps = {
    cancelText : '取消',
    submitAction : function(){ },
    isSubmit : false ,
    isNeedAlert : true 
}





class PrivateModal extends React.Component {
      state = {}
      componentDidMount() {}
      componentWillReceiveProps(next) {}
       render(){
           let { style, confirmDisabled, show, classname, CancelBtnVisiable, ConfirmBtnVisiable  } = this.props;
            return (
                <div 
                  className={`modal-wrapper  ${  show ? 'modal-show' : 'modal-hide'}`}>
                  <div className={['modal-content', classname  ].join(' ')}  style={ style }>
                    <header>
                        <span>{ this.props.title || ''}</span>
                        <i className="iconfont shanchu"  onClick={ this.props.onCancel  }></i>
                    </header>
                    <div className="modal-article modal-articl-private">
                        {
                            this.props.isAlert && (
                                 <div className="info-wrapper">
                                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 50 + 'px'}}>
                                        <div style={{width: 64 + 'px', height: 56 + 'px' }}>
                                            <img src="/assets/toBoom/images/warn.png" alt="" style={{width: 100 + '%', height: 100 + '%' }}/>
                                        </div>
                                        <span style={{marginLeft: 30 + 'px', fontSize: 18 + 'px'}}>{this.props.text}</span>
                                    </div>
                                </div>
                            )
                        }
                        {
                            this.props.children
                        }
                    </div>
                    <footer>
                        <section>
                            <button onClick={  this.props.onConfirm } style={{ display : ConfirmBtnVisiable ? 'inline-block' : 'none' }} disabled={ confirmDisabled }>确认</button>
                            { !this.props.hideCancel && <button onClick={  this.props.onCancel  } style={{ display : CancelBtnVisiable ? 'inline-block' : 'none' }}>取消</button> }
                        </section>
                    </footer>
                </div>
                <div className="modal-hider"  onClick={ this.props.onCancel  }></div>
              </div>
            )
       }
}

PrivateModal.defaultProps = {
      classname : '',
      style : {}, 
      confirmDisabled : false, 
      CancelBtnVisiable : true,
      ConfirmBtnVisiable : true,
      show : false 

}


/*
* 下载打包进度条
* library: http://react-component.github.io/progress/
* DEMO:
*    <DownLoadProgres
         title="下载进度"
          show={ visiable  }
          style={{ width : 616, height : 390 }}
          onConfirm={ this.confirm }
          onCancel={  this.cancel  }
          percent={ 20 }
       />
*
*/
class DownLoadProgres extends React.Component {
      state = {}
      componentDidMount() {}
      componentWillReceiveProps(next) {}
        render(){
             let { percent, strokeWidth, trailWidth, strokeColor, prefixCls } = this.props;
             return (
                  < PrivateModal { ...this.props }  >
                      <div className="download_progres">
                            <h4>正在打包下载素材</h4>
                            <div className="d_progres_block">
                               <div>
                                  <Line 
                                    percent={ percent } 
                                    strokeWidth={ strokeWidth }  
                                    trailWidth={ trailWidth }
                                    strokeColor={ strokeColor } 
                                    />
                                </div>
                               <span > { `${ percent }%` } </span>
                              </div>
                             

                         </div>
                   </PrivateModal> 
             )
        }
}

DownLoadProgres.defaultProps = {
    classname : '',
    style : {}, 
    confirmDisabled : false, 
    ConfirmBtnVisiable : false,
    show : false,
    percent : 10,
    strokeWidth : 3,
    trailWidth: 3,
    strokeColor : '#72a1d9',
    prefixCls : 'd_progress_bar',
    onConfirm :function(){},
    onCancel:function(){}
}


export { MaterialModal, Modal, PrivateModal, DownLoadProgres };