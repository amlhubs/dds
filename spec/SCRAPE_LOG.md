# DDS 1.4 — OMG Spec Scrape Log

## Specification

- **Name**: Data Distribution Service for Real-Time Systems (DDS)
- **Edition**: 1.4
- **OMG Document Number**: formal/2015-04-10
- **Source page**: https://www.omg.org/spec/DDS/1.4/
- **About page**: https://www.omg.org/spec/DDS/1.4/About-DDS/
- **Scrape date**: 2026-05-07

## Downloaded Artifacts

| File | Size (bytes) | SHA-256 | Source URL |
|---|---:|---|---|
| `formal-15-04-10.pdf` | 1,830,440 | `16d6f8385c2ba79f7346dc18c867b624bc6dcc8fcf7c2ec52c55b7ae3dc113f2` | https://www.omg.org/spec/DDS/1.4/PDF |
| `formal-15-04-10-changebar.pdf` | 1,785,416 | `efc3f3112d6f0069fd58cda9068432a0884200676fa9736403aba055f09dc047` | https://www.omg.org/spec/DDS/1.4/PDF/changebar |
| `dds_dcps.idl` | 47,923 | `f14a3b741296c2cddeb9d4908199f489507241de5ab446f76078cd2201e295e3` | https://www.omg.org/spec/DDS/20140501/dds_dcps.idl |
| `dds_dlrl.idl` | 16,874 | `b61e9048c26417c9887be7b98a9fa054b4545440e8e2df8f05cd8fb84cc867b0` | https://www.omg.org/spec/DDS/20140501/dds_dlrl.idl |
| `dds_dcps_uml_objecteering.ofp` | 9,706,496 | `2de25df67e86f6719df05f9b3bc71565d7ccc9b7697bb8781a72b52faf7a3b0e` | https://www.omg.org/spec/DDS/20140501/dds_dcps_uml_objecteering.ofp |

Total: 5 files, 13,387,149 bytes (≈12.8 MB).

## File Roles

- **`formal-15-04-10.pdf`** — Authoritative DDS 1.4 specification PDF (clean version).
- **`formal-15-04-10-changebar.pdf`** — DDS 1.4 specification PDF with change bars vs DDS 1.3.
- **`dds_dcps.idl`** — DCPS (Data-Centric Publish-Subscribe) IDL: the normative OMG IDL definition of the DCPS API metaclasses (`DomainParticipant`, `Topic`, `Publisher`, `Subscriber`, `DataWriter`, `DataReader`, QoS policies, etc.).
- **`dds_dlrl.idl`** — DLRL (Data Local Reconstruction Layer) IDL: the normative OMG IDL definition of the optional DLRL API.
- **`dds_dcps_uml_objecteering.ofp`** — Softeam Objecteering UML model file (binary `.ofp`) for the DCPS metamodel — reverse-engineerable in Modelio / Objecteering tooling for direct metaclass/property extraction.

## Attempted-But-Missing URLs

OMG did not publish the following machine-readable formats for DDS 1.4 (HEAD probes returned HTTP 404):

- `https://www.omg.org/spec/DDS/20140501/dds.xmi` — 404
- `https://www.omg.org/spec/DDS/20140501/DDS.xmi` — 404
- `https://www.omg.org/spec/DDS/20140501/dds.cmof` — 404
- `https://www.omg.org/spec/DDS/20140501/DDS.cmof` — 404
- `https://www.omg.org/spec/DDS/20140501/dds.eap` — 404
- `https://www.omg.org/spec/DDS/20140501/DDS.eap` — 404
- `https://www.omg.org/spec/DDS/20140501/dds.zip` — 404
- `https://www.omg.org/spec/DDS/20140501/DDS.zip` — 404
- `https://www.omg.org/spec/DDS/20140501/dds.mof` — 404
- `https://www.omg.org/spec/DDS/20140501/dds_dcps.xmi` — 404
- `https://www.omg.org/spec/DDS/20140501/dds_dlrl.xmi` — 404

**Implication for implementation**: there is no OMG-published XMI/CMOF for DDS 1.4. The metamodel must be transcribed from `formal-15-04-10.pdf` (Sections 2.2 DCPS + 2.3 DLRL Platform Independent Model class diagrams and property tables) cross-checked against `dds_dcps.idl` / `dds_dlrl.idl` for property types and cardinalities. The Objecteering `.ofp` provides an additional UML cross-check if opened in Modelio.

## Index Pages Consulted

- https://www.omg.org/spec/DDS/1.4/ — top-level spec landing
- https://www.omg.org/spec/DDS/1.4/About-DDS/ — canonical artifact list
- https://www.omg.org/spec/DDS/20140501/ — directory index returned HTTP 404 (no Apache-style listing)
