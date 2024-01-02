<script setup>
import { onMounted, ref } from 'vue';
import ProductService from '@/service/ProductService';

import AppMenuItem from './AppMenuItem.vue';
const productService = new ProductService();

const model = ref([
    // {
    //     label: 'UI Components',
    //     items: [
    //         { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', to: '/uikit/formlayout' },
    //         { label: 'Button', icon: 'pi pi-fw pi-mobile', to: '/uikit/button', class: 'rotated-icon' },
    //         { label: 'Table', icon: 'pi pi-fw pi-table', to: '/uikit/table' },
    //         { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/uikit/charts' },
    //     ]
    // },
]);

onMounted(() => {
    productService.getMenuData().then((res) => {
        console.log(res)
        if (Array.isArray(res)) {
            // 递归数据，每50条为一组
            const groupedData = res.reduce((result, item, index) => {
                const groupIndex = Math.floor(index / 50);
                if (!result[groupIndex]) {
                    result[groupIndex] = {
                        label: `${groupIndex*50+1}-${(groupIndex+1)*50}区服`,
                        items: []
                    };
                }
                result[groupIndex].items.push({
                    label: item.name,
                    to: '/uikit/charts'
                });
                return result;
            });
            const menus = {
                label: '日常统计',
                items: [
                    {
                        label: '天龙八部',
                        icon: 'pi pi-fw pi-box',
                        items: []
                    }
                ]
            };
            Object.values(groupedData).map(item=>{
                if(typeof item === 'object'){
                    menus.items[0].items.push(item)
                }
            })
            model.value.push(menus);
        }
        model.value.push({
            label: '游戏运营',
            items: [
                {
                    label: '发布公告',
                    icon: 'pi pi-fw pi-volume-down',
                    to: '/uikit/publish'
                },
                {
                    label: '外挂检测',
                    icon: 'pi pi-fw pi-key'
                }
            ]
        });
    });
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
