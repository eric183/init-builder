import React from 'react';
import './index.scss';

class HomeLogo extends React.Component {
    render() {
        return (
            <div className="home-header-left" onClick={this.props.onClick}>
                <img src="/assets/toBoom/images/homePage/logoPic.png" alt=""/>
            </div> 

        )
    }
}


export { HomeLogo };