import React from 'react';
import { Link } from "react-router-dom";
import {observer} from 'mobx-react';
import { computed, observable, autorun } from 'mobx';
import * as qs from 'qs';
import * as mobx from 'mobx';
import Slider from "react-slick";
import * as echarts from 'echarts';
import SelectorComponent from '../styleGallery/selectorComponent';
import { MenuMoe } from '@/components/menu';


 // 图表 start 
let echartFn = {
    myChart : null,
     initChart: function(id){
         this.myChart = echarts.init(document.getElementById(id));
         return this
     },


     renderChart : function( data, clickAction ){

       let _data = this.proccessData( data );

       this.myChart && this.myChart.clear();
 
       if( _data.data.length == 0  ){ // 如果没有数据
                this.myChart.setOption({
                            graphic: [
                                {
                                    type: 'group',
                                    bounding: 'raw',
                                    left: 'center',
                                    top: 'center',
                                    z: 100,
                                    children: [
                                            {
                                                type: 'group',
                                                top: 'center',
                                                children: [
                                                    {
                                                        type: 'text',
                                                        z: 100,
                                                        left: 'center',
                                                        top: 'middle',
                                                        style: {
                                                            fill: '#949494',
                                                            text: [
                                                                '暂无数据'
                                                            ].join('\n'),
                                                            font: 'bolder 20px "Microsoft YaHei", sans-serif'
                                                        }
                                                    }
                                                ]
                                    }
                                ]
                                }
                            ]
                })
   
        }else{ 

                    this.myChart.setOption({
                      
                         graphic : [
                            {
                                type: 'group',
                                left: 'center',
                                top: 'center',
                                children: [
                                      {
                                        type: 'circle',
                                        z: 0,
                                        left: 'center',
                                        top: 'middle',
                                        shape: {
                                            cx: 1,
                                            cy: 1,
                                            r : 200
                                        },
                                        style: {
                                            fill: 'rgba(255,255,255,0.5)'
                                        }
                                    }
                                ]
                            }
                        ],
                        color: [
                            '#32aa93',
                            '#ff954d',
                            '#78a3d3',
                            '#d6b0cd',
                            '#f2bf30',
                            '#f28790',
                            '#84d2d3',
                            '#7b6be8',
                            '#d6cbb0',
                            '#bcd6cd',
                            '#d3c884',
                            '#dd83ae',
                            '#aa8e76',
                            '#69c2b1',
                            '#b7d6b0',
                            '#d3af78',
                            '#8ec180',
                            '#ffa86e',
                            '#f2c877',
                            '#569ad8'

                        ],

                        tooltip : {
                            trigger: 'item',
                            formatter: "{b} : {d}%"
                        },
                
                        series : _data
                    });

                 this.myChart.on('click', function (params) {  clickAction( params.data.id ) });

            }
     },


     proccessData : function( data ){

        let series =   {
            name: '',
            type: 'pie',
            radius : ['15%', '65%'],
            center: ['50%', '50%'],
            roseType : 'radius',
            label : {
                normal : {   //  "{b} : {d}%"
                    fontSize : 14,
                    formatter: ( params ) => {  
                      var getByteLen = function(val) {
                                    var len = 0;
                                    for (var i = 0; i < val.length; i++) {
                                    var length = val.charCodeAt(i);
                                    if(length>=0&&length<=128)
                                        {
                                            len += 1;
                                        }
                                        else
                                        {
                                            len += 2;
                                        }
                                    }
                                    return len;
                                }
                        
                            var str = '';
                         if(getByteLen( params.name ) > 15 ){
                               str = params.name.slice(1,10) + '...  : ' + params.percent + '%';
                         }else{
                               str = params.name + ' : ' + params.percent + '%';
                         }
                         
                           return str
                      }
                }
            },
            data:[]
          };

       if( data.folders ){ // 如果有数据
                series.name = data.title;
                series.data = data.folders.map((item,index) =>{
                    return  {
                                value : item.expands.percent,
                                name :  item.name,
                                id : item.id 
                            }
                })            
       }else{
           series.name = '暂无数据';
       }

        return series
     },

     dispose : function(){
         this.myChart  && this.myChart.dispose();
         this.dispose = null;
     }

}

 // 图表 end





