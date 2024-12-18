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
/* function updateQRCode() {
    const paymentData = {
        IBAN: document.getElementById("iban").value,
        Amount: "100.00",
        Currency: "EUR",
        VariableSymbol: document.getElementById("order").value,
        ConstantSymbol: "123", // Príklad konštantného symbolu
        SpecificSymbol: "456", // Príklad špecifického symbolu
        DueDate: new Date('2024-12-16'), // Dátum splatnosti nastavený na 17.12.2024
        Reference: "", // Referencia platiteľa
        Message: "Ďakujeme za obchod!" // Správa pre prijímateľa
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

// QR CODE GENERATION
    QRCode.toCanvas(document.getElementById('qrcode'), qrString, function (error) {
        if (error) console.error(error);
        console.log('QR kód generovaný úspešne!');
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("iban").addEventListener("input", updateQRCode); 
    document.getElementById("order").addEventListener("input", updateQRCode);
    updateQRCode(); // Prvotné generovanie QR kódu - volanie funkcie updateQRCode
}); */