import React from 'react';
import { Layout } from 'antd'
import { Button,DatePicker } from 'antd';

import * as mobx from 'mobx-react';


@mobx.observer
export default class TagStock extends React.Component {

    constructor(props) {
        super(props); 
    }

    state = {
        startValue: null,
        endValue: null,
        endOpen: false,
      }

    // 关于日期方法 开始
    disabledStartDate = (startValue) => {
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
          return false;
        }
        return startValue.valueOf() > endValue.valueOf();
      }
    
      disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
          return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
      }
    
      onChange = (field, value) => {
        this.setState({
          [field]: value,
        });
      }
    
      onStartChange = (value) => {
        this.onChange('startValue', value);
      }
    
      onEndChange = (value) => {
        this.onChange('endValue', value);
      }
    
      handleStartOpenChange = (open) => {
        if (!open) {
          this.setState({ endOpen: true });
        }
      }
    
      handleEndOpenChange = (open) => {
        this.setState({ endOpen: open });
      }
    // 关于日期方法 结束
    render() {
        return (
            <div className='tagstock-body'>
                <div className='tagstock-header'>
                    <div className='title-content'>
                        <p>标签库</p>
                    </div>
                    <div className='btn-group'>
                        <Button type="primary" size='small' className='new-label-btn'>新增标签</Button>
                        <Button type="primary" size='small' className='batch-upload-btn'>批量上传</Button>
                    </div>
                    <div className='selection-options'>
                        <span>更新时间</span>
                        <div>
                            <DatePicker
                                disabledDate={this.disabledStartDate}
                                showTime
                                format="YYYY-MM-DD HH:mm:ss"
                                value={this.state.startValue}
                                placeholder="Start"
                                onChange={this.onStartChange}
                                onOpenChange={this.handleStartOpenChange}
                            />
                            <DatePicker
                                disabledDate={this.disabledEndDate}
                                showTime
                                format="YYYY-MM-DD HH:mm:ss"
                                value={this.state.endValue}
                                placeholder="End"
                                onChange={this.onEndChange}
                                open={this.state.endOpen}
                                onOpenChange={this.handleEndOpenChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}