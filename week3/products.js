import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';

// 宣告 Bootstrap Modal、於生命週期階段綁定 DOM
let productModal = "";
let delProductModal = "";

const app = createApp({
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: `artworld`,
            products: [],
            productTemp: {
                imagesUrl: []
            },
            isNew: false
        }
    },
    methods: {
        checkLogin() {
            const url = `${this.apiUrl}/api/user/check`;
            axios.post(url)
                .then(() => {
                    // 已登入則撈取產品資料
                    this.getData();
                })
                .catch((err) => {
                    alert(err.data.message);
                    // 未登入則跳轉回登入頁
                    window.location = './login.html';
                })
        },
        getData() {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/products/all`;
            axios.get(url)
                .then((res) => {
                    // 將取得的資料存在 data
                    this.products = res.data.products;
                })
                .catch((err) => {
                    alert(err.data.message);
                })
        },
        openModal(state, product) {
            // 判斷不同狀態往下操作
            if (state === "create") {
                productModal.show();
                // 如果為新增資料，將狀態改為 true 並初始化欄位為空。
                this.isNew = true;
                this.productTemp = {
                    imagesUrl: []
                }
            } else if (state === "edit") {
                productModal.show();
                // 如果為編輯資料，將狀態改為 false 並將資料帶入欄位。
                this.isNew = false;
                // 修改欄位的顯示資料需要用淺拷貝，才不會直接連動到原始資料。
                this.productTemp = { ...product };
                // 判斷 imagesUrl 是否為陣列，如非陣列，則加入空陣列，讓原先沒有圖片的資料可以新增圖片。
                if (!Array.isArray(this.productTemp.imagesUrl)) {
                    this.productTemp.imagesUrl = [];
                }
            } else if (state === "delete") {
                delProductModal.show();
                this.productTemp = { ...product };
            }
        },
        updateProduct() {
            // url、method 預設為新增資料
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
            let method = 'post';
            // 判斷如非新增資料，則改為編輯資料。
            if (!this.isNew) {
                url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.productTemp.id}`;
                method = 'put';
            }
            axios[method](url, { data: this.productTemp })
                .then(() => {
                    this.getData();
                    productModal.hide();
                })
                .catch((err) => {
                    alert(err.data.message);
                })
        },
        removeProduct() {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.productTemp.id}`;
            axios.delete(url)
                .then(() => {
                    this.getData();
                    delProductModal.hide();
                })
                .catch((err) => {
                    console.log(err.data.message);
                })
        }
    },
    mounted() {
        // 取得 token
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexschool\s*=\s*([^;]*).*$)|^.*$/, '$1');
        axios.defaults.headers.common['Authorization'] = token;
        // 檢查是否已登入
        this.checkLogin();
        // Bootstrap初始化、綁定 DOM 元素
        productModal = new bootstrap.Modal("#productModal");
        delProductModal = new bootstrap.Modal("#delProductModal");
    }
});

app.mount("#app");



