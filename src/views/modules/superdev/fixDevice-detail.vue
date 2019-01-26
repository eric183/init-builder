<template>
    <el-row>
        <el-row class="statusBar_container">
            <el-col :span="12" class="f14">
                <span class="c666 pad_l_16">维修状态：</span><span class="fb">{{ orderStatusArr[orderStatus - 1].name }}</span>
            </el-col>
            <el-col :span="12" class="f14">
                <el-row style="float: right;margin-right: 16px;">
                    <el-button size="small" type="success" @click="$router.push({name: 'superdev-fixDevice'})">返回列表</el-button>
                    <!-- <el-button v-if="!isEvaluated"  v-for="(button_conf,index) in orderStatusArr[orderStatus - 1].buttons" @click="function(e){button_conf.event && button_conf.event(e)}" :key="index" :style="button_conf.style" :size="button_conf.size || 'small'" :type="button_conf.type || 'primary'">{{button_conf.text || ''}}</el-button> -->
                </el-row>
            </el-col>
        </el-row>
        <el-row>
            <el-row v-for="(info, index) in devicesInfo" :key="index">
                <el-row class="title_container f14 h_44"> {{ info.title }}: </el-row>
                <el-row class="info_container">
                    <el-row>
                        <el-col :span="8" class="info_cell" v-for="(item, index) in info.conf" :key="index">
                            <el-col :span="8" class="f12 c333 talign_r" style="max-width: 64px;margin-right: 8px;"> {{ item.name && item.name + ':' }} </el-col>
                            <el-col class="c666" v-if="typeof item.val == 'object'" style="">
                                <span v-for="(obj, i) in item.val" :key="i" class="mr10">
                                    <i v-if="obj.type == 2" style="margin-right:5px;"> {{ obj.departmentName }} </i> <i v-if="obj.type == 2"> {{ obj.realName }} </i>
                                </span>
                            </el-col>
                            <el-col class="c666" v-else> {{ item.val }} </el-col>
                        </el-col>
                    </el-row>
                    <el-row v-if="index == 1">
                        <el-row class="margin_top_20" style="display: flex;justify-content: flex-start;margin-bottom: 20px;" v-if="imageArr.length">
                            <el-col :span="8" class="f12 c333 talign_r" style="max-width: 64px;margin-right: 8px;margin-left: 16px;"> 图片: </el-col>
                            <img style="margin-right: 16px;height:100px;width:auto" v-for="(src, index) in imageArr" :src="src" :key="index" />
                        </el-row>
                    </el-row>
                    <el-row v-if="index == 3">
                        <el-col style="position: absolute;width: 40px;height: 100%;top: 0px;">
                            <div v-for="(col, index) in tableConf.data" :key="index" class="dot_container" :style="{top: (index + 0.5) * 105 + 5 + 48 + 'px'}">
                                <span style="position: absolute; width: 7px;height: 7px; background: #999;border-radius: 3.5px;"></span>
                                <span v-if="index != tableConf.data.length - 1" style="position: absolute; width: 1px;height: 100%; background: #999;left: 3px;"></span>
                            </div>
                        </el-col>
                        <el-col>
                            <el-table :data="tableConf.data" style="margin: 10px 40px;">
                                <el-table-column
                                    align="center"
                                    v-for="(col, index) in tableConf.colConf"
                                    :key="index"
                                    :prop="col.prop"
                                    :label="col.lab"
                                    :width="col.width || null"
                                    style="position: relative;"
                                >
                                    <template slot-scope="scope">
                                        <el-row v-if="index == 4" style="height: 80px;">
                                            <span v-if="scope.row[scope.column.property]" v-for="(item, i) in scope.row[scope.column.property]" :key="i" class="mr10">
                                                <el-popover placement="right" trigger="click">
                                                    <img :src="item" style="max-width:720px;max-height:600px;" /> <img slot="reference" :src="item" style="width:auto;height:80px" />
                                                </el-popover>
                                            </span>
                                        </el-row>
                                        <el-row v-else> {{ index == 0 ? translateTimeStamp(scope.row[scope.column.property]) : scope.row[scope.column.property] }} </el-row>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-col>
                    </el-row>
                </el-row>
            </el-row>
        </el-row>
        <TeamWorker ref="teamworker"></TeamWorker>
        <TeamWorker ref="translate" type="translate"></TeamWorker>
        <FeedBack ref="feedback"></FeedBack>
        <FeedBack ref="remark" type="remark"></FeedBack>
    </el-row>
</template>

