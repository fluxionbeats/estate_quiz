window.onload = function () {
    slideOne();
    slideTwo();
}


class Range {
    constructor(first, second) {
        this.first = first;
        this.second = second;
    }
    first;
    second;
}
class Values {
    name;
    tel;
    range = new Range();
    rooms_count;
    pay_method;
    period;
}

//slider
let sliderOne = document.getElementById("slider-1");
let sliderTwo = document.getElementById("slider-2");
let displayValOne = document.getElementById("range1");
let displayValTwo = document.getElementById("range2");
let minGap = 2;
let sliderTrack = document.querySelector(".slider-track");
let sliderMaxValue = document.getElementById("slider-1").max;


function slideOne() {
    if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap) {
        sliderOne.value = parseInt(sliderTwo.value) - minGap;
    }
    displayValOne.textContent = sliderOne.value + " млн";
    fillColor();
}
function slideTwo() {
    if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap) {
        sliderTwo.value = parseInt(sliderOne.value) + minGap;
    }
    displayValTwo.textContent = sliderTwo.value + " млн";
    fillColor();
}
function fillColor() {
    percent1 = ((sliderOne.value - 5) / (sliderMaxValue - 5)) * 100;
    percent2 = ((sliderTwo.value - 5) / (sliderMaxValue - 5)) * 100;
    sliderTrack.style.background = `linear-gradient(to right, #fff ${percent1}% , #FF9900 ${percent1}% , #FF9900 ${percent2}%, #fff ${percent2}%)`;
}




//quiz
let slide_num = 0;

function nextQuestion() {
    let this_question = document.querySelector(".quiz_opened-page");
    let next_question = this_question.nextElementSibling;
    this_question.classList.remove("quiz_opened-page");
    this_question.classList.add("quiz_passed-page");
    next_question.classList.add("quiz_opened-page");
    slide_num += 1;
    if(slide_num == 6){
        setTimeout(function(){location.reload();}, 6000);
        let header_info = document.querySelector(".header__info");
        header_info.classList.add("info_hidden");
    }
}
let form = document.forms[0];

let values = new Values();

function retrieveFormValues(event) {
    event.preventDefault();
    const tel = form.querySelector('[name="tel"]'),
        name = form.querySelector('[name="name"]');
    values.name = name.value;
    values.tel = tel.value;
    sendData(values);
    form.reset();
    nextQuestion();
}

form.addEventListener("submit", retrieveFormValues);

let buttons = document.querySelectorAll(".btn-choice, .btn-main, .btn-white");
for (var i = 0; i < buttons.length; i++) {
    buttons[i].onclick = function () {
        if (slide_num == 1) {
            values.range = new Range(sliderOne.value, sliderTwo.value);
        }
        else {
            switch (slide_num) {
                case 2:
                    values.rooms_count = parseButtonValue(this);
                    setFlatsValue();
                    break;
                case 3:
                    values.pay_method = parseButtonValue(this);
                    break;
                case 4:
                    values.period = parseButtonValue(this);
                    break;
            }
        }
        if(slide_num != 5){
            nextQuestion();
        }
    }
}

function parseButtonValue(button) {
    return button.textContent.trim();
}

function sendData(values){
    const data = {
        "Имя": values.name,
        "Телефон": values.tel,
        "Бюджет": values.range.first + ' - ' + values.range.second,
        "Количество комнат": values.rooms_count,
        "Наличные / ипотека": values.pay_method,
        "Срок инвестиций": values.period,
    }
    fetch('https://api.sheetmonkey.io/form/s2u9PhAYsBBV9GWexpvvyk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((result) => {
      // Handle the result
    });
}

const time = 10000;
const step = 1; 

function setFlatsValue(){
    let flats_map = {
        "1" : 15,
        "2" : 12,
        "3" : 8
    }
    let flats_count = document.querySelector(".flats__count");
    flats_count.innerHTML = flats_map[values.rooms_count[0]];
}