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

// ═══════════════════════════════════════════════════════════════════════════
// BEGIN Implementer #2: DCPS Communication
// (DataWriter + DataReader + SampleInfo + InstanceHandle_t +
//  BuiltinTopicKey_t + Condition / GuardCondition / StatusCondition /
//  ReadCondition / QueryCondition + WaitSet + ReturnCode_t + Duration_t +
//  Time_t + SampleStateMask / ViewStateMask / InstanceStateMask)
// ═══════════════════════════════════════════════════════════════════════════

// ─── 16. ReturnCode_t (§2.3.3 supporting types — `typedef long ReturnCode_t`) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.3.3
 * @metaclass enumeration (closed const-set)
 * @generalization (root)
 * @definition Return code values used by every operation that can fail.
 *   Defined in the DCPS PSM IDL (§2.3.3) as `typedef long ReturnCode_t` plus
 *   the named const values RETCODE_OK ... RETCODE_ILLEGAL_OPERATION. The PIM
 *   class diagrams reference ReturnCode_t directly as the operation return
 *   type for every status-bearing operation.
 * @ownedAttributes
 *   (closed enumeration of constant values; see DCPS IDL `typedef long
 *    ReturnCode_t` and the named const values)
 * @constraints
 *   (none declared in DDS 1.4 §2.3.3)
 */
export const RETURN_CODE = {
  RETCODE_OK: "RETCODE_OK",
  RETCODE_ERROR: "RETCODE_ERROR",
  RETCODE_UNSUPPORTED: "RETCODE_UNSUPPORTED",
  RETCODE_BAD_PARAMETER: "RETCODE_BAD_PARAMETER",
  RETCODE_PRECONDITION_NOT_MET: "RETCODE_PRECONDITION_NOT_MET",
  RETCODE_OUT_OF_RESOURCES: "RETCODE_OUT_OF_RESOURCES",
  RETCODE_NOT_ENABLED: "RETCODE_NOT_ENABLED",
  RETCODE_IMMUTABLE_POLICY: "RETCODE_IMMUTABLE_POLICY",
  RETCODE_INCONSISTENT_POLICY: "RETCODE_INCONSISTENT_POLICY",
  RETCODE_ALREADY_DELETED: "RETCODE_ALREADY_DELETED",
  RETCODE_TIMEOUT: "RETCODE_TIMEOUT",
  RETCODE_NO_DATA: "RETCODE_NO_DATA",
  RETCODE_ILLEGAL_OPERATION: "RETCODE_ILLEGAL_OPERATION",
} as const;
export type ReturnCode_t = typeof RETURN_CODE[keyof typeof RETURN_CODE];

// ─── 17. Duration_t (§2.3.3 supporting types — `struct Duration_t`) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.3.3
 * @metaclass concrete (struct)
 * @generalization (root)
 * @definition Duration_t is the structured type used to represent a span of
 *   time. It is composed of a long sec field and an unsigned long nanosec
 *   field. The DCPS IDL defines pre-defined values DURATION_INFINITE
 *   (sec = 0x7fffffff, nanosec = 0x7fffffff) and DURATION_ZERO (sec = 0,
 *   nanosec = 0).
 * @ownedAttributes
 *   sec : long [1]
 *   nanosec : unsigned long [1]
 * @associationEnds
 *   (none declared in §2.3.3)
 * @operations
 *   (none declared in §2.3.3)
 * @constraints
 *   (none declared in DDS 1.4 §2.3.3)
 */
export interface IDuration_t {
  readonly sec: number;
  readonly nanosec: number;
}

export class Duration_t implements IDuration_t {
  readonly metaClass = "Duration_t" as const;
  readonly sec: number;
  readonly nanosec: number;
  constructor(data: { sec: number; nanosec: number }) {
    this.sec = data.sec;
    this.nanosec = data.nanosec;
  }
}

/** DDS 1.4 §2.3.3 — `const long DURATION_INFINITE_SEC = 0x7fffffff;
 *  const unsigned long DURATION_INFINITE_NSEC = 0x7fffffff;` */
export const DURATION_INFINITE: IDuration_t = { sec: 0x7fffffff, nanosec: 0x7fffffff };

/** DDS 1.4 §2.3.3 — `const long DURATION_ZERO_SEC = 0;
 *  const unsigned long DURATION_ZERO_NSEC = 0;` */
export const DURATION_ZERO: IDuration_t = { sec: 0, nanosec: 0 };

// ─── 18. Time_t (§2.3.3 supporting types — `struct Time_t`) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.3.3
 * @metaclass concrete (struct)
 * @generalization (root)
 * @definition Time_t is the structured type used to represent a moment in
 *   time. It is composed of a long sec field and an unsigned long nanosec
 *   field. The DCPS IDL defines a pre-defined value TIME_INVALID
 *   (sec = -1, nanosec = 0xffffffff).
 * @ownedAttributes
 *   sec : long [1]
 *   nanosec : unsigned long [1]
 * @associationEnds
 *   (none declared in §2.3.3)
 * @operations
 *   (none declared in §2.3.3)
 * @constraints
 *   (none declared in DDS 1.4 §2.3.3)
 */
export interface ITime_t {
  readonly sec: number;
  readonly nanosec: number;
}

export class Time_t implements ITime_t {
  readonly metaClass = "Time_t" as const;
  readonly sec: number;
  readonly nanosec: number;
  constructor(data: { sec: number; nanosec: number }) {
    this.sec = data.sec;
    this.nanosec = data.nanosec;
  }
}

/** DDS 1.4 §2.3.3 — `const long TIME_INVALID_SEC = -1;
 *  const unsigned long TIME_INVALID_NSEC = 0xffffffff;` */
export const TIME_INVALID: ITime_t = { sec: -1, nanosec: 0xffffffff };

// ─── 19. InstanceHandle_t (§2.3.3 supporting types) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.3.3
 * @metaclass concrete (opaque handle)
 * @generalization (root)
 * @definition An opaque handle that identifies an instance locally within a
 *   DDS Service. Defined in the DCPS PSM IDL as
 *   `typedef HANDLE_TYPE_NATIVE InstanceHandle_t` (with
 *   HANDLE_TYPE_NATIVE = long). The DCPS IDL defines a pre-defined value
 *   HANDLE_NIL = HANDLE_NIL_NATIVE (= 0). The special value HANDLE_NIL is
 *   guaranteed to be `less than' any valid instance_handle (DDS 1.4
 *   §2.2.2.5.3.16).
 * @ownedAttributes
 *   value : long [1]
 * @associationEnds
 *   (none declared in §2.3.3)
 * @operations
 *   (none declared in §2.3.3)
 * @constraints
 *   (none declared in DDS 1.4 §2.3.3)
 */
export interface IInstanceHandle_t {
  readonly value: number;
}

export class InstanceHandle_t implements IInstanceHandle_t {
  readonly metaClass = "InstanceHandle_t" as const;
  readonly value: number;
  constructor(data: { value: number }) {
    this.value = data.value;
  }
}

/** DDS 1.4 §2.3.3 — `const InstanceHandle_t HANDLE_NIL = HANDLE_NIL_NATIVE;`
 *  (HANDLE_NIL_NATIVE = 0). HANDLE_NIL is guaranteed to be `less than' any
 *  valid instance_handle. */
export const HANDLE_NIL: IInstanceHandle_t = { value: 0 };

// ─── 20. BuiltinTopicKey_t (§2.3.3 / §2.3.5) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.3.3
 * @metaclass concrete (struct)
 * @generalization (root)
 * @definition BuiltinTopicKey_t is the structured type used as the DCPS key
 *   for built-in topic instances (DCPSParticipant, DCPSTopic,
 *   DCPSPublication, DCPSSubscription). Defined in the DCPS PSM IDL
 *   (§2.3.3) as `struct BuiltinTopicKey_t { BUILTIN_TOPIC_KEY_TYPE_NATIVE
 *   value[3]; };` (with BUILTIN_TOPIC_KEY_TYPE_NATIVE = long). The
 *   ParticipantBuiltinTopicData, TopicBuiltinTopicData,
 *   PublicationBuiltinTopicData, and SubscriptionBuiltinTopicData
 *   structures (§2.3.5) all carry one or two BuiltinTopicKey_t fields to
 *   distinguish entries.
 * @ownedAttributes
 *   value : long[3] [1]
 * @associationEnds
 *   (none declared in §2.3.3)
 * @operations
 *   (none declared in §2.3.3)
 * @constraints
 *   (none declared in DDS 1.4 §2.3.3)
 */
export interface IBuiltinTopicKey_t {
  readonly value: readonly [number, number, number];
}

export class BuiltinTopicKey_t implements IBuiltinTopicKey_t {
  readonly metaClass = "BuiltinTopicKey_t" as const;
  readonly value: readonly [number, number, number];
  constructor(data: { value: readonly [number, number, number] }) {
    this.value = data.value;
  }
}

// ─── 21. SampleStateMask (§2.3.3 / §2.2.2.5.1.2) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.3.3
 * @metaclass alias (bit-mask of SampleStateKind)
 * @generalization (root)
 * @definition SampleStateMask is the bit-mask form of SampleStateKind. The
 *   DCPS PSM IDL defines `typedef unsigned long SampleStateMask` plus the
 *   pre-defined constant `ANY_SAMPLE_STATE = 0xffff`. At the PIM level it is
 *   a sequence of SampleStateKind literals (READ_SAMPLE_STATE,
 *   NOT_READ_SAMPLE_STATE) consumed by DataReader::read,
 *   DataReader::take, and ReadCondition.
 * @constraints
 *   (none declared in DDS 1.4 §2.3.3)
 */
export type SampleStateMask = ReadonlyArray<SampleStateKind>;

/** DDS 1.4 §2.3.3 — `const SampleStateMask ANY_SAMPLE_STATE = 0xffff;`
 *  PIM projection: the union of every SampleStateKind literal. */
export const ANY_SAMPLE_STATE: SampleStateMask = [
  SAMPLE_STATE_KIND.READ_SAMPLE_STATE,
  SAMPLE_STATE_KIND.NOT_READ_SAMPLE_STATE,
];

// ─── 22. ViewStateMask (§2.3.3 / §2.2.2.5.1.8) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.3.3
 * @metaclass alias (bit-mask of ViewStateKind)
 * @generalization (root)
 * @definition ViewStateMask is the bit-mask form of ViewStateKind. The DCPS
 *   PSM IDL defines `typedef unsigned long ViewStateMask` plus the pre-
 *   defined constant `ANY_VIEW_STATE = 0xffff`. At the PIM level it is a
 *   sequence of ViewStateKind literals (NEW_VIEW_STATE, NOT_NEW_VIEW_STATE)
 *   consumed by DataReader::read, DataReader::take, and ReadCondition.
 * @constraints
 *   (none declared in DDS 1.4 §2.3.3)
 */
export type ViewStateMask = ReadonlyArray<ViewStateKind>;

/** DDS 1.4 §2.3.3 — `const ViewStateMask ANY_VIEW_STATE = 0xffff;`
 *  PIM projection: the union of every ViewStateKind literal. */
export const ANY_VIEW_STATE: ViewStateMask = [
  VIEW_STATE_KIND.NEW_VIEW_STATE,
  VIEW_STATE_KIND.NOT_NEW_VIEW_STATE,
];

// ─── 23. InstanceStateMask (§2.3.3 / §2.2.2.5.1.3) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.3.3
 * @metaclass alias (bit-mask of InstanceStateKind)
 * @generalization (root)
 * @definition InstanceStateMask is the bit-mask form of InstanceStateKind.
 *   The DCPS PSM IDL defines `typedef unsigned long InstanceStateMask` plus
 *   the pre-defined constants `ANY_INSTANCE_STATE = 0xffff` and
 *   `NOT_ALIVE_INSTANCE_STATE = 0x006`. At the PIM level it is a sequence
 *   of InstanceStateKind literals consumed by DataReader::read,
 *   DataReader::take, and ReadCondition.
 * @constraints
 *   (none declared in DDS 1.4 §2.3.3)
 */
export type InstanceStateMask = ReadonlyArray<InstanceStateKind>;

/** DDS 1.4 §2.3.3 — `const InstanceStateMask ANY_INSTANCE_STATE = 0xffff;`
 *  PIM projection: the union of every InstanceStateKind literal. */
export const ANY_INSTANCE_STATE: InstanceStateMask = [
  INSTANCE_STATE_KIND.ALIVE_INSTANCE_STATE,
  INSTANCE_STATE_KIND.NOT_ALIVE_DISPOSED_INSTANCE_STATE,
  INSTANCE_STATE_KIND.NOT_ALIVE_NO_WRITERS_INSTANCE_STATE,
];

/** DDS 1.4 §2.3.3 — `const InstanceStateMask NOT_ALIVE_INSTANCE_STATE = 0x006;`
 *  PIM projection: the two NOT_ALIVE_* literals (DISPOSED + NO_WRITERS). */
export const NOT_ALIVE_INSTANCE_STATE: InstanceStateMask = [
  INSTANCE_STATE_KIND.NOT_ALIVE_DISPOSED_INSTANCE_STATE,
  INSTANCE_STATE_KIND.NOT_ALIVE_NO_WRITERS_INSTANCE_STATE,
];

// ─── 24. ICondition (§2.2.2.1.7) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.2.1.7
 * @metaclass concrete (root of the Condition hierarchy)
 * @generalization (root)
 * @definition A Condition is a root class for all the conditions that may be
 *   attached to a WaitSet. This basic class is specialized in three classes
 *   that are known by the middleware: GuardCondition (2.2.2.1.8),
 *   StatusCondition (2.2.2.1.9), and ReadCondition (2.2.2.5.8). A Condition
 *   has a trigger_value that can be TRUE or FALSE and is set automatically
 *   by the Service.
 * @ownedAttributes
 *   (none declared in §2.2.2.1.7; trigger_value is read-only via
 *    get_trigger_value)
 * @associationEnds
 *   (none declared in §2.2.2.1.7)
 * @operations
 *   get_trigger_value() : Boolean
 * @constraints
 *   (none declared in DDS 1.4 §2.2.2.1.7)
 */
export interface ICondition {
  // -- Operations --
  getTriggerValue(): boolean;
}

export class Condition implements ICondition {
  readonly metaClass = "Condition" as const;
  getTriggerValue(): boolean { return false; }
}

