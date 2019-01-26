<template>
    <div class="feedback">
        <!-- 处理反馈 -->
        <div class="goBack"><el-button size="mini" type="primary" @click="$router.go(-1)">返回</el-button></div>
        <div v-for="(item, index) in dataList" :key="index">
            <p><span>设备信息:</span></p>
            <ul>
                <li><span>序号</span> <span>设备名称</span> <span>设备编号</span> <span>设备类型</span> <span>规格型号</span> <span>安装楼层</span> <span>具体位置</span></li>
                <li class="last">
                    <span>{{ index }}</span> <span>{{ item.name }}</span> <span>{{ item.deviceSn }}</span> <span>{{ item.typeDesc }}</span> <span>{{ item.model }}</span>
                    <span>{{ item.floorName }}</span> <span>{{ item.position }}</span>
                </li>
            </ul>
            <p>检查项:</p>
            <el-table :data="item.detections" border style="width: 100%;">
                <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
                <el-table-column prop="content" header-align="center" align="center" label="检查内容"> </el-table-column>
                <el-table-column prop="standard" header-align="center" align="center" label="任务完成标准"> </el-table-column>
                <el-table-column header-align="center" align="center" width="240" label="操作">
                    <template slot-scope="scope">
                        <el-radio-group v-model="dataList[index]['detections'][scope.$index]['radio']" @change="radioChange(scope.row.id, dataList[index]['detections'][scope.$index]['radio'])">
                            <el-radio :label="1">正常</el-radio>
                            <el-radio :label="2">异常</el-radio>
                        </el-radio-group>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px" size="small">
            <el-form-item label="处理详情" prop="capacity" class="mt10"> <el-input v-model="dataForm.feedbackInfo" type="textarea" placeholder="处理详情"></el-input> </el-form-item>
            <el-form-item class="mt10 leftbtn">
                <el-button size="mini" type="primary" @click="$router.go(-1)">返回</el-button>
                <el-button type="success" size="mini" @click="dataFormSubmit()">确认</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            dataList: [],
            textdataList: [],
            radios: [], //检查项正常异常的radio选项
            taskId: null,
            dataForm: {},
            dataRule: {},
        };
    },
    activated() {
        this.getDataList();
    },
    methods: {
        // 获取数据列表
        getDataList() {
            this.taskId = this.$route.query.taskId; //路由跳转拿到参数
            this.$http({
                url: this.$http.adornUrl('/v1/pm/check/tasks/' + this.taskId + '/feedbackDetails'),
                method: 'get',
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.dataList = data.data.devices;
                }
            });
        },
        // 正常，异常的radio change切换事件
        radioChange(id, value) {
            this.$http({
                url: this.$http.adornUrl(`/v1/pm/check/tasks/detections/` + id),
                method: 'put',
                data: this.$http.adornData({
                    status: value,
                }),
            }).then(({data}) => {});
        },
        dataFormSubmit() {
            this.$http({
                url: this.$http.adornUrl('/v1/pm/check/tasks/' + this.taskId + '/actions'),
                method: 'post',
                data: this.$http.adornData({
                    feedbackInfo: this.dataForm.feedbackInfo,
                    type: 5,
                }),
            }).then(({data}) => {
                this.$router.push({name: 'superdev-task'});
            });
        },
    },
};
</script>
<style lang="scss" scoped>
.feedback {
    position: relative;
    .goBack {
        position: absolute;
        right: 0;
        top: -10px;
    }
    ul {
        padding-left: 0;
        li {
            display: flex;
            span:nth-child(1) {
                flex: 1;
            }
            span {
                width: 15%;
                text-align: center;
                padding: 16px 0;
                border-left: 1px solid #ebeef5;
                border-top: 1px solid #ebeef5;
            }
            span:nth-child(7) {
                border-right: 1px solid #ebeef5;
            }
        }
        .last {
            span {
                border-bottom: 1px solid #ebeef5;
            }
        }
    }
    .el-textarea {
        width: 50%;
    }
}
</style>
