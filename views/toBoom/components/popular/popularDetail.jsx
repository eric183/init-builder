import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom'
import {observer} from 'mobx-react';
import { computed, observable, autorun } from 'mobx';
import * as mobx from 'mobx';
import { DownLoadmethods,  ScrollingLoad, HintComponent } from '../waterfall/waterfall';
import { PrivateModal, DownLoadProgres } from '@/components/modal';
import axios from 'axios';
import DownloadForm from './downloadForm';
import ImageComponent from './imageComponent';
import { AnimationController } from './animationController';
import { MenuMoe } from '@/components/menu';
import { Modal }  from '@/components/modal';

import { message, BackTop  } from 'antd';


 // 下载方法
const DownLoadMethods = new DownLoadmethods();


 /* 
    *【!!!!!! important !!!!!  】
    * 当页面滚动的时候，会触发组件渲染的bug, 为了防止过度的渲染操作，
    * 组件所有的状态更新，暂时采用 forceUpdate 代替。
*/

@observer
export default class PopularDetail extends React.Component {
     
    state = {
            tag : undefined,
            headerIndex : 0,
            isLoading : false,
            noMore : false,
            category : '外套',
            modalShow : false,
            downloadProgressVisiable : false,
            menuMoe_visiable: false,
            page : 0,  // 记录滚动加载页码
            showNoGoDesign: false,
            showNoGoDesignMessage: '作品数已达到上限',
            percent : 0,
            // {/* 试用权限 下载次数达到了10次 就弹出弹窗提示 start */}
            isShowPowerModal: false,
            powerModalContent: '',
            // {/* 试用权限 下载次数达到了10次 就弹出弹窗提示 end */}
    }
  

       @computed get get_pieData(){ return this.props.store.popularStore.pieData };

       @computed get get_imageListSource(){ return this.props.store.popularStore.imageListSource };

       @computed get get_confirmDisable(){ return this.props.store.popularStore.confirmDisable };

       timer = null ; // 定时器


        
     //  作品数量达到上限不可跳转设计页面
     handleGoNewDesign = ( event ) => {

        let { use_count, all_count } = mobx.toJS( this.props.store.worksTotalNumberInfo.worksTotalNumberInfo );

        if( all_count <= use_count) {
            this.setState({  showNoGoDesign: true })
        }else {
            let { origin, pathname } = location;
            window.open( origin +  pathname +  event.currentTarget.dataset.gonewdesign )
           // location.hash = event.currentTarget.dataset.gonewdesign;

        }

    }




    // 显示或隐藏 menuMoe
   toggle_menuMoe = () => {
        this.setState({ menuMoe_visiable : !this.state.menuMoe_visiable }, () => { this.forceUpdate() })
  }





  /*  下载 start  */ 
onDownLoad = ( source ) => { 

  // 在此先拿图片ID去请求是否存有附图
  this.props.store.styleGalleryStore.request_annex( source.front.id ).then(( { data } )=>{
    if( data.status_code == 200 ){
        let { drawing_annex, master_annex } = data.data;
        let source_copy = Object.assign(source, {}, true);
            source_copy.front.annex = master_annex;
            source_copy.reverse.annex = drawing_annex
       let { front, reverse } =  source_copy;
       var  formState = mobx.toJS( this.props.store.popularStore.formState );
            formState = Object.assign( formState, {
                      checkboxSource : source_copy,
                      front : true, 
                      fpng : true, 
                      frontChoose : ['png'],
                      reverse : true, 
                      rpng : true, 
                      reverseChoose : ['png'],
                      fepsDisable : true,
                      repsDisable : true
                  });
                  
 
         if( front.annex == 1 ){
             formState.feps = true;
             formState.fepsDisable = false;
             formState.frontChoose = ['png','eps'];
         }
 
        if( reverse.annex == 1 ){
             formState.reps = true;
             formState.repsDisable = false;
             formState.reverseChoose = ['png','eps'];
        }
 
       this.props.store.popularStore.setProperties({ formState : formState, confirmDisable : false } );
       this.setState({ modalShow : true }, () => { this.forceUpdate()  })
    }else{

    }

   })

 }



    // 下载进度条
    downloadProgress_confirm = () => {
       // this.setState({ downloadProgressVisiable : false });
    }

    downloadProgress_cancel = () => {

         clearInterval( this.timer  );
         this.props.store.popularStore.resetFieldsValue(); // 重置下载表单 
         DownLoadMethods.break_off(); // 中断下载请求
         this.setState({ downloadProgressVisiable : false, percent : 0 },() =>{ this.forceUpdate() });


    }

    // 模拟加载进度
    downloadprogress_animation = () =>{
        var rnd = function(n, m){
            var random = Math.floor(Math.random()*(m-n+1)+n);
            return random;
        };

        this.timer  = setInterval(() => {
                let percent = this.state.percent;
                if( percent < 80 ){
                    this.setState({ percent : percent + rnd(1,10) }, () => { this.forceUpdate()  })
                }else{
                    clearInterval( this.timer  )
                }
        }, 3000);
    
    }

