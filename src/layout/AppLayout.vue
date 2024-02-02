<script setup>
import { computed, watch, ref, getCurrentInstance } from 'vue';
import AppTopbar from './AppTopbar.vue';
import AppFooter from './AppFooter.vue';
import AppSidebar from './AppSidebar.vue';
import AppConfig from './AppConfig.vue';
import { useLayout } from '@/layout/composables/layout';
import ProductService from '@/service/ProductService';
import { useRouter } from 'vue-router';
import { useEventBus } from '@vueuse/core';
import { useResponseStore } from '@/stores/modules/response';
const responseStore = useResponseStore();
const { proxy } = getCurrentInstance();
const worker = new Worker('web-workers/worker.js');
const bus = useEventBus('server-selected');
const router = useRouter();
const productService = new ProductService();
const serverList = ref([]);
const { layoutConfig, layoutState, isSidebarActive } = useLayout();
const showServers = ref(false);
const outsideClickListener = ref(null);
const currentServer = ref('');
const expandedKeys = ref({ 0: true });
const selectionKeys = ref({ 0: true });
watch(isSidebarActive, (newVal) => {
    if (newVal) {
        bindOutsideClickListener();
    } else {
        unbindOutsideClickListener();
    }
});

//监听路由
watch(
    () => router.currentRoute.value.path,
    (newVal) => {
        if (newVal == '/uikit/charts') {
            showServers.value = true;

            productService.getMenuData().then((res) => {
                // res每50个一组
                const groupedData = res.reduce((result, item, index) => {
                    const chunkIndex = Math.floor(index / 50);

                    if (!result[chunkIndex]) {
                        result[chunkIndex] = [];
                    }

                    result[chunkIndex].push({
                        label: item.name,
                        data: item.ip,
                        key: item.ip
                    });

                    return result;
                }, []);

                serverList.value = groupedData.map((item, index) => {
                    return {
                        label: `区服${index + 1}-区服${(index + 1) * 50}`,
                        data: 50,
                        children: item,
                        key: index,
                        icon: 'pi pi-bookmark-fill'
                    };
                });
                localStorage.setItem('servers', JSON.stringify(serverList.value));
                currentServer.value = serverList.value.length > 0 ? serverList.value[0]?.children[0] : '';
                localStorage.setItem('server', JSON.stringify(50));

                // worker.postMessage({ action: 'preloadData', data: serverList.value });
                const start = proxy
                    .$moment()
                    .subtract(3 - 1, 'days')
                    .format('YYYY-MM-DD');
                const end = proxy.$moment().format('YYYY-MM-DD');
                worker.postMessage({
                    action: 'preloadData',
                    data: [
                        {
                            id: 1,
                            sl: 1200,
                            name: '群雄并起',
                            ip: '49.232.128.232'
                        }
                    ],
                    params: {
                        start,
                        end
                    }
                });
                worker.onmessage = (e) => {
                    console.log(e.data);
                    // 接受到全部数据后，缓存起来，当点击左侧的服务器时，就返回对应服务器的数据
                    responseStore.setResData(e.data)
                };
            });
        } else {
            showServers.value = false;
        }
    },
    { immediate: true, deep: true }
);

const containerClass = computed(() => {
    return {
        'layout-theme-light': layoutConfig.darkTheme.value === 'light',
        'layout-theme-dark': layoutConfig.darkTheme.value === 'dark',
        'layout-overlay': layoutConfig.menuMode.value === 'overlay',
        'layout-static': layoutConfig.menuMode.value === 'static',
        'layout-static-inactive': layoutState.staticMenuDesktopInactive.value && layoutConfig.menuMode.value === 'static',
        'layout-overlay-active': layoutState.overlayMenuActive.value,
        'layout-mobile-active': layoutState.staticMenuMobileActive.value,
        'p-input-filled': layoutConfig.inputStyle.value === 'filled',
        'p-ripple-disabled': !layoutConfig.ripple.value
    };
});
const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                layoutState.overlayMenuActive.value = false;
                layoutState.staticMenuMobileActive.value = false;
                layoutState.menuHoverActive.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
};
const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
};
const isOutsideClicked = (event) => {
    const sidebarEl = document.querySelector('.layout-sidebar');
    const topbarEl = document.querySelector('.layout-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};

const serverChange = (e) => {
    localStorage.setItem('server', JSON.stringify(e.children ? e.data : e.data));
    bus.emit('serverChange', e);
};
</script>

<template>
    <div class="layout-wrapper" :class="containerClass">
        <app-topbar></app-topbar>
        <div class="layout-sidebar">
            <app-sidebar></app-sidebar>
        </div>
        <div class="layout-main-container">
            <div class="layout-main" :style="{ display: showServers ? 'flex' : '' }">
                <div class="server-list" v-if="showServers">
                    <!-- <Listbox :options="serverList" @change="serverChange" v-model="currentServer" optionLabel="name" optionGroupLabel="label" optionGroupChildren="items" class="w-full md:w-14rem" listStyle="max-height:250px">
                        <template #optiongroup="slotProps">
                            <div class="flex align-items-center">
                                <i class="pi pi-bookmark-fill"></i>
                                <div>{{ slotProps.option.label }}</div>
                            </div>
                        </template>
                    </Listbox> -->
                    <Tree v-model:expandedKeys="expandedKeys" v-model:selectionKeys="selectionKeys" @node-select="serverChange" :value="serverList" selectionMode="single" class="w-full md:w-30rem"></Tree>
                </div>
                <router-view></router-view>
            </div>
            <app-footer></app-footer>
        </div>
        <app-config></app-config>
        <div class="layout-mask"></div>
    </div>
</template>

<style lang="scss" scoped>
.server-list {
    height: calc(100vh - 9rem);
    margin-right: 20px;
    .p-listbox {
        height: 100%;
        :deep(.p-listbox-list-wrapper) {
            height: 100%;
            max-height: none !important;
        }
    }
}
</style>
