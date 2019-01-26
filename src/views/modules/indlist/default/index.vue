<template>
    <div class="storedetail">
        <!-- 主页推荐分组 -->
        <p class="textright flexbox tabletitle">
            <el-form label-width="50px" size="small" :model="formData">
                <el-form-item label="类型">
                    <el-select placeholder="请选择" v-model="formData.type" @change="typeChange(formData.type)">
                        <el-option v-for="item in typelist" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-button type="primary" v-if="isAuth('product:groups:addGroup')" size="mini" @click="addSpecial(0)">新增专题</el-button>
        </p>
        <div class="admin">
            <el-table :data="tableData" center="all" border style="width: 100%">
                <el-table-column align="center" type="index" width="50" label="序号"> </el-table-column>
                <el-table-column align="center" prop="groupName" label="分组名称">
                    <template slot-scope="scope">
                        <router-link v-show="scope.row.contentKind == 1" :to="{path: '/IndexShop', query: {groupId: scope.row.groupId}}"
                            ><p style="color:#409EFF">{{ scope.row.groupName }}</p></router-link
                        >
                        <router-link v-show="scope.row.contentKind == 2" :to="{path: '/storeShop', query: {type: scope.row.type}}"
                            ><p style="color:#409EFF">{{ scope.row.groupName }}</p></router-link
                        >
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="isDisplayed" label="是否推荐">
                    <template slot-scope="scope">
                        <el-switch :width="35" @change="isRecommend(scope.row)" v-model="scope.row.isDisplayed" active-text="是" :active-value="1" inactive-text="否" :inactive-value="0"> </el-switch>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="type" label="推荐类型" :formatter="type"> </el-table-column>
                <el-table-column align="center" prop="contentKind" label="展示类型" :formatter="contentKind"> </el-table-column>
                <el-table-column align="center" label="操作" width="320">
                    <template slot-scope="scope">
                        <el-button type="success" v-if="isAuth('product:groups:updateGroup')" plain size="mini" @click="editSpecial(scope.row, 1)">编辑</el-button>
                        <el-button type="success" v-if="isAuth('product:groups:sortGroup')" plain size="mini" @click="stick(scope.row, 1)">置顶</el-button>
                        <el-button type="danger" v-if="isAuth('product:groups:deleteGroup')" plain size="mini" @click="isdelete(scope.row)">删除</el-button>
                        <el-button type="success" v-if="isAuth('product:groups:bindGroupGoods')" v-show="scope.row.contentKind != 2" plain size="mini" @click="relevance(scope.row)"
                            >关联商品</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
            <!-- <div class="pagin">
            <el-pagination
                background
                layout="total,prev, pager, next"
                @current-change="currentchange"
                :total="total"
                :page-size="pageSize">
            </el-pagination>
        </div> -->
        </div>
        <el-dialog title="推荐专题" :visible.sync="dialogVisible" width="30%" @close="closeDialog" :close-on-click-modal="false">
            <el-form label-width="100px" :rules="rules2" :model="newAddSpecial" ref="newAddSpecial" size="small">
                <div>
                    <el-form-item label="专题名称" prop="newGroupName"> <el-input placeholder="请输入专题名称(4个字以内)" v-model="newAddSpecial.newGroupName"></el-input> </el-form-item>
                    <el-form-item label="推荐类型" v-show="textAreaShow" prop="newGroupLocation">
                        <el-select placeholder="请选择" v-model="newAddSpecial.newGroupLocation" @change="groupLocationChange(newAddSpecial.newGroupLocation)">
                            <el-option v-for="item in newAddSpecial.shoplist2" :key="item.id" :label="item.groupLocation" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="分组展示类型" v-show="groupLook">
                        <el-select v-model="groupLookValue"> <el-option v-for="item in groupLookTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
                    </el-form-item>
                    <el-form-item label="专题描述" prop="textarea">
                        <el-input type="textarea" v-model="textarea" :autosize="{minRows: 2, maxRows: 4}" placeholder="请输入内容(30个字以内)"> </el-input>
                    </el-form-item>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="editConfirm('edit')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'Indexlist',
    data() {
        return {
            rules2: {
                newGroupName: [{required: true, message: '请输入专题名称', trigger: 'blur'}],
                newGroupLocation: [{required: true, message: '请选择推荐类型', trigger: 'blur'}],
                textarea: [{required: true, message: '请输入专题描述', trigger: 'blur'}],
            },
            formData: {
                type: 21,
            },
            typelist: [{value: 21, label: '美食'}, {value: 31, label: '优品'}],
            tableData: [], //页面初始数据
            shopId: null, //登录时候选择店铺，先写死
            value1: '',
            total: 0,
            pageNum: 1, //当前页数
            pageSize: 50, //每页数量
            goodsId: 0, //选中的商品id
            dialogVisible: false,
            value: '', //店铺类型下拉绑定的key值
            shoppingEditform: {}, //商品的编辑参数
            newAddSpecial: {
                shoplist2: [
                    {
                        groupLocation: '美食首页推荐分组',
                        id: 21,
                    },
                    {
                        groupLocation: '优品首页推荐分组',
                        id: 31,
                    },
                ],
                newGroupName: '',
                newGroupLocation: '',
                newisRecommended: false,
                newGroupId: 0,
            },
            groupLook: false,
            groupLookValue: '',
            groupLookTypeList: [{value: 1, label: '商品'}, {value: 2, label: '商铺'}],
            textarea: '',
            textAreaShow: false,
            EditGoods: 0,
        };
    },
    activated: function() {
        this.searchshopinglist();
    },
    methods: {
        //首页 关联商品和 点击专题名称进去的页面相似，问问有没有差别在哪里。。。
        //查询列表数据
        searchshopinglist() {
            var that = this;
            this.$http.get(this.$http.adornUrl2('/v1/product/groups'), {params: {pageNum: that.pageNum, pageSize: that.pageSize, type: that.formData.type}}).then(function(res) {
                if (res.data.code == 200) {
                    that.tableData = res.data.data.list;
                    that.total = res.data.data.total;
                }
            });
        },
        currentchange(value) {
            this.pageNum = value;
            this.searchshopinglist();
        },
        //是否推荐
        isRecommend(item) {
            //console.log(item)
            const that = this;
            that.$http.put(this.$http.adornUrl2('/v1/product/groups/' + item.groupId), {isDisplayed: item.isDisplayed}).then(function(res) {
                if (res.data.code == 201) {
                    that.searchshopinglist();
                }
            });
        },
        typeChange() {
            this.searchshopinglist();
        },
        //新增专题
        addSpecial(item) {
            //console.log(item)
            this.textarea = '';
            this.dialogVisible = true;
            this.textAreaShow = true;
            this.newAddSpecial.newGroupName = '';
            this.newAddSpecial.newGroupLocation = '';
            this.newAddSpecial.newisRecommended = false;
            this.EditGoods = item;
            //console.log('EditGoods--'+item)
        },
        //编辑专题
        editSpecial(item, index) {
            //console.log(item)
            this.dialogVisible = true;
            this.textAreaShow = false;
            this.newAddSpecial.newGroupId = item.groupId;
            this.newAddSpecial.newGroupName = item.groupName;
            this.textarea = item.remark;
            this.newAddSpecial.newisRecommended = item.isDisplayed;
            this.EditGoods = index;
        },
        //新增专题---确认
        editConfirm(item) {
            const newGroupName = this.newAddSpecial.newGroupName;
            const newGroupLocation = this.newAddSpecial.newGroupLocation;
            const newisRecommended = this.newAddSpecial.newisRecommended;
            const newRemark = this.textarea;
            const param = {
                type: newGroupLocation,
                groupName: newGroupName,
                remark: newRemark,
                contentKind: null,
            };
            if (this.groupLook == true) {
                param.contentKind = this.groupLookValue;
            } else {
                param.contentKind = 1;
            }
            const that = this;
            if (param.groupName.length === 0 || param.groupName.length > 4) {
                this.$message.error('请输入2~4个字的专题名称！');
                return false;
            }
            if (this.textarea.length === 0 || this.textarea.length > 31) {
                this.$message.error('请输入30个字以内的专题描述！');
                return false;
            }
            // 新增专题
            if (this.EditGoods == 0) {
                //console.log(param)
                if (param.type.length === 0) {
                    this.$message.error('请选择推荐位置！');
                    return false;
                }
                that.$http.post(this.$http.adornUrl2('/v1/product/groups'), param).then(function(res) {
                    //console.log(res.data);
                    if (res.data.code == 201) {
                        that.dialogVisible = false;
                        that.searchshopinglist();
                    }
                });
            } else {
                //    编辑
                const param2 = {
                    groupName: newGroupName,
                    remark: newRemark,
                };
                //    that.newAddSpecial.newGroupId
                that.$http.put(this.$http.adornUrl2('/v1/product/groups/' + that.newAddSpecial.newGroupId), param2).then(function(res) {
                    if (res.data.code == 201) {
                        that.dialogVisible = false;
                        that.searchshopinglist();
                    }
                });
            }
        },
        // 新增的推荐类型--美食有商品和商铺/优品没有商铺，不传默认后端处理
        groupLocationChange(value) {
            if (value == 21) {
                this.groupLook = true;
            }
            if (value == 31) {
                this.groupLook = false;
            }
        },
        // 弹框关闭的回调事件
        closeDialog() {
            this.groupLook = false;
            this.groupLookValue = '';
        },
        //新增专题---取消
        editCancel() {
            this.dialogVisible = false;
        },
        //置顶专题
        stick(item, param) {
            //console.log(item.groupId)
            const groupId = item.groupId;
            const that = this;
            this.$http.put(this.$http.adornUrl2('/v1/product/groups/' + groupId + '/sorts/'), {type: 1}).then(function(res) {
                //console.log(res.data);
                if (res.data.code === 201) {
                    that.searchshopinglist();
                }
            });
        },
        //删除专题
        isdelete(item) {
            const that = this;
            //console.log(item)
            const groupId = item.groupId;
            this.$confirm('此操作将永久删除该专题, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                that.$http
                    .delete(this.$http.adornUrl2('/v1/product/groups/' + groupId))
                    .then(function(res) {
                        //console.log(res.data)
                        that.searchshopinglist();
                    })
                    .catch(function(error) {
                        that.$message.error(error);
                    });
            });
        },
        //关联商品
        relevance(item) {
            this.$router.push({path: '/crossProducts', query: {groupId: item.groupId, shopId: item.shopId, type: item.type}});
        },
        type(row, column) {
            switch (row.type) {
                case 21:
                    return '美食首页推荐分组';
                    break;
                case 31:
                    return '优品首页推荐分组优品';
                    break;
            }
        },
        contentKind(row, column) {
            switch (row.contentKind) {
                case 1:
                    return '商品列表';
                    break;
                case 2:
                    return '商铺列表';
                    break;
            }
        },
    },
};
</script>
<style lang="stylus" scoped>
.btn-add{
    float:right;
    margin: 10px 80px 0 0;
  }
.breadcrumb{
    height: 50px;
    background: #fff;
    padding-left: 30px;
  }
.dialog-left{
    display: inline-block;
    margin-right: 10px;
    em{
        color: red;
      }
}
.dialog-left+div{
    display: inline-block;
    position: absolute;
    left: 82px;
}
.morestore >>> .el-form-item{
  padding-left: 30px;
  margin: 10px 0;
}
.tabletitle{
    height:30px;
}
</style>
