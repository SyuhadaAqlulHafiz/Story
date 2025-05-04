import { showFormattedDate } from "./utils";

/* Start template loader */
export function generateLoaderTemplate() {
  return `
    <div class="loader"></div>
  `;
}

export function generateLoaderAbsoluteTemplate() {
  return `
    <div class="loader loader-absolute"></div>
  `;
}
/* End template loader */


/* Start template navigation */
export function generateMainNavigationListTemplate() {
  return `
    <li><a id="story-list-button" class="story-list-button" href="#/">Home</a></li>
  `;
}

export function generateUnauthenticatedNavigationListTemplate() {
  return `
    <li><a id="login-button" href="#/login">Login</a></li>
    <li><a id="register-button" href="#/register">Register</a></li>
  `;
}

export function generateAuthenticatedNavigationListTemplate() {
  return `
    <li><a id="new-story-button" class="btn new-story-button" href="#/add"> Buat Story <i class="fas fa-plus"></i></a></li>
    <li><a id="logout-button" class="logout-button" href="#/logout"><i class="fas fa-sign-out-alt"></i> Logout </a></li>
  `;
}
/* End template navigation */


/* Start template home page */
export function generateStoryListEmptyTemplate() {
  return `
    <div id="story-list-empty" class="story-list__empty">
      <h2>Tidak ada story yang tersedia</h2>
      <p>Saat ini, tidak ada story yang dapat ditampilkan.</p>
    </div>
  `;
}

export function generateStoryListErrorTemplate(message) {
  return `
    <div id="story-list-error" class="story-list__error">
      <h2>Terjadi kesalahan pengambilan daftar story</h2>
      <p>${message ? message : 'Gunakan jaringan lain atau laporkan error ini.'}</p>
    </div>
  `;
}


export function generateStoryListTemplate({
  id,
  name,
  description,
  photoUrl,
  createdAt,
  location,
}) {
  return `
        <div tabindex="0" class="story-item" data-storyid="${id}">
        <img class="story-item__image" src="${photoUrl}" alt="${name}">
        <div class="story-item__body">
            <div class="story-item__main">
              <h2 id="story-title" class="story-item__title">${name}</h2>
              <div class="story-item__more-info">
                <div class="story-item__createdat">
                  <i class="fas fa-calendar-alt"></i> ${showFormattedDate(
                    createdAt,
                    "id-ID"
                  )}
                  </div>
                  <div class="story-item__location">
                  <i class="fas fa-map"></i>${
                    location.latitude ?? "Tidak ada data"
                  }, ${location.longitude ?? "Tidak ada data"}
                </div>
              </div>
            </div>
            <div id="story-description" class="story-item__description">
              ${description}
            </div>
            <div class="story-item__more-info">
              <div class="story-item__author">
                Dibuat oleh: ${name}
              </div>
            </div>
            <a class="btn story-item__read-more" href="#/story/${id}">
            Selengkapnya <i class="fas fa-arrow-right"></i>
            </a>
          </div>
          </div>
    `;
}
/* End template home page */


/* Start template detail page */
export function generateDetailErrorTemplate(message) {
  return `
    <div id="story-detail-error" class="story-detail__error">
      <h2>Terjadi kesalahan pengambilan detail story</h2>
      <p>${message ? message : 'Gunakan jaringan lain atau laporkan error ini.'}</p>
    </div>
  `;
}

export function generateImageDetailTemplate(image = null, alt = "") {
  if (!image) {
    return `<img class="story-detail__image" src="" alt="Placeholder Image">`;
  }

  return `
        <img class="story-detail__image" src="${image}" alt="${alt}">
    `;
}

export function generateDetailTemplate({
  img,
  creatorName,
  description,
  location,
  createdAt,
}) {
  const createdAtFormatted = showFormattedDate(createdAt, "id-ID");
  const image = generateImageDetailTemplate(img);

  return `
        <div class="container">
            <div class="story-detail__images__container">
                <div id="image" class="story-detail__image">${image}</div>
            </div>
        </div>
        
        <div class="container">
            <div class="story-detail__body">
                <div class="story-detail__more-info">
                    <div class="story-detail__more-info__inline">
                      <div id="createdat" class="story-detail__createdat" data-value="${createdAtFormatted}"><i class="fas fa-calendar-alt"></i></div>
                      <div id="location-place-name" class="story-detail__location__place-name" data-value="${
                        location.placeName
                      }"><i class="fas fa-map"></i></div>
                    </div>
                    <div class="story-detail__more-info__inline">
                      <div id="location-latitude" class="story-detail__location__latitude" data-value="${
                        location.latitude ?? "Latitude tidak ada"
                      }">Latitude:</div>
                      <div id="location-longitude" class="story-detail__location__longitude" data-value="${
                        location.longitude ?? "Longitude tidak ada"
                      }">Longitude:</div>
                    </div>
                    <div id="author" class="story-detail__author" data-value="${creatorName}">Dibuat oleh:</div>
              </div>
              
              <div class="story-detail__body__description__container">
                <h2 class="story-detail__description__title">Deskripsi</h2>
                <div id="description" class="story-detail__description__body">
                  ${description}
                </div>
              </div>
               <div class="story-detail__body__map__container">
                  <h2 class="story-detail__map__title">Peta Lokasi</h2>
                  <div class="story-detail__map__container">
                    <div id="map" class="story-detail__map"></div>
                    <div id="map-loading-container"></div>
                  </div>
                </div>
            </div>
        </div>
    `;
}
/* Start template detail page */


// export function generateSubscribeButtonTemplate() {
//   return `
//     <button id="subscribe-button" class="btn subscribe-button">
//       Subscribe <i class="fas fa-bell"></i>
//     </button>
//   `;
// }

// export function generateUnsubscribeButtonTemplate() {
//   return `
//     <button id="unsubscribe-button" class="btn unsubscribe-button">
//       Unsubscribe <i class="fas fa-bell-slash"></i>
//     </button>
//   `;
// }

// export function generateSaveReportButtonTemplate() {
//   return `
//     <button id="report-detail-save" class="btn btn-transparent">
//       Simpan story <i class="far fa-bookmark"></i>
//     </button>
//   `;
// }

// export function generateRemoveReportButtonTemplate() {
//   return `
//     <button id="report-detail-remove" class="btn btn-transparent">
//       Buang story <i class="fas fa-bookmark"></i>
//     </button>
//   `;
// }