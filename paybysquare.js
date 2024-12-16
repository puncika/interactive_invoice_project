function generatePayBySquareString(iban, amount, currency, variableSymbol, constantSymbol, specificSymbol, dueDate, reference, message) {
    // Uistite sa, že symboly sú číselné reťazce
    if (typeof variableSymbol === 'number') variableSymbol = variableSymbol.toString();
    if (typeof constantSymbol === 'number') constantSymbol = constantSymbol.toString();
    if (typeof specificSymbol === 'number') specificSymbol = specificSymbol.toString();

    // Formátovanie symbolov na 10 číslic
    variableSymbol = variableSymbol.padStart(10, '0').slice(-10);
    constantSymbol = constantSymbol;
    specificSymbol = specificSymbol;

    // Formátovanie dátumu splatnosti na YYYY-MM-DD, iba ak je dueDate poskytnuté
    let formattedDueDate = '';
    if (dueDate) {
        const now = new Date();
        dueDate = dueDate > now ? dueDate : now;
        formattedDueDate = dueDate.toISOString().split('T')[0];
    }

    // Vytvorenie reťazca pre Pay by Square
    let qrString = `SPD*1.0*ACC:${iban}*AM:${amount}*CC:${currency}`;
    if (variableSymbol) qrString += `*X-VS:${variableSymbol}`;
    if (constantSymbol) qrString += `*X-KS:${constantSymbol}`;
    if (specificSymbol) qrString += `*X-SS:${specificSymbol}`;
    if (formattedDueDate) qrString += `*DT:${formattedDueDate}`; // Pridáme dátum iba ak je definovaný
    if (reference) qrString += `*RF:${reference}`;
    if (message) qrString += `*MSG:${message}`;
    qrString += `*`; // Ukončovací znak

    return qrString;
}

// Príklad použitia bez dátumu splatnosti
const paymentData = {
    IBAN: "SK4111000000002930271893",
    Amount: "100.00",
    Currency: "EUR",
    VariableSymbol: "123456", // Príklad variabilného symbolu
    ConstantSymbol: "123", // Príklad konštantného symbolu
    SpecificSymbol: "456", // Príklad špecifického symbolu
    DueDate: undefined, // Dátum splatnosti nie je poskytnutý
    Reference: "Platba za služby", // Referencia platiteľa
    Message: "Ďakujeme za obchod!" // Správa pre prijímateľa
};

const qrString = generatePayBySquareString(
    paymentData.IBAN, 
    paymentData.Amount, 
    paymentData.Currency, 
    paymentData.VariableSymbol, 
    paymentData.ConstantSymbol, 
    paymentData.SpecificSymbol, 
    paymentData.DueDate, // undefined
    paymentData.Reference, 
    paymentData.Message
);

// QR CODE GENERATION (predpokladáme, že máte knižnicu ako qrcode-generator.js)
document.addEventListener('DOMContentLoaded', function() {
    QRCode.toCanvas(document.getElementById('qrcode'), qrString, function (error) {
        if (error) console.error(error);
        console.log('QR kód generovaný úspešne!');
    });
});