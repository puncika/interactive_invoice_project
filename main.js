document.addEventListener('DOMContentLoaded', function() {
    // Získanie aktuálneho dáta
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth() + 1; // Mesiace v JavaScript sú indexované od 0
    const currentYear = currentDate.getFullYear();

    // Nastavenie aktuálneho dňa
    document.getElementById("day-select-dodanie").value = currentDay;
    document.getElementById("day-select-vystavenia").value = currentDay;
    document.getElementById("day-select-splatnost").value = currentDay;

    // Nastavenie aktuálneho roka
    document.getElementById("year-select-dodanie").value = currentYear;
    document.getElementById("year-select-vystavenia").value = currentYear;
    document.getElementById("year-select-splatnost").value = currentYear;


    // Nastavenie mesiacov po naplnení selectov
    document.querySelectorAll("[id^='month-select-splatnost']").forEach(select => {
        const months = ["Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júl", "August", "September", "Október", "November", "December"];
        select.value = months[currentMonth];
    });

    // Volanie funkcie na aktualizáciu náhľadu
    updateDodanieDatum();
    updateVystaveniaDatum();
    updateSplatnostDatum();
});

/*===============================================================================
|         FUNKCIA NA NACITANIE STRANKY + NUMBER CISLA NA FAKTURU                 |
  ===============================================================================*/
  window.onload = function() {
    console.log("Stránka je načítaná!");
    generateInvoiceNumber(); // Zavolá funkciu na generovanie čísla faktúry
    zmenTextNaCislaVSelectoch();


    // Načítanie a nastavenie hodnôt z localStorage
    document.querySelectorAll("[id^='day-select'], [id^='month-select'], [id^='year-select']").forEach(select => {
        const storedValue = localStorage.getItem(select.id);
        if (storedValue) {
            select.value = storedValue;
        }
            // Volanie funkcie na aktualizáciu náhľadu
    updateDodanieDatum();
    updateVystaveniaDatum();
    updateSplatnostDatum();
    });
};

// Funkcia na vytvorenie čísla faktury pre uživatela
function generateInvoiceNumber() {
    const currentYearInvoiceGen = new Date().getFullYear();
    const invoiceNumber = currentYearInvoiceGen + "0001";
    document.getElementById("faktura-title-number").textContent = invoiceNumber;
}

// Mapovanie mesiacov na čísla
const mesiacNaCislo = {
    'Január': '01', 'Február': '02', 'Marec': '03', 'Apríl': '04', 'Máj': '05', 'Jún': '06',
    'Júl': '07', 'August': '08', 'September': '09', 'Október': '10', 'November': '11', 'December': '12'
};

// Funkcia na zmenu textových mesiacov na čísla v selectoch
function zmenTextNaCislaVSelectoch() {
    const selecty = ['month-select-dodanie', 'month-select-vystavenia', 'month-select-splatnost'];
    selecty.forEach(id => {
        const select = document.getElementById(id);
        if (select) {
            const selectedValue = select.value;

            // Vymažte možnosti selectu
            while (select.options.length > 0) {
                select.remove(0);
            }

            // Pridajte späť možnosti
            if (window.innerWidth < 768) { // Ak je obrazovka menšia
                for (let mesiac in mesiacNaCislo) {
                    let option = document.createElement("option");
                    option.text = mesiacNaCislo[mesiac]; // Číslo mesiaca namiesto textu
                    option.value = mesiacNaCislo[mesiac]; // Hodnota je tiež číslo
                    select.add(option);
                }
            } else { // Ak je obrazovka väčšia
                for (let mesiac in mesiacNaCislo) {
                    let option = document.createElement("option");
                    option.text = mesiac; // Pôvodný textový mesiac
                    option.value = mesiacNaCislo[mesiac]; // Hodnota zostáva číslo
                    select.add(option);
                }
            }

            // Obnovte pôvodne zvolenú hodnotu, ak je dostupná
            if (selectedValue) {
                select.value = selectedValue;
            }
        }
    });
}

