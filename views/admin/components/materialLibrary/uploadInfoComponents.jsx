import * as React from 'react';
import { Component }  from 'react';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';
import { SimilarModifier, ExamineModifier } from './modifyModal';
import { Row, Col, Button,Alert, Select, Table, Checkbox, Pagination, Modal, message } from 'antd';
import qs from 'qs';
const Option = Select.Option;




// 解压处理组件
@observer
export class UploadInfoComponent extends Component{
     state = {
        page :1 , 
        limit : 10,
     }

      // 查重、审核
 toExamine (record, componentIndex){

            if(componentIndex == 2){

                  this.props.store.MaterialStore.request_ConflictList({ page : 1, limit : 18, uptask_id : record.id }); // 冲突资源列表
                  this.props.store.MaterialStore.request_CompletedList({ type : 'conflict' });    // review 待审核 conflict 冲突 similarity 相似

             }else{ 

                  this.props.store.MaterialStore.request_ForApprovList({  page : 1, limit : 18, uptask_id : record.id });  // 待审核资源列表
                  this.props.store.MaterialStore.request_CompletedList({ type : 'review' });    // review 待审核 conflict 冲突 similarity 相似

             }


           // if(componentIndex != 1)  this.props.store.MaterialStore.setProperties('selectedValue', record.id ); 

            this.props.history.push( `${this.props.location.pathname}?${qs.stringify( { cParams : { page : 1, limit : 10, uptask_id : record.id } } )}` );

            this.props.store.MaterialStore.setProperties({  'componentIndex': componentIndex.toString(),  'selectedValue' :  record.id }); 

     }

     
       // 解压失败
     onUnzipFailed(record){
        let ref = Modal.warning({ 
                 title: '解压失败',
                 className: 'excep_model',
                 maskClosable : true,
                 content: record.exception,
                 footer : null
          })

     }


    
      /* 解压详情  【 已去掉 】
     onViewZipInfo = (record) => {
        let ref = Modal.warning({ 
                title: '解压详情',
                className: 'excep_model',
                maskClosable : true,
                content: record.exception,

                footer : null
        })

        //   this.props.store.MaterialStore.setViewZipInfoModel(true);  【暂时注释】
        //   this.props.store.MaterialStore.storeViewZipInfoID(record.id);
     }
     */


     
     onCancel_viewZip = () => {
        this.props.store.MaterialStore.setViewZipInfoModel(false);
        this.props.store.MaterialStore.storeViewZipInfoID('');
  }




   // 选择解压状态
  selectedStatus = (value) => {
    let  { pathname, search } = this.props.location,
          params = {
            zipParams : {
                page : 1,
                limit : 10
            } 
          };
     if (value){
            params.zipParams.status = value;
        }
      this.props.history.push( `${pathname}?${qs.stringify(params)}` );
  }




 componentWillReceiveProps(nextProps){
    const location = nextProps.location;
    const preLocation = this.props.location;
    /*通用处理antd导致的声明周期钩子调用BUG Begin*/
    if(preLocation.pathname + preLocation.search == nextProps.location.pathname + nextProps.location.search) return;
      const params = qs.parse(location.search.slice(1));
      const zipParams = params.zipParams;
      if( zipParams ){
          this.props.store.MaterialStore.request_CompackageList( zipParams );  // 请求列表数据
           this.setState({ limit : zipParams.limit, page : zipParams.page  });

      }
      


 }


  
  componentWillMount(){
           this.props.store.MaterialStore.request_CompackageList({ page : 1 , limit : 10 });   // 上传素材列表
  }



