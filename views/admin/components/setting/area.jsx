import React, { Component } from 'react';
import { Layout,  Form, Input,  Select,  Modal,  Row, Col, Button, message, Pagination,
      Table,  Cascader, Checkbox, Radio, Transfer   } from 'antd';


export default class Account extends Component {

    constructor(props){ super(props) }

    state = {
        page_index : 1,
        page_size : 10,
        count : 0,
        visible : false,
        confirmLoading : false,
        AreaPopTitle : '无',
        params : {}
    }

      tempData = [
          {
              key : '1',
              name : '华南一组',
              city : '深圳',
              district : '深圳、东莞、惠州'
          },
          {
            key : '2',
            name : '华南二组',
            city : '深圳',
            district : '深圳、东莞、惠州'
        },
        {
            key : '3',
            name : '华南三组',
            city : '深圳',
            district : '深圳、东莞、惠州'
        }
      ];


      
     // 编辑辖区方法
      onclickHandle_cells = (record,text) => {

            this.setState({ visible : true,  AreaPopTitle : text });

            console.log(record);
            console.log(text);

      }   


     // 弹窗操纵方法
      handleOk = () => {
            this.setState({ visible : false })
      }
      handleCancel = () => { 
            this.setState({ visible : false })
      }



    componentDidMount(){}
    componentWillReceiveProps(nextProps){}

    render() {
        let { page_index, page_size, count } = this.state;
        return (
            <Layout.Content className="common-content area-content">
                <div style={{width:'100%', position:'relative'}}> 
                    <Table className="customer-table" 
                            scroll={{ y: 550}}
                            columns={[
                                   {
                                    title: '部门名称',
                                    dataIndex: 'name',
                                    width : '25%',
                                    align:'center',
                                    key : '1'
                                  },
                                  {
                                    title: '所在城市',
                                    dataIndex: 'city',
                                    width : '25%',
                                    align:'center',
                                    key : '2'
                                  },
                                  {
                                    title: '辖区',
                                    dataIndex: 'district',
                                    width : '25%',
                                    align:'center',
                                    key : '3',
                                    render : (text, record, index) => (
                                        <div className="table-btns">
                                        <p>  
                                        <button className="table-btn" style={{'textDecoration': 'underline'}} type="button" onClick={ () => { this.onclickHandle_cells(record,text) } }>{text}</button>
                                        </p>
                                      </div>
                                      
                                    )    
                                  },
                                  {
                                    title: '操作',
                                    align:'center',
                                    width : '25%',
                                    key : '4',
                                    render : (text, record, index) => (
                                        <div className="table-btns">
                                        <p>  
                                        <button className="table-btn"  type="button" onClick={ () => { this.onclickHandle_cells(record,'设置辖区') } }>设置辖区</button>
                                        </p>
                                      </div>
                                       )    
                                    }
                               ]} 
                            dataSource={this.tempData} 
                            pagination={ {
                                current: page_index,
                                pageSize: page_size,
                                showQuickJumper: true,
                                showSizeChanger: true,
                                total : Number(count) | 0,
                            showTotal: function(total,pageSize){
                                return `共${Number(count)}条`
                            },
                            onChange:(pageNumber) => {  // 页码改变的回调，参数是改变后的页码及每页条数
        
                                // const params = this.state.params;
                                //      params.page_index = pageNumber;
                                // this.setState({
                                //     page_index: pageNumber,
                                //     params: params,
                                // })
                                // const location = this.props.location;
                                // this.props.history.push(`${location.pathname}?${qs.stringify(params)}`);
        
                            },
                            onShowSizeChange: (current,pageSize) => {   // pageSize 变化的回调 (改变每页显示条目数。)
        
                                // const params = this.state.params;
                                // params.page_size = pageSize;
                                // this.setState({
                                //     page_size: pageSize,
                                //     params:params
                                // })
                                // const location = this.props.location;
                                // this.props.history.push(`${location.pathname}?${qs.stringify(params)}`);
        
                                 }
                             } }
                            loading={false}
                            rowKey={ () => Math.ceil(Math.random() * 123425)  }
                            />
                </div>

                 <AreaPop {...this.props} {...this.state} handleOk={this.handleOk.bind(this)} handleCancel={this.handleCancel.bind(this)} />

            </Layout.Content>
        )
    }
}




/* 辖区弹窗 start  */

const mockData = [];
for (let i = 0; i < 20; i++) {
        mockData.push({
            key: i.toString(),
            title: `北京${i + 1}`,
            description: `某某城市辖区${i + 1}`,
        });
    }


class AreaPop extends Component {
      constructor(props){ super(props) }

      state = {
        targetKeys : [],
        selectedKeys : []
      }

      handleChange = (nextTargetKeys, direction, moveKeys) => {
        this.setState({ targetKeys: nextTargetKeys });
    
        console.log('targetKeys: ', targetKeys);
        console.log('direction: ', direction);
        console.log('moveKeys: ', moveKeys);
      }
    
      handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
    
        console.log('sourceSelectedKeys: ', sourceSelectedKeys);
        console.log('targetSelectedKeys: ', targetSelectedKeys);
      }
    
      handleScroll = (direction, e) => {
        console.log('direction:', direction);
        console.log('target:', e.target);
      }

      
 
       render(){
             let { targetKeys, selectedKeys, } = this.state;
            return (
                <Modal title={'设置辖区 --' + this.props.AreaPopTitle}
                visible={this.props.visible}
                handleOk={this.props.handleOk }
                confirmLoading={this.props.confirmLoading}
                onCancel={ this.props.handleCancel }
                className={'adder_pop'}
                width={'600px'}
                footer={ [
                    <Button key="back" onClick={this.props.handleCancel }>取消</Button>,
                    <Button key="submit" type="primary" loading={this.props.confirmLoading} onClick={ this.handleSubmit }>确定</Button>,
                ]}>
                   <div style={{maxHeight: '600px',overflow:'auto'}}>
                        <Transfer 
                                listStyle={{
                                    width: 250
                                  }}
                               dataSource={mockData}
                               titles={['省/市', '已经选择地理位置']}
                               targetKeys={targetKeys}
                               selectedKeys={selectedKeys}
                               onChange={this.handleChange}
                               onSelectChange={this.handleSelectChange}
                               onScroll={this.handleScroll}
                               render={item => item.title}
                         />
                    </div>
                </Modal>

            )
       }


}

/* 辖区弹窗 end  */