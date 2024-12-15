function generatePayBySquareString(iban, amount, currency, variableSymbol) { // BAD VARIABLESMYBOL
    // Uistite sa, že variableSymbol je číselný reťazec
    if (typeof variableSymbol === 'number') {
        variableSymbol = variableSymbol.toString();
    }
    return `SPD*1.0*ACC:${iban}*AM:${amount}*CC:${currency}*VS:${variableSymbol}`;
}

const paymentData = {
    IBAN: "SK4111000000002930271893",
    Amount: "100.00",
    Currency: "EUR",
    VariableSymbol: "123456" // Použite váš variabilný symbol
};

const qrString = generatePayBySquareString(paymentData.IBAN, paymentData.Amount, paymentData.Currency, paymentData.VariableSymbol);

// QR CODE GENERATION (predpokladáme, že máte knižnicu ako qrcode-generator.js)
document.addEventListener('DOMContentLoaded', function() {
    QRCode.toCanvas(document.getElementById('qrcode'), qrString, function (error) {
        if (error) console.error(error);
        console.log('QR kód generovaný úspešne!');
    });
});