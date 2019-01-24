import React,{Component} from 'react';


import * as mobx from 'mobx-react';

@mobx.observer
export default class TagPublicField extends Component {
    render() {
        return (
            <div className='tagPublicField'>公共字段</div>
        )
    }
}