    // {/* 试用权限 下载次数达到了10次 就弹出弹窗提示 start */}
    confirmPowerGoClient() {
        this.setState({
            isShowPowerModal: false
        });
        location.href = "http://www.wow-trend.com/join/login/from/aHR0cDovL3d3dy53b3ctdHJlbmQuY29tLw==/gender/2.shtml";
    }

    cancelPowerModal() {
        this.setState({
            isShowPowerModal: false
        });
       
        //console.log("cancelPowerModal里的setState后的isShowPowerModal的值由true变为false,这里要打印false,而实际上打印出来的是:"+ this.state.isShowPowerModal);

        this.forceUpdate();

        //console.log("cancelPowerModal里的setState后的isShowPowerModal的值由true变为false,这里要打印false,而实际上打印出来的是:"+ this.state.isShowPowerModal);

    }

    crossCancelPower() {
        this.setState({
            isShowPowerModal: false
        });
        this.forceUpdate();
        // console.log(this.state.isShowPowerModal);
    }
    // {/* 试用权限 下载次数达到了10次 就弹出弹窗提示 end */}


    // 弹窗确定
    confirmBinder = () =>{

        let formState = mobx.toJS( this.props.store.popularStore.formState ),
            { checkboxSource, frontChoose, reverseChoose, front, reverse  } = formState,
            param = { category : this.state.category, resource_id : [], angle : [] };

            console.log( checkboxSource )

            if( front && frontChoose.length > 0 ){ 
                    param.resource_id.push( checkboxSource.front.id )
                    param.angle.push({
                        angle : 'front',
                        format : frontChoose
                    })
            }
    
            if( reverse && reverseChoose.length > 0 ){
                //  param.resource_id.push( checkboxSource.drawing_id )  
                // 不需要加上反面ID, 如果未选正面，则
                param.resource_id.length <= 0 ?  param.resource_id.push( checkboxSource.front.id ) : '';
                    param.angle.push({
                    angle : 'back',
                    format : reverseChoose
                })
            }


    
            if( param.resource_id.length ){  // 下载请求
                
                this.downloadprogress_animation(); // 模拟加载进度

                this.setState({ modalShow :  false, downloadProgressVisiable : true }, () => { this.forceUpdate()  });
                // this.setState({ modalShow :  false, downloadProgressVisiable : true });

                DownLoadMethods.fireRequestAction( param , ( data ) => { // data 可能是请求成返回的数据，也有可能是 error 对象；
                    if( data.status_code && data.status_code == 200 ){
                        window.location.href = data.data.downloadUrl; 
                    }else{
                        message.warning('下载失败！');
                    }

                    // 清空进度条定时器
                    clearInterval( this.timer );

                    // 重置下载表单
                    this.props.store.popularStore.resetFieldsValue(); 

                    this.setState({ downloadProgressVisiable : false, percent : 0 }, () => {  this.forceUpdate() })
                    // this.setState({ downloadProgressVisiable : false, percent : 0 });

                    },

                    // {/* 试用权限 下载次数达到了10次 就弹出弹窗提示 start */}

                    ( _data ) => {

                        // 清空进度条定时器
                        clearInterval( this.timer );
                        // 重置下载表单
                        this.props.store.popularStore.resetFieldsValue(); 

                        this.setState({
                            downloadProgressVisiable : false, 
                            percent : 0,
                            isShowPowerModal: true,
                            powerModalContent : _data.message
                        }); 

                        this.forceUpdate();
                        //console.log(this.state.isShowPowerModal);
                        //这里的this.state.isShowPowerModal的值是变为了true,之后 应该是要重新渲染执行render函数的，但实际上 this.state.isShowPowerModal的值是变为了true之后没有再次执行render函数，没有再次打印出

                        //window.SAVATHIS = this;
                        //console.log(SAVATHIS);
                        // window.SAVATHIS = this; 这句的意思是 把组件里的所有的东西都复一份给window.SAVATHIS
                    }
                    // {/* 试用权限 下载次数达到了10次 就弹出弹窗提示 end */}
                );


                        
            }


        }

    cancelBinder = () =>{
        clearInterval( this.timer  );
         this.setState({ modalShow :  false });
         this.props.store.popularStore.resetFieldsValue();  // 重置下载表单
     }


   /*  下载 end  */ 



