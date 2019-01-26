<template>
    <div class="propertyService_info">
        <!-- 物业服务详情页面 -->
        <div class="info_header flex">
            <div class="title">
                <span>处理状态:</span> <span class="ml10 fb">{{ status(infoData.status) }}</span>
            </div>
            <div>
                <!-- v-show="infoData.status==1" -->
                <el-button size="mini" type="success" v-show="infoData.status == 1" @click="clearProblem(infoData.serviceId)">澄清问题</el-button>
                <el-button size="mini" type="success" v-show="infoData.status == 1" @click="creakOrder(infoData.serviceId)">创建工单</el-button>
                <el-button size="mini" type="primary" @click="$router.go(-1)">返回</el-button>
            </div>
        </div>
        <div class="info_top">
            <span>反馈人信息：</span> <span class="ml10">{{ infoData.userName }}</span> <span class="ml10">{{ infoData.userAccount }}</span>
        </div>
        <p class="info_title">问题反馈内容：</p>
        <div class="info_content flex">
            <ul>
                <li>
                    <span>问题类型：</span> <span class="ml10">{{ type(infoData.type) }}</span> <span class="ml10">{{ repairType(infoData.repairType) }}</span>
                    <span class="ml10">{{ infoData.repairItem }}</span>
                </li>
                <li>
                    <span>现场位置：</span> <span class="ml10">{{ infoData.position }}</span>
                </li>
                <li>
                    <span>问题描述：</span> <span class="ml10">{{ infoData.content }}</span>
                </li>
            </ul>
            <p>
                <span>现场图片：</span>
                <span v-for="(item, index) in infoData.image" :key="index">
                    <el-popover placement="right" trigger="click">
                        <img :src="item" style="max-width:720px;max-height:600px;" /> <img slot="reference" :src="item" style="height: auto;max-width: 130px" />
                    </el-popover>
                </span>
            </p>
        </div>
        <p class="info_title">处理追踪：</p>
        <div class="info_track">
            <el-table :data="trackData" style="width: 100%">
                <el-table-column header-align="center" align="center" :formatter="createdAt" label="时间"> </el-table-column>
                <el-table-column header-align="center" align="center" prop="actionDesc" label="处理追踪"> </el-table-column>
                <el-table-column header-align="center" align="center" prop="operatorName" label="操作人"> </el-table-column>
                <el-table-column header-align="center" align="center" prop="feedback" label="处理详情"> </el-table-column>
                <el-table-column header-align="center" align="center" min-width="150" label="反馈图片">
                    <template slot-scope="scope">
                        <img class="ml10" :src="scope.row.image" alt="" style="width:100px;height:auto;" />
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 弹窗,澄清问题 -->
        <clear-problem v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getPlainInfo"></clear-problem>
    </div>
</template>

<script>
import commonFunc from '@/assets/common.js';
import clearProblem from './clearProblem';
export default {
    data() {
        return {
            trackData: [], //追踪记录的数据table
            infoData: {}, //详情数据
            id: null, //服务的id
            addOrUpdateVisible: false,
        };
    },
    components: {
        clearProblem,
    },
    activated() {
        this.id = this.$route.query.id; //路由跳转拿到参数
        this.getPlainInfo();
    },
    methods: {
        // 详情的数据
        getPlainInfo() {
            this.$http({
                url: this.$http.adornUrl('/v1/prop/services/' + this.id + '/details'),
                method: 'get',
                params: this.$http.adornParams(),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    (this.infoData = data.data), (this.trackData = data.data.actions), (this.infoData.image = this.infoData.image.split(','));
                }
            });
        },
        // 澄清问题
        clearProblem(id) {
            this.addOrUpdateVisible = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(id);
            });
        },
        //  创建工单
        creakOrder(id) {
            this.$router.push({path: '/workerOrder_add', query: {id: id}});
        },
        createdAt(item) {
            return commonFunc.commonFunc(item.createdAt);
        },
        status(item) {
            switch (item) {
                case 1:
                    return '待处理';
                    break;
                case 2:
                    return '处理中';
                    break;
                case 3:
                    return '已处理';
                    break;
            }
        },
        repairType(item) {
            switch (item) {
                case 1:
                    return '公共区域报修';
                    break;
                case 2:
                    return '企业报修';
                    break;
            }
        },
        type(item) {
            switch (item) {
                case 1:
                    return '咨询求助';
                    break;
                case 2:
                    return '报修';
                    break;
                case 3:
                    return '投诉建议';
                    break;
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.propertyService_info {
    color: #606266;
    padding-left: 15px;
}
.info_header {
    padding: 10px 0;
    .title {
        font-size: 14px;
    }
    border-bottom: 1px solid #ebeef5;
}
.info_top {
    padding: 15px 0;
    border-bottom: 1px solid #ebeef5;
}
.info_title {
    padding: 15px 0;
    margin: 0;
    border-bottom: 1px solid #ebeef5;
}
.info_content {
    border-bottom: 1px solid #ebeef5;
    padding: 10px 0;
    ul {
        width: 50%;
        li {
            padding: 5px 0;
            line-height: 24px;
        }
    }
    p {
        width: 50%;
        padding: 10px;
        img {
            width: 100px;
            height: auto;
            margin-left: 10px;
            vertical-align: top;
        }
    }
}
</style>
