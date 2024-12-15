function generatePayBySquareString(iban, amount, currency, variableSymbol, constantSymbol, specificSymbol) {
    // Uistite sa, že symboly sú číselné reťazce
    if (typeof variableSymbol === 'number') variableSymbol = variableSymbol.toString();
    if (typeof constantSymbol === 'number') constantSymbol = constantSymbol.toString();
    if (typeof specificSymbol === 'number') specificSymbol = specificSymbol.toString();

    // Formátovanie symbolov na 10 číslic
    variableSymbol = variableSymbol.padStart(10, '0').slice(-10);
    constantSymbol = constantSymbol.padStart(10, '0').slice(-10); // Možno toto je miesto problému, pretože KS môže mať menej číslic
    specificSymbol = specificSymbol.padStart(10, '0').slice(-10); // Rovnako pre SS

    // Vytvorenie reťazca pre Pay by Square
    let qrString = `SPD*1.0*ACC:${iban}*AM:${amount}*CC:${currency}`;
    qrString += `*X-VS:${variableSymbol}`;
    if (constantSymbol) qrString += `*X-KS:${constantSymbol}`; // Pridáme len ak je konštantný symbol poskytnutý
    if (specificSymbol) qrString += `*X-SS:${specificSymbol}`; // Pridáme len ak je špecifický symbol poskytnutý
    qrString += `*`; // Ukončovací znak

    return qrString;
}

// Príklad použitia
const paymentData = {
    IBAN: "SK4111000000002930271893",
    Amount: "100.00",
    Currency: "EUR",
    VariableSymbol: "",
    ConstantSymbol: "", // Príklad konštantného symbolu s menším počtom číslic
    SpecificSymbol: "" // Príklad špecifického symbolu s menším počtom číslic
};

const qrString = generatePayBySquareString(
    paymentData.IBAN, 
    paymentData.Amount, 
    paymentData.Currency, 
    paymentData.VariableSymbol, 
    paymentData.ConstantSymbol, 
    paymentData.SpecificSymbol
);

// QR CODE GENERATION (predpokladáme, že máte knižnicu ako qrcode-generator.js)
document.addEventListener('DOMContentLoaded', function() {
    QRCode.toCanvas(document.getElementById('qrcode'), qrString, function (error) {
        if (error) console.error(error);
        console.log('QR kód generovaný úspešne!');
    });
});