/*
* 通过参数切换数据
*
*第一级参数 【 各个大类 】
*第二级参数 【 大类下的专题 】
*
*/

@observer
export default  class PopularComponent extends React.Component {
    
     state = {
               headerIcon : ['dayi','lianyiqun','shangyi','xiazhuang'],
                // 2018-12-25 15:15 增加的 把 headerIndex : '0' 改成 headerIndex : null 目的是 一进入页面 默认什么都不选中，外套 没有黄色背景 start 
                // headerIndex : '0',
                headerIndex : null,
                // 2018-12-25 15:15 增加的 把 headerIndex : '0' 改成 headerIndex : null 目的是 一进入页面 默认什么都不选中，外套 没有黄色背景  end 
                
                visiable_selector : false,
                menuMoe_visiable : false,

                // 2018-12-25 15:15 增加的 把 category : '外套' 改成 category : '' 目的是 一进入页面 默认什么都不选中，不传 外套 为默认参数 start 
                //category : '外套'
                // category : ''
                // 2018-12-25 15:15 增加的 把 category : '外套' 改成 category : '' 目的是 一进入页面 默认什么都不选中，不传 外套 为默认参数 end 
         }

    static searchParam = null;
      
         
      @computed get get_sourceData(){ return this.props.store.popularStore.sourceData }
      @computed get get_itemData(){ return this.props.store.popularStore.itemData }
      @computed get get_slideData(){ return this.props.store.popularStore.slideData }
      @computed get get_categorys(){ return this.props.store.popularStore.categorys }



      
      clickAction = ( id ) =>{  // 点击图标切换换幻灯片数据
        let itemData = mobx.toJS( this.get_itemData );
        itemData.folders.forEach((item,index) =>{
                if(item.id == id) this.props.store.popularStore.setProperties({ 'slideData' : item } , () => {
                        this.slider && this.slider.slickGoTo(0,true)
                });

        });

      }


     initAction = () =>{
       let itemData = mobx.toJS( this.get_itemData );
           document.getElementById('p-echart') && echartFn.initChart('p-echart').renderChart( itemData, this.clickAction );
           
     }


      // 下拉列表事件
     checkedAcion = ( value ) => {
            let scourceData = mobx.toJS( this.get_sourceData );
            let itemData = mobx.toJS( this.get_itemData );
            this.setState({ tag : value });  // 标签值

            // 重新渲染图表
            scourceData.forEach((item, index) => {

                    if( value == item.id && value != itemData.id){

                            this.props.store.popularStore.setProperties({ itemData : item  }); 

                               echartFn.renderChart( item, this.clickAction) // 重新渲染图表
                    }


                    if( value == item.id  && !this.searchParam.defaultValue  ){
                        this.props.store.popularStore.setProperties({ slideData :  item.folders[0]  },() => {
                                this.slider && this.slider.slickGoTo(0,true) // 幻灯片恢复到第一屏
                            })
                     }


                  if( value == item.id  && this.searchParam.defaultValue ){  // 非用户触发
                          item.folders.forEach(( stuff, index) => {
                                  if( stuff.id  == this.searchParam.id )         //  item.folders[0]
                                   this.props.store.popularStore.setProperties({ slideData :  stuff }, () => { 
                                         this.slider && this.slider.slickGoTo(0,true)  // 幻灯片恢复到第一屏
                                   });     
                          })
                         delete this.searchParam.defaultValue;
                         delete this.searchParam.id;
                  } 

                  
            })

     }


