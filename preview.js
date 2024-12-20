/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
    BUTTONY BANKOVY PREVOD A HOTOVOST
   ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

// Funkcia na prepnutie aktívneho tlačidla - Bankový prevod A Hotovosť
function setActiveButton(activeId) {
    const buttons = document.querySelectorAll('.toggle-button');

    // Odstránenie triedy 'active' zo všetkých tlačidiel
    buttons.forEach(button => {
        button.classList.remove('active');
    });

    // Pridanie triedy 'active' na kliknuté tlačidlo
    const clickedButton = document.getElementById(activeId);
    clickedButton.classList.add('active');

    // Nastavenie textu v A4 náhľade podľa výberu tlačidla
    let paymentText = "";
    if (activeId === 'bankovy-prevod') {
        paymentText = 'Úhrada faktúry: Bankovým prevodom';
    } else if (activeId === 'hotovost') {
        paymentText = 'Úhrada faktúry: Hotovosťou';
    }

    // Aktualizácia textu v náhľade A4
    document.getElementById('uhrada-faktury').textContent = paymentText;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
    PREVIEW DO A4 čo sa má premietnuť z currencytab.js
   ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

// Funkcia na aktualizáciu A4 preview pre položky faktúry + DOPLNOK PRE --> /* TU SA UPRAVUJE PRIDAT POLOZKU PLUSKO SYMBOL ZELENE */
function updateInvoicePreview() {
    const previewContainer = document.getElementById("invoice-preview-items");
    previewContainer.innerHTML = ""; // Vyčisti predchádzajúce položky

    // Vyber všetky položky faktúry
    const invoiceItems = document.querySelectorAll('.invoice-row');

    invoiceItems.forEach(item => {
        const itemName = item.querySelector('.item-name input').value;
        const itemTotal = item.querySelector('.item-total input').value;

        // Vytvorenie nového riadku v náhľade
        const previewRow = document.createElement('div');
        previewRow.classList.add('preview-item-row');

        // Popis položky
        const description = document.createElement('p');
        description.classList.add('preview-item-description');
        description.textContent = `Popis položky: ${itemName}`;

        // Suma položky
        const amount = document.createElement('p');
        amount.classList.add('preview-item-amount');
        amount.textContent = `${itemTotal}`;

        // Pridanie popisu a sumy do riadku
        previewRow.appendChild(description);
        previewRow.appendChild(amount);

        // Pridanie riadku do náhľadu
        previewContainer.appendChild(previewRow);
    });

    // Aktualizácia celkovej sumy v náhľade
    const totalSum = document.getElementById("total-sum").textContent;
    document.getElementById("preview-final-sum").textContent = `Zaplatiť: ${totalSum}`;
}

// Event listener na pridávanie novej položky (zabezpečí aj update náhľadu po pridaní)
document.getElementById("add-item-button").addEventListener("click", function() {
    addInvoiceItemRow();
    updateInvoicePreview(); // Aktualizovať náhľad po pridaní položky
});

// Aktualizácia náhľadu po zmene v akomkoľvek inpute položiek faktúry
document.addEventListener("input", function(event) {
    if (event.target.matches('.item-name-input') || event.target.matches('.item-total-input')) {
        updateInvoicePreview();
    }
});

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
    LISTENERY DO A4 PREVIEW Z INPUTOV A PODOBNE
   ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

document.getElementById("company-name").addEventListener("input", function() {
    document.getElementById("preview-company-name").textContent = this.value;
});
document.getElementById("ico").addEventListener("input", function() {
    document.getElementById("preview-ico").textContent = this.value;
});
document.getElementById("dodavatel-psc").addEventListener("input", function() {
    document.getElementById("preview-psc").textContent = this.value;
});
document.getElementById("dodavatel-mesto").addEventListener("input", function() {
    document.getElementById("preview-mesto").textContent = this.value;
});
document.getElementById("contact-number").addEventListener("input", function() {
    document.getElementById("preview-contact-number").textContent = this.value;
});
/* -----------------------------------------
                ODBERATEL
----------------------------------------- */
document.getElementById("company-name-other").addEventListener("input", function() {
    document.getElementById("preview-company-name-other").textContent = this.value;
});
document.getElementById("ico-other").addEventListener("input", function() {
    document.getElementById("preview-ico-other").textContent = this.value;
});
document.getElementById("bank-account-other").addEventListener("input", function() {
    document.getElementById("preview-bank-account-other").textContent = this.value;
});
document.getElementById("contact-number-other").addEventListener("input", function() {
    document.getElementById("preview-contact-number-other").textContent = this.value;
});


document.querySelector('.bank-details-update').addEventListener('input', function(event) {
    const target = event.target;
    const previewId = 'preview-' + target.id;
    const bankUdajeContainer = document.getElementById('bank-udaje');
    const previewElement = bankUdajeContainer.querySelector('#' + previewId);
    if (previewElement) {
        previewElement.textContent = target.value;
    }
});

document.querySelector('.obalenie-dodavatela').addEventListener('input', function(event) {
    const target = event.target;
    const previewId = 'preview-' + target.id;
    const bankUdajeContainer = document.getElementById('dodavatel-section');
    const previewElement = bankUdajeContainer.querySelector('#' + previewId);
    if (previewElement) {
        previewElement.textContent = target.value;
    }
});

document.querySelector('.obalenie-odberatela').addEventListener('input', function(event) {
    const target = event.target;
    const previewId = 'preview-' + target.id;
    const bankUdajeContainer = document.getElementById('odberatel-section');
    const previewElement = bankUdajeContainer.querySelector('#' + previewId);
    if (previewElement) {
        previewElement.textContent = target.value;
    }
});