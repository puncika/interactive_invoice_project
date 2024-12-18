document.getElementById('generate-pdf').addEventListener('click', function() {
    const paymentData = {
        IBAN: document.getElementById("iban").value,
        Amount: "100.00",
        Currency: "EUR",
        VariableSymbol: document.getElementById("order").value,
        ConstantSymbol: "123",
        SpecificSymbol: "456",
        DueDate: new Date('2024-12-16'),
        Reference: "",
        Message: "Ďakujeme za obchod!"
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

    const qrCanvas = document.createElement('canvas');
    QRCode.toCanvas(qrCanvas, qrString, function(error) {
        if (error) console.error(error);
        else {
            if (window.jspdf && window.jspdf.jsPDF) {
                const doc = new window.jspdf.jsPDF();

                // Pridanie textu do PDF
                doc.setFontSize(12);
                doc.text('Faktúra', 14, 20);
                doc.setFontSize(10);
                doc.text('20240001', 14, 26);
                doc.text('Dodávateľ', 14, 35);
                doc.text('Vaše meno', 14, 45);
                doc.text('Vaša adresa', 14, 50);
                doc.text('Vaše IČO', 14, 55);

                // Pridanie QR kódu do PDF
                doc.addImage(qrCanvas.toDataURL("image/png"), 'PNG', 14, 70, 50, 50);

                // Uloženie PDF
                doc.save('faktura.pdf');
            } else {
                console.error('jsPDF knižnica nebola načítaná správne.');
            }
        }
    });
});