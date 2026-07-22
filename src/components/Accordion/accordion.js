// Аккордеон
function accordion() {
    const items = document.querySelectorAll('.accordion__item-trigger')
    items.forEach(item => {
        item.addEventListener('click', () => {
            const parent = item.parentNode
            if (parent.classList.contains('accordion__item-active')) {
                parent.classList.remove('accordion__item-active')
                item.setAttribute('aria-expanded', 'false')
            } else {
                document
                    .querySelectorAll('.accordion__item')
                    .forEach(child => {
                        child.classList.remove('accordion__item-active')
                        child.querySelector('.accordion__item-trigger').setAttribute('aria-expanded', 'false')
                    })
                parent.classList.add('accordion__item-active')
                item.setAttribute('aria-expanded', 'true')
            }
        })
    })
}
accordion()
