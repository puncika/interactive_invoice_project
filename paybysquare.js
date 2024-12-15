function generatePayBySquareString(iban, amount, currency, variableSymbol) {
    // Uistite sa, že variableSymbol je číselný reťazec a má maximálne 10 znakov
    if (typeof variableSymbol === 'number') {
        variableSymbol = variableSymbol.toString();
    } else if (typeof variableSymbol !== 'string') {
        throw new Error('Variable symbol must be a string or number.');
    }
    variableSymbol = variableSymbol.padStart(10, '0').slice(-10); // Zabezpečí, že symbol má 10 číslic, doplní nulami a orezáva na 10 znakov

    return `SPD*1.0*ACC:${iban}*AM:${amount}*CC:${currency}*X-VS:${variableSymbol}*`;
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