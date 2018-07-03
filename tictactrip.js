const baseURL = 'http://www-uat.tictactrip.eu/api/cities/autocomplete/?q=';
let query = 'P';

window.onload = function () {
    const popularCities = 'http://www-uat.tictactrip.eu/api/cities/popular/5';
    callAPI(popularCities);
};

function callAPI(url) {
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function() {
        const data = JSON.parse(this.response);
        if (request.status >= 200 && request.status < 400) {
            createResultList(data);
            console.log(data);
        }
    };
    request.send();
}

function createResultList(data) {
    const resultCard = document.getElementById('resultsDiv');
    let ul;
    if (!document.getElementById('resultList')) {
        console.log("First creation of UL");
        ul = document.createElement('ul');
        const ulIdAttribute = document.createAttribute('id');
        const ulClassAttribute = document.createAttribute('class');
        ulIdAttribute.value = 'resultList';
        ulClassAttribute.value = 'list-group';
        ul.setAttributeNode(ulIdAttribute);
        ul.setAttributeNode(ulClassAttribute);
    } else {
        console.log("Cleared UL list");
        ul = document.getElementById('resultList');
        while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }
    }
    let limit5 = data.length;
    if (limit5 > 5)
        limit5 = 5;
    for (let i = 0; i < limit5; i++) {
        const city = data[i]['unique_name'];
        // const capitalize = city.charAt(0).toUpperCase();
        // capitalize.charAt(0).toUpperCase();
        const li = document.createElement('li');
        const liClassAttribute = document.createAttribute('class');
        const onClickAttribute = document.createAttribute('onclick');
        liClassAttribute.value = 'list-group-item list-group-item-action';
        onClickAttribute.value = 'populateSelection(this)';
        li.setAttributeNode(liClassAttribute);
        li.setAttributeNode(onClickAttribute);
        // li.appendChild(document.createTextNode(capitalize + city.slice(1)));
        li.appendChild(document.createTextNode(city));
        ul.appendChild(li);
        console.log(ul);
    }
    resultCard.appendChild(ul);
    // console.log(ul);
}

function populateSelection(element) {
    let selectedCity = element.innerText;
    const addText = document.getElementById('departStation');
    addText.placeholder = selectedCity;
    console.log(addText);
    getPopularDestinations(selectedCity);
}

function getPopularDestinations(startCity) {

    const popularDestQuery = 'http://www-uat.tictactrip.eu/api/cities/popular/from/' + startCity + '/5'
    const data = callAPI(popularDestQuery);
    console.log(data);
}

function searchQuery() {
    let input;
    // console.log(typeof document.getElementById('departStation').value);
    // if (typeof document.getElementById('departStation').value === 'undefined') {
    input = document.getElementById('departStation');
    // input = document.getElementById('arrivalStation');
        console.log('input');
        console.log(input);
    // }
    // const filter = input.value.toUpperCase();
    const filter = input.value;
    let fullURL = baseURL + filter;
    callAPI(fullURL);
    const ul = document.getElementById('resultList');
    const li = ul.getElementsByTagName('li');

    for (let i = 0; i < li.length; i++) {
        // if (li[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
        if (li[i].innerHTML.indexOf(filter) > -1) {
            li[i].style.display = '';
        } else {
            li[i].style.display = 'none';

        }
    }
}

// TODO: IMPLEMENT CALENDAR FUNCTION

// function launchCalendar() {
//
// }