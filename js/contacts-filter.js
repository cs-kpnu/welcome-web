const filterBox = document.querySelector('.filter-box');
const selectedText = document.querySelector('.selected-text');
const optionsContainer = document.querySelector('.filter-option');
const optionsList = document.querySelectorAll('.option');

filterBox.addEventListener('click', () => {
    filterBox.classList.toggle('active');
});

optionsList.forEach(option => {
    option.addEventListener('click', (event) => {
        event.stopPropagation();
        
        const radio = option.querySelector('.radio');
        const label = option.querySelector('label');

        selectedText.innerText = label.innerText;
        radio.checked = true;

        filterBox.classList.remove('active');
        console.log("Вибрано:", label.innerText);
    });
});

document.addEventListener('click', (e) => {
    if (!filterBox.contains(e.target)) {
        filterBox.classList.remove('active');
    }
});