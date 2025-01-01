document.getElementById('generate-pdf').addEventListener('click', function() {
    const { jsPDF } = window.jspdf;

    // Vytvorenie nového dokumentu PDF
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginTop = 30; // Nastavenie horného marginu

    // Získanie dynamických hodnôt z HTML
    const paymentText = document.getElementById("uhrada-faktury").textContent;
    const bank = document.getElementById("bank").value;
    const iban = document.getElementById("iban").value;
    const swift = document.getElementById("swift").value;   
    const order = document.getElementById("order").value;
    const amount = document.getElementById("preview-final-sum").textContent.replace(' EUR', '');
    const dueDateDodania = document.getElementById("preview-dodanie-datum").textContent;
    const dueDateVystavenia = document.getElementById("preview-vystavenia-datum").textContent;
    const dueDateSplatnost = document.getElementById("preview-splatnost-datum").textContent;
    const invoiceNumber = document.getElementById("faktura-title-number").textContent;

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

    // Pridanie neviditeľného marginu
    let currentY = marginTop; // Nastavenie počiatočnej vertikálnej pozície

    doc.setFontSize(30);
    doc.setFont("helvetica", "bold");
    doc.text("Faktúra", pageWidth - 20, currentY, { align: 'right' });
    currentY += 10;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`${invoiceNumber}`, pageWidth - 20, 35, { align: 'right' });
    currentY += 10;

    function DodavatelSection(doc, x, y, data) {
        doc.setFont("helvetica", "bold");
        doc.text("Dodávatel", x, y);
        y += 10;
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(data.supplier.name, x, y);
        y += 10;
        doc.text(`${data.supplier.ico}`, x, y);
        y += 10;
        doc.text(`${data.supplier.psc}`, x, y);
        doc.text(`${data.supplier.city}`, x + 10, y);
        y += 10;
        doc.text(`${data.supplier.phone}`, x, y);
        return y + 10; // Vráti novú vertikálnu pozíciu
    }
    
      // Funkcia na vykreslenie sekcie "Odberateľ"
      function OdberatelSection(doc, x, y, data) {
        doc.setFont("helvetica", "bold");
        doc.text("Odberatel", x, y);
        y += 10;
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(data.customer.name, x, y);
        y += 10;
        doc.text(`${data.customer.ico}`, x, y);
        y += 10;
        doc.text(`${data.customer.bankAccount}`, x, y);
        y += 10;
        doc.text(`${data.customer.phone}`, x, y);
        return y + 10; // Vráti novú vertikálnu pozíciu
    }

    // Vykreslenie sekcií "Dodávateľ" a "Odberateľ"
    currentY = DodavatelSection(doc, 20, currentY, data);
    currentY = OdberatelSection(doc, pageWidth - 120, currentY - 50, data); // Posunúť "Odberateľ" sekciu späť na pôvodnú pozíciu
    currentY += 10;

    doc.setFont("helvetica", "bold");
    doc.text("Popis položiek", 20, currentY);
    doc.text("Suma", pageWidth - 20, currentY, { align: 'right' });
    doc.setFont("helvetica", "normal");
    doc.text("-------------------------------------------------------------------------------------------------------------------------", 20, currentY + 5);
    currentY += 10;

    // Pridanie položiek faktúry
    const invoiceItems = document.querySelectorAll('.preview-item-row');
    invoiceItems.forEach(item => {
        const itemName = item.querySelector('.preview-item-description').textContent;
        const itemTotal = item.querySelector('.preview-item-amount').textContent;

        doc.text(itemName, 20, currentY);
        doc.text(itemTotal, pageWidth - 20, currentY, { align: 'right' });
        currentY += 10;
    });

    // Pridanie modrého divu
    const divX = 20;
    const divY = currentY;
    const divWidth = 170;
    const divHeight = 20;

    doc.setFillColor(5, 160, 221); // Nastavenie farby pozadia
    doc.rect(divX, divY, divWidth, divHeight, 'F'); // Vytvorenie obdĺžnika s farbou pozadia

    doc.setTextColor(255, 255, 255); // Nastavenie farby textu na bielu
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Celková suma na uhradenie", divX + 7, divY + 12); // Pridanie textu do obdĺžnika
    doc.text(`${amount}`, divX + 145, divY + 12,);

    currentY += divHeight + 10; // Posunutie currentY pod modrý div
    
    doc.setTextColor(0, 0, 0); // Nastavenie farby textu na bielu
    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.text("Bankové údaje", 20, currentY);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`${bank}`, 20, currentY + 10);
    doc.text(`${iban}`, 20, currentY + 20);
    doc.text(`${swift}`, 20, currentY + 30);
    doc.text(`${order}`, 20, currentY + 40);

    // Pridanie textu s rôznymi štýlmi
    const paymentTextParts = paymentText.split(':');
    doc.setFont("helvetica", "bold");
    doc.text(paymentTextParts[0] + ':', 20, currentY + 50);
    doc.setFont("helvetica", "normal");
    doc.text(paymentTextParts[1], 51, currentY + 50);

    doc.text("Datum dodania", 155, currentY);
    doc.text(`${dueDateDodania}`, 155, currentY + 5);
    doc.text("Datum vystavenia", 155, currentY + 20);
    doc.text(`${dueDateVystavenia}`, 155, currentY + 25);
    doc.text("Splatnost", 155, currentY + 40);
    doc.text(`${dueDateSplatnost}`, 155, currentY + 45);

    // Pridanie QR kódu do PDF iba ak nie je platba hotovosťou
    if (!paymentText.includes("Hotovosťou")) {
        // Získanie QR kódu z canvas elementu
        const qrCanvas = document.getElementById("qrcode");
        const qrDataUrl = qrCanvas.toDataURL("image/png");

        // Pridanie QR kódu do PDF
        doc.addImage(qrDataUrl, 'PNG', 95, currentY - 7, 50, 50);
    }

    // Uloženie PDF
    doc.save('faktura.pdf');
});