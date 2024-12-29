const monthMap = {
    "Január": "01",
    "Február": "02",
    "Marec": "03",
    "Apríl": "04",
    "Máj": "05",
    "Jún": "06",
    "Júl": "07",
    "August": "08",
    "September": "09",
    "Október": "10",
    "November": "11",
    "December": "12"
};

function generatePayBySquareString(iban, amount, currency, variableSymbol, constantSymbol, specificSymbol, dueDate, reference, message) {
    // Uistite sa, že symboly sú číselné reťazce
    if (typeof variableSymbol === 'number') variableSymbol = variableSymbol.toString();
    if (typeof constantSymbol === 'number') constantSymbol = constantSymbol.toString();
    if (typeof specificSymbol === 'number') specificSymbol = specificSymbol.toString();

    // Formátovanie symbolov na 10 číslic
    variableSymbol = variableSymbol.padStart(10, '0').slice(-10);

    // Vytvorenie reťazca pre Pay by Square
    let qrString = `SPD*1.0*ACC:${iban}*AM:${amount}*CC:${currency}`;
    if (variableSymbol) qrString += `*X-VS:${variableSymbol}`;
    if (constantSymbol) qrString += `*X-KS:${constantSymbol}`;
    if (specificSymbol) qrString += `*X-SS:${specificSymbol}`;
    if (dueDate) {
        // Kontrola, či dueDate nie je v minulosti
        const now = new Date();
        dueDate = dueDate > now ? dueDate : now;

        // Formátovanie dátumu priamo v reťazci
        const day = dueDate.getDate().toString().padStart(2, '0');
        const month = (dueDate.getMonth() + 1).toString().padStart(2, '0');
        const year = dueDate.getFullYear();
        qrString += `*DT:${year}${month}${day}`; // Formát bez pomlčiek
    }
    if (reference) qrString += `*RF:${reference}`;
    if (message) qrString += `*MSG:${message}`;
    qrString += `*`; // Ukončovací znak

    return qrString;
}

// Príklad použitia s dátumom splatnosti v budúcnosti
function updateQRCode() {
     // Získanie textového obsahu z elementu
     let amountText = document.getElementById("preview-final-sum").textContent;
     let dateText = document.getElementById("preview-splatnost-datum").textContent;

     // Odstránenie nepotrebných znakov a nahradenie čiarky bodkou
     amountText = amountText.replace(/\s/g, '').replace(/&nbsp;/g, '').replace('€', '').replace(',', '.');
     // Konverzia textu na číslo
     const amountString = parseFloat(amountText);
    // Rozdelenie dátumu na deň, mesiac a rok
    const [day, monthName, year] = dateText.split(' ');
    // Konverzia názvu mesiaca na číselnú hodnotu
    const month = monthMap[monthName];
    const dueDate = new Date(`${year}-${month}-${day}`);

    const paymentData = {
        IBAN: document.getElementById("iban").value,
        Amount: amountString, // Suma na zaplatenie
        Currency: "EUR",
        VariableSymbol: document.getElementById("order").value,
        ConstantSymbol: "", // Príklad konštantného symbolu
        SpecificSymbol: "", // Príklad špecifického symbolu
        DueDate: dueDate, // Dátum splatnosti
        Reference: "", // Referencia platiteľa
        Message: "" // Správa pre prijímateľa
};


const qrString = generatePayBySquareString(
    paymentData.IBAN, 
    paymentData.Amount, 
    paymentData.Currency, 
    paymentData.VariableSymbol, 
    paymentData.ConstantSymbol, 
    paymentData.SpecificSymbol, 
    paymentData.DueDate, 
    paymentData.Reference, 
    paymentData.Message
);

console.log('Generated QR String:', qrString);

// QR CODE GENERATION
    QRCode.toCanvas(document.getElementById('qrcode'), qrString, function (error) {
        if (error) console.error(error);
        console.log('QR kód generovaný úspešne!');
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("iban").addEventListener("input", updateQRCode); 
    document.getElementById("order").addEventListener("input", updateQRCode);
    // Pridanie event listener pre zmenu sumy
    const observer = new MutationObserver(updateQRCode);
    observer.observe(document.getElementById("preview-final-sum"), { childList: true, subtree: true, characterData: true });
    // Dynamicke načitavania QR kódu pre Splatnosť dátumu
    observer.observe(document.getElementById("preview-splatnost-datum"), { childList: true, subtree: true, characterData: true });
    updateQRCode(); // Prvotné generovanie QR kódu - volanie funkcie updateQRCode
});

