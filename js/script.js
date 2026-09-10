const form = document.querySelector('#search');
const alertBox = document.querySelector('#alert');
const weatherBox = document.querySelector('#weather');
const weatherBox2 = document.querySelector('#five_days');
const select = document.querySelector('.select');
const loading = document.querySelector('#loading');

let option = '';

// Quando o usuário trocar a opção do select, execute essa função
select.addEventListener('change', (e) => {
    option = select.value;    
});

// enviando o formulário
form.addEventListener('submit', async (e) => {
    e.preventDefault();
   
    const city = document.querySelector('#city_name').value.trim();

    // se os campos estiverem vazios    
    if (!city && !option) {
        weatherBox.classList.remove('show');
        weatherBox2.classList.remove('show');        
        showAlert('Digite o nome de uma cidade e escolha uma unidade de medida (Celsius ou Fahrenheit)!');
        return; // Para aqui e não faz a busca na API
    }

    if (!city || !option) {
        weatherBox.classList.remove('show');
        weatherBox2.classList.remove('show');
        showAlert('Preencha todos os campos corretamente!');
        return; // Para aqui e não faz a busca na API
    }   

    // mostra o loading
    const loading = document.querySelector('#loading');
    loading.classList.add('show');
    weatherBox.classList.remove('show');
    weatherBox2.classList.remove('show');
    alertBox.textContent = ''; // Limpa alertas anteriores
    
    const apiKey = '96c436fd5d719e616032ee53aba6ceca';
    let url = '';
    let url5dias = '';

    // Define unidade correta para a API
    if (option === "Celsius") {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(city)}&appid=${apiKey}&units=metric&lang=pt_br`;
        url5dias = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURI(city)}&appid=${apiKey}&units=metric&lang=pt_br`;
    } else {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(city)}&appid=${apiKey}&units=imperial&lang=pt_br`;
        url5dias = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURI(city)}&appid=${apiKey}&units=imperial&lang=pt_br`;
    }

    // buscando os dados e convertendendo para um objeto utilizável    
    const response = await fetch(url);    
    const data = await response.json();

    const response5dias = await fetch(url5dias);
    const data5dias = await response5dias.json();

    // esconde o loading
    loading.classList.remove('show');

    if (data.cod === 200) {
        showWeather(data, data5dias, option);
    } else {
        weatherBox.classList.remove('show');
        weatherBox2.classList.remove('show');
        showAlert('Cidade não encontrada');
    }
});

// mostrando os climas
function showWeather(data, data5dias, option) {
    alertBox.textContent = ''; // Limpa alertas anteriores
    
    weatherBox.classList.add('show');
    weatherBox2.classList.add('show');

    // cidade e país
    document.querySelector('#title').textContent = `${data.name}, ${data.sys.country}`;

    // temperatura atual
    if (option === "Celsius") {
        document.querySelector('#temp_value').textContent = `${data.main.temp.toFixed(0)} °C`;
    } else {
        document.querySelector('#temp_value').textContent = `${data.main.temp.toFixed(0)} °F`;
    }

    document.querySelector('#temp_description').textContent = data.weather[0].description;
    document.querySelector('#temp_img').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    // temperaturas max/min
    if (option === "Celsius") {
        document.querySelector('#temp_max').textContent = `${data.main.temp_max.toFixed(0)} °C`;
        document.querySelector('#temp_min').textContent = `${data.main.temp_min.toFixed(0)} °C`;
    } else {
        document.querySelector('#temp_max').textContent = `${data.main.temp_max.toFixed(0)} °F`;
        document.querySelector('#temp_min').textContent = `${data.main.temp_min.toFixed(0)} °F`;
    }

    document.querySelector('#humidity').textContent = `${data.main.humidity}%`;
    document.querySelector('#wind').textContent = `${data.wind.speed} km/h`;

    // previsão 5 dias
    for (let i = 0; i < 5; i++) {
        const temp = data5dias.list[i].main.temp.toFixed(0);
        const unit = option === "Celsius" ? "°C" : "°F"; // usando operador ternário

        document.querySelector(`#day_title${i+1}`).textContent = `${temp} ${unit}`;
        document.querySelector(`#day_img${i+1}`).src = `https://openweathermap.org/img/wn/${data5dias.list[i].weather[0].icon}@2x.png`;
        document.querySelector(`#day_descricao${i+1}`).textContent = data5dias.list[i].weather[0].description;
    }
    
// enviar dados para o php e salvar no history.json
const historyData = {
    cidade: `${data.name}`,
    pais: `${data.sys.country}`,
    temperatura: option === "Celsius" 
        ? `${data.main.temp.toFixed(0)} °C`
        : `${data.main.temp.toFixed(0)} °F`,
    descricao: data.weather[0].description,
    data_hora: new Date().toLocaleString("pt-BR")
};

// arquivo processando e salvando os dados
// enviando dados no formato JSON
// convertendo objeto em string
fetch("./php/save_history.php", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(historyData)
});
}

// ALERTA
function showAlert(msg) {
    alertBox.textContent = msg;
}


