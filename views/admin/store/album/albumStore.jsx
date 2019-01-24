import { observable, action, runInAction } from 'mobx';
import axios from 'axios';





export default class AlbumStore {
    constructor(tools) {
        this.tools = tools;
    }
    @observable albumList =  [];

    @observable searchNavList =  {
        part: {tags:[]},
        v_season: {tags:[]},
        toboom_sort: {tags:[]},
        status: {tags:[]},
        order: {tags:[]},
    };

    @observable count =  0;

    @observable constructorData =  {
        toboom_sort: { tags:[] },
        detail: { tags:[] },
        part: { tags:[] },
        v_season: { tags:[] },
        
    };

    @observable albumInfo =  {
        extend: {},
        attrs: {
            toboom_sort:[],
            v_season:'',
            part: '',
            detail:'',
            keywords: []
        },
        tags: [],
        status: {},
        is_release: 0
    };

    @observable photoList = {
        refs:[],
        choose_tag: []
    };

    @observable secondList = [];

    @observable threeList = [];

    @observable search_url = "";

    @observable annexs = "";

    @action async getAlbumList(object) {
        this.tools.load(true);
        var  params = !object.page ? Object.assign(object,{page: 1,limit: 16}) : object;
        var resquestdata = await axios.get("/api/admin/resource",{params:params});
        resquestdata = resquestdata.data;

        runInAction(() => {
            this.tools.load(false);
            if(resquestdata.status_code == 200){
                this.albumList = resquestdata.data.data;
                this.count = resquestdata.data.total;
            }
        })
    }

    @action async getSearchNav() {
       
        var resquestdata = await axios.get("/api/admin/toboom/get-search");
        resquestdata = resquestdata.data;

        runInAction(() => {
            if(resquestdata.status_code == 200){
                this.searchNavList = resquestdata.data;
            }
        })
    }

    @action async getAlbumConstructor (){
        var resquestdata = await axios.get("/api/admin/columns/groups",{
            params:{
                code:"toboom" 
            }
        })
        resquestdata = resquestdata.data;
        runInAction(() => {
            if(resquestdata.status_code == 200){
                this.constructorData = resquestdata.data;
                this.search_url = resquestdata.data.toboom_sort.search_url;
            }
        })
    }

    @action async getAlbumInfo (id){
        var resquestdata = await axios.get(`/api/admin/toboom/vectors/${id}`);
        resquestdata = resquestdata.data;
        runInAction(() => {
            if(resquestdata.status_code == 200){
                this.albumInfo =  {
                    desc: resquestdata.data.extend.desc,
                    attrs: resquestdata.data.attrs,
                    tags: resquestdata.data.tags,
                    is_release: resquestdata.data.status.is_release,
                    title: resquestdata.data.title,
                    id: resquestdata.data.id,
                    extend: resquestdata.data.extend,
                    created_date: resquestdata.data.created_date
                }
                this.annexs = resquestdata.data.annexs.length ?  true: false;
                if(resquestdata.data.attrs.toboom_sort.length >= 1) {
                    this.getSecondList(resquestdata.data.attrs.toboom_sort[0],this.search_url);
                }
                if(resquestdata.data.attrs.toboom_sort.length >= 2) {
                    this.getThreeList(resquestdata.data.attrs.toboom_sort[1],this.search_url);
                }
            }
        })
    }
    @action changeAnnexs() {
        this.annexs = true;
    }

    @action async getPhotoList (id){
        var resquestdata = await axios.get(`/api/admin/resource/pic-ref`,{params: {id:id}});
        resquestdata = resquestdata.data;
        runInAction(() => {
            if(resquestdata.status_code == 200){
                this.photoList = resquestdata.data;
            }
        })
    }
    @action changeAlbumInfo(string1,string2,value) {
        if(string2 == "select") {
            if(value == this.constructorData.toboom_sort.id) {
                this.albumInfo[string1].detail = "";
                this.albumInfo[string1].part = "";
            }else if(value == this.constructorData.detail.id) {
                this.albumInfo[string1].toboom_sort = [];
                this.albumInfo[string1].part = "";
            } else {
                this.albumInfo[string1].toboom_sort = [];
                this.albumInfo[string1].detail = "";
            }
        } 
        if(string1 == "tags") {
            this.albumInfo[string1] = value;
        }else if(string1 == "title" || string1 == "is_release" || string1 == "desc") {
            this.albumInfo[string1] = value;
        }else {
            
            this.albumInfo[string1][string2] = value;
        }

    }
    @action handleTier(string1,string2,value,index) {
        if(!index) {
            this.getSecondList(value,this.search_url);
            this.albumInfo[string1][string2] = [value];
        }else if(index == 1) {
            this.getThreeList(value,this.search_url);
            if(this.albumInfo[string1][string2].length == 1) {
                this.albumInfo[string1][string2].push(value);
            }else {
                this.albumInfo[string1][string2] = [this.albumInfo[string1][string2][0], value];
            }
        }else if(index == 2) {
            if(this.albumInfo[string1][string2].length == 2) {
                this.albumInfo[string1][string2].push(value);
            }else {
                this.albumInfo[string1][string2] = [this.albumInfo[string1][string2][0],this.albumInfo[string1][string2][1], value];
            }
        }
        
    }
    @action async getSecondList(id,url) {
        var resquestdata = await axios.get(`${url}${id}`);
        resquestdata = resquestdata.data;
        runInAction(() => {
            if(resquestdata.status_code == 200){
                this.secondList = resquestdata.data.data;
            }
        })
    }
    @action async getThreeList(id,url) {
        var resquestdata = await axios.get(`${url}${id}`);
        resquestdata = resquestdata.data;
        runInAction(() => {
            if(resquestdata.status_code == 200){
                this.threeList = resquestdata.data.data;
            }
        })
    }

} 