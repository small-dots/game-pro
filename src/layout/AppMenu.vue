<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

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
    {
        label: '日常统计',
        items: [
            {
                label: '天龙八部',
                icon: 'pi pi-fw pi-box',
                items: [
                    {
                        label: '1-50区服',
                        items: [
                            { label: '1-区服',to:"/uikit/charts" },
                            { label: '2-区服',to:"/uikit/charts" },
                            { label: '3-区服',to:"/uikit/charts" }
                        ]
                    },
                    {
                        label: 'Submenu 1.2',
                        
                        items: [{ label: 'Submenu 1.2.1' }]
                    }
                ]
            },
            {
                label: 'Submenu 2',
                icon: 'pi pi-fw pi-box',
                items: [
                    {
                        label: 'Submenu 2.1',
                        
                        items: [
                            { label: 'Submenu 2.1.1' },
                            { label: 'Submenu 2.1.2' }
                        ]
                    },
                    {
                        label: 'Submenu 2.2',
                        
                        items: [{ label: 'Submenu 2.2.1' }]
                    }
                ]
            }
        ]
    },
    {
        label: '游戏运营',
        items: [
            {
                label: '发布公告',
                icon: 'pi pi-fw pi-volume-down',
                to:'/uikit/publish'
            },
            {
                label: '外挂检测',
                icon: 'pi pi-fw pi-key',
            }
        ]
    },
]);
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
