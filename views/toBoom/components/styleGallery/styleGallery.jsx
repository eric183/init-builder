import React, { Component, PureComponent } from 'react';
import { observer } from 'mobx-react';
import  * as mobx from 'mobx';
import axios from 'axios';
import { observable, computed, autorun } from 'mobx';
import SelectorComponent from './selectorComponent';
import { PrivateModal, DownLoadProgres } from '@/components/modal';
import {  HintComponent, DownLoadmethods } from '../waterfall/waterfall';
import DownloadForm from './downloadForm';
import CheckboxComponent from './checkboxComponent';
import ImageComponent from './imageComponent';
import TagsListComponent from './tagsListComponent';
import SearchCompoent from './searchCompoent';
import DropMenuComponent from './dropMenuComponent';
import { AnimationContrl } from './animationContrl';
import { SearchTool } from '@/components/search';
import { MenuMoe } from '@/components/menu';
import { Modal }  from '@/components/modal';

import { message, Tooltip,  Affix, BackTop  } from 'antd';


 // 下载方法
const DownLoadMethods = new DownLoadmethods();

//滚动动态加载
function scrollingLoading (){
     var  throttle = function(func, wait) {
                    let time, context
                    return function(){
                        context = this
                        if(!time){
                            time = setTimeout(function(){
                                func.apply(context, arguments)
                                time = null
                            }, wait)
                        }
                    }
              };

      this.scrollHanadler = throttle(function(){

                    let wHeight = window.innerHeight;

                    let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

                    let sHeight = scrollTarget.clientHeight;

                    let totalHeight =  Math.ceil( wHeight + scrollTop  );

                    if( totalHeight >= sHeight ){

                           this.onScrollingBinder( );

            
                    }
                  
            }.bind(this),300)

    
    let scrollTarget = document.getElementById('styleG-container');

    // 初始化滚动加载数据函数
     window.addEventListener('scroll', this.scrollHanadler ); 


}





@observer
export default class StyleGallery extends Component{

       state = {
        hotKeywordsIndex : -1,
        isAffixed : false,
        isLoading : false,
        noMore : false,
        subNavIndex :  undefined,
        threeLevelNav : undefined,
        group_id : undefined,  // 二，三级导航属性值
        tag_id : undefined,   // 二，三级导航属性值
        categoryIndex : '0',
        category : '',
        page : 0,
        downloadProgressVisiable : false,
        modalShow : false,
        percent : 0,
        menuMoe_visiable : false,
        searchToolValue : '',
        asideBtnTop : 15,
        showNoGoDesign: false,
        showNoGoDesignMessage: '作品数已达到上限',
        navCofig : {
            waitao : {
                classname : 'sg-tags-1',
                activename : 'active1',
                icon : 'dayi'

            },
            qunzhuang : {
                classname : 'sg-tags-2',
                activename : 'active2',
                icon : 'lianyiqun'
            },
            shangzhuang : {
                classname : 'sg-tags-3',
                activename : 'active3',
                icon : 'shangyi'
            },
            xiazhuang : {
                classname : 'sg-tags-4',
                activename : 'active4',
                icon : 'xiazhuang' 
            }
           
        },
        // {/* 试用权限 下载次数达到了10次 就弹出弹窗提示 start */}
        isShowPowerModal: false,
        powerModalContent: '',
        // {/* 试用权限 下载次数达到了10次 就弹出弹窗提示 end */}
        

       }


       @computed get get_subnavData(){ return this.props.store.styleGalleryStore.subnavData }
       @computed get get_filterData(){ return this.props.store.styleGalleryStore.filterData }
       @computed get get_count(){ return this.props.store.styleGalleryStore.count }
       @computed get get_hotKeywords(){ return this.props.store.styleGalleryStore.hotKeywords }
       @computed get get_confirmDisable(){ return this.props.store.styleGalleryStore.confirmDisable };
       @computed get get_imageListSource(){ return this.props.store.styleGalleryStore.imageListSource };
       @computed get get_tagsArray(){ return this.props.store.styleGalleryStore.tagsArray };


       sortSelector = null;
       timeSelector = null;
       searchtool = null;     // 引用 SearchTool 组件实例

       timer = null; // 定时器

      sortRef = (child) =>{ this.sortSelector = child }
      timeSortRef = ( child ) =>{ this.timeSelector = child }



