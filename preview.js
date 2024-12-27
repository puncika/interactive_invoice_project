/*===============================================================================
  |                            BUTTONY BANKOVY PREVOD A HOTOVOST                |
  ===============================================================================*/
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
        paymentText = '<strong>Úhrada faktúry:</strong> Bankovým prevodom';
    } else if (activeId === 'hotovost') {
        paymentText = '<strong>Úhrada faktúry:</strong> Hotovosťou';
    }

    // Aktualizácia textu v náhľade A4
    document.getElementById('uhrada-faktury').innerHTML = paymentText;
}


/*===============================================================================
  |        PREVIEW DO A4 čo sa má premietnuť z currencytab.js                   |
  ===============================================================================*/



/*===============================================================================
  |                  LISTENERY DO A4 PREVIEW Z INPUTOV A PODOBNE                |
  ===============================================================================*/
  /*===============================================================================
  |                            DODAVATEL PREVIEW DO A4                          |
  ===============================================================================*/
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


/*===============================================================================
  |                            ODBERATEL PREVIEW DO A4                          |
  ===============================================================================*/
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

/*===============================================================================
  |                            BANKOVE UDAJE DOLE V PREVIEW                     |
  ===============================================================================*/
document.querySelector('.bank-details-update').addEventListener('input', function(event) {
    const target = event.target;
    const previewId = 'preview-' + target.id;
    const bankUdajeContainer = document.getElementById('bank-udaje');
    const previewElement = bankUdajeContainer.querySelector('#' + previewId);
    if (previewElement) {
        previewElement.textContent = target.value;
    }
});

/*===============================================================================
  |                            DODAVATEL LISTENERY - NECHAPEM                    |
  ===============================================================================*/
document.querySelector('.obalenie-dodavatela').addEventListener('input', function(event) {
    const target = event.target;
    const previewId = 'preview-' + target.id;
    const bankUdajeContainer = document.getElementById('dodavatel-section');
    const previewElement = bankUdajeContainer.querySelector('#' + previewId);
    if (previewElement) {
        previewElement.textContent = target.value;
    }
});

/*===============================================================================
  |                            ODBEREATEL LISTENERY - NECHAPEM                   |
  ===============================================================================*/
document.querySelector('.obalenie-odberatela').addEventListener('input', function(event) {
    const target = event.target;
    const previewId = 'preview-' + target.id;
    const bankUdajeContainer = document.getElementById('odberatel-section');
    const previewElement = bankUdajeContainer.querySelector('#' + previewId);
    if (previewElement) {
        previewElement.textContent = target.value;
    }
});