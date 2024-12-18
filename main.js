window.onload = function() {
    console.log("Stránka je načítaná!");
    generateInvoiceNumber(); // Zavolá funkciu na generovanie čísla faktúry
};

// Funkcia na vytvorenie čísla faktury pre uživatela
function generateInvoiceNumber() {
    const currentYearInvoiceGen = new Date().getFullYear();
    const invoiceNumber = currentYearInvoiceGen + "0001";
    document.getElementById("faktura-title-number").textContent = invoiceNumber;
}


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



