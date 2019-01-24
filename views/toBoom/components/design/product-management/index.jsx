import React,{Fragment} from 'react';
import { observer } from 'mobx-react';
import * as mobx from 'mobx';
import { computed } from 'mobx';
import { Checkbox, Pagination,Row, Col, TreeSelect, Select, Input, Popconfirm, message, Tooltip } from 'antd';

import { DatePicker } from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn'
import qs from 'qs';
import { EditorComponent, BulkEditing } from './editorComponent';
import LogsComponent from './logsComponent';
import axios from 'axios';
import { DownLoadmethods } from '../../waterfall/waterfall';
import {  DownLoadProgres } from '@/components/modal';
import { MenuMoe } from '@/components/menu';

const CheckboxGroup = Checkbox.Group;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const Option = Select.Option;
const Search = Input.Search;


// 下载方法
const DownLoadMethods = new DownLoadmethods();


@observer
export default class DesignProductManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            categoryIcons : [{ title : '外套',icon : 'dayi' },{title : '上装',icon : 'shangyi'},{title : '裙装',icon : 'lianyiqun'},{title : '下装',icon : 'xiazhuang'}],  
            category:'外套', // 该字段用做权限处理
            fiterValues : {
                updated_start : null,
                updated_end : null,
                order : undefined,  // 时间排序 或 字母排序 【  首字母传：title  最后修改时间传：updated_at  】 
                order_type :  'asc',   //   desc   asc 
                keywords : '',
                category : [],
                profile : [],
                part : [],
                style : [],
                clen : [],
                details : [],
                season : [],
                updated_user : undefined,
                is_release : undefined,
            },

           startTime : null,
            endTime : null,

        
            order_icon : 'asc',
            timeOrder_icon : 'asc',
            endOpen: false,
            edit_visiable : false,
            logs_visiable : false,
            bulk_visiable : false,
            checkedList: [],
            indeterminate: false,
            checkAll: false,
            page : 1,
            limit : 18,
            downloadProgressVisiable : false,
            menuMoe_visiable : false,
            percent : 0,
        }
    }

    defaultState = {}  // 保存初始化状态值，用于重置

    timer = null ; // 定时器

   getParamsFromState(){

        let { category, page, limit, fiterValues, timeSorting, order } = this.state;

        let p = { page, limit,  category, attrs : {  } };   // attrs : {  category : [ category ]  }

        let keysArray = Object.keys( fiterValues );

        keysArray.forEach(( key, index) => {
              if( key == 'keywords'){

                fiterValues[key] != '' ? p.keywords = fiterValues[key] : '';

              }else if( ( key == 'updated_end' || key == 'updated_start' )){
                  
                   if( fiterValues.updated_end && fiterValues.updated_start )  p[key] = fiterValues[key];

              }else if( key == 'order'  || key == 'order_type' ){

                fiterValues.order ? p[key] = fiterValues[key] : '';

              }else if( key == 'updated_user'  || key == 'is_release' ){

                fiterValues[key] ?  p[ key ] = fiterValues[key] : ''

              }else if( fiterValues[key].length > 0 ){

                  p.attrs[key] = fiterValues[key];

              }

        });
        
         let attrsKeys = Object.keys( p.attrs );

         attrsKeys.length > 0 ?  p.attrs = JSON.stringify( p.attrs ) : delete p.attrs;

         return p;
   }


    // 在全局筛选下，需重置 page, limit 【 暂时无用 】
    getParamForFilter = () => {
         var { page, limit } = this.state; 
         var param = this.getParamsFromState();
         if( page != 1 || limit != 18 ){
            param.page = 1;
            param.limit = 18;
            this.setState({ page : 1, limit : 18 })
         }
        return param
   }





    // 日期 方法 开始
    disabledStartDate = (startValue) => {
        const endValue = this.state.endTime;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }
    
    disabledEndDate = (endValue) => {

        const startValue = this.state.startTime;
        
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }
    

    onChange = (field ) => {
        this.setState(field);
    }



    onStartChange = ( data,dateString ) => {

        let fiterValues = this.state.fiterValues;

            fiterValues.updated_start = dateString;

           this.onChange({ fiterValues, startTime : data });

          if( !this.state.fiterValues.updated_end  && !dateString ) this.fire_search_action(); // 如果清空已选条件

    }


    
    onEndChange = (data,dateString) => {

        let fiterValues = this.state.fiterValues;

           fiterValues.updated_end = dateString;

          this.onChange({ fiterValues, endTime : data });

        if( !this.state.fiterValues.updated_start && !dateString ) this.fire_search_action(); // 如果清空已选条件

    }


    
    handleStartOpenChange = (open) => {
        if (!open) {
          this.setState({ endOpen: true });
        }
    }


    
    handleEndOpenChange = (open) => {
        this.setState({ endOpen: open });
    }


    // 让日期始终固定在原来的位置
    // getCalendarContainer() {
    //     return this.d || document.getElementById('d');
    // }
    // 日期 方法 结束
      


    // 一级导航
    chooseNavHandler( title ){
            this.setState({ category : title , page : 1,  fiterValues : {
                            updated_start : null,
                            updated_end : null,
                            order : undefined,  
                            order_type :  'asc',  
                            keywords : '',
                            category : [],
                            profile : [],
                            part : [],
                            style : [],
                            clen : [],
                            details : [],
                            season : [],
                            updated_user : undefined,
                            is_release : undefined,
                        }
                });

            this.props.store.productManagementInfo.set_sub_categoryOptions( title );
            this.props.store.productManagementInfo.getProductManagementData({ page : 1, limit : this.state.limit , category : title });

    }


    // 显示或隐藏 menuMoe
    toggle_menuMoe = () => {
        this.setState({ menuMoe_visiable : !this.state.menuMoe_visiable })
      }




 // 条件筛选项 start 
  select_change( type,value ){
     let fiterValues = this.state.fiterValues;
     fiterValues[type] = value; 
     this.setState({ fiterValues });
     value == undefined ? this.fire_search_action() : ''; // 如果清空已选条件

  }

  treeSelect_change( type,value ){
    let fiterValues = this.state.fiterValues;
        fiterValues[type] = value;
     this.setState({ fiterValues });
    if( value.length <= 0 ) this.fire_search_action(); // 如果清空已选条件

  }

  search_setValue = ( event ) => {
    let fiterValues = this.state.fiterValues;
         fiterValues.keywords =  event.target.value ;
     this.setState({ fiterValues });
  }

   search_action = ( event ) => {
    let p = this.getParamsFromState();
       this.props.store.productManagementInfo.getProductManagementData( p );
   }


   search_onPressEnter = () => {
         this.search_action()  
   }


 fire_search_action = () => {
        let p = this.getParamsFromState();
        this.props.store.productManagementInfo.getProductManagementData( p ); 
   }

