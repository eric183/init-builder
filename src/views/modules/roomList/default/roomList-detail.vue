<template>
    <el-dialog :title="'详情'" :close-on-click-modal="false" :visible.sync="visible">
        <el-card class="box-card">
            <div class="text item"><label>名称:</label>{{ dataForm.roomName }}</div>
            <div class="text item"><label>容纳人数:</label>{{ dataForm.size + '人' }}</div>
            <div class="text item"><label>收费标准:</label>{{ dataForm.price / 100 + '元/小时' }}</div>
            <div class="text item"><label>开放时间:</label>{{ dataForm.startAt + ':00' + '至' + dataForm.endAt + ':00' }}</div>
            <div class="text item">
                <label>封面图:</label> <span v-for="(item, index) in imgList" :key="index"> <img :src="item" style="width:150px;height:auto; margin-left:10px;" /> </span>
            </div>
            <div class="text item lastdiv"><label>详情描述:</label>{{ dataForm.detail }}</div>
        </el-card>
        <span slot="footer" class="dialog-footer"> <el-button size="small" type="primary" @click="visible = false">确定</el-button> </span>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            dataForm: {},
            visible: false,
            imgList: [],
        };
    },
    methods: {
        init(obj) {
            this.visible = true;
            this.dataForm = {
                cover: obj.cover,
                roomName: obj.roomName,
                size: obj.size,
                price: obj.price,
                startAt: obj.startAt,
                detail: obj.detail,
                endAt: obj.endAt,
            };
            // 图片转换
            //console.log(this.dataForm.cover)
            this.imgList = this.dataForm.cover;
        },
        // 后端返回的图片字符串转换成数组
        getArray(fun) {
            for (var i in fun) {
                if (fun[i].cover.indexOf(',') != -1) {
                    fun[i].cover = fun[i].cover.split(',');
                } else {
                    var list = [];
                    list.push(fun[i].cover);
                    fun[i].cover = list;
                }
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.box-card {
    div {
        padding: 10px 0;
        border-bottom: 1px solid #ebeef5;
        label {
            display: inline-block;
            width: 80px;
        }
    }
    .lastdiv {
        border-bottom: none;
    }
}

</style>
