const api = 'https://vue3-course-api.hexschool.io/v2/admin/signin';
const loginBtn = document.querySelector("#login-btn");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");

loginBtn.addEventListener("click", login);

function login() {
    const username = usernameInput.value;
    const password = passwordInput.value;
    const data = {
        username,
        password,
    }
    axios.post(api, data)
        .then((res) => {
            const { expired, token } = res.data;
            document.cookie = `hexschool=${token}; expires=${expired}`;
            window.location = 'products.html';
        })
        .catch((err) => {
            alert(err.response.data.message);
        })
}