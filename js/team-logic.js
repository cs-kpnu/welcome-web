let teamData = { team: [] };
let filteredData = { team: [] };

let currentPage = 1;
let itemsPerPage = 9;
const cardsContainer = document.getElementById('cardsContainer');
const paginationList = document.getElementById('paginationList');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const paginationControls = document.getElementById('paginationControls');
const searchInput = document.getElementById('searchInput');

async function loadData() {
    try {
        const response = await fetch('../data/team.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        teamData = data;
        filteredData = { team: [...data.team] };

        updateItemsPerPage();
    } catch (error) {
        console.error("Помилка завантаження даних:", error);
        cardsContainer.innerHTML = '<p style="color:white; text-align:center;">Не вдалося завантажити список учасників.</p>';
    }
}

function updateItemsPerPage() {
    const containerWidth = window.innerWidth;

    let newItemsPerPage = 9;
    if (containerWidth < 1144 && containerWidth > 772) {
        newItemsPerPage = 10;
    }

    if (newItemsPerPage !== itemsPerPage) {
        itemsPerPage = newItemsPerPage;
        currentPage = 1;
    }

    render();
}

function getBadgeColor(text) {
    if (text === 'Керівник' || text === 'Студент') return 'rgba(56, 83, 222, 1)';
    if (text === 'Активний') return 'rgba(87, 186, 105, 1)';
    if (text === 'Випускник') return 'rgba(224, 81, 81, 1)';
}

function renderCards() {
    cardsContainer.innerHTML = '';
    const containerWidth = window.innerWidth;

    cardsContainer.style.maxWidth = '1300px';
    cardsContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
    if (containerWidth < 1144 && containerWidth > 772) {
        cardsContainer.style.maxWidth = '712px';
        cardsContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
    } else if (containerWidth <= 772) {
        cardsContainer.style.maxWidth = '412px';
        cardsContainer.style.gridTemplateColumns = 'repeat(1, 1fr)';
    }

    if (!filteredData.team || filteredData.team.length === 0) {
        cardsContainer.style.maxWidth = '100%';
        cardsContainer.style.gridTemplateColumns = 'repeat(1, 1fr)';
        cardsContainer.innerHTML = `
            <div class="no-results">
                <div class="no-results-text">
                        Учасників не знайдено<br>
                        Спробуйте змінити критерії пошуку
                </div>
            </div>
        `;
        return;
    }

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = filteredData.team.slice(start, end);

    paginatedItems.forEach(member => {
        const projectsHtml = member.projects && member.projects.length > 0
            ? member.projects.map(p => `<div class="project-item">${p.project_name}</div>`).join('')
            : '<div class="project-item" style="background:none; padding-left:0;">Проєктів немає</div>';

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-image">
                <img src="${member.image}" alt="${member.surname}">
                <div class="card-header">
                    <p style="background-color: ${getBadgeColor(member.position)};">${member.position}</p>
                    <p style="background-color: ${getBadgeColor(member.status)};">${member.status}</p>
                </div>
            </div>
            <div class="card-body">
                <div class="card-body-header">
                    <div class="surname">${member.surname}</div>
                    <div class="name">${member.name}</div>
                    <div class="academic-title">${member["academic-title"]}</div>
                </div>
                <div class="start-date">
                    <div class="start-date-title">
                        <img src="../assets/special-icons/calendar.png" alt="">
                        <div class="start-date-title-text">У команді з</div>
                    </div>
                    <div class="date">${member["date-from"]}</div>
                </div>
                <div class="projects">
                    <div class="projects-label">Проєкти:</div>
                    <div class="projects-list">
                        ${projectsHtml || '<div class="project-item">Немає проектів</div>'}
                    </div>
                </div>
                <button>Переглянути
                    <div class="arrow-icon"></div> 
                    </button>
            </div>
        `;
        cardsContainer.appendChild(card);
    });
}

function scrollToTitle() {
    const titleElement = document.querySelector('.title');
    if (titleElement) {
        const elementPosition = titleElement.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - 20;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }
}

function renderPagination() {
    paginationList.innerHTML = '';

    const sourceData = filteredData.team;

    if (!sourceData) return;

    const totalPages = Math.ceil(sourceData.length / itemsPerPage);

    if (totalPages <= 1) {
        paginationControls.style.display = 'none';
        return;
    }

    paginationControls.style.display = 'flex';

    prevBtn.disabled = currentPage === 1;
    prevBtn.style.opacity = currentPage === 1 ? '0.5' : '1';
    prevBtn.style.pointerEvents = currentPage === 1 ? 'none' : 'auto';

    nextBtn.disabled = currentPage === totalPages;
    nextBtn.style.opacity = currentPage === totalPages ? '0.5' : '1';
    nextBtn.style.pointerEvents = currentPage === totalPages ? 'none' : 'auto';

    let pages = [];

    if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        pages.push(1);

        if (currentPage > 3) {
            pages.push('...');
        }

        let start = Math.max(2, currentPage - 1);
        let end = Math.min(totalPages - 1, currentPage + 1);

        if (currentPage === 1) { end = 3; }
        if (currentPage === totalPages) { start = totalPages - 2; }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (currentPage < totalPages - 2) {
            pages.push('...');
        }

        pages.push(totalPages);
    }

    pages.forEach(p => {
        const btn = document.createElement('button');

        btn.innerText = p;

        if (p === '...') {
            btn.classList.add('dots');
            btn.disabled = true;
            btn.style.cursor = 'default';
            btn.style.border = 'none';
            btn.style.background = 'black';
            btn.style.color = 'white';
        } else {
            if (p === currentPage) {
                btn.classList.add('active');
            }

            btn.addEventListener('click', () => {
                currentPage = p;
                render();
                scrollToTitle();
            });
        }

        paginationList.appendChild(btn);
    });
}

function render() {
    renderCards();
    renderPagination();
}

prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        render();
        scrollToTitle();
    }
});

nextBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(teamData.team.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        render();
        scrollToTitle();
    }
});

window.addEventListener('resize', updateItemsPerPage);

searchInput.addEventListener('input', (e) => {
    const searchText = e.target.value.toLowerCase().trim();

    if (searchText === "") {
        filteredData.team = [...teamData.team];
    } else {
        filteredData.team = teamData.team.filter(member => {
            const fullName = `${member.surname}`.toLowerCase();

            return fullName.includes(searchText);
        });
    }

    render();
});

loadData();