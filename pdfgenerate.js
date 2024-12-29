document.getElementById('generate-pdf').addEventListener('click', function() {
    const { jsPDF } = window.jspdf;

    // Vytvorenie nového dokumentu PDF
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Získanie dynamických hodnôt z HTML
    const paymentText = document.getElementById("uhrada-faktury").innerHTML;
    const iban = document.getElementById("iban").value;
    const order = document.getElementById("order").value;
    const amount = document.getElementById("preview-final-sum").textContent.replace(' €', '');
    const dueDate = document.getElementById("preview-splatnost-datum").textContent;

    // Zber údajov
    const data = {
        supplier: {
            name: document.getElementById('company-name').value,
            ico: document.getElementById('ico').value,
            psc: document.getElementById('dodavatel-psc').value,
            city: document.getElementById('dodavatel-mesto').value,
            phone: document.getElementById('contact-number').value
        },
        customer: {
            name: document.getElementById('company-name-other').value,
            ico: document.getElementById('ico-other').value,
            bankAccount: document.getElementById('bank-account-other').value,
            phone: document.getElementById('contact-number-other').value
        }
    };

    // Formátovanie údajov do PDF
    doc.setFontSize(18);
    doc.text("Faktúra", pageWidth / 2, 10, { align: 'center' });

    doc.setFontSize(12);
    doc.text("Dodávateľ", 20, 30);
    doc.text("Odběratel", pageWidth / 2 + 20, 30);

    doc.text(data.supplier.name, 20, 40);
    doc.text(data.customer.name, pageWidth / 2 + 20, 40);

    doc.text(`IBAN: ${iban}`, 20, 50);
    doc.text(`Číslo objednávky: ${order}`, 20, 60);
    doc.text(`Suma: ${amount} EUR`, 20, 70);
    doc.text(`Dátum splatnosti: ${dueDate}`, 20, 80);

    // Získanie QR kódu z canvas elementu
    const qrCanvas = document.getElementById("qrcode");
    const qrDataUrl = qrCanvas.toDataURL("image/png");

    // Pridanie QR kódu do PDF
    doc.addImage(qrDataUrl, 'PNG', 20, 90, 50, 50);

    // Uloženie PDF
    doc.save('faktura.pdf');
});