    checkPower(e){
        let { category } = this.state;
        let userInfo = this.props.store.homePageInfo.userInfo
        this.props.store.globalInfo.setCategary(category);

        // ```````````2018-12-18 14:41 lsh 注释掉的````start`````````````
        // if(typeof userInfo.is_binding  === 'undefined'){
        //     e.preventDefault();
        //     store.globalInfo.modalShow("请登录", 401);
        //     return false
        // }else if(! userInfo.is_binding){
        //     e.preventDefault();
        //     store.globalInfo.modalShow("电脑未绑定!", 406)
        //     return false
        // }else if( userInfo.category.length == 0 || userInfo.category.indexOf(category) == -1){
        //      e.preventDefault();
        //      store.globalInfo.modalShow("没有权限!", 403)
        //      return false
        // }
        // ```````````2018-12-18 14:41 lsh 注释掉的````end`````````````
        // ```````````2018-12-18 14:41 lsh 增加了 userInfo.is_try 的判断````start`````````````
        if(typeof userInfo.is_binding  === 'undefined'){
            e.preventDefault();
            store.globalInfo.modalShow("请登录", 401);
            return false
        }else if(!userInfo.is_try && ! userInfo.is_binding){
            e.preventDefault();
            store.globalInfo.modalShow("电脑未绑定!", 406)
            return false
        }else if( userInfo.category.length == 0 || userInfo.category.indexOf(category) == -1){
             e.preventDefault();
             store.globalInfo.modalShow("没有权限!", 403)
             return false
        }
        // ```````````2018-12-18 14:41 lsh 增加了 userInfo.is_try 的判断````end`````````````

        return true
    }

     
      // 选择品类
    selectedType(item, index){

         this.setState({ headerIndex : index,  category : item.name });

        this.props.store.globalInfo.setCategary(item.name);
       

         let { search, pathname } = this.props.location.location;
         
         if( search ) this.props.location.history.push( pathname );

        // 带上参数请求后台数据
         this.props.store.popularStore.request_popularData({ category :  item.name }, () => {

            let itemData = mobx.toJS( this.get_itemData );

             echartFn.renderChart( itemData, this.clickAction )



         });

  }


   // 显示或隐藏 menuMoe
   toggle_menuMoe = () => {
    this.setState({ menuMoe_visiable : !this.state.menuMoe_visiable })
  }


    // 如果是从详情页面跳回来，会带有对应的 category, headerindex 和 tag  
    has_searchParam(){

         let { search } = this.props.location.location;

         var parsParam = {
            splitFn: function(target,tag){
                 return target.split(tag)
            },
         
           execute : function(url){
                 var  arry = [];
                 var cashed = null;
                cashed = this.splitFn( url, '&' );
                for(var i = 0; i <cashed.length; i++ ){
                     arry.push( decodeURI( this.splitFn( cashed[i], '=')[1] ) );

                }

                return arry;
              }

          }


          if( search ){
            var paramArry = parsParam.execute(search);  // [ :category, :id, :index, :tag ]
              return { category : paramArry[0], id : paramArry[1], headerIndex : paramArry[2], defaultValue : paramArry[3] }
          }else{

               return { category : this.state.category , headerIndex : this.state.headerIndex }
          }
         
    }


   // 鼠标滚轮事件，滑动图片
   wheelHandle = ( event ) => {
        let deta = event.deltaY;
         if( deta > 0 ){  // 下
            this.slider.slickNext()
         }else{  // 上
            this.slider.slickPrev()
         }
         
   }


    componentDidMount(){

        let height = document.documentElement.clientHeight;
             document.querySelector('.popular-bg-br').style.minHeight = ( height - 16 ) + 'px';

         let param =  this.has_searchParam();

         this.searchParam = param;

          // 如果是从详情页面跳回来
          if( param.defaultValue ){ 
            let { pathname } = this.props.location.location;
                 this.props.location.history.push( pathname );
          }
            
            this.setState({ category : param.category, headerIndex : param.headerIndex });
            this.props.store.globalInfo.setCategary(param.category);
            this.props.store.popularStore.request_popularData({  category : param.category }, this.initAction);
            this.props.store.popularStore.request_categorys();

            this.props.store.styleGalleryStore.reqest_filterData()
                  .then(( data ) => {
                     if( data.category ){
                             // 获取用户权限信息
                            this.props.store.productManagement.requestUserInfo(( category ) => {        
                                let _name = category[0];
                                data.category.forEach(( item, index ) => {
                                    item.name == _name ? this.setState({ headerIndex : index, category : _name }) : '';
                           })
                      })
                 }
            })


    }


