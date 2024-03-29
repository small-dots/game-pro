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
        console.log(res);
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

    servers.value.map((s, i) => {
        console.log(';l;', `http://${s.ip}:8099/endpoint-websocket`);
        const socket = new SockJS(`http://${s.ip}:8099/endpoint-websocket`); //连接上端点(基站)
        const SC = Stomp.over(socket); //用stom进行包装，规范协议
        SC.connect({}, (con) => {
            console.log(con, '连接毁掉');
            if (con.command == 'CONNECTED') {
                console.log('连接成功>..');
                SC.send('/app/public/game_rank', {}, JSON.stringify({ content: `<color=#ffffff>${formData.xxnr}</color>` }));
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

    if (!formData.xxnr) {
        toast.add({ severity: 'error', summary: '提示', detail: '通报内容必输', group: 'tl', life: 3000 });
        return;
    }
};
</script>

<template>
    <div class="grid">
        <div class="col-12 md:col-12">
            <div class="card p-fluid">
                <h5>全服通报</h5>
                <div class="field">
                    <label for="age1">通报内容</label>
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
