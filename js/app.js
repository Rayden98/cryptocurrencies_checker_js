const cryptoSelect = document.querySelector('#criptomonedas');
const currencySelect = document.querySelector('#moneda');
const form = document.querySelector('#formulario');
const result = document.querySelector('#resultado');


const objSearch = {
    moneda: '',
    criptomoneda: ''
}

// Create a promise
const getCryptocurrencies = criptocurrencies => new Promise( resolve => {
    resolve(criptocurrencies);
})

document.addEventListener('DOMContentLoaded', () => {
    consultCriptocurrencies();

    form.addEventListener('submit', submitForm);
    cryptoSelect.addEventListener('change', readValue);
    currencySelect.addEventListener('change', readValue);

})

function consultCriptocurrencies(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then(response => response.json())
        .then(result => getCryptocurrencies(result.Data))
        .then(criptocurrencies => selectCryptocurrencies(criptocurrencies))
}

function selectCryptocurrencies(criptocurrencies){
    criptocurrencies.forEach( crypto => {
        const {FullName, Name} = crypto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        cryptoSelect.appendChild(option)
    })
}

function readValue(e){
    objSearch[e.target.name] = e.target.value
    console.log(objSearch)
}

function submitForm(e){
    e.preventDefault();
    
    // Validate
    const {moneda, criptomoneda} = objSearch;
    if(moneda === '' || criptomoneda ===''){
        showAlert('Both field are mandatory');
        return;
    }

    // Consult the API with the results
    consultAPI();
}

function showAlert(message){

    const existError = document.querySelector('.error');
    if(!existError){
        const divMessage = document.createElement('div');
        divMessage.classList.add('error');

        // message of error
        divMessage.textContent = message;

        form.appendChild(divMessage);

        setTimeout(()=>{
            divMessage.remove()
        }, 3000);
    }
    
}

function consultAPI(){
    const {moneda, criptomoneda} = objSearch;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    showSpinner();

    fetch(url)
        .then(response => response.json())
        .then(price => {
            showPriceHTML(price.DISPLAY[criptomoneda][moneda])
        })
}

function showPriceHTML(price){

    cleanHTML();
    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = price;

    const price1 = document.createElement('p');
    price1.classList.add('price');
    price1.innerHTML = `The price is: <span>${PRICE}</span>`;

    const highPrice = document.createElement('p');
    highPrice.innerHTML = `<p>Price most high of the day <span>${HIGHDAY}</span>`;

    const lowPrice = document.createElement('p');
    lowPrice.innerHTML = `<p>Price most low of the day <span>${LOWDAY}</span>`;

    const lastHours = document.createElement('p');
    lastHours.innerHTML = `<p>Change of the last 24 hours <span>${CHANGEPCT24HOUR}%</span>`;

    const lastUpdate = document.createElement('p');
    lastUpdate.innerHTML = `<p>Last update <span>${LASTUPDATE}</span>`;

    result.appendChild(price1);
    result.appendChild(highPrice);
    result.appendChild(lowPrice);
    result.appendChild(lastHours);
    result.appendChild(lastUpdate);


}

function cleanHTML(){
    while(result.firstChild){
        result.removeChild(result.firstChild);
    };
};

function showSpinner(){
    cleanHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');

    spinner.innerHTML=`
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

    result.appendChild(spinner);
}