     render(){

        let { page, limit } = this.state;
        let  componentIndex = this.props.store.MaterialStore.getComponentIndex;
        let compackageList = mobx.toJS(this.props.store.MaterialStore.get_CompackageList);
        let count = this.props.store.MaterialStore.get_CompackageList_total;

        return (
             <div className="uploadInfo_table_wrapper" style={{ display : componentIndex == '1' ? 'block' : 'none'  }}>
                  <label className="selector-box" >解压状态 ：  
                          <Select style={{ width : 200 }} allowClear placeholder="选择状态" onChange={ this.selectedStatus } >
                             <Option value="pending">待处理</Option>
                             <Option value="processing">处理中</Option>
                             <Option value="failed">处理失败</Option>
                             <Option value="completed">处理完成</Option>
                        </Select> 
                   </label> 

             <Table 
              scroll={{ y: 500 }}
              columns={[
                      {
                       title: '压缩包',
                       dataIndex: 'filename',
                       width : '15%',
                       render : (text, record, index) => (
                         <div className="uploadInfo_nowrap" style={{ width : 160 }}>{ text }</div>
                       )
                      },
                      {
                       title: '详细信息',
                       dataIndex: 'exception',
                       width : '25%',
                       render : (text, record, index) => (
                         <div className="uploadInfo_nowrap"><i style={{ display:'inline-block', fontStyle: 'normal', marginRight : 12 }}>{ record.created_at }</i><i style={{ fontStyle: 'normal'}}>{ record.size }M</i>  </div>   
                       )
                      },
                      {
                       title: '状态',
                       dataIndex: 'status',
                       width : '15%',
                       render : (text, record, index) => {
                              switch(text){
                                case 'pending' :  return (<span>待处理</span>);
                                break;
                                case 'processing' : return (<span style={{ color : '#1890ff' }}>处理中</span>);
                                break;
                                case 'completed' :  return (<span style={{ color : '#36d066' }}>处理完成</span>);
                                break;
                                case 'failed' :  return (<span style={{ color : 'red' }}>处理失败</span>);
                                break;
                                default : '';
                                break
                              }

                         }
                      },

                      {
                        title : '总数量',
                        dataIndex : 'total',
                        width : '6%'
                      },
 
                      {
                        title : '成功数量',
                        dataIndex : 'total_success',
                        width :'6%'
                      },
                      {
                        title : '失败数量',
                        dataIndex : '',
                        width : '6%',
                        render : (text, record, index) => { return record.total - record.total_success }
                      },
                      {
                       title: '操作',
                       width : '25%',
                        render : (text, record, index) => {
                             return (
                                <div className="action-bar">
                                { record.status == 'failed' ? ( <Button onClick={ this.onUnzipFailed.bind(this,record) }>查看失败</Button>) : ''  }

                                { (record.status == 'completed' && ( record.type == 'conflict' || record.type == 'all' ) ) ? 
                                       (  <Button  style={{ display : record.status == 'failed' }}  
                                          onClick={ this.toExamine.bind(this, record, 2) }>查重</Button>) : ''  }

                                {  ( record.status == 'completed' && ( record.type == 'review' || record.type == 'all' )  ) ?
                                    ( <Button onClick={  this.toExamine.bind(this, record, 3) }>审核</Button> ) : '' }

                             </div> 
                             )
                           
                         }
                      }
                   ]} 
            pagination={{
                       current: Number( page ) , 
                       pageSize: Number( limit )  ,
                       showQuickJumper: true,
                       showSizeChanger: true,
                       total : Number( count ) | 0,
                   showTotal: function(total,pageSize){
                       return `共${Number( count )}条`
                   },
                   onChange:(pageNumber) => {  // 页码改变的回调，参数是改变后的页码及每页条数

                    let  { pathname, search } = this.props.location,
                            params = qs.parse(search.slice(1));
                            params.zipParams ? '' : params.zipParams = {};
                            params.zipParams.page = pageNumber;
                            params.zipParams.limit = limit;
                           this.props.history.push( `${pathname}?${qs.stringify(params)}`);

                   },
                   onShowSizeChange: (current,pageSize) => {   // pageSize 变化的回调 (改变每页显示条目数。)
                    let  { pathname, search } = this.props.location,
                            params = qs.parse(search.slice(1));
                            params.zipParams ? '' : params.zipParams = {};
                            params.zipParams.page = current;
                            params.zipParams.limit = pageSize;
                        this.props.history.push( `${pathname}?${qs.stringify(params)}`);

                
                      }
                   }}
                    dataSource={  compackageList  } 
                    rowKey={'id'}
                    /> 


               {/* 查看解压弹窗 start  */}         
                <Modal
                  width={700}
                  visible={ this.props.store.MaterialStore.getViewZipInfoModel }
                  onCancel={ this.onCancel_viewZip }
                  footer={null} >
                    <ViewZipInfoModel {...this.props}  />
                  </Modal>
                 {/* 查看解压弹窗 end  */}

             </div> )
      }  
}








