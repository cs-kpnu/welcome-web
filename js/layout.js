fetch("header.html")
  .then(response => response.text())
  .then(data => {
    document.getElementById("header").innerHTML = data;
    setActiveLink();
    initBurger();
  });

fetch("footer.html")
  .then(response => response.text())
  .then(data => {
    document.getElementById("footer").innerHTML = data;
  });

function setActiveLink() {
    const menuLinks = document.querySelectorAll('.menu ul li a');
    const currentPath = window.location.pathname; 
    let currentFile = currentPath.split("/").pop();

    if (currentFile === "") {
        currentFile = "index.html";
    }

    menuLinks.forEach(link => {
        const linkHref = link.getAttribute('href');

        if (linkHref === currentFile) {
            link.classList.add('active');
        }
    });
}

function initBurger() {
    const burgerBtn = document.querySelector('.burger-btn');
    const menu = document.querySelector('.menu');
    const header = document.querySelector('header');
    const body = document.body;

    const closeMenu = () => {
        burgerBtn.classList.remove('active');
        menu.classList.remove('active');
        header.classList.remove('header-bg-active');
        document.body.style.overflow = 'visible';
    };

    burgerBtn.addEventListener('click', () => {
        burgerBtn.classList.toggle('active');
        menu.classList.toggle('active');
        header.classList.toggle('header-bg-active');
    });

    document.addEventListener('click', (e) => {
        const isClickInsideMenu = menu.contains(e.target);
        const isClickOnBurger = burgerBtn.contains(e.target);

        if (menu.classList.contains('active') && !isClickInsideMenu && !isClickOnBurger) {
            closeMenu();
        }
    });

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            burgerBtn.classList.remove('active');
            menu.classList.remove('active');
            header.classList.remove('header-bg-active');
            body.style.overflow = 'visible';
        });
    });

    window.addEventListener('scroll', () => {
        if (menu.classList.contains('active')) {
            closeMenu();
        }
    }, { passive: true });
}