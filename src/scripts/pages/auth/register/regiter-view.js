import RegisterPresenter from "./register-presenter.js";
import * as Model from "../../../data/api.js"

export default class RegisterPage {
    #presenter = null;

    async render() {
        return `
            <section class="register-container">
                <div class="register-form-container">
                <h1 class="register__title">Daftar Akun</h1>

                <form id="register-form" class="register-form">
                    <div class="form-control">
                    <label for="name-input" class="register-form__name-title">Nama lengkap</label>

                    <div class="register-form__title-container">
                        <input id="name-input" type="text" name="name" placeholder="Masukkan nama lengkap Anda">
                    </div>
                    </div>
                    <div class="form-control">
                    <label for="email-input" class="register-form__email-title">Email</label>

                    <div class="register-form__title-container">
                        <input id="email-input" type="email" name="email" placeholder="Contoh: nama@email.com">
                    </div>
                    </div>
                    <div class="form-control">
                    <label for="password-input" class="register-form__password-title">Password</label>

                    <div class="register-form__title-container">
                        <input id="password-input" type="password" name="password" placeholder="Masukkan password baru">
                    </div>
                    </div>
                    <div class="form-buttons register-form__form-buttons">
                    <div id="submit-button-container">
                        <button class="btn" type="submit">Daftar akun</button>
                    </div>
                    <p class="register-form__already-have-account">Sudah punya akun? <a href="#/login">Masuk</a></p>
                    </div>
                </form>
                </div>
            </section>
        `;
    }

    async afterRender() {
        this.#presenter = new RegisterPresenter({
            view: this,
            model: Model,
        });
        this.#setupForm();
    }

    #setupForm() {
        document.getElementById('register-form').addEventListener('submit', async (event) => {
            event.preventDefault();

            
            const data = {
                name: document.getElementById('name-input').value,
                email: document.getElementById('email-input').value,
                password: document.getElementById('password-input').value,
            };
            
            if (!data.name || !data.email || !data.password) {
                alert('Semua field wajib diisi!');
                return;
            }
            if (data.password.length < 8) {
                alert('Password minimal 8 karakter!');
                return;
            }
            
            await this.#presenter.getRegister(data);
        });
    }

    registerSuccesfull(message) {
        location.hash = '/login';
    }

    registerFail(message) {
        alert(message);
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