import React from 'react';
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; 
import { Layout, Form, Input, Button, Table, Select, Modal, Popconfirm } from 'antd';
import { observer } from 'mobx-react'; 
import * as mobx from 'mobx';
// import { computed } from 'mobx';
import qs from 'qs';
import axios from 'axios';

@observer class Jointor extends React.Component {
    constructor(props) {
        super(props);

        var qsInfo = props.location.search.slice(1);

        var params = qs.parse(qsInfo);
        
        var isChild = (!!params['pid'] || !!params['cid']) ? true : false;

        this.state = {
            visible: false,
            confirmLoading: false,
            postInfo: {},
            qsInfo: qsInfo,
            isChild: isChild,
            isEdit: false
    
        }
    }
   
    @mobx.computed get jointorList() {
        
        return mobx.toJS(this.props.store.settingJointor.jointorList);
    }
    validateFieldsAndScroll(callback) {

    }
    handleOk() {
        var _this = this;
      
		var postUrl = '';
        var qsStr = this.props.location.search.slice(1);
        var qsInfo = qs.parse(qsStr);
        // this.validateFieldsAndScroll((err, value)=> {
        //     
        //     if(!err) {
        //         var value = this.props.form.getFieldsValue();

        
        var value = Object.assign(this.state.postInfo);
        var urls = [];
        if(this.state.isChild) {
            value['cid'] = qsInfo['cid'];
            value["pid"] = qsInfo["pid"] ? qsInfo["pid"] : '';
        }
        urls = this.state.isEdit ? [] : ['/api/admin/cascades/datas', '/api/admin/cascades']

        this.props.store.tools.load(true);
        
        
       /* function commonCallback({data}) {
            // ({data})=> {
            _this.props.store.tools.load(false);
            (data.status_code == 201 || data.status_code == 200) && _this.pullList(qsStr);
            _this.setState({
                visible: false
            })
            // }
        }*/
      
		if(this.state.isEdit) {
   		 	postUrl = this.state.isChild ? `/api/admin/cascades/datas/${this.state.postInfo.id}` : `/api/admin/cascades/${this.state.postInfo.id}`;
        } else {
   		 	postUrl = this.state.isChild ? '/api/admin/cascades/datas' : '/api/admin/cascades';
        }
      
		axios({
        	method: this.state.isEdit ? 'PUT' : 'POST',
          	data: !this.state.isEdit ? value : '',
            url: postUrl
        }).then(({data})=> {
            this.props.store.tools.load(false);
            (data.status_code == 201 || data.status_code == 200) && _this.pullList(qsStr);
            this.setState({
                visible: false
            })
        })
        //if(this.state.isEdit) {
          //  axios.put(this.state.isChild ? `/api/admin/cascades/datas/${this.state.postInfo.id}` : `/api/admin/cascades/${this.state.postInfo.id}`, value).then(commonCallback)
        //} else {
          //  axios.post(this.state.isChild ? '/api/admin/cascades/datas' : '/api/admin/cascades', value).then(commonCallback)
        //}
        //     }
        // });
        
    }
    onCancel() {
        this.setState({
            visible: false,
            postInfo: {}
        })
    }
    createHandler(event) {
        
        this.setState({
            visible: true,
            isEdit: false
        })
    }
    goEdit(data, event) {
        // data
   
        this.setState({
            visible: true,
            postInfo: JSON.parse(JSON.stringify(data)),
            isEdit: true
        });
        
        // console.log(data)
    }
    handleFormChange(data) {
        
        // this.state[postInfo.data] = data; 
        
        // Object.assign(this.state.postInfo, data);
        // var object = 
        this.setState({
            postInfo: Object.assign(this.state.postInfo, data)
        })

        
    }
    deleteHandler(record) {
        // debugger
        // this.props.store.tools.load()
        
        axios.delete(this.state.isChild ? `/api/admin/cascades/datas/${record.id}` : `/api/admin/cascades/${record.id}` ).then((request)=> {
            
            if(request.status == 204) {
                this.props.store.tools.message.success('删除成功');
                this.pullList(qs.parse(this.props.location.search.slice(1)));
            } else {
                this.props.store.tools.message.error('删除失败');

            }
        }).catch(({response})=> {
            if(response.status) {
                this.props.store.tools.message.error('删除失败');
            }
        })

    }
   
