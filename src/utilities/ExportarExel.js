import * as XLSX from "xlsx-js-style";
export const exportToExcel = async (rows, proyecto) => {
    const fechaGeneracion = `Fecha de generación: ${new Date().toLocaleDateString()}`;
    const encabezado = [
        [{ v: `Checklist de Evaluación del Proyecto "${proyecto}"`, s: { font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "2E5077" } }, alignment: { horizontal: "center" } } }],
        [{ v: fechaGeneracion, s: { font: { italic: true, sz: 12, color: { rgb: "333333" } } } }],
        [],
        [
            { v: "SECCIÓN", s: { font: { bold: true, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "2E5077" } }, border: { bottom: { style: "thin", color: { rgb: "000000" } } } } },
            { v: "PREGUNTA", s: { font: { bold: true, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "2E5077" } }, border: { bottom: { style: "thin", color: { rgb: "000000" } } } } },
            { v: "CUMPLE", s: { font: { bold: true, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "2E5077" } }, border: { bottom: { style: "thin", color: { rgb: "000000" } } } } }
        ]
    ];

    const ws = XLSX.utils.aoa_to_sheet(encabezado);
    XLSX.utils.sheet_add_json(ws, rows, { origin: "A4", skipHeader: true });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Checklist");

    XLSX.writeFile(wb, `checklist_respuestas-${fechaGeneracion}.xlsx`);
};