// ─── 25. IGuardCondition (§2.2.2.1.8) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.2.1.8
 * @metaclass concrete
 * @generalization ICondition
 * @definition A GuardCondition object is a specific Condition whose
 *   trigger_value is completely under the control of the application.
 *   GuardCondition has no factory. It is created as an object directly by
 *   the natural means in each language binding (e.g., using "new" in C++ or
 *   Java. When first created the trigger_value is set to FALSE. The purpose
 *   of the GuardCondition is to provide the means for the application to
 *   manually wakeup a WaitSet. This is accomplished by attaching the
 *   GuardCondition to the WaitSet and then setting the trigger_value by
 *   means of the set_trigger_value operation.
 * @ownedAttributes
 *   (none declared in §2.2.2.1.8; trigger_value is mutable via
 *    set_trigger_value)
 * @associationEnds
 *   (none declared in §2.2.2.1.8)
 * @operations
 *   set_trigger_value(value : Boolean) : ReturnCode_t
 * @constraints
 *   [initial_trigger_value]: When first created the trigger_value is set to
 *     FALSE. (DDS 1.4 §2.2.2.1.8)
 *   [waitset_observation]: WaitSet objects behavior depends on the changes of
 *     the trigger_value of their attached conditions. Therefore, any WaitSet
 *     to which is attached the GuardCondition is potentially affected by
 *     this operation. (DDS 1.4 §2.2.2.1.8.1)
 */
export interface IGuardCondition extends ICondition {
  // -- Operations --
  setTriggerValue(value: boolean): ReturnCode_t;
}

export class GuardCondition implements IGuardCondition {
  readonly metaClass = "GuardCondition" as const;
  getTriggerValue(): boolean { return false; }
  setTriggerValue(_value: boolean): ReturnCode_t { return RETURN_CODE.RETCODE_OK; }
}

// ─── 26. IStatusCondition (§2.2.2.1.9) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.2.1.9
 * @metaclass concrete
 * @generalization ICondition
 * @definition A StatusCondition object is a specific Condition that is
 *   associated with each Entity. The trigger_value of the StatusCondition
 *   depends on the communication status of that entity (e.g., arrival of
 *   data, loss of information, etc.), `filtered' by the set of
 *   enabled_statuses on the StatusCondition.
 * @ownedAttributes
 *   enabled_statuses : StatusKind [*]
 * @associationEnds
 *   entity : Entity [1] (accessed via get_entity)
 * @operations
 *   get_enabled_statuses() : StatusKind[*]
 *   set_enabled_statuses(mask : StatusKind[*]) : ReturnCode_t
 *   get_entity() : Entity
 * @constraints
 *   [default_enabled_statuses]: If set_enabled_statuses is not invoked, the
 *     default list of enabled statuses includes all the statuses.
 *     (DDS 1.4 §2.2.2.1.9.1)
 *   [single_entity]: There is exactly one Entity associated with each
 *     StatusCondition. (DDS 1.4 §2.2.2.1.9.3)
 */
export interface IStatusCondition extends ICondition {
  readonly enabledStatuses: ReadonlyArray<StatusKind>;
  readonly entityId: string;
  // -- Operations --
  getEnabledStatuses(): ReadonlyArray<StatusKind>;
  setEnabledStatuses(mask: ReadonlyArray<StatusKind>): ReturnCode_t;
  getEntity(): string;
}

export class StatusCondition implements IStatusCondition {
  readonly metaClass = "StatusCondition" as const;
  readonly enabledStatuses: ReadonlyArray<StatusKind>;
  readonly entityId: string;
  constructor(data: { enabledStatuses: ReadonlyArray<StatusKind>; entityId: string }) {
    this.enabledStatuses = data.enabledStatuses;
    this.entityId = data.entityId;
  }
  getTriggerValue(): boolean { return false; }
  getEnabledStatuses(): ReadonlyArray<StatusKind> { return this.enabledStatuses; }
  setEnabledStatuses(_mask: ReadonlyArray<StatusKind>): ReturnCode_t { return RETURN_CODE.RETCODE_OK; }
  getEntity(): string { return this.entityId; }
}

// ─── 27. IReadCondition (§2.2.2.5.8) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.2.5.8
 * @metaclass concrete
 * @generalization ICondition
 * @definition ReadCondition objects are conditions specifically dedicated to
 *   read operations and attached to one DataReader. ReadCondition objects
 *   allow an application to specify the data samples it is interested in (by
 *   specifying the desired sample-states, view-states, and instance-states).
 *   See the parameter definitions for DataReader's read/take operations.
 *   This allows the middleware to enable the condition only when suitable
 *   information is available. They are to be used in conjunction with a
 *   WaitSet as normal conditions. More than one ReadCondition may be
 *   attached to the same DataReader.
 * @ownedAttributes
 *   (the masks captured at creation time are immutable; cf. §2.2.2.5.8.2 ..
 *    §2.2.2.5.8.4)
 * @associationEnds
 *   datareader : DataReader [1] (accessed via get_datareader)
 * @operations
 *   get_datareader() : DataReader
 *   get_sample_state_mask() : SampleStateKind[*]
 *   get_view_state_mask() : ViewStateKind[*]
 *   get_instance_state_mask() : InstanceStateKind[*]
 * @constraints
 *   [single_datareader]: There is exactly one DataReader associated with
 *     each ReadCondition. (DDS 1.4 §2.2.2.5.8.1)
 *   [masks_immutable]: get_sample_state_mask, get_view_state_mask,
 *     get_instance_state_mask return the states specified when the
 *     ReadCondition was created. (DDS 1.4 §2.2.2.5.8.2 .. §2.2.2.5.8.4)
 */
export interface IReadCondition extends ICondition {
  readonly sampleStateMask: SampleStateMask;
  readonly viewStateMask: ViewStateMask;
  readonly instanceStateMask: InstanceStateMask;
  readonly datareaderId: string;
  // -- Operations --
  getDatareader(): string;
  getSampleStateMask(): SampleStateMask;
  getViewStateMask(): ViewStateMask;
  getInstanceStateMask(): InstanceStateMask;
}

export class ReadCondition implements IReadCondition {
  readonly metaClass = "ReadCondition" as const;
  readonly sampleStateMask: SampleStateMask;
  readonly viewStateMask: ViewStateMask;
  readonly instanceStateMask: InstanceStateMask;
  readonly datareaderId: string;
  constructor(data: {
    sampleStateMask: SampleStateMask;
    viewStateMask: ViewStateMask;
    instanceStateMask: InstanceStateMask;
    datareaderId: string;
  }) {
    this.sampleStateMask = data.sampleStateMask;
    this.viewStateMask = data.viewStateMask;
    this.instanceStateMask = data.instanceStateMask;
    this.datareaderId = data.datareaderId;
  }
  getTriggerValue(): boolean { return false; }
  getDatareader(): string { return this.datareaderId; }
  getSampleStateMask(): SampleStateMask { return this.sampleStateMask; }
  getViewStateMask(): ViewStateMask { return this.viewStateMask; }
  getInstanceStateMask(): InstanceStateMask { return this.instanceStateMask; }
}

// ─── 28. IQueryCondition (§2.2.2.5.9) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.2.5.9
 * @metaclass concrete (optional profile)
 * @generalization IReadCondition
 * @definition QueryCondition objects are specialized ReadCondition objects
 *   that allow the application to also specify a filter on the locally
 *   available data. The query (query_expression) is similar to an SQL WHERE
 *   clause and can be parameterized by arguments that are dynamically
 *   changeable by the set_query_parameters operation. Precise syntax for
 *   the query expression can be found in Annex B.
 * @ownedAttributes
 *   query_expression : String [1]
 *   query_parameters : String [*]
 * @associationEnds
 *   (inherits ReadCondition::datareader)
 * @operations
 *   get_query_expression() : String
 *   get_query_parameters(out query_parameters : String[*]) : ReturnCode_t
 *   set_query_parameters(query_parameters : String[*]) : ReturnCode_t
 * @constraints
 *   [optional_profile]: This feature is optional. In the cases where it is
 *     not supported, the DataReader::create_querycondition will return a
 *     `nil' value (as specified by the platform). (DDS 1.4 §2.2.2.5.9)
 *   [expression_immutable]: get_query_expression returns the expression
 *     specified when the QueryCondition was created. (DDS 1.4 §2.2.2.5.9.1)
 *   [parameters_initialized]: get_query_parameters returns the parameters
 *     specified on the last successful call to set_query_parameters, or if
 *     set_query_parameters was never called, the arguments specified when
 *     the QueryCondition was created. (DDS 1.4 §2.2.2.5.9.2)
 */
export interface IQueryCondition extends IReadCondition {
  readonly queryExpression: string;
  readonly queryParameters: ReadonlyArray<string>;
  // -- Operations --
  getQueryExpression(): string;
  getQueryParameters(): ReadonlyArray<string>;
  setQueryParameters(queryParameters: ReadonlyArray<string>): ReturnCode_t;
}

export class QueryCondition implements IQueryCondition {
  readonly metaClass = "QueryCondition" as const;
  readonly sampleStateMask: SampleStateMask;
  readonly viewStateMask: ViewStateMask;
  readonly instanceStateMask: InstanceStateMask;
  readonly datareaderId: string;
  readonly queryExpression: string;
  readonly queryParameters: ReadonlyArray<string>;
  constructor(data: {
    sampleStateMask: SampleStateMask;
    viewStateMask: ViewStateMask;
    instanceStateMask: InstanceStateMask;
    datareaderId: string;
    queryExpression: string;
    queryParameters: ReadonlyArray<string>;
  }) {
    this.sampleStateMask = data.sampleStateMask;
    this.viewStateMask = data.viewStateMask;
    this.instanceStateMask = data.instanceStateMask;
    this.datareaderId = data.datareaderId;
    this.queryExpression = data.queryExpression;
    this.queryParameters = data.queryParameters;
  }
  // -- ICondition --
  getTriggerValue(): boolean { return false; }
  // -- IReadCondition --
  getDatareader(): string { return this.datareaderId; }
  getSampleStateMask(): SampleStateMask { return this.sampleStateMask; }
  getViewStateMask(): ViewStateMask { return this.viewStateMask; }
  getInstanceStateMask(): InstanceStateMask { return this.instanceStateMask; }
  // -- IQueryCondition --
  getQueryExpression(): string { return this.queryExpression; }
  getQueryParameters(): ReadonlyArray<string> { return this.queryParameters; }
  setQueryParameters(_queryParameters: ReadonlyArray<string>): ReturnCode_t { return RETURN_CODE.RETCODE_OK; }
}

// ─── 29. IWaitSet (§2.2.2.1.6) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.2.1.6
 * @metaclass concrete (not an Entity)
 * @generalization (root)
 * @definition A WaitSet object allows an application to wait until one or
 *   more of the attached Condition objects has a trigger_value of TRUE or
 *   else until the timeout expires. WaitSet has no factory. It is created
 *   as an object directly by the natural means in each language binding
 *   (e.g., using "new" in C++ or Java). This is because it is not
 *   necessarily associated with a single DomainParticipant and could be
 *   used to wait on Condition objects associated with different
 *   DomainParticipant objects.
 * @ownedAttributes
 *   (none declared in §2.2.2.1.6)
 * @associationEnds
 *   conditions : Condition [*] (attached via attach_condition / detach_condition)
 * @operations
 *   attach_condition(a_condition : Condition) : ReturnCode_t
 *   detach_condition(a_condition : Condition) : ReturnCode_t
 *   wait(out active_conditions : Condition[*], timeout : Duration_t) : ReturnCode_t
 *   get_conditions(out attached_conditions : Condition[*]) : ReturnCode_t
 * @constraints
 *   [attach_redundant]: Adding a Condition that is already attached to the
 *     WaitSet has no effect. (DDS 1.4 §2.2.2.1.6.1)
 *   [attach_error_codes]: Possible error codes returned in addition to the
 *     standard ones: OUT_OF_RESOURCES. (DDS 1.4 §2.2.2.1.6.1)
 *   [detach_precondition]: If the Condition was not attached to the WaitSet,
 *     the operation will return PRECONDITION_NOT_MET. (DDS 1.4 §2.2.2.1.6.2)
 *   [detach_error_codes]: Possible error codes returned in addition to the
 *     standard ones: PRECONDITION_NOT_MET. (DDS 1.4 §2.2.2.1.6.2)
 *   [wait_timeout]: It this duration is exceeded and none of the attached
 *     Condition objects is true, wait will return with the return code
 *     TIMEOUT. (DDS 1.4 §2.2.2.1.6.3)
 *   [single_waiter]: It is not allowed for more than one application thread
 *     to be waiting on the same WaitSet. If the wait operation is invoked
 *     on a WaitSet that already has a thread blocking on it, the operation
 *     will return immediately with the value PRECONDITION_NOT_MET.
 *     (DDS 1.4 §2.2.2.1.6.3)
 */
export interface IWaitSet {
  // -- Operations --
  attachCondition(aConditionId: string): ReturnCode_t;
  detachCondition(aConditionId: string): ReturnCode_t;
  wait(timeout: IDuration_t): { code: ReturnCode_t; activeConditionIds: ReadonlyArray<string> };
  getConditions(): ReadonlyArray<string>;
}

export class WaitSet implements IWaitSet {
  readonly metaClass = "WaitSet" as const;
  attachCondition(_aConditionId: string): ReturnCode_t { return RETURN_CODE.RETCODE_OK; }
  detachCondition(_aConditionId: string): ReturnCode_t { return RETURN_CODE.RETCODE_OK; }
  wait(_timeout: IDuration_t): { code: ReturnCode_t; activeConditionIds: ReadonlyArray<string> } {
    return { code: RETURN_CODE.RETCODE_OK, activeConditionIds: [] };
  }
  getConditions(): ReadonlyArray<string> { return []; }
}

// ─── 30. ISampleInfo (§2.2.2.5.5) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.2.5.5
 * @metaclass concrete (struct, no operations)
 * @generalization (root)
 * @definition SampleInfo is the information that accompanies each sample
 *   that is `read' or `taken.' It contains the following information: the
 *   sample_state (READ or NOT_READ); the view_state (NEW or NOT_NEW); the
 *   instance_state (ALIVE, NOT_ALIVE_DISPOSED, or NOT_ALIVE_NO_WRITERS);
 *   the disposed_generation_count and no_writers_generation_count; the
 *   sample_rank, generation_rank, and absolute_generation_rank; the
 *   source_timestamp; the instance_handle; the publication_handle; and
 *   the valid_data flag.
 * @ownedAttributes
 *   sample_state : SampleStateKind [1]
 *   view_state : ViewStateKind [1]
 *   instance_state : InstanceStateKind [1]
 *   disposed_generation_count : long [1]
 *   no_writers_generation_count : long [1]
 *   sample_rank : long [1]
 *   generation_rank : long [1]
 *   absolute_generation_rank : long [1]
 *   source_timestamp : Time_t [1]
 *   instance_handle : InstanceHandle_t [1]
 *   publication_handle : InstanceHandle_t [1]
 *   valid_data : Boolean [1]
 * @associationEnds
 *   (none declared in §2.2.2.5.5)
 * @operations
 *   No operations
 * @constraints
 *   (none declared in DDS 1.4 §2.2.2.5.5; per-field interpretation rules in
 *    §2.2.2.5.1.1 .. §2.2.2.5.1.8)
 */
export interface ISampleInfo {
  readonly sampleState: SampleStateKind;
  readonly viewState: ViewStateKind;
  readonly instanceState: InstanceStateKind;
  readonly disposedGenerationCount: number;
  readonly noWritersGenerationCount: number;
  readonly sampleRank: number;
  readonly generationRank: number;
  readonly absoluteGenerationRank: number;
  readonly sourceTimestamp: ITime_t;
  readonly instanceHandle: IInstanceHandle_t;
  readonly publicationHandle: IInstanceHandle_t;
  readonly validData: boolean;
  /**
   * Reception timestamp — implementer #2 partition note: the IDL `struct
   * SampleInfo` (§2.3.3 / dds_dcps.idl) does NOT declare a
   * reception_timestamp field. The PIM section §2.2.2.5.5 likewise omits
   * it. The partition brief listed reception_timestamp as a SampleInfo
   * attribute; this surface treats it as optional metadata that
   * conforming PSMs MAY surface but the normative DDS 1.4 PIM does not
   * require. Flagged as a partition ambiguity. @section §?
   */
  readonly receptionTimestamp?: ITime_t;
}

export class SampleInfo implements ISampleInfo {
  readonly metaClass = "SampleInfo" as const;
  readonly sampleState: SampleStateKind;
  readonly viewState: ViewStateKind;
  readonly instanceState: InstanceStateKind;
  readonly disposedGenerationCount: number;
  readonly noWritersGenerationCount: number;
  readonly sampleRank: number;
  readonly generationRank: number;
  readonly absoluteGenerationRank: number;
  readonly sourceTimestamp: ITime_t;
  readonly instanceHandle: IInstanceHandle_t;
  readonly publicationHandle: IInstanceHandle_t;
  readonly validData: boolean;
  readonly receptionTimestamp?: ITime_t;
  constructor(data: {
    sampleState: SampleStateKind;
    viewState: ViewStateKind;
    instanceState: InstanceStateKind;
    disposedGenerationCount: number;
    noWritersGenerationCount: number;
    sampleRank: number;
    generationRank: number;
    absoluteGenerationRank: number;
    sourceTimestamp: ITime_t;
    instanceHandle: IInstanceHandle_t;
    publicationHandle: IInstanceHandle_t;
    validData: boolean;
    receptionTimestamp?: ITime_t;
  }) {
    this.sampleState = data.sampleState;
    this.viewState = data.viewState;
    this.instanceState = data.instanceState;
    this.disposedGenerationCount = data.disposedGenerationCount;
    this.noWritersGenerationCount = data.noWritersGenerationCount;
    this.sampleRank = data.sampleRank;
    this.generationRank = data.generationRank;
    this.absoluteGenerationRank = data.absoluteGenerationRank;
    this.sourceTimestamp = data.sourceTimestamp;
    this.instanceHandle = data.instanceHandle;
    this.publicationHandle = data.publicationHandle;
    this.validData = data.validData;
    this.receptionTimestamp = data.receptionTimestamp;
  }
}

// ─── 31. IDataWriter (§2.2.2.4.2) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.2.4.2
 * @metaclass concrete (PIM marks the class abstract; surfaced concrete
 *   because the IDL projection forms a non-templated `interface DataWriter
 *   : Entity` base. The typed write/register_instance/lookup_instance/
 *   dispose operations are part of the auto-generated FooDataWriter
 *   specialization (per §2.2.2.4.2 introductory text and the
 *   FooDataWriter table) and are NOT surfaced on the base class.)
 * @generalization IEntity
 * @definition DataWriter allows the application to set the value of the data
 *   to be published under a given Topic. A DataWriter is attached to
 *   exactly one Publisher that acts as a factory for it. A DataWriter is
 *   bound to exactly one Topic and therefore to exactly one data type. The
 *   Topic must exist prior to the DataWriter's creation.
 * @ownedAttributes
 *   (none declared in §2.2.2.4.2)
 * @associationEnds
 *   topic : Topic [1] (accessed via get_topic)
 *   publisher : Publisher [1] (accessed via get_publisher)
 * @operations
 *   set_qos(qos : DataWriterQos) : ReturnCode_t                 (overrides Entity)
 *   get_qos(out qos : DataWriterQos) : ReturnCode_t             (overrides Entity)
 *   set_listener(a_listener : DataWriterListener,
 *                mask : StatusKind[*]) : ReturnCode_t
 *   get_listener() : DataWriterListener
 *   get_topic() : Topic
 *   get_publisher() : Publisher
 *   wait_for_acknowledgments(max_wait : Duration_t) : ReturnCode_t
 *   get_liveliness_lost_status(out status : LivelinessLostStatus) : ReturnCode_t
 *   get_offered_deadline_missed_status(out status : OfferedDeadlineMissedStatus) : ReturnCode_t
 *   get_offered_incompatible_qos_status(out status : OfferedIncompatibleQosStatus) : ReturnCode_t
 *   get_publication_matched_status(out status : PublicationMatchedStatus) : ReturnCode_t
 *   assert_liveliness() : ReturnCode_t
 *   get_matched_subscriptions(out subscription_handles : InstanceHandle_t[*]) : ReturnCode_t
 *   get_matched_subscription_data(
 *       out subscription_data : SubscriptionBuiltinTopicData,
 *       subscription_handle : InstanceHandle_t) : ReturnCode_t
 *   -- Type-parametric operations on the FooDataWriter specialization (see
 *      §2.2.2.4.2 introduction and FooDataWriter table; commented out in
 *      `dds_dcps.idl` lines 913-944): register_instance,
 *      register_instance_w_timestamp, unregister_instance,
 *      unregister_instance_w_timestamp, write, write_w_timestamp, dispose,
 *      dispose_w_timestamp, get_key_value, lookup_instance.
 * @constraints
 *   [not_enabled_return]: All operations except for the base-class operations
 *     set_qos, get_qos, set_listener, get_listener, enable, and
 *     get_statuscondition may return the value NOT_ENABLED.
 *     (DDS 1.4 §2.2.2.4.2)
 *   [single_topic]: A DataWriter is bound to exactly one Topic and therefore
 *     to exactly one data type. The Topic must exist prior to the
 *     DataWriter's creation. (DDS 1.4 §2.2.2.4.2)
 *   [single_publisher]: A DataWriter is attached to exactly one Publisher
 *     that acts as a factory for it. (DDS 1.4 §2.2.2.4.2)
 *   [set_qos_error_codes]: Possible error codes returned in addition to the
 *     standard ones: IMMUTABLE_POLICY, INCONSISTENT_POLICY.
 *     (DDS 1.4 §2.2.2.4.2.3)
 */
export interface IDataWriter extends IEntity {
  // -- Operations --
  getTopic(): string;
  getPublisher(): string;
  waitForAcknowledgments(maxWait: IDuration_t): ReturnCode_t;
  getLivelinessLostStatus(): string | undefined;
  getOfferedDeadlineMissedStatus(): string | undefined;
  getOfferedIncompatibleQosStatus(): string | undefined;
  getPublicationMatchedStatus(): string | undefined;
  assertLiveliness(): ReturnCode_t;
  getMatchedSubscriptions(): ReadonlyArray<IInstanceHandle_t>;
  getMatchedSubscriptionData(subscriptionHandle: IInstanceHandle_t): string | undefined;
}

export class DataWriter implements IDataWriter {
  readonly metaClass = "DataWriter" as const;
  readonly topicId: string;
  readonly publisherId: string;
  constructor(data: { topicId: string; publisherId: string }) {
    this.topicId = data.topicId;
    this.publisherId = data.publisherId;
  }
  // -- IEntity --
  setQos(_qosList: ReadonlyArray<string>): string { return RETURN_CODE.RETCODE_OK; }
  getQos(): ReadonlyArray<string> { return []; }
  setListener(_aListener: string | undefined, _mask: ReadonlyArray<StatusKind>): string { return RETURN_CODE.RETCODE_OK; }
  getListener(): string | undefined { return undefined; }
  enable(): string { return RETURN_CODE.RETCODE_OK; }
  getStatuscondition(): string | undefined { return undefined; }
  getStatusChanges(): ReadonlyArray<StatusKind> { return []; }
  getInstanceHandle(): string | undefined { return undefined; }
  // -- IDataWriter --
  getTopic(): string { return this.topicId; }
  getPublisher(): string { return this.publisherId; }
  waitForAcknowledgments(_maxWait: IDuration_t): ReturnCode_t { return RETURN_CODE.RETCODE_OK; }
  getLivelinessLostStatus(): string | undefined { return undefined; }
  getOfferedDeadlineMissedStatus(): string | undefined { return undefined; }
  getOfferedIncompatibleQosStatus(): string | undefined { return undefined; }
  getPublicationMatchedStatus(): string | undefined { return undefined; }
  assertLiveliness(): ReturnCode_t { return RETURN_CODE.RETCODE_OK; }
  getMatchedSubscriptions(): ReadonlyArray<IInstanceHandle_t> { return []; }
  getMatchedSubscriptionData(_subscriptionHandle: IInstanceHandle_t): string | undefined { return undefined; }
}

// ─── 32. IDataReader (§2.2.2.5.3) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.2.5.3
 * @metaclass concrete (PIM marks the class abstract; surfaced concrete
 *   because the IDL projection forms a non-templated `interface DataReader
 *   : Entity` base. The typed read / take / read_w_condition /
 *   take_w_condition / read_next_sample / take_next_sample /
 *   *_instance variants are part of the auto-generated FooDataReader
 *   specialization (per §2.2.2.5.3 introductory text and the
 *   FooDataReader table) and are NOT surfaced on the base class.)
 * @generalization IEntity
 * @definition A DataReader allows the application (1) to declare the data it
 *   wishes to receive (i.e., make a subscription) and (2) to access the
 *   data received by the attached Subscriber. A DataReader refers to
 *   exactly one TopicDescription (either a Topic, a ContentFilteredTopic,
 *   or a MultiTopic) that identifies the data to be read. The subscription
 *   has a unique resulting type. The data-reader may give access to several
 *   instances of the resulting type, which can be distinguished from each
 *   other by their key.
 * @ownedAttributes
 *   (none declared in §2.2.2.5.3)
 * @associationEnds
 *   topicdescription : TopicDescription [1] (accessed via get_topicdescription)
 *   subscriber : Subscriber [1] (accessed via get_subscriber)
 * @operations
 *   set_qos(qos : DataReaderQos) : ReturnCode_t                 (overrides Entity)
 *   get_qos(out qos : DataReaderQos) : ReturnCode_t             (overrides Entity)
 *   set_listener(a_listener : DataReaderListener,
 *                mask : StatusKind[*]) : ReturnCode_t
 *   get_listener() : DataReaderListener
 *   create_readcondition(sample_states : SampleStateMask,
 *                        view_states : ViewStateMask,
 *                        instance_states : InstanceStateMask) : ReadCondition
 *   create_querycondition(sample_states : SampleStateMask,
 *                         view_states : ViewStateMask,
 *                         instance_states : InstanceStateMask,
 *                         query_expression : String,
 *                         query_parameters : String[*]) : QueryCondition
 *   delete_readcondition(a_condition : ReadCondition) : ReturnCode_t
 *   delete_contained_entities() : ReturnCode_t
 *   get_topicdescription() : TopicDescription
 *   get_subscriber() : Subscriber
 *   get_sample_rejected_status(out status : SampleRejectedStatus) : ReturnCode_t
 *   get_liveliness_changed_status(out status : LivelinessChangedStatus) : ReturnCode_t
 *   get_requested_deadline_missed_status(out status : RequestedDeadlineMissedStatus) : ReturnCode_t
 *   get_requested_incompatible_qos_status(out status : RequestedIncompatibleQosStatus) : ReturnCode_t
 *   get_subscription_matched_status(out status : SubscriptionMatchedStatus) : ReturnCode_t
 *   get_sample_lost_status(out status : SampleLostStatus) : ReturnCode_t
 *   wait_for_historical_data(max_wait : Duration_t) : ReturnCode_t
 *   get_matched_publications(out publication_handles : InstanceHandle_t[*]) : ReturnCode_t
 *   get_matched_publication_data(
 *       out publication_data : PublicationBuiltinTopicData,
 *       publication_handle : InstanceHandle_t) : ReturnCode_t
 *   -- Read/take operations on the FooDataReader specialization (see
 *      §2.2.2.5.3 introduction and FooDataReader table; commented out in
 *      `dds_dcps.idl` lines 1025-1121): read, take, read_w_condition,
 *      take_w_condition, read_next_sample, take_next_sample,
 *      read_instance, take_instance, read_next_instance,
 *      take_next_instance, read_next_instance_w_condition,
 *      take_next_instance_w_condition, return_loan, get_key_value,
 *      lookup_instance.
 * @constraints
 *   [single_topicdescription]: A DataReader refers to exactly one
 *     TopicDescription. (DDS 1.4 §2.2.2.5.3)
 *   [previous_handle_handle_nil]: The special value HANDLE_NIL is guaranteed
 *     to be `less than' any valid instance_handle. So the use of the
 *     parameter value previous_handle==HANDLE_NIL will return the samples
 *     for the instance which has the smallest instance_handle among all
 *     the ones that qualify the other criteria. (DDS 1.4 §2.2.2.5.3.16)
 *   [bad_parameter_handle]: This operation may return BAD_PARAMETER if the
 *     InstanceHandle_t a_handle does not correspond to an existing data-
 *     object known to the DataReader. (DDS 1.4 §2.2.2.5.3.14 .. .15 / .29)
 */
export interface IDataReader extends IEntity {
  // -- Operations --
  createReadcondition(
    sampleStates: SampleStateMask,
    viewStates: ViewStateMask,
    instanceStates: InstanceStateMask,
  ): string | undefined;
  createQuerycondition(
    sampleStates: SampleStateMask,
    viewStates: ViewStateMask,
    instanceStates: InstanceStateMask,
    queryExpression: string,
    queryParameters: ReadonlyArray<string>,
  ): string | undefined;
  deleteReadcondition(aConditionId: string): ReturnCode_t;
  deleteContainedEntities(): ReturnCode_t;
  getTopicdescription(): string;
  getSubscriber(): string;
  getSampleRejectedStatus(): string | undefined;
  getLivelinessChangedStatus(): string | undefined;
  getRequestedDeadlineMissedStatus(): string | undefined;
  getRequestedIncompatibleQosStatus(): string | undefined;
  getSubscriptionMatchedStatus(): string | undefined;
  getSampleLostStatus(): string | undefined;
  waitForHistoricalData(maxWait: IDuration_t): ReturnCode_t;
  getMatchedPublications(): ReadonlyArray<IInstanceHandle_t>;
  getMatchedPublicationData(publicationHandle: IInstanceHandle_t): string | undefined;
}

export class DataReader implements IDataReader {
  readonly metaClass = "DataReader" as const;
  readonly topicdescriptionId: string;
  readonly subscriberId: string;
  constructor(data: { topicdescriptionId: string; subscriberId: string }) {
    this.topicdescriptionId = data.topicdescriptionId;
    this.subscriberId = data.subscriberId;
  }
  // -- IEntity --
  setQos(_qosList: ReadonlyArray<string>): string { return RETURN_CODE.RETCODE_OK; }
  getQos(): ReadonlyArray<string> { return []; }
  setListener(_aListener: string | undefined, _mask: ReadonlyArray<StatusKind>): string { return RETURN_CODE.RETCODE_OK; }
  getListener(): string | undefined { return undefined; }
  enable(): string { return RETURN_CODE.RETCODE_OK; }
  getStatuscondition(): string | undefined { return undefined; }
  getStatusChanges(): ReadonlyArray<StatusKind> { return []; }
  getInstanceHandle(): string | undefined { return undefined; }
  // -- IDataReader --
  createReadcondition(
    _sampleStates: SampleStateMask,
    _viewStates: ViewStateMask,
    _instanceStates: InstanceStateMask,
  ): string | undefined { return undefined; }
  createQuerycondition(
    _sampleStates: SampleStateMask,
    _viewStates: ViewStateMask,
    _instanceStates: InstanceStateMask,
    _queryExpression: string,
    _queryParameters: ReadonlyArray<string>,
  ): string | undefined { return undefined; }
  deleteReadcondition(_aConditionId: string): ReturnCode_t { return RETURN_CODE.RETCODE_OK; }
  deleteContainedEntities(): ReturnCode_t { return RETURN_CODE.RETCODE_OK; }
  getTopicdescription(): string { return this.topicdescriptionId; }
  getSubscriber(): string { return this.subscriberId; }
  getSampleRejectedStatus(): string | undefined { return undefined; }
  getLivelinessChangedStatus(): string | undefined { return undefined; }
  getRequestedDeadlineMissedStatus(): string | undefined { return undefined; }
  getRequestedIncompatibleQosStatus(): string | undefined { return undefined; }
  getSubscriptionMatchedStatus(): string | undefined { return undefined; }
  getSampleLostStatus(): string | undefined { return undefined; }
  waitForHistoricalData(_maxWait: IDuration_t): ReturnCode_t { return RETURN_CODE.RETCODE_OK; }
  getMatchedPublications(): ReadonlyArray<IInstanceHandle_t> { return []; }
  getMatchedPublicationData(_publicationHandle: IInstanceHandle_t): string | undefined { return undefined; }
}

// ═══════════════════════════════════════════════════════════════════════════
// — END Implementer #2: DCPS Communication —
//
// Deferred to implementer #4 (Listeners + Status structures, §2.2.4):
//   • Status payload structs (§2.2.4.1 .. §2.2.4.x):
//       InconsistentTopicStatus, SampleLostStatus, SampleRejectedStatus
//       (with SampleRejectedStatusKind), LivelinessLostStatus,
//       LivelinessChangedStatus, OfferedDeadlineMissedStatus,
//       RequestedDeadlineMissedStatus, OfferedIncompatibleQosStatus,
//       RequestedIncompatibleQosStatus, PublicationMatchedStatus,
//       SubscriptionMatchedStatus, QosPolicyCount.
//   • Listener interfaces (§2.2.2.1.4 + §2.2.2.4.4 + §2.2.2.5.6 +
//     §2.2.2.5.7 + §2.2.2.3.5 + §2.2.2.2.3): Listener, TopicListener,
//     DataWriterListener, PublisherListener, DataReaderListener,
//     SubscriberListener, DomainParticipantListener.
//   • Built-in topic data structs (§2.3.5):
//       ParticipantBuiltinTopicData, TopicBuiltinTopicData,
//       PublicationBuiltinTopicData, SubscriptionBuiltinTopicData.
//
// Spec ambiguity flagged in this partition:
//   • SampleInfo::receptionTimestamp — listed in the partition brief but
//     NOT declared in §2.2.2.5.5 nor in dds_dcps.idl `struct SampleInfo`.
//     Surfaced as an optional field with an explanatory JSDoc note.
//     @section §?
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// BEGIN Implementer #3: QoS Policies
// (QosPolicy abstract base + QosPolicyId_t constants + 22 concrete
//  QoS-policy classes covering §2.2.3.1 .. §2.2.3.22 + 7 supporting kind
//  enumerations + 7 per-Entity Qos bundles)
// ═══════════════════════════════════════════════════════════════════════════

// ─── 39. QosPolicyId_t (§2.2.3 — DCPS IDL `typedef long QosPolicyId_t`) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.3
 * @metaclass typedef + closed enumeration of named integer constants
 * @generalization (root)
 * @definition QosPolicyId_t is the typedef used by the DCPS PSM to identify
 *   each QosPolicy by an integer id. The DCPS IDL defines named const values
 *   (INVALID_QOS_POLICY_ID = 0, USERDATA_QOS_POLICY_ID = 1, ...,
 *   DURABILITYSERVICE_QOS_POLICY_ID = 22) for the 22 standard QoS policies
 *   plus the sentinel "INVALID" identifier.
 * @ownedAttributes
 *   (closed enumeration of integer constants; see DCPS IDL `typedef long
 *    QosPolicyId_t` and the named const QosPolicyId_t values)
 * @associationEnds
 *   (none declared in §2.2.3)
 * @operations
 *   (none declared in §2.2.3)
 * @constraints
 *   (none declared in DDS 1.4 §2.2.3)
 */
export const QOS_POLICY_ID = {
  INVALID_QOS_POLICY_ID: 0,
  USERDATA_QOS_POLICY_ID: 1,
  DURABILITY_QOS_POLICY_ID: 2,
  PRESENTATION_QOS_POLICY_ID: 3,
  DEADLINE_QOS_POLICY_ID: 4,
  LATENCYBUDGET_QOS_POLICY_ID: 5,
  OWNERSHIP_QOS_POLICY_ID: 6,
  OWNERSHIPSTRENGTH_QOS_POLICY_ID: 7,
  LIVELINESS_QOS_POLICY_ID: 8,
  TIMEBASEDFILTER_QOS_POLICY_ID: 9,
  PARTITION_QOS_POLICY_ID: 10,
  RELIABILITY_QOS_POLICY_ID: 11,
  DESTINATIONORDER_QOS_POLICY_ID: 12,
  HISTORY_QOS_POLICY_ID: 13,
  RESOURCELIMITS_QOS_POLICY_ID: 14,
  ENTITYFACTORY_QOS_POLICY_ID: 15,
  WRITERDATALIFECYCLE_QOS_POLICY_ID: 16,
  READERDATALIFECYCLE_QOS_POLICY_ID: 17,
  TOPICDATA_QOS_POLICY_ID: 18,
  GROUPDATA_QOS_POLICY_ID: 19,
  TRANSPORTPRIORITY_QOS_POLICY_ID: 20,
  LIFESPAN_QOS_POLICY_ID: 21,
  DURABILITYSERVICE_QOS_POLICY_ID: 22,
} as const;
export type QosPolicyId_t = typeof QOS_POLICY_ID[keyof typeof QOS_POLICY_ID];

// ─── 40. QosPolicy (§2.2.3 — abstract base, Figure 2.12) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.3
 * @metaclass abstract
 * @generalization (root)
 * @definition QosPolicy is the abstract supertype of every concrete QoS
 *   policy carried by Entity-derived objects. Per Figure 2.12 ("Supported
 *   QoS policies") the QosPolicy class declares the single attribute
 *   `name : string` — every concrete subtype carries an immutable, spec-
 *   prescribed `name` value matching the QoS-policy "name" cell of its
 *   §2.2.3.x summary table (e.g., "UserData", "Reliability", "Liveliness").
 *   Concrete policies extend QosPolicy and add their own typed value(s).
 * @ownedAttributes
 *   name : string [1]
 * @associationEnds
 *   (none declared in §2.2.3)
 * @operations
 *   (none declared in §2.2.3)
 * @constraints
 *   (none declared in DDS 1.4 §2.2.3 for the abstract base — RxO and
 *    Changeable are declared per concrete subtype on its summary table)
 */
export interface IQosPolicy {
  readonly name: string;
}

// ─── 41. UserDataQosPolicy (§2.2.3.1) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.3.1
 * @metaclass concrete
 * @generalization IQosPolicy
 * @definition The purpose of this QoS is to allow the application to attach
 *   additional information to the created Entity objects such that when a
 *   remote application discovers their existence it can access that
 *   information and use it for its own purposes. One possible use of this
 *   QoS is to attach security credentials or some other information that
 *   can be used by the remote application to authenticate the source. In
 *   combination with operations such as ignore_participant,
 *   ignore_publication, ignore_subscription, and ignore_topic these QoS can
 *   assist an application to define and enforce its own security policies.
 *   The use of this QoS is not limited to security, rather it offers a
 *   simple, yet flexible extensibility mechanism.
 * @ownedAttributes
 *   value : sequence<octet> [1]
 * @associationEnds
 *   (none declared in §2.2.3.1)
 * @operations
 *   (none declared in §2.2.3.1)
 * @constraints
 *   Concerns: DomainParticipant, DataReader, DataWriter
 *   RxO: No
 *   Changeable: Yes
 *   The default value is an empty (zero-sized) sequence.
 */
export interface IUserDataQosPolicy extends IQosPolicy {
  readonly value: ReadonlyArray<number>;
}

export class UserDataQosPolicy implements IUserDataQosPolicy {
  readonly metaClass = "UserDataQosPolicy" as const;
  readonly name = "UserData" as const;
  readonly value: ReadonlyArray<number>;
  constructor(data: { value: ReadonlyArray<number> }) {
    this.value = data.value;
  }
}

// ─── 42. TopicDataQosPolicy (§2.2.3.2) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.3.2
 * @metaclass concrete
 * @generalization IQosPolicy
 * @definition The purpose of this QoS is to allow the application to attach
 *   additional information to the created Topic such that when a remote
 *   application discovers their existence it can examine the information
 *   and use it in an application-defined way. In combination with the
 *   listeners on the DataReader and DataWriter as well as by means of
 *   operations such as ignore_topic, these QoS can assist an application
 *   to extend the provided QoS.
 * @ownedAttributes
 *   value : sequence<octet> [1]
 * @associationEnds
 *   (none declared in §2.2.3.2)
 * @operations
 *   (none declared in §2.2.3.2)
 * @constraints
 *   Concerns: Topic
 *   RxO: No
 *   Changeable: Yes
 *   The default value is an empty (zero-sized) sequence.
 */
export interface ITopicDataQosPolicy extends IQosPolicy {
  readonly value: ReadonlyArray<number>;
}

export class TopicDataQosPolicy implements ITopicDataQosPolicy {
  readonly metaClass = "TopicDataQosPolicy" as const;
  readonly name = "TopicData" as const;
  readonly value: ReadonlyArray<number>;
  constructor(data: { value: ReadonlyArray<number> }) {
    this.value = data.value;
  }
}

// ─── 43. GroupDataQosPolicy (§2.2.3.3) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.3.3
 * @metaclass concrete
 * @generalization IQosPolicy
 * @definition The purpose of this QoS is to allow the application to attach
 *   additional information to the created Publisher or Subscriber. The
 *   value of the GROUP_DATA is available to the application on the
 *   DataReader and DataWriter entities and is propagated by means of the
 *   built-in topics. This QoS can be used by an application combination
 *   with the DataReaderListener and DataWriterListener to implement
 *   matching policies similar to those of the PARTITION QoS except the
 *   decision can be made based on an application-defined policy.
 * @ownedAttributes
 *   value : sequence<octet> [1]
 * @associationEnds
 *   (none declared in §2.2.3.3)
 * @operations
 *   (none declared in §2.2.3.3)
 * @constraints
 *   Concerns: Publisher, Subscriber
 *   RxO: No
 *   Changeable: Yes
 *   The default value is an empty (zero-sized) sequence.
 */
export interface IGroupDataQosPolicy extends IQosPolicy {
  readonly value: ReadonlyArray<number>;
}

export class GroupDataQosPolicy implements IGroupDataQosPolicy {
  readonly metaClass = "GroupDataQosPolicy" as const;
  readonly name = "GroupData" as const;
  readonly value: ReadonlyArray<number>;
  constructor(data: { value: ReadonlyArray<number> }) {
    this.value = data.value;
  }
}

// ─── 44. TransportPriorityQosPolicy (§2.2.3.15) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.3.15
 * @metaclass concrete
 * @generalization IQosPolicy
 * @definition This policy is a hint to the infrastructure as to how to set
 *   the priority of the underlying transport used to send the data. The
 *   default value of the transport_priority is zero.
 * @ownedAttributes
 *   value : long [1]
 * @associationEnds
 *   (none declared in §2.2.3.15)
 * @operations
 *   (none declared in §2.2.3.15)
 * @constraints
 *   Concerns: Topic, DataWriter
 *   RxO: N/A
 *   Changeable: Yes
 */
export interface ITransportPriorityQosPolicy extends IQosPolicy {
  readonly value: number;
}

export class TransportPriorityQosPolicy implements ITransportPriorityQosPolicy {
  readonly metaClass = "TransportPriorityQosPolicy" as const;
  readonly name = "TransportPriority" as const;
  readonly value: number;
  constructor(data: { value: number }) {
    this.value = data.value;
  }
}

// ─── 45. LifespanQosPolicy (§2.2.3.16) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.3.16
 * @metaclass concrete
 * @generalization IQosPolicy
 * @definition Specifies the maximum duration of validity of the data
 *   written by the DataWriter. The default value of the lifespan duration
 *   is infinite.
 * @ownedAttributes
 *   duration : Duration_t [1]
 * @associationEnds
 *   (none declared in §2.2.3.16)
 * @operations
 *   (none declared in §2.2.3.16)
 * @constraints
 *   Concerns: Topic, DataWriter
 *   RxO: N/A
 *   Changeable: Yes
 */
export interface ILifespanQosPolicy extends IQosPolicy {
  readonly duration: IDuration_t;
}

export class LifespanQosPolicy implements ILifespanQosPolicy {
  readonly metaClass = "LifespanQosPolicy" as const;
  readonly name = "Lifespan" as const;
  readonly duration: IDuration_t;
  constructor(data: { duration: IDuration_t }) {
    this.duration = data.duration;
  }
}

// ─── 46. DurabilityQosPolicyKind (§2.2.3.4 — DCPS IDL `enum`) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.3.4
 * @metaclass enumeration
 * @generalization (root)
 * @definition DurabilityQosPolicyKind is the closed enumeration of the
 *   possible DURABILITY kinds. Per the §2.2.3.4 summary table:
 *   VOLATILE (the default) — the Service does not need to keep any samples
 *   of data-instances on behalf of any DataReader that is not known by the
 *   DataWriter at the time the instance is written;
 *   TRANSIENT_LOCAL — the service is only required to keep the data in the
 *   memory of the DataWriter that wrote the data and the data is not
 *   required to survive the DataWriter;
 *   TRANSIENT — the service is only required to keep the data in memory and
 *   not in permanent storage; but the data is not tied to the lifecycle of
 *   the DataWriter and will, in general, survive it. Support for TRANSIENT
 *   kind is optional;
 *   PERSISTENT — [optional] Data is kept on permanent storage, so that they
 *   can outlive a system session.
 * @constraints
 *   For the purposes of the offered/requested compatibility inequality the
 *   values are ordered such that
 *   VOLATILE < TRANSIENT_LOCAL < TRANSIENT < PERSISTENT.
 */
export const DURABILITY_QOS_POLICY_KIND = {
  VOLATILE_DURABILITY_QOS: "VOLATILE_DURABILITY_QOS",
  TRANSIENT_LOCAL_DURABILITY_QOS: "TRANSIENT_LOCAL_DURABILITY_QOS",
  TRANSIENT_DURABILITY_QOS: "TRANSIENT_DURABILITY_QOS",
  PERSISTENT_DURABILITY_QOS: "PERSISTENT_DURABILITY_QOS",
} as const;
export type DurabilityQosPolicyKind =
  typeof DURABILITY_QOS_POLICY_KIND[keyof typeof DURABILITY_QOS_POLICY_KIND];

// ─── 47. DurabilityQosPolicy (§2.2.3.4) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.3.4
 * @metaclass concrete
 * @generalization IQosPolicy
 * @definition This policy expresses if the data should `outlive' their
 *   writing time. The decoupling between DataReader and DataWriter offered
 *   by the Publish/Subscribe paradigm allows an application to write data
 *   even if there are no current readers on the network. Moreover, a
 *   DataReader that joins the network after some data has been written
 *   could potentially be interested in accessing the most current values
 *   of the data as well as potentially some history. This QoS policy
 *   controls whether the Service will actually make data available to
 *   late-joining readers.
 * @ownedAttributes
 *   kind : DurabilityQosPolicyKind [1]
 * @associationEnds
 *   (none declared in §2.2.3.4)
 * @operations
 *   (none declared in §2.2.3.4)
 * @constraints
 *   Concerns: Topic, DataReader, DataWriter
 *   RxO: Yes
 *   Changeable: No
 *   The value offered is considered compatible with the value requested if
 *   and only if the inequality "offered kind >= requested kind" evaluates
 *   to `TRUE.' For the purposes of this inequality, the values of
 *   DURABILITY kind are considered ordered such that
 *   VOLATILE < TRANSIENT_LOCAL < TRANSIENT < PERSISTENT.
 *   The default kind is VOLATILE.
 */
export interface IDurabilityQosPolicy extends IQosPolicy {
  readonly kind: DurabilityQosPolicyKind;
}

export class DurabilityQosPolicy implements IDurabilityQosPolicy {
  readonly metaClass = "DurabilityQosPolicy" as const;
  readonly name = "Durability" as const;
  readonly kind: DurabilityQosPolicyKind;
  constructor(data: { kind: DurabilityQosPolicyKind }) {
    this.kind = data.kind;
  }
}

// ─── 48. PresentationQosPolicyAccessScopeKind (§2.2.3.6 — DCPS IDL `enum`) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.3.6
 * @metaclass enumeration
 * @generalization (root)
 * @definition PresentationQosPolicyAccessScopeKind is the closed
 *   enumeration of the possible access_scope values for the PRESENTATION
 *   QoS policy. Per the §2.2.3.6 summary table:
 *   INSTANCE (the default) — Scope spans only a single instance. Indicates
 *   that changes to one instance need not be coherent nor ordered with
 *   respect to changes to any other instance;
 *   TOPIC — Scope spans to all instances within the same DataWriter (or
 *   DataReader), but not across instances in different DataWriter (or
 *   DataReader);
 *   GROUP — [optional] Scope spans to all instances belonging to
 *   DataWriter (or DataReader) entities within the same Publisher (or
 *   Subscriber).
 * @constraints
 *   For the purposes of the offered/requested compatibility inequality the
 *   values are ordered such that INSTANCE < TOPIC < GROUP.
 */
export const PRESENTATION_QOS_POLICY_ACCESS_SCOPE_KIND = {
  INSTANCE_PRESENTATION_QOS: "INSTANCE_PRESENTATION_QOS",
  TOPIC_PRESENTATION_QOS: "TOPIC_PRESENTATION_QOS",
  GROUP_PRESENTATION_QOS: "GROUP_PRESENTATION_QOS",
} as const;
export type PresentationQosPolicyAccessScopeKind =
  typeof PRESENTATION_QOS_POLICY_ACCESS_SCOPE_KIND[keyof typeof PRESENTATION_QOS_POLICY_ACCESS_SCOPE_KIND];

// ─── 49. PresentationQosPolicy (§2.2.3.6) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.3.6
 * @metaclass concrete
 * @generalization IQosPolicy
 * @definition Specifies how the samples representing changes to data
 *   instances are presented to the subscribing application. This policy
 *   affects the application's ability to specify and receive coherent
 *   changes and to see the relative order of changes. access_scope
 *   determines the largest scope spanning the entities for which the order
 *   and coherency of changes can be preserved. The two booleans control
 *   whether coherent access and ordered access are supported within the
 *   scope access_scope.
 * @ownedAttributes
 *   access_scope : PresentationQosPolicyAccessScopeKind [1]
 *   coherent_access : boolean [1]
 *   ordered_access : boolean [1]
 * @associationEnds
 *   (none declared in §2.2.3.6)
 * @operations
 *   (none declared in §2.2.3.6)
 * @constraints
 *   Concerns: Publisher, Subscriber
 *   RxO: Yes
 *   Changeable: No
 *   The value offered is considered compatible with the value requested if
 *   and only if the following conditions are met:
 *   1) The inequality "offered access_scope >= requested access_scope"
 *      evaluates to `TRUE.' For the purposes of this inequality, the values
 *      of PRESENTATION access_scope are considered ordered such that
 *      INSTANCE < TOPIC < GROUP.
 *   2) Requested coherent_access is FALSE, or else both offered and
 *      requested coherent_access are TRUE.
 *   3) Requested ordered_access is FALSE, or else both offered and
 *      requested ordered_access are TRUE.
 *   The default access_scope is INSTANCE; the default for coherent_access
 *   and ordered_access is FALSE.
 */
