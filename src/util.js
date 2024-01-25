
let server = "http://localhost:8000";

function postServiceData(method, params) {
    return fetch(server + "/" + method, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
    })
        .then((response) =>
            response.json()
                .then((data) => {
                    return Promise.resolve(data);
                })
                .catch(error => {
                    console.log(error);
                    return error;
                })
        );
}

export { postServiceData };

export function stringToDate(_date) {
    let delimiter = "-";
    let formatLowerCase = "yyyy-mm-dd";
    if (_date.indexOf("/" > 0)) {
        delimiter = "/";
        formatLowerCase = "dd/mm/yyyy";
    }
	let formatItems=formatLowerCase.split(delimiter);
	let dateItems=_date.split(delimiter);

	let monthIndex=formatItems.indexOf("mm");
	let dayIndex=formatItems.indexOf("dd");
	let yearIndex=formatItems.indexOf("yyyy");
	let month=parseInt(dateItems[monthIndex]);
	month-=1;

	let formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
	return formatedDate.toDateString();
}
/*
let cachedData = null;
const getServiceData = (url) => {
    console.log('cache status' + cachedData );
    if (cachedData === null) {
        console.log('get-data: requesting data');
        return fetch(url, {})
        .then(response => {
            cachedData = response.json();
            return cachedData;
        });
    } else {
        console.log('get-data: returning cached data');
        return Promise.resolve(cachedData);
    }
};
 
export  { getServiceData, postServiceData };
 
*/