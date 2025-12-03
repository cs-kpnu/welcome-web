document.addEventListener("DOMContentLoaded", () => {
    
    // 1. ЗАВАНТАЖЕННЯ ХЕДЕРА (Розумна функція)
    loadHeader();

    // 2. ЗАВАНТАЖЕННЯ ФУТЕРА
    // Визначаємо шлях залежно від того, де ми є
    const isPages = window.location.pathname.includes("/pages/");
    const footerPath = isPages ? "footer.html" : "pages/footer.html";
    loadComponent("footer", footerPath);

    // 3. Ініціалізація логіки сторінок
    initProjects();
    initTeam();
    initContactForm();
});

// ==================================================
// 1. ЛОГІКА ХЕДЕРА (НАЙВАЖЛИВІШЕ)
// ==================================================

function loadHeader() {
    // Перевіряємо, чи ми в папці 'pages'
    const isPagesFolder = window.location.pathname.includes("/pages/");
    
    // Якщо ми в папці pages, файл лежить поруч ("header.html")
    // Якщо ми в корені, файл лежить у папці ("pages/header.html")
    const headerPath = isPagesFolder ? "header.html" : "pages/header.html";

    const placeholder = document.getElementById("header-placeholder") || document.getElementById("header");
    if (!placeholder) return;

    fetch(headerPath)
        .then(response => {
            if (!response.ok) throw new Error("Header not found");
            return response.text();
        })
        .then(html => {
            placeholder.innerHTML = html;
            
            // Якщо ми на внутрішній сторінці, треба виправити шляхи (додати ../)
            if (isPagesFolder) {
                fixPathsForSubpages();
            }

            // Підсвітити активне посилання
            setActiveLink();
        })
        .catch(error => console.error("Error loading header:", error));
}

function fixPathsForSubpages() {
    // Виправляємо картинки (src="images/...") -> (src="../images/...")
    const images = document.querySelectorAll("header img, #header img, #header-placeholder img");
    images.forEach(img => {
        const src = img.getAttribute("src");
        // Якщо шлях не починається з http або ../, додаємо ../
        if (src && !src.startsWith("http") && !src.startsWith("../")) {
            img.setAttribute("src", "../" + src);
        }
    });

    // Виправляємо посилання
    const links = document.querySelectorAll("header a, #header a, #header-placeholder a");
    links.forEach(link => {
        const href = link.getAttribute("href");
        if (href) {
            if (href === "index.html") {
                // Посилання на головну має вести на рівень вгору
                link.setAttribute("href", "../index.html");
            } else if (href.startsWith("pages/")) {
                // Якщо ми вже в папці pages, то "pages/team.html" стає просто "team.html"
                link.setAttribute("href", href.replace("pages/", ""));
            }
        }
    });
}

function setActiveLink() {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const links = document.querySelectorAll(".head-center a");

    links.forEach(link => {
        const href = link.getAttribute("href");
        // Перевіряємо, чи посилання веде на поточну сторінку
        if (href && (href === currentPath || href.endsWith(currentPath))) {
            link.classList.add("active");
        }
    });
}

// ==================================================
// 2. ДОПОМІЖНА ФУНКЦІЯ (для футера)
// ==================================================
function loadComponent(elementId, filePath, callback) {
    const element = document.getElementById(elementId);
    if (!element) return;

    fetch(filePath)
        .then(response => {
            if (!response.ok) throw new Error(`Error loading ${filePath}`);
            return response.text();
        })
        .then(data => {
            element.innerHTML = data;
            if (callback) callback();
        })
        .catch(err => console.error(err));
}

// ==================================================
// 3. БІЗНЕС-ЛОГІКА (Проєкти, Команда, Контакти)
// ==================================================

// === Логіка Проєктів ===
function initProjects() {
    const grid = document.getElementById("projectsGrid");
    if (!grid) return; 

    const filterBtns = document.querySelectorAll(".filter-btn");
    const searchInput = document.getElementById("projectSearch");
    const items = Array.from(grid.querySelectorAll(".project-card"));

    // Фільтрація по кнопках
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const filter = btn.dataset.filter;
            filterProjects(items, filter, searchInput.value);
        });
    });

    // Пошук
    searchInput.addEventListener("input", (e) => {
        const activeBtn = document.querySelector(".filter-btn.active");
        const filter = activeBtn ? activeBtn.dataset.filter : "all";
        filterProjects(items, filter, e.target.value);
    });
}

function filterProjects(items, category, searchText) {
    const search = searchText.toLowerCase().trim();

    items.forEach(item => {
        const itemCat = item.dataset.category;
        const text = item.textContent.toLowerCase();

        const matchCat = category === "all" || itemCat === category;
        const matchSearch = text.includes(search);

        item.style.display = (matchCat && matchSearch) ? "block" : "none";
    });
}

// === Логіка Команди ===
function initTeam() {
    const searchInput = document.getElementById("teamSearch");
    const grid = document.getElementById("teamGrid");
    if (!searchInput || !grid) return;

    const members = Array.from(grid.querySelectorAll(".member-card"));

    searchInput.addEventListener("input", (e) => {
        const val = e.target.value.toLowerCase().trim();
        members.forEach(member => {
            const text = member.textContent.toLowerCase();
            member.style.display = text.includes(val) ? "block" : "none";
        });
    });
}

// === Логіка Контактів ===
function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Дякуємо! Повідомлення відправлено (демо).");
        form.reset();
    });
}