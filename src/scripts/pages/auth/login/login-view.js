import LoginPresenter from "./login-presenter.js";
import * as Model from "../../../data/api.js";
import * as Auth from "../../../utils/auth.js";

export default class LoginPage {
    #presenter = null;

    async render() {
        return `
            <section class="login-container">
                <article class="login-form-container">
                <h1 class="login__title">Masuk akun</h1>

                <form id="login-form" class="login-form">
                    <div class="form-control">
                    <label for="email-input" class="login-form__email-title">Email</label>

                    <div class="login-form__title-container">
                        <input id="email-input" type="email" name="email" placeholder="Contoh: nama@email.com">
                    </div>
                    </div>
                    <div class="form-control">
                    <label for="password-input" class="login-form__password-title">Password</label>

                    <div class="login-form__title-container">
                        <input id="password-input" type="password" name="password" placeholder="Masukkan password Anda">
                    </div>
                    </div>
                    <div class="form-buttons login-form__form-buttons">
                    <div id="submit-button-container">
                        <button class="btn" type="submit">Masuk</button>
                    </div>
                    <p class="login-form__do-not-have-account">Belum punya akun? <a href="#/register">Daftar</a></p>
                    </div>
                </form>
                </article>
            </section>
        `;
    }

    async afterRender() {
        this.#presenter = new LoginPresenter({
            view: this,
            model: Model,
            auth: Auth,
        });

        this.#setupForm();
    }

    #setupForm() {
        document.getElementById('login-form').addEventListener('submit', async (event) => {
            event.preventDefault();

            const data = {
                email: document.getElementById('email-input').value,
                password: document.getElementById('password-input').value,
            };

            await this.#presenter.getLogin(data);
        })
    }

    loginSuccessfull(message) {
        alert(`${message}, Selamat datang ${data.name}`);
        location.hash = '/';
    }

    loginFail(message) {
        alert(`Login gagal: ${message}`);
    }

    showSubmitLoadingButton() {
        document.getElementById('submit-button-container').innerHTML = `
            <button class="btn" type="submit" disabled>
                <i class="fas fa-spinner loader-button"></i> Daftar akun
            </button>
        `;
    }

    hideSubmitLoadingButton() {
        document.getElementById('submit-button-container').innerHTML = `
            <button class="btn" type="submit">Register</button>
        `;
    }
}