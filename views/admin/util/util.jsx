import qs from 'qs';
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

    setQsInfo(object) {
        return qs.stringify(Object.assign(qs.parse(this.searchStr()), object ? object : {}))
    }
    
    checkReg(str){
        var _reg = new RegExp('(?:'+ str + '\\=)(\\w+)(?:;)');
        var value = _reg.exec(document.cookie);
        return value ? value[1] : '';
    }

    getLocalstorage(key){
        var value = localStorage.getItem(key);
            if (value) {
                try {
                    var value_json = JSON.parse(value);
                    if (typeof value_json === 'object') {
                        return value_json;
                    } else if (typeof value_json === 'number') {
                        return value_json;
                    }else if (typeof value_json === 'string') {
                        return value_json;
                    }

                } catch(e) {
                    return value;
                }

            } else {
                return false;
            }

    }

    setLocalstorage(key, value){  localStorage.setItem(key, JSON.stringify(value)) }
    removeLocalstorage(key){  localStorage.removeItem(key)   }
    clearLocalstorage(){ localStorage.clear()  }



}

export default new Util();