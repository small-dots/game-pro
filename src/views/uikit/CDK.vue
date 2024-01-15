<script setup>
import CustomerService from '@/service/CustomerService';
import ProductService from '@/service/ProductService';
import { ref, getCurrentInstance, onBeforeMount, reactive } from 'vue';
import { useToast } from 'primevue/usetoast';

const { proxy } = getCurrentInstance();

const toast = useToast();
const msgList = ref(null);
const addModal = ref(false);
const noticeTitle = ref();
const productService = new ProductService();
const jl = ref([
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
]);
const modalinfo = reactive({
    gqsj: '',
    cdk: '',
    bt: '',
    selectedjl: [],
    type: '2'
});
const total = ref(0);

const del = (row) => {
    const params = {
        cdk: row.cdk
    };
    productService.deleteCDK(params).then((res) => {
        if (res == 0) {
            toast.add({ severity: 'success', summary: '提示', detail: '删除成功', group: 'tl', life: 3000 });
            initTableData();
        } else {
            toast.add({ severity: 'error', summary: '提示', detail: '删除失败', group: 'tl', life: 3000 });
        }
    });
};

const submit = () => {
    if (modalinfo.gqsj && modalinfo.cdk) {
        const params = {
            jl1: modalinfo?.selectedjl[0]?.code || '',
            jl2: modalinfo?.selectedjl[1]?.code || '',
            jl3: modalinfo?.selectedjl[2]?.code || '',
            jl4: modalinfo?.selectedjl[3]?.code || '',
            jl5: modalinfo?.selectedjl[4]?.code || '',
            cdk: modalinfo.cdk,
            gqsj: modalinfo.gqsj
        };
        productService.postNotice(params).then((res) => {
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

const reset = () => {
    noticeTitle.value = '';
};

const openModal = () => {
    addModal.value = true;
};

const edit = (rowData) => {
    addModal.value = true;
    modalinfo.cdk = rowData.cdk;
    modalinfo.gqsj = proxy.$moment(rowData.gqsj).format('YYYY-MM-DD');
    modalinfo.selectedjl.push(rowData.jl1);
    modalinfo.selectedjl.push(rowData.jl2);
    modalinfo.selectedjl.push(rowData.jl3);
    modalinfo.selectedjl.push(rowData.jl4);
    modalinfo.selectedjl.push(rowData.jl5);
};
const initTableData = (query) => {
    productService.getCDK({ cdk: noticeTitle.value || '' }, { pageSize: 9999, current: 1 }).then((data) => {
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
                    <label for="firstname1" class="p-sr-only">CDK</label>
                    <InputText v-model="noticeTitle" id="firstname1" type="text" placeholder="CDK" />
                </div>
                <Button label="查询" @click="initTableData('query')"></Button>
                <span style="margin: 0 4px"></span>
                <Button label="重置" severity="secondary" @click="reset"></Button>
            </div>
        </div>
        <div class="col-12">
            <div class="card">
                <h5>CDK列表</h5>
                <DataTable :value="msgList" :scrollable="true" :totalRecords="total" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" scrollHeight="400px" scrollDirection="both" class="mt-3">
                    <template #header>
                        <div class="flex justify-content-between">
                            <Button type="button" severity="success" icon="pi pi-plus" label="新增"  @click="openModal" />
                        </div>
                    </template>
                    <Column field="cdk" header="CDK" :style="{ width: '300px' }" frozen></Column>
                    <Column field="jl1" header="奖励1"></Column>
                    <Column field="jl2" header="奖励2"></Column>
                    <Column field="jl3" header="奖励3"></Column>
                    <Column field="jl4" header="奖励4"></Column>
                    <Column field="jl5" header="奖励5"></Column>
                    <Column field="gqsj" header="过期时间" :style="{ width: '200px' }">
                        <template #body="{ data }">
                            <span style="margin-left: 0.5em; vertical-align: middle" class="image-text">{{ $moment(data.gqsj).format('YYYY-MM-DD HH:mm:ss') }}</span>
                        </template>
                    </Column>
                    <Column field="cz" header="操作" :style="{ width: '210px' }">
                        <template #body="{ data }">
                            <Button label="编辑" @click="edit(data)" outlined />
                            <span style="margin: 0 4px"></span>
                            <Button label="删除" severity="danger" @click="del(data)" outlined />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
    <Dialog v-model:visible="addModal" modal header="添加CDK" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <div class="p-fluid formgrid grid">
            <div class="field col-12">
                <label for="firstname2">CDK</label>
                <InputText id="firstname2" v-model="modalinfo.cdk" type="text" />
            </div>
            <div class="field col-12">
                <label for="lastname2">过期时间</label>
                <Calendar dateFormat="yy/mm/dd" v-model="modalinfo.gqsj" showIcon showButtonBar />
            </div>
            <div class="field col-12">
                <label for="address">奖励</label>
                <MultiSelect v-model="modalinfo.selectedjl" display="chip" :options="jl" optionLabel="name" placeholder="请选择奖励" :maxSelectedLabels="5" class="w-full" />
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
