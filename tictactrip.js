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
    clearResultsDiv();
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
    const resultsDiv = document.getElementById('resultsDiv');
    console.log(resultsDiv);
    setTitle(title);
    callAPI(popularCities);
}

function buildCalendar(title) {
    // clearResultsDiv();
    setTitle(title);
    const calendar = [
        '<div class="calendar-wrapper text-center">\n' +
            '<button id="btnPrev" type="button"><</button>\n' +
            '<button id="btnNext" type="button">></button>\n' +
            '<div id="divCal"></div>\n' +
        '</div>'
    ].join('');
    const resultsDiv = document.getElementById('resultsDiv');
    resultsDiv.innerHTML += calendar;

    // Start calendar
    var c = new Cal("divCal");
    c.showcurr();

    // Bind next and previous button clicks
    getId('btnNext').onclick = function() {
        c.nextMonth();
    };
    getId('btnPrev').onclick = function() {
        c.previousMonth();
    };
}

function switchButtons() {
    const passengerBtn = document.getElementById('passengerBtn');
    const viaBtn = document.getElementById('viaBtn');
    const removeViaBtn = document.getElementById('removeViaBtn');
    const resultsDiv = document.getElementById('resultsDiv');
    if (removeViaBtn) {
        resultsDiv.removeChild(removeViaBtn);
    }
    if (passengerBtn)
        resultsDiv.removeChild(passengerBtn);
    if (!viaBtn) {
        const viaBtn = '<button class="btn btn-info float-right mt-3" id="viaBtn" type="button" onclick="buildVia()"><i class="fa fa-map-marker-alt"></i> VIA</button>';
        // console.log(resultsDiv.innerHTML);
        resultsDiv.innerHTML += viaBtn;
        // console.log(resultsDiv);

    }
}

/*
Creates a list of cities (unique_name) from JSON result of API
Params:
    data    - (JSON) data returned from the API call
 */

function createResultList(data) {
    const resultDiv = document.getElementById('resultsDiv');
    // clearResultsDiv();
    const resultList = document.createElement('UL');
    addAttributes(resultList, 'id', 'resultList');
    addAttributes(resultList, 'class', 'list-group');
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
        resultList.appendChild(li);
    }
    // setTitle(title);
    resultDiv.appendChild(resultList);
    switchButtons();
}

function buildVia() {
    const beforeVia = document.getElementById('beforeVia');
    const viaParent = beforeVia.parentElement;
    const viaElement = [
    '<div class="input-group" id="beforeVia">\n' +
        '<div class="input-group-btn">\n' +
            '<button class="btn btn-default icon top-icon" id="departIcon" type="button" onclick="focusElement(\'departStation\')">\n' +
                '<i class="fa fa-sign-out-alt"></i>\n' +
            '</button>\n' +
        '</div>\n' +
            '<input onkeyup="searchQuery(this)" type="text" class="form-control list-input depart"\n' +
            'id="departStation" onfocus="buildStationList(\'Select a departure station\')" placeholder="Enter your departure station....">\n' +
        '</div>\n' +
        '<div class="input-group">\n' +
            '<div class="input-group-btn">\n' +
                '<button class="btn btn-default icon" id="viaIcon" type="button" onclick="focusElement(\'viaStation\')">\n' +
                    '<i class="fa fa-dot-circle"></i>\n' +
                '</button>\n' +
            '</div>\n' +
            '<input onkeyup="searchQuery(this)" type="text" class="form-control list-input depart"\n' +
            'id="viaStation" onfocus="buildStationList(\'Select a via station\')" placeholder="Via">\n' +
        '</div>\n' +
        '<div class="input-group">\n' +
            '<div class="input-group-btn">\n' +
                '<button class="btn btn-default icon bottom-icon" id="returnIcon" type="button" onclick="focusElement(\'arrivalStation\')">\n' +
                    '<i class="fa fa-sign-in-alt"></i>\n' +
                '</button>\n' +
            '</div>\n' +
            '<input onkeyup="searchQuery(this)" type="text" class="form-control list-input arrival" id="arrivalStation"\n' +
                'onfocus="buildStationList(\'Select an arrival station\')" placeholder="Enter your arrival station">\n' +
        '</div>\n' +
    '</div>'
    ].join('');
    clearResultsDiv();
    setTitle('Select a via station');
    const resultsDiv = document.getElementById('resultsDiv');

    const removeViaBtn = '<button type="button" class="btn btn-secondary float-right" id="removeViaBtn" onclick="switchButtons()">REMOVE VIA STATION</button>';
    viaParent.innerHTML = viaElement;
    resultsDiv.innerHTML += removeViaBtn;
    const viaStation = document.getElementById('viaStation');
    viaStation.focus();
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

    const resultDiv = document.getElementById('resultsDiv');
    // console.log(resultDiv);
    // clearResultsDiv();
    // console.log(resultDiv);
    let selectedCity = element.innerText;
    const addText = document.getElementById(queryInput);
    addText.value = selectedCity;
    // console.log(selectedCity);
    console.log(element);
    const arrivalStation = document.getElementById('arrivalStation');
    const departStation = document.getElementById('departStation');
    // setTitle('This is the title');
    // getPopularDestinations(selectedCity);
    // console.log(resultDiv);

    if (queryInput === 'departStation') {
        arrivalStation.focus();
        queryInput = 'arrivalStation';
        setTitle('Select an arrival station');
        getPopularDestinations(selectedCity);
    } else {
        if (arrivalStation.value) {
            const chooseDate = document.getElementById('departCalendar');
            chooseDate.focus();
        } else {
            departStation.focus();
        }
        queryInput = 'departStation';
    }
    // clearResultsDiv();
}

