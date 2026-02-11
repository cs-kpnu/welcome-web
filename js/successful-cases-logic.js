let successfulCasesData = { successful_cases: [] };

const cardsContainer = document.getElementById('successful-cases-cards');

async function loadData() {
    try {
        const response = await fetch('../data/successful-cases.json');

        if (!response.ok) {
        }

        const data = await response.json();
        successfulCasesData = data;

        renderCards();
    } catch (error) {
    }
}

function renderCards() {
    cardsContainer.innerHTML = '';

    successfulCasesData.successful_cases.forEach(successfulCase => {
        const card = document.createElement('div');
        card.className = 'successful-case-card';
        card.innerHTML = `
        <div class="successful-case-card-image">
          <img src="${successfulCase.image}" alt="${successfulCase.title}" />
        </div>
        <div class="successful-case-card-title">${successfulCase.title}</div>
        <div class="successful-case-card-description">
            ${successfulCase.description}
        </div>
        <button>Детальніше</button>
        `;
        cardsContainer.appendChild(card);
    });
}

loadData();