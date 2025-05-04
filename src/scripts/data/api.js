import { getAccessToken } from '../utils/auth.js';
import CONFIG from '../config';

const ENDPOINTS = {
  REGIST: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  GET_ALL: `${CONFIG.BASE_URL}/stories`,
  DETAIL: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
  ADD_NEW_STORY: `${CONFIG.BASE_URL}/stories`,
};


export async function getRegister({ nama, email, password}) {
  const response = JSON.stringify({ nama, email, password});

  const fetchResponse = await fetch(ENDPOINTS.REGIST, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: response,
  });

  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  }
}


export async function getLogin({ email, password }) {
  const response = JSON.stringify({ email, password });

  const fetchResponse = await fetch(ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: response,
  });

  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse,
  }
}


export async function getAllStory() {
  const access = getAccessToken();

  const fetchResponse = await fetch(ENDPOINTS.GET_ALL, {
    headers: { Authorization: `Bearer ${access}` },
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  }
}


export async function getDetailStory(id) {
  const access = getAccessToken();

  const fetchResponse = await fetch(ENDPOINTS.DETAIL(id), {
    method: 'GET',
    headers: { Authorization: `Bearer ${access}` },    
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse,
  }
}


export async function addNewStory({
  desc, 
  img, 
  lat, 
  lon
}) {
  const access = getAccessToken();

  const dataBody = new FormData();
  dataBody.set('description', desc);
  dataBody.append('photo', img);
  dataBody.set('lat', lat);
  dataBody.set('lon', lon);

  const fetchResponse = await fetch(ENDPOINTS.ADD_NEW_STORY, {
    method: 'POST',
    headers: { Authorization: `Bearer ${access}` },
    body: dataBody,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  }
}