     //  作品数量达到上限不可跳转设计页面
    handleGoNewDesign = ( event ) => {

        let { use_count, all_count } = mobx.toJS( this.props.store.worksTotalNumberInfo.worksTotalNumberInfo );

        if( all_count <= use_count) {
            this.setState({
                showNoGoDesign: true
            })
        }else {
            let userInfo = this.props.store.homePageInfo.userInfo
            let { category } = this.state;
            this.props.store.globalInfo.setCategary(category);
            if(typeof userInfo.is_binding  === 'undefined'){
                store.globalInfo.modalShow("请登录", 401);
                // 2018-12-19 19:31 增加了 !userInfo.is_try &&
            }else if( !userInfo.is_try && !userInfo.is_binding){
                store.globalInfo.modalShow("电脑未绑定!", 406)
            }else if( userInfo.category.length == 0 || userInfo.category.indexOf(category) == -1){
                store.globalInfo.modalShow("没有权限!", 403)
            }else{
                let { origin, pathname } = location;
                window.open( origin +  pathname +  event.currentTarget.dataset.gonewdesign )
            }

            //let { origin, pathname } = location;
            //window.open( origin +  pathname +  event.currentTarget.dataset.gonewdesign )
            // location.hash = event.currentTarget.dataset.gonewdesign;

        }

    }
    


  //  获取请求所需的参数
  calculateParam = ( page ) => {
    let { category,  group_id, tag_id } = this.state;
    this.props.store.globalInfo.setCategary(category);
    let tagsList = mobx.toJS( this.props.store.styleGalleryStore.tagsList ),
            param  = {
            page : page,
            category : category,
         
        },
        timeSelectorValue = this.timeSelector.state.selectedValue,
        sortSelectorValue = this.sortSelector.state.selectedValue,
        attrs = [];

        timeSelectorValue ? param.day = timeSelectorValue : '';
        sortSelectorValue ?  param.order = sortSelectorValue : '';
        group_id ? param.attrs = [ { group_id, tag_id } ] : '';

        tagsList.forEach((item, index) => {
            if( item.type == 'keywords'){  param.keywords = item.title }
            if( item.type == 'tags' || item.type == "checkbox" ){ attrs.push({ group_id : item.group_id, tag_id : item.tag_id })  }
        });
        
        if(attrs.length){
            param.attrs = param.attrs ? param.attrs.concat( attrs ) : attrs ;
        }


    return  param

}

     
   // 清除 Searchtool 组件 所有已选标签
    clean_searchtool_selectedTags(){

        let tagsList = mobx.toJS( this.props.store.styleGalleryStore.tagsList ),
        tags = [];  
        if( tagsList.length ){
           //  tagsList.forEach(( item,index ) => {  if( item.type == 'tags' ) tags.push( item );  });
          //  tags.length ?  this.searchtool.cleanSelectedTags( tags ) : '';
          
          this.searchtool.cleanAllTags(); // 清空所有已选标签

        }
    
    }



    //一级导航 【 品类筛选 】
    chooesCategory( index, item ){  

           this.setState({  
                  category : item.name ,
                  categoryIndex : index , 
                  subNavIndex : undefined, 
                  threeLevelNav : undefined,
                  group_id : undefined,
                  tag_id : undefined,
                  hotKeywordsIndex : -1 
                 });

           this.props.store.styleGalleryStore.setProperties({ 'subnavData' : item.children, 'imageListSource' : [ [],[],[],[] ]  });  // 清空缓存数据
           this.props.store.globalInfo.setCategary(item.name);
           this.clean_searchtool_selectedTags(); // 清除 Searchtool 组件 已选标签; 【置于 reset_chooesList_tagsList 方法之前 】

           this.props.store.styleGalleryStore.reset_chooesList_tagsList(); // 清空所有标题和多选框选项
           this.sortSelector.resetField();  // 重置排序
           this.timeSelector.resetField();  // 重置时间排序

           this.searchtool.cleanSearchValue(); // 清空 Searchtool 组件 的搜索框内容

           this.requestAction( { page : 1, category : item.name } );

           this.props.store.styleGalleryStore.reqest_hotKeywords({ category : item.name });
         
    }



