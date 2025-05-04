export default class addNewStoryPresenter {
    #view;
    #model;

    constructor({ view, model }) {
        this.#view = view;
        this.#model = model;
    }

    async showNewFormMap() {
        this.#view.showLoadingMap();
        try {
            await this.#view.initialMap();
        } catch (error) {
            console.error('showNewFormMap: error: ', error);
        } finally {
            this.#view.hideLoadingMap();
        }
    }

    async addNewStory({
        desc,
        img,
        lat,
        lon
    }) {
        this.#view.showLoadingSubmitButton();
        try {
            const data = {
                desc: desc,
                img: img,
                lat: lat,
                lon: lon,
            }
            const response = await this.#model.addNewStory(data);

            if (!response.ok) {
                console.error('addNewStory: response: ', response);
                this.#view.addFail(response.message);
                return;
            }

            this.#view.addNewSuccessfull(response.message, response.data);
        } catch(error) {
            console.error('addNewStory: error: ', error);
            this.#view.addFail(error.message);
        } finally {
            this.#view.hideLoadingSubmitButton();
        }
    }
}