import React from 'react';
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react';


@observer class SpinLoading extends React.Component {
    render() {
        return (
            <Spin spinning={this.props.store.tools.loading}>
                {this.props.children}
            </Spin>
        )
    }
}


@observer class CubeLoading extends React.Component {
    render() {
        return ReactDOM.createPortal(
            <div className="loading-cube" style={{display: this.props.store.globalInfo.showCube ? "block" : "none" }}>
                <div className="cube-item"></div>
            </div>,
            document.querySelector('#root')
        )
    }
}

export { SpinLoading, CubeLoading };
