<script setup>
import { reactive, ref, getCurrentInstance, onMounted } from 'vue';
import ProductService from '@/service/ProductService';
import { useToast } from 'primevue/usetoast';

const productService = new ProductService();
const { proxy } = getCurrentInstance();
const items = ref([]);
const djpz = ref([]);
const toast = useToast();
const rangeOptions = ref(['全服', '指定用户']);
const selectedjl = ref();

const num = reactive({
    n1: 0,
    n2: 0,
    n3: 0,
    n4: 0,
    n5: 0
});
const range = ref('全服');
const formData = reactive({
    selectedjl: '',
    userId: '',
    content: '',
    bt: '',
    xxnr: '',
    gqsj: '',
    jl1: '',
    jl2: '',
    jl3: '',
    jl4: '',
    jl5: ''
});
onMounted(() => {
    productService.getRewardConfig({ xtpz: 'djpz' }).then((res) => {
        console.log(res);
        djpz.value = JSON.parse(res.pzz);
    });
});

const search = (event) => {
    items.value = djpz.value.filter((item) => {
        return item.nameZn.toLowerCase().includes(event.query.toLowerCase());
    });
};
const send = () => {
    if (!formData.userId && range.value == '指定用户') {
        toast.add({ severity: 'error', summary: '提示', detail: '用户ID必输', group: 'tl', life: 3000 });
        return;
    }
    if (!formData.bt) {
        toast.add({ severity: 'error', summary: '提示', detail: '邮件标题必输', group: 'tl', life: 3000 });
        return;
    }
    if (!formData.xxnr) {
        toast.add({ severity: 'error', summary: '提示', detail: '邮件内容必输', group: 'tl', life: 3000 });
        return;
    }
    if (!formData.gqsj) {
        toast.add({ severity: 'error', summary: '提示', detail: '过期时间必输', group: 'tl', life: 3000 });
        return;
    }

    const params = {
        userId: range == '全服' ? '' : formData.userId,
        bt: formData.bt,
        xxnr: formData.xxnr,
        gqsj: proxy.$moment(formData.gqsj).format('YYYY-MM-DD'),
        jl1: formData.jl1.name ? formData.jl1.name + '*' + num.n1 : '',
        jl2: formData.jl2.name ? formData.jl2.name + '*' + num.n2 : '',
        jl3: formData.jl3.name ? formData.jl3.name + '*' + num.n3 : '',
        jl4: formData.jl4.name ? formData.jl4.name + '*' + num.n4 : '',
        jl5: formData.jl5.name ? formData.jl5.name + '*' + num.n5 : ''
    };
    productService.sendEmail(params).then((res) => {
        if (res == 0) {
            toast.add({ severity: 'success', summary: '提示', detail: '发送成功', group: 'tl' });

            // 重置表单
            formData.userId = '';
            formData.bt = '';
            formData.xxnr = '';
            formData.gqsj = '';
            formData.selectedjl = [];
            formData.jl1 = '';
            formData.jl2 = '';
            formData.jl3 = '';
            formData.jl4 = '';
            formData.jl5 = '';
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
                    <label for="address">奖励1</label>
                    <div class="flex-row">
                        <AutoComplete v-model="formData.jl1" optionLabel="nameZn" display="chip" :suggestions="items" @complete="search" />
                        <InputNumber inputId="stacked-buttons" v-model="num.n1" showButtons mode="decimal" :min="0" />
                    </div>
                </div>
                <div class="field">
                    <label for="address">奖励2</label>
                    <div class="flex-row">
                        <AutoComplete v-model="formData.jl2" optionLabel="nameZn" display="chip" :suggestions="items" @complete="search" />
                        <InputNumber inputId="stacked-buttons" v-model="num.n2" showButtons mode="decimal" :min="0" />
                    </div>
                </div>
                <div class="field">
                    <label for="address">奖励3</label>
                    <div class="flex-row">
                        <AutoComplete v-model="formData.jl3" optionLabel="nameZn" display="chip" :suggestions="items" @complete="search" />
                        <InputNumber inputId="stacked-buttons" v-model="num.n3" showButtons mode="decimal" :min="0" />
                    </div>
                </div>
                <div class="field">
                    <label for="address">奖励4</label>
                    <div class="flex-row">
                        <AutoComplete v-model="formData.jl4" optionLabel="nameZn" display="chip" :suggestions="items" @complete="search" />
                        <InputNumber inputId="stacked-buttons" v-model="num.n4" showButtons mode="decimal" :min="0" />
                    </div>
                </div>
                <div class="field">
                    <label for="address">奖励5</label>
                    <div class="flex-row">
                        <AutoComplete v-model="formData.jl5" optionLabel="nameZn" display="chip" :suggestions="items" @complete="search" />
                        <InputNumber inputId="stacked-buttons" v-model="num.n5" showButtons mode="decimal" :min="0" />
                    </div>
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


<style lang="scss" scoped>
.flex-row {
    display: flex;
    flex-wrap: nowrap;
    gap: 10px;
    & > div {
        flex: 1;
    }
    & > span {
        width: 150px;
    }
}
</style>