export interface IPresentationQosPolicy extends IQosPolicy {
  readonly access_scope: PresentationQosPolicyAccessScopeKind;
  readonly coherent_access: boolean;
  readonly ordered_access: boolean;
}

export class PresentationQosPolicy implements IPresentationQosPolicy {
  readonly metaClass = "PresentationQosPolicy" as const;
  readonly name = "Presentation" as const;
  readonly access_scope: PresentationQosPolicyAccessScopeKind;
  readonly coherent_access: boolean;
  readonly ordered_access: boolean;
  constructor(data: {
    access_scope: PresentationQosPolicyAccessScopeKind;
    coherent_access: boolean;
    ordered_access: boolean;
  }) {
    this.access_scope = data.access_scope;
    this.coherent_access = data.coherent_access;
    this.ordered_access = data.ordered_access;
  }
}

// ─── 50. DeadlineQosPolicy (§2.2.3.7) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.3.7
 * @metaclass concrete
 * @generalization IQosPolicy
 * @definition DataReader expects a new sample updating the value of each
 *   instance at least once every deadline period. DataWriter indicates
 *   that the application commits to write a new value (using the
 *   DataWriter) for each instance managed by the DataWriter at least once
 *   every deadline period. It is inconsistent for a DataReader to have a
 *   DEADLINE period less than its TIME_BASED_FILTER's minimum_separation.
 *   The default value of the deadline period is infinite.
 * @ownedAttributes
 *   period : Duration_t [1]
 * @associationEnds
 *   (none declared in §2.2.3.7)
 * @operations
 *   (none declared in §2.2.3.7)
 * @constraints
 *   Concerns: Topic, DataReader, DataWriter
 *   RxO: Yes
 *   Changeable: Yes
 *   The value offered is considered compatible with the value requested if
 *   and only if the inequality "offered deadline period <= requested
 *   deadline period" evaluates to `TRUE.' The setting of the DEADLINE
 *   policy must be set consistently with that of the TIME_BASED_FILTER.
 *   For these two policies to be consistent the settings must be such that
 *   "deadline period >= minimum_separation."
 */
export interface IDeadlineQosPolicy extends IQosPolicy {
  readonly period: IDuration_t;
}

export class DeadlineQosPolicy implements IDeadlineQosPolicy {
  readonly metaClass = "DeadlineQosPolicy" as const;
  readonly name = "Deadline" as const;
  readonly period: IDuration_t;
  constructor(data: { period: IDuration_t }) {
    this.period = data.period;
  }
}

// ─── 51. LatencyBudgetQosPolicy (§2.2.3.8) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.3.8
 * @metaclass concrete
 * @generalization IQosPolicy
 * @definition Specifies the maximum acceptable delay from the time the
 *   data is written until the data is inserted in the receiver's
 *   application-cache and the receiving application is notified of the
 *   fact. This policy is a hint to the Service, not something that must be
 *   monitored or enforced. The Service is not required to track or alert
 *   the user of any violation. The default value of the duration is zero
 *   indicating that the delay should be minimized.
 * @ownedAttributes
 *   duration : Duration_t [1]
 * @associationEnds
 *   (none declared in §2.2.3.8)
 * @operations
 *   (none declared in §2.2.3.8)
 * @constraints
 *   Concerns: Topic, DataReader, DataWriter
 *   RxO: Yes
 *   Changeable: Yes
 *   The value offered is considered compatible with the value requested if
 *   and only if the inequality "offered duration <= requested duration"
 *   evaluates to `TRUE.'
 */
export interface ILatencyBudgetQosPolicy extends IQosPolicy {
  readonly duration: IDuration_t;
}

export class LatencyBudgetQosPolicy implements ILatencyBudgetQosPolicy {
  readonly metaClass = "LatencyBudgetQosPolicy" as const;
  readonly name = "LatencyBudget" as const;
  readonly duration: IDuration_t;
  constructor(data: { duration: IDuration_t }) {
    this.duration = data.duration;
  }
}

// ─── 52. OwnershipQosPolicyKind (§2.2.3.9 — DCPS IDL `enum`) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.3.9
 * @metaclass enumeration
 * @generalization (root)
 * @definition OwnershipQosPolicyKind is the closed enumeration of the
 *   possible OWNERSHIP kinds. Per the §2.2.3.9 summary table:
 *   SHARED — Indicates shared ownership for each instance. Multiple writers
 *   are allowed to update the same instance and all the updates are made
 *   available to the readers. In other words there is no concept of an
 *   "owner" for the instances. This is the default behavior if the
 *   OWNERSHIP QoS policy is not specified or supported;
 *   EXCLUSIVE — [optional] Indicates each instance can only be owned by one
 *   DataWriter, but the owner of an instance can change dynamically.
 * @constraints
 *   The value of the OWNERSHIP kind offered must exactly match the one
 *   requested or else they are considered incompatible.
 */
export const OWNERSHIP_QOS_POLICY_KIND = {
  SHARED_OWNERSHIP_QOS: "SHARED_OWNERSHIP_QOS",
  EXCLUSIVE_OWNERSHIP_QOS: "EXCLUSIVE_OWNERSHIP_QOS",
} as const;
export type OwnershipQosPolicyKind =
  typeof OWNERSHIP_QOS_POLICY_KIND[keyof typeof OWNERSHIP_QOS_POLICY_KIND];

// ─── 53. OwnershipQosPolicy (§2.2.3.9) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.3.9
 * @metaclass concrete
 * @generalization IQosPolicy
 * @definition [optional] Specifies whether it is allowed for multiple
 *   DataWriters to write the same instance of the data and if so, how
 *   these modifications should be arbitrated. There are two kinds of
 *   OWNERSHIP selected by the setting of the kind: SHARED and EXCLUSIVE.
 * @ownedAttributes
 *   kind : OwnershipQosPolicyKind [1]
 * @associationEnds
 *   (none declared in §2.2.3.9)
 * @operations
 *   (none declared in §2.2.3.9)
 * @constraints
 *   Concerns: Topic, DataReader, DataWriter
 *   RxO: Yes
 *   Changeable: No
 *   The value of the OWNERSHIP kind offered must exactly match the one
 *   requested or else they are considered incompatible. The default kind
 *   is SHARED.
 */
export interface IOwnershipQosPolicy extends IQosPolicy {
  readonly kind: OwnershipQosPolicyKind;
}

export class OwnershipQosPolicy implements IOwnershipQosPolicy {
  readonly metaClass = "OwnershipQosPolicy" as const;
  readonly name = "Ownership" as const;
  readonly kind: OwnershipQosPolicyKind;
  constructor(data: { kind: OwnershipQosPolicyKind }) {
    this.kind = data.kind;
  }
}

// ─── 54. OwnershipStrengthQosPolicy (§2.2.3.10) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.3.10
 * @metaclass concrete
 * @generalization IQosPolicy
 * @definition [optional] Specifies the value of the "strength" used to
 *   arbitrate among multiple DataWriter objects that attempt to modify the
 *   same instance of a data-object (identified by Topic + key). This
 *   policy only applies if the OWNERSHIP QoS policy is of kind EXCLUSIVE.
 *   The default value of the ownership_strength is zero.
 * @ownedAttributes
 *   value : long [1]
 * @associationEnds
 *   (none declared in §2.2.3.10)
 * @operations
 *   (none declared in §2.2.3.10)
 * @constraints
 *   Concerns: DataWriter
 *   RxO: N/A
 *   Changeable: Yes
 */
export interface IOwnershipStrengthQosPolicy extends IQosPolicy {
  readonly value: number;
}

export class OwnershipStrengthQosPolicy implements IOwnershipStrengthQosPolicy {
  readonly metaClass = "OwnershipStrengthQosPolicy" as const;
  readonly name = "OwnershipStrength" as const;
  readonly value: number;
  constructor(data: { value: number }) {
    this.value = data.value;
  }
}

// ─── 55. LivelinessQosPolicyKind (§2.2.3.11 — DCPS IDL `enum`) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.3.11
 * @metaclass enumeration
 * @generalization (root)
 * @definition LivelinessQosPolicyKind is the closed enumeration of the
 *   possible LIVELINESS kinds. Per the §2.2.3.11 summary table:
 *   AUTOMATIC (the default) — The infrastructure will automatically signal
 *   liveliness for the DataWriters at least as often as required by the
 *   lease_duration;
 *   MANUAL_BY_PARTICIPANT — The Service will assume that as long as at
 *   least one Entity within the DomainParticipant has asserted its
 *   liveliness the other Entities in that same DomainParticipant are also
 *   alive;
 *   MANUAL_BY_TOPIC — The Service will only assume liveliness of the
 *   DataWriter if the application has asserted liveliness of that
 *   DataWriter itself.
 * @constraints
 *   For the purposes of the offered/requested compatibility inequality the
 *   values are ordered such that
 *   AUTOMATIC < MANUAL_BY_PARTICIPANT < MANUAL_BY_TOPIC.
 */
export const LIVELINESS_QOS_POLICY_KIND = {
  AUTOMATIC_LIVELINESS_QOS: "AUTOMATIC_LIVELINESS_QOS",
  MANUAL_BY_PARTICIPANT_LIVELINESS_QOS: "MANUAL_BY_PARTICIPANT_LIVELINESS_QOS",
  MANUAL_BY_TOPIC_LIVELINESS_QOS: "MANUAL_BY_TOPIC_LIVELINESS_QOS",
} as const;
export type LivelinessQosPolicyKind =
  typeof LIVELINESS_QOS_POLICY_KIND[keyof typeof LIVELINESS_QOS_POLICY_KIND];

// ─── 56. LivelinessQosPolicy (§2.2.3.11) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.3.11
 * @metaclass concrete
 * @generalization IQosPolicy
 * @definition Determines the mechanism and parameters used by the
 *   application to determine whether an Entity is "active" (alive). The
 *   "liveliness" status of an Entity is used to maintain instance
 *   ownership in combination with the setting of the OWNERSHIP QoS policy.
 *   The application is also informed via listener when an Entity is no
 *   longer alive. The DataReader requests that liveliness of the writers
 *   is maintained by the requested means and loss of liveliness is
 *   detected with delay not to exceed the lease_duration. The DataWriter
 *   commits to signalling its liveliness using the stated means at
 *   intervals not to exceed the lease_duration. Listeners are used to
 *   notify the DataReader of loss of liveliness and DataWriter of
 *   violations to the liveliness contract.
 * @ownedAttributes
 *   kind : LivelinessQosPolicyKind [1]
 *   lease_duration : Duration_t [1]
 * @associationEnds
 *   (none declared in §2.2.3.11)
 * @operations
 *   (none declared in §2.2.3.11)
 * @constraints
 *   Concerns: Topic, DataReader, DataWriter
 *   RxO: Yes
 *   Changeable: No
 *   The value offered is considered compatible with the value requested if
 *   and only if the inequality "offered kind >= requested kind" evaluates
 *   to `TRUE.' For the purposes of this inequality the values of
 *   LIVELINESS kind are considered ordered such that
 *   AUTOMATIC < MANUAL_BY_PARTICIPANT < MANUAL_BY_TOPIC. The default kind
 *   is AUTOMATIC and the default value of the lease_duration is infinite.
 */
export interface ILivelinessQosPolicy extends IQosPolicy {
  readonly kind: LivelinessQosPolicyKind;
  readonly lease_duration: IDuration_t;
}

export class LivelinessQosPolicy implements ILivelinessQosPolicy {
  readonly metaClass = "LivelinessQosPolicy" as const;
  readonly name = "Liveliness" as const;
  readonly kind: LivelinessQosPolicyKind;
  readonly lease_duration: IDuration_t;
  constructor(data: {
    kind: LivelinessQosPolicyKind;
    lease_duration: IDuration_t;
  }) {
    this.kind = data.kind;
    this.lease_duration = data.lease_duration;
  }
}

// ─── 57. TimeBasedFilterQosPolicy (§2.2.3.12) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.3.12
 * @metaclass concrete
 * @generalization IQosPolicy
 * @definition Filter that allows a DataReader to specify that it is
 *   interested only in (potentially) a subset of the values of the data.
 *   The filter states that the DataReader does not want to receive more
 *   than one value each minimum_separation, regardless of how fast the
 *   changes occur. It is inconsistent for a DataReader to have a
 *   minimum_separation longer than its DEADLINE period. By default
 *   minimum_separation = 0 indicating DataReader is potentially interested
 *   in all values.
 * @ownedAttributes
 *   minimum_separation : Duration_t [1]
 * @associationEnds
 *   (none declared in §2.2.3.12)
 * @operations
 *   (none declared in §2.2.3.12)
 * @constraints
 *   Concerns: DataReader
 *   RxO: N/A
 *   Changeable: Yes
 *   It is inconsistent for a DataReader to have a TIME_BASED_FILTER
 *   minimum_separation longer than its DEADLINE period.
 */
export interface ITimeBasedFilterQosPolicy extends IQosPolicy {
  readonly minimum_separation: IDuration_t;
}

export class TimeBasedFilterQosPolicy implements ITimeBasedFilterQosPolicy {
  readonly metaClass = "TimeBasedFilterQosPolicy" as const;
  readonly name = "TimeBasedFilter" as const;
  readonly minimum_separation: IDuration_t;
  constructor(data: { minimum_separation: IDuration_t }) {
    this.minimum_separation = data.minimum_separation;
  }
}

// ─── 58. PartitionQosPolicy (§2.2.3.13) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.3.13
 * @metaclass concrete
 * @generalization IQosPolicy
 * @definition Set of strings that introduces a logical partition among the
 *   topics visible by the Publisher and Subscriber. A DataWriter within a
 *   Publisher only communicates with a DataReader in a Subscriber if (in
 *   addition to matching the Topic and having compatible QoS) the
 *   Publisher and Subscriber have a common partition name string. The
 *   empty string ("") is considered a valid partition that is matched with
 *   other partition names using the same rules of string matching and
 *   regular-expression matching used for any other partition name (see
 *   2.2.3.13). The default value for the PARTITION QoS is a zero-length
 *   sequence. The zero-length sequence is treated as a special value
 *   equivalent to a sequence containing a single element consisting of the
 *   empty string.
 * @ownedAttributes
 *   name : sequence<string> [1]
 * @associationEnds
 *   (none declared in §2.2.3.13)
 * @operations
 *   (none declared in §2.2.3.13)
 * @constraints
 *   Concerns: Publisher, Subscriber
 *   RxO: No
 *   Changeable: Yes
 *
 *   NOTE: the §2.2.3.13 owned attribute "name : sequence<string>" shadows
 *   the inherited QosPolicy.name : string. The inherited QosPolicy-level
 *   name (the QoS-policy identifier "Partition") is surfaced here as the
 *   inherited `name` field on the IQosPolicy supertype, while the policy's
 *   own owned attribute (the list of partition strings) is exposed as
 *   `partitionNames` to avoid collision.
 */
export interface IPartitionQosPolicy extends IQosPolicy {
  readonly partitionNames: ReadonlyArray<string>;
}

export class PartitionQosPolicy implements IPartitionQosPolicy {
  readonly metaClass = "PartitionQosPolicy" as const;
  readonly name = "Partition" as const;
  readonly partitionNames: ReadonlyArray<string>;
  constructor(data: { partitionNames: ReadonlyArray<string> }) {
    this.partitionNames = data.partitionNames;
  }
}

// ─── 59. ReliabilityQosPolicyKind (§2.2.3.14 — DCPS IDL `enum`) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.3.14
 * @metaclass enumeration
 * @generalization (root)
 * @definition ReliabilityQosPolicyKind is the closed enumeration of the
 *   possible RELIABILITY kinds. Per the §2.2.3.14 summary table:
 *   BEST_EFFORT — Indicates that it is acceptable to not retry propagation
 *   of any samples. Presumably new values for the samples are generated
 *   often enough that it is not necessary to re-send or acknowledge any
 *   samples. This is the default value for DataReaders and Topics;
 *   RELIABLE — Specifies the Service will attempt to deliver all samples
 *   in its history. Missed samples may be retried. In steady-state (no
 *   modifications communicated via the DataWriter) the middleware
 *   guarantees that all samples in the DataWriter history will eventually
 *   be delivered to all the DataReader objects. This is the default value
 *   for DataWriters.
 * @constraints
 *   For the purposes of the offered/requested compatibility inequality the
 *   values are ordered such that BEST_EFFORT < RELIABLE.
 */
export const RELIABILITY_QOS_POLICY_KIND = {
  BEST_EFFORT_RELIABILITY_QOS: "BEST_EFFORT_RELIABILITY_QOS",
  RELIABLE_RELIABILITY_QOS: "RELIABLE_RELIABILITY_QOS",
} as const;
export type ReliabilityQosPolicyKind =
  typeof RELIABILITY_QOS_POLICY_KIND[keyof typeof RELIABILITY_QOS_POLICY_KIND];

// ─── 60. ReliabilityQosPolicy (§2.2.3.14) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.3.14
 * @metaclass concrete
 * @generalization IQosPolicy
 * @definition Indicates the level of reliability offered/requested by the
 *   Service. The value of the max_blocking_time indicates the maximum time
 *   the operation DataWriter::write is allowed to block if the DataWriter
 *   does not have space to store the value written. The default
 *   max_blocking_time = 100ms.
 * @ownedAttributes
 *   kind : ReliabilityQosPolicyKind [1]
 *   max_blocking_time : Duration_t [1]
 * @associationEnds
 *   (none declared in §2.2.3.14)
 * @operations
 *   (none declared in §2.2.3.14)
 * @constraints
 *   Concerns: Topic, DataReader, DataWriter
 *   RxO: Yes
 *   Changeable: No
 *   The value offered is considered compatible with the value requested if
 *   and only if the inequality "offered kind >= requested kind" evaluates
 *   to `TRUE.' For the purposes of this inequality, the values of
 *   RELIABILITY kind are considered ordered such that
 *   BEST_EFFORT < RELIABLE. The default kind is BEST_EFFORT for
 *   DataReaders and Topics, and RELIABLE for DataWriters.
 */
export interface IReliabilityQosPolicy extends IQosPolicy {
  readonly kind: ReliabilityQosPolicyKind;
  readonly max_blocking_time: IDuration_t;
}

export class ReliabilityQosPolicy implements IReliabilityQosPolicy {
  readonly metaClass = "ReliabilityQosPolicy" as const;
  readonly name = "Reliability" as const;
  readonly kind: ReliabilityQosPolicyKind;
  readonly max_blocking_time: IDuration_t;
  constructor(data: {
    kind: ReliabilityQosPolicyKind;
    max_blocking_time: IDuration_t;
  }) {
    this.kind = data.kind;
    this.max_blocking_time = data.max_blocking_time;
  }
}

// ─── 61. DestinationOrderQosPolicyKind (§2.2.3.17 — DCPS IDL `enum`) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.3.17
 * @metaclass enumeration
 * @generalization (root)
 * @definition DestinationOrderQosPolicyKind is the closed enumeration of
 *   the possible DESTINATION_ORDER kinds. Per the §2.2.3.17 summary table:
 *   BY_RECEPTION_TIMESTAMP (the default) — Indicates that data is ordered
 *   based on the reception time at each Subscriber. Since each subscriber
 *   may receive the data at different times there is no guaranteed that
 *   the changes will be seen in the same order. Consequently, it is
 *   possible for each subscriber to end up with a different final value
 *   for the data;
 *   BY_SOURCE_TIMESTAMP — Indicates that data is ordered based on a
 *   timestamp placed at the source (by the Service or by the application).
 *   In any case this guarantees a consistent final value for the data in
 *   all subscribers.
 * @constraints
 *   For the purposes of the offered/requested compatibility inequality the
 *   values are ordered such that
 *   BY_RECEPTION_TIMESTAMP < BY_SOURCE_TIMESTAMP.
 */
export const DESTINATION_ORDER_QOS_POLICY_KIND = {
  BY_RECEPTION_TIMESTAMP_DESTINATIONORDER_QOS:
    "BY_RECEPTION_TIMESTAMP_DESTINATIONORDER_QOS",
  BY_SOURCE_TIMESTAMP_DESTINATIONORDER_QOS:
    "BY_SOURCE_TIMESTAMP_DESTINATIONORDER_QOS",
} as const;
export type DestinationOrderQosPolicyKind =
  typeof DESTINATION_ORDER_QOS_POLICY_KIND[keyof typeof DESTINATION_ORDER_QOS_POLICY_KIND];

// ─── 62. DestinationOrderQosPolicy (§2.2.3.17) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.3.17
 * @metaclass concrete
 * @generalization IQosPolicy
 * @definition Controls the criteria used to determine the logical order
 *   among changes made by Publisher entities to the same instance of data
 *   (i.e., matching Topic and key). The default kind is
 *   BY_RECEPTION_TIMESTAMP.
 * @ownedAttributes
 *   kind : DestinationOrderQosPolicyKind [1]
 * @associationEnds
 *   (none declared in §2.2.3.17)
 * @operations
 *   (none declared in §2.2.3.17)
 * @constraints
 *   Concerns: Topic, DataReader, DataWriter
 *   RxO: Yes
 *   Changeable: No
 *   The value offered is considered compatible with the value requested if
 *   and only if the inequality "offered kind >= requested kind" evaluates
 *   to `TRUE.' For the purposes of this inequality, the values of
 *   DESTINATION_ORDER kind are considered ordered such that
 *   BY_RECEPTION_TIMESTAMP < BY_SOURCE_TIMESTAMP.
 */
export interface IDestinationOrderQosPolicy extends IQosPolicy {
  readonly kind: DestinationOrderQosPolicyKind;
}

export class DestinationOrderQosPolicy implements IDestinationOrderQosPolicy {
  readonly metaClass = "DestinationOrderQosPolicy" as const;
  readonly name = "DestinationOrder" as const;
  readonly kind: DestinationOrderQosPolicyKind;
  constructor(data: { kind: DestinationOrderQosPolicyKind }) {
    this.kind = data.kind;
  }
}

// ─── 63. HistoryQosPolicyKind (§2.2.3.18 — DCPS IDL `enum`) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.3.18
 * @metaclass enumeration
 * @generalization (root)
 * @definition HistoryQosPolicyKind is the closed enumeration of the
 *   possible HISTORY kinds. Per the §2.2.3.18 summary table:
 *   KEEP_LAST (the default) — On the publishing side, the Service will
 *   only attempt to keep the most recent "depth" samples of each instance
 *   of data (identified by its key) managed by the DataWriter. On the
 *   subscribing side, the DataReader will only attempt to keep the most
 *   recent "depth" samples received for each instance (identified by its
 *   key) until the application "takes" them via the DataReader's take
 *   operation;
 *   KEEP_ALL — On the publishing side, the Service will attempt to keep
 *   all samples (representing each value written) of each instance of data
 *   (identified by its key) managed by the DataWriter until they can be
 *   delivered to all subscribers. On the subscribing side, the Service
 *   will attempt to keep all samples of each instance of data (identified
 *   by its key) managed by the DataReader. These samples are kept until
 *   the application "takes" them from the Service via the take operation.
 *   The setting of depth has no effect. Its implied value is
 *   LENGTH_UNLIMITED.
 * @constraints
 *   (none declared in DDS 1.4 §2.2.3.18 for the kind enumeration alone —
 *   compatibility is governed by the HistoryQosPolicy summary row.)
 */
export const HISTORY_QOS_POLICY_KIND = {
  KEEP_LAST_HISTORY_QOS: "KEEP_LAST_HISTORY_QOS",
  KEEP_ALL_HISTORY_QOS: "KEEP_ALL_HISTORY_QOS",
} as const;
export type HistoryQosPolicyKind =
  typeof HISTORY_QOS_POLICY_KIND[keyof typeof HISTORY_QOS_POLICY_KIND];

// ─── 64. HistoryQosPolicy (§2.2.3.18) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.3.18
 * @metaclass concrete
 * @generalization IQosPolicy
 * @definition Specifies the behavior of the Service in the case where the
 *   value of a sample changes (one or more times) before it can be
 *   successfully communicated to one or more existing subscribers. This
 *   QoS policy controls whether the Service should deliver only the most
 *   recent value, attempt to deliver all intermediate values, or do
 *   something in between. On the publishing side this policy controls the
 *   samples that should be maintained by the DataWriter on behalf of
 *   existing DataReader entities. The behavior with regards to a
 *   DataReader entities discovered after a sample is written is controlled
 *   by the DURABILITY QoS policy. On the subscribing side it controls the
 *   samples that should be maintained until the application "takes" them
 *   from the Service.
 * @ownedAttributes
 *   kind : HistoryQosPolicyKind [1]
 *   depth : long [1]
 * @associationEnds
 *   (none declared in §2.2.3.18)
 * @operations
 *   (none declared in §2.2.3.18)
 * @constraints
 *   Concerns: Topic, DataReader, DataWriter
 *   RxO: No
 *   Changeable: No
 *   KEEP_LAST is the default kind. The default value of depth is 1. If a
 *   value other than 1 is specified, it should be consistent with the
 *   settings of the RESOURCE_LIMITS QoS policy. With KEEP_ALL the setting
 *   of depth has no effect (its implied value is LENGTH_UNLIMITED).
 */
export interface IHistoryQosPolicy extends IQosPolicy {
  readonly kind: HistoryQosPolicyKind;
  readonly depth: number;
}

export class HistoryQosPolicy implements IHistoryQosPolicy {
  readonly metaClass = "HistoryQosPolicy" as const;
  readonly name = "History" as const;
  readonly kind: HistoryQosPolicyKind;
  readonly depth: number;
  constructor(data: { kind: HistoryQosPolicyKind; depth: number }) {
    this.kind = data.kind;
    this.depth = data.depth;
  }
}

// ─── 65. ResourceLimitsQosPolicy (§2.2.3.19) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.3.19
 * @metaclass concrete
 * @generalization IQosPolicy
 * @definition Specifies the resources that the Service can consume in
 *   order to meet the requested QoS.
 *   max_samples — Specifies the maximum number of data-samples the
 *   DataWriter (or DataReader) can manage across all the instances
 *   associated with it. Represents the maximum samples the middleware can
 *   store for any one DataWriter (or DataReader). It is inconsistent for
 *   this value to be less than max_samples_per_instance. By default,
 *   LENGTH_UNLIMITED.
 *   max_instances — Represents the maximum number of instances DataWriter
 *   (or DataReader) can manage. By default, LENGTH_UNLIMITED.
 *   max_samples_per_instance — Represents the maximum number of samples
 *   of any one instance a DataWriter (or DataReader) can manage. It is
 *   inconsistent for this value to be greater than max_samples. By
 *   default, LENGTH_UNLIMITED.
 *   The DCPS IDL declares the constant `LENGTH_UNLIMITED = -1` as the
 *   sentinel for "unlimited."
 * @ownedAttributes
 *   max_samples : long [1]
 *   max_instances : long [1]
 *   max_samples_per_instance : long [1]
 * @associationEnds
 *   (none declared in §2.2.3.19)
 * @operations
 *   (none declared in §2.2.3.19)
 * @constraints
 *   Concerns: Topic, DataReader, DataWriter
 *   RxO: No
 *   Changeable: No
 *   It is inconsistent for max_samples < max_samples_per_instance.
 *   It is inconsistent for max_samples_per_instance > max_samples.
 */
