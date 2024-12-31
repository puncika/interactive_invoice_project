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
        document.getElementById("qrcode").style.display = "block";
    } else if (activeId === 'hotovost') {
        paymentText = '<strong>Úhrada faktúry:</strong> Hotovosťou';
        document.getElementById("qrcode").style.display = "none";
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

// Funkcia na aktualizáciu náhľadu pri načítaní stránky
function updatePreview() {
    document.getElementById("preview-company-name").textContent = document.getElementById("company-name").value;
    document.getElementById("preview-ico").textContent = document.getElementById("ico").value;
    document.getElementById("preview-psc").textContent = document.getElementById("dodavatel-psc").value;
    document.getElementById("preview-mesto").textContent = document.getElementById("dodavatel-mesto").value;
    document.getElementById("preview-contact-number").textContent = document.getElementById("contact-number").value;

    document.getElementById("preview-company-name-other").textContent = document.getElementById("company-name-other").value;
    document.getElementById("preview-ico-other").textContent = document.getElementById("ico-other").value;
    document.getElementById("preview-bank-account-other").textContent = document.getElementById("bank-account-other").value;
    document.getElementById("preview-contact-number-other").textContent = document.getElementById("contact-number-other").value;
    document.getElementById("preview-dodanie-datum").textContent = document.getElementById("date-section-dodania").value;

    document.querySelectorAll('.container-bank-iban-swift-order input').forEach(function(element) {
        const previewId = 'preview-' + element.id;
        const bankUdajeContainer = document.getElementById('bank-udaje');
        const previewElement = bankUdajeContainer.querySelector('#' + previewId);
        if (previewElement) {
            previewElement.textContent = element.value;
        }
    });
    
    document.querySelectorAll('.obalenie-dodavatela').forEach(function(element) {
        const previewId = 'preview-' + element.id;
        const previewElement = document.getElementById(previewId);
        if (previewElement) {
            previewElement.textContent = element.value;
        }
    });

    document.querySelectorAll('.obalenie-odberatela').forEach(function(element) {
        const previewId = 'preview-' + element.id;
        const previewElement = document.getElementById(previewId);
        if (previewElement) {
            previewElement.textContent = element.value;
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setActiveButton('bankovy-prevod');
    updatePreview(); // Aktualizácia náhľadu pri načítaní stránky
});