 // 修改本地数据
 modifyData = ( source, collected ) => {
        let  imageListSource = mobx.toJS( this.props.store.popularStore.imageListSource );
             source.collect = collected;  
             imageListSource.forEach( (itemArry, index) => { 
                 itemArry.forEach((item, i ) => {  
                       if( item.front.id ==  source.front.id ){ 
                             imageListSource[index][i].collect = collected;
                          }
                      }) 
                    });

                  
     this.props.store.popularStore.setProperties({ 'imageListSource' : imageListSource  },
                                                () => {    this.forceUpdate()  })  // 手动触发组件从新渲染
   }
    

      
 // 收藏 、 取消收藏
 onCollection = ( source ) => {

        if( !this.props.store.popularStore.isLoading ){

                var category = this.state.category,
                        { front, collect } = source;

                if( collect == 2 ){  // 未收藏

                        this.props.store.popularStore.send_collect({ resource_id : front.id , category : category }, () => { 
                                 // 修改本地数据
                                 this.modifyData( source, 1 );
                        });
                }else{  
                this.props.store.popularStore.onCancelCollect({ resource_id :  front.id , category : category }, () => { 
                               // 修改本地数据
                               this.modifyData( source, 2 );
                    });

                }  
                
                
         }



     }





 // 滚动请求数据
  loadingCallBack = () => { 
        if( !this.state.isLoading  ){  // 未请求数据状态
            this.setState({ isLoading :  true, noMore : false }, () => {  this.forceUpdate() });
            let id = this.props.location.match.params.id,
                 { page, category } = this.state;
            this.props.store.popularStore.request_detailData( id, { page : page + 1,  category : category }, ( source, param ) => {

                            if( source.length ){
                                 this.setState({  isLoading : false,  page : param.page }, () => {  this.forceUpdate() })

                            }else{
                                this.setState((prevState, props) => {
                                    let flag = false;
                                    if( source.length <= 0) flag = true;
                                   return { 
                                        isLoading : false,  
                                        page : param.page, 
                                        noMore : flag 
                                    }
                                 }, () => {  this.forceUpdate()  } )
                                 
                            }
                })

    } 
      
 }


  // 加载数据函数
 requestAction = ( id , p = {} ) => {
     this.state.isLoading ? '' :
     this.props.store.popularStore.request_detailData( id, p, ( source, p ) =>{
                    this.setState({  isLoading : false,  page : p.page  }, () => {  this.forceUpdate() });  // 更新页码
            });      
  }



shouldComponentUpdate(nextProps,nextState ){
        return false // 防止在滚动时候，无限制触发渲染,禁止动态渲染
}



 componentDidMount(){ 

           let { category, index, tag } =  this.props.location.match.params;
           this.setState({ category , headerIndex : index, tag  });
           let id = this.props.location.match.params.id,
               wheight = window.innerHeight,
               height = document.documentElement.clientHeight;

              document.querySelector('.pd-right').style.height =  ( wheight - 16 )  + 'px';   // height - 16 - 40


             // 初始化滚动加载数据函数
             ScrollingLoad.execute('pd-right','scrollTarget',  this.loadingCallBack );

             this.requestAction( id, { page : 1, category : category } ); //请求数据

             this.props.store.popularStore.request_pieData( id, { category : category });


             // 获取用户已作品数量和所拥有可用的作品数量
             this.props.store.worksTotalNumberInfo.getWorksTotalNumberData();


    }


   componentWillUnmount(){  ScrollingLoad.destroy()  }

   componentWillUnmount(){
        // 清空数据
        this.props.store.popularStore.setProperties({ pieData : [], imageListSource : [ [],[],[] ] })
   }



