
function saveInvoiceItems() {
    const invoiceItems = [];
    document.querySelectorAll('.invoice-row').forEach(item => {
        const itemNameInput = item.querySelector('.item-name-input');
        const itemTotalInput = item.querySelector('.item-total-input, .item-total-input-only');
        const currencySymbol = item.querySelector('.currency-symbol');
        const currencySymbolOnly = item.querySelector('.currency-symbol-only');

        if (itemNameInput && itemTotalInput) {
            invoiceItems.push({
                name: itemNameInput.value.trim(),
                total: itemTotalInput.value.trim(),
                hasCurrencySymbol: !!currencySymbol,
                hasCurrencySymbolOnly: !!currencySymbolOnly,
                // Pridajte informáciu o type inputu
                inputType: itemTotalInput.classList.contains('item-total-input-only') ? 'only' : 'default'
            });
        }
    });
    console.log("Ukladám do localStorage:", invoiceItems);
    localStorage.setItem('invoiceItems', JSON.stringify(invoiceItems));
}

function addInvoiceItemRow(name = '', total = '', hasCurrencySymbol = false, hasCurrencySymbolOnly = false) {
    const invoiceItemSection = document.querySelector(".invoice-item-section");
    const newRow = document.createElement("div");
    newRow.classList.add("invoice-row");

    newRow.innerHTML = `
        <div class="item-name">
            <input type="text" class="item-name-input" name="item-name" placeholder="Popis položky" value="${name}">
        </div>
        <div class="item-total">
            <input type="text" class="${hasCurrencySymbolOnly ? 'item-total-input-only' : 'item-total-input'}" name="item-total" placeholder="0 €" value="${total}">
        </div>
        <button class="remove-item-button"><strong>—</strong></button>
    `;

    invoiceItemSection.insertBefore(newRow, document.querySelector(".total-row"));

    const newItemTotalInput = newRow.querySelector('.item-total-input');
    const newItemNameInput = newRow.querySelector('.item-name-input');
    attachInputEventListeners(newItemTotalInput);
    attachInputEventListeners(newItemNameInput);

        // Pridanie symbolov meny ak sú uložené
        if (hasCurrencySymbol) {
            const itemTotalDiv = newRow.querySelector('.item-total');
            const currencySymbol = document.createElement('span');
            currencySymbol.classList.add('currency-symbol');
            currencySymbol.textContent = '€';
            itemTotalDiv.appendChild(currencySymbol);
        }
        if (hasCurrencySymbolOnly) {
            const itemTotalDivOnly = newRow.querySelector('.item-total');
            const currencySymbolOnly = document.createElement('span');
            currencySymbolOnly.classList.add('currency-symbol-only');
            currencySymbolOnly.textContent = '€';
            itemTotalDivOnly.appendChild(currencySymbolOnly);
        }
    
    // Uloženie položiek do localStorage
    saveInvoiceItems();

    const removeButton = newRow.querySelector('.remove-item-button');
    removeButton.addEventListener("click", function() {
        newRow.remove();
        saveInvoiceItems(); // Uloženie položiek do localStorage po odstránení
        updateTotalSum(); // Aktualizácia celkovej sumy
        updateInvoicePreview(); // Aktualizácia náhľadu faktúry
        updateAddButtonVisibility(); // Aktualizácia viditeľnosti tlačidla pre pridanie položky
        updateMoveContainerPosition(); // Aktualizácia pozície kontajnera po odstránení položky
        updateMoveContainerPositionA4();
    });

    // Presunieme tlačidlo pre pridanie položky pod nový riadok
    const addButtonContainer = document.querySelector(".add-item-button");
    invoiceItemSection.insertBefore(addButtonContainer, document.querySelector(".total-row"));

    // Upravíme logiku na kontrolu viditeľnosti tlačidla
    updateAddButtonVisibility();
    // Pridanie logiky na posunutie náhľadu celkovej sumy
    updateMoveContainerPosition();
    updateMoveContainerPositionA4();
}

    function updateMoveContainerPosition() {
        const items = document.querySelectorAll('.invoice-row');
        const moveContainer = document.getElementById('move-container-blue');
        
        // Predpokladajme, že každá položka pridáva 35 pixelov posunu
        const additionalMargin = items.length * 35; // 35px na každú položku
        
        // Nastavenie nového margin-top pre kontajner
        moveContainer.style.marginTop = `${additionalMargin}px`;
    }

    function updateMoveContainerPositionA4() {
        const items = document.querySelectorAll('.invoice-row');
        const moveContainer = document.getElementById('a4-preview');
        
        // Predpokladajme, že každá položka pridáva 60 pixelov posunu
        const additionalMargin = items.length * 60; // 60px na každú položku
        
        // Detekcia šírky obrazovky pre mobilné zariadenia (typicky menej ako 768px)
        if (window.innerWidth < 768) { 
            moveContainer.style.marginTop = `${additionalMargin}px`;
        } else {
            // Ak chcete, aby sa na iných zariadeniach nič nestalo, alebo nastavte iný margin
            moveContainer.style.marginTop = "0px"; // Prípadne iný defaultný margin
        }
    }

    function updateAddButtonVisibility() {
        const rows = document.querySelectorAll(".invoice-row");
        const addButtonContainer = document.querySelector(".add-item-button");

        if (rows.length >= 5) {
            addButtonContainer.style.display = "none";
        } else {
            addButtonContainer.style.display = "block";
        }
    }


