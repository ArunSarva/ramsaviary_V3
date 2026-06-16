import * as XLSX from "xlsx";
import { AppData, BirdTransaction, FeedTransaction } from "./types";

export function parseExcelData(buffer: ArrayBuffer): AppData {
  const wb = XLSX.read(buffer, { type: "array", cellDates: true });

  // Parse Birds sheet
  const birdsSheet = wb.Sheets["Birds"];
  const birdsRaw = XLSX.utils.sheet_to_json(birdsSheet, {
    header: 1,
    defval: "",
  }) as any[][];

  const birds: BirdTransaction[] = [];
  // Data starts at row index 14 (row 15 in Excel, 0-indexed = 14)
  for (let i = 14; i < birdsRaw.length; i++) {
    const row = birdsRaw[i];
    if (!row[2] && !row[3]) continue; // skip empty rows
    const slNo = row[0] || birds.length + 1;
    const rawDate = row[1];
    let date = "";
    if (rawDate instanceof Date) {
      date = rawDate.toISOString().split("T")[0];
    } else if (typeof rawDate === "string" && rawDate) {
      date = rawDate.split("T")[0];
    } else if (typeof rawDate === "number") {
      const d = XLSX.SSF.parse_date_code(rawDate);
      if (d)
        date = `${d.y}-${String(d.m).padStart(2, "0")}-${String(d.d).padStart(2, "0")}`;
    }
    const amount = parseFloat(row[10]) || 0;
    if (amount === 0 && !row[2]) continue;
    birds.push({
      slNo: typeof slNo === "number" ? slNo : birds.length + 1,
      date,
      birds: row[2] || "",
      customerName: row[3] || "",
      location: row[5] || "",
      status: row[6] || "",
      paymentMethod: row[7] || "",
      quantity: parseFloat(row[8]) || 0,
      unitPrice: parseFloat(row[9]) || 0,
      amount,
      remarks: row[11] || "",
    });
  }

  // Parse Feeds sheet
  const feedsSheet = wb.Sheets["Feeds & Consumables."];
  const feedsRaw = XLSX.utils.sheet_to_json(feedsSheet, {
    header: 1,
    defval: "",
  }) as any[][];

  const feeds: FeedTransaction[] = [];
  // Data starts at row index 11 (row 12)
  for (let i = 12; i < feedsRaw.length; i++) {
    const row = feedsRaw[i];
    if (!row[2] && !row[3]) continue;
    const slNo = row[0] || feeds.length + 1;
    const rawDate = row[1];
    let date = "";
    if (rawDate instanceof Date) {
      date = rawDate.toISOString().split("T")[0];
    } else if (typeof rawDate === "string" && rawDate) {
      date = rawDate.split("T")[0];
    } else if (typeof rawDate === "number") {
      const d = XLSX.SSF.parse_date_code(rawDate);
      if (d)
        date = `${d.y}-${String(d.m).padStart(2, "0")}-${String(d.d).padStart(2, "0")}`;
    }
    const amount = parseFloat(row[11]) || 0;
    if (amount === 0 && !row[2]) continue;
    feeds.push({
      slNo: typeof slNo === "number" ? slNo : feeds.length + 1,
      date,
      item: row[2] || "",
      supplierName: row[3] || "",
      location: row[5] || "",
      status: row[6] || "",
      paymentMethod: row[7] || "",
      quantity: parseFloat(row[8]) || 0,
      uom: row[9] || "",
      unitPrice: parseFloat(row[10]) || 0,
      amount,
      remarks: row[12] || "",
    });
  }

  return { birds, feeds };
}

export function generateExcel(data: AppData): Blob {
  const wb = XLSX.utils.book_new();

  // --- Birds sheet ---
  const birdsHeader = [
    ["Rams AVAIRY"],
    ["BIRDS MARKETING DETAILS - 2025"],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    ["TRANSACTION"],
    [
      "Sl.No",
      "Date",
      "Birds",
      "Customer Name",
      "",
      "Location",
      "Status",
      "Payment Method",
      "Quantity",
      "Unit Price",
      "Amount",
      "Remarks",
    ],
  ];

  const birdsData = data.birds.map((b, i) => [
    i + 1,
    b.date,
    b.birds,
    b.customerName,
    "",
    b.location,
    b.status,
    b.paymentMethod,
    b.quantity,
    b.unitPrice,
    b.amount,
    b.remarks,
  ]);

  const birdsSheet = XLSX.utils.aoa_to_sheet([...birdsHeader, ...birdsData]);
  XLSX.utils.book_append_sheet(wb, birdsSheet, "Birds");

  // --- Feeds sheet ---
  const feedsHeader = [
    ["RAMS AVAIRY"],
    ["FEEDS & CONSUMABLES DETAILS - 2025"],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [
      "Sl.No",
      "Date",
      "Item",
      "Supplier Name",
      "",
      "Location",
      "Status",
      "Payment Method",
      "Quantity",
      "UOM",
      "Unit Price",
      "Amount",
      "Remarks",
    ],
    ["", "", "", "", "", "", "", "", "Total", "UOM"],
  ];

  const feedsData = data.feeds.map((f, i) => [
    i + 1,
    f.date,
    f.item,
    f.supplierName,
    "",
    f.location,
    f.status,
    f.paymentMethod,
    f.quantity,
    f.uom,
    f.unitPrice,
    f.amount,
    f.remarks,
  ]);

  const feedsSheet = XLSX.utils.aoa_to_sheet([...feedsHeader, ...feedsData]);
  XLSX.utils.book_append_sheet(wb, feedsSheet, "Feeds & Consumables.");

  const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" });
  return new Blob([buf], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

export function downloadExcel(
  data: AppData,
  filename = "Profit-Loss_Avairy.xlsx",
) {
  const blob = generateExcel(data);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function saveToLocalStorage(data: AppData) {
  localStorage.setItem("aviary_data", JSON.stringify(data));
}

export function loadFromLocalStorage(): AppData | null {
  const raw = localStorage.getItem("aviary_data");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
