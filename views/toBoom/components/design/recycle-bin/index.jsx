import React,{Fragment} from 'react';
import * as mobx from 'mobx-react';
import * as defaultMobx from 'mobx';
import { Modal }  from '@/components/modal';
import { MenuMoe } from '@/components/menu';
// import LeftPublicContent from '../../common/left-public-content';

import { Table , Pagination , Row, Col, Checkbox, message, Popconfirm, Tooltip  } from 'antd';
const CheckboxGroup = Checkbox.Group;


import axios from 'axios';




@mobx.observer
export default class DesignRecycleBin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props,
            //recoveryId: '',
            showModal_clean : false,
            temperaryId: '',
            recycleShow: undefined,
            show: false,
            page : 1,
            limit : 18,
            selectedRowKeys : [],
            listStype : '1', // 是以图片列表或表格列表展现数据  1 == 图片列表 ， 2 == 表格列表
            checkedList: [],
            indeterminate: false,
            checkAll: false,
            order : undefined,  // 时间排序 或 字母排序 【  首字母传：title  最后修改时间传：updated_at  】 
            order_type :  'asc',   //   desc   asc 
            order_icon : 'asc',
            timeOrder_icon : 'asc',
            showModal_r: false,
            //is_tableIsPic: true 
        }
    }
    menuClick() {
        this.setState({
            show: true
        })
    }
    componentDidMount() {
        this.props.store.recycleBinInfo.getRecycleBinListData({limit:18,page:1});
          //目的是为了 点击recycle-more-btn按钮外 ，点击其它地方（恢复 彻底删除）这个弹窗都给隐藏起来。
          document.body.addEventListener('click',this.hideAllMenu);

    }


    hideAllMenu=()=> {
        this.setState({
            recycleShow: undefined,
         })
    }
    stopPropagation(e) {
        e.nativeEvent.stopImmediatePropagation();
    }
  
    // 显示更多操作
    handRecycleMoreBtn(id,index) {
       if(  this.state.recycleShow == index ){
               this.setState({
                    recycleShow: undefined,
                })
       }else{
          this.setState({
            recycleShow: index,
          })  
       }
   

    }

    
     /* 恢复作品 start  */ 
    passRecoveryId(id) {
        this.setState({
            temperaryId: id,
            showModal_r: true,
            recycleShow: undefined
            
        })
    }


    async handleRecovery() {
        let request = await axios.put(`api/toboom/works/recycle-restore/${this.state.temperaryId}`),
           data = request.data;
        if( data.status_code == 200) {
            let { order, order_type, limit, page } = this.state,
                  param = { limit, page };
              if( order != undefined ){  param.order = order;  param.order_type = order_type;}
               this.props.store.recycleBinInfo.getRecycleBinListData( param , this.handleCancelRecovery );
               console.log('恢复成功');
               this.setState({
                    showModal_r: false
               })

        }else{
              console.log('恢复失败')
        }
    }
    
    handleCancelRecovery() {
        this.setState({
            temperaryId: '',
            showModal_r: false,
            recycleShow : undefined
        })
    }

 /* 恢复作品 end */ 


     /* 彻底删除作品 start  */ 
    passDeleteId(id) {
        this.setState({
            temperaryId : id,
            showModal_c: true,
            recycleShow: undefined
        })
    }


    async deleteHandler() {
        let request = await axios.delete(`/api/toboom/works/delete/${this.state.temperaryId}`),
            data = request.data;
        if(data.status_code == 200) {
            let { order, order_type, limit, page } = this.state,
                param = { limit, page };
            if( order != undefined ){  param.order = order;  param.order_type = order_type;}
           this.props.store.recycleBinInfo.getRecycleBinListData( param, this.handleCancelDelete );
            console.log('删除成功');
        } else {
            console.log('删除失败');

        }
    
    }

    handleCancelDelete = () => {
        this.setState({
            temperaryId : '',
            showModal_c: false,
            recycleShow : undefined

        })
    }

 /* 彻底删除作品 end  */ 






 /* 清空回收站 start   */ 

 handleCancelClean = () => {
      this.setState({
          showModal_clean: false,
          recycleShow : undefined
      })
 }

cleanHandler = ( ) => {
    this.props.store.recycleBinInfo.clearItemsAction(() => { 
        this.setState({ recycleShow : undefined });
        let { order, order_type, limit, page } = this.state,
            param = { limit, page };
    if( order != undefined ){  param.order = order;  param.order_type = order_type;}
     this.props.store.recycleBinInfo.getRecycleBinListData( param , this.handleCancelClean );     // 请求列表数据 
    
     })
}

 /* 清空回收站 end   */ 