    pullList(params) {
        
        params = qs.parse(params);
        
        this.setState({ isChild: (!!params['pid'] || !!params['cid']) ? true : false });

        if(!!params['pid'] || !!params['cid']) {
            //数据
            
            this.props.store.settingJointor.getJointorList(params);
            
        } else {

            //类型
            
            //有缓存则不请求
                
                // this.jointorList.data.length == 0 ? 
            this.props.store.settingJointor.getJointorList();
                // this.props.store.settingJointor.refillDefaultList();
        }
    }
    componentDidMount() {
        // console.log();
        
        this.pullList(this.state.qsInfo);
    }
    componentDidUpdate() {
        // console.log(this.state.isChild);
    }
    componentWillReceiveProps(props) {
        
        this.setState({
            postInfo: {}
        });
        /*通用处理antd导致的声明周期钩子调用BUG Begin*/
        var preLocation = this.props.location;
        if(preLocation.pathname + preLocation.search == props.location.pathname + props.location.search) return;
        
        /* End*/

        //新的props, hash数据读这个;
        
        this.pullList(props.location.search.slice(1));
    }
    render() {
        
        const page = qs.parse(this.props.location.search.slice(1))['page'] || 1;
        const limit =  this.jointorList.data.length;
        // const limit = qs.parse(this.props.location.search.slice(1))['limit'] || 5;
        const count = this.jointorList.data.length;
        const {name, initial, code, sort} = this.state.postInfo;
       
        var columns = !this.state.isChild ? 
            [{
                title: '级联组名称',
                dataIndex: 'group_title',
                render: (text, record) => (
                    <a href={`#setting/jointor?cid=${record.id}`}>{text}</a>
                )
            },{
                title: '级联组标识',
                dataIndex: 'group_code',
            },{
                title: '操作',
                render: (text, record) => (
                    <span>
                        {/* <a href={`#setting-right/Jointor/change?id=${record.id}`}>编辑</a> */}
                        <Popconfirm title="确认删除?" onConfirm={this.deleteHandler.bind(this, record)}>
                            <a href="javascript: void(0)">删除</a>
                        </Popconfirm>
                        <a className="joint-edit" href="javascript: void(0)" onClick={this.goEdit.bind(this, record)}>编辑</a>
                    </span>
                ),
            }] : [{
                title: '名称',
                dataIndex: 'name',
                render: (text, record) => (
                    <a href={`#setting/jointor?cid=${record.cid}&pid=${record.id}`}>{text}</a>
                )
            },{
                title: '标识',
                dataIndex: 'code',
            },{
                title: '首字母',
                dataIndex: 'initial',
            },{
                title: '操作',
                render: (text, record) => (
                    <span>
                         <Popconfirm title="确认删除?" onConfirm={this.deleteHandler.bind(this, record)}>
                            <a href="javascript: void(0)">删除</a>
                        </Popconfirm>
                        <a className="joint-edit" href="javascript: void(0)" onClick={this.goEdit.bind(this, record)}>编辑</a>
                    </span>
                ),
            }];
        return (
            <Layout.Content className="jointor-content">
                <div className="operation-menu">
                    {/* <div className="search-bar">
                        <Input.Search 
                            placeholder="请输入权限名称"
                            onSearch={value => console.log(value)}
                            style={{width: 300}}
                            enterButton/>
                        <Select >
                            <Select.Option value="0">所属平台</Select.Option>
                            <Select.Option value="1">趋势网</Select.Option>
                            <Select.Option value="2">管理后台</Select.Option>
                        </Select>
                    </div> */}
                    <div className="button-bar">
                        <Button type="primary" onClick={this.createHandler.bind(this)}>{this.state.isChild ? "新增数据" : "新增类型"}</Button>
                    </div>
                </div>
                <div className="table-content">
                    <Table columns={columns}
                        rowKey="id"  
                        dataSource={this.jointorList.data} 
                        pagination={{
                            current: page,
                            pageSize: limit,
                            showQuickJumper: true,
                            showSizeChanger: true,
                            total : Number(count) | 0,
                        showTotal: function(total,pageSize){
                            return `共${Number(count)}条`
                        },
                        onChange:(pageNumber) => {  // 页码改变的回调，参数是改变后的页码及每页条数
                        },
                        onShowSizeChange: (current,pageSize) => {   // pageSize 变化的回调 (改变每页显示条目数。)
                                }
                            }}
                        />
                </div>


                <Modal 
                    title={this.state.isChild ? "新增数据" : "新增类型"}
                    visible={this.state.visible}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.onCancel.bind(this)}
                    confirmLoading={this.state.confirmLoading}>
                       
                    <FormCompontWrapper 
                        isChild={this.state.isChild} 
                        postInfo={this.state.postInfo} 
                        onChange={this.handleFormChange.bind(this)}
                        validateFieldsAndScroll={this.validateFieldsAndScroll.bind(this)}/>

                    {/* <ReactCSSTransitionGroup
                        transitionName="commonpagemove"
                        transitionEnterTimeout={300}
                        transitionLeaveTimeout={100}> */}
                     
                           {/* <FormTemplate onSubmit={this.submitHandler.bind(this)}/> */}
                        
                    {/* </ReactCSSTransitionGroup> */}
                </Modal>
            </Layout.Content>
        )
    }
}

