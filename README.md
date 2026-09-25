# BA Roadmap

**English** · [Tiếng Việt](README.vi.md)

A self-study roadmap for aspiring Business Analysts: five simulated software projects set in Vietnam, ordered from easy to hard. Every step hides a sample answer so you do the work first and compare afterwards.

Read it online: https://ttncode.github.io/ba-roadmap/ (Vietnamese, default) · https://ttncode.github.io/ba-roadmap/en/index.html (English)

All companies, clients and figures in the material are fictional and exist for practice only.

## What you practice

You play the BA at a fictional software company. Each project reuses the skills of the previous one and adds new ones.

| # | Project | New skills |
|---|---|---|
| 1 | Mộc Coffee: QR ordering at the table | Reading a brief, stakeholders, interview questions, MoM, Q&A log, As-is / To-be, Scope In/Out, User Story + AC, handling new requests |
| 2 | Nụ Cười Dental: online booking and Zalo reminders | Root cause, 5 Whys, measurable goals, Use Case diagram and specification, business rules, state diagram, low-fi wireframes, NFRs, stakeholder conflicts |
| 3 | GreenMart: e-commerce for a chain of 5 grocery stores | Context diagram, User Story Map, Epic/Feature, MoSCoW, MVP, ERD, sequence diagram, payment integration, backlog refinement, DoR/DoD, Jira tickets, impact analysis |
| 4 | Phú Thịnh Garment: attendance and payroll for 2,800 workers | Raw data analysis, decision tables, complex business rules, data migration, change requests, RTM, UAT scenarios, English email |
| 5 | Sao Mai Bank: eKYC onboarding and biometric transfer authentication | System context, RACI, compliance requirements, multi-system sequences, gap analysis, abuse cases, security and audit NFRs, SRS, go-live and hypercare, decision memo |

The page ends with a summary tab (packaging a portfolio, interview prep) and a searchable glossary of everyday BA terms.

## How to use it

1. Read the context and input documents for a step (client emails, meeting notes, spreadsheets).
2. Do the task yourself in a doc, a sheet or on paper. Draw diagrams on draw.io, mermaid.live or by hand.
3. Grade your work against the **Self-check** list.
4. Open **View sample answer** and note what you missed.
5. Tick the step as done. Progress is saved in your browser's `localStorage` only, and is shared between the two languages.

## Run locally

The site is plain HTML, CSS and JavaScript with no build step. Diagrams load [Mermaid](https://mermaid.js.org/) and fonts from a CDN, so an internet connection is needed for them to render.

```sh
git clone https://github.com/ttncode/ba-roadmap.git
cd ba-roadmap
python3 -m http.server 8000
```

Then open http://localhost:8000/. Opening `index.html` directly from disk also works.

## Project layout

```text
index.html        Vietnamese page (default)
en/index.html     English page
assets/style.css  Shared styles
assets/app.js     Shared behavior: tabs, progress, answers, diagrams, glossary search
```

Both pages share the same panel ids and `data-step` ids, so a content change on one page needs the same change on the other.

## License

No license file is published yet. Ask the repository owner before reusing the material.
