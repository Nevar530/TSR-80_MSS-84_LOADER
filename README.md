# MSS:80 Loader  
*BattleTech fan tools in your browser — one launcher, two apps.*

[![Play – in browser](https://img.shields.io/badge/PLAY%20IN%20BROWSER-%E2%96%B6-2ecc71?style=for-the-badge&labelColor=111)](https://nevar530.github.io/TSR-80_MSS-84_LOADER/)

---

## 📖 Overview

This repository hosts the **MSS:80 Loader**, a lightweight shell that launches two fan-made BattleTech utilities:

- **[TRS:80](https://nevar530.github.io/TRS80/)** — *Technical Readout System:80*  
  TRO-style viewer and builder for ’Mechs and variants. Includes stat blocks, weapons, BV calculations, G.A.T.O.R. console, and lance building/export.

- **[MSS:84](https://nevar530.github.io/Battletech-Mobile-Skirmish/)** — *Mobile Skirmish System*  
  Mobile/tablet-friendly hex-map skirmish helper. Terrain editing, tokens, LOS/measurement, initiative/turn tracking, dice roller, and optional online play.

Together, they let you **design forces in TRS:80** and **fight with them in MSS:84**. Lances export/import as JSON so you can carry pilots and unit data between apps.

---

## 📂 Apps in the suite

### TRS:80 — Technical Readout System
- Readout-style display of ’Mech data (stats, role, armor/internals, source, era).
- Integrated **G.A.T.O.R.** calculator + roller.  
- Lance builder with BV/tonnage/role tracking.  
- Chassis catalogue with search/filter and “owned” tracking.  
- Data sourced from MegaMek JSON (CC BY-NC-SA 4.0).  
- 👉 [Open TRS:80](https://nevar530.github.io/TRS80/)  
- 📖 [Help (redirect)](https://nevar530.github.io/TSR-80_MSS-84_LOADER/help/trs80.html)

### MSS:84 — Mobile Skirmish System
- Hex map editor with terrain, height, cover, and export.  
- Token support with names, pilots, team colors.  
- LOS, range measurement, initiative tools, and dice roller.  
- Side-dock integration with [Flechs Sheets](https://sheets.flechs.net) for record-keeping.  
- Optional online play with Firebase “Uplink.”  
- 👉 [Open MSS:84](https://nevar530.github.io/Battletech-Mobile-Skirmish/)  
- 📖 [Help / Wiki (redirect)](https://nevar530.github.io/TSR-80_MSS-84_LOADER/help/skirmish.html)

---

## ℹ️ About & Licensing

- 📄 [About page](https://nevar530.github.io/TSR-80_MSS-84_LOADER/about.html) — overview of the loader, each app, licensing, credits, and IP notices.
- **License:** Code in this repo (loader) is MIT. See [LICENSE](LICENSE).  
- **TRS:80 Data:** Built on MegaMek JSON (CC BY-NC-SA 4.0).  
- **MSS:84 Integration:** Includes support for [Flechs Sheets](https://sheets.flechs.net).  
- **IP Disclaimer:**  
  > BattleTech and all associated marks, logos, and content are property of their respective rights holders.  
  > This project is non-commercial, fan-made, and not affiliated with or endorsed by the IP holders.

---

## 🛠 Development

This loader is a single-page shell with three main parts:  
- **Boot overlay** (TRO-style sequence).  
- **Home screen** (logos + hex honeycomb background).  
- **Viewer** (iframe sandbox for each app).

To run locally:  
```bash
git clone https://github.com/Nevar530/TSR-80_MSS-84_LOADER.git
cd TSR-80_MSS-84_LOADER
# Open index.html in a browser