   //二，三级导航 
    chooseNavItem = ( item, index, level ) => {

        if( level == 3 ){

            this.setState({ 
                    subNavIndex : index, 
                    threeLevelNav : item.label,
                    group_id : item.group_id ,  
                    tag_id : item.tag_id,
                    hotKeywordsIndex : -1 
                  });
        }else{
            this.setState({ 
                subNavIndex : index,
                group_id : item.group_id ,  
                tag_id : item.tag_id,
                hotKeywordsIndex : -1 
            });
        }

            // 滚回顶部
            window.scrollTo(0,1); 


            // 清除 Searchtool 组件 已选标签; 【置于 reset_chooesList_tagsList 方法之前 】
            this.clean_searchtool_selectedTags(); 
            // 清空 Searchtool 组件 的搜索框内容                
            this.searchtool.cleanSearchValue(); 

            // 清空所有标题和多选框选项
            this.props.store.styleGalleryStore.reset_chooesList_tagsList(); 
            this.props.store.styleGalleryStore.setProperties( { 'imageListSource' : [ [],[],[],[] ]  } );  // 清空缓存数据
            this.sortSelector.resetField();  // 重置排序
            this.timeSelector.resetField();  // 重置时间排序
            this.requestAction( { page : 1, category : this.state.category, attrs: [ { group_id : item.group_id ,  tag_id : item.tag_id } ]  } ); 

    }


    // 排序
     sortBinder = ( value ) => { 
          let param = this.calculateParam( 1 );
          this.props.store.styleGalleryStore.setProperties({ 'imageListSource' : [ [],[],[],[] ]  }, () => {   this.requestAction( param )  });  // 清空缓存数据，然后加载新数据
      }


     // 时间筛选
     timeBinder = ( value ) => {  
           let param = this.calculateParam( 1 );
            if( param.day == 'all' ) delete param.day;
            this.props.store.styleGalleryStore.setProperties({ 'imageListSource' : [ [],[],[],[] ]  }, () => {   this.requestAction( param )  });  // 清空缓存数据，然后加载新数据
       }


      // 热门标签
      hotKeywordsBinder( value, index ){
           this.setState({ hotKeywordsIndex : index });
           this.props.store.styleGalleryStore.updateTagsList( { type : 'keywords', title : value, classname : 'bg1' } );
           let param = this.calculateParam( 1 );
           this.props.store.styleGalleryStore.setProperties({ 'imageListSource' : [ [],[],[],[] ]  }, () => {   this.requestAction( param )  });  // 清空缓存数据，然后加载新数据
       }


    // 显示或隐藏 menuMoe
     toggle_menuMoe = () => {
        this.setState({ menuMoe_visiable : !this.state.menuMoe_visiable })
      }


   
    /*  搜索框工具 start  */ 
    // 搜索框工具
     searchToolValueBinder( value ){  //  for keywords
          if( value ){
              this.props.store.styleGalleryStore.updateTagsList( { type : 'keywords', title : value, classname : 'bg1' } );
              setTimeout(() =>{  
                 //清空原有数据
                  this.props.store.styleGalleryStore.setProperties({ 'imageListSource' : [ [],[],[],[] ]  }, () => {    // 清空缓存数据，然后加载新数据
                         let param = this.calculateParam( 1 ); 
                         this.requestAction( param ); 
                     }); 
                 
                 },150)
          }
     }



     // 标签组
     searchToolCancelBinder( values = [] ){  // for tags

        this.props.store.styleGalleryStore.updateTagsList_array( values );

        setTimeout(() =>{
            this.props.store.styleGalleryStore.setProperties({ 'imageListSource' : [ [],[],[],[] ]  }, () => {    // 清空缓存数据，然后加载新数据
                let param = this.calculateParam( 1 ); 
                 this.requestAction( param ); 

            }); 
        },150)
    
     }   

    /*  搜索框工具 end  */ 




     // 圆球形多选组件确认事件 
     submitActionBinder = ( validated, chooesList, closeCheckbox ) => {
         if( validated ){
           let param = this.calculateParam( 1 );
           closeCheckbox(); // 关闭选框
           this.props.store.styleGalleryStore.setProperties({ 'imageListSource' : [ [],[],[],[] ]  }, () => {   this.requestAction( param )  });  // 清空缓存数据，然后加载新数据
         }else{
              message.warning('请选择标签！')
         }

     }
  

