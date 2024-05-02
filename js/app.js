const cryptosSelect = document.querySelector('#crypto');
const form = document.querySelector('#form');
const currencySelect = document.querySelector('#currency');
const result = document.querySelector('#result');
const objUser = {
    currency: '',
    crypto: ''
}

const getCryptos = crypto => new Promise(resolve => {
    resolve(crypto);
})

document.addEventListener('DOMContentLoaded', () => {
    fetchCryptos();
    form.addEventListener('submit', submitForm);
    cryptosSelect.addEventListener('change', readValue);
    currencySelect.addEventListener('change', readValue);
})

function fetchCryptos() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';
    fetch(url)
        .then(res => res.json())
        .then(res => getCryptos(res.Data))
        .then(crypto => selectCryptos(crypto));
}

function selectCryptos(cryptos) {
    cryptos.forEach(crypto => {
        const { FullName, Name } = crypto.CoinInfo;
        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        cryptosSelect.appendChild(option);
    });
}

function readValue(e) {
    objUser[e.target.name] = e.target.value;
    console.log(objUser);
}

function submitForm(e) {
    e.preventDefault();

    // validation
    const { currency, cryptoCurrency } = objUser;
    if (currency === '' || cryptoCurrency === '') {
        showAlert('Both fields are required');
        return;
    }

    // API with results
    getAPI();

}

function showAlert(message) {
    const isAlertActive = document.querySelector('.error');

    if (isAlertActive) {
        return;
    }
    const divMessage = document.createElement('div');
    divMessage.classList.add('error');
    divMessage.textContent = message;

    form.appendChild(divMessage);
    setTimeout(() => {
        divMessage.remove();
    }, 2000)
}

function getAPI() {
    const { currency, crypto } = objUser;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${crypto}&tsyms=${currency}`;

    showSpinner();

    setTimeout(() => {
        fetch(url)
        .then(res => res.json())
        .then(res => showInfoHTML(res.DISPLAY[crypto][currency]))
    }, 700)
}
function showInfoHTML(info) {
    // const isPriceClassActive = document.querySelector('.price');

    // if(isPriceClassActive) {
    //     console.log('Class is active');
    //     return;
    // }

    cleanHTML();

    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = info;

    const price = document.createElement('p');
    price.classList.add('price');
    price.innerHTML = `The actual price is: <span>${PRICE}</span>`;

    const highOfDay = document.createElement('p');
    highOfDay.innerHTML = `High of Day price: <span>${HIGHDAY}</span>`;

    const lowOfDay = document.createElement('p');
    highOfDay.innerHTML = `Low of Day price: <span>${LOWDAY}</span>`;

    const change24h = document.createElement('p');
    change24h.innerHTML = `24h Change: <span>${CHANGEPCT24HOUR} % </span>`;

    const lastUpdate = document.createElement('p');
    lastUpdate.innerHTML = `LAST UPDATE: <span>${LASTUPDATE}</span>`;



    result.appendChild(price);
    result.appendChild(highOfDay);
    result.appendChild(lowOfDay);
    result.appendChild(change24h);
    result.appendChild(lastUpdate);
}

function cleanHTML() {
    while (result.firstChild) {
        result.removeChild(result.firstChild);
    }
}

function showSpinner() {
    cleanHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    spinner.innerHTML =
        `
        <div class="sk-chase">
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        </div>
        `

        result.appendChild(spinner)

}

// populateSelect = (cryptoNames) => {
//     let arrayNames = cryptoNames.Data;
//     arrayNames.forEach(name => {
//         console.log(name.CoinInfo.Name);
//         let option = document.createElement('option');
//         option.value = name.CoinInfo.Name;
//         option.textContent = name.CoinInfo.Name;
//         cryptoSelect.appendChild(option);
//     });
// }

// cryptoSelected = (e) => {
//     console.log(e.target.value);
// }

// currencySelected = (e) => {
//     console.log(e.target.value);
// }

// cryptoSelect.addEventListener('change', cryptoSelected);

// currencySelect.addEventListener('change', currencySelected);