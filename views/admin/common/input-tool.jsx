import SearchTool from './search-tool';
import React from 'react';
import { Button } from 'antd';

class ToolView extends React.Component {

    render() {
        return (
            <div className="tool-view">
                <SearchTool placeholder={this.props.placeholder} name={this.props.name} value={this.props.value} onChange={this.props.onChange} onSearch={this.props.onSearch} style={this.props.style || {width: 200}}/>
                {this.props.children}
                <Button type="primary" onClick={this.props.buttonClick}>
                    {this.props.buttonName}
                </Button>
            </div>
        )
    }
}

export default ToolView;