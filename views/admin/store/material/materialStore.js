import { observable, action, runInAction, computed } from 'mobx';
import axios from 'axios';

export default class MaterialStore {

    @action setProperties(key, value) {
        if (key instanceof Object) {
            for (let i in key) {
                this[i] = key[i];
            }
        } else if (typeof key == 'string') {
            this[key] = value;
        }

    }


    @observable materialList_total = 0;
    @observable materialList = [];

    @observable purposeData = [];


    // 上传弹窗表单状态
    @observable modalVisible = false;
    @observable isEdite = false;
    @observable storeInfo = {}; // 临时存储上传信息，完成后必删除；
    @observable singleEditor = false;
    @observable bulkEditor = false;
    // 选择数据
    @observable seletedRows = [];
    // 上传弹窗表单 已上传的文件
    @observable upload1_fileList = [];
    @observable upload2_fileList = [];
    @observable componentIndex = '1'; // 1 = 解压处理; 2 = 相似检测;  3 = 待审核;


    // 相似检测、查看大图、待审核弹窗状态 
    @observable modalVisible2 = false;
    @observable modalVisible3 = false;
    @observable bigPictureVisiable = false;
    @observable bigPictureUrl = '';

    @observable imageAttrsInitialValue = []; //点击单个编辑时， 去填充的图片属性值

    @observable editeImage = { attrs: [] }; // 编辑图


    @observable oldImage = { attrs: [] }; // 冲突编辑图



    // 查看解压弹窗 状态 start 
    @observable viewZipInfoModel = false;
    @observable ViewZipInfoID = ''; //  查看解压 id


    @observable yearOptions = [];
    @observable seasonOptions = [];
    @observable purposeOptions = [];
    @observable oversizeOptions = [];
    @observable partOptions = [];
    @observable editorOptions = [];
    @observable angleOptions = [];
    @observable detailOptions = [];
    @observable styleOptions = [];
    @observable clenOptions = [];
    @observable selectedValue = undefined; // 相似检测 待审核 selector options 值



    @observable matarialConfig = {
        defaultConfig: {
            profile_visiable: true,
            part_visiable: true,
            vertype_visiable: true,
            category_visiable: true,
            details_visiable: true,
            style_visiable: true,
            clen_visiable: true,
            season_visiable: true,
            angle_visiable: true,
        },
        config: {
            style: ['category_visiable', 'profile_visiable', 'style_visiable', 'clen_visiable', 'details_visiable', 'season_visiable', 'part_visiable', 'angle_visiable'],
            profile: ['category_visiable', 'profile_visiable', 'clen_visiable', 'details_visiable', 'vertype_visiable', 'season_visiable', 'angle_visiable'],
            part: ['category_visiable', 'style_visiable', 'details_visiable', 'season_visiable', 'part_visiable', 'angle_visiable'],
            picture_use: ['category_visiable', 'profile_visiable', 'style_visiable', 'clen_visiable', 'details_visiable', 'season_visiable', 'angle_visiable'],
            ptype: ['category_visiable', 'profile_visiable', 'style_visiable', 'angle_visiable']
        },
        defualtTags: [
            { name: '款式图', key: 'style' },
            { name: '廓形', key: 'profile' },
            { name: '部件', key: 'part' },
            { name: '封面图', key: 'picture_use' },
            { name: '模特图', key: 'ptype' }
        ]

    }



    @computed get get_SelectedValue() { return this.selectedValue }
    @computed get get_OldImage() { return this.oldImage }

    @action async request_purposeData() {
        let response = await axios.get('/api/admin/toboom/resource/processing/purpose', { params: { purpose: 'profile' } }),
            data = response.data;

        runInAction(() => {
            if (data.status_code == 200) {
                // this.purposeData = data.data;
            }
        })
    }


    // 上传文件
    @action async uploadeFile(p) {
        let response = await axios.post('/api/admin/toboom/resource/uploads/task', p),
            data = response.data;
        runInAction(() => {
            console.log(data);
        })
    }


    @computed get get_materialList_total() { return this.materialList_total }
    @computed get get_materialList() { return this.materialList }


    @action async request_materialList(p = {}, callback = undefined) {
        let response = await axios.get('/api/admin/toboom/resource/list/', { params: p }, { headers: { 'Content-Type': 'multipart/form-data' } }),
            data = response.data;
        runInAction(() => {
            if (data.status_code == 200) {
                this.materialList = data.data.data;
                this.materialList_total = data.data.total;
                callback && callback();
            }

        })

    }



    @computed get get_imageAttrsInitialValue() { return this.imageAttrsInitialValue }
    @action set_imageAttrsInitialValue(value) { this.imageAttrsInitialValue = value }
    @computed get get_EditeImage() { return this.editeImage }



    // 查找编辑图片
    @action findEditeImage = (id) => {
        this.imageAttrsInitialValue.forEach((item, index) => {
            if (item.id == id) {
                this.editeImage = item;
                return false;
            }
        });
    }






