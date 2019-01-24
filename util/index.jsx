import { message } from 'antd';

class Util {
    constructor() {}
    goPath(path, obj) {
        var qsInfo = qs.stringify(obj);
        window.location.hash = `${path}?${qsInfo}`    
    }

    searchStr() {
        var _regex = /\?(.+)/.exec(window.location.hash);
        return _regex ? _regex[1] : '';
    }

    fontInit(float) {
        debugger;
        document.documentElement.style.fontSize = document.documentElement.clientWidth / float + 'px';
        window.addEventListener('resize', function() {
            document.documentElement.style.fontSize = document.documentElement.clientWidth / float + 'px';
        }, false)
    }
    
    extend(obj, newObj) {
        for (let i in obj) {
            newObj[i] = obj[i];
        }
        return newObj;
    }
    
    setQsInfo(object) {
        return qs.stringify(Object.assign(qs.parse(this.searchStr()), object ? object : {}))
    }
    
    checkReg(str){
        var _reg = new RegExp('(?:'+ str + '\\=)(\\w+)(?:;)');
        var value = _reg.exec(document.cookie);
        return value ? value[1] : '';
    }
    

    /* demo： Util.setCookie("remark","damn it",24) */
    setCookie(key,val,time = 1){
                var date = new Date(); 
                var expiresDays = time; 
                    date.setTime(date.getTime()+ expiresDays*24*3600*1000 );
                document.cookie= key + "=" + val +";expires="+ date.toGMTString(); 
            }

    getCookie(key){
        var getCookie = document.cookie.replace(/[ ]/g,""); 
        var arrCookie = getCookie.split(";")  
        var tips;
        for(var i=0;i<arrCookie.length;i++){ 
            var arr=arrCookie[i].split("="); 
                if(key==arr[0]){
                    tips=arr[1];  
                    break;   
                }
        }
        return tips;
    }

    deleteCookie(key){ 
        var date = new Date();
        date.setTime(date.getTime()-10000); //将date设置为过去的时间
        document.cookie = key + "=v; expires =" +date.toGMTString(); 
    }

    typeof(object) {
        return Object.prototype.toString.call(object).split(/\s/)[1].slice(0, -1)
    }


    sayswho(){  // 判断浏览器版本
            var ua= navigator.userAgent, tem, 
            M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
            if(/trident/i.test(M[1])){
                tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
                return 'IE '+(tem[1] || '');
            }
            if(M[1]=== 'Chrome'){
                tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
                if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
            }
            M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
            if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
            return M.join(' ');

        }




}



export default new Util();