<script>
import ZZTable from '@/views/modules/UIModules/Table';
import TeamWorker from '@/views/modules/superdev/add_teamworker';
import FeedBack from '@/views/modules/superdev/fixDevice_feedback';
import {prioritys, order_origin, fix_status} from '@/assets/js/Const';
export default {
    components: {
        ZZTable,
        TeamWorker,
        FeedBack,
    },
    data() {
        return {
            orderStatus: 1,
            isEvaluated: 0, //是否已评价
            imageArr: [],
            orderStatusArr: [
                {
                    name: '待接收',
                    buttons: [
                        {
                            text: '接收',
                            event: () => {
                                this.postInfo({}, '接收成功', 2);
                            },
                        },
                        {
                            text: '转派',
                            event: () => {
                                this.$refs.translate.show();
                            },
                        },
                    ],
                },
                {
                    name: '待处理',
                    buttons: [
                        {
                            text: '立即处理',
                            event: () => {
                                // 提交数据
                                this.$http({
                                    url: this.$http.adornUrl('/v1/pm/repairment/tickets/' + this.$route.query.ticketId + '/actions'),
                                    method: 'post',
                                    data: this.$http.adornData({
                                        type: '3',
                                    }),
                                }).then(({data}) => {
                                    if (data.code == 201) {
                                        this.$message({
                                            message: '处理成功',
                                            type: 'success',
                                        });
                                        this.requestData();
                                        this.orderStatus = 2;
                                    }
                                });
                            },
                        },
                    ],
                },
                {
                    name: '处理中',
                    buttons: [
                        {
                            text: '添加协作者',
                            event: () => {
                                this.$refs.teamworker.show();
                            },
                        },
                        {
                            text: '处理反馈',
                            event: () => {
                                this.$refs.feedback.show();
                            },
                        },
                    ],
                },
                {
                    name: '处理完成',
                    buttons: [
                        {
                            text: '评价',
                            event: () => {
                                this.$refs.remark.show();
                            },
                        },
                    ],
                },
            ],
            devicesInfo: [
                {
                    title: '设备信息',
                    conf: [
                        {
                            name: '设备编号',
                            val: '',
                        },
                        {
                            name: '设备名称',
                            val: '',
                        },
                        {
                            name: '规格型号',
                            val: '',
                        },
                        {
                            name: '设备类型',
                            val: '',
                        },
                        {
                            name: '安装梯层',
                            val: '',
                        },
                        {
                            name: '具体位置',
                            val: '',
                        },
                    ],
                },
                {
                    title: '设备异常信息',
                    conf: [
                        {
                            name: '创建人',
                            val: '',
                        },
                        {
                            name: '创建时间',
                            val: '',
                        },
                        {
                            name: '严重度',
                            val: '',
                        },
                        {
                            name: '紧急度',
                            val: '',
                        },
                        {
                            name: '报事人姓名',
                            val: '',
                        },
                        {
                            name: '报事人联系方式',
                            val: '',
                        },
                        {
                            name: '异常描述',
                            val: '',
                        },
                    ],
                },
                {
                    title: '异常默认执行人信息',
                    conf: [
                        {
                            name: '执行人',
                            val: '',
                        },
                        {
                            name: '协作人',
                            val: '',
                        },
                    ],
                },
                {
                    title: '处理追踪',
                    conf: [],
                },
            ],
            tableConf: {
                colConf: [
                    {
                        prop: 'createdAt',
                        lab: '时间',
                    },
                    {
                        prop: 'actionDesc',
                        lab: '处理追踪',
                    },
                    {
                        prop: 'operatorName',
                        lab: '操作人',
                    },
                    {
                        prop: 'remark',
                        lab: '处理详情',
                    },
                    {
                        prop: 'feedbackImage',
                        lab: '反馈图片',
                    },
                ],
                data: [],
            },
        };
    },
    computed: {
        prioritys() {
            return prioritys;
        },
    },
    methods: $.extend(Methods, {
        fixDevice_detail_teamworker(data) {
            // 提交数据
            this.$http({
                url: this.$http.adornUrl('/v1/pm/repairment/tickets/' + this.$route.query.ticketId + '/assignment'),
                method: 'post',
                data: this.$http.adornData({
                    type: '2',
                    userId: data.executor,
                }),
            }).then(({data}) => {
                if (data.code == 201) {
                    this.$message({
                        message: '协作者添加成功',
                        type: 'success',
                    });
                    this.requestData();
                }
            });
        },
        fixDevice_detail_feedback(data) {
            this.postInfo(data, '处理反馈成功', 4);
        },
        fixDevice_detail_translate(data) {
            // 提交数据
            this.$http({
                url: this.$http.adornUrl('/v1/pm/repairment/tickets/' + this.$route.query.ticketId + '/assignment'),
                method: 'post',
                data: this.$http.adornData({
                    type: '1',
                    userId: data.executor,
                }),
            }).then(({data}) => {
                if (data.code == 200) {
                    this.$message({
                        message: '转派成功',
                        type: 'success',
                    });
                    this.requestData();
                }
            });
        },
        fixDevice_detail_remark(data) {
            this.postInfo(data, '评价成功', 5);
        },
        postInfo(data, message, type) {
            // 提交数据
            this.$http({
                url: this.$http.adornUrl('/v1/pm/repairment/tickets/' + this.$route.query.ticketId + '/actions'),
                method: 'post',
                data: this.$http.adornData({
                    type,
                    remark: data.formData ? data.formData.detail : null,
                    feedbackImage: data.httpUrl || null,
                }),
            }).then(({data}) => {
                if (data.code == 201) {
                    this.$message({
                        message,
                        type: 'success',
                    });
                    this.requestData();
                }
            });
        },
        requestData() {
            this.$http({
                url: this.$http.adornUrl('/v1/pm/repairment/tickets/' + this.$route.query.ticketId + '/details'),
                method: 'get',
            }).then(({data}) => {
                if (data.code == 200) {
                    data = data.data;
                    this.$set(this.devicesInfo[0].conf[0], 'val', data.deviceInfo.deviceSn);
                    this.$set(this.devicesInfo[0].conf[1], 'val', data.deviceInfo.name);
                    this.$set(this.devicesInfo[0].conf[2], 'val', data.deviceInfo.model);
                    this.$set(this.devicesInfo[0].conf[3], 'val', data.deviceInfo.typeDesc);
                    this.$set(this.devicesInfo[0].conf[4], 'val', data.deviceInfo.floorName);
                    this.$set(this.devicesInfo[0].conf[5], 'val', data.deviceInfo.position);
                    if (data.ticketInfo.image == '' || data.ticketInfo.image == null) {
                        this.imageArr = [];
                    } else {
                        this.imageArr = data.ticketInfo.image.split(',');
                    }
                    this.$set(this.devicesInfo[1].conf[0], 'val', data.ticketInfo.creatorName);
                    this.$set(this.devicesInfo[1].conf[1], 'val', this.translateTimeStamp(data.ticketInfo.createdAt));
                    this.$set(this.devicesInfo[1].conf[2], 'val', this.prioritys[data.ticketInfo.importance]);
                    this.$set(this.devicesInfo[1].conf[3], 'val', this.prioritys[data.ticketInfo.priority]);
                    this.$set(this.devicesInfo[1].conf[4], 'val', data.ticketInfo.feedbackMan);
                    this.$set(this.devicesInfo[1].conf[5], 'val', data.ticketInfo.feedbackContact);
                    this.$set(this.devicesInfo[1].conf[6], 'val', data.ticketInfo.description);

                    let index = 0;
                    for (var i = 0; i < data.users.length; i++) {
                        if (data.users[i].type == 1) {
                            index = i;
                        }
                    }
                    this.$set(this.devicesInfo[2].conf[0], 'val', data.users[index].departmentName + ' ' + data.users[index].realName);
                    this.$set(this.devicesInfo[2].conf[1], 'val', data.users);
                    data.actions.map(obj => {
                        if (obj.feedbackImage) {
                            obj.feedbackImage = obj.feedbackImage.split(',');
                        }
                    });
                    this.tableConf.data = data.actions;
                    this.orderStatus = data.ticketInfo.status;
                    this.isEvaluated = data.ticketInfo.isEvaluated;
                }
            });
        },
    }),
    mounted() {},
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.orderStatus = vm.$route.query.status;
            vm.requestData();
        });
    },
};
</script>

<style>
.statusBar_container {
    height: 55px;
    display: flex;
    align-items: center;
    border: 1px solid #dddddd;
}

.title_container {
    display: flex;
    align-items: center;
    height: 44px;
    margin-top: 10px;
    padding-left: 16px;
    border: 1px solid #dddddd;
    color: #666666;
    background-color: #f9f9f9;
}

.info_container {
    border: 1px solid #dddddd;
    border-top: none;
}

.dot_container {
    width: 8px;
    height: 105px;
    position: absolute;
    left: 16px;
}
i {
    font-style: normal;
}
.info_cell {
    height: 40px;
    display: flex;
    align-items: center;
    padding-left: 16px;
}
</style>