export interface IResourceLimitsQosPolicy extends IQosPolicy {
  readonly max_samples: number;
  readonly max_instances: number;
  readonly max_samples_per_instance: number;
}

export class ResourceLimitsQosPolicy implements IResourceLimitsQosPolicy {
  readonly metaClass = "ResourceLimitsQosPolicy" as const;
  readonly name = "ResourceLimits" as const;
  readonly max_samples: number;
  readonly max_instances: number;
  readonly max_samples_per_instance: number;
  constructor(data: {
    max_samples: number;
    max_instances: number;
    max_samples_per_instance: number;
  }) {
    this.max_samples = data.max_samples;
    this.max_instances = data.max_instances;
    this.max_samples_per_instance = data.max_samples_per_instance;
  }
}

/** DDS 1.4 §2.2.3.19 — `const long LENGTH_UNLIMITED = -1;` (DCPS IDL).
 *  Sentinel value for the ResourceLimitsQosPolicy and DurabilityServiceQosPolicy
 *  long-typed limits when the application does not wish to bound the
 *  resource. */
export const LENGTH_UNLIMITED = -1;

// ─── 66. EntityFactoryQosPolicy (§2.2.3.20) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.3.20
 * @metaclass concrete
 * @generalization IQosPolicy
 * @definition Controls the behavior of the entity when acting as a factory
 *   for other entities. In other words, configures the side-effects of
 *   the create_* and delete_* operations. Specifies whether the entity
 *   acting as a factory automatically enables the instances it creates.
 *   If autoenable_created_entities == TRUE the factory will automatically
 *   enable each created Entity otherwise it will not. By default, TRUE.
 * @ownedAttributes
 *   autoenable_created_entities : boolean [1]
 * @associationEnds
 *   (none declared in §2.2.3.20)
 * @operations
 *   (none declared in §2.2.3.20)
 * @constraints
 *   Concerns: DomainParticipantFactory, DomainParticipant, Publisher,
 *             Subscriber
 *   RxO: No
 *   Changeable: Yes
 */
export interface IEntityFactoryQosPolicy extends IQosPolicy {
  readonly autoenable_created_entities: boolean;
}

export class EntityFactoryQosPolicy implements IEntityFactoryQosPolicy {
  readonly metaClass = "EntityFactoryQosPolicy" as const;
  readonly name = "EntityFactory" as const;
  readonly autoenable_created_entities: boolean;
  constructor(data: { autoenable_created_entities: boolean }) {
    this.autoenable_created_entities = data.autoenable_created_entities;
  }
}

// ─── 67. WriterDataLifecycleQosPolicy (§2.2.3.21) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.3.21
 * @metaclass concrete
 * @generalization IQosPolicy
 * @definition Specifies the behavior of the DataWriter with regards to the
 *   lifecycle of the data-instances it manages. Controls whether a
 *   DataWriter will automatically dispose instances each time they are
 *   unregistered. The setting autodispose_unregistered_instances = TRUE
 *   indicates that unregistered instances will also be considered
 *   disposed. By default, TRUE.
 * @ownedAttributes
 *   autodispose_unregistered_instances : boolean [1]
 * @associationEnds
 *   (none declared in §2.2.3.21)
 * @operations
 *   (none declared in §2.2.3.21)
 * @constraints
 *   Concerns: DataWriter
 *   RxO: N/A
 *   Changeable: Yes
 */
export interface IWriterDataLifecycleQosPolicy extends IQosPolicy {
  readonly autodispose_unregistered_instances: boolean;
}

export class WriterDataLifecycleQosPolicy
  implements IWriterDataLifecycleQosPolicy {
  readonly metaClass = "WriterDataLifecycleQosPolicy" as const;
  readonly name = "WriterDataLifecycle" as const;
  readonly autodispose_unregistered_instances: boolean;
  constructor(data: { autodispose_unregistered_instances: boolean }) {
    this.autodispose_unregistered_instances =
      data.autodispose_unregistered_instances;
  }
}

// ─── 68. ReaderDataLifecycleQosPolicy (§2.2.3.22) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.3.22
 * @metaclass concrete
 * @generalization IQosPolicy
 * @definition Specifies the behavior of the DataReader with regards to the
 *   lifecycle of the data-instances it manages.
 *   autopurge_nowriter_samples_delay — Indicates the duration the
 *   DataReader must retain information regarding instances that have the
 *   instance_state NOT_ALIVE_NO_WRITERS. By default, infinite.
 *   autopurge_disposed_samples_delay — Indicates the duration the
 *   DataReader must retain information regarding instances that have the
 *   instance_state NOT_ALIVE_DISPOSED. By default, infinite.
 * @ownedAttributes
 *   autopurge_nowriter_samples_delay : Duration_t [1]
 *   autopurge_disposed_samples_delay : Duration_t [1]
 * @associationEnds
 *   (none declared in §2.2.3.22)
 * @operations
 *   (none declared in §2.2.3.22)
 * @constraints
 *   Concerns: DataReader
 *   RxO: N/A
 *   Changeable: Yes
 */
export interface IReaderDataLifecycleQosPolicy extends IQosPolicy {
  readonly autopurge_nowriter_samples_delay: IDuration_t;
  readonly autopurge_disposed_samples_delay: IDuration_t;
}

export class ReaderDataLifecycleQosPolicy
  implements IReaderDataLifecycleQosPolicy {
  readonly metaClass = "ReaderDataLifecycleQosPolicy" as const;
  readonly name = "ReaderDataLifecycle" as const;
  readonly autopurge_nowriter_samples_delay: IDuration_t;
  readonly autopurge_disposed_samples_delay: IDuration_t;
  constructor(data: {
    autopurge_nowriter_samples_delay: IDuration_t;
    autopurge_disposed_samples_delay: IDuration_t;
  }) {
    this.autopurge_nowriter_samples_delay =
      data.autopurge_nowriter_samples_delay;
    this.autopurge_disposed_samples_delay =
      data.autopurge_disposed_samples_delay;
  }
}

// ─── 69. DurabilityServiceQosPolicy (§2.2.3.5) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.3.5
 * @metaclass concrete
 * @generalization IQosPolicy
 * @definition This policy is used to configure the HISTORY QoS and the
 *   RESOURCE_LIMITS QoS used by the fictitious DataReader and DataWriter
 *   used by the "persistence service." The "persistence service" is the
 *   one responsible for implementing the DURABILITY kinds TRANSIENT and
 *   PERSISTENCE (see 2.2.3.4). Specifies the configuration of the
 *   durability service. That is, the service that implements the
 *   DURABILITY kind of TRANSIENT and PERSISTENT.
 *   service_cleanup_delay — Control when the service is able to remove
 *   all information regarding a data-instance. By default, zero.
 *   history_kind, history_depth — Controls the HISTORY QoS of the
 *   fictitious DataReader that stores the data within the durability
 *   service (see 2.2.3.4, DURABILITY). The default settings are
 *   history_kind = KEEP_LAST, history_depth = 1.
 *   max_samples, max_instances, max_samples_per_instance — Control the
 *   RESOURCE_LIMITS QoS of the implied DataReader that stores the data
 *   within the durability service. By default they are all
 *   LENGTH_UNLIMITED.
 * @ownedAttributes
 *   service_cleanup_delay : Duration_t [1]
 *   history_kind : HistoryQosPolicyKind [1]
 *   history_depth : long [1]
 *   max_samples : long [1]
 *   max_instances : long [1]
 *   max_samples_per_instance : long [1]
 * @associationEnds
 *   (none declared in §2.2.3.5)
 * @operations
 *   (none declared in §2.2.3.5)
 * @constraints
 *   Concerns: Topic, DataWriter
 *   RxO: No
 *   Changeable: No
 */
export interface IDurabilityServiceQosPolicy extends IQosPolicy {
  readonly service_cleanup_delay: IDuration_t;
  readonly history_kind: HistoryQosPolicyKind;
  readonly history_depth: number;
  readonly max_samples: number;
  readonly max_instances: number;
  readonly max_samples_per_instance: number;
}

export class DurabilityServiceQosPolicy implements IDurabilityServiceQosPolicy {
  readonly metaClass = "DurabilityServiceQosPolicy" as const;
  readonly name = "DurabilityService" as const;
  readonly service_cleanup_delay: IDuration_t;
  readonly history_kind: HistoryQosPolicyKind;
  readonly history_depth: number;
  readonly max_samples: number;
  readonly max_instances: number;
  readonly max_samples_per_instance: number;
  constructor(data: {
    service_cleanup_delay: IDuration_t;
    history_kind: HistoryQosPolicyKind;
    history_depth: number;
    max_samples: number;
    max_instances: number;
    max_samples_per_instance: number;
  }) {
    this.service_cleanup_delay = data.service_cleanup_delay;
    this.history_kind = data.history_kind;
    this.history_depth = data.history_depth;
    this.max_samples = data.max_samples;
    this.max_instances = data.max_instances;
    this.max_samples_per_instance = data.max_samples_per_instance;
  }
}

// ─── 70. DomainParticipantFactoryQos (§2.2.3 — DCPS IDL `struct`) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.3
 * @metaclass concrete (Qos bundle)
 * @generalization (root)
 * @definition The bundle of QosPolicy values applicable to a
 *   DomainParticipantFactory. Per DCPS IDL `struct DomainParticipantFactoryQos`
 *   the bundle carries exactly one EntityFactoryQosPolicy.
 * @ownedAttributes
 *   entity_factory : EntityFactoryQosPolicy [1]
 * @associationEnds
 *   (none declared in §2.2.3)
 * @operations
 *   (none declared in §2.2.3)
 * @constraints
 *   (none declared in DDS 1.4 §2.2.3 beyond the per-policy constraints
 *   declared on EntityFactoryQosPolicy)
 */
export interface IDomainParticipantFactoryQos {
  readonly entity_factory: IEntityFactoryQosPolicy;
}

export class DomainParticipantFactoryQos
  implements IDomainParticipantFactoryQos {
  readonly metaClass = "DomainParticipantFactoryQos" as const;
  readonly entity_factory: IEntityFactoryQosPolicy;
  constructor(data: { entity_factory: IEntityFactoryQosPolicy }) {
    this.entity_factory = data.entity_factory;
  }
}

// ─── 71. DomainParticipantQos (§2.2.3 — DCPS IDL `struct`) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.3
 * @metaclass concrete (Qos bundle)
 * @generalization (root)
 * @definition The bundle of QosPolicy values applicable to a
 *   DomainParticipant. Per DCPS IDL `struct DomainParticipantQos` the
 *   bundle carries one UserDataQosPolicy and one EntityFactoryQosPolicy.
 * @ownedAttributes
 *   user_data : UserDataQosPolicy [1]
 *   entity_factory : EntityFactoryQosPolicy [1]
 * @associationEnds
 *   (none declared in §2.2.3)
 * @operations
 *   (none declared in §2.2.3)
 * @constraints
 *   (none declared in DDS 1.4 §2.2.3 beyond the per-policy constraints
 *   declared on UserDataQosPolicy and EntityFactoryQosPolicy)
 */
export interface IDomainParticipantQos {
  readonly user_data: IUserDataQosPolicy;
  readonly entity_factory: IEntityFactoryQosPolicy;
}

export class DomainParticipantQos implements IDomainParticipantQos {
  readonly metaClass = "DomainParticipantQos" as const;
  readonly user_data: IUserDataQosPolicy;
  readonly entity_factory: IEntityFactoryQosPolicy;
  constructor(data: {
    user_data: IUserDataQosPolicy;
    entity_factory: IEntityFactoryQosPolicy;
  }) {
    this.user_data = data.user_data;
    this.entity_factory = data.entity_factory;
  }
}

// ─── 72. TopicQos (§2.2.3 — DCPS IDL `struct`) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.3
 * @metaclass concrete (Qos bundle)
 * @generalization (root)
 * @definition The bundle of QosPolicy values applicable to a Topic. Per
 *   DCPS IDL `struct TopicQos` the bundle carries TopicData, Durability,
 *   DurabilityService, Deadline, LatencyBudget, Liveliness, Reliability,
 *   DestinationOrder, History, ResourceLimits, TransportPriority,
 *   Lifespan, and Ownership policies.
 * @ownedAttributes
 *   topic_data : TopicDataQosPolicy [1]
 *   durability : DurabilityQosPolicy [1]
 *   durability_service : DurabilityServiceQosPolicy [1]
 *   deadline : DeadlineQosPolicy [1]
 *   latency_budget : LatencyBudgetQosPolicy [1]
 *   liveliness : LivelinessQosPolicy [1]
 *   reliability : ReliabilityQosPolicy [1]
 *   destination_order : DestinationOrderQosPolicy [1]
 *   history : HistoryQosPolicy [1]
 *   resource_limits : ResourceLimitsQosPolicy [1]
 *   transport_priority : TransportPriorityQosPolicy [1]
 *   lifespan : LifespanQosPolicy [1]
 *   ownership : OwnershipQosPolicy [1]
 * @associationEnds
 *   (none declared in §2.2.3)
 * @operations
 *   (none declared in §2.2.3)
 * @constraints
 *   (none declared in DDS 1.4 §2.2.3 beyond the per-policy constraints
 *   declared on each member policy)
 */
export interface ITopicQos {
  readonly topic_data: ITopicDataQosPolicy;
  readonly durability: IDurabilityQosPolicy;
  readonly durability_service: IDurabilityServiceQosPolicy;
  readonly deadline: IDeadlineQosPolicy;
  readonly latency_budget: ILatencyBudgetQosPolicy;
  readonly liveliness: ILivelinessQosPolicy;
  readonly reliability: IReliabilityQosPolicy;
  readonly destination_order: IDestinationOrderQosPolicy;
  readonly history: IHistoryQosPolicy;
  readonly resource_limits: IResourceLimitsQosPolicy;
  readonly transport_priority: ITransportPriorityQosPolicy;
  readonly lifespan: ILifespanQosPolicy;
  readonly ownership: IOwnershipQosPolicy;
}

export class TopicQos implements ITopicQos {
  readonly metaClass = "TopicQos" as const;
  readonly topic_data: ITopicDataQosPolicy;
  readonly durability: IDurabilityQosPolicy;
  readonly durability_service: IDurabilityServiceQosPolicy;
  readonly deadline: IDeadlineQosPolicy;
  readonly latency_budget: ILatencyBudgetQosPolicy;
  readonly liveliness: ILivelinessQosPolicy;
  readonly reliability: IReliabilityQosPolicy;
  readonly destination_order: IDestinationOrderQosPolicy;
  readonly history: IHistoryQosPolicy;
  readonly resource_limits: IResourceLimitsQosPolicy;
  readonly transport_priority: ITransportPriorityQosPolicy;
  readonly lifespan: ILifespanQosPolicy;
  readonly ownership: IOwnershipQosPolicy;
  constructor(data: {
    topic_data: ITopicDataQosPolicy;
    durability: IDurabilityQosPolicy;
    durability_service: IDurabilityServiceQosPolicy;
    deadline: IDeadlineQosPolicy;
    latency_budget: ILatencyBudgetQosPolicy;
    liveliness: ILivelinessQosPolicy;
    reliability: IReliabilityQosPolicy;
    destination_order: IDestinationOrderQosPolicy;
    history: IHistoryQosPolicy;
    resource_limits: IResourceLimitsQosPolicy;
    transport_priority: ITransportPriorityQosPolicy;
    lifespan: ILifespanQosPolicy;
    ownership: IOwnershipQosPolicy;
  }) {
    this.topic_data = data.topic_data;
    this.durability = data.durability;
    this.durability_service = data.durability_service;
    this.deadline = data.deadline;
    this.latency_budget = data.latency_budget;
    this.liveliness = data.liveliness;
    this.reliability = data.reliability;
    this.destination_order = data.destination_order;
    this.history = data.history;
    this.resource_limits = data.resource_limits;
    this.transport_priority = data.transport_priority;
    this.lifespan = data.lifespan;
    this.ownership = data.ownership;
  }
}

// ─── 73. PublisherQos (§2.2.3 — DCPS IDL `struct`) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.3
 * @metaclass concrete (Qos bundle)
 * @generalization (root)
 * @definition The bundle of QosPolicy values applicable to a Publisher.
 *   Per DCPS IDL `struct PublisherQos` the bundle carries Presentation,
 *   Partition, GroupData, and EntityFactory policies.
 * @ownedAttributes
 *   presentation : PresentationQosPolicy [1]
 *   partition : PartitionQosPolicy [1]
 *   group_data : GroupDataQosPolicy [1]
 *   entity_factory : EntityFactoryQosPolicy [1]
 * @associationEnds
 *   (none declared in §2.2.3)
 * @operations
 *   (none declared in §2.2.3)
 * @constraints
 *   (none declared in DDS 1.4 §2.2.3 beyond the per-policy constraints
 *   declared on each member policy)
 */
export interface IPublisherQos {
  readonly presentation: IPresentationQosPolicy;
  readonly partition: IPartitionQosPolicy;
  readonly group_data: IGroupDataQosPolicy;
  readonly entity_factory: IEntityFactoryQosPolicy;
}

export class PublisherQos implements IPublisherQos {
  readonly metaClass = "PublisherQos" as const;
  readonly presentation: IPresentationQosPolicy;
  readonly partition: IPartitionQosPolicy;
  readonly group_data: IGroupDataQosPolicy;
  readonly entity_factory: IEntityFactoryQosPolicy;
  constructor(data: {
    presentation: IPresentationQosPolicy;
    partition: IPartitionQosPolicy;
    group_data: IGroupDataQosPolicy;
    entity_factory: IEntityFactoryQosPolicy;
  }) {
    this.presentation = data.presentation;
    this.partition = data.partition;
    this.group_data = data.group_data;
    this.entity_factory = data.entity_factory;
  }
}

// ─── 74. SubscriberQos (§2.2.3 — DCPS IDL `struct`) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.3
 * @metaclass concrete (Qos bundle)
 * @generalization (root)
 * @definition The bundle of QosPolicy values applicable to a Subscriber.
 *   Per DCPS IDL `struct SubscriberQos` the bundle carries Presentation,
 *   Partition, GroupData, and EntityFactory policies.
 * @ownedAttributes
 *   presentation : PresentationQosPolicy [1]
 *   partition : PartitionQosPolicy [1]
 *   group_data : GroupDataQosPolicy [1]
 *   entity_factory : EntityFactoryQosPolicy [1]
 * @associationEnds
 *   (none declared in §2.2.3)
 * @operations
 *   (none declared in §2.2.3)
 * @constraints
 *   (none declared in DDS 1.4 §2.2.3 beyond the per-policy constraints
 *   declared on each member policy)
 */
export interface ISubscriberQos {
  readonly presentation: IPresentationQosPolicy;
  readonly partition: IPartitionQosPolicy;
  readonly group_data: IGroupDataQosPolicy;
  readonly entity_factory: IEntityFactoryQosPolicy;
}

export class SubscriberQos implements ISubscriberQos {
  readonly metaClass = "SubscriberQos" as const;
  readonly presentation: IPresentationQosPolicy;
  readonly partition: IPartitionQosPolicy;
  readonly group_data: IGroupDataQosPolicy;
  readonly entity_factory: IEntityFactoryQosPolicy;
  constructor(data: {
    presentation: IPresentationQosPolicy;
    partition: IPartitionQosPolicy;
    group_data: IGroupDataQosPolicy;
    entity_factory: IEntityFactoryQosPolicy;
  }) {
    this.presentation = data.presentation;
    this.partition = data.partition;
    this.group_data = data.group_data;
    this.entity_factory = data.entity_factory;
  }
}

// ─── 75. DataWriterQos (§2.2.3 — DCPS IDL `struct`) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.3
 * @metaclass concrete (Qos bundle)
 * @generalization (root)
 * @definition The bundle of QosPolicy values applicable to a DataWriter.
 *   Per DCPS IDL `struct DataWriterQos` the bundle carries Durability,
 *   DurabilityService, Deadline, LatencyBudget, Liveliness, Reliability,
 *   DestinationOrder, History, ResourceLimits, TransportPriority,
 *   Lifespan, UserData, Ownership, OwnershipStrength, and
 *   WriterDataLifecycle policies.
 * @ownedAttributes
 *   durability : DurabilityQosPolicy [1]
 *   durability_service : DurabilityServiceQosPolicy [1]
 *   deadline : DeadlineQosPolicy [1]
 *   latency_budget : LatencyBudgetQosPolicy [1]
 *   liveliness : LivelinessQosPolicy [1]
 *   reliability : ReliabilityQosPolicy [1]
 *   destination_order : DestinationOrderQosPolicy [1]
 *   history : HistoryQosPolicy [1]
 *   resource_limits : ResourceLimitsQosPolicy [1]
 *   transport_priority : TransportPriorityQosPolicy [1]
 *   lifespan : LifespanQosPolicy [1]
 *   user_data : UserDataQosPolicy [1]
 *   ownership : OwnershipQosPolicy [1]
 *   ownership_strength : OwnershipStrengthQosPolicy [1]
 *   writer_data_lifecycle : WriterDataLifecycleQosPolicy [1]
 * @associationEnds
 *   (none declared in §2.2.3)
 * @operations
 *   (none declared in §2.2.3)
 * @constraints
 *   (none declared in DDS 1.4 §2.2.3 beyond the per-policy constraints
 *   declared on each member policy)
 */
export interface IDataWriterQos {
  readonly durability: IDurabilityQosPolicy;
  readonly durability_service: IDurabilityServiceQosPolicy;
  readonly deadline: IDeadlineQosPolicy;
  readonly latency_budget: ILatencyBudgetQosPolicy;
  readonly liveliness: ILivelinessQosPolicy;
  readonly reliability: IReliabilityQosPolicy;
  readonly destination_order: IDestinationOrderQosPolicy;
  readonly history: IHistoryQosPolicy;
  readonly resource_limits: IResourceLimitsQosPolicy;
  readonly transport_priority: ITransportPriorityQosPolicy;
  readonly lifespan: ILifespanQosPolicy;
  readonly user_data: IUserDataQosPolicy;
  readonly ownership: IOwnershipQosPolicy;
  readonly ownership_strength: IOwnershipStrengthQosPolicy;
  readonly writer_data_lifecycle: IWriterDataLifecycleQosPolicy;
}

export class DataWriterQos implements IDataWriterQos {
  readonly metaClass = "DataWriterQos" as const;
  readonly durability: IDurabilityQosPolicy;
  readonly durability_service: IDurabilityServiceQosPolicy;
  readonly deadline: IDeadlineQosPolicy;
  readonly latency_budget: ILatencyBudgetQosPolicy;
  readonly liveliness: ILivelinessQosPolicy;
  readonly reliability: IReliabilityQosPolicy;
  readonly destination_order: IDestinationOrderQosPolicy;
  readonly history: IHistoryQosPolicy;
  readonly resource_limits: IResourceLimitsQosPolicy;
  readonly transport_priority: ITransportPriorityQosPolicy;
  readonly lifespan: ILifespanQosPolicy;
  readonly user_data: IUserDataQosPolicy;
  readonly ownership: IOwnershipQosPolicy;
  readonly ownership_strength: IOwnershipStrengthQosPolicy;
  readonly writer_data_lifecycle: IWriterDataLifecycleQosPolicy;
  constructor(data: {
    durability: IDurabilityQosPolicy;
    durability_service: IDurabilityServiceQosPolicy;
    deadline: IDeadlineQosPolicy;
    latency_budget: ILatencyBudgetQosPolicy;
    liveliness: ILivelinessQosPolicy;
    reliability: IReliabilityQosPolicy;
    destination_order: IDestinationOrderQosPolicy;
    history: IHistoryQosPolicy;
    resource_limits: IResourceLimitsQosPolicy;
    transport_priority: ITransportPriorityQosPolicy;
    lifespan: ILifespanQosPolicy;
    user_data: IUserDataQosPolicy;
    ownership: IOwnershipQosPolicy;
    ownership_strength: IOwnershipStrengthQosPolicy;
    writer_data_lifecycle: IWriterDataLifecycleQosPolicy;
  }) {
    this.durability = data.durability;
    this.durability_service = data.durability_service;
    this.deadline = data.deadline;
    this.latency_budget = data.latency_budget;
    this.liveliness = data.liveliness;
    this.reliability = data.reliability;
    this.destination_order = data.destination_order;
    this.history = data.history;
    this.resource_limits = data.resource_limits;
    this.transport_priority = data.transport_priority;
    this.lifespan = data.lifespan;
    this.user_data = data.user_data;
    this.ownership = data.ownership;
    this.ownership_strength = data.ownership_strength;
    this.writer_data_lifecycle = data.writer_data_lifecycle;
  }
}

// ─── 76. DataReaderQos (§2.2.3 — DCPS IDL `struct`) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.3
 * @metaclass concrete (Qos bundle)
 * @generalization (root)
 * @definition The bundle of QosPolicy values applicable to a DataReader.
 *   Per DCPS IDL `struct DataReaderQos` the bundle carries Durability,
 *   Deadline, LatencyBudget, Liveliness, Reliability, DestinationOrder,
 *   History, ResourceLimits, UserData, Ownership, TimeBasedFilter, and
 *   ReaderDataLifecycle policies.
 * @ownedAttributes
 *   durability : DurabilityQosPolicy [1]
 *   deadline : DeadlineQosPolicy [1]
 *   latency_budget : LatencyBudgetQosPolicy [1]
 *   liveliness : LivelinessQosPolicy [1]
 *   reliability : ReliabilityQosPolicy [1]
 *   destination_order : DestinationOrderQosPolicy [1]
 *   history : HistoryQosPolicy [1]
 *   resource_limits : ResourceLimitsQosPolicy [1]
 *   user_data : UserDataQosPolicy [1]
 *   ownership : OwnershipQosPolicy [1]
 *   time_based_filter : TimeBasedFilterQosPolicy [1]
 *   reader_data_lifecycle : ReaderDataLifecycleQosPolicy [1]
 * @associationEnds
 *   (none declared in §2.2.3)
 * @operations
 *   (none declared in §2.2.3)
 * @constraints
 *   (none declared in DDS 1.4 §2.2.3 beyond the per-policy constraints
 *   declared on each member policy)
 */
export interface IDataReaderQos {
  readonly durability: IDurabilityQosPolicy;
  readonly deadline: IDeadlineQosPolicy;
  readonly latency_budget: ILatencyBudgetQosPolicy;
  readonly liveliness: ILivelinessQosPolicy;
  readonly reliability: IReliabilityQosPolicy;
  readonly destination_order: IDestinationOrderQosPolicy;
  readonly history: IHistoryQosPolicy;
  readonly resource_limits: IResourceLimitsQosPolicy;
  readonly user_data: IUserDataQosPolicy;
  readonly ownership: IOwnershipQosPolicy;
  readonly time_based_filter: ITimeBasedFilterQosPolicy;
  readonly reader_data_lifecycle: IReaderDataLifecycleQosPolicy;
}

