class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
    this._credentials = options.credentials;
  }

  _checkResponse(response) {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(`Ошибка: ${response.status}`);
  }

  _request(url, options) {
    return fetch(url, options).then(this._checkResponse)
  }

  getInitialCards() {
    return this._request(`${this._baseUrl}cards`, {
      credentials: this._credentials,
    })
  }

  getUserData() {
    return this._request(`${this._baseUrl}users/me`, {
        credentials: this._credentials,
    })
  }

  setUserData(userData) {
    return this._request(`${this._baseUrl}users/me`, {
      method: 'PATCH',
      headers: this._headers,
      credentials: this._credentials,
      body: JSON.stringify({
        name: userData.name,
        about: userData.about,
      })
    })
  }

  uploadCard(cardData) {
    return this._request(`${this._baseUrl}cards`, {
      method: 'POST',
      headers: this._headers,
      credentials: this._credentials,
      body: JSON.stringify({
        name: cardData.name,
        link: cardData.link,
      })
    })
  }

  removeCard(cardId) {
    return this._request(`${this._baseUrl}cards/${cardId}`, {
      method: 'DELETE',
      headers: this._headers,
      credentials: this._credentials,
    })
  };

  toggleLike(methodSwitch, cardId) {
    let method = 'DELETE';
    if (!methodSwitch) {
      method = 'PUT'
    }
    return this._request(`${this._baseUrl}cards/${cardId}/likes`, {
      method: method,
      headers: this._headers,
      credentials: this._credentials,
    })
  }

  setUserAvatar(avatarLink) {
    return this._request(`${this._baseUrl}users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      credentials: this._credentials,
      body: JSON.stringify({
        avatar: avatarLink.link
      })
    })
  }
}

export const api = new Api({
  baseUrl: "http://api.domainsanyaman.nomoredomains.xyz/",
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include',
});