// 查看解压弹窗组件  【 暂时去掉 】
@observer
export class ViewZipInfoModel extends Component {
     state = {
        page: 1,
        limit: 10,
        count: 0,
     }
      render(){
          let  { page, limit, count } = this.state;

          return (
              <div className="viewZipInfo">
                  <Row className="v-header">
                      <Col span={24}> <h4>0001压缩包</h4></Col>
                      <Col span={24}> <h6>已解压 36个文件  未解压4个文件</h6></Col>
                  </Row>

                 <Row style={{ marginBottom : 10, marginTop : 10 }}>
                     <Col span={5}>  
                         <Select style={{ width : 100 }} allowClear defaultValue="1" placeholder="选择状态" >
                            <Option value="1">名称升序</Option>
                            <Option value="2">名称降序</Option>
                        </Select> 
                       </Col>
                     <Col span={5}> 
                     <Select style={{ width : 100 }} allowClear defaultValue="1" placeholder="选择状态" >
                        <Option value="1">时间升序</Option>
                         <Option value="2">时间降序</Option>
                        </Select> 
                      </Col>
                     <Col span={5}> 
                       <Select style={{ width : 100 }} allowClear defaultValue="1" placeholder="选择状态" >
                            <Option value="1">已解压</Option>
                              <Option value="2">解压失败</Option>
                        </Select> 
                      </Col>
                 </Row>

                      <Table 
                         showHeader={false}
                            scroll={{ y: 400 }}
                            columns={[
                                    {
                                    title: '压缩包',
                                    dataIndex: 'zip',
                                    width : '15%'
                                    },
                                    {
                                    dataIndex: 'detail',
                                    width : '25%'
                                    },
                                    {
                                    title: '状态',
                                    dataIndex: 'state',
                                    width : '10%',
                                    }
                                ]} 
                           pagination={{
                                size : "small",
                                current: Number( page ), 
                                pageSize: Number( limit ),
                                total : Number(count) | 0,
                                showTotal: function(total,pageSize){
                                return `共${Number(count)}条`
                                },
                        onChange:(pageNumber) => {  // 页码改变的回调，参数是改变后的页码及每页条数

                       // this.props.history.push( this.props.location.pathname + `?limit=${limit}&page=${pageNumber}`);

                      }
                 
                   }}
                    dataSource={ [] } 
                    rowKey={'id'}
                    /> 
               </div>
          )
      }
}






// 相似检测 、待审核组件
@observer
export class UploadStatusComponent extends Component {
      state = {
        page : 1,
        limit : 18,
        indeterminate: false,
        checkAll: false,
        seletedRowsArray : []
      }

      clickOnImage = (record) => {
                let componentIndex = this.props.store.MaterialStore.componentIndex;
                this.props.store.MaterialStore.setProperties('seletedRows',[ record.id ]);
                if( componentIndex == '2'){
                    this.props.store.MaterialStore.setProperties('modalVisible2',true);
                    this.props.store.MaterialStore.setProperties('oldImage',record);
                }else if( componentIndex == '3' ){
                    this.props.store.MaterialStore.request_flatData(record.id);
                    this.props.store.MaterialStore.setProperties('modalVisible3',true);
                }  

        }


      onEditeAction(){ 
            this.props.store.MaterialStore.setProperties('modalVisible3',false);
            this.props.form.resetFields();
      }


      similarModifier_Close = () => {
          this.props.store.MaterialStore.setProperties('modalVisible2',false);  
          this.props.form.resetFields();
      }
      

     onCheckAllChange = (e) => {
                if(e.target.checked){
                    let filesFordeal = mobx.toJS(this.props.store.MaterialStore.get_FilesFordeal);
                    let dataArray = filesFordeal.map((item) => {  return item.id });
                    this.setState({ seletedRowsArray : dataArray })
                }else{
                    this.setState({ seletedRowsArray : [] })
                }
            this.setState({
                indeterminate: false,
                checkAll: e.target.checked,
            });

        }


    updateCheckState(seletedRows){  
            let filesFordeal = mobx.toJS(this.props.store.MaterialStore.get_FilesFordeal);
            this.setState({
                indeterminate: !!seletedRows.length && (seletedRows.length < filesFordeal.length),
                checkAll: seletedRows.length === filesFordeal.length,
            });    
        }

      onChange = (seletedRows) => {
           this.updateCheckState(seletedRows);
           this.setState({ seletedRowsArray : seletedRows })
      }



selectedAction = (value) => {
    let  { pathname, search } = this.props.location,
            params = {
                cParams : {
                page : 1,
                limit : 18
              } 
            };
        if (value){
                params.cParams.uptask_id = value;
           }else{
                params.cParams = { page : 1, limit : 18 }
           }

     if(this.props.store.MaterialStore.selectedValue) this.props.store.MaterialStore.setProperties('selectedValue',undefined);  // 清除 来之解决列表的审查点击 
       this.setState({ selectedVal : value });
       this.props.history.push( `${pathname}?${qs.stringify(params)}` );
}