    render(){


       let pieData = mobx.toJS( this.get_pieData );  

       let imageListSource = mobx.toJS( this.get_imageListSource );

       let history = this.props.location.history;

       let { modalShow, isLoading, noMore, downloadProgressVisiable, menuMoe_visiable, percent  } = this.state;

       let { category, index : headerIndex, tag, id } =  this.props.location.match.params;

       //debugger;
       //console.log("render渲染  cancelPowerModal里的setState后的isShowPowerModal的值由true变为false,这里要打印false："+ this.state.isShowPowerModal);


        return (
             <div className="popular-detail">

            <div className="p-menue-box" onClick={ this.toggle_menuMoe } > <MenuMoe show={ menuMoe_visiable }  close={ x => {  this.setState({ menuMoe_visiable: false }) } } store={this.props.store} />  </div>

             <button onMouseEnter={ AnimationController.backButtonEnter.bind(this) } 
                     onMouseLeave={ AnimationController.backButtonLeave.bind(this) } 
                     className="back-btn"
                     onClick={ () => {  this.props.location.history.push( `/popular?category=${  category }&id=${ id }&index=${ headerIndex }&tag=${ tag }` )  } }
                     > 
                   <a href="javascript:void(0)"></a>
                </button> 

               <div className="pd-bg-wrapper">
                   <div className="pd-left">
                        <figure className="pd-logo"> <a href="#/">  <img src="/assets/toBoom/images/logo.png" alt=""/></a></figure>
                             <figure className="pd-item">
                                 <span className="p-left-span">
                                   <i></i>
                                   <img src={ pieData.path } alt=""/>
                                   </span>
                                   <h4>{ pieData.name }</h4>
                                   <figcaption>{ pieData.desc }</figcaption>
                             </figure>
                         </div>

                   <div className="pd-right"  id="pd-right" >

                         <div className="image-column-component" id="scrollTarget">

                             <div className="image-column-item"  style={{ width : 334, margin : '0 10px'  }} >
                               {
                                   imageListSource[0].map((item,index) => (
                                       <ImageComponent key={ index }
                                                        store={ this.props.store }
                                                        style={{ width : 334, height : 400 }} 
                                                        history={ history }  
                                                        source={ item }  
                                                        classname="image-element335"
                                                        onCollection={ this.onCollection }
                                                        onDownLoad={ this.onDownLoad }
                                                        handleGoNewDesign={ this.handleGoNewDesign }
                                                         />
                                   )) 
                               }
                                </div>

                           <div className="image-column-item" style={{ width : 238, margin : '0 10px' }} >
                               {
                                   imageListSource[1].map((item,index) => (
                                       <ImageComponent 
                                            store={ this.props.store }
                                            key={ index }
                                            style={{ width : 238, height : 300 }}  
                                            history={  history } 
                                            source={ item }  
                                            classname="image-element240"
                                            onCollection={ this.onCollection }
                                            onDownLoad={ this.onDownLoad }
                                            handleGoNewDesign={ this.handleGoNewDesign }
                                             />
                                   )) 
                               }
                                </div>


                            <div className="image-column-item"  style={{ width : 334, margin : '0 10px' }}>
                               {
                                   imageListSource[2].map((item,index) => (
                                       <ImageComponent key={ index }  
                                                store={ this.props.store }
                                                style={{ width : 334, height : 400 }} 
                                                history={ history }  
                                                source={ item }   
                                                classname="image-element335"
                                                onCollection={ this.onCollection }
                                                onDownLoad={ this.onDownLoad }
                                                handleGoNewDesign={ this.handleGoNewDesign }
                                           />
                                   )) 
                               }
                                </div>
                           </div>  
                           <HintComponent style={{ width: 941 }} isLoading={ isLoading } noMore={ noMore } source={ imageListSource } />
                     </div>

                      {/* end of pd-right */}
               
                 </div>

                         <Modal
                            show={this.state.showNoGoDesign}
                            text={this.state.showNoGoDesignMessage}
                            title="温馨提醒您"
                            onConfirm={()=>{this.setState({showNoGoDesign: false})}}
                            onCancel={()=>{this.setState({showNoGoDesign: false})}}
                            hideCancel={true}
                            isAlert
                            >
                         </Modal>


                      <PrivateModal 
                           title="选择下载文件"
                           show={ modalShow  }
                           style={{ width : 616, height : 390 }}
                           classname="donwloadModal"
                           onConfirm={ this.confirmBinder }
                           onCancel={  this.cancelBinder  }
                           confirmDisabled={ this.get_confirmDisable } >
                             <DownloadForm store={ this.props.store } />
                       </PrivateModal>


                        <DownLoadProgres
                               title="下载进度"
                               show={ downloadProgressVisiable  }
                               style={{ width : 616, height : 350 }}
                               onConfirm={ this.downloadProgress_confirm }
                               onCancel={  this.downloadProgress_cancel  }
                               percent={ percent }
                          />

                        {/* 试用权限 下载次数达到了10次 就弹出弹窗提示 start */}
                        <Modal
                            title="未购买权限"
                            show={this.state.isShowPowerModal}
                            // onCancel={()=>{this.setState({isShowPowerModal:false})}}
                            onCancel={this.cancelPowerModal.bind(this)}
                            // onConfirm={()=>{this.setState({isShowPowerModal:false})}}
                            onConfirm={this.confirmPowerGoClient.bind(this)}
                            // onCross={()=>{this.setState({isShowPowerModal:false})}}
                            onCross={this.crossCancelPower.bind(this)}
                            handlerCross
                            confirmText="下载客户端"
                            hideCancel
                            // isAlert
                        >
                            <div className="info-wrapper">
                                <div style={{display: 'flex',flexDirection:'column',}}>
                                    <p style={{marginLeft: 60, fontSize: 18}}>{this.state.powerModalContent}</p>
                                    <p style={{marginLeft: 60,fontSize:14}}>请联系您的<span style={{color:"#ffb07a"}}>资讯顾问</span>购买后进行电脑授权，或拨打<span style={{color:"#ffb07a"}}>400-061-0662</span>咨询</p>,
                                </div>
                            </div>
                        </Modal>
                        {/* 试用权限 下载次数达到了10次 就弹出弹窗提示 end */}
         
              </div>
        )
     }
}




