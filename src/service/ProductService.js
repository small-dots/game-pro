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

    /**
     * 发布公告
     */
    postNotice(data) {
        return fetch('http://192.168.1.106:8102/api/gg/insert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then((res) => res.json())
        .then((d) => d.code);
    }

    /**
     * 查询公告列表
     */
    getNoticeList(query1, query2) {
        const queryParams = Object.keys(query1)
            .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(query1[k]))
            .join('&');
        return fetch('http://192.168.1.106:8102/api/gg/select?' + queryParams, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(query2),
        })
        .then((res) => res.json())
        .then((d) => d.data);;
    }

    /**
     * 当日新增用户
     */
    getNewUser() {
        return fetch('http://192.168.1.106:8102/api/tj/today/added')
            .then((res) => res.json())
            .then((d) => d.data);
    }

    /**
     * 当日充值数据
     */
    getNewAmount() {
        return fetch('http://192.168.1.106:8102/api/tj/today/amount')
            .then((res) => res.json())
            .then((d) => d.data);
    }
     /**
     * 历史数据统计
     */
     getHistoryData(query) {
        const queryParams = Object.keys(query)
        .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(query[k]))
        .join('&');
        return fetch('http://192.168.1.106:8102/api/tj/period?'+queryParams)
            .then((res) => res.json())
            .then((d) => d.data);
    }

    
}
