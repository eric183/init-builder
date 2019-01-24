import React , { Component }  from 'react';
import { Link } from 'react-router';
import { Layout, 
Form, Input, Select, Modal, Row,Col, Button,
 message, Pagination,Table, Cascader,Checkbox,Radio 
} from 'antd';
import {observer} from 'mobx-react';
import qs from 'qs';
import $http from 'axios';
import * as mobx from 'mobx';
import { computed, autorun } from 'mobx';


const FormItem = Form.Item;
const Option = Select.Option;
const ButtonGroup = Button.Group;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;



@observer class SettingNode extends Component {
    
      constructor(props){ super(props) }

         state = {
            modalTitle : '新增/编辑节点',
            visible : false,
            confirmLoading : false,
            page: 1,
            limit : 10,
            count : 10,  // 总数
            id : 1,    // 弹窗 id 
            params : {
                page: 1,
                limit : 10
            }, 
           platform_value : undefined,  // 弹窗form字段值
           fields : {
                name : '',
                title : '',
                scope : undefined,
                entity_id : undefined
            },

            columns : [
                 {
                    title: '序号',
                    dataIndex: 'index',
                    width: '10%',
                    align:'center',
                    key : '1'
                 },
                 {
                    title: '平台',
                    dataIndex: 'scope',
                    width: '10%',
                    align:'center',
                    key : '2'
                 },
                 {
                    title: '资源名',
                    dataIndex: 'name',
                    width: '10%',
                    align:'center',
                    key : '3'
                 },
                 {
                    title: '显示名',
                    dataIndex: 'title',
                    width: '10%',
                    align:'center',
                    key : '4'
                 },
                 {
                    title: '操作',
                    dataIndex: 'opera',
                    width: '10%' ,
                    align:'center',
                    key : '7',
                    render : (text, record, index) => (
                           <div className="table-btns">
                              <p>  
                                <button className="table-btn" type="button" onClick={ () => { this.editor_row(record,index) } }>编辑</button>
                              </p>
                            </div>
                       )    
                    }

            ]

         }

         onChange(field,value){ this.setState({[field]: value}) }


        platformList(param){ this.props.store.settingNodeStore.getPlatformData(param) } 



        // 选择平台
        selector_platform = (value) => {

            this.platformList({
                            page : 1,
                            limit :50,
                            app_code : value,
                            title : 'ss'
                     })
     
        }


          // 搜索节点
        searcher_node = (value) => {

            this.platformList({
                        page : 1,
                        limit :50,
                        app_code : value,
                        title : 'ss'
                })
              
        }
   


        // 编辑行
         editor_row = (record,index) => {

              console.log(record);

                this.setState({
                    modalTitle : '编辑节点',
                    visible : true,
                    fields : {
                         name : record.name,
                         title : record.title,
                         scope : record.scope,
                         entity_id : record.entity_id ? record.entity_id : undefined
                    }
                });



         }


    

         // 新增节点 【打开弹窗】
         addNode = () => {

                this.setState({
                    modalTitle : '新增节点',
                    visible : true
                })

         }




        /* 弹窗处理方法 start  */ 
         handleOk = () => {  this.handleSubmit() }
         handleCancel = () => { 
            this.setState({
                modalTitle : '新增/编辑节点',
                visible : false,
                fields :  {
                    name : '',
                    title : '',
                    scope : undefined,
                    entity_id : undefined
                }
            });
            this.props.form.resetFields();
            
          }
        /* 弹窗处理方法 end   */ 



      /* 弹窗form处理方法 start  */
            handleSubmit = () => {
                this.props.form.validateFieldsAndScroll((err, values) => {
                            if (!err) {   
                            
                               this.props.store.settingNodeStore.addNodes(values, () =>{
                        
                                      this.props.form.resetFields();
                                        this.setState({
                                            modalTitle : '新增/编辑节点',
                                            visible : false
                                        })
                               })

                                console.log( values);
                            }

                  })
            }


      /* 弹窗form处理方法 end  */ 


        

      componentDidMount(){ 
           this.platformList(); 
              
          }

      componentWillReceiveProps(nextProps){
             // console.log(this.props.history.location)
             // console.log(nextProps.location.search.slice(1));
      }

