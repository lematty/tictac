const baseURL = 'http://www-uat.tictactrip.eu/api/cities/autocomplete/?q=';
let query = 'P';
let queryInput = 'departStation';

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
    let ul = document.getElementById('resultList');
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }
    console.log("Cleared UL list");
    let dataLimit5 = data.length;
    if (dataLimit5 > 5)
        dataLimit5 = 5;
    for (let i = 0; i < dataLimit5; i++) {
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
    }
    resultCard.appendChild(ul);
}

function populateSelection(element) {
    console.log(queryInput);
    let selectedCity = element.innerText;
    const addText = document.getElementById(queryInput);
    addText.value = selectedCity;
    // console.log(addText);
    getPopularDestinations(selectedCity);
}

function getPopularDestinations(startCity) {
    const popularDestQuery = 'http://www-uat.tictactrip.eu/api/cities/popular/from/' + startCity + '/5'
    callAPI(popularDestQuery);
}

function searchQuery(input) {
    // const filter = input.value.toUpperCase();
    queryInput = input.id;
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

function addDiscountCode(clickedItem) {
    const parent = clickedItem.parentElement;
    parent.removeChild(clickedItem);
    const input = document.createElement('input');
    const inputClassAttribute = document.createAttribute('class');
    const inputTypeAttribute = document.createAttribute('type');
    const inputPlaceholderAttribute = document.createAttribute('placeholder');
    inputClassAttribute.value = 'form-control list-input';
    inputTypeAttribute.value = 'text';
    inputPlaceholderAttribute.value = 'Discount code or SNCF Bon Voyage voucher';
    input.setAttributeNode(inputClassAttribute);
    input.setAttributeNode(inputTypeAttribute);
    input.setAttributeNode(inputPlaceholderAttribute);
    parent.appendChild(input);
}

// TODO: IMPLEMENT CALENDAR FUNCTION

// function launchCalendar() {
//
// }