<script setup>
import { onMounted, ref, watch, onBeforeUnmount, getCurrentInstance } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import ProductService from '@/service/ProductService';
const { proxy } = getCurrentInstance();
const { layoutConfig } = useLayout();
let documentStyle = getComputedStyle(document.documentElement);
let textColor = documentStyle.getPropertyValue('--text-color');
let textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
let surfaceBorder = documentStyle.getPropertyValue('--surface-border');

const onLineNumber = ref(0);
const newUserNumber = ref(0);
const newAmountNumber = ref(0);
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



onMounted(() => {
    /**
     * 获取统计数据,每个十分钟轮询一次
     */
    timer.value = setInterval(() => {
        getStatisticsData();
    }, 1000 * 60 * 10);

    getStatisticsData();
    [
        { rq: '2024-01-03', userCount: 12, money: 22 },
        { rq: '2024-01-04', userCount: 1, money: 158 },
        { rq: '2024-01-05', userCount: 9, money: 212 },
        { rq: '2024-01-06', userCount: 6, money: 222 },
        { rq: '2024-01-07', userCount: 19, money: 143 }
    ].map((item) => {
        xData.value.push(proxy.$moment(item.rq).format('YYYY-MM-DD'));
        userData.value.push(item.userCount || 0);
        moneyData.value.push(item.money || 0);
    });

    productService.getMenuData().then((res) => {
        console.log(res);
        // if (Array.isArray(res)) {
        //     // 递归数据，每50条为一组
        //     const groupedData = res.reduce((result, item, index) => {
        //         const groupIndex = Math.floor(index / 50);
        //         if (!result[groupIndex]) {
        //             result[groupIndex] = {
        //                 label: `${groupIndex * 50 + 1}-${(groupIndex + 1) * 50}区服`,
        //                 items: []
        //             };
        //         }
        //         result[groupIndex].items.push({
        //             label: item.name,
        //             to: '/uikit/charts'
        //         });
        //         return result;
        //     });
        // }
    });
});

const initData = (kssj,jssj) => {
      productService
        .getHistoryData({
            kssj: kssj,
            jssj: jssj
        })
        .then((res) => {
            if (Array.isArray(res)) {
                res.map((item) => {
                    xData.value.push(proxy.$moment(item.rq).format('YYYY-MM-DD'));
                    userData.value.push(item.userCount || 0);
                    moneyData.value.push(item.money || 0);
                });

                console.log(userData.value, moneyData.value, xData.value);
            }
        });
}
watch(
    () => currentDay.value,
    (nv) => {
        const start = proxy.$moment().subtract(nv, 'days').format("YYYY-MM-DD");
        const end = proxy.$moment().format("YYYY-MM-DD");
        console.log(start,end)
        initData(start, end);
    },
    {
        immediate: true
    }
);

watch(()=>time.value,(nv)=>{
   const [start,end] = nv
   start&&end&&initData(proxy.$moment(start).format("YYYY-MM-DD"), proxy.$moment(end).format("YYYY-MM-DD"));
})
onBeforeUnmount(() => {
    clearInterval(timer.value);
});
const getStatisticsData = async () => {
    productService.getOnlineUsers().then((res) => {
        onLineNumber.value = res || '0';
    });
    productService.getNewUser().then((res) => {
        newUserNumber.value = res || '0';
    });
    productService.getNewAmount().then((res) => {
        newAmountNumber.value = res || '0';
    });
};
const setColorOptions = () => {
    documentStyle = getComputedStyle(document.documentElement);
    textColor = documentStyle.getPropertyValue('--text-color');
    textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    surfaceBorder = documentStyle.getPropertyValue('--surface-border');
};

const setChart = () => {
    barData.value = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'TAP',
                backgroundColor: 'rgba(99, 102 ,241,0.5)',
                borderColor: documentStyle.getPropertyValue('--indigo-500'),
                borderRadius: 3,
                borderWidth: 1,
                data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
                label: '微信小程序',
                backgroundColor: 'rgba(20 ,184, 166,0.5)',
                borderColor: documentStyle.getPropertyValue('--teal-500'),
                borderRadius: 3,
                borderWidth: 1,
                data: [28, 48, 40, 19, 86, 27, 90]
            },
            {
                label: '信息流',
                backgroundColor: 'rgba(249, 115 ,22,0.5)',
                borderColor: documentStyle.getPropertyValue('--orange-500'),
                borderRadius: 3,
                borderWidth: 1,
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ]
    };
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
                        <span class="block text-500 font-medium mb-3">新增用户</span>
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
                        <span class="block text-500 font-medium mb-3">充值数</span>
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