export class DataReaderQos implements IDataReaderQos {
  readonly metaClass = "DataReaderQos" as const;
  readonly durability: IDurabilityQosPolicy;
  readonly deadline: IDeadlineQosPolicy;
  readonly latency_budget: ILatencyBudgetQosPolicy;
  readonly liveliness: ILivelinessQosPolicy;
  readonly reliability: IReliabilityQosPolicy;
  readonly destination_order: IDestinationOrderQosPolicy;
  readonly history: IHistoryQosPolicy;
  readonly resource_limits: IResourceLimitsQosPolicy;
  readonly user_data: IUserDataQosPolicy;
  readonly ownership: IOwnershipQosPolicy;
  readonly time_based_filter: ITimeBasedFilterQosPolicy;
  readonly reader_data_lifecycle: IReaderDataLifecycleQosPolicy;
  constructor(data: {
    durability: IDurabilityQosPolicy;
    deadline: IDeadlineQosPolicy;
    latency_budget: ILatencyBudgetQosPolicy;
    liveliness: ILivelinessQosPolicy;
    reliability: IReliabilityQosPolicy;
    destination_order: IDestinationOrderQosPolicy;
    history: IHistoryQosPolicy;
    resource_limits: IResourceLimitsQosPolicy;
    user_data: IUserDataQosPolicy;
    ownership: IOwnershipQosPolicy;
    time_based_filter: ITimeBasedFilterQosPolicy;
    reader_data_lifecycle: IReaderDataLifecycleQosPolicy;
  }) {
    this.durability = data.durability;
    this.deadline = data.deadline;
    this.latency_budget = data.latency_budget;
    this.liveliness = data.liveliness;
    this.reliability = data.reliability;
    this.destination_order = data.destination_order;
    this.history = data.history;
    this.resource_limits = data.resource_limits;
    this.user_data = data.user_data;
    this.ownership = data.ownership;
    this.time_based_filter = data.time_based_filter;
    this.reader_data_lifecycle = data.reader_data_lifecycle;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// — END Implementer #3: QoS Policies —
//
// Inventory inserted in this section:
//   • QosPolicyId_t            constants (23 named ids incl. INVALID)
//   • QosPolicy abstract base  (1 — IQosPolicy interface only)
//   • Concrete QoS policies    (22 — UserData, TopicData, GroupData,
//       TransportPriority, Lifespan, Durability, Presentation, Deadline,
//       LatencyBudget, Ownership, OwnershipStrength, Liveliness,
//       TimeBasedFilter, Partition, Reliability, DestinationOrder,
//       History, ResourceLimits, EntityFactory, WriterDataLifecycle,
//       ReaderDataLifecycle, DurabilityService)
//   • Kind enumerations        (7 — DurabilityQosPolicyKind,
//       PresentationQosPolicyAccessScopeKind, OwnershipQosPolicyKind,
//       LivelinessQosPolicyKind, ReliabilityQosPolicyKind,
//       DestinationOrderQosPolicyKind, HistoryQosPolicyKind)
//   • Per-Entity Qos bundles   (7 — DomainParticipantFactoryQos,
//       DomainParticipantQos, TopicQos, PublisherQos, SubscriberQos,
//       DataWriterQos, DataReaderQos)
//
// Spec ambiguity flagged in this partition:
//   • PartitionQosPolicy§2.2.3.13 — the §2.2.3.13 owned attribute is named
//     `name : sequence<string>`, which collides with the inherited
//     QosPolicy.name : string (Figure 2.12). Surfaced here as
//     `partitionNames : ReadonlyArray<string>` so the inherited QoS-policy
//     identifier ("Partition") and the policy's owned attribute can both
//     coexist.
//     @section §2.2.3.13
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// IMPLEMENTER #4 — Listeners + Status structures + BuiltinTopicData
// (§2.2.4.1 Communication Status, §2.2.4.3 Access through Listeners,
//  §2.2.5 Built-in Topics)
// ═══════════════════════════════════════════════════════════════════════════

// ─── 77. SampleRejectedStatusKind (§2.2.4.1 — DCPS IDL `enum`) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.4.1
 * @metaclass enumeration
 * @generalization (root)
 * @definition SampleRejectedStatusKind is the closed enumeration carried by
 *   `SampleRejectedStatus.last_reason`. It identifies the reason a received
 *   sample was rejected by the DataReader, or NOT_REJECTED when no rejection
 *   has yet occurred. Per dds_dcps.idl §2.2.4.1, the four literals
 *   correspond to: NOT_REJECTED — the special value used when no samples
 *   have been rejected; REJECTED_BY_INSTANCES_LIMIT — the sample was
 *   rejected because it would exceed the maximum number of instances set by
 *   ResourceLimitsQosPolicy.max_instances; REJECTED_BY_SAMPLES_LIMIT — the
 *   sample was rejected because it would exceed the maximum number of
 *   samples set by ResourceLimitsQosPolicy.max_samples;
 *   REJECTED_BY_SAMPLES_PER_INSTANCE_LIMIT — the sample was rejected
 *   because it would exceed the maximum number of samples per instance set
 *   by ResourceLimitsQosPolicy.max_samples_per_instance.
 * @constraints
 *   (none declared in §2.2.4.1)
 */
export const SAMPLE_REJECTED_STATUS_KIND = {
  NOT_REJECTED: "NOT_REJECTED",
  REJECTED_BY_INSTANCES_LIMIT: "REJECTED_BY_INSTANCES_LIMIT",
  REJECTED_BY_SAMPLES_LIMIT: "REJECTED_BY_SAMPLES_LIMIT",
  REJECTED_BY_SAMPLES_PER_INSTANCE_LIMIT:
    "REJECTED_BY_SAMPLES_PER_INSTANCE_LIMIT",
} as const;
export type SampleRejectedStatusKind =
  typeof SAMPLE_REJECTED_STATUS_KIND[keyof typeof SAMPLE_REJECTED_STATUS_KIND];

// ─── 78. QosPolicyCount (§2.2.4.1 — DCPS IDL `struct`) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.4.1
 * @metaclass concrete
 * @generalization (root)
 * @definition QosPolicyCount is the simple data carrier used by
 *   `OfferedIncompatibleQosStatus.policies` and
 *   `RequestedIncompatibleQosStatus.policies` to record, for a given QoS
 *   policy id, the cumulative number of times an incompatibility involving
 *   that policy has been detected. Per dds_dcps.idl §2.2.4.1:
 *   `struct QosPolicyCount { QosPolicyId_t policy_id; long count; };`.
 * @ownedAttributes
 *   policy_id : QosPolicyId_t [1]
 *   count : long [1]
 * @associationEnds
 *   (none declared in §2.2.4.1)
 * @operations
 *   (none declared in §2.2.4.1)
 * @constraints
 *   (none declared in §2.2.4.1)
 */
export interface IQosPolicyCount {
  readonly policy_id: QosPolicyId_t;
  readonly count: number;
}

export class QosPolicyCount implements IQosPolicyCount {
  readonly metaClass = "QosPolicyCount" as const;
  readonly policy_id: QosPolicyId_t;
  readonly count: number;
  constructor(data: { policy_id: QosPolicyId_t; count: number }) {
    this.policy_id = data.policy_id;
    this.count = data.count;
  }
}

// ─── 79. InconsistentTopicStatus (§2.2.4.1) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.4.1
 * @metaclass concrete
 * @generalization (root)
 * @definition InconsistentTopicStatus is the plain communication status
 *   surfaced on a Topic when another Topic exists with the same name but
 *   different characteristics (i.e., its type is inconsistent with the
 *   Topic to which this status is attached). Per the §2.2.4.1 attribute
 *   table: `total_count` — total cumulative count of the Topics discovered
 *   whose name matches the Topic to which this status is attached and
 *   whose type is inconsistent with the Topic; `total_count_change` — the
 *   incremental number of inconsistent topics discovered since the last
 *   time the listener was called or the status was read.
 * @ownedAttributes
 *   total_count : long [1]
 *   total_count_change : long [1]
 * @associationEnds
 *   (none declared in §2.2.4.1)
 * @operations
 *   (none declared in §2.2.4.1)
 * @constraints
 *   (none declared in §2.2.4.1)
 */
export interface IInconsistentTopicStatus {
  readonly total_count: number;
  readonly total_count_change: number;
}

export class InconsistentTopicStatus implements IInconsistentTopicStatus {
  readonly metaClass = "InconsistentTopicStatus" as const;
  readonly total_count: number;
  readonly total_count_change: number;
  constructor(data: { total_count: number; total_count_change: number }) {
    this.total_count = data.total_count;
    this.total_count_change = data.total_count_change;
  }
}

// ─── 80. SampleLostStatus (§2.2.4.1) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.4.1
 * @metaclass concrete
 * @generalization (root)
 * @definition SampleLostStatus is the plain communication status surfaced
 *   on a DataReader to indicate that a sample has been lost (never
 *   received). Per the §2.2.4.1 attribute table: `total_count` — total
 *   cumulative count of all samples lost across of instances of data
 *   published under the Topic; `total_count_change` — the incremental
 *   number of samples lost since the last time the listener was called or
 *   the status was read.
 * @ownedAttributes
 *   total_count : long [1]
 *   total_count_change : long [1]
 * @associationEnds
 *   (none declared in §2.2.4.1)
 * @operations
 *   (none declared in §2.2.4.1)
 * @constraints
 *   (none declared in §2.2.4.1)
 */
export interface ISampleLostStatus {
  readonly total_count: number;
  readonly total_count_change: number;
}

export class SampleLostStatus implements ISampleLostStatus {
  readonly metaClass = "SampleLostStatus" as const;
  readonly total_count: number;
  readonly total_count_change: number;
  constructor(data: { total_count: number; total_count_change: number }) {
    this.total_count = data.total_count;
    this.total_count_change = data.total_count_change;
  }
}

// ─── 81. SampleRejectedStatus (§2.2.4.1) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.4.1
 * @metaclass concrete
 * @generalization (root)
 * @definition SampleRejectedStatus is the plain communication status
 *   surfaced on a DataReader when a (received) sample has been rejected.
 *   Per the §2.2.4.1 attribute table: `total_count` — total cumulative
 *   count of samples rejected by the DataReader; `total_count_change` —
 *   the incremental number of samples rejected since the last time the
 *   listener was called or the status was read; `last_reason` — reason for
 *   rejecting the last sample rejected, or the special value NOT_REJECTED
 *   if no samples have been rejected; `last_instance_handle` — handle to
 *   the instance being updated by the last sample that was rejected.
 * @ownedAttributes
 *   total_count : long [1]
 *   total_count_change : long [1]
 *   last_reason : SampleRejectedStatusKind [1]
 *   last_instance_handle : InstanceHandle_t [1]
 * @associationEnds
 *   (none declared in §2.2.4.1)
 * @operations
 *   (none declared in §2.2.4.1)
 * @constraints
 *   (none declared in §2.2.4.1)
 */
export interface ISampleRejectedStatus {
  readonly total_count: number;
  readonly total_count_change: number;
  readonly last_reason: SampleRejectedStatusKind;
  readonly last_instance_handle: IInstanceHandle_t;
}

export class SampleRejectedStatus implements ISampleRejectedStatus {
  readonly metaClass = "SampleRejectedStatus" as const;
  readonly total_count: number;
  readonly total_count_change: number;
  readonly last_reason: SampleRejectedStatusKind;
  readonly last_instance_handle: IInstanceHandle_t;
  constructor(data: {
    total_count: number;
    total_count_change: number;
    last_reason: SampleRejectedStatusKind;
    last_instance_handle: IInstanceHandle_t;
  }) {
    this.total_count = data.total_count;
    this.total_count_change = data.total_count_change;
    this.last_reason = data.last_reason;
    this.last_instance_handle = data.last_instance_handle;
  }
}

// ─── 82. LivelinessLostStatus (§2.2.4.1) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.4.1
 * @metaclass concrete
 * @generalization (root)
 * @definition LivelinessLostStatus is the plain communication status
 *   surfaced on a DataWriter to indicate that the liveliness that the
 *   DataWriter has committed through its QosPolicy LIVELINESS was not
 *   respected; thus DataReader entities will consider the DataWriter as no
 *   longer "active." Per the §2.2.4.1 attribute table: `total_count` —
 *   total cumulative number of times that a previously-alive DataWriter
 *   became not alive due to a failure to actively signal its liveliness
 *   within its offered liveliness period. This count does not change when
 *   an already not alive DataWriter simply remains not alive for another
 *   liveliness period; `total_count_change` — the change in total_count
 *   since the last time the listener was called or the status was read.
 * @ownedAttributes
 *   total_count : long [1]
 *   total_count_change : long [1]
 * @associationEnds
 *   (none declared in §2.2.4.1)
 * @operations
 *   (none declared in §2.2.4.1)
 * @constraints
 *   (none declared in §2.2.4.1)
 */
export interface ILivelinessLostStatus {
  readonly total_count: number;
  readonly total_count_change: number;
}

export class LivelinessLostStatus implements ILivelinessLostStatus {
  readonly metaClass = "LivelinessLostStatus" as const;
  readonly total_count: number;
  readonly total_count_change: number;
  constructor(data: { total_count: number; total_count_change: number }) {
    this.total_count = data.total_count;
    this.total_count_change = data.total_count_change;
  }
}

// ─── 83. LivelinessChangedStatus (§2.2.4.1) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.4.1
 * @metaclass concrete
 * @generalization (root)
 * @definition LivelinessChangedStatus is the plain communication status
 *   surfaced on a DataReader to indicate that the liveliness of one or
 *   more DataWriter that were writing instances read through the
 *   DataReader has changed. Some DataWriter have become "active" or
 *   "inactive." Per the §2.2.4.1 attribute table: `alive_count` — the
 *   total number of currently active DataWriters that write the Topic read
 *   by the DataReader. This count increases when a newly matched
 *   DataWriter asserts its liveliness for the first time or when a
 *   DataWriter previously considered to be not alive reasserts its
 *   liveliness. The count decreases when a DataWriter considered alive
 *   fails to assert its liveliness and becomes not alive, whether because
 *   it was deleted normally or for some other reason; `not_alive_count` —
 *   the total count of currently DataWriters that write the Topic read by
 *   the DataReader that are no longer asserting their liveliness. This
 *   count increases when a DataWriter considered alive fails to assert its
 *   liveliness and becomes not alive for some reason other than the
 *   normal deletion of that DataWriter. It decreases when a previously
 *   not alive DataWriter either reasserts its liveliness or is deleted
 *   normally; `alive_count_change` — the change in the alive_count since
 *   the last time the listener was called or the status was read;
 *   `not_alive_count_change` — the change in the not_alive_count since
 *   the last time the listener was called or the status was read;
 *   `last_publication_handle` — handle to the last DataWriter whose change
 *   in liveliness caused this status to change.
 * @ownedAttributes
 *   alive_count : long [1]
 *   not_alive_count : long [1]
 *   alive_count_change : long [1]
 *   not_alive_count_change : long [1]
 *   last_publication_handle : InstanceHandle_t [1]
 * @associationEnds
 *   (none declared in §2.2.4.1)
 * @operations
 *   (none declared in §2.2.4.1)
 * @constraints
 *   (none declared in §2.2.4.1)
 */
export interface ILivelinessChangedStatus {
  readonly alive_count: number;
  readonly not_alive_count: number;
  readonly alive_count_change: number;
  readonly not_alive_count_change: number;
  readonly last_publication_handle: IInstanceHandle_t;
}

export class LivelinessChangedStatus implements ILivelinessChangedStatus {
  readonly metaClass = "LivelinessChangedStatus" as const;
  readonly alive_count: number;
  readonly not_alive_count: number;
  readonly alive_count_change: number;
  readonly not_alive_count_change: number;
  readonly last_publication_handle: IInstanceHandle_t;
  constructor(data: {
    alive_count: number;
    not_alive_count: number;
    alive_count_change: number;
    not_alive_count_change: number;
    last_publication_handle: IInstanceHandle_t;
  }) {
    this.alive_count = data.alive_count;
    this.not_alive_count = data.not_alive_count;
    this.alive_count_change = data.alive_count_change;
    this.not_alive_count_change = data.not_alive_count_change;
    this.last_publication_handle = data.last_publication_handle;
  }
}

// ─── 84. OfferedDeadlineMissedStatus (§2.2.4.1) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.4.1
 * @metaclass concrete
 * @generalization (root)
 * @definition OfferedDeadlineMissedStatus is the plain communication
 *   status surfaced on a DataWriter to indicate that the deadline that the
 *   DataWriter has committed through its QosPolicy DEADLINE was not
 *   respected for a specific instance. Per the §2.2.4.1 attribute table:
 *   `total_count` — total cumulative number of offered deadline periods
 *   elapsed during which a DataWriter failed to provide data. Missed
 *   deadlines accumulate; that is, each deadline period the total_count
 *   will be incremented by one; `total_count_change` — the change in
 *   total_count since the last time the listener was called or the status
 *   was read; `last_instance_handle` — handle to the last instance in the
 *   DataWriter for which an offered deadline was missed.
 * @ownedAttributes
 *   total_count : long [1]
 *   total_count_change : long [1]
 *   last_instance_handle : InstanceHandle_t [1]
 * @associationEnds
 *   (none declared in §2.2.4.1)
 * @operations
 *   (none declared in §2.2.4.1)
 * @constraints
 *   (none declared in §2.2.4.1)
 */
export interface IOfferedDeadlineMissedStatus {
  readonly total_count: number;
  readonly total_count_change: number;
  readonly last_instance_handle: IInstanceHandle_t;
}

export class OfferedDeadlineMissedStatus
  implements IOfferedDeadlineMissedStatus
{
  readonly metaClass = "OfferedDeadlineMissedStatus" as const;
  readonly total_count: number;
  readonly total_count_change: number;
  readonly last_instance_handle: IInstanceHandle_t;
  constructor(data: {
    total_count: number;
    total_count_change: number;
    last_instance_handle: IInstanceHandle_t;
  }) {
    this.total_count = data.total_count;
    this.total_count_change = data.total_count_change;
    this.last_instance_handle = data.last_instance_handle;
  }
}

// ─── 85. RequestedDeadlineMissedStatus (§2.2.4.1) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.4.1
 * @metaclass concrete
 * @generalization (root)
 * @definition RequestedDeadlineMissedStatus is the plain communication
 *   status surfaced on a DataReader to indicate that the deadline that the
 *   DataReader was expecting through its QosPolicy DEADLINE was not
 *   respected for a specific instance. Per the §2.2.4.1 attribute table:
 *   `total_count` — total cumulative number of missed deadlines detected
 *   for any instance read by the DataReader. Missed deadlines accumulate;
 *   that is, each deadline period the total_count will be incremented by
 *   one for each instance for which data was not received;
 *   `total_count_change` — the incremental number of deadlines detected
 *   since the last time the listener was called or the status was read;
 *   `last_instance_handle` — handle to the last instance in the DataReader
 *   for which a deadline was detected.
 * @ownedAttributes
 *   total_count : long [1]
 *   total_count_change : long [1]
 *   last_instance_handle : InstanceHandle_t [1]
 * @associationEnds
 *   (none declared in §2.2.4.1)
 * @operations
 *   (none declared in §2.2.4.1)
 * @constraints
 *   (none declared in §2.2.4.1)
 */
export interface IRequestedDeadlineMissedStatus {
  readonly total_count: number;
  readonly total_count_change: number;
  readonly last_instance_handle: IInstanceHandle_t;
}

export class RequestedDeadlineMissedStatus
  implements IRequestedDeadlineMissedStatus
{
  readonly metaClass = "RequestedDeadlineMissedStatus" as const;
  readonly total_count: number;
  readonly total_count_change: number;
  readonly last_instance_handle: IInstanceHandle_t;
  constructor(data: {
    total_count: number;
    total_count_change: number;
    last_instance_handle: IInstanceHandle_t;
  }) {
    this.total_count = data.total_count;
    this.total_count_change = data.total_count_change;
    this.last_instance_handle = data.last_instance_handle;
  }
}

// ─── 86. OfferedIncompatibleQosStatus (§2.2.4.1) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.4.1
 * @metaclass concrete
 * @generalization (root)
 * @definition OfferedIncompatibleQosStatus is the plain communication
 *   status surfaced on a DataWriter to indicate that a QosPolicy value was
 *   incompatible with what was requested. Per the §2.2.4.1 attribute
 *   table: `total_count` — total cumulative number of times the concerned
 *   DataWriter discovered a DataReader for the same Topic with a requested
 *   QoS that is incompatible with that offered by the DataWriter;
 *   `total_count_change` — the change in total_count since the last time
 *   the listener was called or the status was read; `last_policy_id` —
 *   the PolicyId_t of one of the policies that was found to be
 *   incompatible the last time an incompatibility was detected;
 *   `policies` — a list containing for each policy the total number of
 *   times that the concerned DataWriter discovered a DataReader for the
 *   same Topic with a requested QoS that is incompatible with that offered
 *   by the DataWriter.
 * @ownedAttributes
 *   total_count : long [1]
 *   total_count_change : long [1]
 *   last_policy_id : QosPolicyId_t [1]
 *   policies : QosPolicyCount [*]
 * @associationEnds
 *   (none declared in §2.2.4.1)
 * @operations
 *   (none declared in §2.2.4.1)
 * @constraints
 *   (none declared in §2.2.4.1)
 */
export interface IOfferedIncompatibleQosStatus {
  readonly total_count: number;
  readonly total_count_change: number;
  readonly last_policy_id: QosPolicyId_t;
  readonly policies: ReadonlyArray<IQosPolicyCount>;
}

export class OfferedIncompatibleQosStatus
  implements IOfferedIncompatibleQosStatus
{
  readonly metaClass = "OfferedIncompatibleQosStatus" as const;
  readonly total_count: number;
  readonly total_count_change: number;
  readonly last_policy_id: QosPolicyId_t;
  readonly policies: ReadonlyArray<IQosPolicyCount>;
  constructor(data: {
    total_count: number;
    total_count_change: number;
    last_policy_id: QosPolicyId_t;
    policies: ReadonlyArray<IQosPolicyCount>;
  }) {
    this.total_count = data.total_count;
    this.total_count_change = data.total_count_change;
    this.last_policy_id = data.last_policy_id;
    this.policies = data.policies;
  }
}

// ─── 87. RequestedIncompatibleQosStatus (§2.2.4.1) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.4.1
 * @metaclass concrete
 * @generalization (root)
 * @definition RequestedIncompatibleQosStatus is the plain communication
 *   status surfaced on a DataReader to indicate that a QosPolicy value was
 *   incompatible with what is offered. Per the §2.2.4.1 attribute table:
 *   `total_count` — total cumulative number of times the concerned
 *   DataReader discovered a DataWriter for the same Topic with an offered
 *   QoS that was incompatible with that requested by the DataReader;
 *   `total_count_change` — the change in total_count since the last time
 *   the listener was called or the status was read; `last_policy_id` —
 *   the QosPolicyId_t of one of the policies that was found to be
 *   incompatible the last time an incompatibility was detected;
 *   `policies` — a list containing for each policy the total number of
 *   times that the concerned DataReader discovered a DataWriter for the
 *   same Topic with an offered QoS that is incompatible with that
 *   requested by the DataReader.
 * @ownedAttributes
 *   total_count : long [1]
 *   total_count_change : long [1]
 *   last_policy_id : QosPolicyId_t [1]
 *   policies : QosPolicyCount [*]
 * @associationEnds
 *   (none declared in §2.2.4.1)
 * @operations
 *   (none declared in §2.2.4.1)
 * @constraints
 *   (none declared in §2.2.4.1)
 */
export interface IRequestedIncompatibleQosStatus {
  readonly total_count: number;
  readonly total_count_change: number;
  readonly last_policy_id: QosPolicyId_t;
  readonly policies: ReadonlyArray<IQosPolicyCount>;
}

export class RequestedIncompatibleQosStatus
  implements IRequestedIncompatibleQosStatus
{
  readonly metaClass = "RequestedIncompatibleQosStatus" as const;
  readonly total_count: number;
  readonly total_count_change: number;
  readonly last_policy_id: QosPolicyId_t;
  readonly policies: ReadonlyArray<IQosPolicyCount>;
  constructor(data: {
    total_count: number;
    total_count_change: number;
    last_policy_id: QosPolicyId_t;
    policies: ReadonlyArray<IQosPolicyCount>;
  }) {
    this.total_count = data.total_count;
    this.total_count_change = data.total_count_change;
    this.last_policy_id = data.last_policy_id;
    this.policies = data.policies;
  }
}

// ─── 88. PublicationMatchedStatus (§2.2.4.1) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.4.1
 * @metaclass concrete
 * @generalization (root)
 * @definition PublicationMatchedStatus is the plain communication status
 *   surfaced on a DataWriter to indicate that the DataWriter has found
 *   DataReader that matches the Topic and has compatible QoS, or has
 *   ceased to be matched with a DataReader that was previously considered
 *   to be matched. Per the §2.2.4.1 attribute table: `total_count` —
 *   total cumulative count the concerned DataWriter discovered a "match"
 *   with a DataReader. That is, it found a DataReader for the same Topic
 *   with a requested QoS that is compatible with that offered by the
 *   DataWriter; `total_count_change` — the change in total_count since
 *   the last time the listener was called or the status was read;
 *   `last_subscription_handle` — handle to the last DataReader that
 *   matched the DataWriter causing the status to change; `current_count`
 *   — the number of DataReaders currently matched to the concerned
 *   DataWriter; `current_count_change` — the change in current_count
 *   since the last time the listener was called or the status was read.
 * @ownedAttributes
 *   total_count : long [1]
 *   total_count_change : long [1]
 *   last_subscription_handle : InstanceHandle_t [1]
 *   current_count : long [1]
 *   current_count_change : long [1]
 * @associationEnds
 *   (none declared in §2.2.4.1)
 * @operations
 *   (none declared in §2.2.4.1)
 * @constraints
 *   (none declared in §2.2.4.1)
 */
export interface IPublicationMatchedStatus {
  readonly total_count: number;
  readonly total_count_change: number;
  readonly last_subscription_handle: IInstanceHandle_t;
  readonly current_count: number;
  readonly current_count_change: number;
}

export class PublicationMatchedStatus implements IPublicationMatchedStatus {
  readonly metaClass = "PublicationMatchedStatus" as const;
  readonly total_count: number;
  readonly total_count_change: number;
  readonly last_subscription_handle: IInstanceHandle_t;
  readonly current_count: number;
  readonly current_count_change: number;
  constructor(data: {
    total_count: number;
    total_count_change: number;
    last_subscription_handle: IInstanceHandle_t;
    current_count: number;
    current_count_change: number;
  }) {
    this.total_count = data.total_count;
    this.total_count_change = data.total_count_change;
    this.last_subscription_handle = data.last_subscription_handle;
    this.current_count = data.current_count;
    this.current_count_change = data.current_count_change;
  }
}

// ─── 89. SubscriptionMatchedStatus (§2.2.4.1) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.4.1
 * @metaclass concrete
 * @generalization (root)
 * @definition SubscriptionMatchedStatus is the plain communication status
 *   surfaced on a DataReader to indicate that the DataReader has found a
 *   DataWriter that matches the Topic and has compatible QoS, or has
 *   ceased to be matched with a DataWriter that was previously considered
 *   to be matched. Per the §2.2.4.1 attribute table: `total_count` —
 *   total cumulative count the concerned DataReader discovered a "match"
 *   with a DataWriter. That is, it found a DataWriter for the same Topic
 *   with a requested QoS that is compatible with that offered by the
 *   DataReader; `total_count_change` — the change in total_count since
 *   the last time the listener was called or the status was read;
 *   `last_publication_handle` — handle to the last DataWriter that
 *   matched the DataReader causing the status to change; `current_count`
 *   — the number of DataWriters currently matched to the concerned
 *   DataReader; `current_count_change` — the change in current_count
 *   since the last time the listener was called or the status was read.
 * @ownedAttributes
 *   total_count : long [1]
 *   total_count_change : long [1]
 *   last_publication_handle : InstanceHandle_t [1]
 *   current_count : long [1]
 *   current_count_change : long [1]
 * @associationEnds
 *   (none declared in §2.2.4.1)
 * @operations
 *   (none declared in §2.2.4.1)
 * @constraints
 *   (none declared in §2.2.4.1)
 */
export interface ISubscriptionMatchedStatus {
  readonly total_count: number;
  readonly total_count_change: number;
  readonly last_publication_handle: IInstanceHandle_t;
  readonly current_count: number;
  readonly current_count_change: number;
}

export class SubscriptionMatchedStatus implements ISubscriptionMatchedStatus {
  readonly metaClass = "SubscriptionMatchedStatus" as const;
  readonly total_count: number;
  readonly total_count_change: number;
  readonly last_publication_handle: IInstanceHandle_t;
  readonly current_count: number;
  readonly current_count_change: number;
  constructor(data: {
    total_count: number;
    total_count_change: number;
    last_publication_handle: IInstanceHandle_t;
    current_count: number;
    current_count_change: number;
  }) {
    this.total_count = data.total_count;
    this.total_count_change = data.total_count_change;
    this.last_publication_handle = data.last_publication_handle;
    this.current_count = data.current_count;
    this.current_count_change = data.current_count_change;
  }
}

// ─── 90. Listener (§2.1.4 / §2.2.4.3 — abstract marker) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.4.3
 * @metaclass abstract
 * @generalization (root)
 * @definition Listener is the abstract supertype of every concrete listener
 *   interface in the DCPS API. Per §2.2.4.3, listeners provide a mechanism
 *   for the middleware to asynchronously alert the application of the
 *   occurrence of relevant status changes. All Entity support a listener,
 *   the type of which is specialized to the specific type of the related
 *   Entity (e.g., DataReaderListener for the DataReader). Listeners are
 *   interfaces that the application must implement. Each dedicated
 *   listener presents a list of operations that correspond to the relevant
 *   communication status changes. Per dds_dcps.idl §2.2.4.3:
 *   `interface Listener {};` — Listener itself declares no operations; it
 *   is a marker interface.
 * @ownedAttributes
 *   (none declared in §2.2.4.3)
 * @associationEnds
 *   (none declared in §2.2.4.3)
 * @operations
 *   (none declared in §2.2.4.3)
 * @constraints
 *   (none declared in §2.2.4.3)
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IListener {}

// ─── 91. TopicListener (§2.2.5.1 — listed under §2.2.4.3 Figure 2.17) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.5.1
 * @metaclass concrete
 * @generalization IListener
 * @definition TopicListener is the listener specialized to a Topic Entity.
 *   Per §2.2.4.3 Figure 2.17 and dds_dcps.idl, TopicListener declares the
 *   single callback `on_inconsistent_topic` that fires when the
 *   InconsistentTopicStatus communication status of a Topic changes. The
 *   `the_topic` parameter is a reference to the actual concerned Entity;
 *   the `status` parameter conveys the InconsistentTopicStatus value at
 *   the time of the callback. Listeners are stateless, so a single
 *   TopicListener instance MAY be shared among multiple Topic objects.
 * @ownedAttributes
 *   (none declared in §2.2.5.1)
 * @associationEnds
 *   (none declared in §2.2.5.1)
 * @operations
 *   on_inconsistent_topic(the_topic : Topic, status : InconsistentTopicStatus) : void
 * @constraints
 *   (none declared in §2.2.5.1)
 */
export interface ITopicListener extends IListener {
  on_inconsistent_topic(
    the_topic: ITopic,
    status: IInconsistentTopicStatus
  ): void;
}

export class TopicListener implements ITopicListener {
  readonly metaClass = "TopicListener" as const;
  on_inconsistent_topic(
    _the_topic: ITopic,
    _status: IInconsistentTopicStatus
  ): void {
    // default: NO-OP `nil' listener (per §2.2.4.3 default semantics)
  }
}

// ─── 92. DataWriterListener (§2.2.4.3) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.4.3
 * @metaclass concrete
 * @generalization IListener
 * @definition DataWriterListener is the listener specialized to a
 *   DataWriter Entity. Per §2.2.4.3 Figure 2.17 and dds_dcps.idl, it
 *   declares one callback per plain communication status that may be
 *   surfaced on a DataWriter: on_offered_deadline_missed,
 *   on_offered_incompatible_qos, on_liveliness_lost, on_publication_matched.
 *   The first parameter of every callback is the reference to the
 *   concerned DataWriter; the second is the value of the corresponding
 *   communication status struct at the time of the callback.
 * @ownedAttributes
 *   (none declared in §2.2.4.3)
 * @associationEnds
 *   (none declared in §2.2.4.3)
 * @operations
 *   on_offered_deadline_missed(writer : DataWriter, status : OfferedDeadlineMissedStatus) : void
 *   on_offered_incompatible_qos(writer : DataWriter, status : OfferedIncompatibleQosStatus) : void
 *   on_liveliness_lost(writer : DataWriter, status : LivelinessLostStatus) : void
 *   on_publication_matched(writer : DataWriter, status : PublicationMatchedStatus) : void
 * @constraints
 *   (none declared in §2.2.4.3)
 */
export interface IDataWriterListener extends IListener {
  on_offered_deadline_missed(
    writer: IDataWriter,
    status: IOfferedDeadlineMissedStatus
  ): void;
  on_offered_incompatible_qos(
    writer: IDataWriter,
    status: IOfferedIncompatibleQosStatus
  ): void;
  on_liveliness_lost(
    writer: IDataWriter,
    status: ILivelinessLostStatus
  ): void;
  on_publication_matched(
    writer: IDataWriter,
    status: IPublicationMatchedStatus
  ): void;
}

export class DataWriterListener implements IDataWriterListener {
  readonly metaClass = "DataWriterListener" as const;
  on_offered_deadline_missed(
    _writer: IDataWriter,
    _status: IOfferedDeadlineMissedStatus
  ): void {
    // default: NO-OP `nil' listener
  }
  on_offered_incompatible_qos(
    _writer: IDataWriter,
    _status: IOfferedIncompatibleQosStatus
  ): void {
    // default: NO-OP `nil' listener
  }
  on_liveliness_lost(
    _writer: IDataWriter,
    _status: ILivelinessLostStatus
  ): void {
    // default: NO-OP `nil' listener
  }
  on_publication_matched(
    _writer: IDataWriter,
    _status: IPublicationMatchedStatus
  ): void {
    // default: NO-OP `nil' listener
  }
}

// ─── 93. PublisherListener (§2.2.4.3) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.4.3
 * @metaclass concrete
 * @generalization IDataWriterListener
 * @definition PublisherListener is the listener specialized to a Publisher
 *   Entity. Per §2.2.4.3 Figure 2.17 and dds_dcps.idl
 *   (`interface PublisherListener : DataWriterListener {};`),
 *   PublisherListener inherits every DataWriter callback from
 *   DataWriterListener and adds no operations of its own. The Publisher
 *   embeds DataWriter — see §2.2.4.3.1 Figure 2.18 — so a
 *   DataWriter-status-change callback on the PublisherListener is the
 *   default-fallback target when the offending DataWriter does not have a
 *   listener of its own (or has one whose corresponding callback is not
 *   enabled in the mask).
 * @ownedAttributes
 *   (none declared in §2.2.4.3)
 * @associationEnds
 *   (none declared in §2.2.4.3)
 * @operations
 *   (inherited from DataWriterListener)
 * @constraints
 *   (none declared in §2.2.4.3)
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IPublisherListener extends IDataWriterListener {}

export class PublisherListener implements IPublisherListener {
  readonly metaClass = "PublisherListener" as const;
  on_offered_deadline_missed(
    _writer: IDataWriter,
    _status: IOfferedDeadlineMissedStatus
  ): void {
    // default: NO-OP `nil' listener
  }
  on_offered_incompatible_qos(
    _writer: IDataWriter,
    _status: IOfferedIncompatibleQosStatus
  ): void {
    // default: NO-OP `nil' listener
  }
  on_liveliness_lost(
    _writer: IDataWriter,
    _status: ILivelinessLostStatus
  ): void {
    // default: NO-OP `nil' listener
  }
  on_publication_matched(
    _writer: IDataWriter,
    _status: IPublicationMatchedStatus
  ): void {
    // default: NO-OP `nil' listener
  }
}

// ─── 94. DataReaderListener (§2.2.4.3) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.4.3
 * @metaclass concrete
 * @generalization IListener
 * @definition DataReaderListener is the listener specialized to a
 *   DataReader Entity. Per §2.2.4.3 Figure 2.17 and dds_dcps.idl, it
 *   declares one callback per plain communication status that may be
 *   surfaced on a DataReader (on_requested_deadline_missed,
 *   on_requested_incompatible_qos, on_sample_rejected,
 *   on_liveliness_changed, on_subscription_matched, on_sample_lost) plus
 *   the read communication status callback on_data_available.
 *   on_data_available is the only callback that takes the_reader alone
 *   (no status struct) — its very firing is the notification.
 * @ownedAttributes
 *   (none declared in §2.2.4.3)
 * @associationEnds
 *   (none declared in §2.2.4.3)
 * @operations
 *   on_requested_deadline_missed(the_reader : DataReader, status : RequestedDeadlineMissedStatus) : void
 *   on_requested_incompatible_qos(the_reader : DataReader, status : RequestedIncompatibleQosStatus) : void
 *   on_sample_rejected(the_reader : DataReader, status : SampleRejectedStatus) : void
 *   on_liveliness_changed(the_reader : DataReader, status : LivelinessChangedStatus) : void
 *   on_data_available(the_reader : DataReader) : void
 *   on_subscription_matched(the_reader : DataReader, status : SubscriptionMatchedStatus) : void
 *   on_sample_lost(the_reader : DataReader, status : SampleLostStatus) : void
 * @constraints
 *   (none declared in §2.2.4.3)
 */
export interface IDataReaderListener extends IListener {
  on_requested_deadline_missed(
    the_reader: IDataReader,
    status: IRequestedDeadlineMissedStatus
  ): void;
  on_requested_incompatible_qos(
    the_reader: IDataReader,
    status: IRequestedIncompatibleQosStatus
  ): void;
  on_sample_rejected(
    the_reader: IDataReader,
    status: ISampleRejectedStatus
  ): void;
  on_liveliness_changed(
    the_reader: IDataReader,
    status: ILivelinessChangedStatus
  ): void;
  on_data_available(the_reader: IDataReader): void;
  on_subscription_matched(
    the_reader: IDataReader,
    status: ISubscriptionMatchedStatus
  ): void;
  on_sample_lost(
    the_reader: IDataReader,
    status: ISampleLostStatus
  ): void;
}

export class DataReaderListener implements IDataReaderListener {
  readonly metaClass = "DataReaderListener" as const;
  on_requested_deadline_missed(
    _the_reader: IDataReader,
    _status: IRequestedDeadlineMissedStatus
  ): void {
    // default: NO-OP `nil' listener
  }
  on_requested_incompatible_qos(
    _the_reader: IDataReader,
    _status: IRequestedIncompatibleQosStatus
  ): void {
    // default: NO-OP `nil' listener
  }
  on_sample_rejected(
    _the_reader: IDataReader,
    _status: ISampleRejectedStatus
  ): void {
    // default: NO-OP `nil' listener
  }
  on_liveliness_changed(
    _the_reader: IDataReader,
    _status: ILivelinessChangedStatus
  ): void {
    // default: NO-OP `nil' listener
  }
  on_data_available(_the_reader: IDataReader): void {
    // default: NO-OP `nil' listener
  }
  on_subscription_matched(
    _the_reader: IDataReader,
    _status: ISubscriptionMatchedStatus
  ): void {
    // default: NO-OP `nil' listener
  }
  on_sample_lost(
    _the_reader: IDataReader,
    _status: ISampleLostStatus
  ): void {
    // default: NO-OP `nil' listener
  }
}

// ─── 95. SubscriberListener (§2.2.4.3) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.4.3
 * @metaclass concrete
 * @generalization IDataReaderListener
 * @definition SubscriberListener is the listener specialized to a
 *   Subscriber Entity. Per §2.2.4.3 Figure 2.17 and dds_dcps.idl
 *   (`interface SubscriberListener : DataReaderListener { void
 *   on_data_on_readers(in Subscriber the_subscriber); };`),
 *   SubscriberListener inherits every DataReader callback from
 *   DataReaderListener and adds the single read-communication-status
 *   callback `on_data_on_readers`. Per §2.2.4.3.2, when read communication
 *   status changes, the middleware first tries to trigger
 *   on_data_on_readers on the related Subscriber; if that does not
 *   succeed (no listener or operation non-enabled), it tries to trigger
 *   on_data_available on all the related DataReaderListener objects.
 * @ownedAttributes
 *   (none declared in §2.2.4.3)
 * @associationEnds
 *   (none declared in §2.2.4.3)
 * @operations
 *   (inherited from DataReaderListener)
 *   on_data_on_readers(the_subscriber : Subscriber) : void
 * @constraints
 *   (none declared in §2.2.4.3)
 */
export interface ISubscriberListener extends IDataReaderListener {
  on_data_on_readers(the_subscriber: ISubscriber): void;
}

export class SubscriberListener implements ISubscriberListener {
  readonly metaClass = "SubscriberListener" as const;
  on_requested_deadline_missed(
    _the_reader: IDataReader,
    _status: IRequestedDeadlineMissedStatus
  ): void {
    // default: NO-OP `nil' listener
  }
  on_requested_incompatible_qos(
    _the_reader: IDataReader,
    _status: IRequestedIncompatibleQosStatus
  ): void {
    // default: NO-OP `nil' listener
  }
  on_sample_rejected(
    _the_reader: IDataReader,
    _status: ISampleRejectedStatus
  ): void {
    // default: NO-OP `nil' listener
  }
  on_liveliness_changed(
    _the_reader: IDataReader,
    _status: ILivelinessChangedStatus
  ): void {
    // default: NO-OP `nil' listener
  }
  on_data_available(_the_reader: IDataReader): void {
    // default: NO-OP `nil' listener
  }
  on_subscription_matched(
    _the_reader: IDataReader,
    _status: ISubscriptionMatchedStatus
  ): void {
    // default: NO-OP `nil' listener
  }
  on_sample_lost(
    _the_reader: IDataReader,
    _status: ISampleLostStatus
  ): void {
    // default: NO-OP `nil' listener
  }
  on_data_on_readers(_the_subscriber: ISubscriber): void {
    // default: NO-OP `nil' listener
  }
}

// ─── 96. DomainParticipantListener (§2.2.4.3) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.4.3
 * @metaclass concrete
 * @generalization ITopicListener, IPublisherListener, ISubscriberListener
 * @definition DomainParticipantListener is the listener specialized to a
 *   DomainParticipant Entity. Per §2.2.4.3 Figure 2.17 and dds_dcps.idl
 *   (`interface DomainParticipantListener : TopicListener,
 *   PublisherListener, SubscriberListener {};`), it inherits — via IDL
 *   multiple inheritance — every callback declared on TopicListener,
 *   PublisherListener (which itself inherits from DataWriterListener), and
 *   SubscriberListener (which itself inherits from DataReaderListener),
 *   and adds no operations of its own. The DomainParticipant embeds every
 *   other Entity (see §2.2.4.3.1 Figure 2.18), so its listener is the
 *   final default-fallback target when more-specific listeners do not
 *   handle a given status change.
 *
 *   TypeScript inheritance choice: an interface that `extends` three
 *   parents (multiple-interface-inheritance — fully supported by the
 *   TypeScript type system) directly mirrors the IDL. The concrete class
 *   re-declares every inherited callback as a NO-OP because TypeScript
 *   classes do not support multiple-class inheritance and the `implements`
 *   clause on a class does not provide member bodies.
 * @ownedAttributes
 *   (none declared in §2.2.4.3)
 * @associationEnds
 *   (none declared in §2.2.4.3)
 * @operations
 *   (inherited from TopicListener, PublisherListener, SubscriberListener)
 * @constraints
 *   (none declared in §2.2.4.3)
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDomainParticipantListener
  extends ITopicListener,
    IPublisherListener,
    ISubscriberListener {}

export class DomainParticipantListener implements IDomainParticipantListener {
  readonly metaClass = "DomainParticipantListener" as const;
  on_inconsistent_topic(
    _the_topic: ITopic,
    _status: IInconsistentTopicStatus
  ): void {
    // default: NO-OP `nil' listener
  }
  on_offered_deadline_missed(
    _writer: IDataWriter,
    _status: IOfferedDeadlineMissedStatus
  ): void {
    // default: NO-OP `nil' listener
  }
  on_offered_incompatible_qos(
    _writer: IDataWriter,
    _status: IOfferedIncompatibleQosStatus
  ): void {
    // default: NO-OP `nil' listener
  }
  on_liveliness_lost(
    _writer: IDataWriter,
    _status: ILivelinessLostStatus
  ): void {
    // default: NO-OP `nil' listener
  }
  on_publication_matched(
    _writer: IDataWriter,
    _status: IPublicationMatchedStatus
  ): void {
    // default: NO-OP `nil' listener
  }
  on_requested_deadline_missed(
    _the_reader: IDataReader,
    _status: IRequestedDeadlineMissedStatus
  ): void {
    // default: NO-OP `nil' listener
  }
  on_requested_incompatible_qos(
    _the_reader: IDataReader,
    _status: IRequestedIncompatibleQosStatus
  ): void {
    // default: NO-OP `nil' listener
  }
  on_sample_rejected(
    _the_reader: IDataReader,
    _status: ISampleRejectedStatus
  ): void {
    // default: NO-OP `nil' listener
  }
  on_liveliness_changed(
    _the_reader: IDataReader,
    _status: ILivelinessChangedStatus
  ): void {
    // default: NO-OP `nil' listener
  }
  on_data_available(_the_reader: IDataReader): void {
    // default: NO-OP `nil' listener
  }
  on_subscription_matched(
    _the_reader: IDataReader,
    _status: ISubscriptionMatchedStatus
  ): void {
    // default: NO-OP `nil' listener
  }
  on_sample_lost(
    _the_reader: IDataReader,
    _status: ISampleLostStatus
  ): void {
    // default: NO-OP `nil' listener
  }
  on_data_on_readers(_the_subscriber: ISubscriber): void {
    // default: NO-OP `nil' listener
  }
}

// ─── 97. ParticipantBuiltinTopicData (§2.2.5 — DCPSParticipant) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.5
 * @metaclass concrete
 * @generalization (root)
 * @definition ParticipantBuiltinTopicData is the data carrier published on
 *   the built-in topic "DCPSParticipant" (entry created when a
 *   DomainParticipant object is created). Per the §2.2.5 Built-in Topics
 *   table and dds_dcps.idl: `key` — DCPS key to distinguish entries;
 *   `user_data` — Policy of the corresponding DomainParticipant.
 * @ownedAttributes
 *   key : BuiltinTopicKey_t [1]
 *   user_data : UserDataQosPolicy [1]
 * @associationEnds
 *   (none declared in §2.2.5)
 * @operations
 *   (none declared in §2.2.5)
 * @constraints
 *   (none declared in §2.2.5)
 */
export interface IParticipantBuiltinTopicData {
  readonly key: IBuiltinTopicKey_t;
  readonly user_data: IUserDataQosPolicy;
}

export class ParticipantBuiltinTopicData
  implements IParticipantBuiltinTopicData
{
  readonly metaClass = "ParticipantBuiltinTopicData" as const;
  readonly key: IBuiltinTopicKey_t;
  readonly user_data: IUserDataQosPolicy;
  constructor(data: {
    key: IBuiltinTopicKey_t;
    user_data: IUserDataQosPolicy;
  }) {
    this.key = data.key;
    this.user_data = data.user_data;
  }
}

// ─── 98. TopicBuiltinTopicData (§2.2.5 — DCPSTopic) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.5
 * @metaclass concrete
 * @generalization (root)
 * @definition TopicBuiltinTopicData is the data carrier published on the
 *   built-in topic "DCPSTopic" (entry created when a Topic object is
 *   created). Per the §2.2.5 Built-in Topics table and dds_dcps.idl: `key`
 *   — DCPS key to distinguish entries; `name` — name of the Topic;
 *   `type_name` — name of the type attached to the Topic; the remaining
 *   fields carry the QoS policies of the corresponding Topic
 *   (durability, durability_service, deadline, latency_budget, liveliness,
 *   reliability, transport_priority, lifespan, destination_order, history,
 *   resource_limits, ownership, topic_data).
 * @ownedAttributes
 *   key : BuiltinTopicKey_t [1]
 *   name : string [1]
 *   type_name : string [1]
 *   durability : DurabilityQosPolicy [1]
 *   durability_service : DurabilityServiceQosPolicy [1]
 *   deadline : DeadlineQosPolicy [1]
 *   latency_budget : LatencyBudgetQosPolicy [1]
 *   liveliness : LivelinessQosPolicy [1]
 *   reliability : ReliabilityQosPolicy [1]
 *   transport_priority : TransportPriorityQosPolicy [1]
 *   lifespan : LifespanQosPolicy [1]
 *   destination_order : DestinationOrderQosPolicy [1]
 *   history : HistoryQosPolicy [1]
 *   resource_limits : ResourceLimitsQosPolicy [1]
 *   ownership : OwnershipQosPolicy [1]
 *   topic_data : TopicDataQosPolicy [1]
 * @associationEnds
 *   (none declared in §2.2.5)
 * @operations
 *   (none declared in §2.2.5)
 * @constraints
 *   (none declared in §2.2.5)
 */
export interface ITopicBuiltinTopicData {
  readonly key: IBuiltinTopicKey_t;
  readonly name: string;
  readonly type_name: string;
  readonly durability: IDurabilityQosPolicy;
  readonly durability_service: IDurabilityServiceQosPolicy;
  readonly deadline: IDeadlineQosPolicy;
  readonly latency_budget: ILatencyBudgetQosPolicy;
  readonly liveliness: ILivelinessQosPolicy;
  readonly reliability: IReliabilityQosPolicy;
  readonly transport_priority: ITransportPriorityQosPolicy;
  readonly lifespan: ILifespanQosPolicy;
  readonly destination_order: IDestinationOrderQosPolicy;
  readonly history: IHistoryQosPolicy;
  readonly resource_limits: IResourceLimitsQosPolicy;
  readonly ownership: IOwnershipQosPolicy;
  readonly topic_data: ITopicDataQosPolicy;
}

export class TopicBuiltinTopicData implements ITopicBuiltinTopicData {
  readonly metaClass = "TopicBuiltinTopicData" as const;
  readonly key: IBuiltinTopicKey_t;
  readonly name: string;
  readonly type_name: string;
  readonly durability: IDurabilityQosPolicy;
  readonly durability_service: IDurabilityServiceQosPolicy;
  readonly deadline: IDeadlineQosPolicy;
  readonly latency_budget: ILatencyBudgetQosPolicy;
  readonly liveliness: ILivelinessQosPolicy;
  readonly reliability: IReliabilityQosPolicy;
  readonly transport_priority: ITransportPriorityQosPolicy;
  readonly lifespan: ILifespanQosPolicy;
  readonly destination_order: IDestinationOrderQosPolicy;
  readonly history: IHistoryQosPolicy;
  readonly resource_limits: IResourceLimitsQosPolicy;
  readonly ownership: IOwnershipQosPolicy;
  readonly topic_data: ITopicDataQosPolicy;
  constructor(data: {
    key: IBuiltinTopicKey_t;
    name: string;
    type_name: string;
    durability: IDurabilityQosPolicy;
    durability_service: IDurabilityServiceQosPolicy;
    deadline: IDeadlineQosPolicy;
    latency_budget: ILatencyBudgetQosPolicy;
    liveliness: ILivelinessQosPolicy;
    reliability: IReliabilityQosPolicy;
    transport_priority: ITransportPriorityQosPolicy;
    lifespan: ILifespanQosPolicy;
    destination_order: IDestinationOrderQosPolicy;
    history: IHistoryQosPolicy;
    resource_limits: IResourceLimitsQosPolicy;
    ownership: IOwnershipQosPolicy;
    topic_data: ITopicDataQosPolicy;
  }) {
    this.key = data.key;
    this.name = data.name;
    this.type_name = data.type_name;
    this.durability = data.durability;
    this.durability_service = data.durability_service;
    this.deadline = data.deadline;
    this.latency_budget = data.latency_budget;
    this.liveliness = data.liveliness;
    this.reliability = data.reliability;
    this.transport_priority = data.transport_priority;
    this.lifespan = data.lifespan;
    this.destination_order = data.destination_order;
    this.history = data.history;
    this.resource_limits = data.resource_limits;
    this.ownership = data.ownership;
    this.topic_data = data.topic_data;
  }
}

// ─── 99. PublicationBuiltinTopicData (§2.2.5 — DCPSPublication) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.5
 * @metaclass concrete
 * @generalization (root)
 * @definition PublicationBuiltinTopicData is the data carrier published on
 *   the built-in topic "DCPSPublication" (entry created when a DataWriter
 *   is created in association with its Publisher). Per the §2.2.5
 *   Built-in Topics table and dds_dcps.idl: `key` — DCPS key to
 *   distinguish entries; `participant_key` — DCPS key of the participant
 *   to which the DataWriter belongs; `topic_name` — name of the related
 *   Topic; `type_name` — name of the type attached to the related Topic;
 *   the remaining fields carry the QoS policies of the corresponding
 *   DataWriter, the Publisher to which the DataWriter belongs, or the
 *   related Topic (durability, durability_service, deadline,
 *   latency_budget, liveliness, reliability, lifespan, user_data,
 *   ownership, ownership_strength, destination_order, presentation,
 *   partition, topic_data, group_data).
 * @ownedAttributes
 *   key : BuiltinTopicKey_t [1]
 *   participant_key : BuiltinTopicKey_t [1]
 *   topic_name : string [1]
 *   type_name : string [1]
 *   durability : DurabilityQosPolicy [1]
 *   durability_service : DurabilityServiceQosPolicy [1]
 *   deadline : DeadlineQosPolicy [1]
 *   latency_budget : LatencyBudgetQosPolicy [1]
 *   liveliness : LivelinessQosPolicy [1]
 *   reliability : ReliabilityQosPolicy [1]
 *   lifespan : LifespanQosPolicy [1]
 *   user_data : UserDataQosPolicy [1]
 *   ownership : OwnershipQosPolicy [1]
 *   ownership_strength : OwnershipStrengthQosPolicy [1]
 *   destination_order : DestinationOrderQosPolicy [1]
 *   presentation : PresentationQosPolicy [1]
 *   partition : PartitionQosPolicy [1]
 *   topic_data : TopicDataQosPolicy [1]
 *   group_data : GroupDataQosPolicy [1]
 * @associationEnds
 *   (none declared in §2.2.5)
 * @operations
 *   (none declared in §2.2.5)
 * @constraints
 *   (none declared in §2.2.5)
 */
export interface IPublicationBuiltinTopicData {
  readonly key: IBuiltinTopicKey_t;
  readonly participant_key: IBuiltinTopicKey_t;
  readonly topic_name: string;
  readonly type_name: string;
  readonly durability: IDurabilityQosPolicy;
  readonly durability_service: IDurabilityServiceQosPolicy;
  readonly deadline: IDeadlineQosPolicy;
  readonly latency_budget: ILatencyBudgetQosPolicy;
  readonly liveliness: ILivelinessQosPolicy;
  readonly reliability: IReliabilityQosPolicy;
  readonly lifespan: ILifespanQosPolicy;
  readonly user_data: IUserDataQosPolicy;
  readonly ownership: IOwnershipQosPolicy;
  readonly ownership_strength: IOwnershipStrengthQosPolicy;
  readonly destination_order: IDestinationOrderQosPolicy;
  readonly presentation: IPresentationQosPolicy;
  readonly partition: IPartitionQosPolicy;
  readonly topic_data: ITopicDataQosPolicy;
  readonly group_data: IGroupDataQosPolicy;
}

export class PublicationBuiltinTopicData
  implements IPublicationBuiltinTopicData
{
  readonly metaClass = "PublicationBuiltinTopicData" as const;
  readonly key: IBuiltinTopicKey_t;
  readonly participant_key: IBuiltinTopicKey_t;
  readonly topic_name: string;
  readonly type_name: string;
  readonly durability: IDurabilityQosPolicy;
  readonly durability_service: IDurabilityServiceQosPolicy;
  readonly deadline: IDeadlineQosPolicy;
  readonly latency_budget: ILatencyBudgetQosPolicy;
  readonly liveliness: ILivelinessQosPolicy;
  readonly reliability: IReliabilityQosPolicy;
  readonly lifespan: ILifespanQosPolicy;
  readonly user_data: IUserDataQosPolicy;
  readonly ownership: IOwnershipQosPolicy;
  readonly ownership_strength: IOwnershipStrengthQosPolicy;
  readonly destination_order: IDestinationOrderQosPolicy;
  readonly presentation: IPresentationQosPolicy;
  readonly partition: IPartitionQosPolicy;
  readonly topic_data: ITopicDataQosPolicy;
  readonly group_data: IGroupDataQosPolicy;
  constructor(data: {
    key: IBuiltinTopicKey_t;
    participant_key: IBuiltinTopicKey_t;
    topic_name: string;
    type_name: string;
    durability: IDurabilityQosPolicy;
    durability_service: IDurabilityServiceQosPolicy;
    deadline: IDeadlineQosPolicy;
    latency_budget: ILatencyBudgetQosPolicy;
    liveliness: ILivelinessQosPolicy;
    reliability: IReliabilityQosPolicy;
    lifespan: ILifespanQosPolicy;
    user_data: IUserDataQosPolicy;
    ownership: IOwnershipQosPolicy;
    ownership_strength: IOwnershipStrengthQosPolicy;
    destination_order: IDestinationOrderQosPolicy;
    presentation: IPresentationQosPolicy;
    partition: IPartitionQosPolicy;
    topic_data: ITopicDataQosPolicy;
    group_data: IGroupDataQosPolicy;
  }) {
    this.key = data.key;
    this.participant_key = data.participant_key;
    this.topic_name = data.topic_name;
    this.type_name = data.type_name;
    this.durability = data.durability;
    this.durability_service = data.durability_service;
    this.deadline = data.deadline;
    this.latency_budget = data.latency_budget;
    this.liveliness = data.liveliness;
    this.reliability = data.reliability;
    this.lifespan = data.lifespan;
    this.user_data = data.user_data;
    this.ownership = data.ownership;
    this.ownership_strength = data.ownership_strength;
    this.destination_order = data.destination_order;
    this.presentation = data.presentation;
    this.partition = data.partition;
    this.topic_data = data.topic_data;
    this.group_data = data.group_data;
  }
}

// ─── 100. SubscriptionBuiltinTopicData (§2.2.5 — DCPSSubscription) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §2.2.5
 * @metaclass concrete
 * @generalization (root)
 * @definition SubscriptionBuiltinTopicData is the data carrier published
 *   on the built-in topic "DCPSSubscription" (entry created when a
 *   DataReader is created in association with its Subscriber). Per the
 *   §2.2.5 Built-in Topics table and dds_dcps.idl: `key` — DCPS key to
 *   distinguish entries; `participant_key` — DCPS key of the participant
 *   to which the DataReader belongs; `topic_name` — name of the related
 *   Topic; `type_name` — name of the type attached to the related Topic;
 *   the remaining fields carry the QoS policies of the corresponding
 *   DataReader, the Subscriber to which the DataReader belongs, or the
 *   related Topic (durability, deadline, latency_budget, liveliness,
 *   reliability, ownership, destination_order, user_data,
 *   time_based_filter, presentation, partition, topic_data, group_data).
 * @ownedAttributes
 *   key : BuiltinTopicKey_t [1]
 *   participant_key : BuiltinTopicKey_t [1]
 *   topic_name : string [1]
 *   type_name : string [1]
 *   durability : DurabilityQosPolicy [1]
 *   deadline : DeadlineQosPolicy [1]
 *   latency_budget : LatencyBudgetQosPolicy [1]
 *   liveliness : LivelinessQosPolicy [1]
 *   reliability : ReliabilityQosPolicy [1]
 *   ownership : OwnershipQosPolicy [1]
 *   destination_order : DestinationOrderQosPolicy [1]
 *   user_data : UserDataQosPolicy [1]
 *   time_based_filter : TimeBasedFilterQosPolicy [1]
 *   presentation : PresentationQosPolicy [1]
 *   partition : PartitionQosPolicy [1]
 *   topic_data : TopicDataQosPolicy [1]
 *   group_data : GroupDataQosPolicy [1]
 * @associationEnds
 *   (none declared in §2.2.5)
 * @operations
 *   (none declared in §2.2.5)
 * @constraints
 *   (none declared in §2.2.5)
 */
export interface ISubscriptionBuiltinTopicData {
  readonly key: IBuiltinTopicKey_t;
  readonly participant_key: IBuiltinTopicKey_t;
  readonly topic_name: string;
  readonly type_name: string;
  readonly durability: IDurabilityQosPolicy;
  readonly deadline: IDeadlineQosPolicy;
  readonly latency_budget: ILatencyBudgetQosPolicy;
  readonly liveliness: ILivelinessQosPolicy;
  readonly reliability: IReliabilityQosPolicy;
  readonly ownership: IOwnershipQosPolicy;
  readonly destination_order: IDestinationOrderQosPolicy;
  readonly user_data: IUserDataQosPolicy;
  readonly time_based_filter: ITimeBasedFilterQosPolicy;
  readonly presentation: IPresentationQosPolicy;
  readonly partition: IPartitionQosPolicy;
  readonly topic_data: ITopicDataQosPolicy;
  readonly group_data: IGroupDataQosPolicy;
}

export class SubscriptionBuiltinTopicData
  implements ISubscriptionBuiltinTopicData
{
  readonly metaClass = "SubscriptionBuiltinTopicData" as const;
  readonly key: IBuiltinTopicKey_t;
  readonly participant_key: IBuiltinTopicKey_t;
  readonly topic_name: string;
  readonly type_name: string;
  readonly durability: IDurabilityQosPolicy;
  readonly deadline: IDeadlineQosPolicy;
  readonly latency_budget: ILatencyBudgetQosPolicy;
  readonly liveliness: ILivelinessQosPolicy;
  readonly reliability: IReliabilityQosPolicy;
  readonly ownership: IOwnershipQosPolicy;
  readonly destination_order: IDestinationOrderQosPolicy;
  readonly user_data: IUserDataQosPolicy;
  readonly time_based_filter: ITimeBasedFilterQosPolicy;
  readonly presentation: IPresentationQosPolicy;
  readonly partition: IPartitionQosPolicy;
  readonly topic_data: ITopicDataQosPolicy;
  readonly group_data: IGroupDataQosPolicy;
  constructor(data: {
    key: IBuiltinTopicKey_t;
    participant_key: IBuiltinTopicKey_t;
    topic_name: string;
    type_name: string;
    durability: IDurabilityQosPolicy;
    deadline: IDeadlineQosPolicy;
    latency_budget: ILatencyBudgetQosPolicy;
    liveliness: ILivelinessQosPolicy;
    reliability: IReliabilityQosPolicy;
    ownership: IOwnershipQosPolicy;
    destination_order: IDestinationOrderQosPolicy;
    user_data: IUserDataQosPolicy;
    time_based_filter: ITimeBasedFilterQosPolicy;
    presentation: IPresentationQosPolicy;
    partition: IPartitionQosPolicy;
    topic_data: ITopicDataQosPolicy;
    group_data: IGroupDataQosPolicy;
  }) {
    this.key = data.key;
    this.participant_key = data.participant_key;
    this.topic_name = data.topic_name;
    this.type_name = data.type_name;
    this.durability = data.durability;
    this.deadline = data.deadline;
    this.latency_budget = data.latency_budget;
    this.liveliness = data.liveliness;
    this.reliability = data.reliability;
    this.ownership = data.ownership;
    this.destination_order = data.destination_order;
    this.user_data = data.user_data;
    this.time_based_filter = data.time_based_filter;
    this.presentation = data.presentation;
    this.partition = data.partition;
    this.topic_data = data.topic_data;
    this.group_data = data.group_data;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// — END Implementer #4: Listeners + Status + BuiltinTopicData —
//
// Inventory inserted in this section:
//   • SampleRejectedStatusKind        (1 const-object + literal-union type)
//   • QosPolicyCount                  (1 — interface + class, support type
//                                        for OfferedIncompatibleQosStatus &
//                                        RequestedIncompatibleQosStatus)
//   • Status structs                  (11 — InconsistentTopicStatus,
//       SampleLostStatus, SampleRejectedStatus, LivelinessLostStatus,
//       LivelinessChangedStatus, OfferedDeadlineMissedStatus,
//       RequestedDeadlineMissedStatus, OfferedIncompatibleQosStatus,
//       RequestedIncompatibleQosStatus, PublicationMatchedStatus,
//       SubscriptionMatchedStatus)
//   • Listener tree                   (7 — Listener marker, TopicListener,
//       DataWriterListener, PublisherListener (extends DataWriterListener),
//       DataReaderListener, SubscriberListener (extends DataReaderListener),
//       DomainParticipantListener (multi-extends TopicListener +
//       PublisherListener + SubscriberListener via TS interface
//       multiple-inheritance))
//   • BuiltinTopicData carriers       (4 — ParticipantBuiltinTopicData,
//       TopicBuiltinTopicData, PublicationBuiltinTopicData,
//       SubscriptionBuiltinTopicData)
//
// Listener inheritance choice for DomainParticipantListener:
//   The IDL declares
//     `interface DomainParticipantListener : TopicListener,
//      PublisherListener, SubscriberListener {};`
//   — IDL multiple inheritance. TypeScript interfaces support
//   multiple-interface-inheritance natively (`interface X extends A, B, C`),
//   so `IDomainParticipantListener extends ITopicListener,
//   IPublisherListener, ISubscriberListener` mirrors the IDL exactly. The
//   concrete `DomainParticipantListener` class re-declares every inherited
//   callback as a NO-OP (TypeScript does not support multiple-class
//   inheritance and `implements` provides no method bodies).
//
// Spec ambiguity flagged in this partition:
//   • The partition brief cites "§2.3.7" for BuiltinTopicData. The DDS 1.4
//     specification (formal/2015-04-10) names the section "2.2.5 Built-in
//     Topics" — there is no §2.3.7 chapter. The struct definitions in
//     dds_dcps.idl that this section codifies (ParticipantBuiltinTopicData,
//     TopicBuiltinTopicData, PublicationBuiltinTopicData,
//     SubscriptionBuiltinTopicData) all map to the §2.2.5 narrative.
//     Section tags below cite §2.2.5 accordingly. @section §?
//   • The partition brief cites "§2.2.5.1" for TopicListener. The DDS 1.4
//     spec does not declare a sub-section §2.2.5.1 for TopicListener — the
//     TopicListener IDL lives in dds_dcps.idl alongside the rest of the
//     Listener tree, and the §2.2.4.3 narrative covers its semantics
//     uniformly with the other concrete listeners. Section tag retained
//     for traceability to the brief; downstream readers should consult
//     §2.2.4.3 + dds_dcps.idl. @section §?
//
// Deferred to implementer #5 (DLRL §2.3.x):
//   • Conditions & WaitSet (§2.2.4.4 / §2.2.4.5): Condition (abstract),
//     GuardCondition, StatusCondition, ReadCondition, QueryCondition,
//     WaitSet — already partially deferred from Implementer #2's spine.
//     [optional — confirm scope with implementer #5]
//   • DLRL Foundation (§2.3): RelationKind, ObjectRoot, Selection, Cache,
//     CacheBase, Contract, ObjectScope, ObjectHome, ObjectListener,
//     CacheListener, SelectionListener, ObjectReference, ObjectModifier,
//     and the DLRL relation-end types (StrRelation, RefRelation,
//     ListRelation, SetRelation, MapRelation, MultiRelation).
//   • Built-in Subscriber lookup operations (§2.2.5 narrative — the
//     get_builtin_subscriber + lookup_datareader pattern that returns
//     DataReader<ParticipantBuiltinTopicData> et al). These belong to the
//     DLRL/built-in-discovery layer.
//   • Final index.ts namespace barrel — populate `dds.{concept}.{verb}`
//     export surface after all five implementer sections compile.
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// Implementer #5 — DLRL (Data Local Reconstruction Layer)
//
// Source: spec/dds_dlrl.idl (the authoritative DLRL IDL artifact in this
// repo). The DDS 1.4 specification (formal/2015-04-10) describes only the
// PIM and the IDL PSM in §2 — the original DLRL chapter (present in DDS 1.0
// through 1.2) was removed before 1.4 and is therefore not anchored to a
// numbered §2.3.x section in the 1.4 PDF. Section tags use `@section §?`
// throughout to flag this scope ambiguity, while the metaclass surface
// itself faithfully mirrors `dds_dlrl.idl` (which corresponds to the OMG
// DLRL formal sub-specification).
//
// Contents:
//   • DLRL kind enums (CacheUsage, ObjectState, DCPSState, CacheKind,
//     RelationKind, ObjectScope, ReferenceScope, CriterionKind,
//     MembershipState)
//   • DLRL value-type carriers (DLRLOid, DLRLOidGenerator, RelationDescription
//     and its three children, CacheDescription)
//   • DLRL listeners (ObjectListener, SelectionListener, CacheListener — all
//     with default NO-OP implementations)
//   • DLRL Selection criteria (SelectionCriterion, FilterCriterion,
//     QueryCriterion)
//   • DLRL Contract (cloning-control struct on a CacheAccess)
//   • DLRL ObjectRoot (root for every shared DLRL object)
//   • DLRL Selection (dynamic subset of an ObjectHome)
//   • DLRL ObjectHome (representative of an applicative class)
//   • DLRL Collection / List / Set / StrMap / IntMap (relation collection
//     value-types)
//   • DLRL CacheBase / CacheAccess / Cache (the cache hierarchy)
//   • DLRL CacheFactory (Cache instance factory)
// ═══════════════════════════════════════════════════════════════════════════

// ─── 100. ReferenceScope (DLRL kind enum) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §?
 * @metaclass kind-literal
 * @generalization (root)
 * @definition ReferenceScope governs how far an operation reaches when
 *   following a single DLRL reference relation. Per `dds_dlrl.idl`:
 *   `enum ReferenceScope { SIMPLE_CONTENT_SCOPE, REFERENCED_CONTENTS_SCOPE };`
 *   SIMPLE_CONTENT_SCOPE limits the operation to the reference content
 *   itself; REFERENCED_CONTENTS_SCOPE additionally cascades to the contents
 *   reachable through that reference.
 * @ownedAttributes
 *   (kind enum — no owned attributes)
 * @associationEnds
 *   (none)
 * @operations
 *   (none)
 * @constraints
 *   (none declared in dds_dlrl.idl)
 */
export const REFERENCE_SCOPE = {
  SIMPLE_CONTENT_SCOPE: "SIMPLE_CONTENT_SCOPE",
  REFERENCED_CONTENTS_SCOPE: "REFERENCED_CONTENTS_SCOPE",
} as const;
export type ReferenceScope =
  typeof REFERENCE_SCOPE[keyof typeof REFERENCE_SCOPE];

// ─── 101. ObjectScope (DLRL kind enum) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §?
 * @metaclass kind-literal
 * @generalization (root)
 * @definition ObjectScope governs how far an operation propagates through
 *   the DLRL object graph. Per `dds_dlrl.idl`:
 *   `enum ObjectScope { SIMPLE_OBJECT_SCOPE, CONTAINED_OBJECTS_SCOPE,
 *    RELATED_OBJECTS_SCOPE };`. SIMPLE_OBJECT_SCOPE acts on the object
 *   itself; CONTAINED_OBJECTS_SCOPE additionally cascades to objects
 *   reachable through composition relations; RELATED_OBJECTS_SCOPE
 *   cascades through every related object regardless of relation kind.
 * @ownedAttributes (kind enum — no owned attributes)
 * @associationEnds (none)
 * @operations (none)
 * @constraints (none declared in dds_dlrl.idl)
 */
export const OBJECT_SCOPE = {
  SIMPLE_OBJECT_SCOPE: "SIMPLE_OBJECT_SCOPE",
  CONTAINED_OBJECTS_SCOPE: "CONTAINED_OBJECTS_SCOPE",
  RELATED_OBJECTS_SCOPE: "RELATED_OBJECTS_SCOPE",
} as const;
export type ObjectScope = typeof OBJECT_SCOPE[keyof typeof OBJECT_SCOPE];

// ─── 102. DCPSState (DLRL kind enum) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §?
 * @metaclass kind-literal
 * @generalization (root)
 * @definition DCPSState describes the lifecycle phase of a DLRL Cache with
 *   respect to its underlying DCPS infrastructure. Per `dds_dlrl.idl`:
 *   `enum DCPSState { INITIAL, REGISTERED, ENABLED };`. INITIAL — the
 *   Cache exists but no DCPS Topic/DataReader/DataWriter has been
 *   registered yet; REGISTERED — DCPS infrastructure has been registered
 *   for every ObjectHome managed by the Cache; ENABLED — the Cache and
 *   its DCPS infrastructure are operational and exchanging data.
 * @ownedAttributes (kind enum)
 * @associationEnds (none)
 * @operations (none)
 * @constraints (none declared in dds_dlrl.idl)
 */
export const DCPS_STATE = {
  INITIAL: "INITIAL",
  REGISTERED: "REGISTERED",
  ENABLED: "ENABLED",
} as const;
export type DCPSState = typeof DCPS_STATE[keyof typeof DCPS_STATE];

// ─── 103. CacheUsage (DLRL kind enum) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §?
 * @metaclass kind-literal
 * @generalization (root)
 * @definition CacheUsage declares the access purpose of a Cache or
 *   CacheAccess. Per `dds_dlrl.idl`:
 *   `enum CacheUsage { READ_ONLY, WRITE_ONLY, READ_WRITE };`.
 *   READ_ONLY — the cache observes data only; WRITE_ONLY — the cache
 *   produces data only; READ_WRITE — the cache participates in both
 *   directions.
 * @ownedAttributes (kind enum)
 * @associationEnds (none)
 * @operations (none)
 * @constraints (none declared in dds_dlrl.idl)
 */
export const CACHE_USAGE = {
  READ_ONLY: "READ_ONLY",
  WRITE_ONLY: "WRITE_ONLY",
  READ_WRITE: "READ_WRITE",
} as const;
export type CacheUsage = typeof CACHE_USAGE[keyof typeof CACHE_USAGE];

// ─── 104. ObjectState (DLRL kind enum) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §?
 * @metaclass kind-literal
 * @generalization (root)
 * @definition ObjectState classifies, for any DLRL object, the lifecycle
 *   state observed by the application. Per `dds_dlrl.idl`:
 *   `enum ObjectState { OBJECT_VOID, OBJECT_NEW, OBJECT_NOT_MODIFIED,
 *    OBJECT_MODIFIED, OBJECT_DELETED };`. The same enum is used to surface
 *   both the read state (what arrived from DCPS) and the write state (what
 *   the application has produced locally) of each ObjectRoot instance.
 * @ownedAttributes (kind enum)
 * @associationEnds (none)
 * @operations (none)
 * @constraints (none declared in dds_dlrl.idl)
 */
export const OBJECT_STATE = {
  OBJECT_VOID: "OBJECT_VOID",
  OBJECT_NEW: "OBJECT_NEW",
  OBJECT_NOT_MODIFIED: "OBJECT_NOT_MODIFIED",
  OBJECT_MODIFIED: "OBJECT_MODIFIED",
  OBJECT_DELETED: "OBJECT_DELETED",
} as const;
export type ObjectState = typeof OBJECT_STATE[keyof typeof OBJECT_STATE];

// ─── 105. RelationKind (DLRL kind enum) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §?
 * @metaclass kind-literal
 * @generalization (root)
 * @definition RelationKind classifies the container shape of a DLRL
 *   relation between ObjectRoot instances. Per `dds_dlrl.idl`:
 *   `enum RelationKind { REF_RELATION, LIST_RELATION, INT_MAP_RELATION,
 *    STR_MAP_RELATION };`. REF_RELATION — single-target reference;
 *   LIST_RELATION — ordered list of targets; INT_MAP_RELATION — long-keyed
 *   map of targets; STR_MAP_RELATION — string-keyed map of targets.
 * @ownedAttributes (kind enum)
 * @associationEnds (none)
 * @operations (none)
 * @constraints (none declared in dds_dlrl.idl)
 */
export const RELATION_KIND = {
  REF_RELATION: "REF_RELATION",
  LIST_RELATION: "LIST_RELATION",
  INT_MAP_RELATION: "INT_MAP_RELATION",
  STR_MAP_RELATION: "STR_MAP_RELATION",
} as const;
export type RelationKind = typeof RELATION_KIND[keyof typeof RELATION_KIND];

// ─── 106. CriterionKind (DLRL kind enum) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §?
 * @metaclass kind-literal
 * @generalization (root)
 * @definition CriterionKind classifies a SelectionCriterion as either a
 *   QUERY (predicate evaluated by the underlying SQL-like expression
 *   engine) or a FILTER (predicate evaluated programmatically by the
 *   application). Per `dds_dlrl.idl`: `enum CriterionKind { QUERY,
 *   FILTER };`.
 * @ownedAttributes (kind enum)
 * @associationEnds (none)
 * @operations (none)
 * @constraints (none declared in dds_dlrl.idl)
 */
export const CRITERION_KIND = {
  QUERY: "QUERY",
  FILTER: "FILTER",
} as const;
export type CriterionKind =
  typeof CRITERION_KIND[keyof typeof CRITERION_KIND];

// ─── 107. MembershipState (DLRL kind enum) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §?
 * @metaclass kind-literal
 * @generalization (root)
 * @definition MembershipState reports the membership of an ObjectRoot in a
 *   FilterCriterion-driven Selection. Per `dds_dlrl.idl`:
 *   `enum MembershipState { UNDEFINED_MEMBERSHIP, ALREADY_MEMBER,
 *    NOT_MEMBER };`. UNDEFINED_MEMBERSHIP — first evaluation, prior
 *   membership unknown; ALREADY_MEMBER — the object was already a member
 *   on the previous evaluation; NOT_MEMBER — the object was not a member
 *   on the previous evaluation.
 * @ownedAttributes (kind enum)
 * @associationEnds (none)
 * @operations (none)
 * @constraints (none declared in dds_dlrl.idl)
 */
export const MEMBERSHIP_STATE = {
  UNDEFINED_MEMBERSHIP: "UNDEFINED_MEMBERSHIP",
  ALREADY_MEMBER: "ALREADY_MEMBER",
  NOT_MEMBER: "NOT_MEMBER",
} as const;
export type MembershipState =
  typeof MEMBERSHIP_STATE[keyof typeof MEMBERSHIP_STATE];

// ─── 108. CacheKind (DLRL kind enum) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §?
 * @metaclass kind-literal
 * @generalization (root)
 * @definition CacheKind discriminates a CacheBase between the two concrete
 *   shapes the DLRL recognizes. Per `dds_dlrl.idl`:
 *   `enum CacheKind { CACHE_KIND, CACHEACCESS_KIND };`. CACHE_KIND — the
 *   base is a Cache; CACHEACCESS_KIND — the base is a CacheAccess scoped
 *   off a parent Cache.
 * @ownedAttributes (kind enum)
 * @associationEnds (none)
 * @operations (none)
 * @constraints (none declared in dds_dlrl.idl)
 */
export const CACHE_KIND = {
  CACHE_KIND: "CACHE_KIND",
  CACHEACCESS_KIND: "CACHEACCESS_KIND",
} as const;
export type CacheKindLiteral = typeof CACHE_KIND[keyof typeof CACHE_KIND];

// ─── 109. UNLIMITED_RELATED_OBJECTS (DLRL constant) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §?
 * @metaclass constant
 * @generalization (root)
 * @definition UNLIMITED_RELATED_OBJECTS is the DLRL-defined sentinel value
 *   for an unbounded relation depth. Per `dds_dlrl.idl`:
 *   `const RelatedObjectDepth UNLIMITED_RELATED_OBJECTS = -1;`.
 *   Operations that take a `depth` parameter (see Contract.set_depth and
 *   CacheAccess.create_contract) accept this value to disable the bound.
 * @ownedAttributes (constant)
 * @associationEnds (none)
 * @operations (none)
 * @constraints (none declared in dds_dlrl.idl)
 */
export const UNLIMITED_RELATED_OBJECTS = -1;

// ─── 110. DLRLOid (DLRL value-type) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §?
 * @metaclass concrete
 * @generalization (root)
 * @definition DLRLOid is the DLRL object identifier carried by every
 *   ObjectRoot. Per `dds_dlrl.idl`:
 *   `struct DLRLOid { DLRL_OID_TYPE_NATIVE value[3]; };`. The native
 *   implementation type is `long`; the array length 3 is part of the
 *   contract — every implementation must allocate three slots so that
 *   the OID is wide enough to remain unique under heavy registration
 *   load and across long-running deployments.
 * @ownedAttributes
 *   value : long[3] — the three-slot identifier
 * @associationEnds (none)
 * @operations (none)
 * @constraints
 *   value.length must equal 3.
 */
export interface IDLRLOid {
  readonly value: readonly [number, number, number];
}

export class DLRLOid implements IDLRLOid {
  readonly metaClass = "DLRLOid" as const;
  readonly value: readonly [number, number, number];
  constructor(data: { value: readonly [number, number, number] }) {
    this.value = data.value;
  }
}

// ─── 111. DLRLOidGenerator (DLRL singleton-ish utility) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §?
 * @metaclass concrete
 * @generalization (root)
 * @definition DLRLOidGenerator is the generator that issues fresh DLRLOid
 *   values for newly-created ObjectRoot instances. The DLRL spec does not
 *   prescribe the generator algorithm — implementations are free to use
 *   monotonically-increasing counters, GUID-like 192-bit space-fillers,
 *   or vendor-specific schemes — so long as every DLRLOid issued by a
 *   single generator instance is unique within the scope of the Cache
 *   that the generator serves.
 * @ownedAttributes (none)
 * @associationEnds (none)
 * @operations
 *   generate_oid() : DLRLOid
 * @constraints
 *   Successive invocations within a single generator instance must return
 *   DLRLOid values that are unique across that generator's lifetime.
 */
export interface IDLRLOidGenerator {
  generate_oid(): IDLRLOid;
}

export class DLRLOidGenerator implements IDLRLOidGenerator {
  readonly metaClass = "DLRLOidGenerator" as const;
  // Implementation-private monotonic counter — three-slot OID is constructed
  // by spreading the next integer across the high slot; vendors may
  // override.
  private _next = 0;
  generate_oid(): IDLRLOid {
    const next = ++this._next;
    return new DLRLOid({ value: [next, 0, 0] });
  }
}

// ─── 112. RelationDescription (DLRL value-type) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §?
 * @metaclass concrete
 * @generalization (root)
 * @definition RelationDescription names a DLRL relation that exists on an
 *   ObjectRoot, together with the kind (REF / LIST / INT_MAP / STR_MAP)
 *   that classifies its container shape. Per `dds_dlrl.idl`:
 *   `valuetype RelationDescription { public RelationKind kind; public
 *    RelationName name; };`. The three concrete subtypes
 *   (ListRelationDescription, IntMapRelationDescription,
 *   StrMapRelationDescription) augment the description with the index or
 *   key that pinpoints a specific element within the relation.
 * @ownedAttributes
 *   kind : RelationKind [1]
 *   name : RelationName (string) [1]
 * @associationEnds (none)
 * @operations (none)
 * @constraints (none declared in dds_dlrl.idl)
 */
export interface IRelationDescription {
  readonly kind: RelationKind;
  readonly name: string;
}

export class RelationDescription implements IRelationDescription {
  readonly metaClass = "RelationDescription" as const;
  readonly kind: RelationKind;
  readonly name: string;
  constructor(data: { kind: RelationKind; name: string }) {
    this.kind = data.kind;
    this.name = data.name;
  }
}

// ─── 113. ListRelationDescription (DLRL value-type) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §?
 * @metaclass concrete
 * @generalization IRelationDescription
 * @definition ListRelationDescription is the RelationDescription
 *   specialization that pinpoints a single element of a list-shaped
 *   relation by its zero-based ordinal index. Per `dds_dlrl.idl`:
 *   `valuetype ListRelationDescription : RelationDescription { public
 *    long index; };`.
 * @ownedAttributes
 *   index : long [1] — element ordinal within the list relation
 * @associationEnds (none)
 * @operations (none)
 * @constraints
 *   Inherits kind = LIST_RELATION semantically (caller responsibility).
 */
export interface IListRelationDescription extends IRelationDescription {
  readonly index: number;
}

export class ListRelationDescription implements IListRelationDescription {
  readonly metaClass = "ListRelationDescription" as const;
  readonly kind: RelationKind;
  readonly name: string;
  readonly index: number;
  constructor(data: { kind: RelationKind; name: string; index: number }) {
    this.kind = data.kind;
    this.name = data.name;
    this.index = data.index;
  }
}

// ─── 114. IntMapRelationDescription (DLRL value-type) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §?
 * @metaclass concrete
 * @generalization IRelationDescription
 * @definition IntMapRelationDescription is the RelationDescription
 *   specialization that pinpoints a single element of an integer-keyed
 *   map relation by its long key. Per `dds_dlrl.idl`:
 *   `valuetype IntMapRelationDescription : RelationDescription { public
 *    long key; };`.
 * @ownedAttributes
 *   key : long [1] — integer key into the map relation
 * @associationEnds (none)
 * @operations (none)
 * @constraints
 *   Inherits kind = INT_MAP_RELATION semantically (caller responsibility).
 */
export interface IIntMapRelationDescription extends IRelationDescription {
  readonly key: number;
}

export class IntMapRelationDescription implements IIntMapRelationDescription {
  readonly metaClass = "IntMapRelationDescription" as const;
  readonly kind: RelationKind;
  readonly name: string;
  readonly key: number;
  constructor(data: { kind: RelationKind; name: string; key: number }) {
    this.kind = data.kind;
    this.name = data.name;
    this.key = data.key;
  }
}

// ─── 115. StrMapRelationDescription (DLRL value-type) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §?
 * @metaclass concrete
 * @generalization IRelationDescription
 * @definition StrMapRelationDescription is the RelationDescription
 *   specialization that pinpoints a single element of a string-keyed
 *   map relation by its string key. Per `dds_dlrl.idl`:
 *   `valuetype StrMapRelationDescription : RelationDescription { public
 *    string key; };`.
 * @ownedAttributes
 *   key : string [1] — string key into the map relation
 * @associationEnds (none)
 * @operations (none)
 * @constraints
 *   Inherits kind = STR_MAP_RELATION semantically (caller responsibility).
 */
export interface IStrMapRelationDescription extends IRelationDescription {
  readonly key: string;
}

export class StrMapRelationDescription implements IStrMapRelationDescription {
  readonly metaClass = "StrMapRelationDescription" as const;
  readonly kind: RelationKind;
  readonly name: string;
  readonly key: string;
  constructor(data: { kind: RelationKind; name: string; key: string }) {
    this.kind = data.kind;
    this.name = data.name;
    this.key = data.key;
  }
}

// ─── 116. ObjectListener (DLRL listener) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §?
 * @metaclass concrete
 * @generalization (root)
 * @definition ObjectListener is the root listener interface attached to
 *   ObjectHome instances to surface object-lifecycle events. Per
 *   `dds_dlrl.idl`: `local interface ObjectListener { boolean
 *   on_object_created(in ObjectRoot the_object); boolean
 *   on_object_deleted(in ObjectRoot the_object); };`. The IDL also
 *   declares an `on_object_modified` callback in a comment block — its
 *   typed signature is generated per concrete Foo type, so it appears in
 *   each derived FooListener and not on the abstract root. The default
 *   implementation here returns true (event acknowledged) for both
 *   declared callbacks.
 * @ownedAttributes (none)
 * @associationEnds (none)
 * @operations
 *   on_object_created(the_object : ObjectRoot) : boolean
 *   on_object_deleted(the_object : ObjectRoot) : boolean
 * @constraints (none declared in dds_dlrl.idl)
 */
export interface IObjectListener {
  on_object_created(the_object: IObjectRoot): boolean;
  on_object_deleted(the_object: IObjectRoot): boolean;
}

export class ObjectListener implements IObjectListener {
  readonly metaClass = "ObjectListener" as const;
  on_object_created(_the_object: IObjectRoot): boolean {
    // default: NO-OP `nil' listener
    return true;
  }
  on_object_deleted(_the_object: IObjectRoot): boolean {
    // default: NO-OP `nil' listener
    return true;
  }
}

// ─── 117. SelectionListener (DLRL listener) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §?
 * @metaclass concrete
 * @generalization (root)
 * @definition SelectionListener is the root listener interface attached
 *   to Selection instances to surface object-membership transitions. Per
 *   `dds_dlrl.idl`: `local interface SelectionListener { void
 *   on_object_out(in ObjectRoot the_object); };`. The IDL declares
 *   `on_object_in` and `on_object_modified` in comment blocks — they are
 *   generated per concrete Foo type in each derived FooSelectionListener
 *   and therefore do not appear on the abstract root.
 * @ownedAttributes (none)
 * @associationEnds (none)
 * @operations
 *   on_object_out(the_object : ObjectRoot) : void
 * @constraints (none declared in dds_dlrl.idl)
 */
export interface ISelectionListener {
  on_object_out(the_object: IObjectRoot): void;
}

export class SelectionListener implements ISelectionListener {
  readonly metaClass = "SelectionListener" as const;
  on_object_out(_the_object: IObjectRoot): void {
    // default: NO-OP `nil' listener
  }
}

// ─── 118. CacheListener (DLRL listener) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §?
 * @metaclass concrete
 * @generalization (root)
 * @definition CacheListener is the listener interface attached to Cache
 *   instances to surface batch-update lifecycle events. Per
 *   `dds_dlrl.idl`: `local interface CacheListener { void
 *   on_begin_updates(); void on_end_updates(); void on_updates_enabled();
 *   void on_updates_disabled(); };`. The four callbacks bracket the
 *   atomic batches of updates the underlying DCPS layer delivers and the
 *   on/off transitions of the Cache's `updates_enabled` flag.
 * @ownedAttributes (none)
 * @associationEnds (none)
 * @operations
 *   on_begin_updates() : void
 *   on_end_updates() : void
 *   on_updates_enabled() : void
 *   on_updates_disabled() : void
 * @constraints (none declared in dds_dlrl.idl)
 */
export interface ICacheListener {
  on_begin_updates(): void;
  on_end_updates(): void;
  on_updates_enabled(): void;
  on_updates_disabled(): void;
}

export class CacheListener implements ICacheListener {
  readonly metaClass = "CacheListener" as const;
  on_begin_updates(): void {
    // default: NO-OP
  }
  on_end_updates(): void {
    // default: NO-OP
  }
  on_updates_enabled(): void {
    // default: NO-OP
  }
  on_updates_disabled(): void {
    // default: NO-OP
  }
}

// ─── 119. Contract (DLRL clone-control struct) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §?
 * @metaclass concrete
 * @generalization (root)
 * @definition Contract is the cloning-control object held by a CacheAccess
 *   that pinpoints exactly which subgraph of the underlying Cache the
 *   access scope replicates on every refresh. Per `dds_dlrl.idl`:
 *   `local interface Contract { readonly attribute long depth; readonly
 *   attribute ObjectScope scope; readonly attribute ObjectRoot
 *   contracted_object; void set_depth(in long depth); void set_scope(in
 *   ObjectScope scope); };`. depth bounds the relation-cascade depth
 *   (UNLIMITED_RELATED_OBJECTS = -1 lifts the bound). scope picks the
 *   ObjectScope axis (SIMPLE / CONTAINED / RELATED) along which depth is
 *   counted. contracted_object is the ObjectRoot anchor.
 * @ownedAttributes
 *   depth : long [1]
 *   scope : ObjectScope [1]
 *   contracted_object : ObjectRoot [1]
 * @associationEnds (none)
 * @operations
 *   set_depth(depth : long) : void
 *   set_scope(scope : ObjectScope) : void
 * @constraints
 *   depth >= -1 (UNLIMITED_RELATED_OBJECTS).
 */
export interface IContract {
  readonly depth: number;
  readonly scope: ObjectScope;
  readonly contracted_object: IObjectRoot;
  set_depth(depth: number): void;
  set_scope(scope: ObjectScope): void;
}

export class Contract implements IContract {
  readonly metaClass = "Contract" as const;
  depth: number;
  scope: ObjectScope;
  readonly contracted_object: IObjectRoot;
  constructor(data: {
    depth: number;
    scope: ObjectScope;
    contracted_object: IObjectRoot;
  }) {
    this.depth = data.depth;
    this.scope = data.scope;
    this.contracted_object = data.contracted_object;
  }
  set_depth(depth: number): void {
    this.depth = depth;
  }
  set_scope(scope: ObjectScope): void {
    this.scope = scope;
  }
}

// ─── 120. SelectionCriterion (DLRL filter/query root) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §?
 * @metaclass abstract
 * @generalization (root)
 * @definition SelectionCriterion is the abstract root for every predicate
 *   that drives a Selection. Per `dds_dlrl.idl`: `local interface
 *   SelectionCriterion { readonly attribute CriterionKind kind; };`.
 *   A criterion is either a QueryCriterion (SQL-like expression
 *   evaluated by the engine) or a FilterCriterion (programmatic
 *   evaluation via a typed check_object callback that the IDL declares
 *   in a per-Foo-type comment block).
 * @ownedAttributes
 *   kind : CriterionKind [1]
 * @associationEnds (none)
 * @operations (none — each subtype adds its own)
 * @constraints (none declared in dds_dlrl.idl)
 */
export interface ISelectionCriterion {
  readonly kind: CriterionKind;
}

// ─── 121. FilterCriterion (DLRL filter) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §?
 * @metaclass concrete
 * @generalization ISelectionCriterion
 * @definition FilterCriterion is the SelectionCriterion specialization
 *   that evaluates membership programmatically. Per `dds_dlrl.idl`:
 *   `local interface FilterCriterion : SelectionCriterion {};`. The
 *   per-Foo `check_object(in ObjectRoot an_object, in MembershipState
 *   membership_state) : boolean` callback is declared in the IDL inside
 *   a comment block and is generated per concrete Foo type — therefore
 *   it does not appear on this abstract surface. kind is hard-bound to
 *   CRITERION_KIND.FILTER.
 * @ownedAttributes (none)
 * @associationEnds (none)
 * @operations (per-Foo check_object generated downstream)
 * @constraints
 *   kind = CRITERION_KIND.FILTER.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IFilterCriterion extends ISelectionCriterion {}

export class FilterCriterion implements IFilterCriterion {
  readonly metaClass = "FilterCriterion" as const;
  readonly kind: CriterionKind = CRITERION_KIND.FILTER;
}

// ─── 122. QueryCriterion (DLRL query) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §?
 * @metaclass concrete
 * @generalization ISelectionCriterion
 * @definition QueryCriterion is the SelectionCriterion specialization
 *   that evaluates membership via an SQL-like expression. Per
 *   `dds_dlrl.idl`: `local interface QueryCriterion : SelectionCriterion
 *   { readonly attribute string expression; readonly attribute
 *   StringSeq parameters; boolean set_query(in string expression, in
 *   StringSeq parameters) raises (SQLError); boolean set_parameters(in
 *   StringSeq parameters) raises (SQLError); };`. kind is hard-bound to
 *   CRITERION_KIND.QUERY.
 * @ownedAttributes
 *   expression : string [1]
 *   parameters : string[*]
 * @associationEnds (none)
 * @operations
 *   set_query(expression : string, parameters : string[*]) : boolean
 *   set_parameters(parameters : string[*]) : boolean
 * @constraints
 *   kind = CRITERION_KIND.QUERY.
 */
export interface IQueryCriterion extends ISelectionCriterion {
  readonly expression: string;
  readonly parameters: ReadonlyArray<string>;
  set_query(expression: string, parameters: ReadonlyArray<string>): boolean;
  set_parameters(parameters: ReadonlyArray<string>): boolean;
}

export class QueryCriterion implements IQueryCriterion {
  readonly metaClass = "QueryCriterion" as const;
  readonly kind: CriterionKind = CRITERION_KIND.QUERY;
  expression: string;
  parameters: ReadonlyArray<string>;
  constructor(data: {
    expression: string;
    parameters: ReadonlyArray<string>;
  }) {
    this.expression = data.expression;
    this.parameters = data.parameters;
  }
  set_query(
    expression: string,
    parameters: ReadonlyArray<string>
  ): boolean {
    this.expression = expression;
    this.parameters = parameters;
    return true;
  }
  set_parameters(parameters: ReadonlyArray<string>): boolean {
    this.parameters = parameters;
    return true;
  }
}

// ─── 123. ObjectRoot (DLRL aggregate root) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §?
 * @metaclass abstract
 * @generalization (root)
 * @definition ObjectRoot is the root valuetype every shared DLRL object
 *   inherits from. Per `dds_dlrl.idl`: `valuetype ObjectRoot { private
 *   DLRLOid m_oid; private ClassName m_class_name; readonly attribute
 *   DLRLOid oid; readonly attribute ObjectState read_state; readonly
 *   attribute ObjectState write_state; readonly attribute ObjectHome
 *   object_home; readonly attribute ClassName class_name; readonly
 *   attribute CacheBase owner; void destroy() raises
 *   (PreconditionNotMet); boolean is_modified(in ObjectScope scope);
 *   RelationDescriptionSeq which_contained_modified(); };`. Every
 *   typed FooObject is generated as a ObjectRoot subtype with the
 *   typed ownedAttributes the application declares — those are
 *   generated on a per-class basis and therefore not present on this
 *   abstract surface.
 * @ownedAttributes
 *   oid : DLRLOid [1]
 *   read_state : ObjectState [1]
 *   write_state : ObjectState [1]
 *   class_name : string [1]
 * @associationEnds
 *   object_home : ObjectHome [1]
 *   owner : CacheBase [1]
 * @operations
 *   destroy() : void   raises PreconditionNotMet
 *   is_modified(scope : ObjectScope) : boolean
 *   which_contained_modified() : RelationDescription[*]
 * @constraints
 *   oid uniqueness within the owning Cache.
 */
export interface IObjectRoot {
  readonly oid: IDLRLOid;
  readonly read_state: ObjectState;
  readonly write_state: ObjectState;
  readonly object_home: IObjectHome;
  readonly class_name: string;
  readonly owner: ICacheBase;
  destroy(): void;
  is_modified(scope: ObjectScope): boolean;
  which_contained_modified(): ReadonlyArray<IRelationDescription>;
}

// ─── 124. ObjectHome (DLRL applicative class representative) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §?
 * @metaclass abstract
 * @generalization (root)
 * @definition ObjectHome is the root local interface representing one
 *   applicative class within the DLRL. Per `dds_dlrl.idl`: `local
 *   interface ObjectHome { readonly attribute string name; readonly
 *   attribute string content_filter; readonly attribute ObjectHome
 *   parent; readonly attribute ObjectHomeSeq children; readonly
 *   attribute unsigned long registration_index; readonly attribute
 *   boolean auto_deref; void set_content_filter(in string expression)
 *   raises (SQLError, PreconditionNotMet); void set_auto_deref(in
 *   boolean value); void deref_all(); void underef_all(); string
 *   get_topic_name(in string attribute_name) raises (PreconditionNotMet);
 *   StringSeq get_all_topic_names() raises (PreconditionNotMet); };`.
 *   The IDL also declares typed listener-attach, selection-create, and
 *   object-create operations in comment blocks — these are generated
 *   per concrete Foo class and therefore do not appear here.
 * @ownedAttributes
 *   name : string [1]
 *   content_filter : string [1]
 *   registration_index : unsigned long [1]
 *   auto_deref : boolean [1]
 * @associationEnds
 *   parent : ObjectHome [0..1]
 *   children : ObjectHome[*]
 * @operations
 *   set_content_filter(expression : string) : void
 *   set_auto_deref(value : boolean) : void
 *   deref_all() : void
 *   underef_all() : void
 *   get_topic_name(attribute_name : string) : string
 *   get_all_topic_names() : string[*]
 * @constraints (none declared in dds_dlrl.idl)
 */
export interface IObjectHome {
  readonly name: string;
  readonly content_filter: string;
  readonly parent: IObjectHome | undefined;
  readonly children: ReadonlyArray<IObjectHome>;
  readonly registration_index: number;
  readonly auto_deref: boolean;
  set_content_filter(expression: string): void;
  set_auto_deref(value: boolean): void;
  deref_all(): void;
  underef_all(): void;
  get_topic_name(attribute_name: string): string;
  get_all_topic_names(): ReadonlyArray<string>;
}

// ─── 125. Selection (DLRL dynamic subset) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §?
 * @metaclass concrete
 * @generalization (root)
 * @definition Selection is the dynamic subset of the objects managed by an
 *   ObjectHome whose membership is governed by a SelectionCriterion. Per
 *   `dds_dlrl.idl`: `local interface Selection { readonly attribute
 *   boolean auto_refresh; readonly attribute boolean concerns_contained;
 *   void refresh(); };`. Three additional readonly attributes —
 *   criterion, members, listener — are declared in comment blocks and
 *   generated per concrete Foo type, therefore not part of the abstract
 *   surface. The concrete Selection here exposes auto_refresh,
 *   concerns_contained, and the refresh() operation.
 * @ownedAttributes
 *   auto_refresh : boolean [1]
 *   concerns_contained : boolean [1]
 * @associationEnds (none — typed criterion / members / listener
 *   generated per Foo type)
 * @operations
 *   refresh() : void
 * @constraints (none declared in dds_dlrl.idl)
 */
export interface ISelection {
  readonly auto_refresh: boolean;
  readonly concerns_contained: boolean;
  refresh(): void;
}

export class Selection implements ISelection {
  readonly metaClass = "Selection" as const;
  readonly auto_refresh: boolean;
  readonly concerns_contained: boolean;
  constructor(data: {
    auto_refresh: boolean;
    concerns_contained: boolean;
  }) {
    this.auto_refresh = data.auto_refresh;
    this.concerns_contained = data.concerns_contained;
  }
  refresh(): void {
    // default: NO-OP — concrete vendors implement
  }
}

// ─── 126. Collection (DLRL relation collection root) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §?
 * @metaclass abstract
 * @generalization (root)
 * @definition Collection is the abstract valuetype that all DLRL
 *   relation-collection valuetypes specialize. Per `dds_dlrl.idl`:
 *   `abstract valuetype Collection { readonly attribute long length;
 *   };`. The typed `values` accessor — `readonly attribute
 *   ObjectRootSeq values;` — is declared in a comment block and
 *   generated per concrete Foo type.
 * @ownedAttributes
 *   length : long [1]
 * @associationEnds (none)
 * @operations (none — per-Foo accessors generated downstream)
 * @constraints (none declared in dds_dlrl.idl)
 */
export interface ICollection {
  readonly length: number;
}

// ─── 127. List (DLRL ordered relation collection) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §?
 * @metaclass abstract
 * @generalization ICollection
 * @definition List is the abstract Collection specialization for
 *   ordered, integer-indexed relations. Per `dds_dlrl.idl`:
 *   `abstract valuetype List : Collection { void remove(); LongSeq
 *   added_elements(); LongSeq removed_elements(); LongSeq
 *   modified_elements(); };`. Typed add/put/get operations are
 *   generated per concrete Foo type (declared in IDL comment blocks).
 * @ownedAttributes (inherits length)
 * @associationEnds (none)
 * @operations
 *   remove() : void
 *   added_elements() : long[*]
 *   removed_elements() : long[*]
 *   modified_elements() : long[*]
 * @constraints (none declared in dds_dlrl.idl)
 */
export interface IList extends ICollection {
  remove(): void;
  added_elements(): ReadonlyArray<number>;
  removed_elements(): ReadonlyArray<number>;
  modified_elements(): ReadonlyArray<number>;
}

// ─── 128. Set (DLRL unordered relation collection) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §?
 * @metaclass concrete
 * @generalization ICollection
 * @definition Set is the unordered DLRL relation collection. Per
 *   `dds_dlrl.idl`: `valuetype Set : Collection { /(*) per-Foo
 *   added_elements/removed_elements/contains/add/remove generated
 *   downstream (*)/ };`. The abstract surface inherits length from
 *   Collection; typed members are produced per concrete Foo type.
 * @ownedAttributes (inherits length)
 * @associationEnds (none)
 * @operations (per-Foo generated)
 * @constraints (none declared in dds_dlrl.idl)
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ISet extends ICollection {}

// ─── 129. StrMap (DLRL string-keyed relation map) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §?
 * @metaclass abstract
 * @generalization ICollection
 * @definition StrMap is the abstract Collection specialization for
 *   string-keyed relation maps. Per `dds_dlrl.idl`:
 *   `abstract valuetype StrMap : Collection { readonly attribute
 *   StringSeq keys; void remove(in string key); StringSeq
 *   added_elements(); StringSeq removed_elements(); StringSeq
 *   modified_elements(); };`. Typed put/get operations are
 *   generated per concrete Foo type.
 * @ownedAttributes
 *   keys : string[*]
 * @associationEnds (none)
 * @operations
 *   remove(key : string) : void
 *   added_elements() : string[*]
 *   removed_elements() : string[*]
 *   modified_elements() : string[*]
 * @constraints (none declared in dds_dlrl.idl)
 */
export interface IStrMap extends ICollection {
  readonly keys: ReadonlyArray<string>;
  remove(key: string): void;
  added_elements(): ReadonlyArray<string>;
  removed_elements(): ReadonlyArray<string>;
  modified_elements(): ReadonlyArray<string>;
}

// ─── 130. IntMap (DLRL long-keyed relation map) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §?
 * @metaclass abstract
 * @generalization ICollection
 * @definition IntMap is the abstract Collection specialization for
 *   long-keyed relation maps. Per `dds_dlrl.idl`:
 *   `abstract valuetype IntMap : Collection { readonly attribute
 *   LongSeq keys; void remove(in long key); LongSeq
 *   added_elements(); LongSeq removed_elements(); LongSeq
 *   modified_elements(); };`. Typed put/get operations are
 *   generated per concrete Foo type.
 * @ownedAttributes
 *   keys : long[*]
 * @associationEnds (none)
 * @operations
 *   remove(key : long) : void
 *   added_elements() : long[*]
 *   removed_elements() : long[*]
 *   modified_elements() : long[*]
 * @constraints (none declared in dds_dlrl.idl)
 */
export interface IIntMap extends ICollection {
  readonly keys: ReadonlyArray<number>;
  remove(key: number): void;
  added_elements(): ReadonlyArray<number>;
  removed_elements(): ReadonlyArray<number>;
  modified_elements(): ReadonlyArray<number>;
}

// ─── 131. CacheBase (DLRL cache hierarchy root) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §?
 * @metaclass abstract
 * @generalization (root)
 * @definition CacheBase is the root local interface for both Cache and
 *   CacheAccess. Per `dds_dlrl.idl`: `local interface CacheBase {
 *   readonly attribute CacheUsage cache_usage; readonly attribute
 *   ObjectRootSeq objects; readonly attribute CacheKind kind; void
 *   refresh() raises (DCPSError); };`. cache_usage gives the read /
 *   write / read-write purpose; kind discriminates a cache instance
 *   between CACHE_KIND and CACHEACCESS_KIND. refresh forces a
 *   synchronous reconcile against the underlying DCPS layer.
 * @ownedAttributes
 *   cache_usage : CacheUsage [1]
 *   kind : CacheKind [1]
 * @associationEnds
 *   objects : ObjectRoot[*]
 * @operations
 *   refresh() : void   raises DCPSError
 * @constraints (none declared in dds_dlrl.idl)
 */
export interface ICacheBase {
  readonly cache_usage: CacheUsage;
  readonly objects: ReadonlyArray<IObjectRoot>;
  readonly kind: CacheKindLiteral;
  refresh(): void;
}

// ─── 132. CacheAccess (DLRL access scope on a Cache) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §?
 * @metaclass concrete
 * @generalization ICacheBase
 * @definition CacheAccess is the local interface that scopes access to a
 *   subset of a Cache's objects, cloned on every refresh. Per
 *   `dds_dlrl.idl`: `local interface CacheAccess : CacheBase { readonly
 *   attribute Cache owner; readonly attribute ContractSeq contracts;
 *   readonly attribute StringSeq type_names; void write() raises
 *   (ReadOnlyMode, DCPSError); void purge(); void create_contract(in
 *   ObjectRoot object, in ObjectScope scope, in long depth) raises
 *   (PreconditionNotMet); void delete_contract(in Contract a_contract)
 *   raises (PreconditionNotMet); };`. owner is the parent Cache;
 *   contracts is the set of clone-control objects active on the access.
 *   kind is hard-bound to CACHE_KIND.CACHEACCESS_KIND.
 * @ownedAttributes
 *   type_names : string[*]
 * @associationEnds
 *   owner : Cache [1]
 *   contracts : Contract[*]
 * @operations
 *   write() : void   raises ReadOnlyMode, DCPSError
 *   purge() : void
 *   create_contract(object : ObjectRoot, scope : ObjectScope, depth : long) : void
 *   delete_contract(a_contract : Contract) : void
 * @constraints
 *   kind = CACHE_KIND.CACHEACCESS_KIND.
 */
export interface ICacheAccess extends ICacheBase {
  readonly owner: ICache;
  readonly contracts: ReadonlyArray<IContract>;
  readonly type_names: ReadonlyArray<string>;
  write(): void;
  purge(): void;
  create_contract(
    object: IObjectRoot,
    scope: ObjectScope,
    depth: number
  ): void;
  delete_contract(a_contract: IContract): void;
}

export class CacheAccess implements ICacheAccess {
  readonly metaClass = "CacheAccess" as const;
  readonly cache_usage: CacheUsage;
  readonly objects: ReadonlyArray<IObjectRoot>;
  readonly kind: CacheKindLiteral = CACHE_KIND.CACHEACCESS_KIND;
  readonly owner: ICache;
  readonly contracts: ReadonlyArray<IContract>;
  readonly type_names: ReadonlyArray<string>;
  constructor(data: {
    cache_usage: CacheUsage;
    objects: ReadonlyArray<IObjectRoot>;
    owner: ICache;
    contracts?: ReadonlyArray<IContract>;
    type_names?: ReadonlyArray<string>;
  }) {
    this.cache_usage = data.cache_usage;
    this.objects = data.objects;
    this.owner = data.owner;
    this.contracts = data.contracts ?? [];
    this.type_names = data.type_names ?? [];
  }
  refresh(): void {
    // default: NO-OP — concrete vendors implement
  }
  write(): void {
    // default: NO-OP — concrete vendors implement
  }
  purge(): void {
    // default: NO-OP — concrete vendors implement
  }
  create_contract(
    _object: IObjectRoot,
    _scope: ObjectScope,
    _depth: number
  ): void {
    // default: NO-OP — concrete vendors implement
  }
  delete_contract(_a_contract: IContract): void {
    // default: NO-OP — concrete vendors implement
  }
}

// ─── 133. Cache (DLRL root cache) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §?
 * @metaclass concrete
 * @generalization ICacheBase
 * @definition Cache is the local interface that manages a set of related
 *   DLRL objects, tied to one DDS::Publisher and/or one DDS::Subscriber.
 *   Per `dds_dlrl.idl`: `local interface Cache : CacheBase { readonly
 *   attribute DCPSState pubsub_state; readonly attribute DDS::Publisher
 *   the_publisher; readonly attribute DDS::Subscriber the_subscriber;
 *   readonly attribute boolean updates_enabled; readonly attribute
 *   ObjectHomeSeq homes; readonly attribute CacheAccessSeq sub_accesses;
 *   readonly attribute CacheListenerSeq listeners; void
 *   register_all_for_pubsub() raises (BadHomeDefinition, DCPSError,
 *   PreconditionNotMet); void enable_all_for_pubsub() raises (DCPSError,
 *   PreconditionNotMet); unsigned long register_home(in ObjectHome
 *   a_home) raises (PreconditionNotMet); ObjectHome find_home_by_name(in
 *   ClassName class_name); ObjectHome find_home_by_index(in unsigned
 *   long index); void attach_listener(in CacheListener listener); void
 *   detach_listener(in CacheListener listener); void enable_updates();
 *   void disable_updates(); CacheAccess create_access(in CacheUsage
 *   purpose) raises (PreconditionNotMet); void delete_access(in
 *   CacheAccess access) raises (PreconditionNotMet); };`. kind is
 *   hard-bound to CACHE_KIND.CACHE_KIND.
 * @ownedAttributes
 *   pubsub_state : DCPSState [1]
 *   updates_enabled : boolean [1]
 * @associationEnds
 *   the_publisher : Publisher [0..1]
 *   the_subscriber : Subscriber [0..1]
 *   homes : ObjectHome[*]
 *   sub_accesses : CacheAccess[*]
 *   listeners : CacheListener[*]
 * @operations
 *   register_all_for_pubsub() : void   raises BadHomeDefinition, DCPSError, PreconditionNotMet
 *   enable_all_for_pubsub() : void     raises DCPSError, PreconditionNotMet
 *   register_home(a_home : ObjectHome) : unsigned long
 *   find_home_by_name(class_name : ClassName) : ObjectHome
 *   find_home_by_index(index : unsigned long) : ObjectHome
 *   attach_listener(listener : CacheListener) : void
 *   detach_listener(listener : CacheListener) : void
 *   enable_updates() : void
 *   disable_updates() : void
 *   create_access(purpose : CacheUsage) : CacheAccess
 *   delete_access(access : CacheAccess) : void
 * @constraints
 *   kind = CACHE_KIND.CACHE_KIND.
 */
export interface ICache extends ICacheBase {
  readonly pubsub_state: DCPSState;
  readonly the_publisher: IPublisher | undefined;
  readonly the_subscriber: ISubscriber | undefined;
  readonly updates_enabled: boolean;
  readonly homes: ReadonlyArray<IObjectHome>;
  readonly sub_accesses: ReadonlyArray<ICacheAccess>;
  readonly listeners: ReadonlyArray<ICacheListener>;
  register_all_for_pubsub(): void;
  enable_all_for_pubsub(): void;
  register_home(a_home: IObjectHome): number;
  find_home_by_name(class_name: string): IObjectHome | undefined;
  find_home_by_index(index: number): IObjectHome | undefined;
  attach_listener(listener: ICacheListener): void;
  detach_listener(listener: ICacheListener): void;
  enable_updates(): void;
  disable_updates(): void;
  create_access(purpose: CacheUsage): ICacheAccess;
  delete_access(access: ICacheAccess): void;
}

export class Cache implements ICache {
  readonly metaClass = "Cache" as const;
  readonly cache_usage: CacheUsage;
  readonly objects: ReadonlyArray<IObjectRoot>;
  readonly kind: CacheKindLiteral = CACHE_KIND.CACHE_KIND;
  readonly pubsub_state: DCPSState;
  readonly the_publisher: IPublisher | undefined;
  readonly the_subscriber: ISubscriber | undefined;
  readonly updates_enabled: boolean;
  readonly homes: ReadonlyArray<IObjectHome>;
  readonly sub_accesses: ReadonlyArray<ICacheAccess>;
  readonly listeners: ReadonlyArray<ICacheListener>;
  constructor(data: {
    cache_usage: CacheUsage;
    objects?: ReadonlyArray<IObjectRoot>;
    pubsub_state: DCPSState;
    the_publisher?: IPublisher;
    the_subscriber?: ISubscriber;
    updates_enabled: boolean;
    homes?: ReadonlyArray<IObjectHome>;
    sub_accesses?: ReadonlyArray<ICacheAccess>;
    listeners?: ReadonlyArray<ICacheListener>;
  }) {
    this.cache_usage = data.cache_usage;
    this.objects = data.objects ?? [];
    this.pubsub_state = data.pubsub_state;
    this.the_publisher = data.the_publisher;
    this.the_subscriber = data.the_subscriber;
    this.updates_enabled = data.updates_enabled;
    this.homes = data.homes ?? [];
    this.sub_accesses = data.sub_accesses ?? [];
    this.listeners = data.listeners ?? [];
  }
  refresh(): void {
    // default: NO-OP — concrete vendors implement
  }
  register_all_for_pubsub(): void {
    // default: NO-OP — concrete vendors implement
  }
  enable_all_for_pubsub(): void {
    // default: NO-OP — concrete vendors implement
  }
  register_home(_a_home: IObjectHome): number {
    // default: returns 0 — concrete vendors track registration_index
    return 0;
  }
  find_home_by_name(_class_name: string): IObjectHome | undefined {
    // default: NO-OP — concrete vendors implement
    return undefined;
  }
  find_home_by_index(_index: number): IObjectHome | undefined {
    // default: NO-OP — concrete vendors implement
    return undefined;
  }
  attach_listener(_listener: ICacheListener): void {
    // default: NO-OP — concrete vendors implement
  }
  detach_listener(_listener: ICacheListener): void {
    // default: NO-OP — concrete vendors implement
  }
  enable_updates(): void {
    // default: NO-OP — concrete vendors implement
  }
  disable_updates(): void {
    // default: NO-OP — concrete vendors implement
  }
  create_access(purpose: CacheUsage): ICacheAccess {
    // default: minimal CacheAccess scaffold — concrete vendors override
    return new CacheAccess({
      cache_usage: purpose,
      objects: [],
      owner: this,
    });
  }
  delete_access(_access: ICacheAccess): void {
    // default: NO-OP — concrete vendors implement
  }
}

// ─── 134. CacheDescription (DLRL value-type carrier) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §?
 * @metaclass concrete
 * @generalization (root)
 * @definition CacheDescription is the value-type carrier passed to
 *   CacheFactory.create_cache to describe the Cache to be instantiated.
 *   Per `dds_dlrl.idl`: `valuetype CacheDescription { public CacheName
 *   name; public DDS::DomainParticipant domain; };`. name is the
 *   directory-like identifier under which the Cache is registered with
 *   the factory; domain is the DCPS DomainParticipant the Cache is
 *   wired to.
 * @ownedAttributes
 *   name : string [1]
 * @associationEnds
 *   domain : DomainParticipant [1]
 * @operations (none)
 * @constraints (none declared in dds_dlrl.idl)
 */
export interface ICacheDescription {
  readonly name: string;
  readonly domain: IDomainParticipant;
}

export class CacheDescription implements ICacheDescription {
  readonly metaClass = "CacheDescription" as const;
  readonly name: string;
  readonly domain: IDomainParticipant;
  constructor(data: { name: string; domain: IDomainParticipant }) {
    this.name = data.name;
    this.domain = data.domain;
  }
}

// ─── 135. CacheFactory (DLRL singleton factory) ───
/**
 * @standard OMG DDS 1.4 -- formal/2015-04-10
 * @section §?
 * @metaclass concrete
 * @generalization (root)
 * @definition CacheFactory is the singleton local interface that creates,
 *   looks up, and deletes Cache instances. Per `dds_dlrl.idl`:
 *   `local interface CacheFactory { Cache create_cache(in CacheUsage
 *   cache_usage, in CacheDescription cache_description) raises
 *   (DCPSError, AlreadyExisting); Cache find_cache_by_name(in CacheName
 *   name); void delete_cache(in Cache a_cache); };`.
 * @ownedAttributes (none)
 * @associationEnds (none — singleton)
 * @operations
 *   create_cache(cache_usage : CacheUsage, cache_description : CacheDescription) : Cache
 *   find_cache_by_name(name : string) : Cache
 *   delete_cache(a_cache : Cache) : void
 * @constraints
 *   create_cache MAY raise AlreadyExisting if a Cache by the same name
 *   exists.
 */
export interface ICacheFactory {
  create_cache(
    cache_usage: CacheUsage,
    cache_description: ICacheDescription
  ): ICache;
  find_cache_by_name(name: string): ICache | undefined;
  delete_cache(a_cache: ICache): void;
}

export class CacheFactory implements ICacheFactory {
  readonly metaClass = "CacheFactory" as const;
  private _caches = new Map<string, ICache>();
  create_cache(
    cache_usage: CacheUsage,
    cache_description: ICacheDescription
  ): ICache {
    const cache = new Cache({
      cache_usage,
      pubsub_state: DCPS_STATE.INITIAL,
      updates_enabled: false,
    });
    this._caches.set(cache_description.name, cache);
    return cache;
  }
  find_cache_by_name(name: string): ICache | undefined {
    return this._caches.get(name);
  }
  delete_cache(a_cache: ICache): void {
    for (const [name, c] of this._caches.entries()) {
      if (c === a_cache) {
        this._caches.delete(name);
        return;
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// — END Implementer #5: DLRL + index barrel —
//
// Inventory inserted in this section (DLRL — `spec/dds_dlrl.idl`):
//   • Kind enums (8): ReferenceScope, ObjectScope, DCPSState, CacheUsage,
//     ObjectState, RelationKind, CriterionKind, MembershipState, CacheKind
//   • Constants (1): UNLIMITED_RELATED_OBJECTS
//   • Carriers (5): DLRLOid, DLRLOidGenerator, RelationDescription
//     (+ 3 children: ListRelationDescription, IntMapRelationDescription,
//     StrMapRelationDescription), CacheDescription
//   • Listeners (3): ObjectListener, SelectionListener, CacheListener
//   • Selection criteria (3): SelectionCriterion (abstract),
//     FilterCriterion, QueryCriterion
//   • Contract (1): Contract
//   • Aggregate roots (3 abstract surfaces): ObjectRoot, ObjectHome,
//     Selection (concrete with NO-OP refresh)
//   • Collections (5): Collection (abstract), List (abstract), Set,
//     StrMap (abstract), IntMap (abstract)
//   • Cache hierarchy (3): CacheBase (abstract), CacheAccess, Cache
//   • Factory (1): CacheFactory
//
// Total DLRL metaclass count: 28 (8 kind enums + 1 constant + 5 carriers
// + 3 listeners + 3 criteria + 1 Contract + 3 aggregate-root surfaces +
// 5 collections + 3 cache hierarchy + 1 factory − 1 abstract Collection
// already counted). Per dds_dlrl.idl, the abstract surfaces (ObjectRoot,
// ObjectHome, Collection, List, StrMap, IntMap, CacheBase,
// SelectionCriterion) are interface-only — concrete subtypes are
// generated per applicative class downstream and surfaced as IDL-level
// FooObject / FooHome / FooSet / FooSelection / FooFilterCriterion etc.
// They are therefore exported from this metamodel as interfaces only.
//
// Spec ambiguity flagged in this partition:
//   • The DDS 1.4 specification (formal/2015-04-10) does not include a
//     numbered §2.3.x DLRL chapter. The DLRL specification was a
//     separately maintained sub-spec from DDS 1.0/1.1/1.2 that was
//     dropped in DDS 1.4. The IDL artifact `spec/dds_dlrl.idl` is the
//     authoritative source for this implementer; every metaclass
//     declaration above carries `@section §?` to flag this scope
//     mismatch with the partition brief. Downstream readers should
//     consult `dds_dlrl.idl` directly + the OMG DLRL formal sub-spec for
//     normative semantics.
//   • The brief enumerated DLRL members "ListRelation, MapRelation,
//     StringMapRelation, RefRelation". `dds_dlrl.idl` declares
//     RelationDescription (root) and three children
//     (ListRelationDescription, IntMapRelationDescription,
//     StrMapRelationDescription) — descriptors of relations rather than
//     relations themselves. The relations themselves surface as the
//     Collection / List / Set / StrMap / IntMap valuetype family and are
//     generated per concrete Foo type. Both the descriptors and the
//     collection valuetypes have been exported above. RefRelation
//     specifically does not appear as a separate IDL valuetype — a
//     reference relation is a single-target relation surfaced through
//     the per-Foo generated accessor with kind = REF_RELATION; the
//     descriptor RelationDescription with kind = REF_RELATION is
//     therefore the meta-surface of "RefRelation". @section §?
//   • The brief enumerated DLRL members "DLRLListener" + "HomeListener".
//     `dds_dlrl.idl` declares only three listener roots — ObjectListener
//     (attached to ObjectHome), SelectionListener, CacheListener —
//     with no DLRLListener marker root and no separate HomeListener.
//     ObjectListener IS the listener attached to ObjectHome instances.
//     @section §?
//   • The brief enumerated "FunctionalRequest, MultiObjectFilter".
//     `dds_dlrl.idl` does not declare these IDL types. They appear to
//     belong to extension proposals or vendor-specific DLRL refinements
//     and have therefore been omitted. @section §?
//
// End of Implementer #5 partition.
// ═══════════════════════════════════════════════════════════════════════════
