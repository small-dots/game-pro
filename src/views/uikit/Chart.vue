<script setup>
import { onMounted, ref, watch, onBeforeUnmount, getCurrentInstance } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import ProductService from '@/service/ProductService';
import { useEventBus } from '@vueuse/core';
import { useResponseStore } from '@/stores/modules/response';

const responseStore = useResponseStore();
const worker = new Worker('web-workers/worker.js');

const bus = useEventBus('server-selected');
const { proxy } = getCurrentInstance();
const { layoutConfig } = useLayout();
let documentStyle = getComputedStyle(document.documentElement);
let textColor = documentStyle.getPropertyValue('--text-color');
let textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
let surfaceBorder = documentStyle.getPropertyValue('--surface-border');

const onLineNumber = ref(0);
const newUserNumber = ref(0);
const newAmountNumber = ref(0);
const totalUserNumber = ref(0);
const totalAmountNumber = ref(0);

const lineDataUser = ref(null);
const lineDataMoney = ref(null);

const currentDay = ref(3);

const userData = ref([]);
const moneyData = ref([]);
const xData = ref([]);

const barData = ref(null);
const time = ref('');
const lineOptionsUser = ref(null);
const lineOptionsMoney = ref(null);
const barOptions = ref(null);
const productService = new ProductService();
const timer = ref(null);
const ip = ref('getCurrentDomain');
const currentIp = ref('all');

onMounted(() => {
    /**
     * 获取统计数据,每个十分钟轮询一次
     */
    timer.value = setInterval(() => {
        getStatisticsData();
    }, 1000 * 60 * 10);

    getStatisticsData();
    bus.on((name, data) => {
        if (data?.children) {
            // 计算全部服务器的和
            calAllData();
        } else {
            if (name == 'serverChange') {
                calDataByIp(data);
                currentIp.value = data.key;
            }
        }

        if (name == 'dataLoaded') {
            console.log('data', data);
            calAllData(data);
        }
    });
});

const calAllData = (datas = null) => {
    const { data } = datas || responseStore.allReponseData;
    let d1 = 0;
    let d2 = 0;
    let d3 = 0;
    let d4 = 0;
    let d5 = 0;
    let _charts = {};
    // 将Map对象转换为数组
    const arr = Array.from(data, ([key, value]) => ({ key, value }));
    Array.isArray(arr) &&
        arr.map((item, index) => {
            // 统计数据
            d1 += item.value.nums['d1'];
            d2 += item.value.nums['d2'];
            d3 += item.value.nums['d3'];
            d4 += item.value.nums['d4'];
            d5 += item.value.nums['d5'];
            // 图表数据

            Object.keys(item.value.charts).forEach((c) => {
                if (!_charts[c]) {
                    _charts[c] = {};
                }
                _charts[c]['zb'] = item.value.charts[c]['zb'];
                if (!Number(_charts[c]['tap'])) {
                    _charts[c]['tap'] = 0;
                }
                if (!Number(_charts[c]['xxl'])) {
                    _charts[c]['xxl'] = 0;
                }
                if (!Number(_charts[c]['je'])) {
                    _charts[c]['je'] = 0;
                }
                if (!Number(_charts[c]['weixin'])) {
                    _charts[c]['weixin'] = 0;
                }

                _charts[c]['tap'] += item.value.charts[c]['tap'];
                _charts[c]['xxl'] += item.value.charts[c]['xxl'];
                _charts[c]['je'] += item.value.charts[c]['je'];
                _charts[c]['weixin'] += item.value.charts[c]['weixin'];
            });
        });

    onLineNumber.value = d1;
    totalUserNumber.value = d2;
    newUserNumber.value = d3;
    newAmountNumber.value = d4;
    totalAmountNumber.value = d5;

    initChartData(_charts);
};

const calDataByIp = (params) => {
    const { data } = responseStore.allReponseData;
    console.log('responseStore.allReponseData;', responseStore.allReponseData);
    const res = data.get('http://' + params.key);
    onLineNumber.value = res?.nums.d1;
    totalUserNumber.value = res?.nums.d2;
    newUserNumber.value = res?.nums.d3;
    newAmountNumber.value = res?.nums.d4;
    totalAmountNumber.value = res?.nums.d5;
    initChartData(res?.charts);
};

