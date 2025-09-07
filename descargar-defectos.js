// descargar-defectos.js
// Descarga la lista en .txt con tabla alineada.
// Crea una fila por cada 'hora' del objeto.

(function () {
  const LS_KEY = "defectoData"; // fallback si no pasas 'data'

  const clean = (v) =>
    (v ?? "").toString().replace(/\r?\n|\t/g, " ").trim();

  const stamp = () => {
    const d = new Date(), p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}_${p(d.getHours())}-${p(d.getMinutes())}`;
  };

  // ---- Generador de tabla "bonita" (ASCII, columnas fijas) ----
  function toPrettyTable(data) {
    // Construye filas planas (una por hora)
    const rows = [];
    for (const it of data) {
      const defecto = clean(it.defecto);
      const metodo  = clean(it.metodo);
      const lado    = clean((it.lado ?? "").toString().toUpperCase());
      const color   = clean(it.color);
      const horas   = Array.isArray(it.hora) && it.hora.length ? it.hora : [""];
      for (const h of horas) {
        rows.push([defecto, metodo, lado, color, clean(h)]);
      }
    }

    const headers = ["defecto", "metodo", "lado", "color", "hora"];

    // Ancho máximo por columna (evita líneas enormes)
    const MAX = [28, 12, 4, 10, 19];

    const fit = (s, w) => {
      const str = s ?? "";
      return str.length <= w ? str.padEnd(w, " ")
                             : (str.slice(0, Math.max(0, w - 3)) + "..."); // elipsis
    };

    // Calcula anchuras reales (<= MAX)
    const widths = headers.map((h, i) => {
      const maxRow = rows.reduce((m, r) => Math.max(m, (r[i] ?? "").length), 0);
      return Math.min(MAX[i], Math.max(h.length, maxRow));
    });

    const line  = "+" + widths.map(w => "-".repeat(w + 2)).join("+") + "+\n";
    const makeRow = (cols) =>
      "| " + cols.map((c, i) => fit(c, widths[i])).join(" | ") + " |\n";

    let out = "";
    out += line;
    out += makeRow(headers);
    out += line;
    for (const r of rows) out += makeRow(r);
    out += line;
    out += `Total filas: ${rows.length}\n`;
    return out;
  }

  function downloadTxt(text, filename) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }

  /**
   * Adjunta el click para descargar.
   * Usa: datos pasados > window.registros > localStorage["defectoData"]
   *
   * @param {string} buttonSelector  Ej. "#btnDescargar"
   * @param {Array<object>=} data    (opcional) arreglo de objetos
   */
  function attachDownloadDefectos(buttonSelector, data) {
    const btn = document.querySelector(buttonSelector);
    if (!btn) return;

    btn.addEventListener("click", () => {
      let arr =
        (Array.isArray(data) && data) ||
        (typeof window !== "undefined" && window.registros) ||
        [];

      if (!Array.isArray(arr) || !arr.length) {
        try {
          const raw = localStorage.getItem(LS_KEY);
          arr = raw ? JSON.parse(raw) : [];
        } catch { arr = []; }
      }

      if (!arr.length) {
        alert("No hay datos para descargar.");
        return;
      }

      const txt = toPrettyTable(arr);
      downloadTxt(txt, `defectos_${stamp()}.txt`);
    });
  }

  // Exporta
  window.attachDownloadDefectos = attachDownloadDefectos;
})();
