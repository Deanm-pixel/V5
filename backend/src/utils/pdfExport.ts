import jsPDF from "jspdf";
import "jspdf-autotable";

export async function exportCardsAsPdf(cards) {
  const doc = new jsPDF();
  cards.forEach((card, idx) => {
    doc.text(card.title, 10, 10 + idx * 70);
    doc.text(card.content, 10, 20 + idx * 70);
    if (idx < cards.length - 1) doc.addPage();
  });
  return doc.output("arraybuffer");
}