    @computed get getSingleEditor() { return this.singleEditor }
    @computed get getBulkEditor() { return this.bulkEditor }
    @computed get getComponentIndex() { return this.componentIndex }
    @computed get getBigPictureVisiable() { return this.bigPictureVisiable }
    @computed get getBigPictureUrl() { return this.bigPictureUrl }
    @computed get getModalVisible2() { return this.modalVisible2 }
    @computed get getModalVisible3() { return this.modalVisible3 }


    @computed get get_yearOptions() { return this.yearOptions }
    @computed get get_seasonOptions() { return this.seasonOptions }
    @computed get get_purposeOptions() { return this.purposeOptions }
    @computed get get_oversizeOptions() { return this.oversizeOptions }
    @computed get get_partOptions() { return this.partOptions }
    @computed get get_editorOptions() { return this.editorOptions }
    @computed get get_angleOptions() { return this.angleOptions }
    @computed get get_detailOptions() { return this.detailOptions }
    @computed get get_styleOptions() { return this.styleOptions }
    @computed get get_clenOptions() { return this.clenOptions }



    @action async request_editors() {
        let response = await axios.get('/api/admin/toboom/resource/list/get-editors'),
            data = response.data || {};

        runInAction(() => {
            if (data.status_code == 200) {

                this.editorOptions = data.data;
            }
        })
    }







    @action async request_tags(value = '') {
        let response = await axios.get('/api/admin/toboom/resource/list/get-tags', { params: { name: value } }),
            data = response.data || {};
        runInAction(() => {
            if (data.status_code == 200) {
                switch (value) {
                    case 'year':
                        this.yearOptions = data.data;
                        break;
                    case 'season':
                        this.seasonOptions = data.data;
                        break;
                    case 'vectorgraph':
                        this.purposeOptions = data.data;
                        break;
                    case 'angle':
                        this.angleOptions = data.data;
                        break;
                    case 'details':
                        this.detailOptions = data.data;
                        break;
                    case 'style':
                        this.styleOptions = data.data;
                        break;
                    case 'clen':
                        this.clenOptions = data.data;
                        break;

                }
            }
        })
    }



    @observable flatData = [];
    @action async request_flatData(id) {
        let response = await axios.get(`/api/admin/toboom/resource/list/${id}`),
            data = response.data;
        runInAction(() => {
            if (data.status_code == 200) {
                this.imageAttrsInitialValue = data.data;
                this.editeImage = data.data[0];
            }
        })
    }




    @action async request_sort(p) {
        let response = await axios.get('/api/admin/toboom/resource/list/get-subtags', { params: p }),
            data = response.data;

        runInAction(() => {
            if (data.status_code == 200) {
                p.tag == '廓形' ? this.oversizeOptions = data.data : this.partOptions = data.data;
            }
        })
    }



    @action async request_multiEdit(p, callback) {
        let response = await axios.post('/api/admin/toboom/resource/list/multi-edit', p), // { headers: { 'Content-Type': 'multipart/form-data' } }
            data = response.data;

        runInAction(() => {
            if (data.status_code == 200) {
                callback && callback();
            }
        })
    }



    @action async submit_singleEdit(p, callback) {
        let response = await axios.post('/api/admin/toboom/resource/list/single-edit', p),
            data = response.data;
        runInAction(() => {
            if (data.status_code == 200) {
                callback && callback()
            }

        })
    }



    @computed get getViewZipInfoModel() { return this.viewZipInfoModel }

    @action setViewZipInfoModel(state) { this.viewZipInfoModel = state }
    @action storeViewZipInfoID(value) { this.ViewZipInfoID = value }

    // 查看解压弹窗 状态 end




    @computed get getUpload1_fileList() { return this.upload1_fileList }
    @computed get getUpload2_fileList() { return this.upload2_fileList }

    @action setUploadFileList(key, value) {
        switch (key) {
            case 'upload1_fileList':
                this.upload1_fileList = value;
                break;
            case 'upload2_fileList':
                this.upload2_fileList = value;
                break;
        }
    }



    @computed get getModalVisible() {
        return this.modalVisible
    }








    // 获取选择数据
    @computed get getSeletedRows() {
        return this.seletedRows
    }

    // 更新选择数据
    @action setSelectedRows(arr) {
        this.seletedRows = arr;
    }


    @computed get get_isEdite() {
        return this.isEdite;
    }




    // 取消发布
    @action async cancel_Release(p, callback) {
        let response = await axios.post('/api/admin/toboom/resource/list/set-release', p),
            data = response.data;
        runInAction(() => {
            if (data.status_code == 200) {
                callback && callback();
            }
        })
    }


    // 删除行
    @action async delete_rows(p, callback) {
        let response = await axios.post('/api/admin/toboom/resource/list/multi-delete', p),
            data = response.data;
        runInAction(() => {
            callback && callback();
            if (data.status_code == 200) {}
        })
    }



