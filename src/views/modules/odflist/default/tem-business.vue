<template>
    <el-row>
        <!-- 端子、-业务详情 -->
        <el-row class="base_info">
            <p class="business_info title_base"><span>基础信息</span><el-button type="success" size="mini" @click="$router.go(-1)">返回</el-button></p>
            <p>
                <label>端子编号：</label><span>{{ terminalSn }}</span>
            </p>
            <p>
                <label>所属光缆段：</label><span>{{ segmentName }}</span>
            </p>
        </el-row>
        <p class="business_info title_business"><span>业务信息</span><el-button type="primary" size="mini" @click="addBusiness()">新增</el-button></p>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"></el-table-column>
            <el-table-column :formatter="businessType" header-align="center" align="center" label="业务类型"></el-table-column>
            <el-table-column :formatter="operatorType" header-align="center" align="center" label="运营商"></el-table-column>
            <el-table-column prop="businessValue" header-align="center" align="center" label="业务值"></el-table-column>
            <el-table-column :formatter="status" header-align="center" align="center" label="业务状态"></el-table-column>
            <el-table-column prop="companyName" header-align="center" align="center" label="企业名称"></el-table-column>
            <el-table-column :formatter="openingTime" header-align="center" align="center" label="企业开通时间"></el-table-column>
            <el-table-column :formatter="stoppingTime" header-align="center" align="center" label="停用时间"></el-table-column>
            <el-table-column prop="recorder" header-align="center" align="center" label="录入人员"></el-table-column>
            <el-table-column header-align="center" align="center" width="100" label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" plain size="mini" :disabled="scope.row.status == 2" @click="stopBusiness(scope.row.businessId)">停用</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 弹窗, 新增-->
        <add ref="add" v-if="addOrUpdateVisible" @refreshDataList="getDataList"></add>
    </el-row>
</template>
<script>
import add from './temBusiness-add';
import {businessType, operatorType, businessStatus ,commonFunc} from '@/utils/resources/index.js';
export default {
    components: {
        add,
    },
    data() {
        return {
            segmentName: '',
            terminalSn: '',
            terminalId: 0,
            dataListLoading: false,
            addOrUpdateVisible: false,
            dataList: [],
        };
    },
    methods: {
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v1/cpn/terminals/' + this.terminalId + '/business'),
                method: 'get',
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.dataList = data.data.business;
                    this.terminalSn = data.data.terminalSn;
                    this.segmentName = data.data.segmentName;
                }
                this.dataListLoading = false;
            });
        },
        // 新增
        addBusiness() {
            this.addOrUpdateVisible = true;
            this.$nextTick(() => {
                this.$refs.add.init(this.terminalId);
            });
        },
        // 业务停用
        stopBusiness(id) {
            this.$confirm(`确定进行停用?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$http({
                        url: this.$http.adornUrl('/v1/cpn/terminals/business/' + id + '/ending'),
                        method: 'put',
                    }).then(({data}) => {
                        this.getDataList();
                    });
                })
                .catch(() => {});
        },
        businessType(item) {
            return businessType(item.businessType);
        },
        operatorType(item) {
            return operatorType(item.operatorType);
        },
        status(item) {
            return businessStatus(item.status);
        },
        openingTime(item) {
            return commonFunc(item.openingTime);
        },
        stoppingTime(item) {
            return commonFunc(item.stoppingTime);
        },
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.terminalId = vm.$route.query.id; //路由跳转拿到参数
            vm.getDataList();
        });
    },
};
</script>
<style lang="scss" scoped>
.base_info {
    border: 1px solid #ebeef5;
    p {
        label {
            margin-left: 20px;
        }
    }
}
.business_info {
    display: flex;
    justify-content: space-between;
    background: #eaeaea;
    padding: 5px 0 5px 10px;
    span {
        line-height: 27px;
    }
}
.title_base {
    margin: 0;
}
.title_business {
    margin: 10px 0 0 0;
}
</style>