 // 删除
 deleteAction = () => {
          let componentIndex = this.props.store.MaterialStore.componentIndex;
          let { seletedRowsArray } = this.state;
          let  { pathname, search } = this.props.location,
                params = qs.parse(search.slice(1));
                let cParams = params.cParams ? params.cParams : { page : 1, limit :18 };

          this.props.store.MaterialStore.request_destroy({ ids : seletedRowsArray } , () => {
                      message.success('删除成功！', 2, () => {
                        this.setState({ seletedRowsArray : [], checkAll: false,  indeterminate: false });
                                    if( componentIndex == 2 ){
                                        this.props.store.MaterialStore.request_ConflictList( cParams ); // 冲突资源列表
                                    }else if( componentIndex == 3){
                                        this.props.store.MaterialStore.request_ForApprovList( cParams );   // 待审核资源列表
                                    }  
                      })

            //  this.props.history.push( `${pathname}?${qs.stringify(params)}` );
         }); 
 }



 forApprovalSubmit = (data) => {

           let componentIndex = this.props.store.MaterialStore.componentIndex;
           let  { pathname, search } = this.props.location,
                     params = qs.parse(search.slice(1));

                  let cParams = params.cParams ? params.cParams : { page : 1, limit :18 };


            this.props.store.MaterialStore.reviewSave(data,() => {
                     this.props.store.MaterialStore.setProperties({ 'modalVisible3' : false, 'seletedRows' : [] });
                     if( componentIndex == 2 ){
                        this.props.store.MaterialStore.request_ConflictList( cParams ); // 冲突资源列表
                     }else if( componentIndex == 3){
                        this.props.store.MaterialStore.request_ForApprovList( cParams );   // 待审核资源列表
                     }
                   //  this.props.history.push(`${pathname}?${qs.stringify(params)}`);

            })


 }


componentWillReceiveProps(nextProps){
       const location = nextProps.location;
       const preLocation = this.props.location;
    /*通用处理antd导致的声明周期钩子调用BUG Begin*/
    if(preLocation.pathname + preLocation.search == nextProps.location.pathname + nextProps.location.search) return;
      const params = qs.parse(location.search.slice(1));
      const cParams = params.cParams;
      let componentIndex = this.props.store.MaterialStore.componentIndex;
       if(cParams){
           if( componentIndex == 2 ){
                this.props.store.MaterialStore.request_ConflictList( cParams ); // 冲突资源列表
           }else if( componentIndex == 3){
                this.props.store.MaterialStore.request_ForApprovList( cParams );   // 待审核资源列表
           }
         this.setState({ limit : cParams.limit, page : cParams.page  });
      } 
   
}




