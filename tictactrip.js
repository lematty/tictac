const baseURL = 'http://www-uat.tictactrip.eu/api/cities/autocomplete/?q=';
let queryInput = 'departStation'; // Starts with a default of Departing Station
const popularCities = 'http://www-uat.tictactrip.eu/api/cities/popular/5';

window.onload =function () {
    buildStationList('Select a departure station');
};

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

function setTitle(title) {
    const newTitle = '<h6 class="card-subtitle mb-2" id="rightCardTitle">' + title + '</h6>';
    const resultsDiv = document.getElementById('resultsDiv');
    resultsDiv.innerHTML = newTitle;
}

function focusElement(element) {
    document.getElementById(element).focus();
}

function clearResultsDiv() {
    const resultsDiv = document.getElementById('resultsDiv');
    while (resultsDiv.firstChild) {
        resultsDiv.removeChild(resultsDiv.firstChild);
    }
}

function buildStationList(title) {
    clearResultsDiv();
    setTitle(title);
    // callAPI(popularCities);
    switchButtons();
}

function buildCalendar(title) {
    clearResultsDiv();
    setTitle(title);
}

function switchButtons() {
    const passengerBtn = document.getElementById('passengerBtn');
    const viaBtn = document.getElementById('viaBtn');
    if (passengerBtn) {
        document.getElementById('resultsDiv').removeChild(passengerBtn);
    }
    if (!viaBtn) {
        const viaBtn = '<button class="btn btn-info float-right" id="viaBtn" type="button"><i class="fa fa-map-marker-alt"></i> VIA</button>';
        const resultsDiv = document.getElementById('resultsDiv');
        resultsDiv.innerHTML += viaBtn;
    }
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
    addAttributes(input, 'onfocus', 'buildPassengerBtn()');
    addAttributes(input, 'placeholder', 'Discount code or SNCF Bon Voyage voucher');
    // const input = '<input class="form-control list-input" id="discountCodeInput" type="text" onfocus="buildPassengerBtn()" placeholder="Discount code or SNCF Bon Voyage voucher">';

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
    clearResultsDiv();
    const userInfoDiv = document.getElementById('userInfo');
    while (userInfoDiv.firstChild) {
        userInfoDiv.removeChild(userInfoDiv.firstChild);
    }
    const buildUserInfoInnerHTML =
        '<div class="input-group">' +
            '<div class="input-group-btn">' +
                '<button class="btn btn-default icon top-icon" id="userIcon" type="button" onclick="focusElement(\'passengerType\')">' +
                    '<i class="fa fa-user"></i>' +
                '</button>' +
            '</div>' +
            '<input type="text" class="form-control list-input" id="passengerType" onfocus="getPassengerInfo()" value=" 1 Adult (26 - 59)" aria-describedby="basic-addon2" readonly="readonly" style="border-bottom-left-radius: 0px;">' +
            '<div class="input-group-btn">' +
                '<button class="btn btn-default" id="plusSign" type="button" onclick="focusElement(\'passengerType\')" style="border-bottom-left-radius: 0px; border-bottom-right-radius: 0px;">' +
                    '<i class="fa fa-plus"></i>' +
                '</button>' +
            '</div>' +
        '</div>' +
        '<div class="input-group">' +
            '<div class="input-group-btn">' +
                '<button class="btn btn-default icon bottom-icon" type="button" onclick="focusElement(\'discountCodeInput\')">' +
                    '<i class="fa fa-ticket-alt" id="discountIcon"></i>' +
                '</button>' +
            '</div>' +
            '<input class="form-control list-input" id="discountCodeInput" type="text" onfocus="buildPassengerBtn()" placeholder="Discount code or SNCF Bon Voyage voucher">' +
        '</div>';
    userInfoDiv.innerHTML = buildUserInfoInnerHTML;
    // Build right card
    buildPassengerBtn();
}

function buildPassengerBtn() {
    clearResultsDiv();
    setTitle('The discount will be applied to');

    const passengerBtn = [
        '<h6 class="card-subtitle mb-2" id="rightCardTitle">The discount will be applied to</h6>',
        '<button class="btn btn-light btn-lg btn-block text-left" id="passengerBtn" type="button" ',
        'onfocus="buildPassengerBtn(this)"><i class="fa fa-check"></i> Passenger 1 <span style="color: grey">(Adult)</span></button>'
    ].join('');
    const resultsDiv = document.getElementById('resultsDiv');
    resultsDiv.innerHTML = passengerBtn;
}

function getPassengerInfo() {
    const passengerDropdown = [
        '<h6 class="card-subtitle mb-2" id="rightCardTitle">Choose your passengers</h6>',
        '<div class="text-center">',
            '<div class="btn-group"  id="passengerInfoBtn" role="group" aria-label="Button group with nested dropdown">',
                '<div class="btn-group" role="group">',
                    '<button type="button" class="btn btn-light dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Adult (26 - 59)</button>',
                    '<div class="dropdown-menu" id="dropDown" aria-labelledby="btnGroupDrop1">',
                        '<a class="dropdown-item" href="#">Youth (0 - 25)</a>',
                        '<a class="dropdown-item" href="#">Adult (26 - 59)</a>',
                        '<a class="dropdown-item" href="#">Senior (60+)</a>',
                    '</div>',
                '</div>',
                '<button type="button" class="btn btn-light" id="loyaltyBtn">Loyalty & discount cards</button>',
            '</div>',
        '</div>',
        '<button class="btn btn-light btn-lg btn-block" id="addPassenger" type="button"><i class="fa fa-user-plus"></i> ADD ANOTHER PASSENGER</button>',
        '<h6 id="looking">Looking for your saved passengers?</h6>',
        '<p>Sign in to your account and retrieve the passengers that you saved during previous searches.</p>',
        '<button class="btn btn-light btn-lg text-left" id="signInBtn" type="button" disabled><i class="fa fa-sign-in-alt" id="signInIcon"></i> SIGN IN</button>'
    ].join('');

    const resultsList = document.getElementById('resultsDiv');
    resultsList.innerHTML = passengerDropdown;
}

function mysteryFunction() {
    alert("Thanks for looking at my work!!!");
}



// TODO: IMPLEMENT CALENDAR FUNCTION

// function launchCalendar() {
//
// }