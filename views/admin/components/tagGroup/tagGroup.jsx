import React,{Component} from 'react';


import * as mobx from 'mobx-react';

@mobx.observer
export default class TagGroup extends Component {
    render() {
        return (
            <div className='tabgroup'>标签组</div>
        )
    }
}