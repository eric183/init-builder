import { observable, computed, action, runInAction } from 'mobx';
import { message } from 'antd';
export default class TrendMenu {
    @observable dataSource = [
        {
            number:'z-qwe',
            platform: "asdf",
            name: '发布会',
            english_name: 'mikel',
            type: '主题',
            picture: '111',
            theme: '50/100',
            video:'23123',
            language: '中文',
            internal: '100',
            state: '1',
        }
    ]
}