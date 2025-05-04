import DetailPresenter from "./detail-presenter.js";
import * as Model from "../../data/api.js";
import Map from "../../utils/map.js";
import { parseActivePathname } from "../../routes/url-parser.js";
import {
    generateLoaderAbsoluteTemplate,
    generateDetailErrorTemplate,
    generateDetailTemplate,
} from "../../template.js";

export default class DetailPage {
    #presenter = null;
    #map = null;

    async render() {
        return `
            <section>
                <div class="story-detail__container">
                    <div id="story-detail" class="story-detail"></div>
                    <div id="story-detail-loading-container"></div>
                </div>
            </section>
        `;
    }

    async afterRender() {
        this.#presenter = new DetailPresenter(parseActivePathname().id, {
            view: this,
            model: Model,
        });

        this.#presenter.showDetail();
    }

    async populateDetailStory(message, data) {
        document.getElementById('story-detail').innerHTML = 
        generateDetailTemplate({
            img: data.photoUrl,
            creatorName: data.name,
            description: data.description,
            location: data.location,
            createdAt: data.createdAt,
        });

        if (data.location.latitude !== null && data.location.longitude !== null) {
            try {
                await this.#presenter.showDetailMap();

                if (this.#map) {
                    const coor = [data.location.latitude, data.location.longitude];
                    const markerOption = { alt: data.description };
                    const popupOption = { content: data.description };

                    this.#map.changeCamera(coor);
                    this.#map.addMarker(coor, markerOption, popupOption);
                }
            } catch(error) {
                alert('Terjadi kesalahan!');
            } 
        } else {
            alert('Story ini tidak memiliki lokasi');
        }
    }

    async initialMap() {
        this.#map = await Map.build('#map', {
            zoom: 15,
        });
    }

    populateDetailError(message) {
        document.getElementById('story-detail').innerHTML = generateDetailErrorTemplate(message);
    }

    showMapLoading() {
        document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
    }

    hideMapLoading() {
        document.getElementById('map-loading-container').innerHTML = '';
    }

    showDetailLoading() {
        document.getElementById("story-detail-loading-container").innerHTML =
        generateLoaderAbsoluteTemplate();
    }

    hideDetailLoading() {
        document.getElementById("story-detail-loading-container").innerHTML = "";
    }
}