// 清空回收站
clearItemsAction = (  ) => {
    var count = this.props.store.recycleBinInfo.get_recycleBinCount;
    if( count ){
        this.setState({  showModal_clean: true })
    }
}


        
   // 图片列表、表格列表多选切换  1 == 图片列表 ， 2 == 表格列表
   switchListStyle = () => {
    let { listStype } = this.state;
    if( listStype == '1' ){
         this.setState({
            selectedRowKeys : [],
            listStype : 2,
            recycleShow : undefined,
            //is_tableIsPic: false
         })
    }else{
        this.setState({
            checkedList: [],
            indeterminate: false,
            checkAll: false,
            listStype : 1,
            recycleShow : undefined,
            //is_tableIsPic: true
         })
    }  

}




// 排序  时间排序 或 字母排序 【  首字母传：title  最后修改时间传：updated_at  】
orderBinder(type){

    let { order_icon, timeOrder_icon  } = this.state,
          newState = { order :  type , recycleShow : undefined };
       if( type == 'title' ){
             order_icon == 'asc' ?  newState.order_type = 'desc' : newState.order_type = 'asc';
             newState.order_icon =  newState.order_type
       }
       if( type == 'updated_at'){
              timeOrder_icon == 'asc' ?  newState.order_type = 'desc' : newState.order_type = 'asc';
              newState.timeOrder_icon =  newState.order_type

       }

     this.setState( newState, () => {
         let { order, order_type, limit, page } = this.state,
           param = { limit, page };
           if( order != undefined ){  param.order = order;  param.order_type = order_type;}
           this.props.store.recycleBinInfo.getRecycleBinListData(param, () => {  this.setState({ 
                                          selectedRowKeys : [],
                                          checkedList: [],
                                          indeterminate: false,
                                          checkAll: false
                                       })   
                                })

     });

}


     /* 图片列表、表格列表多选 start  */ 
     selectedPicItem = (checkedList) => {
           var { recycleBinList = [] } = defaultMobx.toJS(this.props.store.recycleBinInfo);
            this.setState({
                checkedList,
                indeterminate: !!checkedList.length && (checkedList.length < recycleBinList.length),
                checkAll: checkedList.length === recycleBinList.length,
                recycleShow : undefined
              });
             
         }
    
         onCheckAllChange  = ( e ) => {
            var { recycleBinList = [] } = defaultMobx.toJS(this.props.store.recycleBinInfo),
                 checkedList = recycleBinList.map(( item, index ) => item.id );
    
            this.setState({
                checkedList: e.target.checked ? checkedList : [],
                indeterminate: false,
                checkAll: e.target.checked,
                recycleShow : undefined
              })
         }
    
         onSelectChange = (selectedRowKeys ) => {
              this.setState({ selectedRowKeys })  
         }
    
       /* 图片列表、表格列表多选 end  */ 

    //鼠标移入作品时 ,才显示 右上角的按钮图标.
    handleMouseEnterPic(object, index, event) {
        event.currentTarget.querySelector('.recycle-more-btn').style.display = 'block';
    }
    //鼠标移出作品时 , 就隐藏掉 右上角的按钮图标.
    handleMouseLeavePic(object, index, event) {
        event.currentTarget.querySelector('.recycle-more-btn').style.display = 'none';
    }



   
    render() {
        var { recycleBinList } = defaultMobx.toJS(this.props.store.recycleBinInfo);
        var count = this.props.store.recycleBinInfo.get_recycleBinCount;
        var {  page, limit, listStype, selectedRowKeys, checkedList, indeterminate, checkAll,order_icon, timeOrder_icon, recycleShow } = this.state;

        //let { showModal_r } = this.state;
        //console.log(recycleBinList);

        return (
                <div className="recycle-bin">

                    <div className="recycle-bin-pic">
                            <img src="/assets/toBoom/images/designManager/RecycleBinPic.png" alt=""/>
                    </div>  
            
                    <div className="recycle-menu design-menu">    
                            <div className="recycle-menu-btn" onClick={this.menuClick.bind(this)}>
                                <img src="/assets/toBoom/images/designManager/menubtn.png" alt=""/>
                                <MenuMoe show={this.state.show} close={x=> {this.setState({show: false}) }} store={this.props.store} />
                            </div>
                    </div>

                    <div className="delete-content">
                        <div className="delete-catalog"> 
                         {/* style={{ visibility : ( listStype == '1' && recycleBinList.length > 0 )  ? 'visible' : 'hidden' }} */}
                         <div className="delete-left"  style={{  visibility:'hidden' }} >
                            <Checkbox
                                className="ant-checkbox-custom-style"
                                indeterminate={  indeterminate }
                                onChange={this.onCheckAllChange}
                                checked={  checkAll  }
                            >
                            <em style={{ fontFamily : 'uzi', fontSize : 14, color : '#000' }}>  全选 </em>
                            </Checkbox>
                            </div>


                            <div className="delete-right">
                                {/* <div className="delete-search">
                                    <input type="text" name="search" placeholder="search..."/>
                                    <dir className="delete-search-pic"></dir>
                                </div> */}
                                <div className="recycle-icon-btn">
                                    <Tooltip placement="bottom" title={"清空回收站"}>
                                        <i style={{ cursor : 'pointer' }} onClick={ this.clearItemsAction }  className="iconfont shejiye-shanchu"></i>
                                    </Tooltip>
                                    <Tooltip placement="bottom" title={"按最后修改时间排序"}>
                                        <i className={['iconfont', timeOrder_icon  == 'asc' ?  'shijianpaixufanxiang' : 'shijianpaixu'].join(' ')}   onClick={ this.orderBinder.bind(this, 'updated_at') } ></i>
                                    </Tooltip>
                                    <Tooltip placement="bottom" title={"按名称排序"}>
                                        <i className={['iconfont', order_icon == 'asc' ?  'mingchengpaixufanxiang' : 'mingchengpaixu'].join(' ')} onClick={ this.orderBinder.bind(this, 'title') } ></i>
                                    </Tooltip>
                                    {/* <Tooltip placement="bottom" title={this.state.is_tableIsPic ? "列表显示" : "图片显示"}>
                                        <i className={`iconfont ${this.state.is_tableIsPic ? 'liebiaoxianshi' : 'tupianxianshi'}`}  onClick={ this.switchListStyle }></i>
                                    </Tooltip> */}
                                      {/* 暂时隐藏，待下一版本  2018-11-26
                                    <Tooltip placement="bottom" title={ listStype =='1' ? "列表显示" : "图片显示"}>
                                        <i className={`iconfont ${listStype == '1' ? 'liebiaoxianshi' : 'Fill'}`}  onClick={ this.switchListStyle }></i>
                                    </Tooltip>
                                     */}
                                </div>
                            </div>
                        </div> 


                   {/* 图片展示列表  start */} 
                   <CheckboxGroup onChange={ this.selectedPicItem  } value={ checkedList } style={{ display : listStype == '1' ? 'block' : 'none' }} >
                    <div className="all-recycle">
                        { recycleBinList && recycleBinList.map((item,index)=>(
                            <div  className="show-recycle-dec cursor-style" key={item.id}  >

                                {/* <Checkbox value={ item.id } className="show-modify-checkbox ant-checkbox-custom-style"></Checkbox> */}

                                <div
                                    className="single-recycle" 
                                    onMouseEnter={this.handleMouseEnterPic.bind(this,item,index)}
                                    onMouseLeave={this.handleMouseLeavePic.bind(this,item,index)}
                                >
                                        <div className="single-recycle-pic">     
                                            <img src={item.preview_url} alt=""/>
                                        </div>

                                        <div  
                                            className="recycle-more-btn" 
                                            style={{display:'none'}}
                                            onClick={this.handRecycleMoreBtn.bind(this,item.id, index)} 
                                        >
                                            <img src="/assets/toBoom/images/designManager/moreBtn.png" alt=""/>
                                        </div>

                                        <div  className={`detailed-recycle-btn ${ recycleShow == index ? 'recycle-show' : '' }`}  >
                                            <p  className="recycle-recovery"  onClick={this.passRecoveryId.bind(this,item.id)}>恢复 </p>
                                            <p className="recycle-thoroughDelete"  onClick={this.passDeleteId.bind(this, item.id)}> 彻底删除</p>                      
                                        </div>
                                </div>
                                <p className="recycle-title">{item.title}</p>
                                <div className="delete-time">
                                    <i className="iconfont time"></i>
                                    <span>{item.updated_at}</span>
                                </div>
                            </div>
                        ))
                        }
                    </div>
                    </CheckboxGroup>

                    <Row style={{ display : listStype == '1' ? 'block' : 'none', margin: '50px 0 30px 0' }}>
                      <Col span={ 10 }> 
                          <Pagination 
                            showQuickJumper
                            showSizeChanger
                            hideOnSinglePage
                            total={count} 
                            current={ page }
                            pageSize={ limit }
                            //pageSizeOptions={['18','10', '20', '30', '40']}
                            showTotal={function(total,pageSize){
                                return `共${Number(count)}条`
                            }} 
                            onChange={ ( pageNumber ) => {

                                this.setState({ page : pageNumber }, () => {
                                    this.props.store.recycleBinInfo.getRecycleBinListData({ 
                                        page :pageNumber,  
                                        limit : this.state.limit
                                    });
                                }) 

                            }}
                            onShowSizeChange={(current, pageSize ) => {
                                //debugger
                                this.setState({ limit : pageSize, page: 1 }, () => {
                                    this.props.store.recycleBinInfo.getRecycleBinListData({ 
                                        limit : pageSize ,
                                        page: 1
                                    });
                                })

                            }}
                            />
                         </Col>
                    </Row>     
                 {/* 图片展示列表  end */}


                    {/* 表格列表  start */}
                    <Table className="ant-table-custom-style ant-checkbox-custom-style"
                           style={{ display : listStype == '2' ? 'block' : 'none' }}
                           rowSelection={ {
                                selectedRowKeys,
                                onChange: this.onSelectChange,
                              }} 
                             columns={[ 
                                    {
                                        title: '文件名称',
                                        dataIndex: 'title',
                                        width : '50%'
                                        },
                                         {
                                        title: '最后修改日期',
                                        dataIndex: 'updated_at',
                                        width : '50%'
                                        }
                                  ]
                                } 
                                rowKey={'id'}
                                dataSource={ recycleBinList || [] } 
                                scroll={{  y : 550  }}
                                pagination={{
                                         current: Number(page), 
                                         pageSize: Number(limit),
                                         showQuickJumper: true,
                                         showSizeChanger: true,
                                         total :  Number(count),
                                     showTotal: function(total,pageSize){
                                         return `共${Number(count)}条`
                                     },
                                     onChange:(pageNumber) => {  // 页码改变的回调，参数是改变后的页码及每页条数

                                        this.setState({ page : pageNumber }, () => {
                                            this.props.store.recycleBinInfo.getRecycleBinListData({ 
                                                page :pageNumber,  
                                                limit : this.state.limit
                                            });
                                        }) 

                                     },
                                     onShowSizeChange: (current,pageSize) => {   // pageSize 变化的回调 (改变每页显示条目数。)

                                            this.setState({ limit: pageSize, page: 1 }, () => {
                                                this.props.store.recycleBinInfo.getRecycleBinListData({ 
                                                    limit : pageSize,
                                                    page: 1
                                                });
                                            })

                                        }
                                     }}
                              
                                />    
                        {/* 表格列表  end */}




                </div>  
                 {/* end of delete-content */}



                    <Modal 
                        title="彻底删除"
                        show={this.state.showModal_c }
                        onCancel={ this.handleCancelDelete  }
                        onCross={ this.handleCancelDelete }
                        handleCross = {true}
                        onConfirm={this.deleteHandler.bind(this)}>
                        {/* <div  style={{ textAlign : 'center', height : 50, lineHeight : '50px' }} >该作品将无法恢复,是否继续?</div> */}
                        <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                            {/* <i className="iconfont jinggaotubiao" style={{fontSize:45}}></i> */}
                            <div style={{width:64,height:56}}>
                                <img src="/assets/toBoom/images/warn.png" alt="" style={{width:'100%',height:'100%'}}/>
                            </div>
                            <span style={{marginLeft:30,fontSize:18}}>
                                该作品删除后将无法恢复, 是否继续?
                            </span>
                        </div>
                    </Modal>


                    {/* 点击批量删除按钮 后 的 提示框  start */}
                    <Modal 
                        title="清空回收站"
                        show={ this.state.showModal_clean }
                        onCancel={ this.handleCancelClean  }
                        onCross={ this.handleCancelClean  }
                        handleCross = {true}
                        onConfirm={this.cleanHandler.bind(this)}>
                        <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                                    <div style={{width:64,height:56}}>
                                        <img src="/assets/toBoom/images/warn.png" alt="" style={{width:'100%',height:'100%'}}/>
                                    </div>
                                    <span style={{marginLeft:30,fontSize:18}}>
                                        清空后，将无法恢复。请问是否继续清空 ？
                                    </span>
                        </div>
                    </Modal>
                    {/* 点击批量删除按钮 后 的 提示框  end */}



                    <Modal
                        title="恢复"
                        show={this.state.showModal_r }
                        onConfirm={this.handleRecovery.bind(this)}
                        onCancel={this.handleCancelRecovery.bind(this)}
                        onCross={ this.handleCancelRecovery.bind(this)  }
                        handleCross = {true}
                    >
                        <div  style={{ textAlign : 'center', fontSize: 18 }}>将该作品从回收站中还原</div>
                    </Modal>
            </div>
      
        )
    }
}
