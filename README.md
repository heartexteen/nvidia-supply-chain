# NVIDIA Data Center Supply Chain — Network Analysis

A network analysis of NVIDIA's Data Center segment, mapping suppliers, customers, and partners as nodes and the flows between them as edges. Built for a Supply Chain Analytics class project.

## What's in here

```
.
├── README.md                                          # this file
├── nodes.csv                                          # 607 entities (suppliers, NVIDIA, customers)
├── edges.csv                                          # 898 directed relationships with cost/revenue metrics
├── index.html                                         # interactive network visualization (pyvis / vis-network)
├── _server.js                                         # tiny static file server for local viewing
```

## Data model

**Nodes** (`nodes.csv`) — one row per entity:

| Field | Description |
|---|---|
| `id` | Company name (used as primary key) |
| `ticker` | Bloomberg/exchange ticker, where available |
| `industry` | Sector classification (Semiconductors, Technology Hardware, Software, etc.) |
| `is_core` | `true` for the ~25 entities with full SPLC drill-downs; `false` for outlier suppliers/customers reached only one hop out |
| `total_suppliers` | Supplier count from SPLC (core nodes only) |
| `total_customers` | Customer count from SPLC (core nodes only) |

**Edges** (`edges.csv`) — one row per directed supply relationship (Source → Target):

| Field | Description |
|---|---|
| `Source`, `Target` | Node ids — `Source` supplies `Target` |
| `Type` | Always `Directed` |
| `Label` | Always `SUPPLIES` |
| `cost_pct` | % of Target's relevant cost line that this supplier represents |
| `supplier_rev_pct` | % of Source's revenue that comes from selling to Target |
| `cost_category` | Where the spend hits Target's books: `COGS`, `CAPEX`, `RND`, or `SGA` |

## Methodology

Data extracted from Bloomberg SPLC (Supply Chain) terminal screens for NVIDIA and its first-tier counterparties. The graph is built in two layers:

- **Core layer** — full supplier and customer lists pulled for ~25 strategically important entities (NVIDIA, TSMC, ASML, SK hynix, Micron, Hon Hai, etc.). These nodes carry `is_core=true` and have populated supplier/customer counts.
- **Outlier layer** — companies that appear as a counterparty of a core node but weren't drilled into themselves. These have `is_core=false` and exist primarily to give the core network its connective tissue.

For methodological caveats around using SPLC for academic work, see Culot et al. (2023) cited in the proposal.

## Running the visualization

The `index.html` file is a self-contained pyvis network rendering. Modern browsers will open it directly:

```bash
open index.html        # macOS
xdg-open index.html    # Linux
start index.html       # Windows
```

If you'd rather serve it over HTTP (recommended if the page reads CSV/JSON via fetch):

```bash
node _server.js
# then visit http://localhost:8765
```

The included server is dependency-free — plain Node.js `http` module, no `npm install` needed.

## Reproducing or extending the dataset

If you want to add new entities, the workflow is:

1. Pull a new SPLC tab from Bloomberg (`<TICKER> Equity SPLC <GO>`)
2. Append the focal company to `nodes.csv` with `is_core=true` and its supplier/customer counts
3. Append each supplier/customer relationship to `edges.csv`, copying the `Supplier's Rev %` and the cost % column (note the cost category — it varies row by row)
4. Add any new counterparty companies as `is_core=false` rows in `nodes.csv`

The Bloomberg screenshots are the raw source for everything currently in the CSVs and can be cross-referenced when verifying numbers.