     render(){

        let filesFordeal = mobx.toJS(this.props.store.MaterialStore.get_FilesFordeal) ;
        let count = this.props.store.MaterialStore.get_FilesFordeal_total;
        let completedList = mobx.toJS(this.props.store.MaterialStore.get_CompletedList);
        let componentIndex =  this.props.store.MaterialStore.getComponentIndex;
        let selectedValue =  this.props.store.MaterialStore.get_SelectedValue;  // 来之解决列表的审查点击 
        let { page, limit, indeterminate, checkAll, seletedRowsArray, selectedVal } = this.state;


        console.log('filesFordeal', filesFordeal);


           return (
               <div style={{ width : '100%' }}   style={{ display : componentIndex != 1 ? 'block' : 'none'  }}  >
                  <Row className="uploadStatus-wrapper">
                     <Col span={24} style={{ marginBottom : 10 }}>
                          <Row>
                            <Col span={1}>
                            <Button type="danger" onClick={ this.deleteAction } disabled={ seletedRowsArray.length ? false : true } style={{ marginTop : '5px' }}>删除</Button>
                            </Col>
                            <Col span={4}>
                              <Select style={{ width : 200, marginTop : '5px' }} allowClear  value={ selectedValue ? selectedValue : selectedVal }  placeholder="选择压缩包" onChange={ this.selectedAction } >
                                {
                                      completedList.map((item, index) => ( <Option key={index} value={ item.id }>{ item.filename }</Option>))
                                }
                                <Option value="">无</Option>
                                </Select> 
                                 </Col>
                                 <Col span={4}>
                                    {
                                         componentIndex == 2
                                         ? <p style={{ display: count > 0 ? 'block' : 'none', lineHeight : '39px', margin:0 }}  > 共有 <i style={{ fontStyle: 'normal', color : '#1890ff' }}>{count}</i> 张重复，请调整修改 </p>   
                                         :  <p style={{ display: count > 0 ? 'block' : 'none', lineHeight : '39px', margin:0 }}  > 共有 <i style={{ fontStyle: 'normal', color : '#1890ff' }}>{count}</i> 张待完善标签，请调整修改 </p>   
                                    }
                                    </Col>
                                 <Col span={5}>
                                    <Alert message={`已经选择 ${seletedRowsArray.length} 项目`}   style={{ width : 200, display : seletedRowsArray.length ? 'block' : 'none'}} type="info" showIcon />
                                    </Col>
                                </Row>
                            </Col>
                       <Col span={24}>
                       <div style={{ borderBottom: '1px solid #E9E9E9', paddingBottom : '4px' }}>
                            <Checkbox indeterminate={indeterminate}  onChange={this.onCheckAllChange} checked={checkAll} > 全选</Checkbox>
                        </div>
                         <Checkbox.Group style={{ width: '100%'}} value={ seletedRowsArray } onChange={this.onChange} >
                           <div  style={{ width: '100%' ,maxHeight : 550, overflowY : 'scroll'}}>
                            <ul className="uploadStatus-ul">
                                {
                                    filesFordeal.length > 0 ? 
                                     filesFordeal.map((item, index) => {
                                            return (
                                                <li key={index}> 
                                                 <figure>   
                                                     <span className="uploadStatus-img-box"  onClick={ this.clickOnImage.bind(this,item) } >
                                                            <img src={ item.preview ? item.preview.cpath : '' }   alt="" />   
                                                        </span>
                                                        <Checkbox value={ item.id }><em className="uploadStatus-img-title"> { item.title } </em></Checkbox>
                                                        <figcaption>{ item.updated_at  }</figcaption> 
                                                    </figure>   
                                                </li>
                                            )
                                     }) 
                                     : (
                                         <li className="uploadStatus-ul-empty">暂无数据</li>
                                     )
                                }
                             </ul>
                         </div>
                        </Checkbox.Group>

                      
                         <Row>
                            <Col span={ 10 } offset={ 6 }>
                                <Pagination style={{ display :  filesFordeal.length > 0 ? 'block' : 'none' }}
                                            current={ Number( page ) } 
                                            pageSize={ Number( limit ) }
                                            showQuickJumper={true}
                                            showSizeChanger={true}
                                            total={Number(count) | 0} 
                                            showTotal={function(total,pageSize){
                                                return `共${ Number(count) }条`
                                            }}
                                            onChange={(pageNumber) => {  // 页码改变的回调，参数是改变后的页码及每页条数
                                                let  { pathname, search } = this.props.location,
                                                        params = qs.parse(search.slice(1));
                                                 let selectedValue =  this.props.store.MaterialStore.selectedValue,
                                                         componentIndex =  this.props.store.MaterialStore.componentIndex;

                                                    params.cParams ? "" : params.cParams = {  page : 1, limit : 18 };
                                                    params.cParams.page = pageNumber;

                                                    if(componentIndex != 1 && selectedValue ) params.cParams.uptask_id = selectedValue;
                                                    
                                                    this.props.history.push( `${pathname}?${qs.stringify(params)}` );


                        
                                            }} 
                                            onShowSizeChange={(current,pageSize) => {   // pageSize 变化的回调 (改变每页显示条目数。)
                                                let  { pathname, search } = this.props.location,
                                                     params = qs.parse(search.slice(1));
                                                let selectedValue =  this.props.store.MaterialStore.selectedValue,
                                                    componentIndex =  this.props.store.MaterialStore.componentIndex;

                                                        params.cParams ? "" : params.cParams = {  page : 1, limit : 18 };
                                                        params.cParams.limit = pageSize;

                                                     if(componentIndex != 1 && selectedValue ) params.cParams.uptask_id = selectedValue;

                                                    this.props.history.push( `${pathname}?${qs.stringify(params)}` );

                                            }}
                                    /> 
                                    
                                </Col>
                             </Row>            

                 </Col>
               </Row>


                {/* 相似检测弹窗 start */}
                    <SimilarModifier  store={ this.props.store }  location={ this.props.location }  onClose={ this.similarModifier_Close } />
                    {/* 相似检测弹窗 end */}


                   {/* 待审核弹窗 start */}
                   <ExamineModifier {...this.props} 
                                          submitAction={ this.forApprovalSubmit }
                                          visiable={ this.props.store.MaterialStore.getModalVisible3 } 
                                          onClose={ this.onEditeAction.bind(this) }  />
                   {/* 待审核弹窗 end */}

            </div> )
     }
}








