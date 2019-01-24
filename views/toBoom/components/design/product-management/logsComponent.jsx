import React,{ Fragment, Component } from 'react';
import { DatePicker, Modal, Row, Col, Table,Input, Select } from 'antd';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import locale from 'antd/lib/date-picker/locale/zh_CN';

const Search = Input.Search;
const {  RangePicker } = DatePicker;
const Option = Select.Option;

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "/";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}




@observer
export default class LogsComponent extends Component {
       state = {
            keywords: '',
            role_id : undefined,
            operate_type : undefined,
            page : 1,
            limit : 10,
            created_start : '',
            created_end :  '',
           // beToued : undefined,  // 记录时间选择器是否已选
       }

       defaultState = null;


       getParamsFromState(){
             let param = Object.assign(this.state,  {}, true);
                 for( let key in param ){
                    param[ key ] ? '' : delete param[ key ]  
                 }  
            return param;
       }


      cancelHandler = () => {
             this.props.cancelBinder();
             this.setState(Object.assign(this.defaultState, {}, true) )

       }


       search_action = () => {
          this.setState({ page : 1 }, () => {
            let param =  this.getParamsFromState();
            this.props.store.productManagementInfo.requestLogs( param )
          })
       
       }


       search_onPressEnter = () => {
             this.search_action() 
       }

       search_setValue = ( e ) => {
             this.setState({ keywords :  e.target.value })
       }

       select_change( type,value ){
                 let selectedData = { page : 1 };
                      selectedData[type] = value;
            this.setState( selectedData , () => {
                let param = this.getParamsFromState();
                    this.props.store.productManagementInfo.requestLogs( param )
            }); 
       }



       datepicker_change = ( date, dateString ) => {

        //    let b = dateString.every((item,index,arr) =>( item != '' ) ),
        //        dateValues =  {created_start : getNowFormatDate(), created_end : getNowFormatDate(), beToued :  undefined };
        //    if( b ){
        //        dateValues = {created_start : dateString[0], created_end : dateString[1], beToued :  dateString[0]  }
        //    }

           this.setState( {created_start : dateString[0], created_end : dateString[1], page : 1 }, () => {
                 let param =  this.getParamsFromState();
                 this.props.store.productManagementInfo.requestLogs( param )
           }) 

       }



       componentDidMount(){ 
            this.defaultState = Object.assign(this.state, {}, true) 
          }

    

      render(){

        let logsArray = mobx.toJS( this.props.store.productManagementInfo.logsArray ),
            rolesArray = mobx.toJS(  this.props.store.productManagementInfo.get_rolesArray ),
            operateArray = mobx.toJS(  this.props.store.productManagementInfo.get_operateArray ),
            count = this.props.store.productManagementInfo.get_logs_total;
            logsArray.forEach(( item,index ) => {  item.key = index });

           const dateFormat = 'YYYY/MM/DD';
           let { keywords, role_id, operate_type, page, limit , created_start, created_end } = this.state;
           let visiable = this.props.visiable;

    

            return (
                 <Modal
                    title="操作记录"
                    className="logs-modal-style"
                    maskClosable={ false }
                    width={ 1400 }
                    visible={ visiable }
                    onCancel={ this.cancelHandler }
                    footer= {null } 
                 >
    
                <Row>
                    <Col span={24} style={{ marginBottom : 20 }}>

                        <Select  style={{ width : 200, marginRight : 10 }} placeholder="账号权限" allowClear  value={ role_id }   onChange={ this.select_change.bind(this, 'role_id') }  >
                            {
                                 rolesArray.map((item,index) => (
                                    <Option key={ index }  value={ item.id } > { item.title } </Option>
                                 ))
                            }

                        </Select>

                                              
                        <Select  style={{ width : 200,  marginRight : 10 }} placeholder="操作类型" allowClear   value={ operate_type } onChange={ this.select_change.bind(this, 'operate_type') }   >
                          {
                              operateArray.map((item, index) => (
                                <Option key={ index }  value={ item.key } > { item.value } </Option>
                              ))
                          }
                        </Select>

                     <RangePicker
                           // value={[moment( created_start, dateFormat), moment( created_end, dateFormat)]}
                          // defaultValue={[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]}
                            format={ dateFormat }
                            onChange={ this.datepicker_change }
                            locale={ locale }
                            />

                          <Search
                                  onSearch={ this.search_action }
                                   placeholder="账号/账号名称/成品名称"
                                   style={{ width : 200,  marginLeft : 10 }} 
                                   value={ keywords } 
                                   onPressEnter={ this.search_onPressEnter } 
                                   onChange={ this.search_setValue }  
                                />

                      </Col>

                    <Col span={24}>
                      <Table columns={[
                                {
                                  title: '账号',
                                  dataIndex: 'username',
                                  width : 100,
                                  render: ( text, record, index ) => {
                                    return <p style={{ width : 100,margin : 0 , maxHeight : 138, overflowY:'scroll' }} >{ text }</p>
                                    }
                                }, 
                                {
                                    title: '账号名称',
                                    dataIndex: 'realname',
                                    width : 150,
                                    render: ( text, record, index ) => {
                                        return <p style={{ width : 150, margin : 0  }} >{ text }</p>
                                        }
                                    }, 
                                    {
                                        title: '账号权限',
                                        dataIndex: 'roles',
                                        width : 150,
                                        render: ( text, record, index ) => {
                                              return  <p style={{ width :150, margin : 0 , maxHeight : 138, overflowY:'scroll' }} >{ text.join(',') }</p>
                                        },
                                    }, 
                                    {
                                        title: '操作类型',
                                        dataIndex: 'operate_type',
                                        width :100,
                                        render: ( text, record, index ) => {
                                            return <p style={{ width :100, margin : 0  }} >{ text }</p>
                                            }

                                      }, 
                                      {
                                        title: '操作对象',
                                        dataIndex: 'title',
                                        width :100,
                                        render: ( text, record, index ) => {
                                            return <p style={{ width :100, margin : 0  }} >{ text }</p>
                                            }
                                      }, 
                                
                                      {
                                        title: '操作内容',
                                        dataIndex: 'desc',
                                        width : 400,
                                        render: ( text, record, index ) => {
                                            return <div style={{ width :400, maxHeight : 138, overflowY:'scroll' }} >{ text }</div>
                                            }

                                      }, 
                            
                                      {
                                        title: '操作时间',
                                        dataIndex: 'created_at',
                                        width : 100,
                                        render: ( text, record, index ) => {
                                            return <p style={{ width :100, margin : 0 }} >{ text }</p>
                                            }

                                      }
                                ]} 
                               rowKey={'key'}
                               dataSource={ logsArray } 
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
                                                let param =  this.getParamsFromState();
                                                this.props.store.productManagementInfo.requestLogs( param )
                                             })

                                    },
                                    onShowSizeChange: (current,pageSize) => {   // pageSize 变化的回调 (改变每页显示条目数。)
                                                this.setState({ limit : pageSize }, () => {
                                                    let param =  this.getParamsFromState();
                                                    this.props.store.productManagementInfo.requestLogs( param )
                                                })
                                         }
                                    }}
                             
                             />

                       </Col>
                 </Row>

                 </Modal>
            )
      }
}