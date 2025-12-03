/* js/layout.js */
document.addEventListener("DOMContentLoaded", () => {
  const headerHTML = `
  <div class="container nav-inner">
    <a class="brand" href="index.html">
      <span class="logo-mark">YF</span>
      <span class="logo-text">YouthForce</span>
    </a>

    <nav class="nav" aria-label="Main navigation">
      <a href="index.html">Головна</a>
      <a href="team.html">Команда</a>
      <a href="projects.html">Проєкти</a>
      <a href="activity.html">Діяльність</a>
      <a href="contacts.html">Контакти</a>
    </nav>

    <button class="burger" id="burger" aria-label="Відкрити меню">
      <span></span><span></span><span></span>
    </button>
  </div>
  `;

  const footerHTML = `
  <div class="container footer-inner">
    <div class="footer-left">
      <div class="brand-sm">
        <span class="logo-mark">YF</span>
        <span class="logo-text">YouthForce</span>
      </div>
      <p class="muted">Платформа розвитку та співпраці молоді</p>
    </div>

    <div class="footer-links">
      <div>
        <h4>Навігація</h4>
        <a href="index.html">Головна</a>
        <a href="team.html">Команда</a>
        <a href="projects.html">Проєкти</a>
      </div>
      <div>
        <h4>Контакти</h4>
        <p class="muted">email: info@yf.example</p>
        <p class="muted">тел.: +380 XX XXX XXXX</p>
      </div>
    </div>

    <div class="footer-social">
      <div class="muted">© 2025 YouthForce</div>
    </div>
  </div>
  `;

  // Insert
  const headerEl = document.querySelector("header");
  const footerEl = document.querySelector("footer");
  if (headerEl) headerEl.innerHTML = headerHTML;
  if (footerEl) footerEl.innerHTML = footerHTML;

  // mark active link based on location
  const links = document.querySelectorAll("header .nav a");
  links.forEach(a => {
    if (a.getAttribute("href") === location.pathname.split("/").pop() || (a.getAttribute("href") === "index.html" && location.pathname.endsWith("/"))) {
      a.classList.add("active");
    }
  });
});
