import { storyMapper } from "../../data/api-mapper.js";

export default class DetailPresenter {
    #detailId;
    #view;
    #model;

    constructor(detailId, { view, model }) {
        this.#detailId = detailId;
        this.#view = view;
        this.#model = model;
    }

    async showDetailMap() {
        this.#view.showMapLoading();

        try {
            await this.#view.initialMap();
        } catch (error) {
            console.error('showDetailMap: error: ',error);
        } finally {
            this.#view.hideMapLoading();
        }
    }

    async showDetail() {
        this.#view.showDetailLoading();

        try {
            const response = await this.#model.getDetailStory(this.#detailId);

            if (!response.ok) {
                this.#view.populateDetailError(response.message);
                return;
            }

            const detail = await storyMapper(response.story);

            this.#view.populateDetailStory(response.message, detail);
        } catch(error) {
            console.error('showDetail: error: ',error);
            this.#view.populateDetailError(error.message);
        } finally {
            this.#view.hideDetailLoading();
        }
    }
}