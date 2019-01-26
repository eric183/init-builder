<template>
    <div class="storedetail">
        <!-- 首页推荐分组 -->
        <!-- <p class="tabletitle">
            <span></span>
            <el-button type="primary" size="mini" @click="addSpecial(0)">新增专题</el-button>  
        </p> -->
        <div class="admin">
            <el-table :data="tableData" center="all" border style="width: 100%">
                <el-table-column align="center" type="index" width="50" label="序号"> </el-table-column>
                <el-table-column align="center" prop="groupName" label="专题名称">
                    <template slot-scope="scope">
                        <router-link :to="{path: '/IndexShop', query: {groupId: scope.row.groupId}}"
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
                <el-table-column align="center" prop="remark" label="分组备注"> </el-table-column>
                <el-table-column align="center" label="操作" width="320">
                    <template slot-scope="scope">
                        <el-button type="success" v-if="isAuth('product:groups:updateGroup')" plain size="mini" @click="editSpecial(scope.row, 1)">编辑</el-button>
                        <el-button type="success" v-if="isAuth('product:groups:sortGroup')" plain size="mini" @click="stick(scope.row, 1)">置顶</el-button>
                        <el-button type="danger" v-if="isAuth('product:groups:deleteGroup')" plain size="mini" @click="isdelete(scope.row)">删除</el-button>
                        <el-button type="success" v-if="isAuth('product:groups:bindGroupGoods')" plain size="mini" @click="relevance(scope.row)">关联商品</el-button>
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
                    <el-form-item label="专题名称"> <el-input placeholder="请输入专题名称(4个字以内)" v-model="newAddSpecial.newGroupName"></el-input> </el-form-item>
                    <el-form-item label="推荐类型" v-show="textAreaShow">
                        <el-select placeholder="请选择" v-model="newAddSpecial.newGroupLocation">
                            <el-option v-for="item in newAddSpecial.shoplist2" :key="item.id" :label="item.groupLocation" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="专题描述"> <el-input type="textarea" v-model="textarea" :autosize="{minRows: 2, maxRows: 4}" placeholder="请输入内容"> </el-input> </el-form-item>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="editConfirm('edit')">确 定</el-button>
            </span>
        </el-dialog>
        <p class="title"><span style="color:#f56c6c">！</span><span>温馨提示：请勿删除列表中专题，若删除将无法恢复</span></p>
    </div>
</template>
<script>
export default {
    name: 'Indexlist',
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.ruleForm2.checkPass !== '') {
                    this.$refs.ruleForm2.validateField('checkPass');
                }
                callback();
            }
        };
        return {
            rules2: {
                newGroupName: [{validator: validatePass, trigger: 'blur'}],
            },
            tableData: [], //页面初始数据
            shopId: null, //登录时候选择店铺，先写死
            value1: '',
            total: 0,
            pageNum: 1, //当前页数
            pageSize: 100, //每页数量
            goodsId: 0, //选中的商品id
            storeAdddialog: false,
            dialogVisible: false,
            value: '', //店铺类型下拉绑定的key值
            newAddSpecial: {
                shoplist2: [
                    {
                        groupLocation: 'APP端首页美食分组',
                        id: 11,
                    },
                    {
                        groupLocation: 'APP端首页优品分组',
                        id: 12,
                    },
                ],
                newGroupName: '',
                newGroupLocation: '',
                newisRecommended: false,
                newGroupId: 0,
            },
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
            this.$http.get(this.$http.adornUrl2('/v1/product/groups'), {params: {pageNum: that.pageNum, pageSize: that.pageSize, type: '11,12'}}).then(function(res) {
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
            };
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
                    // console.log(res.data);
                    if (res.data.code == 201) {
                        that.dialogVisible = false;
                        that.searchshopinglist();
                    }
                });
            }
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
                // console.log(res.data);
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
        // 弹框关闭
        closeDialog() {},
        type(row, column) {
            switch (row.type) {
                case 11:
                    return 'APP端首页美食分组';
                    break;
                case 12:
                    return 'APP端首页优品分组';
                    break;
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.title {
    text-align: center;
    color: #999999;
}
</style>
