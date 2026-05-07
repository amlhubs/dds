// ═══════════════════════════════════════════════════════════════════════════
// dds.ts
// OMG Data Distribution Service for Real-Time Systems (DDS) v1.4
// (formal/2015-04-10)
//
// Scope: Pure DDS 1.4 metaclasses covering the DDS Domain / Topic /
// Publisher / Subscriber / DataReader / DataWriter / QoS spine —
// the conceptual entities defined by the DDS Platform Independent Model
// (PIM) of the OMG specification:
//
//   • DomainParticipantFactory — root factory for DomainParticipant entities
//   • DomainParticipant        — entry point into a DDS domain
//   • Topic / ContentFilteredTopic / MultiTopic — typed data spaces
//   • TopicDescription          — abstract supertype for topic kinds
//   • Publisher / Subscriber    — sending / receiving containers
//   • DataWriter / DataReader   — typed I/O endpoints
//   • Entity / DomainEntity     — abstract supertypes for all DDS entities
//   • QosPolicy spine           — QoS policy classes carried by entities
//   • Listener spine            — asynchronous notification interfaces
//   • Status / Condition / WaitSet / GuardCondition / ReadCondition /
//     QueryCondition / StatusCondition — status + condition spine
//
// Metaclass count: TODO (filled by the scraper + implementer subagents
// during the implementation wave). Initial scaffold authors only the
// top-banner header; metaclass declarations are inserted in subsequent
// commits.
//
// Architectural ordering:
//   DDS (this file) is PURE DDS 1.4. It imports NOTHING from any other
//   @amlhubs metamodel. Downstream consumers extend the interfaces and
//   base classes exported from this file through standard TypeScript
//   inheritance.
//
// @standard      OMG DDS 1.4 — formal/2015-04-10
// @specification https://www.omg.org/spec/DDS/1.4/
// @authority     Object Management Group (https://www.omg.org/)
// ═══════════════════════════════════════════════════════════════════════════

// metaclasses will be inserted here in subsequent waves
