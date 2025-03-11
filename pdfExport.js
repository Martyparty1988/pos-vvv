import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
class PDFExporter {
  constructor() {
    this.doc = new jsPDF();
  }
  exportInventory(inventory, options = {}) {
    const { title = 'Stav skladu', fileName = 'sklad.pdf' } = options;
    this.doc.setLanguage('cs');
    this.doc.setFontSize(20);
    this.doc.text(title, 14, 20);
    const headers = [['Název', 'Cena', 'Kategorie']];
    const data = inventory.map(item => [
      item.name,
      `${item.price} ${item.currency}`,
      item.category
    ]);
    this.doc.autoTable({
      head: headers,
      body: data,
      startY: 30,
      styles: { fontSize: 10, cellPadding: 5 },
      headStyles: { fillColor: [66, 139, 202] }
    });
    const date = new Date().toLocaleString('cs-CZ');
    this.doc.setFontSize(10);
    this.doc.text(`Exportováno: ${date}`, 14, this.doc.lastAutoTable.finalY + 10);
    this.doc.save(fileName);
  }
}
export { PDFExporter };