// class FormTemplate extends React.Component {
//     render() {
        
//     }
// }

var FormCompontWrapper = Form.create({
    onValuesChange(_, values) {
          
        _.onChange(values);

    },
    mapPropsToFields(props) {

        data: Form.createFormField({
            // ...props.username,
            isChild: props.isChild,
            postInfo: props.postInfo
        });
    }
})((props)=> {
    const { getFieldDecorator } = props.form;
    
    
    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
        },
    };

    // var TemplateDOM = <p>fdsafdas</p>
    
    var TemplateDOM = !props.isChild ? (
        <Form>
            <Form.Item 
                label="级联组名称:"
                {...formItemLayout}
            >
                {getFieldDecorator('group_title', {
                    initialValue: props.postInfo.group_title,
                    rules: [{
                        required: true, message: '请输入必填项',
                    }],
                })(
                    <Input />
                )}
            </Form.Item>
            <Form.Item 
                label="级联组标识:"
                {...formItemLayout}
            >
                {getFieldDecorator('group_code', {
                    initialValue: props.postInfo.group_code,
                    rules: [{
                        required: true, message: '请输入必填项',
                    }],
                })(
                    <Input />
                )}
            </Form.Item>
            <Form.Item 
                label="排序:"
                {...formItemLayout}
            >
                {getFieldDecorator('sort', {
                    initialValue: props.postInfo.sort,
                })(
                    <Input />
                )}
            </Form.Item>
        </Form> ) : (
       
       
       <Form>
            <Form.Item 
                label="名称:"
                {...formItemLayout}
            >
                {getFieldDecorator('name', {
                    initialValue: props.postInfo.name,
                    rules: [{
                        required: true, message: '请输入必填项',
                    }],
                })(
                    <Input />
                )}
            </Form.Item>
            <Form.Item 
                label="标识:"
                {...formItemLayout}
            >
                {getFieldDecorator('code', {
                    initialValue: props.postInfo.code,
                    rules: [{
                        required: true, message: '请输入必填项',
                    }],
                })(
                    <Input />
                )}
            </Form.Item>
            <Form.Item 
                label="首字母:"
                {...formItemLayout}
            >
                {getFieldDecorator('initial', {
                    initialValue: props.postInfo.initial,
                    rules: [{
                        required: true, message: '请输入必填项',
                    }]
                })(
                    <Input />
                )}
            </Form.Item>
            <Form.Item 
                label="排序:"
                {...formItemLayout}
            >
                {getFieldDecorator('sort', {
                    initialValue: props.postInfo.sort,
                })(
                    <Input />
                )}
            </Form.Item>
        </Form>)
    return (
        <div>
            {TemplateDOM}
        </div>
        // <p>dsafas</p>
    )
})

export default Jointor;