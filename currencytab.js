function addInvoiceItemRow() {
    const invoiceItemSection = document.querySelector(".invoice-item-section");
    const newRow = document.createElement("div");
    newRow.classList.add("invoice-row");

    newRow.innerHTML = `
        <div class="item-name">
            <input type="text" class="item-name-input" name="item-name" placeholder="Popis položky">
        </div>
        <div class="item-total">
            <input type="text" class="item-total-input" name="item-total" placeholder="0 €">
        </div>
        <button class="remove-item-button"><strong>—</strong></button> <!-- Nové tlačidlo na odstránenie položky -->
    `;

    invoiceItemSection.insertBefore(newRow, document.querySelector(".total-row"));

    const newItemTotalInput = newRow.querySelector('.item-total-input');
    const newItemNameInput = newRow.querySelector('.item-name-input');
    attachInputEventListeners(newItemTotalInput);
    attachInputEventListeners(newItemNameInput);


    // Presunieme tlačidlo pre pridanie položky pod nový riadok
    const addButtonContainer = document.querySelector(".add-item-button");
    invoiceItemSection.insertBefore(addButtonContainer, document.querySelector(".total-row"));

    // Upravíme logiku na kontrolu viditeľnosti tlačidla
    updateAddButtonVisibility();
    // Pridanie logiky na posunutie náhľadu celkovej sumy
    updateMoveContainerPosition();

    function updateMoveContainerPosition() {
        const items = document.querySelectorAll('.invoice-row');
        const moveContainer = document.getElementById('move-container-blue');
        
        // Predpokladajme, že každá položka pridáva 20 pixelov posunu
        const additionalMargin = items.length * 35; // 20px na každú položku
        
        // Nastavenie nového margin-top pre kontajner
        moveContainer.style.marginTop = `${additionalMargin}px`;
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
    
    const removeButton = newRow.querySelector('.remove-item-button');
    removeButton.addEventListener("click", function() {
        newRow.remove(); // Odstránenie daného riadku
        updateTotalSum(); // Aktualizácia celkovej sumy
        updateInvoicePreview(); // Aktualizácia náhľadu faktúry
        updateAddButtonVisibility(); // Aktualizácia viditeľnosti tlačidla pre pridanie položky
        updateMoveContainerPosition(); // Aktualizácia pozície kontajnera po odstránení položky
    });
}

function attachInputEventListeners(input) {
    // Vymazanie placeholderu pri focus
    input.addEventListener("focus", function () {
        if (this.value === "0") {
            this.value = "";
        }
    });

    // Obnovenie placeholderu ak je prázdne pole pri odchode (blur)
    input.addEventListener("blur", function () {
        if (this.value === "" && this.classList.contains('item-total-input', 'item-total-input-only')) {
/*             this.value = "55 €"; */
        } else if (this.classList.contains('item-total-input', 'item-total-input-only')) {
            formatCurrency(this);
        }
    });

    // Realtime update
    input.addEventListener("input", function (e) {
        if (this.classList.contains('item-total-input')) {
            const cleanValue = this.value.replace(/[^\d]/g, "");
            this.value = cleanValue;
            formatCurrency(this);
        }
        updateTotalSum(); // Aktualizácia sumy a náhľadu pri každom vstupe
    });


input.addEventListener("input", function (e) {
    if (this.classList.contains('item-total-input-only')) {
        const cleanValue = this.value.replace(/[^\d]/g, "");
        this.value = cleanValue;
        formatCurrencyOnly(this);
    }
    updateTotalSum(); // Aktualizácia sumy a náhľadu pri každom vstupe
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
    if (!currencySymbol) {
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

    const itemTotalDivOnly = input.parentElement;
    let currencySymbolOnly = itemTotalDivOnly.querySelector(".currency-symbol-only");
    if (!currencySymbolOnly) {
        currencySymbolOnly = document.createElement("span");
        currencySymbolOnly.classList.add("currency-symbol-only");
        currencySymbolOnly.textContent = "€";
        itemTotalDivOnly.appendChild(currencySymbolOnly);
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
    const itemTotalInputs = document.querySelectorAll('.item-total-input, .item-total-input-only, .item-name-input');
    itemTotalInputs.forEach(input => {
        attachInputEventListeners(input);
    });
    updateTotalSum(); // Počiatočná aktualizácia pri načítaní


    // Event listener na tlačidlo na pridanie položky
    document.getElementById("add-item-button").addEventListener("click", addInvoiceItemRow);
});