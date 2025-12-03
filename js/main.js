/* js/main.js */
document.addEventListener("DOMContentLoaded", () => {
  // BURGER MENU
  const burger = document.getElementById("burger");
  if (burger) {
    burger.addEventListener("click", () => {
      document.querySelector("header .nav").classList.toggle("open");
      burger.classList.toggle("open");
    });
  }

  // Projects: filter + search + pagination (if projectsGrid exists)
  (function () {
    const grid = document.getElementById("projectsGrid");
    if (!grid) return;

    const filterBtns = document.querySelectorAll(".filter-btn");
    const searchInput = document.getElementById("projectSearch");
    const paginationEl = document.getElementById("pagination");
    let items = Array.from(grid.querySelectorAll(".project-card"));
    const perPage = 6;
    let currentPage = 1;
    let currentFilter = "all";

    function render() {
      const q = (searchInput?.value || "").trim().toLowerCase();
      let filtered = items.filter(it => {
        const cat = it.dataset.category || "all";
        const matchesFilter = currentFilter === "all" || cat === currentFilter;
        const txt = (it.textContent || "").toLowerCase();
        const matchesSearch = q === "" || txt.includes(q);
        return matchesFilter && matchesSearch;
      });

      const total = filtered.length;
      const pages = Math.max(1, Math.ceil(total / perPage));
      if (currentPage > pages) currentPage = pages;
      const start = (currentPage - 1) * perPage;
      const visible = filtered.slice(start, start + perPage);

      items.forEach(it => it.style.display = "none");
      visible.forEach(it => it.style.display = "block");

      // pagination
      if (paginationEl) {
        paginationEl.innerHTML = "";
        for (let p = 1; p <= pages; p++) {
          const btn = document.createElement("button");
          btn.className = "pag-btn" + (p === currentPage ? " active" : "");
          btn.textContent = p;
          btn.addEventListener("click", () => {
            currentPage = p;
            render();
            window.scrollTo({ top: grid.offsetTop - 100, behavior: "smooth" });
          });
          paginationEl.appendChild(btn);
        }
      }
    }

    filterBtns.forEach(b => {
      b.addEventListener("click", () => {
        filterBtns.forEach(x => x.classList.remove("active"));
        b.classList.add("active");
        currentFilter = b.dataset.filter || "all";
        currentPage = 1;
        render();
      });
    });

    if (searchInput) searchInput.addEventListener("input", () => { currentPage = 1; render(); });

    render();
  })();

  // Team search
  (function () {
    const input = document.getElementById("teamSearch");
    const grid = document.getElementById("teamGrid");
    if (!input || !grid) return;
    const members = Array.from(grid.querySelectorAll(".member-card"));
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      members.forEach(m => {
        const txt = (m.textContent || "").toLowerCase();
        m.style.display = q === "" || txt.includes(q) ? "block" : "none";
      });
    });
  })();

  // Contact form simple validation
  (function () {
    const form = document.getElementById("contactForm");
    if (!form) return;
    const result = document.getElementById("formResult");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.querySelector("[name=name]").value.trim();
      const email = form.querySelector("[name=email]").value.trim();
      const msg = form.querySelector("[name=message]").value.trim();
      if (!name || !email || !msg) {
        result.textContent = "Будь ласка, заповніть всі обов'язкові поля.";
        result.classList.add("error");
        return;
      }
      result.textContent = "Дякуємо! Повідомлення прийнято (симул.).";
      result.classList.remove("error");
      result.classList.add("success");
      form.reset();
    });
  })();
});
