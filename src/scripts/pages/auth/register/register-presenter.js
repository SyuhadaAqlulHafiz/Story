export default class RegisterPresenter {
    #view;
    #model;

    constructor({ view, model }) {
        this.#view = view;
        this.#model = model;
    }

    async getRegister({ name, email, password }) {
        this.#view.showSubmitLoadingButton();
        try {
            const response = await this.#model.getRegister({ name, email, password });

            if (!response.ok) {
                this.#view.registerFail(response.message);
                return;
            }

            this.#view.registerSuccesfull(response.message, response.data);
        } catch(error) {
            this.#view.registerFail(error.message);
        } finally {
            this.#view.hideSubmitLoadingButton();
        }
    }
}