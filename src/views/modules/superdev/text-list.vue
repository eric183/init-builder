<template>
    <div>
        <div class="test_block">
            <el-dialog :visible.sync="visable" @close="closeDialog">
                <!-- 检查项 -->
                <p class="text_title">
                    <span>检查项</span>
                    <el-button v-if="isTrue" key="add" type="success" size="mini" @click="addVisable = true">新增检查项</el-button>
                </p>
                <el-table :data="dataList" border style="width: 100%;">
                    <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
                    <el-table-column prop="content" header-align="center" align="center" label="检查内容"> </el-table-column>
                    <el-table-column prop="standard" header-align="center" align="center" label="任务完成标准"> </el-table-column>
                    <el-table-column header-align="center" align="center" width="100" v-if="isTrue" key="ope" label="操作">
                        <template slot-scope="scope">
                            <el-button type="danger" plain size="mini" @click="dele(scope.$index, scope.row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>
        </div>
        <div>
            <el-dialog :visible.sync="addVisable">
                <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px" size="small">
                    <el-form-item label="检查内容" prop="content"> <el-input placeholder="检查内容" v-model="dataForm.content" clearable></el-input> </el-form-item>
                    <el-form-item label="完成标准" prop="standard"> <el-input type="textarea" placeholder="完成标准" v-model="dataForm.standard" clearable></el-input> </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button size="small" @click="addVisable = false">取消</el-button>
                    <el-button size="small" type="primary" @click="dataFormSubmit()">确定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            dataList: [], //检查项列表的数据
            deviceIdList: [], //检查项与设备id关联的对象数组
            visable: false, //检查项弹框
            addVisable: false, //检查项新增弹框
            isTrue: false, //新增，删除 是否存在   详情的检查项点击进来没有
            refId: null, //巡检计划与设备关联id
            dataForm: {
                content: '',
                standard: '',
            },
            dataRule: {
                content: [{required: true, message: '必填', trigger: 'blur'}],
                standard: [{required: true, message: '必填', trigger: 'blur'}],
            },
            deviceId: null, //新增计划传过来的设备id--用于数据处理的
        };
    },
    methods: {
        init(obj) {
            this.dataList = [];
            if (obj.isTrue == 'false') {
                // 详情
                this.refId = obj.id;
                this.isTrue = false;
                this.getTestData();
            }
            if (obj.isTrue == 'true') {
                // 新增。编辑
                this.isTrue = true;
                if (obj.id) {
                    // 编辑
                    this.refId = obj.id;
                    this.getTestData();
                } else {
                    // 新增
                    this.deviceId = obj.deviceId;
                    // let isTrue = this.deviceIdList.some((obj) => {
                    //   return this.deviceId == obj.id;
                    // });
                    // if(isTrue){
                    //     this.dataList=this.deviceIdList[i].list
                    // }
                    for (var i = 0; i < this.deviceIdList.length; i++) {
                        if (this.deviceIdList[i].id == this.deviceId) {
                            this.dataList = this.deviceIdList[i].list;
                        }
                    }
                }
            }
            this.visable = true;
        },
        // 查询检查项列表数据--编辑,详情进来查询
        getTestData() {
            this.$http({
                url: this.$http.adornUrl(`/v1/pm/check/plans/detections`),
                method: 'get',
                params: this.$http.adornParams({
                    refId: this.refId,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.dataList = data.data.detections;
                }
            });
        },
        // 新增检查项弹框的确定
        dataFormSubmit() {
            // 新增
            if (!this.refId) {
                const obj = {
                    content: this.dataForm.content,
                    standard: this.dataForm.standard,
                };
                this.dataList.push(obj);
                this.addVisable = false;
            } else {
                //编辑
                this.$refs['dataForm'].validate(valid => {
                    if (valid) {
                        this.$http({
                            url: this.$http.adornUrl(`/v1/pm/check/plans/detections`),
                            method: 'post',
                            data: this.$http.adornData({
                                refId: this.refId,
                                content: this.dataForm.content,
                                standard: this.dataForm.standard,
                            }),
                        }).then(({data}) => {
                            if (data && data.code === 201) {
                                this.$message({
                                    message: '操作成功',
                                    type: 'success',
                                    duration: 1000,
                                    onClose: () => {
                                        this.addVisable = false;
                                        this.getTestData();
                                    },
                                });
                            }
                        });
                    }
                });
            }
        },
        // 删除检查项
        dele(val, id) {
            //新增
            if (!this.refId) {
                this.dataList.splice(val, 1);
            } else {
                //编辑
                this.$http({
                    url: this.$http.adornUrl('/v1/pm/check/plans/detections/' + id),
                    method: 'delete',
                }).then(({data}) => {
                    this.getTestData();
                });
            }
        },
        // 检查项列表关闭的数据传给plain-add页面
        closeDialog() {
            let isTrue = this.deviceIdList.some(obj => {
                return this.deviceId == obj.id;
            });
            !isTrue &&
                this.deviceIdList.push({
                    id: this.deviceId,
                    list: this.dataList,
                });
            this.$emit('detections', this.dataList);
        },
    },
};
</script>
<style lang="scss" scoped>
.test_block {
    .el-input,
    .el-select {
        width: 110px;
    }
    .aa {
        .el-input {
            width: 140px;
        }
    }
}
.text_title {
    display: flex;
    justify-content: space-between;
    margin-top: 0;
    span {
        line-height: 28px;
        font-size: 14px;
        font-weight: 700;
    }
}
</style>
