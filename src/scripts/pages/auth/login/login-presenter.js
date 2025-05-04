export default class LoginPresenter {
    #view;
    #model;
    #auth;

    constructor({ view, model, auth }) {
        this.#view = view;
        this.#model = model;
        this.#auth = auth;
    }

    async getLogin({ email, password }) {
        this.#view.showSubmitLoadingButton();
        
        try{
            const response = await this.#model.getLogin({ email, password });

            if (!response.ok) {
                this.#view.loginFail(response.message);
                return;
            }

            this.#auth.putAccessToken(response.loginResult.token);

            this.#view.loginSuccessfull(response.message, response.loginResult);            
        } catch(error){
            this.#view.loginFail(error.message);
        } finally {
            this.#view.hideSubmitLoadingButton();
        }
    }
}