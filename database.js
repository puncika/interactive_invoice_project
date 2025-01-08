// Event listener pre company-name
document.getElementById('company-name').addEventListener('input', function() {
    handleInputChange('company-name', 'suggestions');
});

// Event listener pre company-name-other
document.getElementById('company-name-other').addEventListener('input', function() {
    handleInputChange('company-name-other', 'suggestions-other');
});

// Všeobecná funkcia na spracovanie zmien v inpute
function handleInputChange(inputId, suggestionsId) {
    var searchTerm = document.getElementById(inputId).value;
    var suggestionsList = document.getElementById(suggestionsId);
    
    if (searchTerm.length > 0) {
        suggestionsList.style.display = 'block'; // Zobrazí zoznam návrhov

        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'fetchData.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = function() {
            if (this.status == 200) {
                var data = JSON.parse(this.responseText);
                suggestionsList.innerHTML = '';
                data.forEach(function(item) {
                    var li = document.createElement('li');
                    // Zobrazíme názov firmy, ako aj ďalšie informácie
                    // Predpokladáme, že adresa je vo formáte "Ulica č.psč, Mesto"
                    var addressParts = item.address.split(',');
                    var numberAndCity = addressParts[0].trim();
                    var city = addressParts[1].trim();
                    
                    li.innerHTML = `
                        <strong>${item.business_name}</strong>
                        <span class="address-text">${item.street}, ${numberAndCity} ${city}</span>
                    `;
                    li.addEventListener('click', function() {
                        // Pri kliknutí na návrh vyplníme všetky príslušné inputy
                        fillInputs(item, inputId);
                        suggestionsList.classList.remove('visible'); // Odstránenie triedy 'visible' po výbere
                        suggestionsList.style.display = 'none'; // Skryjeme zoznam návrhov po výbere
                        updatePreview();
                    });
                    suggestionsList.appendChild(li);
                });
                // Pridanie alebo odstránenie triedy 'visible' na základe počtu návrhov
                if (data.length > 0) {
                    suggestionsList.classList.add('visible');
                } else {
                    suggestionsList.classList.remove('visible');
                }
            }
        };
        xhr.send('search=' + encodeURIComponent(searchTerm));
    } else {
        suggestionsList.innerHTML = '';
        suggestionsList.classList.remove('visible');
        suggestionsList.style.display = 'none';
    }
}

// Funkcia na naplnenie inputov podľa toho, ktorý input bol zvolený
function fillInputs(item, inputId) {
    if (inputId === 'company-name') {
        document.getElementById('company-name').value = item.business_name;
        document.getElementById('ico').value = item.ico;
        document.getElementById('dodavatel-psc').value = item.address;
        document.getElementById('dodavatel-mesto').value = item.street;
        document.getElementById('contact-number').value = item.phone;
    } else if (inputId === 'company-name-other') {
        // Tu zadefinuj svoje vlastné inputy pre company-name-other
        document.getElementById('company-name-other').value = item.business_name;
        document.getElementById('ico-other').value = item.ico;
        document.getElementById('bank-account-other').value = item.street;
        document.getElementById('contact-number-other').value = item.phone;
    }
}

// Event listener pre zmenu (keď je input prázdny) pre oba inputy
['company-name', 'company-name-other'].forEach(id => {
    document.getElementById(id).addEventListener('input', function() {
        if (this.value === '') {
            document.getElementById(id === 'company-name' ? 'suggestions' : 'suggestions-other').classList.remove('visible');
            document.getElementById(id === 'company-name' ? 'suggestions' : 'suggestions-other').style.display = 'none';
        }
    });
});

// Event listener na kliknutie mimo inputov
document.addEventListener('click', function(event) {
    var suggestionsList = document.getElementById('suggestions');
    var suggestionsListOther = document.getElementById('suggestions-other');
    var companyNameInput = document.getElementById('company-name');
    var companyNameOtherInput = document.getElementById('company-name-other');
    
    // Skontroluj, či kliknutie nebolo na inputy alebo na zoznamy návrhov
    if (event.target !== companyNameInput && event.target !== companyNameOtherInput && !suggestionsList.contains(event.target) && !suggestionsListOther.contains(event.target)) {
        suggestionsList.classList.remove('visible');
        suggestionsListOther.classList.remove('visible');
        suggestionsList.style.display = 'none';
        suggestionsListOther.style.display = 'none';
    }
});

// Predpokladáme, že máš funkciu updatePreview definovanú inde v kóde
function updatePreview() {
    // Tvoja logika pre aktualizáciu náhľadu
}