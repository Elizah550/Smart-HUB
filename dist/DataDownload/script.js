/**
 * Global variables
 **/
var currentLifeIns = document.querySelector("#cur-life-ins");
var currencyInputFields = document.querySelectorAll("input[inputmode='numeric']");
var allInputFields = document.querySelectorAll(".gic__input");
var curLifeContainer = document.querySelector("#currentLifeIns");
var additionalInsurance = document.querySelector(".additional-insurance");
var results = document.querySelector(".results");
var suggestedResults = document.querySelector(".gic__results-suggested");
var costEstimate = document.querySelector(".gic__results-cost");
var currency = 0;
var selectField = document.querySelector("#age");

selectField.addEventListener("click", function () {
    this.classList.toggle("caret-reverse");
});

/**
 * Initialize inputResults object to store and manipulate user input
 */
var inputResults = {
    expenses: 0,
    savings: 0,
    currentInsurance: 0,
    income: 0,
    rate: 0,
    childTotal: 0,
    marriageTotal: 0,
    total: 0,
};

/**
 * The following functions & action listener handle & store numeric field input - converts
 * the input to a number then scrubs input and returns it as a string so that the
 * user sees a currency value they would expect
 */
for (var i = 0; i < currencyInputFields.length; i++) {
    currencyInputFields[i].addEventListener("input", formatCurrency);
}

function formatCurrency(value) {
    currency = convertToNumber(this.value);
    if (currency != isNaN()) storeCurrency(this, currency);
    this.value = formatCurrencyForInput(currency.toString());
}

function convertToNumber(value) {
    value.length == 0 ? (value = 0) : (value = value.replace(/\D/g, "") * 1);
    return value;
}

function formatCurrencyForInput(str) {
    let dollars = Number(str);
    return dollars.toLocaleString();
}

function storeCurrency(field, formattedCurrency) {
    switch (field.id) {
        case "outs-expenses":
            inputResults.expenses = Number(formattedCurrency);
            break;
        case "saving-est":
            inputResults.savings = Number(formattedCurrency);
            break;
        case "cur-life-ins":
            inputResults.currentInsurance = Number(formattedCurrency);
            break;
        case "ann-income":
            inputResults.income = Number(formattedCurrency * 2); // Requires 2 years worth of income
            break;
        default:
            break;
    }
}

/**
 * Applies the correct rate based on the users selection
 */



function getAgeRate(value) {
    switch (value) {
        case "18-19":
            inputResults.rate = 0.8;
            break;
        case "20-29":
            inputResults.rate = 0.1;
            break;
        case "30-39":
            inputResults.rate = 0.12;
            break;
        case "40-49":
            inputResults.rate = 0.14;
            break;
        case "50-59":
            inputResults.rate = 0.17;
            break;
        case "60+":
            inputResults.rate = 0.2;
            break;
        default:
            break;
    }
}

/**
 * Calculates the totals input by the user and applies the calculated costs to the UI
 */
for (var z = 0; z < allInputFields.length; z++) {
    console.log(allInputFields[z].id);
    allInputFields[z].addEventListener("change", function () {
        console.log(inputResults);
        console.log(this.value);

        if (this.id != "life-ins-yes") {
            switch (this.id) {
                case "age":
                    getAgeRate(this.value);
                    break;
                case "num-children":
                    inputResults.childTotal = 50000 * this.value;
                    break;
                case "mar-status-yes":
                case "mar-status-no":
                    this.value == "yes"
                        ? (inputResults.marriageTotal = inputResults.marriageTotal + 50000)
                        : (inputResults.marriageTotal = inputResults.marriageTotal - 50000);
                    break;
                case "life-ins-no":
                    curLifeContainer.classList.add("hidden");
                    // Reset the fields if the user selects no
                    currentLifeIns.value = 0;
                    inputResults.currentInsurance = 0;
                    break;
                default:
                    break;
            }
            inputResults.total =
                inputResults.expenses -
                inputResults.savings -
                inputResults.currentInsurance +
                inputResults.income +
                inputResults.marriageTotal +
                inputResults.childTotal;

            let addInsurance = Math.ceil(inputResults.total / 5000) * 5000;
            let rate = Math.ceil(inputResults.total * inputResults.rate) / 1000;

            if (inputResults.total > 0) {
                additionalInsurance.classList.remove("hidden");
                document.querySelector(".no-additional-insurance").classList.add("hidden");
                animateValue(additionalInsurance, 0, addInsurance);
            } else {
                additionalInsurance.classList.add("hidden");
                document.querySelector(".no-additional-insurance").classList.remove("hidden");
            }

            // if (rate > 0) {
            //     animateValue(results, 0, rate);
            // } else {
            // }
        } else {
            curLifeContainer.classList.remove("hidden");
        }

        //additionalInsurance.innerHTML = (Math.ceil(inputResults.total / 5000) * 5000).toLocaleString();
        //results.innerHTML = parseFloat((inputResults.total * inputResults.rate) / 1000)
        // .toFixed(2)
        // .toLocaleString();
    });
}

/**
 * Animation function that creates count up
 */
function animateValue(field, start, end) {
    field.classList.remove("hidden");
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / 1000, 1);
        field.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