    // 上传文件
    @action async uploadeFile(f, callback) {
        let resp = await axios.post('/api/admin/resource/uploads/task', f, { headers: { 'Content-Type': 'multipart/form-data' } }),
            data = resp.data;
        runInAction(() => {

            if (data.status_code == 200) {
                callback && callback();
            }
        })
    }





    // 压缩包列表
    @observable compackageList = [];
    @observable compackageList_total = 0;


    @computed get get_CompackageList() { return this.compackageList }

    @computed get get_CompackageList_total() { return this.compackageList_total }

    @action async request_CompackageList(p = {}) {
        let resp = await axios.get('api/admin/toboom/resource/processing/list', { params: p }),
            data = resp.data;
        runInAction(() => {
            if (data.status_code == 200) {
                this.compackageList = data.data.data;
                this.compackageList_total = data.data.total;
            }
        })
    }








    // 压缩包冲突列表 、 待审批压缩包列表  【共用模板】

    @observable filesFordeal = [];
    @observable filesFordeal_total = 0;

    @computed get get_FilesFordeal() { return this.filesFordeal };
    @computed get get_FilesFordeal_total() { return this.filesFordeal_total }


    @action async request_ConflictList(p = {}, callback) {
        let resp = await axios.get('api/admin/toboom/resource/processing/conflict', { params: p }),
            data = resp.data;
        runInAction(() => {
            if (data.status_code == 200) {
                this.filesFordeal = data.data.data;
                this.filesFordeal_total = data.data.total;
                callback && callback();
            }
        })
    }

    @action async request_ForApprovList(p = {}) {
        let resp = await axios.get('api/admin/toboom/resource/processing/review', { params: p }),
            data = resp.data;
        runInAction(() => {
            if (data.status_code == 200) {
                this.filesFordeal = data.data.data;
                this.filesFordeal_total = data.data.total;
            }
        })
    }






    // 解压完成压缩包列表 selector 的 option 数据
    @observable completedList = [];
    @computed get get_CompletedList() { return this.completedList }
    @action async request_CompletedList(p) {
        let resp = await axios.get('api/admin/toboom/resource/processing/completed-list', { params: p }),
            data = resp.data;
        runInAction(() => {
            if (data.status_code == 200) {
                this.completedList = data.data;
            }
        })
    }







    //删除冲突文件
    @action async request_destroy(p, callback) {
        let resp = await axios.post('api/admin/toboom/resource/processing/destroy', p),
            data = resp.data;
        runInAction(() => {
            callback && callback();
            if (data.status_code == 200) {
                //  callback && callback();
            }
        })
    }









    // 保存冲突标签
    @action async conflictSave(p, callback) {
        let resp = await axios.put('api/admin/toboom/resource/processing/conflict-save', p),
            data = resp.data;
        runInAction(() => {
            if (data.status_code == 201) {
                callback && callback();
            }
        })
    }





    // 冲突资源详情
    @observable conflictItem = {};
    @computed get get_ConflictItem() { return this.completedList }
    @action async request_ConflictItem(id) {
        let resp = await axios.get(`api/admin/toboom/resource/processing/conflict-info/${id}`),
            data = resp.data;
        runInAction(() => {

            if (data.status_code == 200) {
                this.conflictItem = data.data;
            }
        })
    }



    // 待审核资源详情
    @observable ForApprovalItem = {};
    @computed get get_ForApprovalItem() { return this.forApprovalItem }
    @action async request_ForApprovalItem(id) {
        let resp = await axios.get(`api/admin/toboom/resource/processing/review-info/${id}`),
            data = resp.data;
        runInAction(() => {

            if (data.status_code == 200) {
                this.forApprovalItem = data.data;
            }
        })
    }




    // 保存待审核资源标签
    @action async reviewSave(p, callback) {
        let resp = await axios.post('api/admin/toboom/resource/processing/review-save', p),
            data = resp.data;
        runInAction(() => {

            if (data.status_code == 200) {
                callback && callback();
            }
        })
    }









    // 所有标签
    @observable profiletags = [];
    @observable partTags = [];
    @observable angleTags = [];
    @observable vertypeTags = [];
    @observable vertypeTags = [];
    @observable subsortOptions = [];

    @computed get get_subsortOptions() { return this.subsortOptions }
    @computed get get_Profiletags() { return this.profiletags }
    @computed get get_PartTags() { return this.partTags }
    @computed get get_AngleTags() { return this.angleTags }
    @computed get get_VertypeTags() { return this.vertypeTags }



    @action async request_Allsubtags(p) {
        let resp = await axios.get(`api/admin/toboom/resource/list/get-allsubtags/`, { params: p }),
            data = resp.data;
        runInAction(() => {

            if (data.status_code == 200) {
                switch (p.group) {
                    case 'profile':
                        this.profiletags = data.data;
                        break;
                    case 'part':
                        this.partTags = data.data;
                        break;
                    case 'angle':
                        this.angleTags = data.data;
                        break;
                    case 'vertype':
                        this.vertypeTags = data.data;
                        break;
                    case 'category':
                        this.subsortOptions = data.data;
                        break;
                }
            }
        })
    }













}