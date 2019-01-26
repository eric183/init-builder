<template>
    <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px" size="small">
            <el-form-item label="楼栋" prop="buildingId">
                <el-select v-model="dataForm.buildingId" placeholder="请选择楼栋" @change="buildChange(dataForm.buildingId)">
                    <el-option v-for="item in buildinglist" :key="item.buildingId" :label="item.name" :value="item.buildingId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="楼层" prop="floorId">
                <el-select placeholder="请选择楼层" v-model="dataForm.floorId">
                    <el-option v-for="item in foorlist" :key="item.floorId" :label="item.name" :value="item.floorId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select placeholder="请选择门牌状态" v-model="dataForm.status">
                    <el-option v-for="item in doorStatusList" :key="item.id" :label="item.label" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="门牌号" prop="name"> <el-input v-model="dataForm.name" placeholder="门牌号"></el-input> </el-form-item>
            <el-form-item label="门牌面积(m2)" prop="totalArea"> <el-input v-model="dataForm.totalArea" placeholder="建筑面积"></el-input> </el-form-item>
            <el-form-item label="公摊面积(m2)" prop="publicArea"> <el-input v-model="dataForm.publicArea" placeholder="公摊面积"></el-input> </el-form-item>
            <el-form-item label="出租面积(m2)" prop="rentedArea"> <el-input v-model="dataForm.rentedArea" placeholder="出租面积"></el-input> </el-form-item>
            <el-form-item label="朝向" prop="orient"> <el-input v-model="dataForm.orient" placeholder="朝向"></el-input> </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="visible = false">取消</el-button>
            <el-button size="small" type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            foorlist: [],
            visible: false,
            roleList: [],
            // 下拉列表默认pageSize为999
            pageIndex: 1,
            pageSize: 999,
            buildinglist: [],
            dataForm: {
                id: 0,
                name: '',
                totalArea: '',
                publicArea: '',
                rentedArea: '',
                floorId: '',
                buildingId: '',
                orient: '',
                status: '',
            },
            doorStatusList: [{id: 1, label: '出租'}, {id: 2, label: '已售'}, {id: 3, label: '自用'}, {id: 4, label: '待租'}, {id: 5, label: '待售'}, {id: 6, label: '其他'}, {id: 7, label: '停用'}],
            dataRule: {
                doorplateName: [{required: true, message: '用户名不能为空', trigger: 'blur'}],
                buildingId: [{required: true, message: '楼栋不能为空', trigger: 'blur'}],
                name: [{required: true, message: '门牌不能为空', trigger: 'blur'}],
                floorId: [{required: true, message: '所在楼层不能为空', trigger: 'blur'}],
                status: [{required: true, message: '门牌状态不能为空', trigger: 'blur'}],
            },
        };
    },
    methods: {
        // 查询楼栋列表 （默认项目第一个id作为楼栋列表）
        _searchbuild() {
            this.$http({
                url: this.$http.adornUrl('/v1/building/buildings'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: this.pageIndex,
                    pageSize: this.pageSize,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.buildinglist = data.data.list;
                } else {
                    this.buildinglist = [];
                }
            });
        },
        // 查询楼层列表
        getFloorList() {
            this.$http({
                url: this.$http.adornUrl('/v1/building/floors'),
                method: 'get',
                params: this.$http.adornParams({
                    buildingId: this.dataForm.buildingId,
                    pageNum: this.pageIndex,
                    pageSize: this.pageSize,
                }),
            }).then(({data}) => {
                this.foorlist = data && data.code === 200 ? data.data.list : [];
            });
        },
        // 楼栋下拉将楼栋id存起来
        buildChange(value) {
            this.dataForm.buildingId = value;
            this.getFloorList();
        },
        init(id) {
            this.dataForm.id = id || 0;
            this._searchbuild();
            this.visible = true;
            this.$nextTick(() => {
                this.$refs['dataForm'].resetFields();
                if (this.dataForm.id) {
                    this.$http({
                        url: this.$http.adornUrl(`/v1/building/doorplates/${this.dataForm.id}`),
                        method: 'get',
                        params: this.$http.adornParams({
                            pageNum: 1,
                            pageSize: 9999,
                        }),
                    }).then(({data}) => {
                        if (data && data.code === 200) {
                            this.dataForm.name = data.data.name;
                            this.dataForm.totalArea = data.data.totalArea;
                            this.dataForm.publicArea = data.data.publicArea;
                            this.dataForm.rentedArea = data.data.rentedArea;
                            this.dataForm.floorId = data.data.floorId;
                            this.dataForm.buildingId = data.data.buildingId;
                            this.dataForm.orient = data.data.orient;
                            this.dataForm.status = data.data.status;
                            this.getFloorList();
                        }
                    });
                }
            });
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs['dataForm'].validate(valid => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl(`/v1/building/doorplates`),
                        method: this.dataForm.id == 0 ? 'post' : 'put',
                        data: this.$http.adornData({
                            doorplateId: this.dataForm.id || undefined,
                            name: this.dataForm.name,
                            totalArea: this.dataForm.totalArea,
                            publicArea: this.dataForm.publicArea,
                            rentedArea: this.dataForm.rentedArea,
                            floorId: this.dataForm.floorId,
                            orient: this.dataForm.orient,
                            buildingId: this.dataForm.buildingId,
                            status: this.dataForm.status,
                        }),
                    }).then(({data}) => {
                        if (data && data.code === 201) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.visible = false;
                                    this.$emit('refreshDataList');
                                },
                            });
                        }
                    });
                }
            });
        },
    },
};
</script>
<style lang="scss" scoped>
.el-select {
    width: 100%;
}
</style>
