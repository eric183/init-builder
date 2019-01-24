import React, { Component } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form } from 'antd';
import * as mobx from 'mobx-react';
import * as defaultMobx from 'mobx';
import homePageEditorInfo from '../../store/homePageEditor/homePageEditor';


const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends Component {
    getInput = () => {
        if (this.props.inputType === 'number') {
            return <InputNumber />;
        }
        return <Input />;
    };

    render() {
        const {
            editing,
            dataIndex,
            title,
            inputType,
            record,
            index,
            ...restProps
        } = this.props;
        return (
            <EditableContext.Consumer>
                {(form) => {
                    const { getFieldDecorator } = form;
                    return (
                        <td {...restProps}>
                            {editing ? (
                                <FormItem style={{ margin: 0 }}>
                                    {getFieldDecorator(dataIndex, {
                                        rules: [{
                                            required: true,
                                            message: `Please Input ${title}!`,
                                        }],
                                        initialValue: record[dataIndex],
                                    })(this.getInput())}
                                </FormItem>
                            ) : restProps.children}
                        </td>
                    );
                }}
            </EditableContext.Consumer>
        );
    }
}

@mobx.observer
class HomePage extends Component {
    constructor(props) {
        super(props);
        // this.state = { data, editingKey: '' };
    }

    // isEditing(record) {
    //     return record.key === this.state.editingKey;
    // };

    componentDidMount() {
        this.props.store.homePage.getHomeData();
    }

    fetchDetail(record) {
        console.log(record);
        this.props.history.push(`/setting/homepageeditor?id=${record.id}&title=${record.title}`)
        
    }
    render() {

   
        var { homePageList } = defaultMobx.toJS(this.props.store.homePage);

        //console.log(homePageList);
        
        
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        const columns = [
            {
                title: '编号',
                dataIndex: 'id',
                width: '5%',
                editable: true,
                render: (text, record, index) => <span>{index+1}</span>      
            },
            {
                title: '名称',
                dataIndex: 'title',
                width: '20%',
                editable: true,
            },
            {
                title: '数量',
                dataIndex: 'lists_count',
                width: '10%',
                editable: true,
            },
            {
                title: '最后修改时间',
                dataIndex: 'updated_at',
                width: '20%',
                editable: true,
            },
            {
                title: '修改人',
                dataIndex: 'editor',
                width: '20%',
                editable: true,
            },
            {
                title: '操作',
                render: (text, record) => {
                    return (
                        <div>
                            <a onClick={this.fetchDetail.bind(this, record)}>编辑</a>
                        </div>
                    )
                },
            }
        ];
        return (
            <Table
                components={components}
                rowClassName="editable-row"
                rowKey="id"
                bordered
                dataSource={homePageList.data}
                columns={columns}
            />
        );
    }
}


export default HomePage;