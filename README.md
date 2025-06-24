## SPLINDE DEMO Project Plan

### Features

- **API route** (`/api/data`): Serves static demo data.
- **Recursive sum computation** for all sections and total.
- **Editable entries** (`sum` and `note`), with live updates.
- **Recursive rendering** for arbitrarily nested trees.
- **Responsive UI** (Tailwind CSS).

---

### Folder Structure

```
/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── data/
│   │   │       └── route.ts        # API endpoint serving demoData
│   │   ├── components/             # UI components (recursive tree, editors)
│   │   ├── page.tsx                # Main page, fetches data, manages state
│   │   ├── layout.tsx              # Root layout
│   │   ├── globals.css             # Global styles
│   │   └── ...                     # Other routes, layouts, etc.
│   ├── lib/
│   │   ├── demoData.ts             # Provided static data
│   │   └── types.ts                # TypeScript type definitions
├── public/                         # Static assets
├── postcss.config.mjs              # PostCSS config
├── tsconfig.json                   # TypeScript config
├── package.json
└── README.md
```

---

### Data Flow

1. **API Route**:  
   `/api/data` returns the static `demoData` tree.

2. **Frontend Fetch**:  
   On load, the app fetches data from `/api/data`.

3. **Sum Computation**:  
   A recursive function computes `computedSum` for each section and the total sum for the root, after each edit.

4. **Editing**:  
   Users can edit `sum` and `note` fields.  
   On `onBlur`, the entry is updated in local state and sums are recomputed.

5. **Rendering**:  
   The tree is rendered recursively, supporting any nesting.  
   Each section displays its computed sum.  
   The total sum is displayed at the top.

---

### How to Run

#### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

#### Installation

```
git clone https://github.com/yahoo90/splinde-demo.git
cd splinde-demo
npm install
```

#### Development

```
npm run dev
```

- Open [http://localhost:3000](http://localhost:3000) in your browser.

#### API Endpoint

- [http://localhost:3000/api/data](http://localhost:3000/api/data)  
  Returns the demo data as JSON.

---

### Technical Decisions

- **Next.js App Router**: Modern file-based routing, API routes, and React Server Components.
- **TypeScript**: Type safety for all data and components.
- **Tailwind CSS 4+**: Utility-first styling.
- **In-memory Data**: No database or persistence; all edits are local.
- **Recursive Components**: Clean handling of arbitrarily deep trees.

---

### Optional Enhancements

- Collapsible/expandable sections
- Add/remove entries or sections
- Docker Compose setup
- Improved mobile UI

---

## 📄 License

MIT

---

## Questions?

Feel free to reach out or open an issue!
```