// Pridajte poslucháč na zmenu veľkosti okna
window.addEventListener('resize', zmenTextNaCislaVSelectoch);





/*===============================================================================
|  SEKCIA KDE SA NASTAVUJE **DATUM DODANIA** - **DATUM VYSTAVENIA** - **DATUM SPLATNOSTI ** |
  ===============================================================================*/
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
// DEŇ
document.querySelectorAll("[id^='day-select']").forEach(element => {
    element.addEventListener("click", function () {
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1); // Generovanie dní
        const dropdownId = `${element.id}-dropdown`;
        populateDropdown(dropdownId, days);
        openDropdown(dropdownId);
    });
});
// MESIAC
document.querySelectorAll("[id^='month-select']").forEach(element => {
    element.addEventListener("click", function () {
        const months = ["Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júl", "August", "September", "Október", "November", "December"];
        const dropdownId = `${element.id}-dropdown`;
        populateDropdown(dropdownId, months);
        openDropdown(dropdownId);
    });
});
// ROK
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

// DÁTUM DODANIA
function updateDodanieDatum() {
    const day = document.getElementById("day-select-dodanie").value;
    const monthIndex = document.getElementById("month-select-dodanie").value;
    const year = document.getElementById("year-select-dodanie").value;

    // Mesiace pre zobrazenie - indexujeme od 1
    const months = ["Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júl", "August", "September", "Október", "November", "December"];
    const month = monthIndex ? months[monthIndex - 1] : "";

    if (day && month && year) {
        // Nastavenie dátumu do náhľadu A4
        document.getElementById("preview-dodanie-datum").textContent = `${day}. ${month} ${year}`;
/*     } else {
        document.getElementById("preview-dodanie-datum").textContent = ""; // Vyčisti, ak nie je dátum zvolený
 */
    }
}


// DATUM VYSTAVENIA
function updateVystaveniaDatum() {
    const day = document.getElementById("day-select-vystavenia").value;
    const monthIndex = document.getElementById("month-select-vystavenia").value;
    const year = document.getElementById("year-select-vystavenia").value;

    // Mesiace pre zobrazenie - indexujeme od 1
    const months = ["Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júl", "August", "September", "Október", "November", "December"];
    const month = monthIndex ? months[monthIndex - 1] : "";

    if (day && month && year) {
        // Nastavenie dátumu do náhľadu A4
        document.getElementById("preview-vystavenia-datum").textContent = `${day}. ${month} ${year}`;
    } else {
        document.getElementById("preview-vystavenia-datum").textContent = "";
    }
}


// SPLATNOŠŤ
function updateSplatnostDatum() {
    const day = document.getElementById("day-select-splatnost").value;
    const monthIndex = document.getElementById("month-select-splatnost").value;
    const year = document.getElementById("year-select-splatnost").value;

    // Mesiace pre zobrazenie - indexujeme od 1
    const months = ["Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júl", "August", "September", "Október", "November", "December"];
    const month = monthIndex ? months[monthIndex - 1] : "";

    if (day && month && year) {
        // Nastavenie dátumu do náhľadu A4
        document.getElementById("preview-splatnost-datum").textContent = `${day}. ${month} ${year}`;
    } else {
        document.getElementById("preview-splatnost-datum").textContent = "";
    }
}

function saveToLocalStorage(selectId, value) {
    localStorage.setItem(selectId, value);
}

document.querySelectorAll("[id^='day-select'], [id^='month-select'], [id^='year-select']").forEach(select => {
    select.addEventListener("change", function() {
        saveToLocalStorage(this.id, this.value);
        // Tu môžete zavolať vašu pôvodnú funkciu na aktualizáciu náhľadu
        // napríklad: updateDodanieDatum(), updateVystaveniaDatum() alebo updateSplatnostDatum()
    });
});

