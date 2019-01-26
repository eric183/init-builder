<template>
    <div class="mod-user">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataListFun()" size="small">
            <el-form-item> <el-input v-model="dataForm.companyName" placeholder="公司名称" clearable></el-input> </el-form-item>
            <!-- <el-form-item>
        <el-input v-model="dataForm.floorName" placeholder="公司所在楼层" clearable></el-input>
      </el-form-item> -->
            <el-form-item>
                <el-button type="primary" @click="getDataListFun()">查询</el-button>
                <el-button type="success" @click="addOrUpdateHandle()">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="companyName" header-align="center" align="center" min-width="180" label="公司名称"> </el-table-column>
            <el-table-column header-align="center" prop="floorName" align="center" min-width="120" label="公司所在楼层">
                <!-- <template slot-scope="scope">
              <span class="mr10" v-for="(item,index) in scope.row.companyFloors" :key="item.floorId"><em>{{item.floorName}}</em><br v-show="(index+1)%6==0 && (index+1)>=6"></span>
          </template> -->
            </el-table-column>
            <el-table-column prop="contacts" header-align="center" align="center" label="联系人"> </el-table-column>
            <el-table-column prop="phone" header-align="center" align="center" label="联系电话"> </el-table-column>
            <el-table-column :formatter="isVmChecked" header-align="center" align="center" width="80" label="访客审核"> </el-table-column>
            <el-table-column header-align="center" align="center" min-width="80" label="操作">
                <template slot-scope="scope">
                    <el-button type="success" plain size="mini" @click="updateCompany(scope.row)">修改</el-button>
                    <el-button type="danger" plain size="mini" @click="isdelete(scope.row.companyId)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="totalPage"
            layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
        <!-- 弹窗, 新增 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
        <el-dialog title="修改" :close-on-click-modal="false" :visible.sync="visible">
            <el-form :model="companyForm" :rules="dataRule" ref="dataFormRef" @keyup.enter.native="dataFormSubmit()" label-width="120px" size="small">
                <el-form-item label="公司名称" prop="companyName"> <el-input v-model="companyForm.companyName" placeholder="公司名称不超过20个字"></el-input> </el-form-item>
                <el-form-item label="楼层名称" prop="floorName"> <el-input v-model="companyForm.floorName" placeholder="多个楼层请用逗号(,)区分"></el-input> </el-form-item>
                <el-form-item label="实际楼层" prop="actualFloorNo">
                    <el-input v-model="companyForm.actualFloorNo" placeholder="多个楼层请用逗号(,)区分,且与上面楼层名称对应"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="visible = false">取消</el-button>
                <el-button size="small" type="primary" @click="dataFormSubmit()">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import AddOrUpdate from './company-add-or-update';
export default {
    data() {
        return {
            dataForm: {
                companyName: '',
            },
            companyForm: {
                companyName: '',
                floorName: '',
                actualFloorNo: '',
                companyId: null,
            },
            floorList: [], //放楼层的数组
            actuFloorList: [], //放实际楼层的数组
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            dataListLoading: false,
            addOrUpdateVisible: false,
            visible: false, //企业修改的弹框
            dataRule: {
                companyName: [{required: true, message: '公司名称不能为空', trigger: 'blur'}, {min: 1, max: 30, message: '长度不超过20个字', trigger: 'blur'}],
                floorName: [{required: true, message: '楼层名称不能为空', trigger: 'blur'}],
                actualFloorNo: [{required: true, message: '实际楼层不能为空', trigger: 'blur'}],
            },
        };
    },
    components: {
        AddOrUpdate,
    },
    activated() {
        this.getDataList();
    },
    methods: {
        getDataListFun() {
            this.pageIndex = 1;
            this.getDataList();
        },
        // 获取数据列表
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v1/visitor/companys'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: this.pageIndex,
                    pageSize: this.pageSize,
                    companyName: this.dataForm.companyName,
                }),
            }).then(({data}) => {
                if (data.code == 200) {
                    this.dataList = data.data.list;
                    this.totalPage = data.data.total;
                } else {
                    this.dataList = [];
                    this.totalPage = 0;
                }
                this.dataListLoading = false;
            });
        },
        // 每页数
        sizeChangeHandle(val) {
            this.pageSize = val;
            this.pageIndex = 1;
            this.getDataList();
        },
        // 当前页
        currentChangeHandle(val) {
            this.pageIndex = val;
            this.getDataList();
        },
        addOrUpdateHandle() {
            this.addOrUpdateVisible = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init();
            });
        },
        // 修改企业信息的弹框打开
        updateCompany(obj) {
            this.companyForm.companyName = obj.companyName;
            this.companyForm.floorName = obj.floorName;
            this.companyForm.actualFloorNo = obj.actualFloorNo;
            this.companyForm.companyId = obj.companyId;
            this.visible = true;
        },
        // 删除
        isdelete(companyId) {
            this.$confirm(`确定进行删除操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$http({
                        url: this.$http.adornUrl('/v1/visitor/companys/' + companyId),
                        method: 'delete',
                    }).then(({data}) => {
                        this.getDataList();
                    });
                })
                .catch(() => {});
        },
        // 修改企业信息的确定
        dataFormSubmit() {
            var list = [];
            if (String(this.companyForm.floorName).indexOf('，') != -1 || String(this.companyForm.floorName).indexOf(',') != -1) {
                if (String(this.companyForm.floorName).indexOf('，') != -1) {
                    this.companyForm.floorName = this.companyForm.floorName.replace(/，/gi, ',');
                }
                if (String(this.companyForm.actualFloorNo).indexOf('，') != -1) {
                    this.companyForm.actualFloorNo = this.companyForm.actualFloorNo.replace(/，/gi, ',');
                }
                this.floorList = this.companyForm.floorName.split(',');
                this.actuFloorList = this.companyForm.actualFloorNo.split(',');
                for (var i in this.floorList) {
                    var obj2 = {};
                    obj2.floorName = this.floorList[i];
                    obj2.actualFloorNo = this.actuFloorList[i];
                    list.push(obj2);
                }
            } else {
                var obj = {};
                obj.floorName = this.companyForm.floorName;
                obj.actualFloorNo = this.companyForm.actualFloorNo;
                list.push(obj);
            }
            this.$refs['dataFormRef'].validate(valid => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl('/v1/visitor/companys'),
                        method: 'put',
                        data: this.$http.adornData({
                            companyId: this.companyForm.companyId,
                            companyName: this.companyForm.companyName,
                            companyFloors: list,
                            // 'floorName': this.companyForm.floorName,
                            // 'actualFloorNo': this.companyForm.actualFloorNo
                        }),
                    }).then(({data}) => {
                        if (data && data.code === 201) {
                            this.isclick = true;
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.visible = false;
                                    this.getDataList();
                                },
                            });
                        }
                    });
                }
            });
        },
        isVmChecked(item) {
            switch (item.isVmChecked) {
                case 1:
                    return '需要';
                    break;
                case 0:
                    return '不需要';
                    break;
            }
        },
    },
};
</script>
