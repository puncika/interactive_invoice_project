// Funkcia na prepnutie aktívneho tlačidla
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



window.onload = function() {
    console.log("Stránka je načítaná!");
    generateInvoiceNumber(); // Zavolá funkciu na generovanie čísla faktúry
};

/* TU SA UPRAVUJE PRIDAT POLOZKU PLUSKO SYMBOL ZELENE */

let itemCounter = 1; // Počítadlo položiek - už existuje prvá položka, preto začíname od 1

// Funkcia na pridanie novej položky
function addInvoiceItemRow() {
    if (document.querySelectorAll(".invoice-row").length >= 5) {
        document.getElementById("add-item-button").style.display = "none";
        return;
    }

    const invoiceItemSection = document.querySelector(".invoice-item-section");
    const newRow = document.createElement("div");
    newRow.classList.add("invoice-row");

    newRow.innerHTML = `
        <div class="item-name">
            <label for="item-name">Názov položky</label>
            <input type="text" class="item-name-input" name="item-name" placeholder="Názov položky">
        </div>
        <div class="item-total">
            <label for="item-total">Celkom</label>
            <input type="text" class="item-total-input" name="item-total" placeholder="0">
            <span class="currency-symbol">€</span>
        </div>
    `;
    invoiceItemSection.insertBefore(newRow, document.querySelector(".total-row"));

    // Vyber nový input
    const newItemTotalInput = newRow.querySelector('.item-total-input');

    // Pridať správanie pre nový input, podobne ako pre pôvodné inputy
    attachInputEventListeners(newItemTotalInput);
}

// Funkcia na pripojenie event listenerov na nové inputy
function attachInputEventListeners(input) {
    // Vymazanie placeholderu pri focus
    input.addEventListener("focus", function () {
        if (this.value === "0") {
            this.value = "";
        }
    });

    // Obnovenie placeholderu ak je prázdne pole pri odchode (blur)
    input.addEventListener("blur", function () {
        if (this.value === "") {
            this.value = "0";
        } else {
            // Formátovanie čísla a pridať symbol €
            formatCurrency(this);
        }
        updateTotalSum(); // Aktualizovať celkovú sumu
    });

    // Obmedzenie vstupu na čísla
    input.addEventListener("input", function (e) {
        const cleanValue = this.value.replace(/[^\d]/g, ""); // Odstráni všetko okrem čísiel
        this.value = cleanValue;
    });
}

// Funkcia na formátovanie meny
function formatCurrency(input) {
    let value = input.value.replace(/[^\d]/g, ""); // Odstráni všetko okrem čísiel
    if (value) {
        value = parseInt(value).toLocaleString("sk-SK"); // Formátuje číslo so slovenským formátovaním
    }
    input.value = value;

    // Pridáme € mimo inputu
    const itemTotalDiv = input.parentElement;
    let currencySymbol = itemTotalDiv.querySelector(".currency-symbol");
    if (!currencySymbol) {
        currencySymbol = document.createElement("span");
        currencySymbol.classList.add("currency-symbol");
        currencySymbol.textContent = "€";
        itemTotalDiv.appendChild(currencySymbol);
    }
}

// Funkcia na aktualizáciu celkovej sumy
function updateTotalSum() {
    let totalSum = 0;
    const itemTotalInputs = document.querySelectorAll('input[name="item-total"]');
    itemTotalInputs.forEach(input => {
        let value = parseInt(input.value.replace(/[^\d]/g, ""));
        if (!isNaN(value)) {
            totalSum += value;
        }
    });
    document.getElementById("total-sum").textContent = `${totalSum.toLocaleString("sk-SK")} €`;
}

// Event listener pre tlačidlo pridania položky
document.getElementById("add-item-button").addEventListener("click", addInvoiceItemRow);

// Pridať event listenery na pôvodné inputy pri načítaní dokumentu
document.addEventListener("DOMContentLoaded", function () {
    const itemTotalInputs = document.querySelectorAll('input[name="item-total"]');
    itemTotalInputs.forEach(input => {
        attachInputEventListeners(input);
    });
});


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



// Funkcia na vytvorenie čísla faktury pre uživatela
function generateInvoiceNumber() {
    const currentYearInvoiceGen = new Date().getFullYear();
    const invoiceNumber = currentYearInvoiceGen + "0001";
    document.getElementById("faktura-title-number").textContent = invoiceNumber;
}




document.getElementById("company-name").addEventListener("input", function() {
    document.getElementById("preview-company-name").textContent = this.value;
});
document.getElementById("ico").addEventListener("input", function() {
    document.getElementById("preview-ico").textContent = this.value;
});
document.getElementById("psc").addEventListener("input", function() {
    document.getElementById("preview-psc").textContent = this.value;
});
document.getElementById("mesto").addEventListener("input", function() {
    document.getElementById("preview-mesto").textContent = this.value;
});
document.getElementById("contact-number").addEventListener("input", function() {
    document.getElementById("preview-contact-number").textContent = this.value;
});
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
document.getElementById("bank").addEventListener("input", function() {
    document.getElementById("preview-bank").textContent = this.value;
});
document.getElementById("iban").addEventListener("input", function() {
    document.getElementById("preview-iban").textContent = this.value;
});
document.getElementById("swift").addEventListener("input", function() {
    document.getElementById("preview-swift").textContent = this.value;
});
document.getElementById("order").addEventListener("input", function() {
    document.getElementById("preview-order").textContent = this.value;
});


