
import * as Model from "../../data/api.js";
import Map from "../../utils/map.js";
import Camera from "../../utils/camera.js";
import { convertBase64ToBlob } from "../../utils";
import { generateLoaderAbsoluteTemplate } from "../../template.js";
import addNewStoryPresenter from "./add-presenter.js";

export default class AddNewStoryPage {
    #presenter;
    #form;
    #camera;
    #isCameraOpen = false;
    #takenDocumentations = null;
    #map = null;

    async render() {
        return `
            <section>
                <div class="new-story__header">
                    <div class="container">
                        <h1 class="new-story__header__title">Buat Story Baru</h1>
                        <p class="new-story__header__description">
                        Silakan lengkapi formulir di bawah untuk membuat story baru.<br>
                        Pastikan laporan yang dibuat adalah valid.
                        </p>
                    </div>
                </div>
            </section>
        
            <section class="container">
                <div class="new-form__container">
                    <form id="new-form" class="new-form">
                        <div class="form-control">
                            <label for="documentastions-input" class="new-form__documentations__title">Dokumentasi</label>
                            <div id="documentations-more-info">Anda dapat menyertakan foto sebagai dokumentasi.</div>
                
                            <div class="new-form__documentations__container">
                                <div class="new-form__documentations__buttons">
                                    <button id="documentations-input-button" class="btn btn-outline" type="button">
                                        Ambil Gambar
                                    </button>
                                    <input
                                        id="documentations-input"
                                        name="documentations"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        hidden="hidden"
                                        aria-multiline="true"
                                        aria-describedby="documentations-more-info"
                                    >
                                    <button id="open-documentations-camera-button" class="btn btn-outline" type="button">
                                        Buka Kamera
                                    </button>
                                </div>

                                <div id="camera-container" class="new-form__camera__container">
                                    <video id="camera-video" class="new-form__camera__video">
                                        Video stream not available.
                                    </video>

                                    <canvas id="camera-canvas" class="new-form__camera__canvas"></canvas>
                
                                    <div class="new-form__camera__tools">
                                        <select id="camera-select"></select>
                                        <div class="new-form__camera__tools_buttons">
                                            <button id="camera-take-button" class="btn" type="button">
                                                Tangkap Gambar
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <ul id="documentations-taken-list" class="new-form__documentations__outputs"></ul>
                            </div>
                        </div>

                        <div class="form-control">
                            <label for="description-input" class="new-form__description__title">Keterangan</label>
                
                            <div class="new-form__description__container">
                                <textarea
                                id="description-input"
                                name="description"
                                placeholder="Masukkan caption story! Anda dapat menjelaskan apa kejadiannya, dimana, kapan, dll."
                                ></textarea>
                            </div>
                        </div>

                        <div class="form-control">
                            <div class="new-form__location__title">Lokasi</div>
                                <div class="new-form__location__container">
                                    <div class="new-form__location__map__container">
                                        <div id="map" class="new-form__location__map"></div>
                                        <div id="map-loading-container"></div>
                                    </div>
                                    <div class="new-form__location__lat-lng">
                                        <input type="number" name="latitude" value="-6.175389" disabled>
                                        <input type="number" name="longitude" value="106.827139" disabled>
                                    </div>
                            </div>
                        </div>

                        <div class="form-buttons">
                            <span id="submit-button-container">
                                <button class="btn" type="submit">Buat Laporan</button>
                            </span>
                            <a class="btn btn-outline" href="#/">Batal</a>
                        </div>
                    </form>
                </div>
            </section>
        `;
    }

