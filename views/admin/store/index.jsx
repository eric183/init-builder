// import { observable, computed, action, runInAction } from 'mobx';
// import {observer} from 'mobx-react';
// import Util from 'entry_dir/util/index';
// import * as mobx from 'mobx'; 
// import React from 'react';
// import axios from 'axios';
// import qs from 'qs';
import GlobalInfo from './global';

import Tools from './tools/tools';

//平台设置
import SettingPlatform from './platform/settingPlatform';
//趋势网菜单
import TrendMenu from './platform/trendMenu';
//模板管理
import TemplateManage from './platform/templateManage';

// 管理节点
import SettingNodeStore from './node/settingNodeStore';
//角色管理
import SettingRole from './setting/settingRole';

import Settingjointor from './setting/jointor'; 
//通知模板管理
import NoticeManage from './notice/noticeManage';
import NoticeTemplate from './notice/noticeTemplate';


// 推荐管理
import RecommendStore from './recommend/recommendstore';

//用户管理
import SettingUser from "./setting/settingUser";
//标签
import SettingLabel from "./setting/settingLabel";
import SettingLabelGroup from "./setting/settingLabelGroup";
//标签组字典
import SettingGroupDics from "./setting/settingGroupDics";

//栏目管理
import SettingColumn from "./platform/settingColumn";

// 图片管理
import AlbumStore from './album/albumStore';


//首页推荐管理
import HomepageStore from './homepage_rc_store/homepage_rc_store';

//流行解读管理
import PopularStore from './popularStore/poluparstore';

// 素材库
import MaterialStore from './material/materialStore';


// 流行解读管理
import FashionStore from './fashionStore/fashionstore';

//测试
import TestStore from './test';

//首页推荐
import HomePage from './homePage/home-page';

//首页推荐 》》编辑
import HomePageEditor from './homePageEditor/homePageEditor';


// 节点管理
import PowerStore from './power/power';
// 角色管理
import RoleStore from './power/role';
// 部门设置
import DepartStore from './power/depart';

// 账号设置
import AccountStore from './power/acccount';

//菜单组
import GroupStore from './menu/group';


class Store {
    constructor() {
        this.tools = new Tools();
        this.globalInfo = new GlobalInfo(this.tools);
        this.settingPlatform = new SettingPlatform(this.tools);
        this.settingJointor = new Settingjointor(this.tools);
        // this.indexInfo = new IndexInfo();
        this.settingNodeStore = new SettingNodeStore(this.tools);
        this.trendMenu = new TrendMenu(this.tools);
        this.templateManage = new TemplateManage(this.tools);
        this.settingRole = new SettingRole(this.tools);
        this.noticeManage = new NoticeManage(this.tools);
        this.noticeTemplate = new NoticeTemplate(this.tools);
        this.recommendStore = new RecommendStore(this.tools);
        this.settingUser = new SettingUser(this.tools);
        this.settingLabel = new SettingLabel(this.tools);
        this.settingLabelGroup = new SettingLabelGroup(this.tools);
        this.settingGroupDics = new SettingGroupDics(this.tools);
        this.settingColumn = new SettingColumn(this.tools);
        this.AlbumStore = new AlbumStore(this.tools);
        this.HomepageStore = new HomepageStore(this.tools);
        this.PopularStore = new PopularStore(this.tools);
        this.MaterialStore = new MaterialStore(this.tools);
        this.FashionStore = new FashionStore(this.tools);
        this.testStore = new TestStore(this.tools);
        this.homePage = new HomePage(this.tools);
        this.homePageEditor = new HomePageEditor(this.tools);
        this.powerStore = new PowerStore( this.tools );
        this.roleStore = new RoleStore( this.tools );
        this.departStore = new DepartStore( this.tools );
        this.accountStore = new AccountStore( this.tools );
        this.groupStore = new GroupStore( this.tools );
    }

    
}

export default new Store();