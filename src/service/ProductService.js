const value = import.meta.env.DEV ? 'dev-api' : 'getCurrentDomain';
const url = value == 'getCurrentDomain' ? window.location.protocol + '//' + window.location.host : value
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
    getOnlineUsers(data) {
        const ip = data?.ip
        const newurl = ip == 'getCurrentDomain' ? window.location.protocol + '//' + window.location.host : "http://" + ip
        return fetch(newurl + '/api/tj/login/count')
            .then((res) => res.json())
            .then((d) => d.data);
    }

    /**
     * 获取菜单
     */
    getMenuData() {
        return fetch(url + '/api/tj/server/list')
            .then((res) => res.json())
            .then((d) => d.data);
    }

    /**
     * 发布公告
     */
    postNotice(data) {
        return fetch(url + '/api/gg/insert', {
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
     * 删除公告
     */
    deleteNotice(query) {
        const queryParams = Object.keys(query)
        .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(query[k]))
        .join('&');
    return fetch(url + '/api/gg/delete?' + queryParams)
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
        return fetch(url + '/api/gg/select?' + queryParams, {
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
    getNewUser(data) {
        const ip = data?.ip
        const newurl = ip == 'getCurrentDomain' ? window.location.protocol + '//' + window.location.host : "http://" + ip
        return fetch(newurl + '/api/tj/today/added')
            .then((res) => res.json())
            .then((d) => d.data);
    }

    /**
     * 当日充值数据
     */
    getNewAmount(data) {
        const ip = data?.ip
        const newurl = ip == 'getCurrentDomain' ? window.location.protocol + '//' + window.location.host : "http://" + ip
        return fetch(newurl + '/api/tj/today/amount')
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
        return fetch(url + '/api/tj/period?' + queryParams)
            .then((res) => res.json())
            .then((d) => d.data);
    }

    /**
     * 邮件发送
     */
    sendEmail(data) {
        return fetch(url + '/api/msg/insert', {
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
     * CDK
     */
    getCDK(cdk, query2) {
        const queryParams = Object.keys(cdk)
            .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(cdk[k]))
            .join('&');
        return fetch(url + '/api/cdk/select?' + queryParams, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(query2),
        })
            .then((res) => res.json())
            .then((d) => d.data);
    }
    deleteCDK(cdk) {
        return fetch(url + '/api/cdk/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cdk),
        })
            .then((res) => res.json())
            .then((d) => d.code);
    }
    updateCDK(cdk) {
        return fetch(url + '/api/cdk/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cdk),
        })
            .then((res) => res.json())
            .then((d) => d.code);
    }
    addCDK(cdk) {
        return fetch(url + '/api/cdk/insert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cdk),
        })
            .then((res) => res.json())
            .then((d) => d.code);
    }

    /**
     * 获取奖励配置
     */
    getRewardConfig(data) {
        const queryParams = Object.keys(data)
            .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
            .join('&');
        return fetch(url + '/api/xtpz/select?' + queryParams)
            .then((res) => res.json())
            .then((d) => d.data);
    }

    /**
     * 统计平台数据
     */
    getPlatformData(data) {
        const ip = data?.ip
        const newurl = ip == 'getCurrentDomain' ? window.location.protocol + '//' + window.location.host : "http://" + ip
        return fetch(newurl + '/api/tj/plat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((d) => d);
    }
}
