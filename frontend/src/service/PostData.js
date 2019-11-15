export function PostData(type, userData, token='') {
    let BaseUrl = "http://dmitriyp.ru:2052/api/";
    let headers = {}

    if (token){
        headers = {
            'Accept': 'application/json',
            'Content-Type':'application/json',
            'Authorization': 'Token '+token,
        };
    } else{
        headers = {
            'Accept': 'application/json',
            'Content-Type':'application/json',
        }
    }

    return new Promise((resolve, reject) => {

        fetch(BaseUrl+type, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(userData)
        })
        .then((response) => response.json())
        .then((responseJson) => {
            resolve(responseJson);
        })
        .catch((error) => {
            reject(error);
        })
    })
}

export function GetData(type, token='') {
    let BaseUrl = "http://dmitriyp.ru:2052/api/";
    let headers = {}

    if (token){
        headers = {
            'Accept': 'application/json',
            'Content-Type':'application/json',
            'Authorization': 'Token '+token,
        };
    } else{
        headers = {
            'Accept': 'application/json',
            'Content-Type':'application/json',
        }
    }

    return new Promise((resolve, reject) => {

        fetch(BaseUrl+type, {
            method: 'GET',
            headers: headers,
        })
        .then((response) => response.json())
        .then((responseJson) => {
            resolve(responseJson);
        })
        .catch((error) => {
            reject(error);
        })
    })
}