import React, { Component } from 'react';
import * as mobx from 'mobx';
import { observable, action, runInAction, computed } from 'mobx';
import axios from 'axios';
import { observer } from 'mobx-react';
import qs from 'qs';
import {  Form, Select, Input , Modal, TreeSelect, Transfer, message } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

const SHOW_PARENT = TreeSelect.SHOW_ALL ; // TreeSelect.SHOW_PARENT;
const MAXTAGCOUNT = 3;


const formItemLayout = {
    labelCol: {
      xs: { span: 0 },
      sm: { span: 0 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
    },
  };




  @observer
  export default class AddPower extends Component {
           state = {
            staffsArry : [], // 所有角色成员
            targetKeys : [],  // 本角色成员id
            selectedKeys : []
           }

       handleOk = () => {
                  let rolesInfo = mobx.toJS( this.props.store.roleStore.get_rolesInfo );
                  let targetKeys = this.state.targetKeys.concat();

             if( rolesInfo.staffs.length ){
                    if( rolesInfo.staffs.every(( item,index ) => item.id == targetKeys[index] )  ){
                             message.warning('未作任何修改！')
                        }else{
                            this.props.okAction( targetKeys );
                        }
             }else{
                    if( targetKeys.length <= 0  ){
                        message.warning('未作任何修改！')
                    }else{
                        this.props.okAction( targetKeys );
                    }
             }
        
         }


         handleCancel = () => {
             this.setState({ staffsArry : [], targetKeys : [],  selectedKeys : [] });
             this.props.cancelAction();
         }

         
      handleChange = (nextTargetKeys, direction, moveKeys) => {
                this.setState({ targetKeys: nextTargetKeys });
        }
      
     handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
          this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys ] });
          
     }

     handleScroll = (direction, e) => { }

   //在此请求数据，并处理 staffs 和 not_staffs数据
    mix_staffs = ( ) => {
        var { store, parentRef } = this.props;
        var _promise = new Promise( (resolve, reject) => {
            store.roleStore.requs_rolesInfo( parentRef.set_role_id ).then(( rolesInfo ) => {
                      if( rolesInfo.staffs && rolesInfo.not_staffs ){
                        let { staffs, not_staffs } = rolesInfo
                        var staffsArry = staffs.concat( not_staffs );
                        var targetKeys = staffs.map((item,index) => item.id );
                            resolve( { staffsArry, targetKeys });
                      }else{
                            resolve( {  staffsArry : [], targetKeys: [] } );
                      }
                 })
           });
             return _promise;
         }


    componentWillReceiveProps( nextProps ){
          if( nextProps.visible == true && (nextProps.confirmLoading == false || nextProps.confirmLoading == 'false' ) ){
              this.mix_staffs().then(( data ) => { 
                       this.setState( data )
                  })
          }
     }



         render(){
             let { title, visible, okText, confirmLoading, store } = this.props;
             let { selectedKeys, staffsArry , targetKeys } = this.state;


              return (
                <Modal
                    title={ title }
                    visible={ visible }
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText={ okText }
                    confirmLoading={ confirmLoading }   
                  >
                    <Transfer
                        listStyle={{ width : 210 }}
                        rowKey={record => record.id }
                        dataSource={ staffsArry  }
                        titles={['非本角色成员','本角色成员']}
                        targetKeys={ targetKeys }
                        selectedKeys={ selectedKeys }
                        onChange={this.handleChange}
                        onSelectChange={this.handleSelectChange }
                        onScroll={this.handleScroll}
                        render={item => item.name }
                       />
                </Modal>  
              )
         }
   }

   AddPower.defaultProps = {
        title : '角色成员管理',
        visible : false,
        okAction : function(){},
        cancelAction : function(){},
        okText : '提交',
        confirmLoading : false,
   }

