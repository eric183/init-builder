import React from 'react';

import { Icon } from 'antd';

export default class CollapseToggle extends React.Component {
    render() {
        return (
            <Icon
                className="trigger"
                type={'menu-unfold'}
                onClick={this.props.toggleHandler} />
        )
    }
}