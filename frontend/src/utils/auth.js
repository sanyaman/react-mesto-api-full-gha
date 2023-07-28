export const BASE_URL = 'http://api.domainsanyaman.nomoredomains.xyz';



export const register = (password, email) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ password, email })
  })
    .then((response) => {
      return response.json();
    })
    .then((res) => {
      if ('data' in res) {
        return res;
      }
    })
    .catch((err) => console.log(err));
};

export const authorize = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ email, password })
  })
    .then((response => response.json()))
    .catch(err => console.log(err))
};

export const checkToken = () => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
    .then(res => res.json())
    .catch((err) => console.log('Ошибка:', err))
}

export const logout = () => {
  return fetch(`${BASE_URL}/logout`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
    .then(res => res.json())
    .catch((err) => console.log('Ошибка:', err))
}