    async afterRender() {
        this.#presenter = new addNewStoryPresenter({
            view: this,
            model: Model,
        });

        this.#presenter.showNewFormMap();
        this.#setupForm();
    }

    #setupForm() {
        this.#form = document.getElementById('new-form');
        this.#form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const data = {
                desc: this.#form.elements.namedItem('description').value,
                img: this.#takenDocumentations ? this.#takenDocumentations.blob : null,
                lat: this.#form.elements.namedItem('latitude').value,
                lon: this.#form.elements.namedItem('longitude').value,
            }

            await this.#presenter.addNewStory(data);
        });

        document.getElementById('documentations-input').addEventListener('change', async (event) => {
            const file = event.target.files[0];

            if(!file) {
                return;
            }

            await this.#addTakenPicture(file);
            await this.#populateTakenPicture();
        });

        document.getElementById('documentations-input-button').addEventListener('click', () => {
            this.#form.elements.namedItem('documentations').click();
        });

        // camera
        const cameraContainer = document.getElementById('camera-container');
        document.getElementById('open-documentations-camera-button').addEventListener('click', async (event) => {
            cameraContainer.classList.toggle('open');

            this.#isCameraOpen = cameraContainer.classList.contains('open');
            if (this.#isCameraOpen) {
                event.currentTarget.textContent = "Tutup Kamera";
                this.#setupCamera();
                this.#camera.launch();
                return;
            } 

            event.currentTarget.textContent = 'Buka Kamera'
        })
    }

    async initialMap() {
        this.#map = await Map.build('#map', {
            zoom: 15,
            locate: true,
        });

        const centerCoor = this.#map.getCenter();

        this.#updateLatLngInput(centerCoor.latitude, centerCoor.longitude);

        const draggableMarker = this.#map.addMarker([centerCoor.latitude, centerCoor.longitude], { draggableMarker: true });

        draggableMarker.addEventListener('move', (event) => {
            const coor = event.target.getLatLng();
            
            this.#updateLatLngInput(coor.lat, coor.lng);
        });

        this.#map.on('click', (event) => {
            draggableMarker.setLatLng(event.latlng);

            event.sourceTarget.flyTo(event.latlng);
        })
    }

    #updateLatLngInput(latitude, longitude) {
        this.#form.elements.namedItem('latitude').value = latitude;
        this.#form.elements.namedItem('longitude').value = longitude;
    }

    #setupCamera() {
        if (!this.#camera) {
            this.#camera = new Camera({
                video: document.getElementById('camera-video'),
                cameraSelect: document.getElementById('camera-select'),
                canvas: document.getElementById('camera-canvas'),
            });
        }

        this.#camera.addCheeseButtonListener('#camera-take-button', async () => {
            const image = await this.#camera.takePicture();
        
            if (!image) {
                console.error("Tidak berhasil mengambil gambar dari kamera.");
                alert("Gagal mengambil gambar dari kamera. Coba lagi.");
                return;
            }
            
            console.log('[DEBUG] Hasil takePicture:', image); 
            await this.#addTakenPicture(image);
            await this.#populateTakenPicture();
        });
    }

    async #addTakenPicture(image) {
        let blob = image;
    
        if (typeof image === 'string' && image.startsWith('data:image')) {
            const base64Data = image.split(',')[1];
            blob = await convertBase64ToBlob(base64Data, 'image/png');
          }
    
        if (!blob || !(blob instanceof Blob)) {
            console.error("Gagal membuat Blob dari gambar:", blob);
            this.#takenDocumentations = null;
            return;
        }
    
        this.#takenDocumentations = {
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            blob: blob,
        };
        console.log('[DEBUG] Hasil takePicture:', image); 
    }

    async #populateTakenPicture() {
        
    
        const image = URL.createObjectURL(this.#takenDocumentations.blob);
        const imageContainer = document.getElementById("documentations-taken-list");
    
        if (imageContainer) {
            imageContainer.innerHTML = `
                <li class="new-form__image__outputs-item">
                    <button type="button" id="delete-picture-button" class="new-form__image__outputs-item__delete-btn">
                        <img src="${image}" alt="image">
                    </button>
                </li>
            `;
            document.getElementById("delete-picture-button").addEventListener("click", () => {
                this.#removePicture();
            
                const hasPicture = this.#takenDocumentations && this.#takenDocumentations.blob instanceof Blob;
                if (hasPicture) {
                  this.#populateTakenPicture();
                } else {
                  const container = document.getElementById("documentations-taken-list");
                  if (container) container.innerHTML = "";
                }
            });
        } else {
            console.error("Elemen #image-taken tidak ditemukan di DOM.");
        }
    }

    #removePicture() {
        this.#takenDocumentations = null;
    }
    
    addNewSuccessfull(message) {
        this.clearForm();
        location.href = "/";
    }
    
    addFail(message) {
        alert(message);
    }
    
    clearForm() {
        this.#form.reset();
    }
    
    showLoadingMap() {
        document.getElementById("map-loading-container").innerHTML =
          generateLoaderAbsoluteTemplate();
    }
    
    hideLoadingMap() {
        document.getElementById("map-loading-container").innerHTML = "";
    }
    
    showLoadingSubmitButton() {
        document.getElementById("submit-button-container").innerHTML = `
              <button class="btn" type="submit" disabled>
                <i class="fas fa-spinner loader-button"></i> Buat Story
              </button>
            `;
    }
    
    hideLoadingSubmitButton() {
        document.getElementById("submit-button-container").innerHTML = `
              <button class="btn" type="submit">Buat Story</button>
            `;
    }
}