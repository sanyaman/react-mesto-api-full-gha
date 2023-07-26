export const BASE_URL = 'https://api.domainsanyaman.nomoredomains.xyz'; //api.domainSanyaman.nomoredomains.xyz

function getServerReply(res) {
    if (res.ok) {
        return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
}

export const register = (email, password) => {
    return fetch(`${BASE_URL}/sign-up`, {
        method: "POST",
        headers: {
            //Accept: "application/json", //
            "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    })
        .then(getServerReply)
}

export const login = (email, password) => {
    return fetch(`${BASE_URL}/sign-in`, {
        method: "POST",
        headers: {
        //  Accept: "application/json", //
            "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    })
        .then(getServerReply)
        // .then((data) => {
        //     if (data.token) {
        //         localStorage.setItem("token", data.token);
        //         return data;
        //     }
        //})
};

export const checkToken = () => {
    return fetch(`${BASE_URL}/users/me`, {
        method: "GET",
        headers: {
            'Content-Type': "application/json",
            //'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
    })
        .then(getServerReply)
};
