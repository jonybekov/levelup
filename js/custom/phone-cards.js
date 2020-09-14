const phoneCard = document.querySelector(".phone-card"), serviceCards = [...document.querySelectorAll(".service-item")];

const result = serviceCards.map((el, index) => {
    let img = document.createElement('img')
    let child = phoneCard.appendChild(img);
    
    child.className = `service-img-${index+1}`;
    child.src = `./assets/images/${index+1}.png`;
    el.addEventListener('mouseenter', () => {
            child.classList = `service-img-${index+1} active`;
        }
    );

    el.addEventListener('mouseleave', () => {
        child.classList = `service-img-${index+1}`;
    })
})