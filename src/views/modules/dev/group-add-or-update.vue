<template>
    <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px" size="small">
            <el-form-item label="分组名称" prop="name"> <el-input v-model="dataForm.name" placeholder="分组名称"></el-input> </el-form-item>
            <el-form-item label="设备组类型" prop="type">
                <el-select v-model="dataForm.type"> <el-option v-for="item in devicegroupTypeList" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
            </el-form-item>
            <el-form-item label="楼栋" prop="buildingId">
                <el-select v-model="dataForm.buildingId" placeholder="楼栋">
                    <el-option v-for="item in buildinglist" :key="item.buildingId" :label="item.name" :value="item.buildingId"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="visible = false">取消</el-button>
            <el-button size="small" type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import {isEmail, isMobile} from '@/utils/validate';
export default {
    data() {
        return {
            devicegroupTypeList: [{value: 11, label: '普通电梯分组'}, {value: 12, label: '高级电梯分组'}],
            buildinglist: [], //楼栋列表
            foorlist: [],
            visible: false,
            buildlist: [],
            roleList: [],
            dataForm: {
                id: 0,
                name: '',
                type: '',
                buildingId: '',
            },
            dataRule: {
                name: [{required: true, message: '请输入分组名称', trigger: 'blur'}],
                type: [{required: true, message: '请输入设备分组类型', trigger: 'blur'}],
                buildingId: [{required: true, message: '请选择楼栋', trigger: 'blur'}],
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
                    pageNum: 1,
                    pageSize: 9999,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.buildinglist = data.data.list;
                } else {
                    this.buildinglist = [];
                }
            });
        },
        init(id) {
            this._searchbuild();
            this.visible = true;
            this.dataForm.id = id || 0;
            this.$nextTick(() => {
                this.$refs['dataForm'].resetFields();
                if (this.dataForm.id) {
                    this.$http({
                        url: this.$http.adornUrl(`/v1/access/groups/${this.dataForm.id}`),
                        method: 'get',
                        params: this.$http.adornParams(),
                    }).then(({data}) => {
                        if (data && data.code === 200) {
                            (this.dataForm.name = data.data.name), (this.dataForm.buildingId = data.data.buildingId), (this.dataForm.type = data.data.type);
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
                        url: this.$http.adornUrl(`/v1/access/groups`),
                        method: this.dataForm.id == 0 ? 'post' : 'put',
                        data: this.$http.adornData({
                            groupId: this.dataForm.id || undefined,
                            buildingId: this.dataForm.buildingId,
                            name: this.dataForm.name,
                            type: this.dataForm.type,
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
