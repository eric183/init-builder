import React from 'react';
import { Input } from 'antd';
export default class SearchTool extends React.Component {
    keyBinder(e) {
        // debugger;
        return e.keyCode == 13 ? false : true;
    }
    render() {
        return (
            <div className="search-view">
                <Input.Search  
                    style={this.props.style}
                    enterButton
                    placeholder={this.props.placeholder} 
                    onSearch={this.props.onSearch}
                    value={this.props.value}
                    onChange={this.props.onChange}
                    name={this.props.name}
                />
            </div>
        )
    }
}