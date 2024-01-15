<script setup>
import { reactive, ref, getCurrentInstance } from 'vue';
import ProductService from '@/service/ProductService';
import { useToast } from 'primevue/usetoast';

const productService = new ProductService();
const { proxy } = getCurrentInstance();

const toast = useToast();
const rangeOptions = ref(['全服', '指定用户']);
const selectedjl = ref();
const jl = ref([
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
]);
const range = ref('全服');
const formData = reactive({
    selectedjl: '',
    userId: '',
    content: '',
    bt: '',
    xxnr: '',
    gqsj: ''
});
const send = () => {
    if(!formData.userId&&range.value=='指定用户'){
        toast.add({ severity: 'error', summary: '提示', detail: '用户ID必输', group: 'tl', life: 3000 });
        return
    }
    if (!formData.bt) {
        toast.add({ severity: 'error', summary: '提示', detail: '邮件标题必输', group: 'tl', life: 3000 });
        return
    }
    if (!formData.xxnr) {
        toast.add({ severity: 'error', summary: '提示', detail: '邮件内容必输', group: 'tl', life: 3000 });
        return
    }
    if (!formData.gqsj) {
        toast.add({ severity: 'error', summary: '提示', detail: '过期时间必输', group: 'tl', life: 3000 });
        return
    }
    
    const params = {
        userId: range == '全服' ? '' : formData.userId,
        bt: formData.bt,
        xxnr: formData.xxnr,
        gqsj: proxy.$moment(formData.gqsj).format('YYYY-MM-DD'),
        jl1: formData?.selectedjl[0]?.code || '',
        jl2: formData?.selectedjl[1]?.code || '',
        jl3: formData?.selectedjl[2]?.code || '',
        jl4: formData?.selectedjl[3]?.code || '',
        jl5: formData?.selectedjl[4]?.code || ''
    };
    productService.sendEmail(params).then((res) => {
        if (res == 0) {
            toast.add({ severity: 'success', summary: '提示', detail: '发送成功', group: 'tl', life: 3000 });
            // 重置表单
            formData.userId = '';
            formData.bt = '';
            formData.xxnr = '';
            formData.gqsj = '';
            formData.selectedjl = [];
            
            
        } else {
            toast.add({ severity: 'error', summary: '提示', detail: '发送失败', group: 'tl', life: 3000 });
        }
    });
};
</script>

<template>
    <div class="grid">
        <div class="col-12 md:col-12">
            <div class="card p-fluid">
                <h5>邮件发送</h5>
                <div class="field">
                    <label for="name1">发送对象</label>
                    <SelectButton v-model="range" :options="rangeOptions" aria-labelledby="basic" />
                </div>
                <div class="field" v-if="range == '指定用户'">
                    <label for="name1">用户ID</label>
                    <InputText id="name1" v-model="formData.userId" type="text" />
                </div>
                <div class="field">
                    <label for="name1">邮件标题</label>
                    <InputText id="name1" v-model="formData.bt" type="text" />
                </div>
                <div class="field">
                    <label for="email1">过期日期</label>
                    <Calendar dateFormat="yy/mm/dd" v-model="formData.gqsj" showIcon />
                </div>
                <div class="field">
                    <label for="email1">奖励</label>
                    <MultiSelect v-model="formData.selectedjl" display="chip" :options="jl" optionLabel="name" placeholder="请选择奖励" :maxSelectedLabels="5" class="w-full" />
                </div>
                <div class="field">
                    <label for="age1">邮件内容</label>
                    <Textarea v-model="formData.xxnr" rows="5" cols="30" />
                </div>
                <Button label="发送" @click="send"></Button>
            </div>
        </div>
        <Toast position="top-center" group="tl" />
    </div>
</template>
