import HomePresenter from "./home-presenter.js";
import * as Model from "../../data/api.js"
import { 
  generateLoaderAbsoluteTemplate,
  generateStoryListErrorTemplate,
  generateStoryListEmptyTemplate,
  generateStoryListTemplate,
} from "../../template.js";

export default class HomePage {
  #presenter = null;


  async render() {
    return `
      <section class="container">
          <h1 class="section-title">Daftar Story Orang Pusing</h1>

          <div class="story-list__container">
            <div id="story-list"></div>
            <div id="story-list-loading-container"></div>
          </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      view: this,
      model: Model,
    });

    await this.#presenter.showHomePage();
  }

  populateStoryList(message, data) {
    if (data.length <= 0) {
      this.populateStoryEmpty();
      return;
    }

    const html = data.reduce((accumulator, storyList) => {
      return accumulator.concat(
        generateStoryListTemplate({
          id: storyList.id,
          name: storyList.name,
          description: storyList.description,
          photoUrl: storyList.photoUrl,
          createdAt: storyList.createdAt,
          location: { latitude: storyList.lat, longitude: storyList.lon },
        })
      );
    }, '');

    document.getElementById('story-list').innerHTML = `
      <div class="story-list">${html}</div>
    `;
  }

  populateStoryEmpty() {
    document.getElementById('story-list').innerHTML = generateStoryListEmptyTemplate();
  }

  populateStoryError() {
    document.getElementById('story-list').innerHTML = generateStoryListErrorTemplate();
  }

  showLoading() {
    document.getElementById('story-list-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideLoading() {
    document.getElementById('story-list-loading-container').innerHTML = '';
  }
}
