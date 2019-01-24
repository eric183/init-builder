import { observable, action, runInAction, computed } from 'mobx';
import axios from 'axios';

const INITVALUE = {
    title: undefined,
    desc: undefined,
    app_id: undefined,
    sort: undefined
}



function process_allMenuItem(data) {
    data.forEach((item, index) => {
        item.key ? '' : item.key = item.id;
        item.value ? '' : item.value = item.id;
        if (item.children && item.children.length) process_allMenuItem(item.children)
    });
}



export default class GroupStore {
    @action setProperties(key, value) {
        if (key instanceof Object) {
            for (let i in key) {
                this[i] = key[i];
            }
        } else if (typeof key == 'string') {
            this[key] = value;
        }

    }


    @observable groupInitialValue = INITVALUE;

    @observable menuGroup = { dataArry: [], count: 0 };

    @observable menuItem = { dataArry: [], count: 0 }

    @observable allMenuItem = [];

    @observable menuInitialValue = {};


    @computed get get_menuGroup() { return this.menuGroup }
    @computed get get_groupInitialValue() { return this.groupInitialValue }
    @computed get get_menuItem() { return this.menuItem }
    @computed get get_allMenuItem() { return this.allMenuItem }
    @computed get get_menuInitialValue() { return this.menuInitialValue }


    @action reset_groupInitialValue() { this.groupInitialValue = INITVALUE }




    @action async requs_menugroup(p = {}, callback = function() {}) {
        var resp = await axios.get('/api/admin/rbac/menusGroups/', { params: p }),
            data = resp.data;
        if (data.status_code == 200) {
            runInAction(() => {
                this.menuGroup.dataArry = data.data.data;
                this.menuGroup.count = data.data.total;
                callback();
            })
        }
    }



    // 删除
    @action async delete_nodes(p = {}, callback = function() {}) {
        var resp = await axios.delete('api/admin/rbac/menusGroups/delete', p),
            data = resp.data;
        if (data.status_code == 200) {
            runInAction(() => {
                callback();
            })
        }
    }


    // 新增组
    @action async add_group(p = {}, id = undefined, callback = function() {}) {
        var resp = null;
        if (id) {
            resp = await axios.put(`api/admin/rbac/menusGroups/${id}`, p);
        } else {
            resp = await axios.post('api/admin/rbac/menusGroups/', p);
        }
        var data = resp.data;
        if (data.status_code == 201 || data.status_code == 200) {
            runInAction(() => {
                callback();
            })
        }
    }




    /* ---------------  menu_Item start ------------------ */



    // 获取菜单项数据
    @action async requs_menuItem(p = {}, callback = function() {}) {
        var resp = await axios.get('/api/admin/rbac/menus/', { params: p }),
            _data = resp.data;
        if (_data.status_code == 200) {
            runInAction(() => {
                let { data = [], total = 0 } = _data.data;
                this.menuItem.dataArry = data;
                this.menuItem.count = total;
                callback();
            })
        }
    }




    // 获取所有的上级菜单
    @action async requs_allMenuItem() {
        var resp = await axios.get('/api/admin/rbac/menus/', { params: { limit: 0 } }),
            data = resp.data;
        if (data.status_code == 200) {
            runInAction(() => {
                this.allMenuItem = data.data.data || [];
            })
        }
    }


    // 上传图标
    @action upload_icon(file) {
        return axios.post('/api/admin/rbac/menus/upload', file); //   { headers: { 'Content-Type': 'multipart/form-datad' } }
        //  return axios.post('/api/uploads', file);
    }





    // 菜单设置--新增菜单
    @action async add_menuItem(p = {}, id, callback = function() {}) {
        var resp = null;
        if (id) { // 编辑
            resp = await axios.put(`/api/admin/rbac/menus/${id}`, p);
        } else {
            resp = await axios.post(`/api/admin/rbac/menus/`, p);
        }
        var data = resp.data;
        runInAction(() => {
            if (data.status_code == 201 || data.status_code == 200) {

                callback('success', '操作成功！');
            } else {
                callback('warning', '操作失败！');
            }
        })

    }


    // 权限标识验证
    @action verify_ability(p = {}) {
        return axios.get('/api/admin/rbac/verifyAbility', { params: p })
    }

    // 链接地址验证
    @action verify_link(url) { return axios.get(url) }


    // 删除菜单
    @action async delete_menu(p = {}, callback = function() {}) {
        var resp = await axios.post('/api/admin/rbac/menus/delete', p),
            data = resp.data;
        if (data.status_code == 200) {
            runInAction(() => {
                callback()
            })
        }
    }




}