    // 删除标签列表指定标签
    deleteTagsAction = ( item , flag = true) => {

         if( item.type == 'keywords'){

            this.setState({ hotKeywordsIndex : -1 });

             // do something
             
         }else if(  item.type == 'tags'){

             // 处理 searchtool 组件 已选标签样式
              this.searchtool.deleteSelectedTag( item );

         }else if( item.type == 'checkbox' ){
               flag && this.props.store.styleGalleryStore.removeChooesListItem( item );
         }  

         this.props.store.styleGalleryStore.setProperties( { 'imageListSource' : [ [],[],[],[] ]  } );

         this.props.store.styleGalleryStore.deleteTagsList(item , () => {  
                    let param = this.calculateParam( 1 ); 
                    this.requestAction( param ) 
             });


    }


    

    // 修改本地数据
   modifyData = ( source, collected ) => {

    let imageListSource = mobx.toJS( this.props.store.styleGalleryStore.imageListSource );

         imageListSource.forEach( (itemArry, index) => { 
             itemArry.forEach((item, i ) => {  
                  if( item.id ==  source.id  )  imageListSource[index][i].collect = collected  
                  }) 
                });

        this.props.store.styleGalleryStore.setProperties({ 'imageListSource' : imageListSource });
  }




     // 收藏 、 取消收藏
     onCollection = ( source ) => {
         let userInfo = this.props.store.homePageInfo.userInfo
         let { category } = this.state;
         this.props.store.globalInfo.setCategary(category);
         if(typeof userInfo.is_binding  === 'undefined'){
             store.globalInfo.modalShow("请登录", 401);
             return
            //  2018-12-19 19：14 增加了 !userInfo.is_try &&
         }else if( !userInfo.is_try && !userInfo.is_binding){
             store.globalInfo.modalShow("没有权限!", 406)
             return
         }else if( userInfo.category.length == 0 || userInfo.category.indexOf(category) == -1){
             store.globalInfo.modalShow("没有权限!", 403)
             return
         }
        if( !this.state.isLoading ){
                if( source.collect == 2 ){  // 未收藏
                    this.props.store.styleGalleryStore.send_collect({ resource_id : source.id , category : this.state.category }, () => { 
                                // 修改本地数据
                                this.modifyData( source, 1 );
                     });

                }else{  
                this.props.store.styleGalleryStore.onCancelCollect({ resource_id :  source.id , category : this.state.category }, () => { 
                            // 修改本地数据
                            this.modifyData( source, 2 );
                        
                    });

                }  
        }

     }



    /*  下载 start   */

    

     // 下载按键
    onDownLoad = ( source ) => {

        let userInfo = this.props.store.homePageInfo.userInfo
        let { category } = this.state;
        this.props.store.globalInfo.setCategary(category);
        // ```````````2018-12-18 14:51 lsh 注释掉的````start`````````````
        // if(typeof userInfo.is_binding  === 'undefined'){
        //     store.globalInfo.modalShow("请登录", 401);
        //     return
        // }else if( !userInfo.is_binding){
        //     store.globalInfo.modalShow("没有权限!", 406)
        //     return
        // }else if( userInfo.category.length == 0 || userInfo.category.indexOf(category) == -1){
        //     store.globalInfo.modalShow("没有权限!", 403)
        //     return
        // }
        // ```````````2018-12-18 14:51 lsh 注释掉的````end`````````````
        // ```````````2018-12-18 14:51 lsh 增加了 userInfo.is_try 的判断````start`````````````
        if(typeof userInfo.is_binding  === 'undefined'){
            store.globalInfo.modalShow("请登录", 401);
            return
            // 2018-12-19 19:31 增加了 !userInfo.is_try &&
        }else if( !userInfo.is_try && !userInfo.is_binding){
            store.globalInfo.modalShow("没有权限!", 406)
            return
        }else if( userInfo.category.length == 0 || userInfo.category.indexOf(category) == -1){
            store.globalInfo.modalShow("没有权限!", 403)
            return
        }
        // ```````````2018-12-18 14:51 lsh 增加了 userInfo.is_try 的判断````end`````````````

        // 在此先拿图片ID去请求是否存有附图
        this.props.store.styleGalleryStore.request_annex( source.id ).then(( { data } )=>{
            if( data.status_code == 200 ){
                    let { drawing_annex, master_annex } = data.data;
                    let source_copy = Object.assign(source, {}, true);
                        source_copy.drawing_annex = drawing_annex;
                        source_copy.master_annex = master_annex;

                    this.setState({ modalShow :  true });
                    var formState = mobx.toJS( this.props.store.styleGalleryStore.formState );
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
            
                        if( master_annex == 1 ){
                            formState.feps = true;
                            formState.fepsDisable = false;
                            formState.frontChoose = ['png','eps'];
                        }
            
                    if( drawing_annex == 1 ){
                            formState.reps = true;
                            formState.repsDisable = false;
                            formState.reverseChoose = ['png','eps'];
                    }
            
                    this.props.store.styleGalleryStore.setProperties({ formState : formState, confirmDisable : false } );

            }else{

            }
        })
        
  
   }


