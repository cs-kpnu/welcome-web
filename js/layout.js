fetch("header.html")
  .then(response => response.text())
  .then(data => {
    document.getElementById("header").innerHTML = data;
    setActiveLink();
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