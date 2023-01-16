import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

// 1.建立元件
const app = {
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: 'artworld',
            products: [],
            tempProducts: {},     // template 暫存區
        }
    },
    methods: {
        checkLogin() {
            const url = `${this.apiUrl}/api/user/check`
            axios.post(url)
                .then(() => {
                    this.getData();
                })
                .catch((err) => {
                    alert(err.response.data.message);
                    window.location = 'login.html';
                })
        },
        getData() {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/products`
            axios.get(url)
                .then((res) => {
                    this.products = res.data.products;
                })
                .catch((err => {
                    alert(err.response.data.message);
                }))
        }
    },
    mounted() {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexschool\s*=\s*([^;]*).*$)|^.*$/, '$1');
        axios.defaults.headers.common['Authorization'] = token;

        this.checkLogin()
    }
};

createApp(app)      // 2.生成 Vue 應用程式
    .mount("#app");   // 3.渲染至畫面