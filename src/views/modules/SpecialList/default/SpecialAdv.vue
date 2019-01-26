<template>
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter.native="dataFormSubmit()" label-width="100px" size="small">
        <el-form-item label="专题名称" prop="title"> <el-input v-model="dataForm.title" placeholder="名称"></el-input> </el-form-item>
        <el-form-item label="专题位置" prop="type">
            <el-select v-model="dataForm.type"> <el-option v-for="item in advTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
        </el-form-item>
        <el-form-item label="时间" prop="jumpId" key="goodsId">
            <el-date-picker v-model="dataForm.value6" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
        </el-form-item>
        <el-form-item label="首页banner" class="advertImage" prop="imageUrl">
            <el-upload ref="upload" :action="''" :http-request="myUpload" list-type="picture-card" :limit="1" :before-upload="beforeAvatarUpload" :on-remove="onRemove" :on-success="onSuccess">
                <img v-if="dataForm.imageUrl" :src="dataForm.imageUrl" class="avatar" /> <i class="el-icon-plus"></i>
            </el-upload>
        </el-form-item>
        <el-form-item label="首页专题图" class="advertImage" prop="imageUrl">
            <el-upload ref="upload" :action="''" :http-request="myUpload" list-type="picture-card" :limit="1" :before-upload="beforeAvatarUpload" :on-remove="onRemove" :on-success="onSuccess">
                <img v-if="dataForm.imageUrl" :src="dataForm.imageUrl" class="avatar" /> <i class="el-icon-plus"></i>
            </el-upload>
        </el-form-item>
        <el-form-item label="首页头图" class="advertImage" prop="imageUrl">
            <el-upload ref="upload" :action="''" :http-request="myUpload" list-type="picture-card" :limit="1" :before-upload="beforeAvatarUpload" :on-remove="onRemove" :on-success="onSuccess">
                <img v-if="dataForm.imageUrl" :src="dataForm.imageUrl" class="avatar" /> <i class="el-icon-plus"></i>
            </el-upload>
        </el-form-item>
        <el-form-item label="专题链接" prop="title"> <el-input v-model="dataForm.title" placeholder="名称"></el-input> </el-form-item>
        <el-form-item label="启用状态" prop="status">
            <el-switch :width="35" v-model="dataForm.status" active-text="是" :active-value="2" inactive-text="否" :inactive-value="1"> </el-switch>
        </el-form-item>
        <el-form-item label="备注" prop="title"> <el-input v-model="dataForm.title" placeholder="名称"></el-input> </el-form-item>
    </el-form>
</template>
<script>
export default {
    data() {
        return {
            advTypeList: [],
            dataForm: {},
            dataRule: {},
        };
    },
};
</script>
