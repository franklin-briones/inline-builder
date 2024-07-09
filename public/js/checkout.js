let itemList = []

fetch('http://localhost:8000/get-settings', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    },
})
    .then(response => response.json())
    .then(response => {
        console.log(response)
        document.getElementById('logo').src = response.logo
        itemList = [
            {
                priceId: response.priceId,
                quantity: 1
            }
        ]
        openCheckout(itemList)

        const stylesheet = document.styleSheets[0];
        const styleSheet = document.styleSheets[0];
        const rules = styleSheet.cssRules || styleSheet.rules;
        for (let i = 0; i < rules.length; i++) {
            if (rules[i].selectorText === '.brandedText') {
                rules[i].style.color = response.primaryColour;
            }
        }

        for (let i = 0; i < rules.length; i++) {
            if (rules[i].selectorText === '.backgroundBeams') {
                rules[i].style.setProperty('--primary-color', `${response.primaryColour}40`);
                break;
            }
        }

    })
    .catch(error => {
        console.log(error)
    })

const openCheckout = (items) => {
    Paddle.Checkout.open({
        settings: {
            displayMode: "inline",
            frameTarget: "checkoutContainer",
            frameInitialHeight: "450",
            frameStyle: "width: 100%; min-width: 410px; background-color: transparent; border: none;"
        },
        items: items
    })
}

