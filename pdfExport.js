import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

class PDFExporter {
    constructor() {
        this.doc = new jsPDF();
    }

    // Vytvoření PDF z dat skladu
    exportInventory(inventory, options = {}) {
        const {
            title = 'Stav skladu',
            fileName = 'sklad.pdf'
        } = options;

        // Nastavení češtiny
        this.doc.setLanguage('cs');
        
        // Přidání titulku
        this.doc.setFontSize(20);
        this.doc.text(title, 14, 20);
        
        // Příprava dat pro tabulku
        const headers = [['ID', 'Název', 'Cena', 'Množství']];
        const data = inventory.map(item => [
            item.id,
            item.name,
            `${item.price} Kč`,
            item.stock
        ]);

        // Vytvoření tabulky
        this.doc.autoTable({
            head: headers,
            body: data,
            startY: 30,
            styles: {
                fontSize: 10,
                cellPadding: 5
            },
            headStyles: {
                fillColor: [66, 139, 202]
            }
        });

        // Přidání data exportu
        const date = new Date().toLocaleString('cs-CZ');
        this.doc.setFontSize(10);
        this.doc.text(`Exportováno: ${date}`, 14, this.doc.lastAutoTable.finalY + 10);

        // Stažení PDF
        this.doc.save(fileName);
    }
}

export { PDFExporter };