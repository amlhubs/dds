# @amlhubs/dds — DDS 1.4 as a Typed Metamodel

## Identity

| Field | Value |
|---|---|
| Standard | Data Distribution Service for Real-Time Systems (DDS) 1.4 |
| OMG Formal Document | [formal/2015-04-10](https://www.omg.org/spec/DDS/1.4/) |
| OMG Specification | [omg.org/spec/DDS/1.4](https://www.omg.org/spec/DDS/1.4/) |
| Authority | [Object Management Group](https://www.omg.org/) |
| npm Package | `@amlhubs/dds` |
| npm Version | `0.0.1` |
| Peer Dependencies | None — pure DDS, zero downstream dependencies |
| License | UNLICENSED |

## Abstract

The Data Distribution Service is the OMG specification for real-time publish-subscribe data exchange — the data plane underneath service-oriented and IoT architectures, used in defense, aerospace, autonomous vehicles, smart energy, industrial control, and medical devices wherever a distributed system must move typed data between many publishers and many subscribers under hard quality-of-service guarantees. DDS 1.4 (formal/2015-04-10) is the OMG release that consolidates the Data-Centric Publish-Subscribe (DCPS) Platform Independent Model, the 22 standard QoS policies, the listener and status hierarchies, the BuiltinTopicData metaclasses used by the DDS discovery protocol, and the optional Data Local Reconstruction Layer (DLRL) into a single specification.

The `@amlhubs/dds` npm package projects the DDS 1.4 PIM into TypeScript as 130 extensible interfaces and base classes covering DCPS infrastructure (DomainParticipantFactory, DomainParticipant, Topic, Publisher, Subscriber), DCPS communication (DataWriter, DataReader, Conditions, WaitSet, ReturnCode_t, Duration_t, Time_t, InstanceHandle_t), the complete QoS policy set (22 policy structs and their kind enumerations), the listener and status hierarchy (12 listeners, 13 status structs, StatusKind bit-mask), BuiltinTopicData for the four built-in discovery topics, and the DLRL surface (ObjectRoot, ObjectHome, Selection, Cache, CacheBase, CacheAccess, CacheFactory, the relation collections List/Set/StrMap/IntMap, and the criterion hierarchy). Every interface carries a JSDoc header citing the precise DDS 1.4 §-section that defines it, making each symbol an auditable projection of the specification rather than an internal invention.

## Business Value — Why Extending This Metamodel Pays Off

DDS is the data plane of every standards-compliant real-time distributed system. [RTI Connext DDS](https://www.rti.com/products/connext-dds), [eProsima Fast DDS](https://www.eprosima.com/index.php/products-all/eprosima-fast-dds), [OpenDDS](https://opendds.org/), [Twin Oaks CoreDX DDS](http://www.twinoakscomputing.com/coredx), and [ADLINK CycloneDDS](https://cyclonedds.io/) all implement the same OMG 1.4 specification this package surfaces, and [ROS 2](https://docs.ros.org/en/rolling/Concepts/About-Internal-Interfaces.html) selects between them as interchangeable middleware backends. A model expressed against the metaclasses `@amlhubs/dds` exports is, by construction, portable to every one of those vendor stacks without a custom converter — the QoS policy bundles, topic descriptions, and partition declarations carry over byte-for-byte. Ventures that would otherwise spend quarters rebuilding proprietary DDS configuration tooling for each vendor amortize that engineering cost to zero.

The second business lever is agentic-runtime leverage. Ageni's Probabilistic Reduction Engine consumes the DDS metamodel as the deterministic substrate over which large-language-model reasoning operates. When an agent writes source code against `IDomainParticipant`, `ITopic`, `IDataWriter`, `IReliabilityQosPolicy`, and `IDeadlineQosPolicy`, the TypeScript compiler evaluates whether the proposed topology is a well-formed DDS configuration at the same moment the compiler evaluates whether the code itself is well-formed — the two correctness checks collapse into one `tsc` pass. Structural hallucinations that would otherwise slip past a natural-language review (inventing a QoS policy, mis-attributing a kind enumeration, violating the offered/requested compatibility ordering on `RELIABILITY` or `DURABILITY`) are caught at compile time, and every surviving interface reference traces to a §-section of the specification through the JSDoc header.

The third lever is compounding reuse across the OMG stack. DDS shares its abstract Entity hierarchy with UML's class structure (`@amlhubs/uml`), its QoS-policy pattern with SoaML's quality-of-service descriptors (`@amlhubs/soaml`), and its topic-discovery model with the broader event-driven architecture surfaces of XMI-serialized models (`@amlhubs/xmi`). Every downstream ageni venture that ships a real-time-data, IoT, or autonomous-system capability — a fleet-coordination layer for autonomous logistics, a sensor-fusion mesh for industrial monitoring, a discovery-and-pubsub backbone for an agentic robotics platform — consumes these same 130 metaclasses through their transitively-dependent packages.

## Scope — What the Package Surfaces

The package exports 130 metaclasses organized by DDS 1.4 specification module. The complete enumeration lives in `dds.ts`; the table below summarizes the groups and cites the authoritative section.

| DDS Module | §Section | Metaclasses Surfaced |
|---|---|---|
| DCPS Infrastructure | §2.2.2.1, §2.2.2.2, §2.2.2.3, §2.2.2.4 | `IEntity`, `IDomainEntity`, `ITypeSupport`, `IDomainParticipantFactory`, `IDomainParticipant`, `ITopicDescription`, `ITopic`, `IContentFilteredTopic`, `IMultiTopic`, `IPublisher`, `ISubscriber` |
| DCPS Communication | §2.2.2.5 | `IDataWriter`, `IDataReader`, `ICondition`, `IGuardCondition`, `IStatusCondition`, `IReadCondition`, `IQueryCondition`, `IWaitSet`, `ISampleInfo`, `ReturnCode_t`, `Duration_t`, `Time_t`, `InstanceHandle_t`, `BuiltinTopicKey_t`, `StatusKind`, `SampleStateKind`, `ViewStateKind`, `InstanceStateKind` (+ masks) |
| QoS Policies | §2.2.3 | 22 policy structs (`UserDataQosPolicy`, `TopicDataQosPolicy`, `GroupDataQosPolicy`, `TransportPriorityQosPolicy`, `LifespanQosPolicy`, `DurabilityQosPolicy`, `PresentationQosPolicy`, `DeadlineQosPolicy`, `LatencyBudgetQosPolicy`, `OwnershipQosPolicy`, `OwnershipStrengthQosPolicy`, `LivelinessQosPolicy`, `TimeBasedFilterQosPolicy`, `PartitionQosPolicy`, `ReliabilityQosPolicy`, `DestinationOrderQosPolicy`, `HistoryQosPolicy`, `ResourceLimitsQosPolicy`, `EntityFactoryQosPolicy`, `WriterDataLifecycleQosPolicy`, `ReaderDataLifecycleQosPolicy`, `DurabilityServiceQosPolicy`) + 7 kind enumerations + 7 per-Entity Qos bundles + `QosPolicyId_t` |
| Listeners + Status | §2.2.4 | 12 listeners (`IListener`, `IDataWriterListener`, `IDataReaderListener`, `ITopicListener`, `IPublisherListener`, `ISubscriberListener`, `IDomainParticipantListener`, etc.) + 13 status structs (`InconsistentTopicStatus`, `OfferedDeadlineMissedStatus`, `RequestedDeadlineMissedStatus`, `OfferedIncompatibleQosStatus`, `RequestedIncompatibleQosStatus`, `SampleLostStatus`, `SampleRejectedStatus`, `LivelinessLostStatus`, `LivelinessChangedStatus`, `PublicationMatchedStatus`, `SubscriptionMatchedStatus`, etc.) + `SampleRejectedStatusKind` |
| BuiltinTopicData | §2.2.5 | `ParticipantBuiltinTopicData`, `TopicBuiltinTopicData`, `PublicationBuiltinTopicData`, `SubscriptionBuiltinTopicData` |
| DLRL (optional) | §2.3.3 | `ObjectRoot`, `ObjectHome`, `Selection`, `SelectionListener`, `ObjectListener`, `CacheListener`, `Cache`, `CacheBase`, `CacheAccess`, `CacheFactory`, `CacheDescription`, `Collection`, `List`, `Set`, `StrMap`, `IntMap`, `RelationDescription`, `ListRelationDescription`, `IntMapRelationDescription`, `StrMapRelationDescription`, `Contract`, `SelectionCriterion`, `FilterCriterion`, `QueryCriterion`, `DLRLOid`, `DLRLOidGenerator`, plus `ReferenceScope`, `ObjectScope`, `DCPSState`, `CacheUsage`, `ObjectState`, `RelationKind`, `CriterionKind`, `MembershipState`, `CacheKind` enumerations |

Every interface is accompanied by an extensible base class with the same name minus the `I` prefix (e.g., `DomainParticipant`, `Topic`, `DataReader`). The full list and the JSDoc headers citing each §-section live at [`dds.ts`](./dds.ts).

## Dependency Topology

`@amlhubs/dds` is a leaf metamodel in the `@amlhubs` stack. It depends on nothing and projects the OMG DDS 1.4 specification with no transitive import surface.

```
@amlhubs/dds  (this package — leaf, zero dependencies)
```

Downstream agentic-runtime packages may extend any DDS interface or class through ordinary TypeScript inheritance. The `index.ts` namespace barrel re-exports every symbol so consumers may `import { ITopic, IReliabilityQosPolicy, RELIABILITY_QOS_POLICY_KIND } from '@amlhubs/dds'` without addressing internal file structure.

## Installation & Usage

```bash
npm install @amlhubs/dds
```

```typescript
import type {
  IDomainParticipant,
  ITopic,
  IDataWriter,
  IDataReader,
  IReliabilityQosPolicy,
  IDurabilityQosPolicy,
  IDeadlineQosPolicy,
} from '@amlhubs/dds';

import {
  RELIABILITY_QOS_POLICY_KIND,
  DURABILITY_QOS_POLICY_KIND,
} from '@amlhubs/dds';

// Declare a DDS Topic configuration as a typed metamodel instance.
const reliability: IReliabilityQosPolicy = {
  kind: RELIABILITY_QOS_POLICY_KIND.RELIABLE_RELIABILITY_QOS,
  max_blocking_time: { sec: 0, nanosec: 100_000_000 },
};

const durability: IDurabilityQosPolicy = {
  kind: DURABILITY_QOS_POLICY_KIND.TRANSIENT_LOCAL_DURABILITY_QOS,
};
```

The source artifact is [`dds.ts`](./dds.ts). Every interface JSDoc header declares `@standard OMG DDS 1.4 -- formal/2015-04-10` and a `@section §x.y` reference.

## Provenance & Formal References

- [OMG DDS 1.4 specification](https://www.omg.org/spec/DDS/1.4/) — formal/2015-04-10
- [OMG DDS portal](https://www.dds-foundation.org/)
- [Object Management Group home](https://www.omg.org/)
- Local mirror: `spec/formal-15-04-10.txt` (text extract used for §-section citations)

## Version History

| Version | Date | Change Summary |
|---|---|---|
| 0.0.1 | initial publish | Full DDS 1.4 PIM — DCPS Infrastructure (§2.2.2.1–§2.2.2.4), DCPS Communication (§2.2.2.5), QoS Policies (§2.2.3, 22 policies + 7 kinds + 7 bundles), Listeners + Status (§2.2.4, 12 listeners + 13 status structs), BuiltinTopicData (§2.2.5, 4 discovery topics), and DLRL (§2.3.3, 35 metaclasses); 130 metaclasses total |

## License

UNLICENSED — restricted npm access under `@amlhubs` scope at [npm.pkg.github.com](https://npm.pkg.github.com).
