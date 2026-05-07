# @amlhubs/dds — DDS 1.4 as a Typed Metamodel

## Identity

| Field | Value |
|---|---|
| Standard | Data Distribution Service for Real-Time Systems (DDS) 1.4 |
| OMG Formal Document | [formal/2015-04-10](https://www.omg.org/spec/DDS/1.4/) |
| OMG Specification | [omg.org/spec/DDS/1.4](https://www.omg.org/spec/DDS/1.4/) |
| Authority | [Object Management Group](https://www.omg.org/) |
| npm Package | `@amlhubs/dds` |
| npm Version | `0.0.0` |
| License | UNLICENSED |

## Abstract

TODO: filled after implementation.

The Data Distribution Service is the OMG specification for real-time
publish-subscribe data exchange — the data plane underneath service-oriented
and IoT architectures. The `@amlhubs/dds` package projects the DDS 1.4
Platform Independent Model (PIM) into TypeScript as extensible base classes
and interfaces so that downstream agentic systems can author DDS
configurations and topology declarations under a typed surface rather than
through opaque XML or IDL strings.

## Business Value — Why Extending This Metamodel Pays Off

TODO: filled after implementation.

## Scope — What the Package Surfaces

TODO: filled after implementation. The complete enumeration will live in
`dds.ts`; the table below summarizes the groups and cites the authoritative
section once metaclasses are implemented.

| DDS Module | §Section | Metaclasses Surfaced |
|---|---|---|
| TODO | TODO | TODO |

Every interface will be accompanied by an extensible base class with the
same name minus the `I` prefix (e.g., `DomainParticipant`, `Topic`,
`DataReader`). The full list and the JSDoc headers citing each §-section
will live at [`dds.ts`](./dds.ts).

## Dependency Topology

TODO: filled after implementation.

`@amlhubs/dds` is a leaf metamodel in the `@amlhubs` stack. It depends on
nothing and projects the OMG DDS 1.4 specification with no transitive
import surface.

```
@amlhubs/dds  (this package — leaf, zero dependencies)
```

## Installation & Usage

```bash
npm install @amlhubs/dds
```

```typescript
// TODO: filled after implementation.
// import type { IDomainParticipant, ITopic, IDataReader } from '@amlhubs/dds';
```

The source artifact is [`dds.ts`](./dds.ts). Every interface JSDoc header
will declare `@standard OMG DDS 1.4 -- formal/2015-04-10` and a
`@section §x.y` reference once implemented.

## Provenance & Formal References

- [OMG DDS 1.4 specification](https://www.omg.org/spec/DDS/1.4/) — formal/2015-04-10
- [Object Management Group home](https://www.omg.org/)

## License

UNLICENSED — restricted npm access under `@amlhubs` scope at [npm.pkg.github.com](https://npm.pkg.github.com).