    // 下载进度条
   downloadProgress_confirm = () => {
         //  this.setState({ downloadProgressVisiable : false });
    }

    downloadProgress_cancel = () => {
         clearInterval( this.timer );
         this.setState({ downloadProgressVisiable : false, percent : 0 });
         DownLoadMethods.break_off(); // 中断下载请求
         this.props.store.styleGalleryStore.resetFieldsValue();  // 重置下载表单 

    }


    // 模拟加载进度
    downloadprogress_animation = () =>{
        var rnd = function(n, m){
            var random = Math.floor(Math.random()*(m-n+1)+n);
            return random;
        };

        this.timer = setInterval(() => {
                let percent = this.state.percent;
                if( percent < 80 ){
                    this.setState({ percent : percent + rnd(1,10) })
                }else{
                    clearInterval( this.timer )
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
    // {/* 试用权限 下载次数达到了10次 就弹出弹窗提示 end */}



    // 弹窗确定按键 【 下载 】
    confirmBinder = () =>{
        let formState = mobx.toJS( this.props.store.styleGalleryStore.formState ),
           { checkboxSource, frontChoose, reverseChoose, front, reverse  } = formState,
           param = { category : this.state.category, resource_id : [], angle : [] };
             if( front && frontChoose.length > 0 ){ 
                    param.resource_id.push( checkboxSource.id )
                    param.angle.push({
                        angle : 'front',
                        format : frontChoose
                    })
              }

             if( reverse && reverseChoose.length > 0 ){  
                 //  param.resource_id.push( checkboxSource.drawing_id )  
                // 不需要加上反面ID, 如果未选正面，则
                 param.resource_id.length <= 0 ?  param.resource_id.push( checkboxSource.id ) : '';
                  param.angle.push({
                    angle : 'back',
                    format : reverseChoose
                })
             }


        if( param.resource_id.length ){  // 下载

            this.downloadprogress_animation(); // 模拟加载进度

            // 关闭下载弹窗，打开进度条
            this.setState({ modalShow :  false, downloadProgressVisiable : true });

            DownLoadMethods.fireRequestAction( param, ( data ) => {  // data 可能是请求成返回的数据，也有可能是 error 对象；
                if( data.status_code && data.status_code == 200 ){
                    window.location.href = data.data.downloadUrl;
                } else {
                       message.warning('下载失败！');
                }

                // 清空进度条定时器
                clearInterval( this.timer );
                // 关闭进度条
                this.setState({ downloadProgressVisiable : false, percent : 0 });
                // 重置下载表单
                this.props.store.styleGalleryStore.resetFieldsValue();  

            },

            // {/* 试用权限 下载次数达到了10次 就弹出弹窗提示 start */}
            ( _data ) => {
                // 清空进度条定时器
                clearInterval( this.timer );
                // 重置下载表单
                this.props.store.styleGalleryStore.resetFieldsValue();  
 
                this.setState({
                    downloadProgressVisiable : false, 
                    percent : 0,
                    isShowPowerModal: true,
                    powerModalContent : _data.message
                });
            }
            // {/* 试用权限 下载次数达到了10次 就弹出弹窗提示 end */}
        );



        }

      
    }

    cancelBinder = () =>{
        clearInterval( this.timer );
        this.setState({ modalShow :  false });
        this.props.store.styleGalleryStore.resetFieldsValue();  // 重置下载表单
    }

    /*  下载 end  */






   // 加载数据函数
   requestAction = ( p = {}, callback = function(){} ) => {  

          if( !this.state.isLoading ){

                    this.setState({ isLoading : true, noMore : false });  // 更改加载状态
               
                    this.props.store.styleGalleryStore.reqest_styleData( p, ( source ) =>{ 
        
                        callback( source );

                        this.setState((prevState, props) => {
                            let flag = false;
                            if( source.length <= 0 ) flag = true;
                             return { 
                                   page : p.page,   // 加页码
                                   isLoading : false, 
                                   noMore : flag
                               }   
                        })

                });   

          }


      }



    // 滚动加载数据
    onScrollingBinder = () =>{
         let total = this.props.store.styleGalleryStore.get_imageListSource_total();
            if((!this.state.isLoading) && total >= 50 ){  // 低于50条，则不滚动加载
                    let param = this.calculateParam( this.state.page + 1 );
                    this.requestAction( param );
            }
        
    }



  


    // 可固定导航条状态
    afterAffix = (affixed) =>{  this.setState({ isAffixed : affixed }) }



      // 计算高度
      computedHeight = ( source ) => {
           let heightArry = [ 610,410,310,410 ]; 
           let copy_source = source.concat();
           var maxItem = {
                  max : copy_source[0],
                  height : heightArry[0]
           };

             copy_source.forEach((item, index) => { 
                   let itemHeight = item.length * heightArry[index],
                        maxHeight = maxItem.max.length * maxItem.height;
                   if( itemHeight > maxHeight ) maxItem = {
                                              max : item,
                                              height :heightArry[index]
                                     }
            })

           let dHeight =  document.documentElement.clientHeight - 385,
               mHeight = maxItem.max.length * maxItem.height || 0;
           if( mHeight > dHeight ){
                return  mHeight + 47
           }else{
                return  dHeight
           }
      }


    componentDidMount(){  
              // 初始化滚动加载事件
              scrollingLoading.call(this);

              this.requestAction({ page : 1 }); // 后端做了默认品类权限展示，不用带上category；  category : this.state.category   


              this.props.store.styleGalleryStore.reqest_count();

              this.props.store.styleGalleryStore.request_allTags();

              // 获取用户已作品数量和所拥有可用的作品数量
              this.props.store.worksTotalNumberInfo.getWorksTotalNumberData();

               // return Promise
              this.props.store.styleGalleryStore.reqest_filterData()
                  .then(( data ) => {
                     if( data.category ){
                             // 获取用户权限信息
                            this.props.store.productManagement.requestUserInfo(( category ) => {
                                // category 有可能是空的
                                if( category.length <= 0  ){
                                      category.push('外套');
                                      this.props.store.styleGalleryStore.reqest_hotKeywords({ category : ''}); // 为空就不带
                                }else{
                                      this.props.store.styleGalleryStore.reqest_hotKeywords({ category : category[0] })
                                }
                        
                                let _name = category[0];
                                data.category.forEach(( item, index ) => {
                                    item.name == _name ? this.setState({ categoryIndex : index, category : _name }) : '';
                           })
                      })
                 }
              })

    }

     componentWillUnmount() {

         this.setState({ hotKeywordsIndex : -1 });
         
        // 初始化滚动加载数据函数
         window.removeEventListener('scroll', this.scrollHanadler); 

          // 清空款式图库数据
         this.props.store.styleGalleryStore.setProperties({ 'imageListSource' : [ [],[],[],[] ]  });

         this.props.store.styleGalleryStore.setProperties({
              'tagsList' : [],
              'chooesList' : {  profile: [], clen: [], season: [] }
         });

         this.searchtool.cleanAllTags(); // 清空所有已选标签


     }
    

     render(){

          let count = this.get_count;
          let  subnavData = mobx.toJS( this.get_subnavData );
        
          let  imageListSource = mobx.toJS( this.get_imageListSource );

          let  filterData = mobx.toJS( this.get_filterData );
          let hotKeyWords = mobx.toJS( this.get_hotKeywords );
          let  tagsArray = mobx.toJS( this.get_tagsArray );

          let total = this.props.store.styleGalleryStore.get_imageListSource_total();

    
          let { isLoading, noMore, 
               categoryIndex, 
               modalShow, 
               navCofig, 
               subNavIndex, 
               threeLevelNav, 
               downloadProgressVisiable
               ,menuMoe_visiable, 
               isAffixed,
               percent,
               hotKeywordsIndex
             } = this.state,
             _height =  this.computedHeight( imageListSource ),
              history = this.props.location.history;
          return (
               <div className="styleG-container" id="styleG-container">
                <div className="styleG-bg-1">
                <div className="styleG-bg-2">
                 <div className="styleG-bg-3">

                 <BackTop className="ant-backTop-custom-style" style={{ visibility : total >= 50 ? 'visible' : 'hidden' }} />

                 <Affix  style={{ width : 145, position: 'absolute', right : 20, top : 15 }}> 
                   <div className={ ["s-menue-box", isAffixed ? 'setMargeTop' : '' ].join(' ') }  onClick={ this.toggle_menuMoe } >
                       <MenuMoe store={this.props.store} show={ menuMoe_visiable }  close={ x => {  this.setState({ menuMoe_visiable: false }) } }  /> 
                     </div>
                     </Affix>


                   <div className="sg-top">
                        <a href="#/" className="sg-logo"><img src="/assets/toBoom/images/logo.png" /></a>
                         <ul className="sg-nav-tags">
                            {
                                filterData.category.map((item,index) => (
                                    <li 
                                       key={ index }
                                       onMouseEnter={ AnimationContrl.drop } 
                                       onMouseLeave={ AnimationContrl.pull } >
                                      <a href="javascript:void(0)" onClick={ this.chooesCategory.bind(this, index, item) }
                                         className={[ navCofig[ item.pinyin ].classname , categoryIndex == index ?  navCofig[  item.pinyin  ].activename : '' ].join(' ')} >
                                          <i className={['iconfont', navCofig[ item.pinyin ].icon ].join(' ')}  ></i> <em> { item.name } </em> </a>
                                    </li>  
                                ))
                            }
                        </ul>
                      </div>


                <p className="sg-message">{` 展示 ${ total  } 款    本周新增 ${ count } 款 `}</p>
    
                 <div className={['wrapper-header', isAffixed ? '' : 'hasBackground' ].join(' ')} >
                        <header className="header-bar">
                            {
                                subnavData.map(( item,index ) =>(
                                    <DropMenuComponent 
                                        subNavIndex={ subNavIndex }
                                        threeLevelNav= { threeLevelNav }
                                        itemIndex={ index }  
                                        key={ index } 
                                        subnavItem={ item }  
                                        chooseNavItem={ this.chooseNavItem } />
                                ))
                            }
                        </header>
                      </div>

                     {/* 滚动时固定在顶部的导航条  start */}
                     <Affix offsetTop={ -8 } className={["header-affix", isAffixed ? 'hasBg' : '' ].join(' ')} onChange={ this.afterAffix }> 
                            <header className="header-bar" style={{ display : isAffixed ? 'flex' : 'none'  }} >
                                {
                                    subnavData.map(( item,index ) =>(
                                        <DropMenuComponent 
                                            subNavIndex={ subNavIndex }
                                            threeLevelNav= { threeLevelNav }
                                            itemIndex={ index }  
                                            key={ index } 
                                            subnavItem={ item }  
                                            chooseNavItem={ this.chooseNavItem } />
                                    ))
                                }
                            </header>
                            </Affix>
                 {/* 滚动时固定在顶部的导航条  end */}
                        <div className="tags-panel">
                             <div className="tags-left">
                                {/*
                                  <SearchCompoent searchAction={ this.searchAction }  /> 
                                   <button type="button"> <img src="/assets/toBoom/images/biaoqiananniu.png" /> </button>
                              */}
                                <SearchTool 
                                            onRef={ ( ref ) => { this.searchtool = ref } }
                                            editorStore={ this.props.store.editorStore }
                                            value={ this.state.searchToolValue } 
                                            data={ tagsArray } 
                                            onChange={this.searchToolValueBinder.bind(this)}  
                                            onCancel={this.searchToolCancelBinder.bind(this)} 
                                            filtrated={ true }
                                             />
                                    <dl>
                                        <dt>热门标签：</dt>
                                          {
                                              hotKeyWords.map(( item, index ) =>(
                                                <dd key={ index } 
                                                    onClick={ this.hotKeywordsBinder.bind(this,item, index ) }
                                                    className={ hotKeywordsIndex == index ? 'active' : '' } >   
                                                     <Tooltip title={ item }>
                                                        <span className="text">{ item }</span>
                                                       </Tooltip>
                                                      </dd>
                                              ))
                                          }
                                    </dl>
                              </div>
                          

                             <div className="tags-right">

                             <SelectorComponent 
                                    defaultTitle="排序" 
                                    classnames={['up','down', 'sheight33']} 
                                    style={{ marginRight : '10px' }}
                                    data={  filterData.order  } 
                                    fieldName={ { value : 'value', name : 'label' } }
                                    defaultOption={ false }
                                    checkedAction={ this.sortBinder }
                                    onRef={ this.sortRef } 
                              />

                             <SelectorComponent  
                                    defaultTitle="时段" 
                                    classnames={['up','down', 'sheight33']} 
                                    data={  filterData.day  } 
                                    defaultOption={ false }
                                    fieldName={ { value : 'value', name : 'label' } }
                                    checkedAction={ this.timeBinder }
                                    onRef={ this.timeSortRef } 
                                 /> 
                               </div>

                       </div> 


                      <CheckboxComponent  store={ this.props.store }  source={ filterData }  deleteTagsBinder={ this.deleteTagsAction }  submitAction={ this.submitActionBinder }  />

                      <TagsListComponent store={ this.props.store }   deleteTagsBinder={ this.deleteTagsAction }  />


                     {/* 瀑布流 start  */}
                       <div id="sg-list" style={{ height : `${_height}px`  }}>
                            <div className="image-column-component" id="scrollTarget">

                                        <div className="image-column-item"  style={{ width : 429, margin : '0 10px'  }} >
                                            {
                                                imageListSource[0].map((item,index) => (
                                                    <ImageComponent 
                                                        store={ this.props.store }
                                                        key={ index } 
                                                        style={{ width : 429, height : 600 }}   
                                                        source={ item } 
                                                        classname="image-element450"
                                                        history={  history } 
                                                        onCollection={ this.onCollection }
                                                        onDownLoad={ this.onDownLoad }
                                                        handleGoNewDesign={ this.handleGoNewDesign }
                                                    />
                                                )) 
                                            }
                                            </div>


            
                                        <div className="image-column-item"  style={{ width : 334, margin : '0 10px' }}>
                                            {
                                                imageListSource[1].map((item,index) => (
                                                    <ImageComponent 
                                                            store={ this.props.store }
                                                            key={ index }  
                                                            style={{ width : 334, height : 400 }}   
                                                            source={ item }   
                                                            classname="image-element335"
                                                            history={  history } 
                                                            onCollection={ this.onCollection }
                                                            onDownLoad={ this.onDownLoad }
                                                            handleGoNewDesign={ this.handleGoNewDesign }
                                                        />
                                                )) 
                                            }
                                            </div>



                                         <div className="image-column-item" style={{ width : 238, margin : '0 10px' }} >
                                            {
                                               imageListSource[2].map((item,index) => (
                                                    <ImageComponent 
                                                            store={ this.props.store }
                                                            key={ index }  
                                                            style={{ width : 238, height : 300 }}   
                                                            source={ item }   
                                                            classname="image-element240"
                                                            history={  history } 
                                                            onCollection={ this.onCollection }
                                                            onDownLoad={ this.onDownLoad }
                                                            handleGoNewDesign={ this.handleGoNewDesign }
                                                      />
                                                )) 
                                             }
                                          </div>



                                         <div className="image-column-item"  style={{ width : 334, margin : '0 10px' }}>
                                            {
                                                imageListSource[3].map((item,index) => (
                                                    <ImageComponent key={ index }
                                                         store={ this.props.store }
                                                         style={{ width : 334, height : 400 }}
                                                         source={ item }  
                                                         classname="image-element335"
                                                         history={  history } 
                                                         onCollection={ this.onCollection }
                                                         onDownLoad={ this.onDownLoad }
                                                         handleGoNewDesign={ this.handleGoNewDesign }
                                                     />
                                                )) 
                                            }
                                            </div>

                                        </div>  

                                    <HintComponent style={{ width: 1400 }} isLoading={ isLoading } noMore={ noMore }  source={ imageListSource } />
                         </div>
                         {/* 瀑布流 end  */}


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
                            onCancel={()=>{this.setState({isShowPowerModal:false})}}
                            // onConfirm={()=>{this.setState({isShowPowerModal:false})}}
                            onConfirm={this.confirmPowerGoClient.bind(this)}
                            onCross={()=>{this.setState({isShowPowerModal:false})}}
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


                      </div>  {/* end of styleG-bg-3  */}
                    </div>
                   </div>
                 </div>
          )
     }
}


