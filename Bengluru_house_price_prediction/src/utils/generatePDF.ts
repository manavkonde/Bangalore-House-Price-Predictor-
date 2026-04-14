import jsPDF from "jspdf";

export interface PredictionPDFData {
  price: number;
  city?: string;
  location: string;
  sqft: number;
  bhk: number;
  bath: number;
  confidence?: "HIGH" | "MEDIUM" | "LOW";
  priceRange?: { min: number; max: number; median: number };
  dataPoints?: number;
}

function formatPrice(p: number): string {
  if (p >= 100) {
    return `${(p / 100).toFixed(2)} Cr`;
  }
  return `${p.toFixed(2)} L`;
}

function formatPriceINR(p: number): string {
  // p is in Lakhs
  const inr = p * 100000;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(inr);
}

export async function generatePredictionPDF(data: PredictionPDFData): Promise<void> {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // ─── Colors ───
  const navy = [15, 23, 41] as const;   // #0f1729
  const gold = [245, 158, 11] as const;  // #f59e0b
  const white = [255, 255, 255] as const;
  const gray = [107, 114, 128] as const;
  const lightGray = [243, 244, 246] as const;

  // ─── Header Bar ───
  doc.setFillColor(...navy);
  doc.rect(0, 0, pageWidth, 38, "F");

  // Gold accent line
  doc.setFillColor(...gold);
  doc.rect(0, 38, pageWidth, 2, "F");

  // Header text
  doc.setTextColor(...white);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("BangaloreHomes", margin, 18);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("AI-Powered Price Report", margin, 26);

  // Date on right
  doc.setFontSize(9);
  doc.setTextColor(200, 200, 200);
  const dateStr = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  doc.text(`Generated: ${dateStr}`, pageWidth - margin, 26, { align: "right" });

  y = 52;

  // ─── Main Price Section ───
  doc.setFillColor(...lightGray);
  doc.roundedRect(margin, y, contentWidth, 45, 4, 4, "F");

  doc.setTextColor(...gray);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("ESTIMATED PROPERTY PRICE", margin + 10, y + 12);

  doc.setTextColor(...navy);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text(`₹${formatPrice(data.price)}`, margin + 10, y + 30);

  // Confidence badge
  if (data.confidence) {
    const badgeColors: Record<string, [number, number, number]> = {
      HIGH: [34, 197, 94],
      MEDIUM: [245, 158, 11],
      LOW: [239, 68, 68],
    };
    const color = badgeColors[data.confidence] || badgeColors.MEDIUM;
    const badgeX = pageWidth - margin - 40;
    doc.setFillColor(...color);
    doc.roundedRect(badgeX, y + 8, 30, 10, 3, 3, "F");
    doc.setTextColor(...white);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(data.confidence, badgeX + 15, y + 15, { align: "center" });

    doc.setTextColor(...gray);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text("Confidence", badgeX + 15, y + 24, { align: "center" });
  }

  // Full INR value
  doc.setTextColor(...gray);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(formatPriceINR(data.price), margin + 10, y + 38);

  y += 55;

  // ─── Gold Divider ───
  doc.setFillColor(...gold);
  doc.rect(margin, y, contentWidth, 0.5, "F");
  y += 8;

  // ─── Property Details Table ───
  doc.setTextColor(...navy);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Property Details", margin, y);
  y += 8;

  const details = [
    { label: "City", value: data.city ? data.city.charAt(0).toUpperCase() + data.city.slice(1) : "N/A" },
    { label: "Location", value: data.location.charAt(0).toUpperCase() + data.location.slice(1) },
    { label: "Total Area", value: `${data.sqft.toLocaleString()} sq ft` },
    { label: "Configuration", value: `${data.bhk} BHK` },
    { label: "Bathrooms", value: `${data.bath}` },
    { label: "Price per Sq Ft", value: `₹${((data.price * 100000) / data.sqft).toLocaleString("en-IN", { maximumFractionDigits: 0 })}` },
  ];

  details.forEach((item, i) => {
    const rowY = y + i * 12;
    if (i % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, rowY - 4, contentWidth, 12, "F");
    }
    doc.setTextColor(...gray);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(item.label, margin + 5, rowY + 3);
    doc.setTextColor(...navy);
    doc.setFont("helvetica", "bold");
    doc.text(item.value, pageWidth - margin - 5, rowY + 3, { align: "right" });
  });

  y += details.length * 12 + 8;

  // ─── Price Range ───
  if (data.priceRange) {
    doc.setFillColor(...gold);
    doc.rect(margin, y, contentWidth, 0.5, "F");
    y += 8;

    doc.setTextColor(...navy);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Price Range Analysis", margin, y);
    y += 10;

    const rangeItems = [
      { label: "Minimum", value: `₹${formatPrice(data.priceRange.min)}` },
      { label: "Predicted", value: `₹${formatPrice(data.price)}` },
      { label: "Maximum", value: `₹${formatPrice(data.priceRange.max)}` },
    ];

    // Draw range bar
    doc.setFillColor(230, 230, 230);
    doc.roundedRect(margin + 5, y, contentWidth - 10, 8, 2, 2, "F");

    const rangeSpan = data.priceRange.max - data.priceRange.min;
    if (rangeSpan > 0) {
      const predPos = ((data.price - data.priceRange.min) / rangeSpan) * (contentWidth - 10);
      doc.setFillColor(...gold);
      doc.roundedRect(margin + 5, y, predPos, 8, 2, 2, "F");

      // Marker
      doc.setFillColor(...navy);
      doc.circle(margin + 5 + predPos, y + 4, 3, "F");
    }

    y += 14;

    rangeItems.forEach((item, i) => {
      doc.setTextColor(...gray);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(item.label, margin + 5 + i * (contentWidth / 3), y);
      doc.setTextColor(...navy);
      doc.setFont("helvetica", "bold");
      doc.text(item.value, margin + 5 + i * (contentWidth / 3), y + 5);
    });

    y += 14;
  }

  // ─── 5-Year Forecast Table ───
  doc.setFillColor(...gold);
  doc.rect(margin, y, contentWidth, 0.5, "F");
  y += 8;

  doc.setTextColor(...navy);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("5-Year Price Forecast", margin, y);
  y += 4;

  doc.setTextColor(...gray);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Based on 6.5% annual appreciation rate", margin, y + 5);
  y += 10;

  const currentYear = new Date().getFullYear();
  const appreciationRate = 0.065;

  // Table header
  doc.setFillColor(...navy);
  doc.roundedRect(margin, y, contentWidth, 10, 2, 2, "F");
  doc.setTextColor(...white);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Year", margin + 10, y + 7);
  doc.text("Projected Price", margin + 55, y + 7);
  doc.text("Appreciation", margin + 110, y + 7);
  doc.text("Total Growth", pageWidth - margin - 5, y + 7, { align: "right" });
  y += 12;

  for (let i = 1; i <= 5; i++) {
    const futurePrice = data.price * Math.pow(1 + appreciationRate, i);
    const yearGain = futurePrice - data.price;
    const pctGain = ((futurePrice / data.price - 1) * 100).toFixed(1);

    if (i % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y - 4, contentWidth, 10, "F");
    }

    doc.setTextColor(...navy);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`${currentYear + i}`, margin + 10, y + 2);
    doc.setFont("helvetica", "bold");
    doc.text(`₹${formatPrice(futurePrice)}`, margin + 55, y + 2);
    doc.setTextColor(34, 197, 94);
    doc.setFont("helvetica", "normal");
    doc.text(`+₹${formatPrice(yearGain)}`, margin + 110, y + 2);
    doc.text(`+${pctGain}%`, pageWidth - margin - 5, y + 2, { align: "right" });
    y += 10;
  }

  y += 6;

  // ─── Data Points info ───
  if (data.dataPoints) {
    doc.setFillColor(240, 249, 255);
    doc.roundedRect(margin, y, contentWidth, 14, 3, 3, "F");
    doc.setTextColor(30, 64, 175);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(`ℹ  This prediction is based on ${data.dataPoints} comparable data points in the training dataset.`, margin + 5, y + 9);
    y += 20;
  }

  // ─── Footer ───
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setFillColor(...navy);
  doc.rect(0, footerY - 5, pageWidth, 20, "F");
  doc.setFillColor(...gold);
  doc.rect(0, footerY - 5, pageWidth, 1, "F");

  doc.setTextColor(180, 180, 180);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Generated on ${dateStr} | BangaloreHomes Price Predictor | AI-Powered Real Estate Analysis`,
    pageWidth / 2,
    footerY + 5,
    { align: "center" }
  );

  doc.setTextColor(150, 150, 150);
  doc.setFontSize(6);
  doc.text(
    "Disclaimer: This is an estimated price based on machine learning models. Actual prices may vary based on market conditions.",
    pageWidth / 2,
    footerY + 10,
    { align: "center" }
  );

  // Save
  const filename = `BangaloreHomes_Report_${data.location}_${data.bhk}BHK_${dateStr.replace(/\s/g, "_")}.pdf`;
  doc.save(filename);
}
