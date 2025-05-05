export default class HomePresenter {
    #view;
    #model;

    constructor({ view, model }) {
        this.#view = view;
        this.#model = model;
    }
    
    async showHomePage() {
        this.#view.showLoading();

        try {
            const response = await this.#model.getAllStory();
    
            if (!response.ok) {
                console.error('showHomePage: response: ', response);
                this.#view.populateStoryError(response.message);
                return;
            }

            this.#view.populateStoryList(response.message, response.listStory);
        } catch(error) {
            console.error('showStoryList: error: ', error);
            this.#view.populateStoryError(error.message);
        } finally {
            this.#view.hideLoading();
        }
    }
}