const historyContainer = document.querySelector('#history-container');
const emptyState = document.querySelector('#empty-state');

// Função para carregar o histórico
async function loadHistory() {
    try {       
        const response = await fetch('php/history.php');
        const result = await response.json();       
        console.log(result)       

        // Verifica se há dados
        if (!result.success || result.data.length === 0) {
            emptyState.style.display = 'flex';
            return;
        }

        // Mostra o container
        historyContainer.style.display = 'grid';

        result.data.forEach(item => {
            const card = createCard(item);
            historyContainer.appendChild(card);
        });

    } catch (error) {
        console.error('Erro ao carregar histórico:', error);       
        emptyState.style.display = 'flex';
    }
}

// Função para criar um card
function createCard(item) {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
        <div class="cidade">
            <i class="fa-solid fa-location-dot"></i>
            ${item.cidade}, ${item.pais}
        </div>
        <div class="info">
            <div class="info-item">
                <i class="fa-solid fa-temperature-high"></i>
                <span class="info-label">Temperatura</span>
                <span class="info-value">${item.temperatura}</span>
            </div>
            <div class="info-item">
                <i class="fa-solid fa-cloud-sun"></i>
                <span class="info-label">Clima</span>
                <span class="info-value">${item.descricao}</span>
            </div>
            <div class="info-item">
                <i class="fa-solid fa-calendar"></i>
                <span class="info-label">Data/Hora</span>
                <span class="info-value">${item.data_hora}</span>
            </div>
        </div>
    `;

    return card;
}

// Carrega o histórico quando a página carregar
window.addEventListener('DOMContentLoaded', loadHistory);