const apiUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'vera-select';

// VeeValiadation
Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
        VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
});

// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');
// Activate the locale
VeeValidate.configure({
    generateMessage: VeeValidateI18n.localize('zh_TW'),
    validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

const productModal = {
    props: ["addToCart", "carts", "product"],
    data() {
        return {
            modal: {},
            qty: 1,
        }
    },
    template: `#userProductModal`,
    methods: {
        openModal() {
            this.modal.show();
        },
        closeModal() {
            this.modal.hide();
        },
    },
    mounted() {
        this.modal = new bootstrap.Modal(this.$refs.modal);
    }
};

const app = Vue.createApp({
    data() {
        return {
            products: [],
            product: {},
            productId: '',
            cart: {},
            loadingItem: '',
            form: {
                user: {
                    name: '',
                    email: '',
                    tel: '',
                    address: ''
                },
                message: ''
            }
        }
    },
    components: {
        productModal,
    },
    methods: {
        getProducts() {
            axios.get(`${apiUrl}/v2/api/${apiPath}/products/all`)
                .then((res) => {
                    this.products = res.data.products;
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        getProduct(id) {
            this.loadingItem = id;
            axios.get(`${apiUrl}/v2/api/${apiPath}/product/${id}`)
                .then((res) => {
                    this.product = res.data.product;
                    this.$refs.userProductModal.openModal();
                    this.loadingItem = '';
                })
                .catch((err) => {
                    alert(`${err.data.message}，請再次確認。`);
                })
        },
        addToCart(product_id, qty = 1) {
            const data = {
                product_id,
                qty
            }
            this.loadingItem = product_id;
            axios.post(`${apiUrl}/v2/api/${apiPath}/cart`, { data })
                .then((res) => {
                    this.getCarts();
                    this.loadingItem = '';
                    alert(res.data.message);
                    this.$refs.userProductModal.closeModal();
                })
                .catch((err) => {
                    alert(`${err.data.message}，請再次確認。`);
                })
        },
        getCarts() {
            axios.get(`${apiUrl}/v2/api/${apiPath}/cart`)
                .then((res) => {
                    this.cart = res.data.data;
                })
                .catch((err) => {
                    alert(`${err.data.message}，請再次確認。`)
                })
        },
        updateCart(item) {
            const data = {
                product_id: item.product_id,
                qty: item.qty
            }
            this.loadingItem = item.id;
            axios.put(`${apiUrl}/v2/api/${apiPath}/cart/${item.id}`, { data })
                .then((res) => {
                    alert(res.data.message);
                    this.getCarts();
                    this.loadingItem = '';
                })
                .catch((err) => {
                    alert(`${err.data.message}，請再次確認。`)
                })
        },
        removeItem(item) {
            this.loadingItem = item.id;
            axios.delete(`${apiUrl}/v2/api/${apiPath}/cart/${item.id}`)
                .then(() => {
                    this.getCarts();
                    this.loadingItem = '';
                    alert(`已刪除 ${item.product.title}`);
                })
                .catch((err) => {
                    alert(`${err.data.message}，請再次確認。`)
                })
        },
        deleteCart() {
            axios.delete(`${apiUrl}/v2/api/${apiPath}/carts`)
                .then(() => {
                    alert("已清空購物車！")
                    this.getCarts();
                })
                .catch((err) => {
                    alert(err.data.message)
                })
        },
        sendOrder() {
            const data = this.form;
            axios.post(`${apiUrl}/v2/api/${apiPath}/order`, { data })
                .then((res) => {
                    alert(res.data.message)
                    this.$refs.form.resetForm();
                    this.getCarts();
                })
                .catch((err) => {
                    alert(`${err.data.message}，請再次確認。`)
                })
        },
    },
    mounted() {
        this.getProducts();
        this.getCarts();
    }
});

app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.mount('#app');