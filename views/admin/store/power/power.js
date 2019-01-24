import { observable, action, runInAction, computed } from 'mobx';
import axios from 'axios';

const initialValu = {
    name: '',
    title: '',
    sort: '',
    scope: [],
    disabled: undefined,
    type: undefined,
};

export default class PowerStore {

    @action setProperties(key, value) {
        if (key instanceof Object) {
            for (let i in key) {
                this[i] = key[i];
            }
        } else if (typeof key == 'string') {
            this[key] = value;
        }

    }



    @observable abilities = []; // 节点数据
    @observable abilities_count = 0; //  节点数据总数


    // 弹窗值【 数据填充 】
    @observable addNodeInitialValue = initialValu

    // 重置
    @action reset_addNodeInitialValue() {
        this.addNodeInitialValue = initialValu
    }

    @computed get get_abilities() { return this.abilities }
    @computed get get_abilities_count() { return this.abilities_count }
    @computed get get_addNodeInitialValue() { return this.addNodeInitialValue }


    @action async request_abilities(p = {}, callback = function() {}) {
        var resp = await axios.get('/api/admin/rbac/abilities/', { params: p }),
            data = resp.data;
        if (data.status_code == 200) {
            runInAction(() => {
                this.abilities_count = data.data.total;
                this.abilities = data.data.data;
                callback();
            })
        }

    }



    // 启用、禁用
    @action async set_desabled(p = {}, callback = function() {}) {
        var resp = await axios.post('/api/admin/rbac/abilities/set/', p),
            data = resp.data;
        if (data.status_code == 200) {
            runInAction(() => {
                callback();
            })
        }
    }


    // 删除
    @action async delete_nodes(p = {}, callback = function() {}) {
        var resp = await axios.post('/api/admin/rbac/abilities/del/', p),
            data = resp.data;
        if (data.status_code == 200) {
            runInAction(() => {
                callback()
            })
        }
    }


    // 节点新增、编辑
    @action async add_edit_nodes(p = {}, callback = function() {}) {
        var resp = await axios.post('/api/admin/rbac/abilities/', p),
            data = resp.data;
        if (data.status_code == 200) {
            runInAction(() => {
                callback()
            })
        }
    }











}