// 条件筛选项 end 



// 排序  时间排序 或 字母排序 【  首字母传：title  最后修改时间传：updated_at  】
orderBinder(type){

    let { fiterValues, order_icon, timeOrder_icon } = this.state,
          newState = {  };
         fiterValues.order =  type ;
       if( type == 'title' ){
             order_icon == 'asc' ?  fiterValues.order_type = 'desc' : fiterValues.order_type = 'asc';
             newState.fiterValues = fiterValues;
             newState.order_icon =  fiterValues.order_type
       }

       if( type == 'updated_at'){
              timeOrder_icon == 'asc' ?  fiterValues.order_type = 'desc' : fiterValues.order_type = 'asc';
              newState.fiterValues = fiterValues;
              newState.timeOrder_icon =  fiterValues.order_type
       }

     this.setState( newState, () => {
          var param = this.getParamsFromState()
          this.props.store.productManagementInfo.getProductManagementData( param ); 
     });

}


    // 点击图片进行单个编辑 start 
    click_ImageForEdit( data ){
         this.props.store.productManagementInfo.setProperties({ 'ImageForEdit' : data }, () => {  this.setState({ edit_visiable : true })  }); 
    }


    edit_conformBinder = ( values, callback ) => {

         let { singleItem } = values,
             keysArray = Object.keys( singleItem ),
             { category, page, limit } = this.state,
               params = {
                 ids : [],
                attrs : {},
                page,
                limit,
                category,
                append : 0 
            }

        keysArray.forEach(( key, index ) => {
            switch( key ){
                case 'release' : params.is_release = singleItem[key];
                break;
                case 'title' : params.title = singleItem[key];
                break;
                case 'id' :  params.ids = [ singleItem[key] ];
                break;
                default: params.attrs[key] = singleItem[key] ;
            }
        });



     this.props.store.productManagementInfo.multi_edit_Mehtod( params, () => {
             callback();
             let p = this.getParamsFromState();
             this.props.store.productManagementInfo.getProductManagementData( p );
          });


    }


    edit_cancelBinder = ( ) => {
         this.setState({ edit_visiable : false });
    }

   // 点击图片进行单个编辑 end


   