/* <!--    SEKCIA KDE SA NASTAVUJE **DATUM DODANIA** - **DATUM VYSTAVENIA** - **DATUM SPLATNOSTI** --> */

// Získanie aktuálneho dátumu
const currentDate = new Date();

// Funkcia na vytvorenie možností
function populateDropdown(dropdownId, options) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = ""; // Vyčisti predchádzajúce hodnoty
    options.forEach(option => {
        const div = document.createElement("div");
        div.textContent = option;
        div.addEventListener("click", function () {
            document.getElementById(`selected-${dropdownId.split('-')[0]}`).textContent = option;
            dropdown.style.display = "none"; // Skry dropdown
        });
        dropdown.appendChild(div);
    });
}

// Otvorenie dropdownu
function openDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

// Generovanie možností pre deň, mesiac a rok pre všetky sekcie
document.querySelectorAll("[id^='day-select']").forEach(element => {
    element.addEventListener("click", function () {
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1); // Generovanie dní
        const dropdownId = `${element.id}-dropdown`;
        populateDropdown(dropdownId, days);
        openDropdown(dropdownId);
    });
});

document.querySelectorAll("[id^='month-select']").forEach(element => {
    element.addEventListener("click", function () {
        const months = ["Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júl", "August", "September", "Október", "November", "December"];
        const dropdownId = `${element.id}-dropdown`;
        populateDropdown(dropdownId, months);
        openDropdown(dropdownId);
    });
});

document.querySelectorAll("[id^='year-select']").forEach(element => {
    element.addEventListener("click", function () {
        const years = Array.from({ length: 10 }, (_, i) => currentDate.getFullYear() + i); // Použitie aktuálneho roku
        const dropdownId = `${element.id}-dropdown`;
        populateDropdown(dropdownId, years);
        openDropdown(dropdownId);
    });
});


// Event listener pre dátum dodania
document.getElementById("day-select-dodanie").addEventListener("change", updateDodanieDatum);
document.getElementById("month-select-dodanie").addEventListener("change", updateDodanieDatum);
document.getElementById("year-select-dodanie").addEventListener("change", updateDodanieDatum);

// Event listener pre dátum vystavenia
document.getElementById("day-select-vystavenia").addEventListener("change", updateVystaveniaDatum);
document.getElementById("month-select-vystavenia").addEventListener("change", updateVystaveniaDatum);
document.getElementById("year-select-vystavenia").addEventListener("change", updateVystaveniaDatum);

// Event listener pre dátum splatnosti
document.getElementById("day-select-splatnost").addEventListener("change", updateSplatnostDatum);
document.getElementById("month-select-splatnost").addEventListener("change", updateSplatnostDatum);
document.getElementById("year-select-splatnost").addEventListener("change", updateSplatnostDatum);


// Funkcia na aktualizáciu dátumu dodania v náhľade A4
function updateDodanieDatum() {
    const day = document.getElementById("day-select-dodanie").value;
    const monthIndex = document.getElementById("month-select-dodanie").value;
    const year = document.getElementById("year-select-dodanie").value;

    // Mesiace pre zobrazenie - indexujeme od 1
    const months = ["Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júl", "August", "September", "Október", "November", "December"];
    const month = monthIndex ? months[monthIndex - 1] : "";

    if (day && month && year) {
        // Nastavenie dátumu do náhľadu A4
        document.getElementById("preview-dodanie-datum").textContent = `Dátum dodania: ${day}. ${month} ${year}`;
    } else {
        document.getElementById("preview-dodanie-datum").textContent = ""; // Vyčisti, ak nie je dátum zvolený

    }
}

function updateVystaveniaDatum() {
    const day = document.getElementById("day-select-vystavenia").value;
    const monthIndex = document.getElementById("month-select-vystavenia").value;
    const year = document.getElementById("year-select-vystavenia").value;

    // Mesiace pre zobrazenie - indexujeme od 1
    const months = ["Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júl", "August", "September", "Október", "November", "December"];
    const month = monthIndex ? months[monthIndex - 1] : "";

    if (day && month && year) {
        // Nastavenie dátumu do náhľadu A4
        document.getElementById("preview-vystavenia-datum").textContent = `Dátum vystavenia: ${day}. ${month} ${year}`;
    } else {
        document.getElementById("preview-vystavenia-datum").textContent = "";
    }
}

function updateSplatnostDatum() {
    const day = document.getElementById("day-select-splatnost").value;
    const monthIndex = document.getElementById("month-select-splatnost").value;
    const year = document.getElementById("year-select-splatnost").value;

    // Mesiace pre zobrazenie - indexujeme od 1
    const months = ["Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júl", "August", "September", "Október", "November", "December"];
    const month = monthIndex ? months[monthIndex - 1] : "";

    if (day && month && year) {
        // Nastavenie dátumu do náhľadu A4
        document.getElementById("preview-splatnost-datum").textContent = `Dátum splatnosti: ${day}. ${month} ${year}`;
    } else {
        document.getElementById("preview-splatnost-datum").textContent = "";
    }
}

