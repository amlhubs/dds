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

// ═══════════════════════════════════════════════════════════════════════════
// BEGIN Implementer #1: DCPS Infrastructure
// (Entity hierarchy + TypeSupport + DomainParticipantFactory +
//  DomainParticipant + Topic family + Publisher + Subscriber +
//  StatusKind / SampleStateKind / ViewStateKind / InstanceStateKind)
// ═══════════════════════════════════════════════════════════════════════════

// ─── 12. StatusKind (§2.2.4.1) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.4.1
 * @metaclass enumeration (bit-mask)
 * @generalization (root)
 * @definition StatusKind is an enumerated type that identifies each concrete
 *   Status type. The communication statuses whose changes can be
 *   communicated to the application depend on the Entity. Read communication
 *   statuses: those that are related to arrival of data, namely
 *   DATA_ON_READERS and DATA_AVAILABLE. Plain communication statuses: all the
 *   others.
 * @ownedAttributes
 *   (closed enumeration of bit-mask flag values; see IDL `dds_dcps.idl`
 *    typedef `unsigned long StatusKind` plus the named const values)
 * @constraints
 *   (none declared in DDS 1.4 §2.2.4.1)
 */
export const STATUS_KIND = {
  INCONSISTENT_TOPIC: "INCONSISTENT_TOPIC",
  OFFERED_DEADLINE_MISSED: "OFFERED_DEADLINE_MISSED",
  REQUESTED_DEADLINE_MISSED: "REQUESTED_DEADLINE_MISSED",
  OFFERED_INCOMPATIBLE_QOS: "OFFERED_INCOMPATIBLE_QOS",
  REQUESTED_INCOMPATIBLE_QOS: "REQUESTED_INCOMPATIBLE_QOS",
  SAMPLE_LOST: "SAMPLE_LOST",
  SAMPLE_REJECTED: "SAMPLE_REJECTED",
  DATA_ON_READERS: "DATA_ON_READERS",
  DATA_AVAILABLE: "DATA_AVAILABLE",
  LIVELINESS_LOST: "LIVELINESS_LOST",
  LIVELINESS_CHANGED: "LIVELINESS_CHANGED",
  PUBLICATION_MATCHED: "PUBLICATION_MATCHED",
  SUBSCRIPTION_MATCHED: "SUBSCRIPTION_MATCHED",
} as const;
export type StatusKind = typeof STATUS_KIND[keyof typeof STATUS_KIND];

// ─── 15. SampleStateKind (§2.2.2.5.1.2) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.2.5.1.2
 * @metaclass enumeration (bit-mask)
 * @generalization (root)
 * @definition For each sample received, the middleware internally maintains a
 *   sample_state relative to each DataReader. The sample_state can either be
 *   READ or NOT_READ. READ indicates that the DataReader has already accessed
 *   that sample by means of read. NOT_READ indicates that the DataReader has
 *   not accessed that sample before. The sample_state will, in general, be
 *   different for each sample in the collection returned by read or take.
 * @constraints
 *   (none declared in DDS 1.4 §2.2.2.5.1.2)
 */
export const SAMPLE_STATE_KIND = {
  READ_SAMPLE_STATE: "READ_SAMPLE_STATE",
  NOT_READ_SAMPLE_STATE: "NOT_READ_SAMPLE_STATE",
} as const;
export type SampleStateKind = typeof SAMPLE_STATE_KIND[keyof typeof SAMPLE_STATE_KIND];

// ─── 14. ViewStateKind (§2.2.2.5.1.8) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.2.5.1.8
 * @metaclass enumeration (bit-mask)
 * @generalization (root)
 * @definition For each instance (identified by the key), the middleware
 *   internally maintains a view_state relative to each DataReader. The
 *   view_state can either be NEW or NOT_NEW. NEW indicates that either this
 *   is the first time that the DataReader has ever accessed samples of that
 *   instance, or else that the DataReader has accessed previous samples of
 *   the instance, but the instance has since been reborn. NOT_NEW indicates
 *   that the DataReader has already accessed samples of the same instance
 *   and that the instance has not been reborn since.
 * @constraints
 *   (none declared in DDS 1.4 §2.2.2.5.1.8)
 */
export const VIEW_STATE_KIND = {
  NEW_VIEW_STATE: "NEW_VIEW_STATE",
  NOT_NEW_VIEW_STATE: "NOT_NEW_VIEW_STATE",
} as const;
export type ViewStateKind = typeof VIEW_STATE_KIND[keyof typeof VIEW_STATE_KIND];

// ─── 13. InstanceStateKind (§2.2.2.5.1.3) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.2.5.1.3
 * @metaclass enumeration (bit-mask)
 * @generalization (root)
 * @definition For each instance the middleware internally maintains an
 *   instance_state. The instance_state can be ALIVE, NOT_ALIVE_DISPOSED or
 *   NOT_ALIVE_NO_WRITERS. ALIVE indicates that (a) samples have been received
 *   for the instance, (b) there are live DataWriter entities writing the
 *   instance, and (c) the instance has not been explicitly disposed (or else
 *   more samples have been received after it was disposed).
 *   NOT_ALIVE_DISPOSED indicates the instance was explicitly disposed by a
 *   DataWriter by means of the dispose operation. NOT_ALIVE_NO_WRITERS
 *   indicates the instance has been declared as not-alive by the DataReader
 *   because it detected that there are no live DataWriter entities writing
 *   that instance.
 * @constraints
 *   (none declared in DDS 1.4 §2.2.2.5.1.3)
 */
