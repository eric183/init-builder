import { observable, action, computed, runInAction } from 'mobx';
import axios from 'axios';
import qs from 'qs';
import * as mobx from 'mobx';


class Tagstore {
    @observable data = {};
    @observable sdata = [];
    @observable tdata = [];

    @computed get get_data() { return this.data }

    @computed get get_sdata() { return this.sdata }

    @computed get get_tdata() { return this.tdata }


    @action setProperties(key, value) {
        if (key instanceof Object) {

            let keysName = Object.keys(key);
            for (let i = 0; i < keysName.length; i++) {
                this[keysName[i]] = this[keysName[i]] = key[keysName[i]];
            }
            value instanceof Function ? setTimeout(() => { value() }, 150) : '';
        } else if (typeof key == 'string') {
            this[key] = value;
        }
    }



}

export default new Tagstore()