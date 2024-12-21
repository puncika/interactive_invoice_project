/* TU SA UPRAVUJE PRIDAT POLOZKU PLUSKO SYMBOL ZELENE */

let itemCounter = 1; // Počítadlo položiek - už existuje prvá položka, preto začíname od 1

// Funkcia na pridanie novej položky
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
    `;
    invoiceItemSection.insertBefore(newRow, document.querySelector(".total-row"));

    // Vyber nový input
    const newItemTotalInput = newRow.querySelector('.item-total-input');

    // Pridať správanie pre nový input, podobne ako pre pôvodné inputy
    attachInputEventListeners(newItemTotalInput);

    // Presunúť tlačidlo pod nový riadok
    const addButtonContainer = document.querySelector(".add-item-button");
    invoiceItemSection.insertBefore(addButtonContainer, document.querySelector(".total-row"));
    
    // Skontrolovať počet riadkov po pridaní nového riadku
    if (document.querySelectorAll(".invoice-row").length >= 5) {
        document.querySelector(".add-item-button").style.display = "none";
    }
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


// Pridať event listenery na pôvodné inputy pri načítaní dokumentu
document.addEventListener("DOMContentLoaded", function () {
    const itemTotalInputs = document.querySelectorAll('input[name="item-total"]');
    itemTotalInputs.forEach(input => {
        attachInputEventListeners(input);
    });
});


/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
// Funkcia na aktualizáciu A4 preview pre položky faktúry
function updateInvoicePreview() {
    const previewContainer = document.getElementById("invoice-preview-items");
    previewContainer.innerHTML = ""; // Vyčisti predchádzajúce položky
    
    const invoiceItems = document.querySelectorAll('.invoice-row');
    invoiceItems.forEach(item => {
        const itemName = item.querySelector('.item-name input').value;
        const itemTotal = item.querySelector('.item-total input').value;

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