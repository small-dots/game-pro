<script setup>
import { reactive, ref, getCurrentInstance, onMounted } from 'vue';
import ProductService from '@/service/ProductService';
import { useToast } from 'primevue/usetoast';
import { Subject } from 'rxjs';
const productService = new ProductService();
const { proxy } = getCurrentInstance();
const items = ref([]);
const djpz = ref([]);
const toast = useToast();
const rangeOptions = ref(['全服', '指定用户']);
const selectedjl = ref();
const stompClient = ref([]);
let stopmClientSingle = null;
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
    jl5: '',
    server: ''
});

const servers = ref([]);
onMounted(() => {
    getServerList();
    productService.getRewardConfig({ xtpz: 'djpz' }).then((res) => {
        djpz.value = JSON.parse(res.pzz);
    });
});
const getServerList = () => {
    productService.getMenuData().then((s = []) => {
        servers.value = s;
    });
};
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

    const content =
        range.value == '指定用户'
            ? {
                  bt: formData.bt,
                  cjsj: proxy.$moment().format('YYYY-MM-DD HH:mm:ss'),
                  gqsj: proxy.$moment(formData.gqsj).format('YYYY-MM-DD HH:mm:ss'),
                  jl1: formData.jl1.name ? formData.jl1.name + '*' + num.n1 : '',
                  jl2: formData.jl2.name ? formData.jl2.name + '*' + num.n2 : '',
                  jl3: formData.jl3.name ? formData.jl3.name + '*' + num.n3 : '',
                  jl4: formData.jl4.name ? formData.jl4.name + '*' + num.n4 : '',
                  jl5: formData.jl5.name ? formData.jl5.name + '*' + num.n5 : '',
                  userId: formData.userId,
                  xxnr: formData.xxnr,
                  yd: 0
              }
            : {
                  bt: formData.bt,
                  cjsj: proxy.$moment().format('YYYY-MM-DD HH:mm:ss'),
                  gqsj: proxy.$moment(formData.gqsj).format('YYYY-MM-DD HH:mm:ss'),
                  jl1: formData.jl1.name ? formData.jl1.name + '*' + num.n1 : '',
                  jl2: formData.jl2.name ? formData.jl2.name + '*' + num.n2 : '',
                  jl3: formData.jl3.name ? formData.jl3.name + '*' + num.n3 : '',
                  jl4: formData.jl4.name ? formData.jl4.name + '*' + num.n4 : '',
                  jl5: formData.jl5.name ? formData.jl5.name + '*' + num.n5 : '',
                  xxnr: formData.xxnr,
                  yd: 0
              };

    // const ip = window.location.protocol + '//' + window.location.host;
    const ip = '';
    if (stopmClientSingle !== null) {
        stopmClientSingle.disconnect();
    }
    stompClient.value.map((a) => {
        if (a != null) {
            a.disconnect();
        }
    });
    stompClient.value = [];

    if (range.value != '指定用户') {
        servers.value.map((s, i) => {
            console.log(';l;', `http://${s.ip}:8099/endpoint-websocket`);
            const socket = new SockJS(`http://${s.ip}:8099/endpoint-websocket`); //连接上端点(基站)
            const SC = Stomp.over(socket); //用stom进行包装，规范协议
            SC.connect({}, (con) => {
                console.log(con, '连接毁掉');
                if (con.command == 'CONNECTED') {
                    console.log('连接成功>..');
                    SC.send('/app/messageAll', {}, JSON.stringify(content));
                    stompClient.value.push(SC);
                }
                SC.subscribe('/topic/game_rank', function (result) {
                    console.log('result=' + result);
                }),
                    (e) => {
                        console.log(e);
                    };
            });
        });
        console.log(stompClient.value);
    } else {
        const socket = new SockJS(`http://${formData.server[0].ip}:8099/endpoint-websocket`); //连接上端点(基站)
        stopmClientSingle = Stomp.over(socket); //用stom进行包装，规范协议
        stopmClientSingle.connect({}, function (frame) {
            if (frame.command == 'CONNECTED') {
                console.log('连接成功>..');
                stopmClientSingle.send('/app/message', {}, JSON.stringify(content));
            }
            console.log('Connected: ' + frame);
            stopmClientSingle.subscribe('/topic/game_rank', function (result) {
                console.log('result=' + result);
            });
        });
        if (stopmClientSingle.connected) {
        }
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
    productService.sendEmail({ ...content }).then((res) => {
        console.log(res);
        if (res == 0) {
            toast.add({ severity: 'success', summary: '提示', detail: '邮件发送成功', group: 'tl', life: 3000 });
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
                <div class="field" v-if="range == '指定用户'">
                    <label for="name1">区服</label>
                    <MultiSelect v-model="formData.server" :options="servers" optionLabel="name" placeholder="选择区服" class="w-full" />
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
                        <Dropdown v-model="formData.jl1" :options="djpz" filter optionLabel="nameZn" placeholder="选择奖励" class="w-full md:w-14rem">
                            <template #value="slotProps">
                                <div v-if="slotProps.value" class="flex align-items-center">
                                    <div>{{ slotProps.value.nameZn }}</div>
                                </div>
                                <span v-else>
                                    {{ slotProps.placeholder }}
                                </span>
                            </template>
                            <template #option="slotProps">
                                <div class="flex align-items-center">
                                    <div>{{ slotProps.option.nameZn }}</div>
                                </div>
                            </template>
                        </Dropdown>
                        <InputNumber inputId="stacked-buttons" v-model="num.n1" showButtons mode="decimal" :min="0" />
                    </div>
                </div>
                <div class="field">
                    <label for="address">奖励2</label>
                    <div class="flex-row">
                        <Dropdown v-model="formData.jl2" :options="djpz" filter optionLabel="nameZn" placeholder="选择奖励" class="w-full md:w-14rem">
                            <template #value="slotProps">
                                <div v-if="slotProps.value" class="flex align-items-center">
                                    <div>{{ slotProps.value.nameZn }}</div>
                                </div>
                                <span v-else>
                                    {{ slotProps.placeholder }}
                                </span>
                            </template>
                            <template #option="slotProps">
                                <div class="flex align-items-center">
                                    <div>{{ slotProps.option.nameZn }}</div>
                                </div>
                            </template>
                        </Dropdown>
                        <InputNumber inputId="stacked-buttons" v-model="num.n2" showButtons mode="decimal" :min="0" />
                    </div>
                </div>
                <div class="field">
                    <label for="address">奖励3</label>
                    <div class="flex-row">
                        <Dropdown v-model="formData.jl3" :options="djpz" filter optionLabel="nameZn" placeholder="选择奖励" class="w-full md:w-14rem">
                            <template #value="slotProps">
                                <div v-if="slotProps.value" class="flex align-items-center">
                                    <div>{{ slotProps.value.nameZn }}</div>
                                </div>
                                <span v-else>
                                    {{ slotProps.placeholder }}
                                </span>
                            </template>
                            <template #option="slotProps">
                                <div class="flex align-items-center">
                                    <div>{{ slotProps.option.nameZn }}</div>
                                </div>
                            </template>
                        </Dropdown>
                        <InputNumber inputId="stacked-buttons" v-model="num.n3" showButtons mode="decimal" :min="0" />
                    </div>
                </div>
                <div class="field">
                    <label for="address">奖励4</label>
                    <div class="flex-row">
                        <Dropdown v-model="formData.jl4" :options="djpz" filter optionLabel="nameZn" placeholder="选择奖励" class="w-full md:w-14rem">
                            <template #value="slotProps">
                                <div v-if="slotProps.value" class="flex align-items-center">
                                    <div>{{ slotProps.value.nameZn }}</div>
                                </div>
                                <span v-else>
                                    {{ slotProps.placeholder }}
                                </span>
                            </template>
                            <template #option="slotProps">
                                <div class="flex align-items-center">
                                    <div>{{ slotProps.option.nameZn }}</div>
                                </div>
                            </template>
                        </Dropdown>
                        <InputNumber inputId="stacked-buttons" v-model="num.n4" showButtons mode="decimal" :min="0" />
                    </div>
                </div>
                <div class="field">
                    <label for="address">奖励5</label>
                    <div class="flex-row">
                        <Dropdown v-model="formData.jl5" :options="djpz" filter optionLabel="nameZn" placeholder="选择奖励" class="w-full md:w-14rem">
                            <template #value="slotProps">
                                <div v-if="slotProps.value" class="flex align-items-center">
                                    <div>{{ slotProps.value.nameZn }}</div>
                                </div>
                                <span v-else>
                                    {{ slotProps.placeholder }}
                                </span>
                            </template>
                            <template #option="slotProps">
                                <div class="flex align-items-center">
                                    <div>{{ slotProps.option.nameZn }}</div>
                                </div>
                            </template>
                        </Dropdown>
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
