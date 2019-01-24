import React from 'react';
import { Layout, Form, Input, Checkbox, Radio, Button } from 'antd';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
class SettingRoleTemplate extends React.Component {
    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 8 },
                sm: { span: 2 },
            },
            wrapperCol: {
                xs: { span: 12 },
                sm: { span: 6 },
            },
        };
        const { getFieldDecorator } = this.props.form;
        return (
            <Layout.Content className="common-content role-content">
                <Form>
                    <FormItem 
                        {...formItemLayout}
                        label="角色名称">
                         {getFieldDecorator('name', {
                            rules: [{required: true}],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem 
                        {...formItemLayout}
                        label="备注">
                         {getFieldDecorator('remarks')(
                            <Input.TextArea  autosize={{ minRows: 3, maxRows: 3 }}/>
                        )}
                    </FormItem>
                    <h1 style={{fontSize: "18px"}}>角色权限</h1>
                    <hr/>
                    <FormItem 
                        {...formItemLayout}
                        label="选择平台">
                         {getFieldDecorator('radio')(
                            <RadioGroup>
                                <Radio value={1}>趋势网</Radio>
                                <Radio value={2}>管理后台</Radio>
                                <Radio value={3}>高端趋势网</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <table className="_role-table">
                        <tbody className="ant-table-tbody">
                            <tr>
                                <td>
                                    <Checkbox>公共权限</Checkbox>
                                </td>
                                <td></td>
                                <td colSpan="4">
                                    <Checkbox.Group style={{ width: '100%' }}>
                                        <Checkbox value={1}>列表</Checkbox>
                                        <Checkbox value={2}>删除</Checkbox>
                                        <Checkbox value={3}>编辑</Checkbox>
                                        <Checkbox value={4}>添加</Checkbox>
                                    </Checkbox.Group>
                                </td>
                            </tr>
                            <tr>
                                <td rowSpan="5">
                                    <Checkbox>数据录入</Checkbox>
                                </td>
                                <td>
                                    <Checkbox>主题趋势</Checkbox>
                                </td>
                                <td colSpan="4">
                                    <Checkbox.Group style={{ width: '100%' }}>
                                        <Checkbox value={1}>列表</Checkbox>
                                        <Checkbox value={2}>删除</Checkbox>
                                        <Checkbox value={3}>编辑</Checkbox>
                                        <Checkbox value={4}>添加</Checkbox>
                                    </Checkbox.Group>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Checkbox>主题趋势</Checkbox>
                                </td>
                                <td colSpan="4">
                                    <Checkbox.Group style={{ width: '100%' }}>
                                        <Checkbox value={1}>列表</Checkbox>
                                        <Checkbox value={2}>删除</Checkbox>
                                        <Checkbox value={3}>编辑</Checkbox>
                                        <Checkbox value={4}>添加</Checkbox>
                                    </Checkbox.Group>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Checkbox>主题趋势</Checkbox>
                                </td>
                                <td colSpan="4">
                                    <Checkbox.Group style={{ width: '100%' }}>
                                        <Checkbox value={1}>列表</Checkbox>
                                        <Checkbox value={2}>删除</Checkbox>
                                        <Checkbox value={3}>编辑</Checkbox>
                                        <Checkbox value={4}>添加</Checkbox>
                                    </Checkbox.Group>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Checkbox>主题趋势</Checkbox>
                                </td>
                                <td colSpan="4">
                                    <Checkbox.Group style={{ width: '100%' }}>
                                        <Checkbox value={1}>列表</Checkbox>
                                        <Checkbox value={2}>删除</Checkbox>
                                        <Checkbox value={3}>编辑</Checkbox>
                                        <Checkbox value={4}>添加</Checkbox>
                                    </Checkbox.Group>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Checkbox>主题趋势</Checkbox>
                                </td>
                                <td colSpan="4">
                                    <Checkbox.Group style={{ width: '100%' }}>
                                        <Checkbox value={1}>列表</Checkbox>
                                        <Checkbox value={2}>删除</Checkbox>
                                        <Checkbox value={3}>编辑</Checkbox>
                                        <Checkbox value={4}>添加</Checkbox>
                                    </Checkbox.Group>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <hr/>
                    <FormItem>
                        <Button type="primary" htmlType="submit">保存</Button>
                        <Button style={{marginLeft: "15px"}}>取消</Button>
                    </FormItem>
                </Form>
            </Layout.Content>
        )
    }
}
const SettingRole = Form.create({})(SettingRoleTemplate);

export default SettingRole;