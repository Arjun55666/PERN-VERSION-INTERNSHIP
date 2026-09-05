# Flask to PERN migration map

| Existing capability | PERN module |
|---|---|
| Dashboard and counts | `dashboard` |
| Asset create/list/detail/status | `assets` |
| Assign, shift, unassign | `assignments` |
| Assignment history | `assignments` |
| CSV/PDF exports | `reports` |
| QR download and verification uploads | `verification` |
| Excel asset/assignment imports | `bulk` |
| Location capacities | `locations` |

The migration uses a new PostgreSQL database and fake seed records. It never imports the existing SQLite database, uploaded images, QR files, or employee information.