export const INSTANCE_STATE_KIND = {
  ALIVE_INSTANCE_STATE: "ALIVE_INSTANCE_STATE",
  NOT_ALIVE_DISPOSED_INSTANCE_STATE: "NOT_ALIVE_DISPOSED_INSTANCE_STATE",
  NOT_ALIVE_NO_WRITERS_INSTANCE_STATE: "NOT_ALIVE_NO_WRITERS_INSTANCE_STATE",
} as const;
export type InstanceStateKind = typeof INSTANCE_STATE_KIND[keyof typeof INSTANCE_STATE_KIND];

// ─── 2. IEntity (§2.2.2.1.1) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.2.1.1
 * @metaclass abstract
 * @generalization (root)
 * @definition This class is the abstract base class for all the DCPS objects
 *   that support QoS policies, a listener and a status condition.
 * @ownedAttributes
 *   (none declared in §2.2.2.1.1)
 * @associationEnds
 *   (none declared in §2.2.2.1.1; QoS, Listener, StatusCondition are
 *    accessed exclusively via the operations below)
 * @operations
 *   set_qos(qos_list : QosPolicy[*]) : ReturnCode_t              -- abstract
 *   get_qos(out qos_list : QosPolicy[*]) : ReturnCode_t          -- abstract
 *   set_listener(a_listener : Listener, mask : StatusKind[*]) : ReturnCode_t -- abstract
 *   get_listener() : Listener                                     -- abstract
 *   enable() : ReturnCode_t
 *   get_statuscondition() : StatusCondition
 *   get_status_changes() : StatusKind[*]
 *   get_instance_handle() : InstanceHandle_t
 * @constraints
 *   (none declared in DDS 1.4 §2.2.2.1.1)
 */
export interface IEntity {
  // -- Operations (abstract on the metaclass) --
  setQos(qosList: ReadonlyArray<string>): string;
  getQos(): ReadonlyArray<string>;
  setListener(aListener: string | undefined, mask: ReadonlyArray<StatusKind>): string;
  getListener(): string | undefined;
  enable(): string;
  getStatuscondition(): string | undefined;
  getStatusChanges(): ReadonlyArray<StatusKind>;
  getInstanceHandle(): string | undefined;
}

// ─── 1. IDomainEntity (§2.2.2.1.2) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.2.1.2
 * @metaclass abstract
 * @generalization IEntity
 * @definition DomainEntity is the abstract base class for all DCPS entities,
 *   except for the DomainParticipant. Its sole purpose is to express that
 *   DomainParticipant is a special kind of Entity, which acts as a container
 *   of all other Entity, but itself cannot contain other DomainParticipant.
 * @ownedAttributes
 *   (none declared in §2.2.2.1.2)
 * @associationEnds
 *   (none declared in §2.2.2.1.2)
 * @operations
 *   (none declared in §2.2.2.1.2)
 * @constraints
 *   (none declared in DDS 1.4 §2.2.2.1.2)
 */
export interface IDomainEntity extends IEntity {
  // structural marker — DomainEntity adds no members of its own;
  // its purpose is to forbid containment of DomainParticipant within
  // DomainParticipant by virtue of its position in the hierarchy.
}

// ─── 3. ITypeSupport (§2.2.2.3.6) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.2.3.6
 * @metaclass abstract
 * @generalization (root)
 * @definition The TypeSupport interface is an abstract interface that has to
 *   be specialized for each concrete type that will be used by the
 *   application. It is required that each implementation of the Service
 *   provides an automatic means to generate this type-specific class from a
 *   description of the type (using IDL for example in the OMG IDL mapping).
 *   A TypeSupport must be registered using the register_type operation on
 *   this type-specific class before it can be used to create Topic objects.
 * @ownedAttributes
 *   (none declared in §2.2.2.3.6)
 * @associationEnds
 *   (none declared in §2.2.2.3.6)
 * @operations
 *   register_type(participant : DomainParticipant, type_name : String) : ReturnCode_t
 *   get_type_name() : String
 * @constraints
 *   [precondition_unique_type_name]: It is a pre-condition error to use the
 *     same type_name to register two different TypeSupport with the same
 *     DomainParticipant. If an application attempts this, the operation
 *     will fail and return PRECONDITION_NOT_MET. (DDS 1.4 §2.2.2.3.6.1)
 */
export interface ITypeSupport {
  registerType(participantId: string, typeName: string | undefined): string;
  getTypeName(): string;
}

// ─── 4. IDomainParticipantFactory (§2.2.2.2.2) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.2.2.2
 * @metaclass concrete
 * @generalization (root) -- not an Entity (DDS 1.4 §2.2.2.2.2.7 explicitly
 *   notes "the DomainParticipantFactory is not an Entity")
 * @definition The sole purpose of this class is to allow the creation and
 *   destruction of DomainParticipant objects. DomainParticipantFactory
 *   itself has no factory. It is a pre-existing singleton object that can be
 *   accessed by means of the get_instance class operation on the
 *   DomainParticipantFactory.
 * @ownedAttributes
 *   (none declared in §2.2.2.2.2)
 * @associationEnds
 *   (none declared in §2.2.2.2.2; participants are tracked internally and
 *    looked up by domain_id via lookup_participant)
 * @operations
 *   create_participant(domain_id : DomainId_t, qos_list : QosPolicy[*],
 *                      a_listener : DomainParticipantListener,
 *                      mask : StatusKind[*]) : DomainParticipant
 *   delete_participant(a_participant : DomainParticipant) : ReturnCode_t
 *   get_instance() : DomainParticipantFactory                    -- static
 *   lookup_participant(domain_id : DomainId_t) : DomainParticipant
 *   set_default_participant_qos(qos_list : QosPolicy[*]) : ReturnCode_t
 *   get_default_participant_qos(out qos_list : QosPolicy[*]) : ReturnCode_t
 *   set_qos(qos_list : QosPolicy[*]) : ReturnCode_t
 *   get_qos(out qos_list : QosPolicy[*]) : ReturnCode_t
 * @constraints
 *   [singleton]: get_instance is idempotent and returns the same
 *     DomainParticipantFactory instance on every call. (DDS 1.4 §2.2.2.2.2.3)
 *   [delete_precondition]: delete_participant can only be invoked if all
 *     domain entities belonging to the participant have already been
 *     deleted. Otherwise the error PRECONDITION_NOT_MET is returned.
 *     (DDS 1.4 §2.2.2.2.2.2)
 */
