<script setup>
import CustomerService from '@/service/CustomerService';
import ProductService from '@/service/ProductService';
import { ref, onBeforeMount, reactive } from 'vue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const msgList = ref(null);
const addModal = ref(false);
const noticeTitle = ref();
const productService = new ProductService();
const modalinfo = reactive({
    gqsj: '',
    ggnr: '',
    bt: '',
    type: '2'
});
const total = ref(0);

const submit = () => {
    if (modalinfo.gqsj && modalinfo.ggnr && modalinfo.bt) {
        productService.postNotice(modalinfo).then((res) => {
            if (res == 0) {
                toast.add({ severity: 'success', summary: '提示', detail: '发布成功', group: 'tl', life: 3000 });
                addModal.value = false;
                initTableData();
            } else {
                toast.add({ severity: 'error', summary: '提示', detail: '发布失败', group: 'tl', life: 3000 });
            }
        });
    } else {
        toast.add({ severity: 'error', summary: '提示', detail: '请填写全部的表单项', group: 'tl', life: 3000 });
    }
};

const del = (row) => {
    productService.deleteNotice({ id: row.id }).then(res=>{
        console.log(res)
        if(res==0){
             toast.add({ severity: 'success', summary: '提示', detail: '删除成功', group: 'tl', life: 3000 });
             initTableData();
        }
    })
};

const reset = () => {
    noticeTitle.value = '';
};

const openModal = () => {
    addModal.value = true;
};

const initTableData = (query) => {
    productService.getNoticeList({ bt: noticeTitle.value || '' }, { pageSize: 9999, current: 1 }).then((data) => {
        msgList.value = data.records;
        total.value = Number(data.total);
    });
};
onBeforeMount(() => {
    initTableData();
});
</script>

<template>
    <div class="grid">
        <div class="col-12 md:col-12">
            <div class="formgroup-inline card">
                <div class="field">
                    <label for="firstname1" class="p-sr-only">公告标题</label>
                    <InputText v-model="noticeTitle" id="firstname1" type="text" placeholder="公告标题" />
                </div>
                <Button label="查询" @click="initTableData('query')"></Button>
                <span style="margin: 0 4px"></span>
                <Button label="重置" severity="secondary" @click="reset"></Button>
            </div>
        </div>
        <div class="col-12">
            <div class="card">
                <DataTable :value="msgList" :scrollable="true" :totalRecords="total" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" scrollHeight="400px" scrollDirection="both" class="mt-3">
                    <template #header>
                        <div class="flex justify-content-between">
                            <Button type="button" icon="pi pi-plus" label="新增" outlined @click="openModal" />
                        </div>
                    </template>
                    <Column field="bt" header="公告标题" :style="{ width: '300px' }" frozen></Column>
                    <Column field="ggnr" header="公告内容"></Column>
                    <Column field="gqsj" header="过期时间" :style="{ width: '200px' }">
                        <template #body="{ data }">
                            <span style="margin-left: 0.5em; vertical-align: middle" class="image-text">{{ $moment(data.gqsj).format('YYYY-MM-DD HH:mm:ss') }}</span>
                        </template>
                    </Column>
                    <Column field="cjsj" header="操作">
                        <template #body="{ data }">
                            <Button type="button" class="p-button-danger mr-2" @click="del(data)">删除</Button>
                        </template></Column
                    >
                </DataTable>
            </div>
        </div>
    </div>
    <Dialog v-model:visible="addModal" modal header="发布公告" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <div class="p-fluid formgrid grid">
            <div class="field col-12">
                <label for="firstname2">公告标题</label>
                <InputText id="firstname2" v-model="modalinfo.bt" type="text" />
            </div>
            <div class="field col-12">
                <label for="lastname2">过期时间</label>
                <Calendar dateFormat="yy/mm/dd" v-model="modalinfo.gqsj" showIcon showButtonBar />
            </div>
            <div class="field col-12">
                <label for="address">公告内容</label>
                <Textarea id="address" v-model="modalinfo.ggnr" rows="4" />
            </div>
        </div>
        <template #footer>
            <Button label="取消" severity="secondary" icon="pi pi-times" @click="addModal = false" />
            <Button label="确定" icon="pi pi-check" @click="submit" />
        </template>
    </Dialog>
    <Toast position="top-center" group="tl" />
</template>

<style scoped lang="scss">
::v-deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

::v-deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}
</style>
