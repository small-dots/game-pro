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
const djpz = ref([]);
const flag = ref(1);
const productService = new ProductService();
const items = ref([]);
const modalinfo = reactive({
    gqsj: '',
    cdk: '',
    bt: '',
    selectedjl: [],
    type: '2',
    jl1: '',
    jl2: '',
    jl3: '',
    jl4: '',
    jl5: ''
});
const num = reactive({
    n1: 0,
    n2: 0,
    n3: 0,
    n4: 0,
    n5: 0
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
            jl1: modalinfo.jl1.name ? modalinfo.jl1.name + '*' + num.n1 : '',
            jl2: modalinfo.jl2.name ? modalinfo.jl2.name + '*' + num.n2 : '',
            jl3: modalinfo.jl3.name ? modalinfo.jl3.name + '*' + num.n3 : '',
            jl4: modalinfo.jl4.name ? modalinfo.jl4.name + '*' + num.n4 : '',
            jl5: modalinfo.jl5.name ? modalinfo.jl5.name + '*' + num.n5 : '',
            cdk: modalinfo.cdk,
            gqsj: proxy.$moment(modalinfo.gqsj).format('YYYY-MM-DD')
        };
        if (flag.value == 1) {
            productService.addCDK(params).then((res) => {
                if (res == 0) {
                    toast.add({ severity: 'success', summary: '提示', detail: '发布成功', group: 'tl', life: 3000 });
                    addModal.value = false;
                    initTableData();
                } else {
                    toast.add({ severity: 'error', summary: '提示', detail: '发布失败', group: 'tl', life: 3000 });
                }
            });
        }
        if (flag.value == 2) {
            productService.updateCDK(params).then((res) => {
                if (res == 0) {
                    toast.add({ severity: 'success', summary: '提示', detail: '编辑成功', group: 'tl', life: 3000 });
                    addModal.value = false;
                    initTableData();
                } else {
                    toast.add({ severity: 'error', summary: '提示', detail: '编辑失败', group: 'tl', life: 3000 });
                }
            });
        }
    } else {
        toast.add({ severity: 'error', summary: '提示', detail: '请填写全部的表单项', group: 'tl', life: 3000 });
    }
};

const reset = () => {
    noticeTitle.value = '';
};

const search = (event) => {
    items.value = djpz.value.filter((item) => {
        return item.nameZn.toLowerCase().includes(event.query.toLowerCase());
    });
};
const openModal = () => {
    addModal.value = true;
    flag.value = 1;
};

const edit = (rowData) => {
    flag.value = 2;
    addModal.value = true;
    modalinfo.cdk = rowData.cdk;
    modalinfo.gqsj = proxy.$moment(rowData.gqsj).format('YYYY-MM-DD');
    modalinfo.jl1=rowData.jl1;
    modalinfo.jl2=rowData.jl2;
    modalinfo.jl3=rowData.jl3;
    modalinfo.jl4=rowData.jl4;
    modalinfo.jl5=rowData.jl5;
};
const initTableData = (query) => {
    productService.getCDK({ cdk: noticeTitle.value || '' }, { pageSize: 9999, current: 1 }).then((data) => {
        msgList.value = data.records;
        total.value = Number(data.total);
    });
};
onBeforeMount(() => {
    initTableData();
    productService.getRewardConfig({ xtpz: 'djpz' }).then((res) => {
        console.log(res);
        djpz.value = JSON.parse(res.pzz);
    });
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
                            <Button type="button" severity="success" icon="pi pi-plus" label="新增" @click="openModal" />
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
                            <!-- <Button label="编辑" @click="edit(data)" outlined /> -->
                            <span style="margin: 0 4px"></span>
                            <Button label="删除" severity="danger" @click="del(data)" outlined />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
    <Dialog v-model:visible="addModal" modal header="CDK" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
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
                <label for="address">奖励1</label>
                <div class="flex-row">
                    <AutoComplete v-model="modalinfo.jl1" optionLabel="nameZn" display="chip" :suggestions="items" @complete="search" />
                    <InputNumber inputId="stacked-buttons" v-model="num.n1" showButtons mode="decimal" :min="0" />
                </div>
            </div>
            <div class="field col-12">
                <label for="address">奖励2</label>
                <div class="flex-row">
                    <AutoComplete v-model="modalinfo.jl2" optionLabel="nameZn" display="chip" :suggestions="items" @complete="search" />
                    <InputNumber inputId="stacked-buttons" v-model="num.n2" showButtons mode="decimal" :min="0" />
                </div>
            </div>
            <div class="field col-12">
                <label for="address">奖励3</label>
                <div class="flex-row">
                    <AutoComplete v-model="modalinfo.jl3" optionLabel="nameZn" display="chip" :suggestions="items" @complete="search" />
                    <InputNumber inputId="stacked-buttons" v-model="num.n3" showButtons mode="decimal" :min="0" />
                </div>
            </div>
            <div class="field col-12">
                <label for="address">奖励4</label>
                <div class="flex-row">
                    <AutoComplete v-model="modalinfo.jl4" optionLabel="nameZn" display="chip" :suggestions="items" @complete="search" />
                    <InputNumber inputId="stacked-buttons" v-model="num.n4" showButtons mode="decimal" :min="0" />
                </div>
            </div>
            <div class="field col-12">
                <label for="address">奖励5</label>
                <div class="flex-row">
                    <AutoComplete v-model="modalinfo.jl5" optionLabel="nameZn" display="chip" :suggestions="items" @complete="search" />
                    <InputNumber inputId="stacked-buttons" v-model="num.n5" showButtons mode="decimal" :min="0" />
                </div>
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