export interface IDomainParticipantFactory {
  createParticipant(domainId: number, qosList: ReadonlyArray<string>, aListenerId: string | undefined, mask: ReadonlyArray<StatusKind>): string | undefined;
  deleteParticipant(aParticipantId: string): string;
  lookupParticipant(domainId: number): string | undefined;
  setDefaultParticipantQos(qosList: ReadonlyArray<string>): string;
  getDefaultParticipantQos(): ReadonlyArray<string>;
  setQos(qosList: ReadonlyArray<string>): string;
  getQos(): ReadonlyArray<string>;
}

export class DomainParticipantFactory implements IDomainParticipantFactory {
  readonly metaClass = "DomainParticipantFactory" as const;
  createParticipant(_domainId: number, _qosList: ReadonlyArray<string>, _aListenerId: string | undefined, _mask: ReadonlyArray<StatusKind>): string | undefined { return undefined; }
  deleteParticipant(_aParticipantId: string): string { return "OK"; }
  lookupParticipant(_domainId: number): string | undefined { return undefined; }
  setDefaultParticipantQos(_qosList: ReadonlyArray<string>): string { return "OK"; }
  getDefaultParticipantQos(): ReadonlyArray<string> { return []; }
  setQos(_qosList: ReadonlyArray<string>): string { return "OK"; }
  getQos(): ReadonlyArray<string> { return []; }
}