/*
Build query of popular destinations from selected city
Params:
    city    - (String) city selected by user
 */

function getPopularDestinations(city) {
    const popularDestQuery = 'http://www-uat.tictactrip.eu/api/cities/popular/from/' + city + '/5'
    callAPI(popularDestQuery);
}

/*
Generic attribute builder
Params:
    element - (HTML Element) HTML element that was selected
 */

function searchQuery(element) {
    clearResultsDiv();
    // const filter = input.value.toUpperCase();
    queryInput = element.id;
    const filter = element.value;
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
    discountDivBuilder();
}

/*
Discount div builder creates the div structure to fit the discount code input element
Params:
    parentDiv - (HTML Element) parent HTML element that div structure will be appended to
    input     - (HTML Element) new input HTML element that will be appended before giving to parent div
 */

function discountDivBuilder() {
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
        '<button class="btn btn-light btn-lg btn-block mt-3" id="addPassenger" type="button"><i class="fa fa-user-plus"></i> ADD ANOTHER PASSENGER</button>',
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

/////////////////////////////////////////////////////////////////////
//           Thanks XMARK @ codepen.io for the calendar            //
/////////////////////////////////////////////////////////////////////

let Cal = function(divId) {

    //Store div id
    this.divId = divId;

    // Days of week, starting on Sunday
    this.DaysOfWeek = [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat'
    ];

    // Months, stating on January
    this.Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];

    // Set the current month, year
    let d = new Date();

    this.currMonth = d.getMonth();
    this.currYear = d.getFullYear();
    this.currDay = d.getDate();

};

// Goes to next month
Cal.prototype.nextMonth = function() {
    if ( this.currMonth === 11 ) {
        this.currMonth = 0;
        this.currYear = this.currYear + 1;
    }
    else {
        this.currMonth = this.currMonth + 1;
    }
    this.showcurr();
};

// Goes to previous month
Cal.prototype.previousMonth = function() {
    if ( this.currMonth === 0 ) {
        this.currMonth = 11;
        this.currYear = this.currYear - 1;
    }
    else {
        this.currMonth = this.currMonth - 1;
    }
    this.showcurr();
};

// Show current month
Cal.prototype.showcurr = function() {
    this.showMonth(this.currYear, this.currMonth);
};

// Show month (year, month)
Cal.prototype.showMonth = function(y, m) {

    let d = new Date()
        // First day of the week in the selected month
        , firstDayOfMonth = new Date(y, m, 1).getDay()
        // Last day of the selected month
        , lastDateOfMonth =  new Date(y, m+1, 0).getDate()
        // Last day of the previous month
        , lastDayOfLastMonth = m === 0 ? new Date(y-1, 11, 0).getDate() : new Date(y, m, 0).getDate();


    let html = '<table>';

    // Write selected month and year
    html += '<thead><tr>';
    html += '<td colspan="7">' + this.Months[m] + ' ' + y + '</td>';
    html += '</tr></thead>';


    // Write the header of the days of the week
    html += '<tr class="days">';
    for(let i=0; i < this.DaysOfWeek.length;i++) {
        html += '<td>' + this.DaysOfWeek[i] + '</td>';
    }
    html += '</tr>';

    // Write the days
    let i=1;
    do {

        let dow = new Date(y, m, i).getDay();

        // If Sunday, start new row
        if ( dow === 0 ) {
            html += '<tr>';
        }
        // If not Sunday but first day of the month
        // it will write the last days from the previous month
        else if ( i === 1 ) {
            html += '<tr>';
            let k = lastDayOfLastMonth - firstDayOfMonth+1;
            for(let j=0; j < firstDayOfMonth; j++) {
                html += '<td class="not-current">' + k + '</td>';
                k++;
            }
        }

        // Write the current day in the loop
        let chk = new Date();
        let chkY = chk.getFullYear();
        let chkM = chk.getMonth();
        if (chkY === this.currYear && chkM === this.currMonth && i === this.currDay) {
            html += '<td class="today">' + i + '</td>';
        } else {
            html += '<td class="normal">' + i + '</td>';
        }
        // If Saturday, closes the row
        if ( dow === 6 ) {
            html += '</tr>';
        }
        // If not Saturday, but last day of the selected month
        // it will write the next few days from the next month
        else if ( i === lastDateOfMonth ) {
            let k=1;
            for(dow; dow < 6; dow++) {
                html += '<td class="not-current">' + k + '</td>';
                k++;
            }
        }
        i++;
    }while(i <= lastDateOfMonth);

    // Closes table
    html += '</table>';

    // Write HTML to the div
    document.getElementById(this.divId).innerHTML = html;
};

// Get element by id
function getId(id) {
    return document.getElementById(id);
}