       render(){

          let { page, limit, columns , 
              count, visible, confirmLoading,
               modalTitle , platform_value , resource_name ,
               showed_name, sort_index,state_value 
             } = this.state;


      const { getFieldDecorator } = this.props.form;


         // 分页配置项 start 
                    const pagination = {
                        current: page,
                        pageSize: limit,
                        showQuickJumper: true,
                        showSizeChanger: true,
                        total : Number(count) | 0,
                    showTotal: function(total,pageSize){
                        return `共${Number(count)}条`
                    },
                    onChange:(pageNumber) => {  // 页码改变的回调，参数是改变后的页码及每页条数

                        const params = this.state.params;

                            params.page = pageNumber;

                        this.setState({
                            page: pageNumber,
                            params: params,
                        })
                        const location = this.props.location;
                        this.props.history.push(`${location.pathname}?${qs.stringify(params)}`);

                    },
                    onShowSizeChange: (current,pageSize) => {   // pageSize 变化的回调 (改变每页显示条目数。)

                        const params = this.state.params;

                        params.limit = pageSize;

                        this.setState({
                            limit: pageSize,
                            params:params
                        })

                        const location = this.props.location;
                        this.props.history.push(`${location.pathname}?${qs.stringify(params)}`);

                    }
                };
      // 分页配置项 end 


            return (

                <Layout.Content className="common-content">
                    <div className="search-nav">
                      <Form layout="inline">
                             <FormItem>
                                    <Select style={{ width: 120 }}  onChange={ value => { this.selector_platform(value) } } placeholder="选择平台" allowClear>
                                        <Option value={''} key={1}>全部平台 </Option>
                                        <Option value={1} key={2}>趋势网 </Option>
                                        <Option value={2} key={3}>高端趋势网</Option>
                                        <Option value={3} key={4}>管理后台</Option>
                                    </Select>

                             </FormItem>

                             <FormItem>
                                    <Input.Search
                                        placeholder="请输入节点名称"
                                        onSearch={ value => { this.searcher_node(value) }}  enterButton style={{width: 280}}/>
                                </FormItem>

                              <FormItem className="customer-button">      
                                  <Button type="primary"  onClick={this.addNode}>新增节点</Button>     
                             </FormItem>        
                        </Form>
                     </div>


                 {/*  mobx.toJS(this.props.store.settingNodeStore.platformList).map((item,index) =>{ item.index = index + 1;  return item })  */}
                                    
                  <div style={{width:'100%', position:'relative'}}> 
                        <Table className="customer-table" 
                                scroll={{ y: 550}}
                                columns={columns} 
                                dataSource={ mobx.toJS(this.props.store.settingNodeStore.platformList) } 
                                pagination={ pagination }
                                loading={false}
                                rowKey={ (index) => Math.ceil( Math.random() * 123425)  }
                                />
                      </div>

                         {/*  添加弹窗  */}               
                         <Modal title={modalTitle}
                            visible={visible}
                            onOk={this.handleOk }
                            confirmLoading={confirmLoading}
                            onCancel={ this.handleCancel }
                            className={'addFollowUp_pop'}
                            width={'600px'}
                            footer={ [
                                <Button key="back" onClick={this.handleCancel }>取消</Button>,
                                <Button key="submit" type="primary" loading={confirmLoading} onClick={this.handleOk}>确定</Button>,
                            ]}>
                             
                         
                             <div style={{maxHeight: '600px',overflow:'auto'}}>
                             <Form className="addedForm-node" onSubmit={ this.handleSubmit } > 
                                         <FormItem  className="other-item"  label="平台" labelCol={{ span: 5 }} wrapperCol={{ span: 14 }}  >
                                              {getFieldDecorator('scope ', {
                                                         initialValue : this.state.fields.scope,
                                                        rules: [{required: true,message:'平台不能为空'}],
                                                    })(
                                                        <Select allowClear placeholder="请选择平台"  > 
                                                            <Option value={'1'} key={'1'}>趋势网</Option> 
                                                            <Option value={'2'} key={'2'}>趋势网</Option> 
                                                            <Option value={'3'} key={'3'}>趋势网</Option> 
                                                            {/* {
                                                                mobx.toJS(this.props.store.customerMobx.CustomerAccounts).map((item, index) => {
                                                                    return   <Option value={item.user_id} key={index}>{item.name +'--'+ item.phone}</Option> 
                                                                })
                                                                    } */}
                                                        </Select>
                                                    )}
                                           </FormItem>

                                            
                                            <FormItem  className="other-item"  label="资源名" labelCol={{ span: 5 }} wrapperCol={{ span: 14 }}  >
                                                {getFieldDecorator('name ', {
                                                    initialValue : this.state.fields.name,
                                                    rules: [{required: true, message : '资源名不能为空'}],
                                                })(
                                                    <Input type="text" />
                                                )}
                                             
                                             </FormItem>


                                              <FormItem  className="other-item"  label="显示名" labelCol={{ span: 5 }}  wrapperCol={{ span: 14 }}  >
                                                {getFieldDecorator('title', {
                                                       initialValue : this.state.fields.title,
                                                        rules: [{required: true,message : '显示名不能为空'}],
                                                    })(
                                                        <Input type="text" />
                                                    )}
                                             </FormItem>

                                         <FormItem  className="other-item" label="实体"  labelCol={{ span: 5 }} wrapperCol={{ span: 14 }}  >    
                                                {getFieldDecorator('entity_id',{  initialValue : this.state.fields.entity_id, })(
                                                      <Select allowClear placeholder="请选择平台"  > 
                                                            <Option value='1' key='1'>实体1</Option> 
                                                            <Option value='2' key='2'>实体2</Option> 
                                                            <Option value='3' key='3'>实体3</Option> 
                                                        </Select>
                                                    )}
                                         </FormItem>

                                                       
                             </Form>
                            </div>


                        </Modal>          

                </Layout.Content>
            )
       }

}




const SettingNodeComponent = Form.create()(SettingNode);

export default SettingNodeComponent;