// ─── 5. IDomainParticipant (§2.2.2.2.1) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.2.2.1
 * @metaclass concrete
 * @generalization IEntity
 * @definition The DomainParticipant object plays several roles. It acts as a
 *   container for all other Entity objects. It acts as factory for the
 *   Publisher, Subscriber, Topic, and MultiTopic Entity objects. It
 *   represents the participation of the application on a communication plane
 *   that isolates applications running on the same set of physical computers
 *   from each other. A domain establishes a "virtual network" linking all
 *   applications that share the same domainId and isolating them from
 *   applications running on different domains. It provides administration
 *   services in the domain, offering operations that allow the application
 *   to `ignore' locally any information about a given participant
 *   (ignore_participant), publication (ignore_publication), subscription
 *   (ignore_subscription), or topic (ignore_topic).
 * @ownedAttributes
 *   (none declared in §2.2.2.2.1)
 * @associationEnds
 *   (none declared explicitly in §2.2.2.2.1; DomainParticipant aggregates
 *    Publisher, Subscriber, Topic, ContentFilteredTopic, MultiTopic
 *    via its create_/delete_ operations and contains_entity)
 * @operations
 *   create_publisher(qos : PublisherQos, a_listener : PublisherListener,
 *                    mask : StatusKind[*]) : Publisher
 *   delete_publisher(p : Publisher) : ReturnCode_t
 *   create_subscriber(qos : SubscriberQos, a_listener : SubscriberListener,
 *                     mask : StatusKind[*]) : Subscriber
 *   delete_subscriber(s : Subscriber) : ReturnCode_t
 *   get_builtin_subscriber() : Subscriber
 *   create_topic(topic_name : String, type_name : String, qos : TopicQos,
 *                a_listener : TopicListener, mask : StatusKind[*]) : Topic
 *   delete_topic(a_topic : Topic) : ReturnCode_t
 *   find_topic(topic_name : String, timeout : Duration_t) : Topic
 *   lookup_topicdescription(name : String) : TopicDescription
 *   create_contentfilteredtopic(name : String, related_topic : Topic,
 *                               filter_expression : String,
 *                               expression_parameters : String[*]) : ContentFilteredTopic
 *   delete_contentfilteredtopic(a_contentfilteredtopic : ContentFilteredTopic) : ReturnCode_t
 *   create_multitopic(name : String, type_name : String,
 *                     subscription_expression : String,
 *                     expression_parameters : String[*]) : MultiTopic
 *   delete_multitopic(a_multitopic : MultiTopic) : ReturnCode_t
 *   delete_contained_entities() : ReturnCode_t
 *   ignore_participant(handle : InstanceHandle_t) : ReturnCode_t
 *   ignore_topic(handle : InstanceHandle_t) : ReturnCode_t
 *   ignore_publication(handle : InstanceHandle_t) : ReturnCode_t
 *   ignore_subscription(handle : InstanceHandle_t) : ReturnCode_t
 *   get_domain_id() : DomainId_t
 *   assert_liveliness() : ReturnCode_t
 *   set_default_publisher_qos(qos : PublisherQos) : ReturnCode_t
 *   get_default_publisher_qos(out qos : PublisherQos) : ReturnCode_t
 *   set_default_subscriber_qos(qos : SubscriberQos) : ReturnCode_t
 *   get_default_subscriber_qos(out qos : SubscriberQos) : ReturnCode_t
 *   set_default_topic_qos(qos : TopicQos) : ReturnCode_t
 *   get_default_topic_qos(out qos : TopicQos) : ReturnCode_t
 *   get_discovered_participants(out participant_handles : InstanceHandle_t[*]) : ReturnCode_t
 *   get_discovered_participant_data(out participant_data : ParticipantBuiltinTopicData,
 *                                   participant_handle : InstanceHandle_t) : ReturnCode_t
 *   get_discovered_topics(out topic_handles : InstanceHandle_t[*]) : ReturnCode_t
 *   get_discovered_topic_data(out topic_data : TopicBuiltinTopicData,
 *                             topic_handle : InstanceHandle_t) : ReturnCode_t
 *   contains_entity(a_handle : InstanceHandle_t) : Boolean
 *   get_current_time(out current_time : Time_t) : ReturnCode_t
 * @constraints
 *   (none declared in DDS 1.4 §2.2.2.2.1; per-operation pre/post-conditions
 *    documented in §2.2.2.2.1.1 .. §2.2.2.2.1.30)
 */
export interface IDomainParticipant extends IEntity {
  createPublisher(qosList: ReadonlyArray<string>, aListenerId: string | undefined, mask: ReadonlyArray<StatusKind>): string | undefined;
  deletePublisher(publisherId: string): string;
  createSubscriber(qosList: ReadonlyArray<string>, aListenerId: string | undefined, mask: ReadonlyArray<StatusKind>): string | undefined;
  deleteSubscriber(subscriberId: string): string;
  getBuiltinSubscriber(): string | undefined;
  createTopic(topicName: string, typeName: string, qosList: ReadonlyArray<string>, aListenerId: string | undefined, mask: ReadonlyArray<StatusKind>): string | undefined;
  deleteTopic(aTopicId: string): string;
  findTopic(topicName: string, timeoutSec: number): string | undefined;
  lookupTopicdescription(name: string): string | undefined;
  createContentfilteredtopic(name: string, relatedTopicId: string, filterExpression: string, expressionParameters: ReadonlyArray<string>): string | undefined;
  deleteContentfilteredtopic(aContentfilteredtopicId: string): string;
  createMultitopic(name: string, typeName: string, subscriptionExpression: string, expressionParameters: ReadonlyArray<string>): string | undefined;
  deleteMultitopic(aMultitopicId: string): string;
  deleteContainedEntities(): string;
  ignoreParticipant(handle: string): string;
  ignoreTopic(handle: string): string;
  ignorePublication(handle: string): string;
  ignoreSubscription(handle: string): string;
  getDomainId(): number;
  assertLiveliness(): string;
  setDefaultPublisherQos(qosList: ReadonlyArray<string>): string;
  getDefaultPublisherQos(): ReadonlyArray<string>;
  setDefaultSubscriberQos(qosList: ReadonlyArray<string>): string;
  getDefaultSubscriberQos(): ReadonlyArray<string>;
  setDefaultTopicQos(qosList: ReadonlyArray<string>): string;
  getDefaultTopicQos(): ReadonlyArray<string>;
  getDiscoveredParticipants(): ReadonlyArray<string>;
  getDiscoveredParticipantData(participantHandle: string): string | undefined;
  getDiscoveredTopics(): ReadonlyArray<string>;
  getDiscoveredTopicData(topicHandle: string): string | undefined;
  containsEntity(aHandle: string): boolean;
  getCurrentTime(): string | undefined;
}

export class DomainParticipant implements IDomainParticipant {
  readonly metaClass = "DomainParticipant" as const;
  // -- IEntity --
  setQos(_qosList: ReadonlyArray<string>): string { return "OK"; }
  getQos(): ReadonlyArray<string> { return []; }
  setListener(_aListener: string | undefined, _mask: ReadonlyArray<StatusKind>): string { return "OK"; }
  getListener(): string | undefined { return undefined; }
  enable(): string { return "OK"; }
  getStatuscondition(): string | undefined { return undefined; }
  getStatusChanges(): ReadonlyArray<StatusKind> { return []; }
  getInstanceHandle(): string | undefined { return undefined; }
  // -- IDomainParticipant --
  createPublisher(_qosList: ReadonlyArray<string>, _aListenerId: string | undefined, _mask: ReadonlyArray<StatusKind>): string | undefined { return undefined; }
  deletePublisher(_publisherId: string): string { return "OK"; }
  createSubscriber(_qosList: ReadonlyArray<string>, _aListenerId: string | undefined, _mask: ReadonlyArray<StatusKind>): string | undefined { return undefined; }
  deleteSubscriber(_subscriberId: string): string { return "OK"; }
  getBuiltinSubscriber(): string | undefined { return undefined; }
  createTopic(_topicName: string, _typeName: string, _qosList: ReadonlyArray<string>, _aListenerId: string | undefined, _mask: ReadonlyArray<StatusKind>): string | undefined { return undefined; }
  deleteTopic(_aTopicId: string): string { return "OK"; }
  findTopic(_topicName: string, _timeoutSec: number): string | undefined { return undefined; }
  lookupTopicdescription(_name: string): string | undefined { return undefined; }
  createContentfilteredtopic(_name: string, _relatedTopicId: string, _filterExpression: string, _expressionParameters: ReadonlyArray<string>): string | undefined { return undefined; }
  deleteContentfilteredtopic(_aContentfilteredtopicId: string): string { return "OK"; }
  createMultitopic(_name: string, _typeName: string, _subscriptionExpression: string, _expressionParameters: ReadonlyArray<string>): string | undefined { return undefined; }
  deleteMultitopic(_aMultitopicId: string): string { return "OK"; }
  deleteContainedEntities(): string { return "OK"; }
  ignoreParticipant(_handle: string): string { return "OK"; }
  ignoreTopic(_handle: string): string { return "OK"; }
  ignorePublication(_handle: string): string { return "OK"; }
  ignoreSubscription(_handle: string): string { return "OK"; }
  getDomainId(): number { return 0; }
  assertLiveliness(): string { return "OK"; }
  setDefaultPublisherQos(_qosList: ReadonlyArray<string>): string { return "OK"; }
  getDefaultPublisherQos(): ReadonlyArray<string> { return []; }
  setDefaultSubscriberQos(_qosList: ReadonlyArray<string>): string { return "OK"; }
  getDefaultSubscriberQos(): ReadonlyArray<string> { return []; }
  setDefaultTopicQos(_qosList: ReadonlyArray<string>): string { return "OK"; }
  getDefaultTopicQos(): ReadonlyArray<string> { return []; }
  getDiscoveredParticipants(): ReadonlyArray<string> { return []; }
  getDiscoveredParticipantData(_participantHandle: string): string | undefined { return undefined; }
  getDiscoveredTopics(): ReadonlyArray<string> { return []; }
  getDiscoveredTopicData(_topicHandle: string): string | undefined { return undefined; }
  containsEntity(_aHandle: string): boolean { return false; }
  getCurrentTime(): string | undefined { return undefined; }
}

// ─── 6. ITopicDescription (§2.2.2.3.1) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.2.3.1
 * @metaclass abstract
 * @generalization (root)
 * @definition This class is an abstract class. It is the base class for
 *   Topic, ContentFilteredTopic, and MultiTopic. TopicDescription represents
 *   the fact that both publications and subscriptions are tied to a single
 *   data-type. Its attribute type_name defines a unique resulting type for
 *   the publication or the subscription and therefore creates an implicit
 *   association with a TypeSupport. TopicDescription has also a name that
 *   allows it to be retrieved locally.
 * @ownedAttributes
 *   readonly: name : String [1]
 *   readonly: type_name : String [1]
 * @associationEnds
 *   participant : DomainParticipant [1] (accessed via get_participant)
 * @operations
 *   get_participant() : DomainParticipant
 *   get_type_name() : String
 *   get_name() : String
 * @constraints
 *   (none declared in DDS 1.4 §2.2.2.3.1)
 */
export interface ITopicDescription {
  readonly name: string;
  readonly typeName: string;
  // -- Operations --
  getParticipant(): string | undefined;
  getTypeName(): string;
  getName(): string;
}

// ─── 7. ITopic (§2.2.2.3.2) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.2.3.2
 * @metaclass concrete
 * @generalization IEntity, ITopicDescription
 * @definition Topic is the most basic description of the data to be
 *   published and subscribed. A Topic is identified by its name, which must
 *   be unique in the whole Domain. In addition (by virtue of extending
 *   TopicDescription) it fully specifies the type of the data that can be
 *   communicated when publishing or subscribing to the Topic. Topic is the
 *   only TopicDescription that can be used for publications and therefore
 *   associated to a DataWriter.
 * @ownedAttributes
 *   (inherits TopicDescription's name and type_name)
 * @associationEnds
 *   (inherited; participant via TopicDescription::get_participant)
 * @operations
 *   set_qos(qos : TopicQos) : ReturnCode_t                       (overrides Entity)
 *   get_qos(out qos : TopicQos) : ReturnCode_t                   (overrides Entity)
 *   set_listener(a_listener : TopicListener, mask : StatusKind[*]) : ReturnCode_t
 *   get_listener() : TopicListener
 *   get_inconsistent_topic_status(out a_status : InconsistentTopicStatus) : ReturnCode_t
 * @constraints
 *   [name_unique_in_domain]: A Topic is identified by its name, which must
 *     be unique in the whole Domain. (DDS 1.4 §2.2.2.3.2)
 *   [not_enabled_return]: All operations except for the base-class
 *     operations set_qos, get_qos, set_listener, get_listener, enable and
 *     get_status_condition may return the value NOT_ENABLED.
 *     (DDS 1.4 §2.2.2.3.2)
 */
export interface ITopic extends IEntity, ITopicDescription {
  getInconsistentTopicStatus(): string | undefined;
}

export class Topic implements ITopic {
  readonly metaClass = "Topic" as const;
  readonly name: string;
  readonly typeName: string;
  constructor(data: { name: string; typeName: string }) {
    this.name = data.name;
    this.typeName = data.typeName;
  }
  // -- IEntity --
  setQos(_qosList: ReadonlyArray<string>): string { return "OK"; }
  getQos(): ReadonlyArray<string> { return []; }
  setListener(_aListener: string | undefined, _mask: ReadonlyArray<StatusKind>): string { return "OK"; }
  getListener(): string | undefined { return undefined; }
  enable(): string { return "OK"; }
  getStatuscondition(): string | undefined { return undefined; }
  getStatusChanges(): ReadonlyArray<StatusKind> { return []; }
  getInstanceHandle(): string | undefined { return undefined; }
  // -- ITopicDescription --
  getParticipant(): string | undefined { return undefined; }
  getTypeName(): string { return this.typeName; }
  getName(): string { return this.name; }
  // -- ITopic --
  getInconsistentTopicStatus(): string | undefined { return undefined; }
}

// ─── 8. IContentFilteredTopic (§2.2.2.3.3) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.2.3.3
 * @metaclass concrete
 * @generalization ITopicDescription
 * @definition ContentFilteredTopic is a specialization of TopicDescription
 *   that allows for content-based subscriptions. ContentFilteredTopic
 *   describes a more sophisticated subscription that indicates the
 *   subscriber does not want to necessarily see all values of each instance
 *   published under the Topic. Rather, it wants to see only the values whose
 *   contents satisfy certain criteria. This class therefore can be used to
 *   request content-based subscriptions. The selection of the content is
 *   done using the filter_expression with parameters expression_parameters.
 * @ownedAttributes
 *   readonly: filter_expression : String [1]
 *   (inherits name, type_name from TopicDescription)
 * @associationEnds
 *   relatedTopic : Topic [1] (accessed via get_related_topic)
 * @operations
 *   get_related_topic() : Topic
 *   get_expression_parameters(out expression_parameters : String[*]) : ReturnCode_t
 *   set_expression_parameters(expression_parameters : String[*]) : ReturnCode_t
 * @constraints
 *   [parameter_count_matches_expression]: The number of supplied parameters
 *     must fit with the requested values in the filter_expression (i.e., the
 *     number of %n tokens). (DDS 1.4 §2.2.2.3.3)
 */
export interface IContentFilteredTopic extends ITopicDescription {
  readonly filterExpression: string;
  // -- Operations --
  getRelatedTopic(): string;
  getExpressionParameters(): ReadonlyArray<string>;
  setExpressionParameters(expressionParameters: ReadonlyArray<string>): string;
}

export class ContentFilteredTopic implements IContentFilteredTopic {
  readonly metaClass = "ContentFilteredTopic" as const;
  readonly name: string;
  readonly typeName: string;
  readonly filterExpression: string;
  readonly relatedTopicId: string;
  constructor(data: { name: string; typeName: string; filterExpression: string; relatedTopicId: string }) {
    this.name = data.name;
    this.typeName = data.typeName;
    this.filterExpression = data.filterExpression;
    this.relatedTopicId = data.relatedTopicId;
  }
  // -- ITopicDescription --
  getParticipant(): string | undefined { return undefined; }
  getTypeName(): string { return this.typeName; }
  getName(): string { return this.name; }
  // -- IContentFilteredTopic --
  getRelatedTopic(): string { return this.relatedTopicId; }
  getExpressionParameters(): ReadonlyArray<string> { return []; }
  setExpressionParameters(_expressionParameters: ReadonlyArray<string>): string { return "OK"; }
}

// ─── 9. IMultiTopic (§2.2.2.3.4) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.2.3.4
 * @metaclass concrete (optional profile)
 * @generalization ITopicDescription
 * @definition MultiTopic is a specialization of TopicDescription that allows
 *   subscriptions to combine/filter/rearrange data coming from several
 *   topics. MultiTopic allows a more sophisticated subscription that can
 *   select and combine data received from multiple topics into a single
 *   resulting type (specified by the inherited type_name). The data will
 *   then be filtered (selection) and possibly re-arranged
 *   (aggregation/projection) according to a subscription_expression with
 *   parameters expression_parameters.
 * @ownedAttributes
 *   readonly: subscription_expression : String [1]
 *   (inherits name, type_name from TopicDescription)
 * @associationEnds
 *   (none declared in §2.2.2.3.4 beyond TopicDescription's participant)
 * @operations
 *   get_expression_parameters(out expression_parameters : String[*]) : ReturnCode_t
 *   set_expression_parameters(expression_parameters : String[*]) : ReturnCode_t
 * @constraints
 *   [optional_profile]: MultiTopic Class is marked [optional] in §2.2.2.3.4.
 *   [parameter_count_matches_expression]: The number of supplied parameters
 *     must fit with the requested values in the subscription_expression
 *     (i.e., the number of %n tokens). (DDS 1.4 §2.2.2.3.4)
 *   [view_state_aggregation]: The view_state of the MultiTopic instance is
 *     NEW if at least one of the constituting instances has view_state =
 *     NEW, otherwise it will be NOT_NEW. (DDS 1.4 §2.2.2.3.4)
 *   [instance_state_aggregation]: The instance_state of the MultiTopic
 *     instance is "ALIVE" if the instance_state of all the constituting
 *     Topic instances is ALIVE. It is "NOT_ALIVE_DISPOSED" if at least one
 *     of the constituting Topic instances is NOT_ALIVE_DISPOSED. Otherwise
 *     it is NOT_ALIVE_NO_WRITERS. (DDS 1.4 §2.2.2.3.4)
 */
export interface IMultiTopic extends ITopicDescription {
  readonly subscriptionExpression: string;
  // -- Operations --
  getExpressionParameters(): ReadonlyArray<string>;
  setExpressionParameters(expressionParameters: ReadonlyArray<string>): string;
}

export class MultiTopic implements IMultiTopic {
  readonly metaClass = "MultiTopic" as const;
  readonly name: string;
  readonly typeName: string;
  readonly subscriptionExpression: string;
  constructor(data: { name: string; typeName: string; subscriptionExpression: string }) {
    this.name = data.name;
    this.typeName = data.typeName;
    this.subscriptionExpression = data.subscriptionExpression;
  }
  // -- ITopicDescription --
  getParticipant(): string | undefined { return undefined; }
  getTypeName(): string { return this.typeName; }
  getName(): string { return this.name; }
  // -- IMultiTopic --
  getExpressionParameters(): ReadonlyArray<string> { return []; }
  setExpressionParameters(_expressionParameters: ReadonlyArray<string>): string { return "OK"; }
}

// ─── 10. IPublisher (§2.2.2.4.1) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.2.4.1
 * @metaclass concrete
 * @generalization IEntity (per IDL `interface Publisher : Entity`).
 *   Note: §2.2.1.1.4 Class Hierarchies positions Publisher as a DomainEntity
 *   subclass; the IDL projection collapses DomainEntity and inherits Entity
 *   directly. This implementation follows the IDL.
 * @definition A Publisher is the object responsible for the actual
 *   dissemination of publications. The Publisher acts on the behalf of one
 *   or several DataWriter objects that belong to it. When it is informed of
 *   a change to the data associated with one of its DataWriter objects, it
 *   decides when it is appropriate to actually send the data-update message.
 *   In making this decision, it considers any extra information that goes
 *   with the data (timestamp, writer, etc.) as well as the QoS of the
 *   Publisher and the DataWriter.
 * @ownedAttributes
 *   (none declared in §2.2.2.4.1)
 * @associationEnds
 *   (none declared explicitly in §2.2.2.4.1; Publisher aggregates DataWriter
 *    via create_/delete_ operations and lookup_datawriter)
 * @operations
 *   create_datawriter(a_topic : Topic, qos : DataWriterQos,
 *                     a_listener : DataWriterListener,
 *                     mask : StatusKind[*]) : DataWriter
 *   delete_datawriter(a_datawriter : DataWriter) : ReturnCode_t
 *   lookup_datawriter(topic_name : String) : DataWriter
 *   suspend_publications() : ReturnCode_t
 *   resume_publications() : ReturnCode_t
 *   begin_coherent_changes() : ReturnCode_t
 *   end_coherent_changes() : ReturnCode_t
 *   wait_for_acknowledgments(max_wait : Duration_t) : ReturnCode_t
 *   get_participant() : DomainParticipant
 *   delete_contained_entities() : ReturnCode_t
 *   set_default_datawriter_qos(qos_list : DataWriterQos) : ReturnCode_t
 *   get_default_datawriter_qos(out qos_list : DataWriterQos) : ReturnCode_t
 *   copy_from_topic_qos(inout a_datawriter_qos : DataWriterQos,
 *                       a_topic_qos : TopicQos) : ReturnCode_t
 * @constraints
 *   [not_enabled_return]: All operations except for the base-class
 *     operations set_qos, get_qos, set_listener, get_listener, enable,
 *     get_statuscondition, create_datawriter, and delete_datawriter may
 *     return the value NOT_ENABLED. (DDS 1.4 §2.2.2.4.1)
 *   [topic_same_participant]: The Topic passed to create_datawriter must
 *     have been created from the same DomainParticipant that was used to
 *     create this Publisher. If the Topic was created from a different
 *     DomainParticipant, the operation will fail and return a nil result.
 *     (DDS 1.4 §2.2.2.4.1.5)
 */
export interface IPublisher extends IEntity {
  createDatawriter(aTopicId: string, qosList: ReadonlyArray<string>, aListenerId: string | undefined, mask: ReadonlyArray<StatusKind>): string | undefined;
  deleteDatawriter(aDatawriterId: string): string;
  lookupDatawriter(topicName: string): string | undefined;
  suspendPublications(): string;
  resumePublications(): string;
  beginCoherentChanges(): string;
  endCoherentChanges(): string;
  waitForAcknowledgments(maxWaitSec: number): string;
  getParticipant(): string | undefined;
  deleteContainedEntities(): string;
  setDefaultDatawriterQos(qosList: ReadonlyArray<string>): string;
  getDefaultDatawriterQos(): ReadonlyArray<string>;
  copyFromTopicQos(aDatawriterQos: ReadonlyArray<string>, aTopicQos: ReadonlyArray<string>): ReadonlyArray<string>;
}

export class Publisher implements IPublisher {
  readonly metaClass = "Publisher" as const;
  // -- IEntity --
  setQos(_qosList: ReadonlyArray<string>): string { return "OK"; }
  getQos(): ReadonlyArray<string> { return []; }
  setListener(_aListener: string | undefined, _mask: ReadonlyArray<StatusKind>): string { return "OK"; }
  getListener(): string | undefined { return undefined; }
  enable(): string { return "OK"; }
  getStatuscondition(): string | undefined { return undefined; }
  getStatusChanges(): ReadonlyArray<StatusKind> { return []; }
  getInstanceHandle(): string | undefined { return undefined; }
  // -- IPublisher --
  createDatawriter(_aTopicId: string, _qosList: ReadonlyArray<string>, _aListenerId: string | undefined, _mask: ReadonlyArray<StatusKind>): string | undefined { return undefined; }
  deleteDatawriter(_aDatawriterId: string): string { return "OK"; }
  lookupDatawriter(_topicName: string): string | undefined { return undefined; }
  suspendPublications(): string { return "OK"; }
  resumePublications(): string { return "OK"; }
  beginCoherentChanges(): string { return "OK"; }
  endCoherentChanges(): string { return "OK"; }
  waitForAcknowledgments(_maxWaitSec: number): string { return "OK"; }
  getParticipant(): string | undefined { return undefined; }
  deleteContainedEntities(): string { return "OK"; }
  setDefaultDatawriterQos(_qosList: ReadonlyArray<string>): string { return "OK"; }
  getDefaultDatawriterQos(): ReadonlyArray<string> { return []; }
  copyFromTopicQos(aDatawriterQos: ReadonlyArray<string>, _aTopicQos: ReadonlyArray<string>): ReadonlyArray<string> { return aDatawriterQos; }
}

// ─── 11. ISubscriber (§2.2.2.5.2) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.2.5.2
 * @metaclass concrete
 * @generalization IDomainEntity (per §2.2.1.1.4 Class Hierarchies; the
 *   IDL projection inherits Entity directly because DomainEntity is a
 *   structural marker without owned members. The TypeScript surface
 *   declares the IDomainEntity supertype to preserve the spec hierarchy.)
 * @definition A Subscriber is the object responsible for the actual
 *   reception of the data resulting from its subscriptions. A Subscriber
 *   acts on the behalf of one or several DataReader objects that are
 *   related to it. When it receives data (from the other parts of the
 *   system), it builds the list of concerned DataReader objects, and then
 *   indicates to the application that data is available, through its
 *   listener or by enabling related conditions. The application can access
 *   the list of concerned DataReader objects through the operation
 *   get_datareaders and then access the data available though operations on
 *   the DataReader.
 * @ownedAttributes
 *   (none declared in §2.2.2.5.2)
 * @associationEnds
 *   (none declared explicitly in §2.2.2.5.2; Subscriber aggregates
 *    DataReader via create_/delete_/lookup_datareader)
 * @operations
 *   create_datareader(a_topic : TopicDescription, qos : DataReaderQos,
 *                     a_listener : DataReaderListener,
 *                     mask : StatusKind[*]) : DataReader
 *   delete_datareader(a_datareader : DataReader) : ReturnCode_t
 *   lookup_datareader(topic_name : String) : DataReader
 *   begin_access() : ReturnCode_t
 *   end_access() : ReturnCode_t
 *   get_datareaders(out readers : DataReader[*],
 *                   sample_states : SampleStateKind[*],
 *                   view_states : ViewStateKind[*],
 *                   instance_states : InstanceStateKind[*]) : ReturnCode_t
 *   notify_datareaders() : ReturnCode_t
 *   get_participant() : DomainParticipant
 *   delete_contained_entities() : ReturnCode_t
 *   set_default_datareader_qos(qos_list : DataReaderQos) : ReturnCode_t
 *   get_default_datareader_qos(out qos_list : DataReaderQos) : ReturnCode_t
 *   copy_from_topic_qos(inout a_datareader_qos : DataReaderQos,
 *                       a_topic_qos : TopicQos) : ReturnCode_t
 * @constraints
 *   [not_enabled_return]: All operations except for the base-class
 *     operations set_qos, get_qos, set_listener, get_listener, enable,
 *     get_statuscondition, and create_datareader may return the value
 *     NOT_ENABLED. (DDS 1.4 §2.2.2.5.2)
 *   [topicdesc_same_participant]: The TopicDescription passed to
 *     create_datareader must have been created from the same
 *     DomainParticipant that was used to create this Subscriber. If the
 *     TopicDescription was created from a different DomainParticipant, the
 *     operation will fail and return a nil result. (DDS 1.4 §2.2.2.5.2.5)
 *   [presentation_group_begin_end_access]: begin_access / end_access are
 *     required only if PRESENTATION QosPolicy of the Subscriber to which
 *     the DataReader belongs has access_scope set to GROUP.
 *     (DDS 1.4 §2.2.2.5.2.8 / §2.2.2.5.2.9)
 */
export interface ISubscriber extends IDomainEntity {
  createDatareader(aTopicDescriptionId: string, qosList: ReadonlyArray<string>, aListenerId: string | undefined, mask: ReadonlyArray<StatusKind>): string | undefined;
  deleteDatareader(aDatareaderId: string): string;
  lookupDatareader(topicName: string): string | undefined;
  beginAccess(): string;
  endAccess(): string;
  getDatareaders(sampleStates: ReadonlyArray<SampleStateKind>, viewStates: ReadonlyArray<ViewStateKind>, instanceStates: ReadonlyArray<InstanceStateKind>): ReadonlyArray<string>;
  notifyDatareaders(): string;
  getParticipant(): string | undefined;
  deleteContainedEntities(): string;
  setDefaultDatareaderQos(qosList: ReadonlyArray<string>): string;
  getDefaultDatareaderQos(): ReadonlyArray<string>;
  copyFromTopicQos(aDatareaderQos: ReadonlyArray<string>, aTopicQos: ReadonlyArray<string>): ReadonlyArray<string>;
}

export class Subscriber implements ISubscriber {
  readonly metaClass = "Subscriber" as const;
  // -- IEntity (via IDomainEntity) --
  setQos(_qosList: ReadonlyArray<string>): string { return "OK"; }
  getQos(): ReadonlyArray<string> { return []; }
  setListener(_aListener: string | undefined, _mask: ReadonlyArray<StatusKind>): string { return "OK"; }
  getListener(): string | undefined { return undefined; }
  enable(): string { return "OK"; }
  getStatuscondition(): string | undefined { return undefined; }
  getStatusChanges(): ReadonlyArray<StatusKind> { return []; }
  getInstanceHandle(): string | undefined { return undefined; }
  // -- ISubscriber --
  createDatareader(_aTopicDescriptionId: string, _qosList: ReadonlyArray<string>, _aListenerId: string | undefined, _mask: ReadonlyArray<StatusKind>): string | undefined { return undefined; }
  deleteDatareader(_aDatareaderId: string): string { return "OK"; }
  lookupDatareader(_topicName: string): string | undefined { return undefined; }
  beginAccess(): string { return "OK"; }
  endAccess(): string { return "OK"; }
  getDatareaders(_sampleStates: ReadonlyArray<SampleStateKind>, _viewStates: ReadonlyArray<ViewStateKind>, _instanceStates: ReadonlyArray<InstanceStateKind>): ReadonlyArray<string> { return []; }
  notifyDatareaders(): string { return "OK"; }
  getParticipant(): string | undefined { return undefined; }
  deleteContainedEntities(): string { return "OK"; }
  setDefaultDatareaderQos(_qosList: ReadonlyArray<string>): string { return "OK"; }
  getDefaultDatareaderQos(): ReadonlyArray<string> { return []; }
  copyFromTopicQos(aDatareaderQos: ReadonlyArray<string>, _aTopicQos: ReadonlyArray<string>): ReadonlyArray<string> { return aDatareaderQos; }
}

// ═══════════════════════════════════════════════════════════════════════════
// — END Implementer #1: DCPS Infrastructure —
// ═══════════════════════════════════════════════════════════════════════════
