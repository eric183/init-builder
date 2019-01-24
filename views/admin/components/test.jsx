import React from 'react';
import { InputNumber } from 'antd';
import { Table, Button } from 'antd';
import '../styles/components/_test.scss'

const data = [{
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  }, {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  }, {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  }, {
    key: '4',
    name: 'Jim Red',
    age: 32,
    address: 'London No. 2 Lake Park',
  }];
  

export default class Test extends React.Component {
    
    state = {
        number: 666,
        name: "john",
        filteredInfo: null,
        sortedInfo: null,
    }
    changeNumber() {
        this.setState({
            number: 0
        })
    }
    //input
    onChange(value) {
        console.log('changed', value);
    }
    //表格
    handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        this.setState({
          filteredInfo: filters,
          sortedInfo: sorter,
        });
      }
    
      clearFilters = () => {
        this.setState({ filteredInfo: null });
      }
    
      clearAll = () => {
        this.setState({
          filteredInfo: null,
          sortedInfo: null,
        });
      }
    
      setAgeSort = () => {
        this.setState({
          sortedInfo: {
            order: 'descend',
            columnKey: 'age',
          },
        });
      }

      
       
    render() {
        let { sortedInfo, filteredInfo } = this.state;
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};
        const columns = [{
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        filters: [
            { text: 'Joe', value: 'Joe' },
            { text: 'Jim', value: 'Jim' },
        ],
        filteredValue: filteredInfo.name || null,
        onFilter: (value, record) => record.name.includes(value),
        sorter: (a, b) => a.name.length - b.name.length,
        sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
        }, {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        sorter: (a, b) => a.age - b.age,
        sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
        }, {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
        filters: [
            { text: 'London', value: 'London' },
            { text: 'New York', value: 'New York' },
        ],
        filteredValue: filteredInfo.address || null,
        onFilter: (value, record) => record.address.includes(value),
        sorter: (a, b) => a.address.length - b.address.length,
        sortOrder: sortedInfo.columnKey === 'address' && sortedInfo.order,
        }];
        return (
            <div>
                <div className="test-content">
                    helloworld
                    <InputNumber min={0} max={100} defaultValue={0} onChange={this.onChange.bind(this)} />
                    <Child { ...this.state } changeNumber={this.changeNumber.bind(this)} />
                </div>
                <div>
                    <div className="table-operations">
                        <Button onClick={this.setAgeSort}>Sort age</Button>
                        <Button onClick={this.clearFilters}>Clear filters</Button>
                        <Button onClick={this.clearAll}>Clear filters and sorters</Button>
                    </div>
                    <Table columns={columns} dataSource={data} onChange={this.handleChange} />
                </div>
            </div>
        )
    }
}   


class Child extends React.Component {

    render() {
        return (
            <div className="child-content" onClick={this.props.changeNumber}>
                hi child { this.props.number }
            </div>
        )
    }
}