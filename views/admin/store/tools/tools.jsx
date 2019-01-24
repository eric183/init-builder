import { observable, computed, action, runInAction } from 'mobx';
import { message } from 'antd';
import nprogress from 'NProgress';

export default class Tools {
    @observable loading = false;
    @observable message = message;
    @observable nprogress = nprogress;



    @action load(value) {
        // debugger;
        if(!!value) {
            this.loading = value;
            this.nprogress.start();
        } else {
            this.loading = value;
            this.nprogress.done();
        }
    }

    @action sendNotice({title, body, iconSrc}) {

        const noticeMan = new Notification(title, {
            // lang: ,//提示的语言
            body: body || '',//提示消息的主体内容。会在标题的下面显示,
            // tag: ,//标记当前通知的标签,
            icon: iconSrc || 'https://static.wow-trend.com/vjs-2.1.19--/images/icon/logo-new.png',//提示图标
            // renotify：//是否替换之前的通知项
        })
        noticeMan.addEventListener('click', (e)=> {
            // console.log(window.location.href);
            window.focus()

            // window.open(window.location.href);
            noticeMan.close();
        }, false)
    }
}