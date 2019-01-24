import React from 'react';
import { Select } from 'antd';

export default class PlatformSelector extends React.Component {
    render() {
        return (
            <div className="platform-selector">
                <span>选择平台</span>
                <Select style={{width: 120}} >
                    <Select.Option value="wow-trend">趋势网</Select.Option>
                    <Select.Option value="wow-find">发现网</Select.Option>
                    <Select.Option value="wow-member">会员中心</Select.Option>
                </Select>
            </div>
        )
    }
}

