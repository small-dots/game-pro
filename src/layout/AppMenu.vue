<script setup>
import { onMounted, ref } from 'vue';
import ProductService from '@/service/ProductService';

import AppMenuItem from './AppMenuItem.vue';
const productService = new ProductService();

const model = ref([
      
   {
        label: '首页',
        items: [{ label: '数据概览', icon: 'pi pi-fw pi-chart-line', to: '/uikit/charts' }]
    },
    {
        label: '游戏运营',
        items: [
            {
                label: '发布公告',
                icon: 'pi pi-fw pi-volume-down',
                to: '/uikit/notice'
            },
            {
                label: '全服通报',
                icon: 'pi pi-fw pi-bolt',
                 to: '/uikit/global'
            },
            {
                label: 'CDK',
                icon: 'pi pi-fw pi-gift',
                 to: '/uikit/cdk'
            },
            {
                label: '邮件发送',
                icon: 'pi pi-fw pi-send',
                 to: '/uikit/formlayout'
            }
        ]
    },
]);

onMounted(() => {
});
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
