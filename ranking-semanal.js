const SHEET_ID = "1UEHkSZkheBfwQpMe_BJNkrn_V-6lchDedHXEJ7zHVIY";
const GID = "1310027705";

function csvToJson(csv) {
  const lines = csv.replace(/\r/g, "").split("\n").filter(Boolean);
  const headers = splitCsvLine(lines[0]);
  return lines.slice(1).map(line => {
    const cols = splitCsvLine(line);
    const obj = {};
    headers.forEach((h, i) => obj[h] = (cols[i] || "").trim());
    return obj;
  });
}

function splitCsvLine(line) {
  const out = [];
  let cur = "", inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; continue; }
      inQuotes = !inQuotes; 
      continue;
    }
    if (ch === "," && !inQuotes) { out.push(cur); cur = ""; continue; }
    cur += ch;
  }
  out.push(cur);
  return out;
}

export async function onRequestGet() {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;
  const res = await fetch(url, { cf: { cacheTtl: 300, cacheEverything: true } });
  if (!res.ok) {
    return new Response(JSON.stringify({ error: "Falha ao buscar CSV" }), {
      status: 502,
      headers: { "content-type": "application/json", "access-control-allow-origin": "*" }
    });
  }
  const csv = await res.text();
  const rows = csvToJson(csv);

  return new Response(JSON.stringify({
    updated_at: new Date().toISOString(),
    rows
  }), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=60",
      "access-control-allow-origin": "*"
    }
  });
}
