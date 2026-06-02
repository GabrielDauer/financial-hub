import crypto from "node:crypto";

export type AssetClass =
  | "equity"
  | "fii"
  | "tesouro"
  | "fixed_income"
  | "cash"
  | "other";

export type LedgerKind =
  | "buy"
  | "sell"
  | "income"
  | "statement_only"
  | "ignore";

export type LedgerEntry = {
  hash: string;
  date: string;
  direction: "credito" | "debito";
  movement: string;
  product: string;
  institution: string;
  ticker: string | null;
  assetClass: AssetClass;
  quantity: number;
  unitPrice: number | null;
  grossValue: number | null;
  kind: LedgerKind;
};

export type Position = {
  key: string;
  ticker: string | null;
  product: string;
  assetClass: AssetClass;
  institution: string;
  quantity: number;
  investedAmount: number | null;
  avgPrice: number | null;
  costCoverage: "full" | "partial" | "unknown";
  valuationSource: "market" | "statement";
};

const REQUIRED_HEADERS = [
  "Entrada/Saída",
  "Data",
  "Movimentação",
  "Produto",
  "Instituição",
  "Quantidade",
  "Preço unitário",
  "Valor da Operação",
];

const BUY_MOVEMENTS = new Set([
  "compra",
  "transferencia - liquidacao",
  "bonificacao em ativos",
]);

const SELL_MOVEMENTS = new Set([
  "venda",
  "resgate",
  "resgate antecipado",
  "vencimento",
  "retirada de custodia",
]);

const INCOME_MOVEMENTS = new Set([
  "dividendo",
  "dividendo - transferido",
  "juros sobre capital proprio",
  "juros sobre capital proprio - transferido",
  "rendimento",
  "evento em dinheiro - transferido",
  "reembolso",
  "leilao de fracao",
  "fracao em ativos",
]);

const IGNORE_MOVEMENTS = new Set([
  "atualizacao",
  "direito de subscricao",
  "direitos de subscricao - nao exercido",
  "transferencia",
]);

function clean(text: unknown): string {
  return String(text ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLowerCase();
}

function parsePtNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;

  const raw = String(value).trim();
  if (!raw || raw === "-") return null;

  const normalized = raw.replace(/\./g, "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseBrDate(value: unknown): string {
  const raw = String(value ?? "").trim();
  if (!raw) return "";

  const [dd, mm, yyyy] = raw.split("/");
  if (!dd || !mm || !yyyy) return "";
  return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
}

function extractTicker(product: string): string | null {
  const head = product.split(" - ")[0]?.trim().toUpperCase() ?? "";
  if (/^[A-Z]{4,6}\d{1,2}$/.test(head)) return head;

  const match = product.toUpperCase().match(/\b[A-Z]{4,6}\d{1,2}\b/);
  return match?.[0] ?? null;
}

function classifyAsset(product: string): AssetClass {
  const p = product.toUpperCase();

  if (p.includes("TESOURO")) return "tesouro";
  if (/(CDB|LCA|LCI|RDB|COE)/.test(p)) return "fixed_income";
  if (/(FII|FUNDO DE INVESTIMENTO IMOBILIARIO|FIAGRO)/.test(p)) return "fii";
  if (/\b[A-Z]{4,6}\d{1,2}\b/.test(p)) return "equity";
  return "other";
}

function detectKind(movement: string, assetClass: AssetClass): LedgerKind {
  if (BUY_MOVEMENTS.has(movement)) return "buy";
  if (SELL_MOVEMENTS.has(movement)) return "sell";
  if (INCOME_MOVEMENTS.has(movement)) return "income";
  if (IGNORE_MOVEMENTS.has(movement)) return "ignore";

  if (assetClass === "fixed_income") {
    if (movement === "aplicacao") return "buy";
    if (movement === "aplicação") return "buy";
  }

  return "statement_only";
}

export function validateB3Rows(rows: Record<string, unknown>[]) {
  if (!rows.length) {
    throw new Error("Arquivo vazio.");
  }

  const headers = Object.keys(rows[0]);
  const missing = REQUIRED_HEADERS.filter((h) => !headers.includes(h));

  if (missing.length) {
    throw new Error(
      `Arquivo não reconhecido como extrato de movimentação da B3. Faltando: ${missing.join(", ")}`
    );
  }
}

export function normalizeB3Rows(rows: Record<string, unknown>[]): LedgerEntry[] {
  return rows
    .map((row) => {
      const direction: LedgerEntry["direction"] =
        clean(row["Entrada/Saída"]) === "debito" ? "debito" : "credito";
      const movement = clean(row["Movimentação"]);
      const product = String(row["Produto"] ?? "").trim();
      const institution = String(row["Instituição"] ?? "").trim();
      const quantity = parsePtNumber(row["Quantidade"]) ?? 0;
      const unitPrice = parsePtNumber(row["Preço unitário"]);
      const grossValue = parsePtNumber(row["Valor da Operação"]);
      const date = parseBrDate(row["Data"]);
      const assetClass = classifyAsset(product);
      const ticker = extractTicker(product);
      const kind = detectKind(movement, assetClass);

      const hash = crypto
        .createHash("sha1")
        .update(
          [
            direction,
            date,
            movement,
            product,
            institution,
            String(quantity),
            String(unitPrice ?? ""),
            String(grossValue ?? ""),
          ].join("|")
        )
        .digest("hex");

      return {
        hash,
        date,
        direction,
        movement,
        product,
        institution,
        ticker,
        assetClass,
        quantity,
        unitPrice,
        grossValue,
        kind,
      };
    })
    .filter((row) => row.date && row.product)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function aggregatePositions(ledger: LedgerEntry[]) {
  const map = new Map<string, Position>();

  for (const entry of ledger) {
    const key = entry.ticker ?? entry.product;

    if (!map.has(key)) {
      map.set(key, {
        key,
        ticker: entry.ticker,
        product: entry.product,
        assetClass: entry.assetClass,
        institution: entry.institution,
        quantity: 0,
        investedAmount: 0,
        avgPrice: null,
        costCoverage: "full",
        valuationSource:
          entry.assetClass === "equity" ||
          entry.assetClass === "fii" ||
          entry.assetClass === "tesouro"
            ? "market"
            : "statement",
      });
    }

    const pos = map.get(key)!;

    if (entry.kind === "buy") {
      pos.quantity += entry.quantity;

      if (entry.grossValue !== null && entry.grossValue > 0) {
        pos.investedAmount = (pos.investedAmount ?? 0) + entry.grossValue;
      } else {
        pos.costCoverage = pos.costCoverage === "full" ? "partial" : pos.costCoverage;
      }
    }

    if (entry.kind === "sell") {
      pos.quantity -= entry.quantity;
      if (pos.quantity < 0) pos.quantity = 0;
    }

    if (entry.kind === "statement_only") {
      pos.costCoverage = pos.costCoverage === "unknown" ? "unknown" : "partial";
    }

    if (pos.quantity > 0 && pos.investedAmount && pos.investedAmount > 0) {
      pos.avgPrice = pos.investedAmount / pos.quantity;
    } else {
      pos.avgPrice = null;
    }
  }

  const positions = [...map.values()].filter((p) => p.quantity > 0);

  const summary = {
    totalPositions: positions.length,
    listedPositions: positions.filter(
      (p) => p.assetClass === "equity" || p.assetClass === "fii" || p.assetClass === "tesouro"
    ).length,
    fixedIncomePositions: positions.filter((p) => p.assetClass === "fixed_income").length,
  };

  return { positions, summary };
}