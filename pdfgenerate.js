document.getElementById('generate-pdf').addEventListener('click', function() {
    if (window.jspdf && window.jspdf.jsPDF) {
        const doc = new window.jspdf.jsPDF();
        doc.text('Dodávateľ', 10, 10);
        doc.save('faktura.pdf');
    } else {
        console.error('jsPDF knižnica nebola načítaná správne.');
    }
});