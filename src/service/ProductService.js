export default class ProductService {
    getProductsSmall() {
        return fetch('demo/data/products-small.json')
            .then((res) => res.json())
            .then((d) => d.data);
    }

    getProducts() {
        return fetch('demo/data/products.json')
            .then((res) => res.json())
            .then((d) => d.data);
    }

    getProductsWithOrdersSmall() {
        return fetch('demo/data/products-orders-small.json')
            .then((res) => res.json())
            .then((d) => d.data);
    }

    /**
     * 获取在线人数
     * @returns 
     */
    getOnlineUsers() {
        return fetch('http://192.168.1.106:8102/api/tj/login/count')
            .then((res) => res.json())
            .then((d) => d.data);
    }

    /**
     * 获取菜单
     */
    getMenuData() {
        return fetch('http://192.168.1.106:8102/api/tj/server/list')
            .then((res) => res.json())
            .then((d) => d.data);
    }
}
