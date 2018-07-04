const baseURL = 'http://www-uat.tictactrip.eu/api/cities/autocomplete/?q=';
let queryInput = 'departStation'; // Starts with a default of Departing Station
const popularCities = 'http://www-uat.tictactrip.eu/api/cities/popular/5';


/*
Make calls to the API
Params:
    url    - (String) URL to query API
 */

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

/*
Creates a list of cities (unique_name) from JSON result of API
Params:
    data    - (JSON) data returned from the API call
 */

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
        addAttributes(li, 'class', 'list-group-item list-group-item-action');
        addAttributes(li, 'onclick', 'inputSelection(this)');
        li.appendChild(document.createTextNode(city));
        ul.appendChild(li);
    }
    resultCard.appendChild(ul);
}

/*
Generic attribute builder
Params:
    element - (HTML Element) HTML element the attribute will be appended to
    type    - (String) attribute type
    value   - (String) attribute value
 */

function addAttributes(element, type, value) {
    const createAttribute = document.createAttribute(type);
    createAttribute.value = value;
    element.setAttributeNode(createAttribute);
}

/*
Adds selected city to input of search field
Params:
    element - (HTML Element) HTML element that was selected
 */

function inputSelection(element) {
    let selectedCity = element.innerText;
    const addText = document.getElementById(queryInput);
    addText.value = selectedCity;
    const arrivalStation = document.getElementById('arrivalStation');
    const departStation = document.getElementById('departStation');
    getPopularDestinations(selectedCity);
    if (queryInput === 'departStation') {
        arrivalStation.focus();
        queryInput = 'arrivalStation';
    } else {
        if (arrivalStation.value) {
            const chooseDate = document.getElementById('departCalendar');
            chooseDate.focus();
        } else {
            departStation.focus();
        }
        queryInput = 'departStation';
    }
}

function setTitle(title) {
    const rightCardTitle = document.getElementById('rightCardTitle');
    rightCardTitle.innerText = title;
}

/*
Build query of popular destinations from selected city
Params:
    city    - (String) city selected by user
 */

function getPopularDestinations(city) {
    const popularDestQuery = 'http://www-uat.tictactrip.eu/api/cities/popular/from/' + city + '/5'
    // callAPI(popularDestQuery);
}

/*
Generic attribute builder
Params:
    element - (HTML Element) HTML element that was selected
 */

function searchQuery(element) {
    // const filter = input.value.toUpperCase();
    queryInput = element.id;
    const filter = element.value;
    let fullURL = baseURL + filter;
    // callAPI(fullURL);
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

/*
Change discount code to input onclick
Params:
    element - (HTML Element) HTML element that was selected
 */

function addDiscountCode(element) {
    const parent = element.parentElement;
    parent.removeChild(element);

    // Build div and assign attributes
    const input = document.createElement('input');
    addAttributes(input, 'class', 'form-control list-input');
    addAttributes(input, 'id', 'discountCodeInput');
    addAttributes(input, 'type', 'text');
    addAttributes(input, 'placeholder', 'Discount code or SNCF Bon Voyage voucher');

    // Change styling of passenger type to fit nicely
    document.getElementById('passengerType').style.borderBottomLeftRadius = 0;
    document.getElementById('plusSign').style.borderBottomLeftRadius = 0;
    document.getElementById('plusSign').style.borderBottomRightRadius = 0;
    const userIcon = document.getElementById('userIcon');
    addAttributes(userIcon, 'class', 'btn btn-default icon top-icon');

    // Get parent div and build child divs to append discount code input
    const parentDiv = document.getElementById('userInfo');
    discountDivBuilder(parentDiv, input);
}

/*
Discount div builder creates the div structure to fit the discount code input element
Params:
    parentDiv - (HTML Element) parent HTML element that div structure will be appended to
    input     - (HTML Element) new input HTML element that will be appended before giving to parent div
 */

function discountDivBuilder(parentDiv, input) {
    const inputGroupDiv = document.createElement('div');
    const inputGroupBtnDiv = document.createElement('div');
    const btn = document.createElement('button');
    const icon = document.createElement('i');
    addAttributes(inputGroupDiv, 'class', 'input-group');
    addAttributes(inputGroupBtnDiv, 'class', 'input-group-btn');
    // Create icon
    addAttributes(btn, 'class', 'btn btn-default icon bottom-icon');
    addAttributes(btn, 'type', 'button');
    addAttributes(btn, 'onclick', 'focusElement(\'discountCodeInput\')');
    addAttributes(icon, 'class', 'fa fa-ticket-alt');
    addAttributes(icon, 'id', 'discountIcon');

    // Build div structure
    inputGroupDiv.appendChild(inputGroupBtnDiv);
    inputGroupBtnDiv.appendChild(btn);
    btn.appendChild(icon);
    parentDiv.appendChild(inputGroupDiv);
    inputGroupDiv.appendChild(input).focus();

    // Build right card
    setTitle('The discount will be applied to');
    const passengerBtn = document.createElement('button');
    addAttributes(passengerBtn, 'class', 'btn btn-light btn-lg btn-block text-left');
    addAttributes(passengerBtn, 'id', 'passengerBtn');
    addAttributes(passengerBtn, 'type', 'button');
    passengerBtn.innerText = 'Passenger 1 (Adult)';
    const resultsDiv = document.getElementById('resultsDiv');
    resultsDiv.appendChild(passengerBtn);
    resultsDiv.removeChild(document.getElementById('viaBtn'));
}

function focusElement(element) {
    document.getElementById(element).focus();
}

function buildDepartureStation() {
    setTitle('Select a departure station');
    // callAPI(popularCities);
    switchButtons();
}

function buildArrivalStation() {
    setTitle('Select an arrival station');
    // callAPI(popularCities);
    switchButtons();
}

function switchButtons() {
    const passengerBtn = document.getElementById('passengerBtn');
    if (passengerBtn) {
        document.getElementById('resultsDiv').removeChild(passengerBtn);
    }
    if (!document.getElementById('viaBtn')) {
        const viaBtn = document.createElement('button');
        addAttributes(viaBtn, 'class', 'btn btn-info float-right');
        addAttributes(viaBtn, 'id', 'viaBtn');
        addAttributes(viaBtn, 'type', 'button');
        viaBtn.innerText = 'VIA';
        const resultsDiv = document.getElementById('resultsDiv');
        resultsDiv.appendChild(viaBtn);
    }
}

// function removeButtons() {
//
// }



// TODO: IMPLEMENT CALENDAR FUNCTION

// function launchCalendar() {
//
// }