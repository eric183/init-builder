import GlobalInfo from './global';

import HomeInfo from './components/home';
import EditorStore from './editorStore';
import CategoryInfo from './components/category';

import SwiperRecentlyModifyInfo from './components/design-management/swiper-recently-modify';
import AllWorksInfo from './components/design-management/allworks';

import DesignRecentlyModifyInfo from './components/design-recently-modify';

import RecycleBinInfo from './components/design-recycle-bin/recycle-bin-list';

import CollectionListInfo from './components/design-my-collection/collectiom-list';
import CollectionMoveInfo from './components/design-my-collection/collection-move';

import ProductManagementInfo from './components/design-product-management/product-management';

import PopularStore from './components/popularstore';

import StyleGalleryStore from './components/styleG_store';

import HomePageInfo from './components/home-page';
import ProductManagement from './components/design-product-management/product-management';

import WorksTotalNumberInfo from './components/get-works-total-number';


class Store {
    constructor() {
        this.globalInfo = new GlobalInfo();
        this.homeInfo = new HomeInfo(this.globalInfo);
        this.editorStore = new EditorStore(this.globalInfo);
        this.categoryInfo = new CategoryInfo(this.globalInfo);
        this.swiperRecentlyModifyInfo = new SwiperRecentlyModifyInfo(this.globalInfo);
        this.allWorksInfo = new AllWorksInfo(this.globalInfo);
        this.designRecentlyModifyInfo = new DesignRecentlyModifyInfo(this.globalInfo);
        this.recycleBinInfo = new RecycleBinInfo(this.globalInfo);
        this.collectionListInfo = new CollectionListInfo(this.globalInfo);
        this.collectionMoveInfo = new CollectionMoveInfo(this.globalInfo);
        this.productManagementInfo = new ProductManagementInfo(this.globalInfo);
        this.popularStore = new PopularStore( this.globalInfo );
        this.styleGalleryStore = new StyleGalleryStore( this.globalInfo );
        this.homePageInfo = new HomePageInfo(this.globalInfo);
        this.productManagement = new ProductManagement(this.globalInfo);
        this.worksTotalNumberInfo = new WorksTotalNumberInfo (this.globalInfo);
    }

    
}



export default new Store();