function attachInputEventListeners(input) {
    input.addEventListener("focus", function () {
        if (this.value === "0 €") {
            this.value = "";
        }
    });

    input.addEventListener("blur", function () {
        if (this.value === "" && (this.classList.contains('item-total-input') || this.classList.contains('item-total-input-only'))) {
            this.value = "0 €";
        } else if (this.classList.contains('item-total-input')) {
            formatCurrency(this);
        } else if (this.classList.contains('item-total-input-only')) {
            formatCurrencyOnly(this);
        }
    });

    input.addEventListener("input", function (e) {
        if (this.classList.contains('item-total-input')) {
            const cleanValue = this.value.replace(/[^\d]/g, "");
            this.value = cleanValue;
            formatCurrency(this);
        }
        if (this.classList.contains('item-total-input-only')) {
            const cleanValue = this.value.replace(/[^\d]/g, "");
            this.value = cleanValue;
            formatCurrencyOnly(this);
        }
        updateTotalSum();
        saveInvoiceItems();
    });
}

function formatCurrency(input) {
    let value = input.value.replace(/[^\d]/g, "");
    if (value) {
        value = parseInt(value).toLocaleString("sk-SK");
    }
    input.value = value;

    const itemTotalDiv = input.parentElement;
    let currencySymbol = itemTotalDiv.querySelector(".currency-symbol");
    if (!currencySymbol && input.classList.contains('item-total-input')) {
        currencySymbol = document.createElement("span");
        currencySymbol.classList.add("currency-symbol");
        currencySymbol.textContent = "€";
        itemTotalDiv.appendChild(currencySymbol);
    }
}

function formatCurrencyOnly(input) {
    let value = input.value.replace(/[^\d]/g, "");
    if (value) {
        value = parseInt(value).toLocaleString("sk-SK");
    }
    input.value = value;

    const itemTotalDiv = input.parentElement;
    let currencySymbolOnly = itemTotalDiv.querySelector(".currency-symbol-only");
    if (!currencySymbolOnly && input.classList.contains('item-total-input-only')) {
        currencySymbolOnly = document.createElement("span");
        currencySymbolOnly.classList.add("currency-symbol-only");
        currencySymbolOnly.textContent = "€";
        itemTotalDiv.appendChild(currencySymbolOnly);
    }
}

function updateTotalSum() {
    let totalSum = 0;
    const itemTotalInputs = document.querySelectorAll('input[name="item-total"]');
    itemTotalInputs.forEach(input => {
        let value = parseFloat(input.value.replace(/[^\d,]/g, "").replace(",", "."));
        if (!isNaN(value)) {
            totalSum += value;
        }
    });

    let formattedSum = totalSum.toLocaleString("sk-SK", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById("total-sum").textContent = `${formattedSum} €`;

    // Aktualizácia náhľadu
    updateInvoicePreview();
}

function updateInvoicePreview() {
    const previewContainer = document.getElementById("invoice-preview-items");
    previewContainer.innerHTML = "";
    
    const invoiceItems = document.querySelectorAll('.invoice-row');
    invoiceItems.forEach(item => {
        const itemName = item.querySelector('.item-name input').value.trim() || ''; // Ak je hodnota prázdna alebo iba medzery, použije sa prázdny string
        const itemTotal = item.querySelector('.item-total input').value || '0 €';

        const previewRow = document.createElement('div');
        previewRow.classList.add('preview-item-row');

        const description = document.createElement('p');
        description.classList.add('preview-item-description');
        description.textContent = itemName;

        const amount = document.createElement('p');
        amount.classList.add('preview-item-amount');
        amount.textContent = itemTotal;

        previewRow.appendChild(description);
        previewRow.appendChild(amount);

        previewContainer.appendChild(previewRow);
    });

    // Aktualizácia celkovej sumy v náhľade
    const totalSum = document.getElementById("total-sum").textContent;
    document.getElementById("preview-final-sum").textContent = totalSum;
}

// Inicializácia pri načítaní stránky
document.addEventListener("DOMContentLoaded", function() {
    const savedItems = JSON.parse(localStorage.getItem('invoiceItems')) || [];
    console.log("Načítavam z localStorage:", savedItems);
    savedItems.forEach(item => {
        const inputClass = item.inputType === 'only' ? 'item-total-input-only' : 'item-total-input';
        addInvoiceItemRow(item.name, item.total, item.hasCurrencySymbol, item.hasCurrencySymbolOnly);
    });
    
    // TOTO JE REALTIME NASTAVENIA NA INPUTY CLASS ABY SA TO ZOBRAZOVALO V PREVIEW REALTIME KED PISES DO DESCRIPTION POLOZIEK
    const itemTotalInputs = document.querySelectorAll('.item-total-input, .item-total-input-only, .item-name-input, .item-name-input-only');
    itemTotalInputs.forEach(input => {
        attachInputEventListeners(input);
    });
    updateTotalSum(); // Počiatočná aktualizácia pri načítaní stránky

    // Event listener na tlačidlo na pridanie položky
    document.getElementById("add-item-button").addEventListener("click", () => addInvoiceItemRow());
});
    