// 批量编辑 start 

show_bulkEditor_binder = () => { 
    this.setState({ bulk_visiable : true }) 
}


bulk_conformBinder = ( params = {}, callback = function(){} ) => {

    this.props.store.productManagementInfo.multi_edit_Mehtod( params, () => {
            callback();
            let p = this.getParamsFromState();
            this.props.store.productManagementInfo.getProductManagementData( p );

     });


}

bulk_cancelBinder = () => {
    this.setState({ 
            bulk_visiable : false,
            checkedList: [],
            indeterminate: false,
            checkAll: false,
     })
}

// 批量编辑 end




// 删除操作
deleteItemBinder = () => {
    this.props.store.productManagementInfo.deleteItem({ ids :  this.state.checkedList }, () =>{
            this.setState({  checkedList: [], indeterminate: false,  checkAll: false });
            let p = this.getParamsFromState();
            this.props.store.productManagementInfo.getProductManagementData( p );
    })
}

deleteItem_cancel_Binde = () => {}




// 发布 / 取消发布
release_Action = ( type ) => {

    let productManagementList = mobx.toJS( this.props.store.productManagementInfo.get_productManagementList );
    let checkedList = [];

    // 筛除于 type 相反的 id
    this.state.checkedList.forEach(( id, index ) => {  
          productManagementList.forEach(( item, i ) => {
                if( item.id == id ){  
                      item.is_release != type ? checkedList.push( id ) : '';
                }  
          })
    });

    this.props.store.productManagementInfo.setRelease({ ids : checkedList, is_release : type  } , () => {
             this.setState({  checkedList: [], indeterminate: false,  checkAll: false });
             let p = this.getParamsFromState();
             this.props.store.productManagementInfo.getProductManagementData( p ); 
    })
    
}










// 获取打包、请求打包链接 start 



    // 下载进度条
