<script setup>
import { onMounted, ref, watch } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import ProductService from '@/service/ProductService';

const { layoutConfig } = useLayout();
let documentStyle = getComputedStyle(document.documentElement);
let textColor = documentStyle.getPropertyValue('--text-color');
let textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
let surfaceBorder = documentStyle.getPropertyValue('--surface-border');

const onLineNumber = ref(0);
const lineData = ref(null);
const pieData = ref(null);
const polarData = ref(null);
const barData = ref(null);
const radarData = ref(null);
const time = ref('');
const lineOptions = ref(null);
const pieOptions = ref(null);
const polarOptions = ref(null);
const barOptions = ref(null);
const radarOptions = ref(null);
const productService = new ProductService();

onMounted(() => {
    productService.getOnlineUsers().then((res) => {
        onLineNumber.value = res;
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
                label: 'My First dataset',
                backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                borderColor: documentStyle.getPropertyValue('--primary-500'),
                data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
                label: 'My Second dataset',
                backgroundColor: documentStyle.getPropertyValue('--primary-200'),
                borderColor: documentStyle.getPropertyValue('--primary-200'),
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

    pieData.value = {
        labels: ['A', 'B', 'C'],
        datasets: [
            {
                data: [540, 325, 702],
                backgroundColor: [documentStyle.getPropertyValue('--indigo-500'), documentStyle.getPropertyValue('--purple-500'), documentStyle.getPropertyValue('--teal-500')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--indigo-400'), documentStyle.getPropertyValue('--purple-400'), documentStyle.getPropertyValue('--teal-400')]
            }
        ]
    };

    pieOptions.value = {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: textColor
                }
            }
        }
    };

    lineData.value = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'First Dataset',
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                borderColor: documentStyle.getPropertyValue('--primary-500'),
                tension: 0.4
            },
            {
                label: 'Second Dataset',
                data: [28, 48, 40, 19, 86, 27, 90],
                fill: false,
                backgroundColor: documentStyle.getPropertyValue('--primary-200'),
                borderColor: documentStyle.getPropertyValue('--primary-200'),
                tension: 0.4
            }
        ]
    };

    lineOptions.value = {
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

    polarData.value = {
        datasets: [
            {
                data: [11, 16, 7, 3],
                backgroundColor: [documentStyle.getPropertyValue('--indigo-500'), documentStyle.getPropertyValue('--purple-500'), documentStyle.getPropertyValue('--teal-500'), documentStyle.getPropertyValue('--orange-500')],
                label: 'My dataset'
            }
        ],
        labels: ['Indigo', 'Purple', 'Teal', 'Orange']
    };

    polarOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            r: {
                grid: {
                    color: surfaceBorder
                }
            }
        }
    };

    radarData.value = {
        labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
        datasets: [
            {
                label: 'My First dataset',
                borderColor: documentStyle.getPropertyValue('--indigo-400'),
                pointBackgroundColor: documentStyle.getPropertyValue('--indigo-400'),
                pointBorderColor: documentStyle.getPropertyValue('--indigo-400'),
                pointHoverBackgroundColor: textColor,
                pointHoverBorderColor: documentStyle.getPropertyValue('--indigo-400'),
                data: [65, 59, 90, 81, 56, 55, 40]
            },
            {
                label: 'My Second dataset',
                borderColor: documentStyle.getPropertyValue('--purple-400'),
                pointBackgroundColor: documentStyle.getPropertyValue('--purple-400'),
                pointBorderColor: documentStyle.getPropertyValue('--purple-400'),
                pointHoverBackgroundColor: textColor,
                pointHoverBorderColor: documentStyle.getPropertyValue('--purple-400'),
                data: [28, 48, 40, 19, 96, 27, 100]
            }
        ]
    };

    radarOptions.value = {
        plugins: {
            legend: {
                labels: {
                    fontColor: textColor
                }
            }
        },
        scales: {
            r: {
                grid: {
                    color: textColorSecondary
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
            <div class="flex gap-2">
                <Button type="button" class="btn-cus">
                    <span class="flex align-items-center px-2 bg-bluegray-800 text-white">
                        <i className="pi pi-calendar-times"></i>
                    </span>
                    <span className="px-3 py-2 flex align-items-center text-white">最近一天</span>
                </Button>
                <Button type="button" class="btn-cus">
                    <span class="flex align-items-center px-2 bg-bluegray-800 text-white">
                        <i className="pi pi-calendar-times"></i>
                    </span>
                    <span className="px-3 py-2 flex align-items-center text-white">最近三天</span>
                </Button>
                <Button type="button" class="btn-cus">
                    <span class="flex align-items-center px-2 bg-bluegray-800 text-white">
                        <i className="pi pi-calendar-times"></i>
                    </span>
                    <span className="px-3 py-2 flex align-items-center text-white">最近一周</span>
                </Button>
                <Button type="button" class="btn-cus">
                    <span class="flex align-items-center px-2 bg-bluegray-800 text-white">
                        <i className="pi pi-calendar-times"></i>
                    </span>
                    <span className="px-3 py-2 flex align-items-center text-white">最近一月</span>
                </Button>
            </div>
        </div>
        <div class="col-12 xl:col-4">
            <Calendar dateFormat="yy/mm/dd" v-model="time" showIcon showButtonBar />
        </div>
        <div class="col-12 xl:col-4">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">新增用户</span>
                        <div class="text-900 font-medium text-xl">152</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-user-plus text-blue-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">24 new </span>
                <span class="text-500">since last visit</span>
            </div>
        </div>
        <div class="col-12 xl:col-4">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">充值数</span>
                        <div class="text-900 font-medium text-xl">12390.3</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-bitcoin text-orange-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">%52+ </span>
                <span class="text-500">since last week</span>
            </div>
        </div>
        <div class="col-12 xl:col-4">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">当前在线人数</span>
                        <div class="text-900 font-medium text-xl">{{ onLineNumber }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-cyan-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-verified text-cyan-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">520 </span>
                <span class="text-500">newly registered</span>
            </div>
        </div>
        <div class="col-12 xl:col-6">
            <div class="card">
                <h5>新增用户</h5>
                <Chart type="line" :data="lineData" :options="lineOptions"></Chart>
            </div>
        </div>
        <div class="col-12 xl:col-6">
            <div class="card">
                <h5>充值数据</h5>
                <Chart type="line" :data="lineData" :options="lineOptions"></Chart>
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
</style>