const setChart = () => {
    barOptions.value = {
        plugins: {
            legend: {
                labels: {
                    fontColor: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary,
                    font: {
                        weight: 500
                    }
                },
                grid: {
                    display: false,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        }
    };

    lineDataUser.value = {
        labels: xData.value,
        datasets: [
            {
                label: '历史新增用户数量',
                data: userData.value,
                fill: true,
                backgroundColor: 'rgba(20 ,184, 166,0.2)',
                borderColor: documentStyle.getPropertyValue('--teal-500'),
                tension: 0.4
            }
        ]
    };

    lineOptionsUser.value = {
        plugins: {
            legend: {
                labels: {
                    fontColor: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        }
    };

    lineDataMoney.value = {
        labels: xData.value,
        datasets: [
            {
                label: '历史充值数量',
                data: moneyData.value,
                fill: true,
                backgroundColor: 'rgba(249, 115 ,22,0.2)',
                borderColor: documentStyle.getPropertyValue('--orange-500'),
                tension: 0.4
            }
        ]
    };

    lineOptionsMoney.value = {
        plugins: {
            legend: {
                labels: {
                    fontColor: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        }
    };
};

const initChartData = (data) => {
    const bardatatemp = {
        labels: [],
        datasets: [
            {
                label: 'TAP',
                backgroundColor: 'rgba(99, 102 ,241,0.5)',
                borderColor: documentStyle.getPropertyValue('--indigo-500'),
                borderRadius: 3,
                borderWidth: 1,
                data: []
            },
            {
                label: '微信小程序',
                backgroundColor: 'rgba(20 ,184, 166,0.5)',
                borderColor: documentStyle.getPropertyValue('--teal-500'),
                borderRadius: 3,
                borderWidth: 1,
                data: []
            },
            {
                label: '信息流',
                backgroundColor: 'rgba(249, 115 ,22,0.5)',
                borderColor: documentStyle.getPropertyValue('--orange-500'),
                borderRadius: 3,
                borderWidth: 1,
                data: []
            }
        ]
    };
    const xData_t = [];
    const userData_t = [];
    const moneyData_t = [];
    Object.keys(data).forEach((item) => {
        const total_user = data[item].tap + data[item].xxl + data[item].weixin;
        bardatatemp.labels.push(data[item].zb);
        bardatatemp.datasets[0].data.push(data[item].tap);
        bardatatemp.datasets[1].data.push(data[item].weixin);
        bardatatemp.datasets[2].data.push(data[item].xxl);

        xData_t.push(proxy.$moment(data[item].zb).format('YYYY-MM-DD'));
        userData_t.push(total_user || 0);
        moneyData_t.push(data[item].je || 0);
    });
    xData.value = xData_t;
    userData.value = userData_t;
    moneyData.value = moneyData_t;
    barData.value = bardatatemp;

    setChart();
};

watch(
    () => currentDay.value,
    (nv) => {
        const start = proxy
            .$moment()
            .subtract(nv - 1, 'days')
            .format('YYYY-MM-DD');
        const end = proxy.$moment().format('YYYY-MM-DD');
       if (currentIp.value !== 'all') {
            worker.postMessage({
                action: 'preloadData',
                data: [
                    {
                        ip: currentIp.value
                    }
                ],
                params: {
                    start,
                    end
                }
            });
        }else{
        const ips = JSON.parse(localStorage.getItem('serverList'));
          worker.postMessage({
                action: 'preloadData',
                data:JSON.parse(JSON.stringify(ips)),
                params: {
                    start,
                    end
                }
            });  
        }
        worker.onmessage = (e) => {
            console.log('0-0-0-0', e.data);
            calAllData(e.data);
            // 接受到全部数据后，缓存起来，当点击左侧的服务器时，就返回对应服务器的数据
            responseStore.setResData(e.data);
        };
        if (currentIp.value !== 'all') {
            calDataByIp({ key: currentIp.value });
        }
        time.value = '';
    }
);

watch(
    () => time.value,
    (nv) => {
        const [start, end] = nv;
        if (!nv) return;
        if (currentIp.value !== 'all') {
            worker.postMessage({
                action: 'preloadData',
                data: [
                    {
                        ip: currentIp.value
                    }
                ],
                params: {
                    start,
                    end
                }
            });
        }else{
        const ips = JSON.parse(localStorage.getItem('serverList'));
          worker.postMessage({
                action: 'preloadData',
                data:JSON.parse(JSON.stringify(ips)),
                params: {
                    start,
                    end
                }
            });  
        }

        worker.onmessage = (e) => {
            console.log('0-0-0-0-jkjkjk', e.data);
            calAllData(e.data);
            // 接受到全部数据后，缓存起来，当点击左侧的服务器时，就返回对应服务器的数据
            responseStore.setResData(e.data);
        };
        // start && end && initChartData(proxy.$moment(start).format('YYYY-MM-DD'), proxy.$moment(end).format('YYYY-MM-DD'));
    }
);
onBeforeUnmount(() => {
    clearInterval(timer.value);
});
const getStatisticsData = async () => {
    productService.getOnlineUsers({ ip: ip.value }).then((res) => {
        onLineNumber.value = res.login || '0';
        totalUserNumber.value = res.all || '0';
    });
    productService.getNewUser({ ip: ip.value }).then((res) => {
        newUserNumber.value = res || '0';
    });
    productService.getNewAmount({ ip: ip.value }).then((res) => {
        newAmountNumber.value = res.today || '0';
        totalAmountNumber.value = res.all || '0';
    });
};
const setColorOptions = () => {
    documentStyle = getComputedStyle(document.documentElement);
    textColor = documentStyle.getPropertyValue('--text-color');
    textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    surfaceBorder = documentStyle.getPropertyValue('--surface-border');
};

watch(
    layoutConfig.theme,
    () => {
        setColorOptions();
        setChart();
    },
    { immediate: true }
);
</script>

<template>
    <div class="grid p-fluid">
        <div class="col-12 xl:col-8">
            <div class="flex gap-2" style="flex-warp: warp">
                <Button type="button" class="btn-cus" @click="currentDay = 1" :class="currentDay === 1 ? 'actived' : ''">
                    <span class="flex align-items-center px-2 bg-bluegray-800 text-white">
                        <i className="pi pi-calendar-times"></i>
                    </span>
                    <span className="px-3 py-2 flex align-items-center text-white">最近一天</span>
                </Button>
                <Button type="button" class="btn-cus" @click="currentDay = 3" :class="currentDay === 3 ? 'actived' : ''">
                    <span class="flex align-items-center px-2 bg-bluegray-800 text-white">
                        <i className="pi pi-calendar-times"></i>
                    </span>
                    <span className="px-3 py-2 flex align-items-center text-white">最近三天</span>
                </Button>
                <Button type="button" class="btn-cus" @click="currentDay = 7" :class="currentDay === 7 ? 'actived' : ''">
                    <span class="flex align-items-center px-2 bg-bluegray-800 text-white">
                        <i className="pi pi-calendar-times"></i>
                    </span>
                    <span className="px-3 py-2 flex align-items-center text-white">最近一周</span>
                </Button>
                <Button type="button" class="btn-cus" @click="currentDay = 30" :class="currentDay === 30 ? 'actived' : ''">
                    <span class="flex align-items-center px-2 bg-bluegray-800 text-white">
                        <i className="pi pi-calendar-times"></i>
                    </span>
                    <span className="px-3 py-2 flex align-items-center text-white">最近一月</span>
                </Button>
            </div>
        </div>
        <div class="col-12 xl:col-4">
            <Calendar dateFormat="yy/mm/dd" selectionMode="range" :manualInput="false" v-model="time" showIcon />
        </div>
        <div class="col-12 xl:col-2-5">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">今日新增用户</span>
                        <div class="text-900 font-medium text-xl">{{ newUserNumber }} <span class="text-500 text-sm">人</span></div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-user-plus text-blue-500 text-xl"></i>
                    </div>
                </div>
                <!-- <span class="text-green-500 font-medium">24 new </span>
                <span class="text-500">since last visit</span> -->
            </div>
        </div>
        <div class="col-12 xl:col-2-5">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">用户总量</span>
                        <div class="text-900 font-medium text-xl">{{ totalUserNumber }} <span class="text-500 text-sm">人</span></div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-user-plus text-blue-500 text-xl"></i>
                    </div>
                </div>
                <!-- <span class="text-green-500 font-medium">24 new </span>
                <span class="text-500">since last visit</span> -->
            </div>
        </div>
        <div class="col-12 xl:col-2-5">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">当前在线人数</span>
                        <div class="text-900 font-medium text-xl">{{ onLineNumber }} <span class="text-500 text-sm">人</span></div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-cyan-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-verified text-cyan-500 text-xl"></i>
                    </div>
                </div>
                <!-- <span class="text-green-500 font-medium">520 </span>
                <span class="text-500">newly registered</span> -->
            </div>
        </div>
        <div class="col-12 xl:col-2-5">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">今日充值数</span>
                        <div class="text-900 font-medium text-xl">{{ newAmountNumber }} <span class="text-500 text-sm">元</span></div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-bitcoin text-orange-500 text-xl"></i>
                    </div>
                </div>
                <!-- <span class="text-green-500 font-medium">%52+ </span>
                <span class="text-500">since last week</span> -->
            </div>
        </div>
        <div class="col-12 xl:col-2-5">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">总充值额</span>
                        <div class="text-900 font-medium text-xl">{{ totalAmountNumber }} <span class="text-500 text-sm">元</span></div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-bitcoin text-orange-500 text-xl"></i>
                    </div>
                </div>
                <!-- <span class="text-green-500 font-medium">%52+ </span>
                <span class="text-500">since last week</span> -->
            </div>
        </div>
        <div class="col-12 xl:col-6">
            <div class="card">
                <h5>新增用户</h5>
                <Chart type="line" :data="lineDataUser" :options="lineOptionsUser"></Chart>
            </div>
        </div>
        <div class="col-12 xl:col-6">
            <div class="card">
                <h5>充值数据</h5>
                <Chart type="line" :data="lineDataMoney" :options="lineOptionsMoney"></Chart>
            </div>
        </div>

        <div class="col-12 xl:col-6">
            <div class="card">
                <h5>各平台数据统计</h5>
                <Chart type="bar" :data="barData" :options="barOptions"></Chart>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.btn-cus {
    background: linear-gradient(to left, var(--bluegray-700) 50%, var(--bluegray-800) 50%);
    background-size: 200% 100%;
    background-position: right bottom;
    transition: background-position 0.5s ease-out;
    border-color: var(--bluegray-800);
    padding: 0;
    display: flex;
    align-items: stretch;

    &:enabled:hover {
        background: linear-gradient(to left, var(--bluegray-700) 50%, var(--bluegray-800) 50%);
        background-size: 200% 100%;
        background-position: left bottom;
        border-color: var(--bluegray-800);
    }

    &:focus {
        box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #7478f0, 0 1px 2px 0 black;
    }
}

.actived {
    background: linear-gradient(to left, var(--teal-700) 50%, var(--teal-800) 50%);
    background-size: 200% 100%;
    background-position: right bottom;
    transition: background-position 0.5s ease-out;
    border-color: var(--teal-800);
    padding: 0;
    display: flex;
    align-items: stretch;
    box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px var(--teal-700), 0 1px 2px 0 black;

    &:enabled:hover {
        background: linear-gradient(to left, var(--teal-700) 50%, var(--teal-800) 50%);
        background-size: 200% 100%;
        background-position: left bottom;
        border-color: var(--teal-800);
    }

    &:focus {
        box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px var(--teal-700), 0 1px 2px 0 black;
    }
}

.template-button .p-button.discord {
    background: linear-gradient(to left, var(--bluegray-700) 50%, var(--bluegray-800) 50%);
    background-size: 200% 100%;
    background-position: right bottom;
    transition: background-position 0.5s ease-out;
    color: #fff;
    border-color: var(--bluegray-800);
}
.template-button .p-button.discord:hover {
    background-position: left bottom;
}
.template-button .p-button.discord i {
    background-color: var(--bluegray-800);
}
.template-button .p-button.discord:focus {
    box-shadow: 0 0 0 1px var(--bluegray-500);
}
@media screen and (min-width: 1200px) {
    .xl\:col-2-5 {
        flex: 0 0 auto;
        padding: 1rem;
        width: 20%;
    }
}
@media screen and (min-width: 1200px) {
    .xl\:col-2-5 {
        flex: 0 0 auto;
        padding: 1rem;
        width: 20%;
    }
}
</style>