downloadProgress_confirm = () => {  
     // this.setState({ downloadProgressVisiable : false })
 }

 downloadProgress_cancel = () => {
        clearInterval( this.timer )
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


 

 itemDownLoadBinder = () => {  
      this.downloadprogress_animation(); // 模拟加载进度
      this.setState({ downloadProgressVisiable : true });
       DownLoadMethods.fireRequestAction( { resource_id: this.state.checkedList }, (data) => { // data 可能是请求成返回的数据，也有可能是 error 对象；
                        if( data.status_code && data.status_code == 200 ){
                            window.location.href = data.data.downloadUrl;
                    }else{
                        message.warning('下载失败！');
                    }
                    this.setState({ downloadProgressVisiable : false, percent : 0 });
                    clearInterval( this.timer );
                    // 重置下载表单
                    this.props.store.styleGalleryStore.resetFieldsValue();  

       });



    }

// 获取打包、请求打包链接 end 






 // 操作日记弹窗 start 

  viewLogs = () => {  this.setState({ logs_visiable : true })  }

  logs_conformBinder = ( e ) => { }

  logs_cancelBinder = ( e ) => {  this.setState({ logs_visiable : false }) }

 // 操作日记弹窗 end  





 // 多选框 start
     heckboxBinder = (checkedList) => {
        let productManagementList = mobx.toJS( this.props.store.productManagementInfo.get_productManagementList );
        this.setState({
          checkedList,
          indeterminate: !!checkedList.length && (checkedList.length < productManagementList.length),
          checkAll: checkedList.length === productManagementList.length,
        });


      }

      onCheckAllChange = (e) => {
        let productManagementList = mobx.toJS( this.props.store.productManagementInfo.get_productManagementList ),
            listIDs = productManagementList.map((item, index) =>( item.id ));
            this.setState({
            checkedList: e.target.checked ? listIDs : [],
            indeterminate: false,
            checkAll: e.target.checked,
            });
            
      }

      // 多选框 end
  
    componentDidMount() {
        
        this.defaultState = Object.assign(this.state, {}, true ); // 复制状态

        // 获取权限
        this.props.store.productManagementInfo.requestUserInfo((category) => {
            // category 有可能是空的
            category.length <= 0 ? category.push(' ') : '';
             this.setState({ category : category[0], categoryArry : category });

              // 获取列表数据
              this.props.store.productManagementInfo.getProductManagementData({ page : 1, limit : 18, category : category[0]  });

             this.props.store.productManagementInfo.requestCategoryTags({ group : 'category', parent : JSON.stringify( category )  }); // 获取category标签


        });


        this.props.store.productManagementInfo.request_modified_user();
        this.props.store.productManagementInfo.requestTags();
        this.props.store.productManagementInfo.requestLogs();
        this.props.store.productManagementInfo.requestLogFilter({ type : 'role' });
        this.props.store.productManagementInfo.requestLogFilter({ type : 'operate' });
        let height = document.documentElement.clientHeight;
            document.querySelector('.product-management').style.minHeight = height + 'px';

    }


    categoryArrayFn (){

        let categoryArray = [];
        let { categoryIcons } = this.state;
        let  category = mobx.toJS( this.props.store.productManagementInfo.get_category) || [];

        category.forEach((title, index) => {
             categoryIcons.forEach((item, i) =>{  if(item.title == title) categoryArray.push({ title , icon : item.icon })  })
        });

         return categoryArray;
 };




    render() {

    let productManagementList = mobx.toJS( this.props.store.productManagementInfo.get_productManagementList ),
        count = this.props.store.productManagementInfo.productManagemen_total;
     let tagsArray = mobx.toJS( this.props.store.productManagementInfo.get_tagsArray );
     let categoryArray = this.categoryArrayFn();


     let sub_categoryOptions =  mobx.toJS( this.props.store.productManagementInfo.get_sub_categoryOptions); 

     let modifiedUser = mobx.toJS( this.props.store.productManagementInfo.get_modifiedUser );


    var { edit_visiable, 
          category, page, limit,
           checkedList, fiterValues, order_icon, timeOrder_icon, 
          logs_visiable, bulk_visiable, 
          downloadProgressVisiable, menuMoe_visiable, percent,
          startTime,
          endTime
         } = this.state;

    const itemWidth = { width : 230, margin : '0 10px' };

        return (
            <div className="product-management">
                <div className="product-pic">
                    <img src="/assets/toBoom/images/designManager/productManagementPic.png" alt=""/>
                </div>
                
                <div className="product-menu">    

                    <div className="product-menu-btn"  onClick={ this.toggle_menuMoe } > <MenuMoe store={this.props.store} show={ menuMoe_visiable }  close={ x => {  this.setState({ menuMoe_visiable: false }) } }  />  </div>

                </div>

                <div className="product-theme">
                    <ul>
                        {
                            categoryArray.map((item , index) => {
                                return (
                                   <li key={ index } className={ category == item.title ? 'clickActive' : '' } onClick={ this.chooseNavHandler.bind(this, item.title ) } >
                                    <a href="javascript:;">
                                        <i  className={['iconfont', item.icon].join(' ')}   style={{ marginRight:10, fontSize:38 }} ></i>
                                        { item.title }
                                    </a>
                                  </li>
                                )
                            }) 
                        }
                    </ul>

                    <div className="operation-record" onClick={ this.viewLogs }>
                        <img src="/assets/toBoom/images/designManager/operationRecordBg.png" alt=""/>
                    </div>
                </div>


        

               <div className="product-filter-bar">
                   <TreeSelect style={itemWidth}
                            value={ fiterValues.category }
                            maxTagCount={ 5 }
                            dropdownStyle={{ maxHeight: 350, overflow: 'auto' }}
                            showCheckedStrategy={ SHOW_PARENT } 
                            treeCheckable={ true } 
                            allowClear  
                            placeholder="品类"
                            treeData={ sub_categoryOptions } 
                            onChange={ this.treeSelect_change.bind(this, 'category') }
                            onSelect={ this.onBlurBinder }
                    />
                    

   
              <TreeSelect style={itemWidth}
                        value={ fiterValues.profile }
                        maxTagCount={ 5 }
                        dropdownStyle={{ maxHeight: 350, overflow: 'auto' }}
                        showCheckedStrategy={ SHOW_PARENT } 
                        treeCheckable={ true } 
                        allowClear  
                        placeholder="廓形"
                        treeData={ tagsArray.profile.children } 
                        onChange={ this.treeSelect_change.bind(this, 'profile') }
                        onBlur={ this.onBlurBinder }
                        />



                 <TreeSelect style={itemWidth}
                        value={ fiterValues.part }
                        maxTagCount={ 5 }
                        dropdownStyle={{ maxHeight: 350, overflow: 'auto' }}
                        showCheckedStrategy={ SHOW_PARENT } 
                        treeCheckable={ true } 
                        allowClear  
                        placeholder="部件"
                        treeData={ tagsArray.part.children } 
                        onChange={ this.treeSelect_change.bind(this, 'part') }
                        onBlur={ this.onBlurBinder }
                            />


                       
                        <Select style={ itemWidth } placeholder="风格" allowClear  mode="multiple"   value={ fiterValues.style }   onChange={ this.select_change.bind(this, 'style') } >
                            {
                            tagsArray.style.children.map((item,index) => (
                                 <Option key={index} value={ item.value } > { item.title } </Option>
                                  ))
                            }
                         </Select>
                        <Select style={itemWidth} placeholder="衣长" allowClear  value={ fiterValues.clen }  mode="multiple"   onChange={ this.select_change.bind(this, 'clen') }    >
                            {
                            tagsArray.clen.children.map((item,index) => ( 
                               <Option key={index} value={ item.value } > {  item.title  } </Option> 
                            ))
                            }
                        </Select>
                            <Select mode="multiple"  style={itemWidth} placeholder="细节" allowClear  mode="multiple"   value={ fiterValues.details }  onChange={ this.select_change.bind(this, 'details') }   >
                                {  
                                tagsArray.details.children.map((item,index) => (
                                <Option key={index} value={item.value } > {  item.title  }</Option>
                                ))
                                }
                             </Select>

                        <Select style={itemWidth} placeholder="季度"  allowClear  mode="multiple"    value={ fiterValues.season }   onChange={ this.select_change.bind(this, 'season') }    >
                                {
                                    tagsArray.season.children.map((item,index) => ( 
                                         <Option key={index} value={ item.value } > { item.title } </Option> 
                                         ))
                                }
                         </Select>

                         <DatePicker
                                locale={locale}
                                disabledDate={ this.disabledStartDate }
                                showTime
                                format="YYYY-MM-DD"
                                value={ startTime }
                                placeholder="修改开始时间"
                                onChange={  this.onStartChange  }
                                onOpenChange={this.handleStartOpenChange}
                              //  getCalendarContainer={this.getCalendarContainer}
                                style={{ width:230, margin : '10px'}}
                            />

                              <i style={{ fontSize:16, fontWeight:600,}} > ~ </i>

                            <DatePicker
                                locale={locale}
                                disabledDate={this.disabledEndDate}
                                showTime
                                format="YYYY-MM-DD"   // YYYY-MM-DD HH:mm:ss
                                value={  endTime  }
                                placeholder="修改结束时间"
                                onChange={  this.onEndChange }
                                open={this.state.endOpen}
                                onOpenChange={this.handleEndOpenChange}
                              //  getCalendarContainer={this.getCalendarContainer}
                                style={{width:230,margin : '10px 0'}}
                            />


                          <Select style={itemWidth} placeholder="修改人"  allowClear   value={ fiterValues.updated_user }  onChange={ this.select_change.bind(this, 'updated_user') }   >
                              {
                                  modifiedUser.map(( item, index ) => {
                                         return (  <Option key={ index } value={ item.user_id } > { item.realname } </Option> )
                                  })
                              }
                             
                           </Select>

                           <Select style={itemWidth} placeholder="发布状态"  allowClear   value={ fiterValues.is_release }  onChange={ this.select_change.bind(this, 'is_release') }   >
                              <Option  value="0" > 未发布 </Option>
                               <Option  value="1" > 已发布 </Option>
                           </Select>


                             <Search
                                   onSearch={ this.search_action }
                                   placeholder="请输入图片名称"
                                   style={itemWidth} 
                                   value={ fiterValues.keywords } 
                                   onPressEnter={ this.search_onPressEnter } 
                                   onChange={ this.search_setValue }  
                                />

                           <button type="button" className="filter-button" onClick={ this.fire_search_action } > 搜索 </button>

                </div>


                <div className="product-content">

                    <div className="product-catalog">   

                     <div className="product-left">
                        <Checkbox indeterminate={this.state.indeterminate}  onChange={this.onCheckAllChange} checked={ this.state.checkAll }>
                          全选
                        </Checkbox>
                         </div>

                        <div className="product-right">

                            {/* <div className="product-search">
                                <input type="text" name="search" placeholder="search..."/>
                                <div className="product-search-pic"></div>
                            </div> */}

                             
                            <div className="product-buttons-group">
                                <button type="button" disabled={ checkedList.length ? false : true }  onClick={ this.release_Action.bind(this, 1) }  > 发布 </button>
                                <button type="button" disabled={ checkedList.length ? false : true } onClick={ this.release_Action.bind(this, 0) }  > 取消发布 </button>
                                <button type="button" disabled={ checkedList.length >= 2 ? false : true } onClick={ this.show_bulkEditor_binder }  > 批量编辑 </button>

                               {/*  暂时隐藏
                                  <Popconfirm title="确定删除？" onConfirm={  this.deleteItemBinder  }  onCancel={  this.deleteItem_cancel_Binde  }   >
                                    <button type="button" disabled={ checkedList.length ? false : true }  > 删除 </button>
                                 </Popconfirm>
                                */}
                            
                                <button type="button" disabled={ checkedList.length ? false : true } onClick={ this.itemDownLoadBinder }  > 导出 </button>
                             </div>

                             

                            
                            <div className="product-icon-btn">
                                {/* <i className="iconfont duoxuan"></i> */}
                                <Tooltip placement="bottom" title={"按最后修改时间排序"}>
                                    <i className={['iconfont', timeOrder_icon  == 'asc' ?  'shijianpaixufanxiang' : 'shijianpaixu'].join(' ')}   onClick={ this.orderBinder.bind(this, 'updated_at') } ></i>
                                </Tooltip>
                                <Tooltip placement="bottom" title={"按图片名称排序"}>
                                    <i className={['iconfont', order_icon == 'asc' ?  'mingchengpaixufanxiang' : 'mingchengpaixu'].join(' ')} onClick={ this.orderBinder.bind(this, 'title') } ></i>
                                </Tooltip>
                                {/* <i className="iconfont liebiaoxianshi"></i> */}
                            </div>
                        </div>
                    </div> 


                 
                      <CheckboxGroup  value={  checkedList  } onChange={ this.heckboxBinder } >
                            <div className="all-product">
                             {
                                 productManagementList.length > 0 ? 
                                    productManagementList.map((item, index)=>(
                                    <div  className="show-product-dec" key={index} >
                                    <Checkbox value={ item.id }></Checkbox>
                                        <div className="single-product">
                                            <div className="single-product-pic" onClick={ this.click_ImageForEdit.bind(this, item) }>
                                                <img src={ item.src[0].value  } alt=""/>
                                            </div>

                                            {/*   已发布和未发布   */}
                                            <div className="product-more-btn" style={{ display : item.is_release == 1 ? 'block' : 'none' }}>
                                                {  item.is_release == 1 ? '已发布' : '未发布'  }
                                            </div>

                                        </div>
                                    
                                        <p className="product-title">{ item.title }</p>
                                        <div className="delete-time">
                                            <i className="iconfont time"></i>
                                            <span>{ item.updated_at }</span>
                                        </div>

                                    </div>
                                    )) : (
                                         <div className="all-product-empty"> <p> 暂无数据。。。 </p> </div>
                                    )
                            }
                         </div>
                     </CheckboxGroup>

                </div>  

                <Row>
                    <Col span={ 24 } >
                            <Pagination 
                                className="product-pagination"
                                style={{ margin : '20px 0 20px' }}
                                pageSizeOptions={[ '10', '18', '20', '30', '40' ]}
                                hideOnSinglePage={ true }
                                current={ Number(page)}
                                pageSize={ Number(limit) }
                                showQuickJumper
                                showSizeChanger
                                total={ Number( count ) }  
                                showTotal={(total, range) => `总共 ${  Number( count ) } 条`}
                                onChange={(pageNumber) => {  // 页码改变的回调，参数是改变后的页码及每页条数
                                        this.setState({ page : pageNumber }, () => { 
                                                   var param = this.getParamsFromState()
                                                   this.props.store.productManagementInfo.getProductManagementData( param ); 
                                          });


                                   }} 
                                onShowSizeChange={(current,pageSize) => {   // pageSize 变化的回调 (改变每页显示条目数。)
                                        this.setState({ limit : pageSize, page : current },  () => { 
                                               var param = this.getParamsFromState()
                                                 this.props.store.productManagementInfo.getProductManagementData( param ); 

                                          })
                                  }}
                                />
                     </Col>
                </Row>


                    {/* 单个编辑弹框   */}
                    <EditorComponent 
                        store={ this.props.store }
                        conformBinder={ this.edit_conformBinder }
                        cancelBinder={ this.edit_cancelBinder }
                        visiable={ edit_visiable }
                    />

                    {/* 批量编辑弹框   */}
                    <BulkEditing 
                         parent={ this }
                         store={ this.props.store }
                         conformBinder={ this.bulk_conformBinder }
                         cancelBinder={ this.bulk_cancelBinder }
                         visiable={ bulk_visiable }
                     />

                     


                  {/*  查看操作记录弹窗 */}
                 <LogsComponent
                          store={ this.props.store }
                          conformBinder={ this.logs_conformBinder }
                          cancelBinder={ this.logs_cancelBinder }
                          visiable={ logs_visiable }

                  />

               {/* 下载进度弹窗弹窗 */}
                <DownLoadProgres
                    title="下载进度"
                    show={ downloadProgressVisiable  }
                    style={{ width : 616, height : 350 }}
                    onConfirm={ this.downloadProgress_confirm }
                    onCancel={  this.downloadProgress_cancel  }
                    percent={ percent }
                />

    
        </div>
        )
    }
}


