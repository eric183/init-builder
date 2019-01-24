import React , { Component }  from 'react';
import { Layout, Button, Table, Input, Divider, Form, Modal, Radio, Select, Checkbox, Row, Col } from 'antd';
import { observer } from 'mobx-react'; 
import * as mobx from 'mobx';
import { computed } from 'mobx';

const FormItem = Form.Item;

@observer
class TrendMenuComponent extends Component {
    @computed get dataSource (){
        return mobx.toJS(this.props.store.trendMenu.dataSource);
    }
    constructor(props){
        super(props);
    }
    state = {
        visible: false,
        title: '新增栏目',
        formdata: {}
    }
    // handleSorteChange(i,1sd){

    // }
    handleClick(string){
        if(string === "edit") {
            this.setState({title: "编辑栏目"});
        }else {
            this.setState({
                title: "新增栏目",
                formdata: {}
            });

        }
        this.setState({visible: true});
    }
    handleCloseModal(){
        this.setState({visible: false});
    }
    render(){
        return (
            <Layout.Content className="common-content setting_platform">
                <div className="operation-menu">
                    <div className="search-bar">
                        
                    </div>
                    <div className="button-bar">
                        <Button type="primary" onClick={this.handleClick.bind(this,"add")}>新增栏目</Button>
                    </div>
                </div>
                <div className="table-content">
                <Table columns={[{
                        title: '编号',
                        dataIndex: 'number',
                        render:(text,row,index)=>(index+1)
                    }, {
                        title: '前台模板',
                        dataIndex: 'platform',
                    },{
                        title: '栏目名称',
                        dataIndex: 'name',
                    },{
                        title: '英文名称',
                        dataIndex: 'english_name',
                    },{
                        title: '栏目类型',
                        dataIndex: 'type',
                    },{
                        title: '发布状态',
                        dataIndex: 'state',
                        render: (text,row,index)=>{
                            if(text == 2) {
                                return (<span className="_post_status"><i style={{background: "red"}}></i> 否</span>)
                            }else{
                                return (<span className="_post_status"><i style={{background: "green"}}></i> 是</span>)
                            }
                        },
                    },{
                        title: <div style={{width: "50px"}}>周更新主题数</div>,
                        dataIndex: 'theme',
                        sorter: true,
                        width: 90
                    },{
                        title: <div style={{width: "50px"}}>周更新图片数</div>,
                        dataIndex: 'picture',
                        sorter: true,
                        width: 90
                    },{
                        title: <div style={{width: "50px"}}>周更新视频数</div>,
                        dataIndex: 'video',
                        sorter: true,
                    },{
                        title: <div style={{width: "50px"}}>浏览量</div>,
                        dataIndex: 'internal',
                        sorter: true,
                        width: 90
                    },{
                        title: '操作',
                        render: (text, record) => (
                            <span>
                                <a href="javascript:;" onClick={this.handleClick.bind(this,"edit")}>编辑</a>
                                <Divider type="vertical" />
                                <a href="javascript:;">加子栏目</a>
                                <Divider type="vertical" />
                                <a href="javascript:;" style={{color: "red"}}>收回</a>
                                <Divider type="vertical" />
                                <a href="javascript:;" style={{color: "red"}}>发布预览</a>
                            </span>
                        ),
                    }]}
                    rowKey="number"  
                    dataSource={this.dataSource} />
                </div>
                <ModalTemplate 
                    {...this.props}
                    {...this.state}
                    handleCloseModal={this.handleCloseModal.bind(this)}  />
            </Layout.Content>
        )
    }
}
export default TrendMenuComponent;

class ModalTemplate extends React.Component {
    constructor(props){
        super(props);
    }

    handleCancel(){
        this.props.handleCloseModal();
    }
    handleOk(e){
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.props.handleCloseModal();
            }
        });
    }
    render() {
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
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
                title={this.props.title}
                visible={this.props.visible}
                onOk={this.handleOk.bind(this)}
                onCancel={this.handleCancel.bind(this)}>
                <Form className="_platform" onSubmit={this.handleOk.bind(this)}>
                    <FormItem
                        {...formItemLayout}
                        label="中文名称">
                        {getFieldDecorator('name', {
                            initialValue: this.props.formdata.name
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="英文名称">
                        {getFieldDecorator('username1', {
                            initialValue: this.props.formdata.username1
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="关键字">
                        {getFieldDecorator('username2', {
                            initialValue: this.props.formdata.username2
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="前台模板">
                        {getFieldDecorator('username3', {
                            initialValue : this.props.formdata.username3
                        })(
                            <Select>
                                <Select.Option value = "1"> 模板1 </Select.Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="栏目介绍（可选）">
                        {getFieldDecorator('username4', {
                            initialValue : this.props.formdata.username4
                        })(
                            <Input.TextArea autosize={{ minRows: 2, maxRows: 2 }} placeholder="请输入栏目介绍"/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="栏目分类">
                        {getFieldDecorator('username5', {
                            initialValue : this.props.formdata.username5
                        })(
                            <Radio.Group>
                                <Radio value="1">男装</Radio>
                                <Radio value="2">女装</Radio>
                                <Radio value="3">其他</Radio>
                            </Radio.Group>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="栏目类型">
                        {getFieldDecorator('username6', {
                            initialValue : this.props.formdata.username6
                        })(
                            <Radio.Group>
                                <Radio value="1">文件夹</Radio>
                                <Radio value="2">主题</Radio>
                                <Radio value="3">图片</Radio>
                                <Radio value="4">视频</Radio>
                                <Radio value="5">书籍</Radio>
                                <Radio value="6">杂志</Radio>
                            </Radio.Group>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="栏目标签">
                        {getFieldDecorator('username7', {
                            initialValue : this.props.formdata.username7
                        })(
                            <Checkbox.Group style={{ width: '100%' }}>
                                <Row>
                                    <Col span={4}><Checkbox value="A">A</Checkbox></Col>
                                    <Col span={4}><Checkbox value="B">B</Checkbox></Col>
                                    <Col span={4}><Checkbox value="C">C</Checkbox></Col>
                                    <Col span={4}><Checkbox value="D">D</Checkbox></Col>
                                    <Col span={4}><Checkbox value="E">E</Checkbox></Col>
                                    <Col span={5}><Checkbox value="F">F</Checkbox></Col>
                                </Row>
                            </Checkbox.Group>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}
ModalTemplate = Form.create({})(ModalTemplate);