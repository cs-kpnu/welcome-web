document.addEventListener("DOMContentLoaded", () => {
// 1. Мокові дані
const allProjects = [];
for (let i = 1; i <= 25; i++) {
    const isCompleted = i % 3 === 0;
        allProjects.push({
        id: i,
        title: `Проєкт ${i}`,
        status: isCompleted ? 'Completed' : 'Active',
        startDate: `2023-${(i % 12) + 1}-01`,
        endDate: isCompleted ? '2024-01-01' : null,
        /*domain: `project${i}.com`,*/
            photo: `../images/project${((i - 1) % 3) + 1}.svg`,
        participants: Math.floor(Math.random() * 10) + 1,
        description: 'Це короткий опис проєкту.',
    });
}

// Стан додатка
let currentFilter = '';
let currentPage = 1;
const itemsPerPage = 9;

// Головна функція рендеру
function render() {
    const container = document.getElementById('projects-container');
    const paginationContainer = document.getElementById('pagination-container');
    container.innerHTML = '';
    paginationContainer.innerHTML = '';

    // Фільтрація: якщо фільтр порожній — показати всі
    let filteredProjects = currentFilter ? allProjects.filter(p => p.status === currentFilter) : allProjects.slice();

    // Сортування
    filteredProjects.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    // Пагінація
    const totalItems = filteredProjects.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    if (currentPage > totalPages) currentPage = 1;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const projectsToShow = filteredProjects.slice(startIndex, endIndex);

    // Відображення карток
    projectsToShow.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        
        card.onclick = (e) => {
            if(!e.target.classList.contains('details-btn')) {
                alert(`Перехід на детальну сторінку проєкту ID: ${project.id}`);
            }
        };

        const endDateHTML = project.status === 'Completed' 
            ? `<div><strong>Завершено:</strong> ${project.endDate}</div>` 
            : '';

        card.innerHTML = `
            <img src="${project.photo}" alt="Фото" class="project-img">
            <div class="project-badge">${project.status === 'Completed' ? 'завершено' : 'розпочато'}</div>
            <div class="project-title">${project.title}</div>

            <div class="project-meta"><strong>Початок:</strong> ${project.startDate}</div>
            ${endDateHTML}

            <div class="project-meta"><strong>Учасників:</strong> ${project.participants}</div>
            <p class="project-desc">${project.description}</p>
            <button class="details-btn" onclick="location.href='/details/${project.id}'">Детальніше</button>
        `;
        container.appendChild(card);
    });

    // Рендер пагінації
    if (totalItems > itemsPerPage) {
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.innerText = i;
            btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
            btn.onclick = () => {
                currentPage = i;
                render();
            };
            paginationContainer.appendChild(btn);
        }
    }
}

// Функція перемикання фільтру
function setFilter(status) {
    currentFilter = status;
    currentPage = 1;
    
    
    
    render();
}

// Expose to global scope so `onchange="setFilter(this.value)"` in HTML works
window.setFilter = setFilter;

// Перший запуск
render();
});