    componentWillUnmount(){  
        this.props.store.popularStore.setProperties({ itemData : {},  sourceData : [] });
        echartFn.dispose && echartFn.dispose();
        this.searchParam = null;

     }

   
      render() {
        let scourceData = mobx.toJS( this.get_sourceData ),
            slideData =  mobx.toJS( this.get_slideData ),
            categorys =  mobx.toJS( this.get_categorys ),
            { headerIndex, headerIcon, menuMoe_visiable } = this.state,
            settings = {
                className: "p-slide-component",
                dots: true,
                infinite: true,
                speed: 500,
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows : false,
                ref : slider => (this.slider = slider)
      };


      let param = this.searchParam || {};

          return (
              <div className="popular-container"> 
                   <div className="popular-bg-top">
                     <div className="popular-bg-br">

              <div className="p-top">
                <figure className="p-logo">
                    <a href="#/"><img src="./assets/toBoom/images/logo.png" alt=""/></a>
                  </figure>
                 <header className="p-header">
                            {
                                categorys.map((item,index) =>(
                                    <a href="javascript:void(0)" key={index} className={ headerIndex == index ? 'active' : '' }  onClick={ this.selectedType.bind(this, item, index) } >
                                    <i className={['iconfont', headerIcon[index] ].join(' ')} ></i> <em>{ item.name_zh }</em>
                                    </a> 
                                ))
                            }
                 </header>
                 <div className="p-menue-box" onClick={ this.toggle_menuMoe } > <MenuMoe store={this.props.store} show={ menuMoe_visiable } close={ x => {  this.setState({ menuMoe_visiable: false }) } } />  </div>
             </div>


      <div className="p-main-wrapper">
                       
            <div className="p-left">

            <div id="p-echart">暂无数据</div>

            <div className="p-select-box">

                <SelectorComponent 
                    defaultTitle="款式专题选择"
                    classnames={['styleUp','styleDown', 'sheight38']} 
                    style={{ width: 208 }}  
                    data={ scourceData } 
                    fieldName={{ value : 'id', name : 'title' }}
                    init={ true }
                    checkedAction={ this.checkedAcion }
                    defaultValue={ param.defaultValue  }
                    />

                </div>
            </div>


            <div className="p-right">
                    <img src="/assets/toBoom/images/borderline-bt.png" className="border_image_top"  />
                    <img src="/assets/toBoom/images/borderline-bt.png" className="border_image_bottom"  />
                    <img src="/assets/toBoom/images/borderline_left.png" className="border_image_left"  />
                        <div className="p-slide-container" onWheel={  this.wheelHandle  } >
                          {
                           slideData.materials.length ? (
                              <Slider { ...settings }>
                                        {
                                          slideData.materials.map((item,index) => {
                                                return (
                                                <div className="slide-item" key={index}><img src={ item.path } alt=""/></div>
                                            )
                                            })
                                        }
                              </Slider> 
                            ) : (
                                 <p className="p-slide-empty">暂无款式</p>
                            )
                          }
                        </div>

                         <div className="p-item-info">
                              <h4>{ slideData.name }  </h4>
                              <p> { slideData.desc } </p>
                              <Link onClick={(e)=>{this.checkPower(e)}} to={`/popularDetail/${ encodeURI( this.state.category ) }/${ slideData.id }/${ this.state.headerIndex }/${ this.state.tag }`}>更多款式</Link>
                           </div>
                       </div>
                     </div>

    

                       </div>
                      </div>
               </div> 
          )
      }

}


