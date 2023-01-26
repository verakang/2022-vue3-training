import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';

const site = "https://vue3-course-api.hexschool.io/v2/";

const app = createApp({
    data() {
        return {
            user: {
                "username": "",
                "password": ""
            }
        }
    },
    methods: {
        login() {
            const url = `${site}admin/signin`;
            axios.post(url, this.user)
                .then((res) => {
                    const { expired, token } = res.data;
                    document.cookie = `hexschool=${token}; expires=${new Date(expired)}`;
                    window.location = "./products.html";
                })
                .catch((err) => {
                    alert(err.data.message);
                    this.user = {};
                })
        }
    }
});
app.mount("#app");