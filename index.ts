// @amlhubs/dds — OMG DDS 1.4 metamodel (frozen lowercase namespace)
//
// Exposes a frozen lowercase dotted namespace `dds.{concept}.{verb}` so call
// sites look like:
//   dds.entity.qos.set(e, qos)
//   dds.entity.statuscondition.get(e)
//   dds.topic.inconsistenttopicstatus.get(t)
//   dds.publisher.participant.get(p)
//   dds.subscriber.participant.get(s)
//   dds.datawriter.topic.get(w)
//   dds.datareader.topicdescription.get(r)
//   dds.duration.sec.get(d)
//   dds.qospolicy.reliability.kind.get(q)
//   dds.cache.pubsub.state.get(c)
//   dds.objectroot.oid.get(o)
//
// Rule enforcement (integrated-team re-export rules):
//   - No vendor-isms exported (`Client`, `Sdk`, etc. stay internal).
//   - Lowercase identifiers at every depth preserve the dotted-namespace
//     call-site shape.
//   - Concrete classes + interfaces re-exported for tree-shakeable sub-path
//     imports.

import type {
  // ── DCPS Infrastructure (§2.2.2.1, §2.2.2.2, §2.2.2.3, §2.2.2.4, §2.2.2.5) ──
  IEntity,
  IDomainEntity,
  ITypeSupport,
  IDomainParticipantFactory,
  IDomainParticipant,
  ITopicDescription,
  ITopic,
  IContentFilteredTopic,
  IMultiTopic,
  IPublisher,
  ISubscriber,
  // ── Communication primitives (§2.3.3 supporting types, §2.2.2.1.6 .. §2.2.2.5.9) ──
  IDuration_t,
  ITime_t,
  IInstanceHandle_t,
  IBuiltinTopicKey_t,
  ICondition,
  IGuardCondition,
  IStatusCondition,
  IReadCondition,
  IQueryCondition,
  IWaitSet,
  ISampleInfo,
  IDataSample,
  IDataWriter,
  IDataReader,
  // ── QoS policies (§2.2.3.1 .. §2.2.3.22) ──
  IQosPolicy,
  IUserDataQosPolicy,
  ITopicDataQosPolicy,
  IGroupDataQosPolicy,
  ITransportPriorityQosPolicy,
  ILifespanQosPolicy,
  IDurabilityQosPolicy,
  IPresentationQosPolicy,
  IDeadlineQosPolicy,
  ILatencyBudgetQosPolicy,
  IOwnershipQosPolicy,
  IOwnershipStrengthQosPolicy,
  ILivelinessQosPolicy,
  ITimeBasedFilterQosPolicy,
  IPartitionQosPolicy,
  IReliabilityQosPolicy,
  IDestinationOrderQosPolicy,
  IHistoryQosPolicy,
  IResourceLimitsQosPolicy,
  IEntityFactoryQosPolicy,
  IWriterDataLifecycleQosPolicy,
  IReaderDataLifecycleQosPolicy,
  IDurabilityServiceQosPolicy,
  IDomainParticipantFactoryQos,
  IDomainParticipantQos,
  ITopicQos,
  IPublisherQos,
  ISubscriberQos,
  IDataWriterQos,
  IDataReaderQos,
  // ── Listeners + Status structures (§2.2.4.1 + §2.2.4.3) ──
  IQosPolicyCount,
  IStatus,
  IInconsistentTopicStatus,
  ISampleLostStatus,
  ISampleRejectedStatus,
  ILivelinessLostStatus,
  ILivelinessChangedStatus,
  IOfferedDeadlineMissedStatus,
  IRequestedDeadlineMissedStatus,
  IOfferedIncompatibleQosStatus,
  IRequestedIncompatibleQosStatus,
  IPublicationMatchedStatus,
  ISubscriptionMatchedStatus,
  IListener,
  ITopicListener,
  IDataWriterListener,
  IPublisherListener,
  IDataReaderListener,
  ISubscriberListener,
  IDomainParticipantListener,
  // ── BuiltinTopicData (§2.2.5) ──
  IParticipantBuiltinTopicData,
  ITopicBuiltinTopicData,
  IPublicationBuiltinTopicData,
  ISubscriptionBuiltinTopicData,
  // ── DLRL (dds_dlrl.idl) ──
  IDLRLOid,
  IDLRLOidGenerator,
  IRelationDescription,
  IListRelationDescription,
  IIntMapRelationDescription,
  IStrMapRelationDescription,
  IObjectListener,
  ISelectionListener,
  ICacheListener,
  IContract,
  ISelectionCriterion,
  IFilterCriterion,
  IQueryCriterion,
  IObjectRoot,
  IObjectHome,
  ISelection,
  ICollection,
  IList,
  ISet,
  IStrMap,
  IIntMap,
  ICacheBase,
  ICacheAccess,
  ICache,
  ICacheDescription,
  ICacheFactory,
} from './dds.js'

// ─── dds namespace — frozen lowercase dotted accessors ───

export const dds = {

  // ── entity (IEntity §2.2.2.1.1) ─────────────────────────────────────────
  entity: {
    qos: {
      get: (e: IEntity): ReadonlyArray<string> => e.getQos(),
      set: (e: IEntity, qos: ReadonlyArray<string>): string => e.setQos(qos),
    },
    listener: {
      get: (e: IEntity): string | undefined => e.getListener(),
    },
    statuscondition: {
      get: (e: IEntity): string | undefined => e.getStatuscondition(),
    },
    statuschanges: {
      get: (e: IEntity): ReadonlyArray<string> => e.getStatusChanges(),
    },
    instancehandle: {
      get: (e: IEntity): string | undefined => e.getInstanceHandle(),
    },
    enable: {
      get: (e: IEntity): string => e.enable(),
    },
  },

  // ── domainentity (IDomainEntity §2.2.2.1.2) ─────────────────────────────
  domainentity: {
    qos: {
      get: (e: IDomainEntity): ReadonlyArray<string> => e.getQos(),
    },
  },

  // ── typesupport (ITypeSupport §2.2.2.3.6) ───────────────────────────────
  typesupport: {
    typename: {
      get: (t: ITypeSupport): string => t.getTypeName(),
    },
    register: {
      get: (
        t: ITypeSupport,
        participantId: string,
        typeName: string | undefined
      ): string => t.registerType(participantId, typeName),
    },
  },

  // ── domainparticipantfactory (IDomainParticipantFactory §2.2.2.2.2) ─────
  domainparticipantfactory: {
    defaultparticipantqos: {
      get: (f: IDomainParticipantFactory): ReadonlyArray<string> =>
        f.getDefaultParticipantQos(),
    },
    qos: {
      get: (f: IDomainParticipantFactory): ReadonlyArray<string> => f.getQos(),
    },
  },

  // ── domainparticipant (IDomainParticipant §2.2.2.2.1) ───────────────────
  domainparticipant: {
    domainid: {
      get: (p: IDomainParticipant): number => p.getDomainId(),
    },
    builtinsubscriber: {
      get: (p: IDomainParticipant): string | undefined =>
        p.getBuiltinSubscriber(),
    },
    discoveredparticipants: {
      get: (p: IDomainParticipant): ReadonlyArray<string> =>
        p.getDiscoveredParticipants(),
    },
    discoveredtopics: {
      get: (p: IDomainParticipant): ReadonlyArray<string> =>
        p.getDiscoveredTopics(),
    },
    currenttime: {
      get: (p: IDomainParticipant): string | undefined => p.getCurrentTime(),
    },
    defaultpublisherqos: {
      get: (p: IDomainParticipant): ReadonlyArray<string> =>
        p.getDefaultPublisherQos(),
    },
    defaultsubscriberqos: {
      get: (p: IDomainParticipant): ReadonlyArray<string> =>
        p.getDefaultSubscriberQos(),
    },
    defaulttopicqos: {
      get: (p: IDomainParticipant): ReadonlyArray<string> =>
        p.getDefaultTopicQos(),
    },
    containsentity: {
      check: (p: IDomainParticipant, handle: string): boolean =>
        p.containsEntity(handle),
    },
  },

  // ── topicdescription (ITopicDescription §2.2.2.3.1) ─────────────────────
  topicdescription: {
    name: {
      get: (t: ITopicDescription): string => t.name,
    },
    typename: {
      get: (t: ITopicDescription): string => t.typeName,
    },
    participant: {
      get: (t: ITopicDescription): string | undefined => t.getParticipant(),
    },
  },

  // ── topic (ITopic §2.2.2.3.2) ────────────────────────────────────────────
  topic: {
    name: {
      get: (t: ITopic): string => t.name,
    },
    typename: {
      get: (t: ITopic): string => t.typeName,
    },
    inconsistenttopicstatus: {
      get: (t: ITopic): string | undefined => t.getInconsistentTopicStatus(),
    },
  },

  // ── contentfilteredtopic (IContentFilteredTopic §2.2.2.3.3) ─────────────
  contentfilteredtopic: {
    filterexpression: {
      get: (c: IContentFilteredTopic): string => c.filterExpression,
    },
    relatedtopic: {
      get: (c: IContentFilteredTopic): string => c.getRelatedTopic(),
    },
    expressionparameters: {
      get: (c: IContentFilteredTopic): ReadonlyArray<string> =>
        c.getExpressionParameters(),
    },
  },

  // ── multitopic (IMultiTopic §2.2.2.3.4) ─────────────────────────────────
  multitopic: {
    name: {
      get: (m: IMultiTopic): string => m.name,
    },
    typename: {
      get: (m: IMultiTopic): string => m.typeName,
    },
  },

  // ── publisher (IPublisher §2.2.2.4.1) ───────────────────────────────────
  publisher: {
    participant: {
      get: (p: IPublisher): string | undefined => p.getParticipant(),
    },
    defaultdatawriterqos: {
      get: (p: IPublisher): ReadonlyArray<string> =>
        p.getDefaultDatawriterQos(),
    },
  },

  // ── subscriber (ISubscriber §2.2.2.5.2) ─────────────────────────────────
  subscriber: {
    participant: {
      get: (s: ISubscriber): string | undefined => s.getParticipant(),
    },
    defaultdatareaderqos: {
      get: (s: ISubscriber): ReadonlyArray<string> =>
        s.getDefaultDatareaderQos(),
    },
  },

  // ── duration (IDuration_t §2.3.3) ────────────────────────────────────────
  duration: {
    sec: {
      get: (d: IDuration_t): number => d.sec,
    },
    nanosec: {
      get: (d: IDuration_t): number => d.nanosec,
    },
  },

  // ── time (ITime_t §2.3.3) ────────────────────────────────────────────────
  time: {
    sec: {
      get: (t: ITime_t): number => t.sec,
    },
    nanosec: {
      get: (t: ITime_t): number => t.nanosec,
    },
  },

  // ── instancehandle (IInstanceHandle_t §2.3.3) ────────────────────────────
  instancehandle: {
    value: {
      get: (h: IInstanceHandle_t): number => h.value,
    },
  },

  // ── builtintopickey (IBuiltinTopicKey_t §2.3.3) ──────────────────────────
  builtintopickey: {
    value: {
      get: (k: IBuiltinTopicKey_t): readonly [number, number, number] =>
        k.value,
    },
  },

  // ── condition (ICondition §2.2.2.1.7) ────────────────────────────────────
  condition: {
    triggervalue: {
      is: (c: ICondition): boolean => c.getTriggerValue(),
    },
  },

  // ── guardcondition (IGuardCondition §2.2.2.1.8) ──────────────────────────
  guardcondition: {
    triggervalue: {
      is: (g: IGuardCondition): boolean => g.getTriggerValue(),
    },
  },

  // ── statuscondition (IStatusCondition §2.2.2.1.9) ────────────────────────
  statuscondition: {
    enabledstatuses: {
      get: (s: IStatusCondition): ReadonlyArray<string> =>
        s.getEnabledStatuses(),
    },
    entity: {
      get: (s: IStatusCondition): string => s.getEntity(),
    },
  },

  // ── readcondition (IReadCondition §2.2.2.5.8) ────────────────────────────
  readcondition: {
    samplestatemask: {
      get: (r: IReadCondition): ReadonlyArray<string> =>
        r.getSampleStateMask(),
    },
    viewstatemask: {
      get: (r: IReadCondition): ReadonlyArray<string> => r.getViewStateMask(),
    },
    instancestatemask: {
      get: (r: IReadCondition): ReadonlyArray<string> =>
        r.getInstanceStateMask(),
    },
    datareader: {
      get: (r: IReadCondition): string => r.getDatareader(),
    },
  },

  // ── querycondition (IQueryCondition §2.2.2.5.9) ──────────────────────────
  querycondition: {
    queryexpression: {
      get: (q: IQueryCondition): string => q.getQueryExpression(),
    },
    queryparameters: {
      get: (q: IQueryCondition): ReadonlyArray<string> =>
        q.getQueryParameters(),
    },
  },

  // ── waitset (IWaitSet §2.2.2.1.6) ────────────────────────────────────────
  waitset: {
    conditions: {
      get: (w: IWaitSet): ReadonlyArray<string> => w.getConditions(),
    },
  },

  // ── sampleinfo (ISampleInfo §2.2.2.5.5) ──────────────────────────────────
  sampleinfo: {
    samplestate: {
      get: (s: ISampleInfo): string => s.sampleState,
    },
    viewstate: {
      get: (s: ISampleInfo): string => s.viewState,
    },
    instancestate: {
      get: (s: ISampleInfo): string => s.instanceState,
    },
    disposedgenerationcount: {
      get: (s: ISampleInfo): number => s.disposedGenerationCount,
    },
    nowritersgenerationcount: {
      get: (s: ISampleInfo): number => s.noWritersGenerationCount,
    },
    samplerank: {
      get: (s: ISampleInfo): number => s.sampleRank,
    },
    generationrank: {
      get: (s: ISampleInfo): number => s.generationRank,
    },
    absolutegenerationrank: {
      get: (s: ISampleInfo): number => s.absoluteGenerationRank,
    },
    sourcetimestamp: {
      get: (s: ISampleInfo): ITime_t => s.sourceTimestamp,
    },
    instancehandle: {
      get: (s: ISampleInfo): IInstanceHandle_t => s.instanceHandle,
    },
    publicationhandle: {
      get: (s: ISampleInfo): IInstanceHandle_t => s.publicationHandle,
    },
    validdata: {
      is: (s: ISampleInfo): boolean => s.validData,
    },
  },

  // ── datasample (IDataSample §2.2.2.5.4) ──────────────────────────────────
  datasample: {
    info: {
      get: (s: IDataSample): ISampleInfo => s.info,
    },
    data: {
      get: (s: IDataSample): unknown => s.data,
    },
  },

  // ── datawriter (IDataWriter §2.2.2.4.2) ─────────────────────────────────
  datawriter: {
    topic: {
      get: (w: IDataWriter): string => w.getTopic(),
    },
    publisher: {
      get: (w: IDataWriter): string => w.getPublisher(),
    },
    livelinessloststatus: {
      get: (w: IDataWriter): string | undefined =>
        w.getLivelinessLostStatus(),
    },
    offereddeadlinemissedstatus: {
      get: (w: IDataWriter): string | undefined =>
        w.getOfferedDeadlineMissedStatus(),
    },
    offeredincompatibleqosstatus: {
      get: (w: IDataWriter): string | undefined =>
        w.getOfferedIncompatibleQosStatus(),
    },
    publicationmatchedstatus: {
      get: (w: IDataWriter): string | undefined =>
        w.getPublicationMatchedStatus(),
    },
    matchedsubscriptions: {
      get: (w: IDataWriter): ReadonlyArray<IInstanceHandle_t> =>
        w.getMatchedSubscriptions(),
    },
  },

  // ── datareader (IDataReader §2.2.2.5.3) ─────────────────────────────────
  datareader: {
    topicdescription: {
      get: (r: IDataReader): string => r.getTopicdescription(),
    },
    subscriber: {
      get: (r: IDataReader): string => r.getSubscriber(),
    },
    samplerejectedstatus: {
      get: (r: IDataReader): string | undefined =>
        r.getSampleRejectedStatus(),
    },
    livelinesschangedstatus: {
      get: (r: IDataReader): string | undefined =>
        r.getLivelinessChangedStatus(),
    },
    requesteddeadlinemissedstatus: {
      get: (r: IDataReader): string | undefined =>
        r.getRequestedDeadlineMissedStatus(),
    },
    requestedincompatibleqosstatus: {
      get: (r: IDataReader): string | undefined =>
        r.getRequestedIncompatibleQosStatus(),
    },
    subscriptionmatchedstatus: {
      get: (r: IDataReader): string | undefined =>
        r.getSubscriptionMatchedStatus(),
    },
    samplelostatatus: {
      get: (r: IDataReader): string | undefined => r.getSampleLostStatus(),
    },
    matchedpublications: {
      get: (r: IDataReader): ReadonlyArray<IInstanceHandle_t> =>
        r.getMatchedPublications(),
    },
  },

  // ── qospolicy (IQosPolicy §2.2.3) ───────────────────────────────────────
  qospolicy: {
    name: {
      get: (q: IQosPolicy): string => q.name,
    },
    userdata: {
      value: {
        get: (q: IUserDataQosPolicy): ReadonlyArray<number> => q.value,
      },
    },
    topicdata: {
      value: {
        get: (q: ITopicDataQosPolicy): ReadonlyArray<number> => q.value,
      },
    },
    groupdata: {
      value: {
        get: (q: IGroupDataQosPolicy): ReadonlyArray<number> => q.value,
      },
    },
    transportpriority: {
      value: {
        get: (q: ITransportPriorityQosPolicy): number => q.value,
      },
    },
    lifespan: {
      duration: {
        get: (q: ILifespanQosPolicy): IDuration_t => q.duration,
      },
    },
    durability: {
      kind: {
        get: (q: IDurabilityQosPolicy): string => q.kind,
      },
    },
    presentation: {
      accessscope: {
        get: (q: IPresentationQosPolicy): string => q.access_scope,
      },
      coherentaccess: {
        is: (q: IPresentationQosPolicy): boolean => q.coherent_access,
      },
      orderedaccess: {
        is: (q: IPresentationQosPolicy): boolean => q.ordered_access,
      },
    },
    deadline: {
      period: {
        get: (q: IDeadlineQosPolicy): IDuration_t => q.period,
      },
    },
    latencybudget: {
      duration: {
        get: (q: ILatencyBudgetQosPolicy): IDuration_t => q.duration,
      },
    },
    ownership: {
      kind: {
        get: (q: IOwnershipQosPolicy): string => q.kind,
      },
    },
    ownershipstrength: {
      value: {
        get: (q: IOwnershipStrengthQosPolicy): number => q.value,
      },
    },
    liveliness: {
      kind: {
        get: (q: ILivelinessQosPolicy): string => q.kind,
      },
      leaseduration: {
        get: (q: ILivelinessQosPolicy): IDuration_t => q.lease_duration,
      },
    },
    timebasedfilter: {
      minimumseparation: {
        get: (q: ITimeBasedFilterQosPolicy): IDuration_t =>
          q.minimum_separation,
      },
    },
    partition: {
      partitionnames: {
        get: (q: IPartitionQosPolicy): ReadonlyArray<string> =>
          q.partitionNames,
      },
    },
    reliability: {
      kind: {
        get: (q: IReliabilityQosPolicy): string => q.kind,
      },
      maxblockingtime: {
        get: (q: IReliabilityQosPolicy): IDuration_t => q.max_blocking_time,
      },
    },
    destinationorder: {
      kind: {
        get: (q: IDestinationOrderQosPolicy): string => q.kind,
      },
    },
    history: {
      kind: {
        get: (q: IHistoryQosPolicy): string => q.kind,
      },
      depth: {
        get: (q: IHistoryQosPolicy): number => q.depth,
      },
    },
    resourcelimits: {
      maxsamples: {
        get: (q: IResourceLimitsQosPolicy): number => q.max_samples,
      },
      maxinstances: {
        get: (q: IResourceLimitsQosPolicy): number => q.max_instances,
      },
      maxsamplesperinstance: {
        get: (q: IResourceLimitsQosPolicy): number =>
          q.max_samples_per_instance,
      },
    },
    entityfactory: {
      autoenablecreatedentities: {
        is: (q: IEntityFactoryQosPolicy): boolean =>
          q.autoenable_created_entities,
      },
    },
    writerdatalifecycle: {
      autodisposeunregisteredinstances: {
        is: (q: IWriterDataLifecycleQosPolicy): boolean =>
          q.autodispose_unregistered_instances,
      },
    },
    readerdatalifecycle: {
      autopurgenowritersamplesdelay: {
        get: (q: IReaderDataLifecycleQosPolicy): IDuration_t =>
          q.autopurge_nowriter_samples_delay,
      },
      autopurgedisposedsamplesdelay: {
        get: (q: IReaderDataLifecycleQosPolicy): IDuration_t =>
          q.autopurge_disposed_samples_delay,
      },
    },
    durabilityservice: {
      servicecleanupdelay: {
        get: (q: IDurabilityServiceQosPolicy): IDuration_t =>
          q.service_cleanup_delay,
      },
      historykind: {
        get: (q: IDurabilityServiceQosPolicy): string => q.history_kind,
      },
      historydepth: {
        get: (q: IDurabilityServiceQosPolicy): number => q.history_depth,
      },
      maxsamples: {
        get: (q: IDurabilityServiceQosPolicy): number => q.max_samples,
      },
      maxinstances: {
        get: (q: IDurabilityServiceQosPolicy): number => q.max_instances,
      },
      maxsamplesperinstance: {
        get: (q: IDurabilityServiceQosPolicy): number =>
          q.max_samples_per_instance,
      },
    },
  },

  // ── domainparticipantfactoryqos (IDomainParticipantFactoryQos §2.2.3) ───
  domainparticipantfactoryqos: {
    entityfactory: {
      get: (q: IDomainParticipantFactoryQos): IEntityFactoryQosPolicy =>
        q.entity_factory,
    },
  },

  // ── domainparticipantqos (IDomainParticipantQos §2.2.3) ─────────────────
  domainparticipantqos: {
    userdata: {
      get: (q: IDomainParticipantQos): IUserDataQosPolicy => q.user_data,
    },
    entityfactory: {
      get: (q: IDomainParticipantQos): IEntityFactoryQosPolicy =>
        q.entity_factory,
    },
  },

  // ── topicqos (ITopicQos §2.2.3) ─────────────────────────────────────────
  topicqos: {
    topicdata: {
      get: (q: ITopicQos): ITopicDataQosPolicy => q.topic_data,
    },
    durability: {
      get: (q: ITopicQos): IDurabilityQosPolicy => q.durability,
    },
    durabilityservice: {
      get: (q: ITopicQos): IDurabilityServiceQosPolicy =>
        q.durability_service,
    },
    deadline: {
      get: (q: ITopicQos): IDeadlineQosPolicy => q.deadline,
    },
    latencybudget: {
      get: (q: ITopicQos): ILatencyBudgetQosPolicy => q.latency_budget,
    },
    liveliness: {
      get: (q: ITopicQos): ILivelinessQosPolicy => q.liveliness,
    },
    reliability: {
      get: (q: ITopicQos): IReliabilityQosPolicy => q.reliability,
    },
    destinationorder: {
      get: (q: ITopicQos): IDestinationOrderQosPolicy => q.destination_order,
    },
    history: {
      get: (q: ITopicQos): IHistoryQosPolicy => q.history,
    },
    resourcelimits: {
      get: (q: ITopicQos): IResourceLimitsQosPolicy => q.resource_limits,
    },
    transportpriority: {
      get: (q: ITopicQos): ITransportPriorityQosPolicy =>
        q.transport_priority,
    },
    lifespan: {
      get: (q: ITopicQos): ILifespanQosPolicy => q.lifespan,
    },
    ownership: {
      get: (q: ITopicQos): IOwnershipQosPolicy => q.ownership,
    },
  },

  // ── publisherqos (IPublisherQos §2.2.3) ─────────────────────────────────
  publisherqos: {
    presentation: {
      get: (q: IPublisherQos): IPresentationQosPolicy => q.presentation,
    },
    partition: {
      get: (q: IPublisherQos): IPartitionQosPolicy => q.partition,
    },
    groupdata: {
      get: (q: IPublisherQos): IGroupDataQosPolicy => q.group_data,
    },
    entityfactory: {
      get: (q: IPublisherQos): IEntityFactoryQosPolicy => q.entity_factory,
    },
  },

  // ── subscriberqos (ISubscriberQos §2.2.3) ───────────────────────────────
  subscriberqos: {
    presentation: {
      get: (q: ISubscriberQos): IPresentationQosPolicy => q.presentation,
    },
    partition: {
      get: (q: ISubscriberQos): IPartitionQosPolicy => q.partition,
    },
    groupdata: {
      get: (q: ISubscriberQos): IGroupDataQosPolicy => q.group_data,
    },
    entityfactory: {
      get: (q: ISubscriberQos): IEntityFactoryQosPolicy => q.entity_factory,
    },
  },

  // ── datawriterqos (IDataWriterQos §2.2.3) ───────────────────────────────
  datawriterqos: {
    durability: {
      get: (q: IDataWriterQos): IDurabilityQosPolicy => q.durability,
    },
    durabilityservice: {
      get: (q: IDataWriterQos): IDurabilityServiceQosPolicy =>
        q.durability_service,
    },
    deadline: {
      get: (q: IDataWriterQos): IDeadlineQosPolicy => q.deadline,
    },
    latencybudget: {
      get: (q: IDataWriterQos): ILatencyBudgetQosPolicy => q.latency_budget,
    },
    liveliness: {
      get: (q: IDataWriterQos): ILivelinessQosPolicy => q.liveliness,
    },
    reliability: {
      get: (q: IDataWriterQos): IReliabilityQosPolicy => q.reliability,
    },
    destinationorder: {
      get: (q: IDataWriterQos): IDestinationOrderQosPolicy =>
        q.destination_order,
    },
    history: {
      get: (q: IDataWriterQos): IHistoryQosPolicy => q.history,
    },
    resourcelimits: {
      get: (q: IDataWriterQos): IResourceLimitsQosPolicy => q.resource_limits,
    },
    transportpriority: {
      get: (q: IDataWriterQos): ITransportPriorityQosPolicy =>
        q.transport_priority,
    },
    lifespan: {
      get: (q: IDataWriterQos): ILifespanQosPolicy => q.lifespan,
    },
    userdata: {
      get: (q: IDataWriterQos): IUserDataQosPolicy => q.user_data,
    },
    ownership: {
      get: (q: IDataWriterQos): IOwnershipQosPolicy => q.ownership,
    },
    ownershipstrength: {
      get: (q: IDataWriterQos): IOwnershipStrengthQosPolicy =>
        q.ownership_strength,
    },
    writerdatalifecycle: {
      get: (q: IDataWriterQos): IWriterDataLifecycleQosPolicy =>
        q.writer_data_lifecycle,
    },
  },

  // ── datareaderqos (IDataReaderQos §2.2.3) ───────────────────────────────
  datareaderqos: {
    durability: {
      get: (q: IDataReaderQos): IDurabilityQosPolicy => q.durability,
    },
    deadline: {
      get: (q: IDataReaderQos): IDeadlineQosPolicy => q.deadline,
    },
    latencybudget: {
      get: (q: IDataReaderQos): ILatencyBudgetQosPolicy => q.latency_budget,
    },
    liveliness: {
      get: (q: IDataReaderQos): ILivelinessQosPolicy => q.liveliness,
    },
    reliability: {
      get: (q: IDataReaderQos): IReliabilityQosPolicy => q.reliability,
    },
    destinationorder: {
      get: (q: IDataReaderQos): IDestinationOrderQosPolicy =>
        q.destination_order,
    },
    history: {
      get: (q: IDataReaderQos): IHistoryQosPolicy => q.history,
    },
    resourcelimits: {
      get: (q: IDataReaderQos): IResourceLimitsQosPolicy => q.resource_limits,
    },
    userdata: {
      get: (q: IDataReaderQos): IUserDataQosPolicy => q.user_data,
    },
    ownership: {
      get: (q: IDataReaderQos): IOwnershipQosPolicy => q.ownership,
    },
    timebasedfilter: {
      get: (q: IDataReaderQos): ITimeBasedFilterQosPolicy =>
        q.time_based_filter,
    },
    readerdatalifecycle: {
      get: (q: IDataReaderQos): IReaderDataLifecycleQosPolicy =>
        q.reader_data_lifecycle,
    },
  },

  // ── qospolicycount (IQosPolicyCount §2.2.4.1) ───────────────────────────
  qospolicycount: {
    policyid: {
      get: (c: IQosPolicyCount): number => c.policy_id,
    },
    count: {
      get: (c: IQosPolicyCount): number => c.count,
    },
  },

  // ── inconsistenttopicstatus (IInconsistentTopicStatus §2.2.4.1) ─────────
  inconsistenttopicstatus: {
    totalcount: {
      get: (s: IInconsistentTopicStatus): number => s.total_count,
    },
    totalcountchange: {
      get: (s: IInconsistentTopicStatus): number => s.total_count_change,
    },
  },

  // ── samplelostatatus (ISampleLostStatus §2.2.4.1) ───────────────────────
  samplelostatatus: {
    totalcount: {
      get: (s: ISampleLostStatus): number => s.total_count,
    },
    totalcountchange: {
      get: (s: ISampleLostStatus): number => s.total_count_change,
    },
  },

  // ── samplerejectedstatus (ISampleRejectedStatus §2.2.4.1) ───────────────
  samplerejectedstatus: {
    totalcount: {
      get: (s: ISampleRejectedStatus): number => s.total_count,
    },
    totalcountchange: {
      get: (s: ISampleRejectedStatus): number => s.total_count_change,
    },
    lastreason: {
      get: (s: ISampleRejectedStatus): string => s.last_reason,
    },
    lastinstancehandle: {
      get: (s: ISampleRejectedStatus): IInstanceHandle_t =>
        s.last_instance_handle,
    },
  },

  // ── livelinessloststatus (ILivelinessLostStatus §2.2.4.1) ───────────────
  livelinessloststatus: {
    totalcount: {
      get: (s: ILivelinessLostStatus): number => s.total_count,
    },
    totalcountchange: {
      get: (s: ILivelinessLostStatus): number => s.total_count_change,
    },
  },

  // ── livelinesschangedstatus (ILivelinessChangedStatus §2.2.4.1) ─────────
  livelinesschangedstatus: {
    alivecount: {
      get: (s: ILivelinessChangedStatus): number => s.alive_count,
    },
    notalivecount: {
      get: (s: ILivelinessChangedStatus): number => s.not_alive_count,
    },
    alivecountchange: {
      get: (s: ILivelinessChangedStatus): number => s.alive_count_change,
    },
    notalivecountchange: {
      get: (s: ILivelinessChangedStatus): number => s.not_alive_count_change,
    },
    lastpublicationhandle: {
      get: (s: ILivelinessChangedStatus): IInstanceHandle_t =>
        s.last_publication_handle,
    },
  },

  // ── offereddeadlinemissedstatus (IOfferedDeadlineMissedStatus §2.2.4.1) ─
  offereddeadlinemissedstatus: {
    totalcount: {
      get: (s: IOfferedDeadlineMissedStatus): number => s.total_count,
    },
    totalcountchange: {
      get: (s: IOfferedDeadlineMissedStatus): number =>
        s.total_count_change,
    },
    lastinstancehandle: {
      get: (s: IOfferedDeadlineMissedStatus): IInstanceHandle_t =>
        s.last_instance_handle,
    },
  },

  // ── requesteddeadlinemissedstatus (IRequestedDeadlineMissedStatus §2.2.4.1) ─
  requesteddeadlinemissedstatus: {
    totalcount: {
      get: (s: IRequestedDeadlineMissedStatus): number => s.total_count,
    },
    totalcountchange: {
      get: (s: IRequestedDeadlineMissedStatus): number =>
        s.total_count_change,
    },
    lastinstancehandle: {
      get: (s: IRequestedDeadlineMissedStatus): IInstanceHandle_t =>
        s.last_instance_handle,
    },
  },

  // ── offeredincompatibleqosstatus (IOfferedIncompatibleQosStatus §2.2.4.1) ─
  offeredincompatibleqosstatus: {
    totalcount: {
      get: (s: IOfferedIncompatibleQosStatus): number => s.total_count,
    },
    totalcountchange: {
      get: (s: IOfferedIncompatibleQosStatus): number =>
        s.total_count_change,
    },
    lastpolicyid: {
      get: (s: IOfferedIncompatibleQosStatus): number => s.last_policy_id,
    },
    policies: {
      get: (s: IOfferedIncompatibleQosStatus): ReadonlyArray<IQosPolicyCount> =>
        s.policies,
    },
  },

  // ── requestedincompatibleqosstatus (IRequestedIncompatibleQosStatus §2.2.4.1) ─
  requestedincompatibleqosstatus: {
    totalcount: {
      get: (s: IRequestedIncompatibleQosStatus): number => s.total_count,
    },
    totalcountchange: {
      get: (s: IRequestedIncompatibleQosStatus): number =>
        s.total_count_change,
    },
    lastpolicyid: {
      get: (s: IRequestedIncompatibleQosStatus): number => s.last_policy_id,
    },
    policies: {
      get: (
        s: IRequestedIncompatibleQosStatus
      ): ReadonlyArray<IQosPolicyCount> => s.policies,
    },
  },

  // ── publicationmatchedstatus (IPublicationMatchedStatus §2.2.4.1) ───────
  publicationmatchedstatus: {
    totalcount: {
      get: (s: IPublicationMatchedStatus): number => s.total_count,
    },
    totalcountchange: {
      get: (s: IPublicationMatchedStatus): number => s.total_count_change,
    },
    lastsubscriptionhandle: {
      get: (s: IPublicationMatchedStatus): IInstanceHandle_t =>
        s.last_subscription_handle,
    },
    currentcount: {
      get: (s: IPublicationMatchedStatus): number => s.current_count,
    },
    currentcountchange: {
      get: (s: IPublicationMatchedStatus): number => s.current_count_change,
    },
  },

  // ── subscriptionmatchedstatus (ISubscriptionMatchedStatus §2.2.4.1) ─────
  subscriptionmatchedstatus: {
    totalcount: {
      get: (s: ISubscriptionMatchedStatus): number => s.total_count,
    },
    totalcountchange: {
      get: (s: ISubscriptionMatchedStatus): number => s.total_count_change,
    },
    lastpublicationhandle: {
      get: (s: ISubscriptionMatchedStatus): IInstanceHandle_t =>
        s.last_publication_handle,
    },
    currentcount: {
      get: (s: ISubscriptionMatchedStatus): number => s.current_count,
    },
    currentcountchange: {
      get: (s: ISubscriptionMatchedStatus): number => s.current_count_change,
    },
  },

  // ── listener (IListener §2.2.4.3) ───────────────────────────────────────
  listener: {
    // marker — no operations declared on the abstract root
    is: (_l: IListener): boolean => true,
  },

  // ── topiclistener (ITopicListener §2.2.4.3) ─────────────────────────────
  topiclistener: {
    oninconsistenttopic: {
      get: (
        l: ITopicListener,
        t: ITopic,
        s: IInconsistentTopicStatus
      ): void => l.on_inconsistent_topic(t, s),
    },
  },

  // ── datawriterlistener (IDataWriterListener §2.2.4.3) ───────────────────
  datawriterlistener: {
    onoffereddeadlinemissed: {
      get: (
        l: IDataWriterListener,
        w: IDataWriter,
        s: IOfferedDeadlineMissedStatus
      ): void => l.on_offered_deadline_missed(w, s),
    },
    onofferedincompatibleqos: {
      get: (
        l: IDataWriterListener,
        w: IDataWriter,
        s: IOfferedIncompatibleQosStatus
      ): void => l.on_offered_incompatible_qos(w, s),
    },
    onlivelinesslost: {
      get: (
        l: IDataWriterListener,
        w: IDataWriter,
        s: ILivelinessLostStatus
      ): void => l.on_liveliness_lost(w, s),
    },
    onpublicationmatched: {
      get: (
        l: IDataWriterListener,
        w: IDataWriter,
        s: IPublicationMatchedStatus
      ): void => l.on_publication_matched(w, s),
    },
  },

  // ── publisherlistener (IPublisherListener §2.2.4.3) ─────────────────────
  publisherlistener: {
    // inherits every DataWriterListener callback; surfaced for symmetry
    is: (_l: IPublisherListener): boolean => true,
  },

  // ── datareaderlistener (IDataReaderListener §2.2.4.3) ───────────────────
  datareaderlistener: {
    onrequesteddeadlinemissed: {
      get: (
        l: IDataReaderListener,
        r: IDataReader,
        s: IRequestedDeadlineMissedStatus
      ): void => l.on_requested_deadline_missed(r, s),
    },
    onrequestedincompatibleqos: {
      get: (
        l: IDataReaderListener,
        r: IDataReader,
        s: IRequestedIncompatibleQosStatus
      ): void => l.on_requested_incompatible_qos(r, s),
    },
    onsamplerejected: {
      get: (
        l: IDataReaderListener,
        r: IDataReader,
        s: ISampleRejectedStatus
      ): void => l.on_sample_rejected(r, s),
    },
    onlivelinesschanged: {
      get: (
        l: IDataReaderListener,
        r: IDataReader,
        s: ILivelinessChangedStatus
      ): void => l.on_liveliness_changed(r, s),
    },
    ondataavailable: {
      get: (l: IDataReaderListener, r: IDataReader): void =>
        l.on_data_available(r),
    },
    onsubscriptionmatched: {
      get: (
        l: IDataReaderListener,
        r: IDataReader,
        s: ISubscriptionMatchedStatus
      ): void => l.on_subscription_matched(r, s),
    },
    onsamplelost: {
      get: (
        l: IDataReaderListener,
        r: IDataReader,
        s: ISampleLostStatus
      ): void => l.on_sample_lost(r, s),
    },
  },

  // ── subscriberlistener (ISubscriberListener §2.2.4.3) ───────────────────
  subscriberlistener: {
    ondataonreaders: {
      get: (l: ISubscriberListener, s: ISubscriber): void =>
        l.on_data_on_readers(s),
    },
  },

  // ── domainparticipantlistener (IDomainParticipantListener §2.2.4.3) ─────
  domainparticipantlistener: {
    // multi-extends ITopicListener, IPublisherListener, ISubscriberListener;
    // surfaced as marker — every callback is reachable via the parent
    // listener accessors above
    is: (_l: IDomainParticipantListener): boolean => true,
  },

  // ── participantbuiltintopicdata (IParticipantBuiltinTopicData §2.2.5) ───
  participantbuiltintopicdata: {
    key: {
      get: (d: IParticipantBuiltinTopicData): IBuiltinTopicKey_t => d.key,
    },
    userdata: {
      get: (d: IParticipantBuiltinTopicData): IUserDataQosPolicy =>
        d.user_data,
    },
  },

  // ── topicbuiltintopicdata (ITopicBuiltinTopicData §2.2.5) ───────────────
  topicbuiltintopicdata: {
    key: {
      get: (d: ITopicBuiltinTopicData): IBuiltinTopicKey_t => d.key,
    },
    name: {
      get: (d: ITopicBuiltinTopicData): string => d.name,
    },
    typename: {
      get: (d: ITopicBuiltinTopicData): string => d.type_name,
    },
    durability: {
      get: (d: ITopicBuiltinTopicData): IDurabilityQosPolicy => d.durability,
    },
    durabilityservice: {
      get: (d: ITopicBuiltinTopicData): IDurabilityServiceQosPolicy =>
        d.durability_service,
    },
    deadline: {
      get: (d: ITopicBuiltinTopicData): IDeadlineQosPolicy => d.deadline,
    },
    latencybudget: {
      get: (d: ITopicBuiltinTopicData): ILatencyBudgetQosPolicy =>
        d.latency_budget,
    },
    liveliness: {
      get: (d: ITopicBuiltinTopicData): ILivelinessQosPolicy => d.liveliness,
    },
    reliability: {
      get: (d: ITopicBuiltinTopicData): IReliabilityQosPolicy => d.reliability,
    },
    transportpriority: {
      get: (d: ITopicBuiltinTopicData): ITransportPriorityQosPolicy =>
        d.transport_priority,
    },
    lifespan: {
      get: (d: ITopicBuiltinTopicData): ILifespanQosPolicy => d.lifespan,
    },
    destinationorder: {
      get: (d: ITopicBuiltinTopicData): IDestinationOrderQosPolicy =>
        d.destination_order,
    },
    history: {
      get: (d: ITopicBuiltinTopicData): IHistoryQosPolicy => d.history,
    },
    resourcelimits: {
      get: (d: ITopicBuiltinTopicData): IResourceLimitsQosPolicy =>
        d.resource_limits,
    },
    ownership: {
      get: (d: ITopicBuiltinTopicData): IOwnershipQosPolicy => d.ownership,
    },
    topicdata: {
      get: (d: ITopicBuiltinTopicData): ITopicDataQosPolicy => d.topic_data,
    },
  },

  // ── publicationbuiltintopicdata (IPublicationBuiltinTopicData §2.2.5) ───
  publicationbuiltintopicdata: {
    key: {
      get: (d: IPublicationBuiltinTopicData): IBuiltinTopicKey_t => d.key,
    },
    participantkey: {
      get: (d: IPublicationBuiltinTopicData): IBuiltinTopicKey_t =>
        d.participant_key,
    },
    topicname: {
      get: (d: IPublicationBuiltinTopicData): string => d.topic_name,
    },
    typename: {
      get: (d: IPublicationBuiltinTopicData): string => d.type_name,
    },
    durability: {
      get: (d: IPublicationBuiltinTopicData): IDurabilityQosPolicy =>
        d.durability,
    },
    durabilityservice: {
      get: (d: IPublicationBuiltinTopicData): IDurabilityServiceQosPolicy =>
        d.durability_service,
    },
    deadline: {
      get: (d: IPublicationBuiltinTopicData): IDeadlineQosPolicy => d.deadline,
    },
    latencybudget: {
      get: (d: IPublicationBuiltinTopicData): ILatencyBudgetQosPolicy =>
        d.latency_budget,
    },
    liveliness: {
      get: (d: IPublicationBuiltinTopicData): ILivelinessQosPolicy =>
        d.liveliness,
    },
    reliability: {
      get: (d: IPublicationBuiltinTopicData): IReliabilityQosPolicy =>
        d.reliability,
    },
    lifespan: {
      get: (d: IPublicationBuiltinTopicData): ILifespanQosPolicy => d.lifespan,
    },
    userdata: {
      get: (d: IPublicationBuiltinTopicData): IUserDataQosPolicy =>
        d.user_data,
    },
    ownership: {
      get: (d: IPublicationBuiltinTopicData): IOwnershipQosPolicy =>
        d.ownership,
    },
    ownershipstrength: {
      get: (d: IPublicationBuiltinTopicData): IOwnershipStrengthQosPolicy =>
        d.ownership_strength,
    },
    destinationorder: {
      get: (d: IPublicationBuiltinTopicData): IDestinationOrderQosPolicy =>
        d.destination_order,
    },
    presentation: {
      get: (d: IPublicationBuiltinTopicData): IPresentationQosPolicy =>
        d.presentation,
    },
    partition: {
      get: (d: IPublicationBuiltinTopicData): IPartitionQosPolicy =>
        d.partition,
    },
    topicdata: {
      get: (d: IPublicationBuiltinTopicData): ITopicDataQosPolicy =>
        d.topic_data,
    },
    groupdata: {
      get: (d: IPublicationBuiltinTopicData): IGroupDataQosPolicy =>
        d.group_data,
    },
  },

  // ── subscriptionbuiltintopicdata (ISubscriptionBuiltinTopicData §2.2.5) ─
  subscriptionbuiltintopicdata: {
    key: {
      get: (d: ISubscriptionBuiltinTopicData): IBuiltinTopicKey_t => d.key,
    },
    participantkey: {
      get: (d: ISubscriptionBuiltinTopicData): IBuiltinTopicKey_t =>
        d.participant_key,
    },
    topicname: {
      get: (d: ISubscriptionBuiltinTopicData): string => d.topic_name,
    },
    typename: {
      get: (d: ISubscriptionBuiltinTopicData): string => d.type_name,
    },
    durability: {
      get: (d: ISubscriptionBuiltinTopicData): IDurabilityQosPolicy =>
        d.durability,
    },
    deadline: {
      get: (d: ISubscriptionBuiltinTopicData): IDeadlineQosPolicy => d.deadline,
    },
    latencybudget: {
      get: (d: ISubscriptionBuiltinTopicData): ILatencyBudgetQosPolicy =>
        d.latency_budget,
    },
    liveliness: {
      get: (d: ISubscriptionBuiltinTopicData): ILivelinessQosPolicy =>
        d.liveliness,
    },
    reliability: {
      get: (d: ISubscriptionBuiltinTopicData): IReliabilityQosPolicy =>
        d.reliability,
    },
    ownership: {
      get: (d: ISubscriptionBuiltinTopicData): IOwnershipQosPolicy =>
        d.ownership,
    },
    destinationorder: {
      get: (d: ISubscriptionBuiltinTopicData): IDestinationOrderQosPolicy =>
        d.destination_order,
    },
    userdata: {
      get: (d: ISubscriptionBuiltinTopicData): IUserDataQosPolicy =>
        d.user_data,
    },
    timebasedfilter: {
      get: (d: ISubscriptionBuiltinTopicData): ITimeBasedFilterQosPolicy =>
        d.time_based_filter,
    },
    presentation: {
      get: (d: ISubscriptionBuiltinTopicData): IPresentationQosPolicy =>
        d.presentation,
    },
    partition: {
      get: (d: ISubscriptionBuiltinTopicData): IPartitionQosPolicy =>
        d.partition,
    },
    topicdata: {
      get: (d: ISubscriptionBuiltinTopicData): ITopicDataQosPolicy =>
        d.topic_data,
    },
    groupdata: {
      get: (d: ISubscriptionBuiltinTopicData): IGroupDataQosPolicy =>
        d.group_data,
    },
  },

  // ── DLRL — dds_dlrl.idl ──────────────────────────────────────────────────

  // ── dlrloid (IDLRLOid) ───────────────────────────────────────────────────
  dlrloid: {
    value: {
      get: (o: IDLRLOid): readonly [number, number, number] => o.value,
    },
  },

  // ── dlrloidgenerator (IDLRLOidGenerator) ────────────────────────────────
  dlrloidgenerator: {
    generate: {
      get: (g: IDLRLOidGenerator): IDLRLOid => g.generate_oid(),
    },
  },

  // ── relationdescription (IRelationDescription) ──────────────────────────
  relationdescription: {
    kind: {
      get: (r: IRelationDescription): string => r.kind,
    },
    name: {
      get: (r: IRelationDescription): string => r.name,
    },
  },

  // ── listrelationdescription (IListRelationDescription) ──────────────────
  listrelationdescription: {
    index: {
      get: (r: IListRelationDescription): number => r.index,
    },
  },

  // ── intmaprelationdescription (IIntMapRelationDescription) ──────────────
  intmaprelationdescription: {
    key: {
      get: (r: IIntMapRelationDescription): number => r.key,
    },
  },

  // ── strmaprelationdescription (IStrMapRelationDescription) ──────────────
  strmaprelationdescription: {
    key: {
      get: (r: IStrMapRelationDescription): string => r.key,
    },
  },

  // ── objectlistener (IObjectListener) ────────────────────────────────────
  objectlistener: {
    onobjectcreated: {
      check: (l: IObjectListener, o: IObjectRoot): boolean =>
        l.on_object_created(o),
    },
    onobjectdeleted: {
      check: (l: IObjectListener, o: IObjectRoot): boolean =>
        l.on_object_deleted(o),
    },
  },

  // ── selectionlistener (ISelectionListener) ──────────────────────────────
  selectionlistener: {
    onobjectout: {
      get: (l: ISelectionListener, o: IObjectRoot): void =>
        l.on_object_out(o),
    },
  },

  // ── cachelistener (ICacheListener) ──────────────────────────────────────
  cachelistener: {
    onbeginupdates: {
      get: (l: ICacheListener): void => l.on_begin_updates(),
    },
    onendupdates: {
      get: (l: ICacheListener): void => l.on_end_updates(),
    },
    onupdatesenabled: {
      get: (l: ICacheListener): void => l.on_updates_enabled(),
    },
    onupdatesdisabled: {
      get: (l: ICacheListener): void => l.on_updates_disabled(),
    },
  },

  // ── contract (IContract) ────────────────────────────────────────────────
  contract: {
    depth: {
      get: (c: IContract): number => c.depth,
    },
    scope: {
      get: (c: IContract): string => c.scope,
    },
    contractedobject: {
      get: (c: IContract): IObjectRoot => c.contracted_object,
    },
  },

  // ── selectioncriterion (ISelectionCriterion) ────────────────────────────
  selectioncriterion: {
    kind: {
      get: (c: ISelectionCriterion): string => c.kind,
    },
  },

  // ── filtercriterion (IFilterCriterion) ──────────────────────────────────
  filtercriterion: {
    // marker — kind hard-bound to FILTER on the concrete class
    is: (_c: IFilterCriterion): boolean => true,
  },

  // ── querycriterion (IQueryCriterion) ────────────────────────────────────
  querycriterion: {
    expression: {
      get: (q: IQueryCriterion): string => q.expression,
    },
    parameters: {
      get: (q: IQueryCriterion): ReadonlyArray<string> => q.parameters,
    },
  },

  // ── objectroot (IObjectRoot) ────────────────────────────────────────────
  objectroot: {
    oid: {
      get: (o: IObjectRoot): IDLRLOid => o.oid,
    },
    readstate: {
      get: (o: IObjectRoot): string => o.read_state,
    },
    writestate: {
      get: (o: IObjectRoot): string => o.write_state,
    },
    objecthome: {
      get: (o: IObjectRoot): IObjectHome => o.object_home,
    },
    classname: {
      get: (o: IObjectRoot): string => o.class_name,
    },
    owner: {
      get: (o: IObjectRoot): ICacheBase => o.owner,
    },
    ismodified: {
      check: (o: IObjectRoot, scope: string): boolean =>
        o.is_modified(scope as never),
    },
    whichcontainedmodified: {
      get: (o: IObjectRoot): ReadonlyArray<IRelationDescription> =>
        o.which_contained_modified(),
    },
  },

  // ── objecthome (IObjectHome) ────────────────────────────────────────────
  objecthome: {
    name: {
      get: (h: IObjectHome): string => h.name,
    },
    contentfilter: {
      get: (h: IObjectHome): string => h.content_filter,
    },
    parent: {
      get: (h: IObjectHome): IObjectHome | undefined => h.parent,
    },
    children: {
      get: (h: IObjectHome): ReadonlyArray<IObjectHome> => h.children,
    },
    registrationindex: {
      get: (h: IObjectHome): number => h.registration_index,
    },
    autoderef: {
      is: (h: IObjectHome): boolean => h.auto_deref,
    },
    alltopicnames: {
      get: (h: IObjectHome): ReadonlyArray<string> => h.get_all_topic_names(),
    },
  },

  // ── selection (ISelection) ──────────────────────────────────────────────
  selection: {
    autorefresh: {
      is: (s: ISelection): boolean => s.auto_refresh,
    },
    concernscontained: {
      is: (s: ISelection): boolean => s.concerns_contained,
    },
  },

  // ── collection (ICollection) ────────────────────────────────────────────
  collection: {
    length: {
      get: (c: ICollection): number => c.length,
    },
  },

  // ── list (IList) ─────────────────────────────────────────────────────────
  list: {
    length: {
      get: (l: IList): number => l.length,
    },
    addedelements: {
      get: (l: IList): ReadonlyArray<number> => l.added_elements(),
    },
    removedelements: {
      get: (l: IList): ReadonlyArray<number> => l.removed_elements(),
    },
    modifiedelements: {
      get: (l: IList): ReadonlyArray<number> => l.modified_elements(),
    },
  },

  // ── set (ISet) ───────────────────────────────────────────────────────────
  set: {
    length: {
      get: (s: ISet): number => s.length,
    },
  },

  // ── strmap (IStrMap) ─────────────────────────────────────────────────────
  strmap: {
    length: {
      get: (m: IStrMap): number => m.length,
    },
    keys: {
      get: (m: IStrMap): ReadonlyArray<string> => m.keys,
    },
    addedelements: {
      get: (m: IStrMap): ReadonlyArray<string> => m.added_elements(),
    },
    removedelements: {
      get: (m: IStrMap): ReadonlyArray<string> => m.removed_elements(),
    },
    modifiedelements: {
      get: (m: IStrMap): ReadonlyArray<string> => m.modified_elements(),
    },
  },

  // ── intmap (IIntMap) ─────────────────────────────────────────────────────
  intmap: {
    length: {
      get: (m: IIntMap): number => m.length,
    },
    keys: {
      get: (m: IIntMap): ReadonlyArray<number> => m.keys,
    },
    addedelements: {
      get: (m: IIntMap): ReadonlyArray<number> => m.added_elements(),
    },
    removedelements: {
      get: (m: IIntMap): ReadonlyArray<number> => m.removed_elements(),
    },
    modifiedelements: {
      get: (m: IIntMap): ReadonlyArray<number> => m.modified_elements(),
    },
  },

  // ── cachebase (ICacheBase) ──────────────────────────────────────────────
  cachebase: {
    cacheusage: {
      get: (c: ICacheBase): string => c.cache_usage,
    },
    objects: {
      get: (c: ICacheBase): ReadonlyArray<IObjectRoot> => c.objects,
    },
    kind: {
      get: (c: ICacheBase): string => c.kind,
    },
  },

  // ── cacheaccess (ICacheAccess) ──────────────────────────────────────────
  cacheaccess: {
    owner: {
      get: (a: ICacheAccess): ICache => a.owner,
    },
    contracts: {
      get: (a: ICacheAccess): ReadonlyArray<IContract> => a.contracts,
    },
    typenames: {
      get: (a: ICacheAccess): ReadonlyArray<string> => a.type_names,
    },
  },

  // ── cache (ICache) ───────────────────────────────────────────────────────
  cache: {
    pubsubstate: {
      get: (c: ICache): string => c.pubsub_state,
    },
    publisher: {
      get: (c: ICache): IPublisher | undefined => c.the_publisher,
    },
    subscriber: {
      get: (c: ICache): ISubscriber | undefined => c.the_subscriber,
    },
    updatesenabled: {
      is: (c: ICache): boolean => c.updates_enabled,
    },
    homes: {
      get: (c: ICache): ReadonlyArray<IObjectHome> => c.homes,
    },
    subaccesses: {
      get: (c: ICache): ReadonlyArray<ICacheAccess> => c.sub_accesses,
    },
    listeners: {
      get: (c: ICache): ReadonlyArray<ICacheListener> => c.listeners,
    },
  },

  // ── cachedescription (ICacheDescription) ────────────────────────────────
  cachedescription: {
    name: {
      get: (d: ICacheDescription): string => d.name,
    },
    domain: {
      get: (d: ICacheDescription): IDomainParticipant => d.domain,
    },
  },

  // ── cachefactory (ICacheFactory) ────────────────────────────────────────
  cachefactory: {
    findcachebyname: {
      get: (f: ICacheFactory, name: string): ICache | undefined =>
        f.find_cache_by_name(name),
    },
  },

} as const

// ─── Named re-exports — concrete classes (tree-shakeable) ────────────────────
export {
  // ── DCPS Infrastructure ──
  DomainParticipantFactory,
  DomainParticipant,
  Topic,
  ContentFilteredTopic,
  MultiTopic,
  Publisher,
  Subscriber,
  // ── Communication primitives ──
  Duration_t,
  Time_t,
  InstanceHandle_t,
  BuiltinTopicKey_t,
  Condition,
  GuardCondition,
  StatusCondition,
  ReadCondition,
  QueryCondition,
  WaitSet,
  SampleInfo,
  DataSample,
  DataWriter,
  DataReader,
  // ── QoS policies ──
  UserDataQosPolicy,
  TopicDataQosPolicy,
  GroupDataQosPolicy,
  TransportPriorityQosPolicy,
  LifespanQosPolicy,
  DurabilityQosPolicy,
  PresentationQosPolicy,
  DeadlineQosPolicy,
  LatencyBudgetQosPolicy,
  OwnershipQosPolicy,
  OwnershipStrengthQosPolicy,
  LivelinessQosPolicy,
  TimeBasedFilterQosPolicy,
  PartitionQosPolicy,
  ReliabilityQosPolicy,
  DestinationOrderQosPolicy,
  HistoryQosPolicy,
  ResourceLimitsQosPolicy,
  EntityFactoryQosPolicy,
  WriterDataLifecycleQosPolicy,
  ReaderDataLifecycleQosPolicy,
  DurabilityServiceQosPolicy,
  DomainParticipantFactoryQos,
  DomainParticipantQos,
  TopicQos,
  PublisherQos,
  SubscriberQos,
  DataWriterQos,
  DataReaderQos,
  // ── Listeners + Status structures ──
  QosPolicyCount,
  InconsistentTopicStatus,
  SampleLostStatus,
  SampleRejectedStatus,
  LivelinessLostStatus,
  LivelinessChangedStatus,
  OfferedDeadlineMissedStatus,
  RequestedDeadlineMissedStatus,
  OfferedIncompatibleQosStatus,
  RequestedIncompatibleQosStatus,
  PublicationMatchedStatus,
  SubscriptionMatchedStatus,
  TopicListener,
  DataWriterListener,
  PublisherListener,
  DataReaderListener,
  SubscriberListener,
  DomainParticipantListener,
  // ── BuiltinTopicData ──
  ParticipantBuiltinTopicData,
  TopicBuiltinTopicData,
  PublicationBuiltinTopicData,
  SubscriptionBuiltinTopicData,
  // ── DLRL ──
  DLRLOid,
  DLRLOidGenerator,
  RelationDescription,
  ListRelationDescription,
  IntMapRelationDescription,
  StrMapRelationDescription,
  ObjectListener,
  SelectionListener,
  CacheListener,
  Contract,
  FilterCriterion,
  QueryCriterion,
  Selection,
  CacheAccess,
  Cache,
  CacheDescription,
  CacheFactory,
} from './dds.js'

// ─── Const-object kind exports + literal-union types (tree-shakeable) ────────
export {
  STATUS_KIND,
  SAMPLE_STATE_KIND,
  VIEW_STATE_KIND,
  INSTANCE_STATE_KIND,
  RETURN_CODE,
  QOS_POLICY_ID,
  DURABILITY_QOS_POLICY_KIND,
  PRESENTATION_QOS_POLICY_ACCESS_SCOPE_KIND,
  OWNERSHIP_QOS_POLICY_KIND,
  LIVELINESS_QOS_POLICY_KIND,
  RELIABILITY_QOS_POLICY_KIND,
  DESTINATION_ORDER_QOS_POLICY_KIND,
  HISTORY_QOS_POLICY_KIND,
  SAMPLE_REJECTED_STATUS_KIND,
  // DLRL kinds
  REFERENCE_SCOPE,
  OBJECT_SCOPE,
  DCPS_STATE,
  CACHE_USAGE,
  OBJECT_STATE,
  RELATION_KIND,
  CRITERION_KIND,
  MEMBERSHIP_STATE,
  CACHE_KIND,
  // Pre-defined sentinel constants
  DURATION_INFINITE,
  DURATION_ZERO,
  TIME_INVALID,
  HANDLE_NIL,
  ANY_SAMPLE_STATE,
  ANY_VIEW_STATE,
  ANY_INSTANCE_STATE,
  NOT_ALIVE_INSTANCE_STATE,
  LENGTH_UNLIMITED,
  UNLIMITED_RELATED_OBJECTS,
} from './dds.js'

// ─── Interface type re-exports (extendable contracts) ────────────────────────
export type {
  // ── DCPS Infrastructure ──
  IEntity,
  IDomainEntity,
  ITypeSupport,
  IDomainParticipantFactory,
  IDomainParticipant,
  ITopicDescription,
  ITopic,
  IContentFilteredTopic,
  IMultiTopic,
  IPublisher,
  ISubscriber,
  // ── Communication primitives ──
  IDuration_t,
  ITime_t,
  IInstanceHandle_t,
  IBuiltinTopicKey_t,
  ICondition,
  IGuardCondition,
  IStatusCondition,
  IReadCondition,
  IQueryCondition,
  IWaitSet,
  ISampleInfo,
  IDataSample,
  IDataWriter,
  IDataReader,
  // ── QoS policies ──
  IQosPolicy,
  IUserDataQosPolicy,
  ITopicDataQosPolicy,
  IGroupDataQosPolicy,
  ITransportPriorityQosPolicy,
  ILifespanQosPolicy,
  IDurabilityQosPolicy,
  IPresentationQosPolicy,
  IDeadlineQosPolicy,
  ILatencyBudgetQosPolicy,
  IOwnershipQosPolicy,
  IOwnershipStrengthQosPolicy,
  ILivelinessQosPolicy,
  ITimeBasedFilterQosPolicy,
  IPartitionQosPolicy,
  IReliabilityQosPolicy,
  IDestinationOrderQosPolicy,
  IHistoryQosPolicy,
  IResourceLimitsQosPolicy,
  IEntityFactoryQosPolicy,
  IWriterDataLifecycleQosPolicy,
  IReaderDataLifecycleQosPolicy,
  IDurabilityServiceQosPolicy,
  IDomainParticipantFactoryQos,
  IDomainParticipantQos,
  ITopicQos,
  IPublisherQos,
  ISubscriberQos,
  IDataWriterQos,
  IDataReaderQos,
  // ── Listeners + Status structures ──
  IQosPolicyCount,
  IStatus,
  IInconsistentTopicStatus,
  ISampleLostStatus,
  ISampleRejectedStatus,
  ILivelinessLostStatus,
  ILivelinessChangedStatus,
  IOfferedDeadlineMissedStatus,
  IRequestedDeadlineMissedStatus,
  IOfferedIncompatibleQosStatus,
  IRequestedIncompatibleQosStatus,
  IPublicationMatchedStatus,
  ISubscriptionMatchedStatus,
  IListener,
  ITopicListener,
  IDataWriterListener,
  IPublisherListener,
  IDataReaderListener,
  ISubscriberListener,
  IDomainParticipantListener,
  // ── BuiltinTopicData ──
  IParticipantBuiltinTopicData,
  ITopicBuiltinTopicData,
  IPublicationBuiltinTopicData,
  ISubscriptionBuiltinTopicData,
  // ── DLRL ──
  IDLRLOid,
  IDLRLOidGenerator,
  IRelationDescription,
  IListRelationDescription,
  IIntMapRelationDescription,
  IStrMapRelationDescription,
  IObjectListener,
  ISelectionListener,
  ICacheListener,
  IContract,
  ISelectionCriterion,
  IFilterCriterion,
  IQueryCriterion,
  IObjectRoot,
  IObjectHome,
  ISelection,
  ICollection,
  IList,
  ISet,
  IStrMap,
  IIntMap,
  ICacheBase,
  ICacheAccess,
  ICache,
  ICacheDescription,
  ICacheFactory,
} from './dds.js'

// ─── Bit-mask alias type re-exports ──────────────────────────────────────────
export type {
  StatusKind,
  SampleStateKind,
  ViewStateKind,
  InstanceStateKind,
  SampleStateMask,
  ViewStateMask,
  InstanceStateMask,
  ReturnCode_t,
  QosPolicyId_t,
  DurabilityQosPolicyKind,
  PresentationQosPolicyAccessScopeKind,
  OwnershipQosPolicyKind,
  LivelinessQosPolicyKind,
  ReliabilityQosPolicyKind,
  DestinationOrderQosPolicyKind,
  HistoryQosPolicyKind,
  SampleRejectedStatusKind,
  // DLRL kinds
  ReferenceScope,
  ObjectScope,
  DCPSState,
  CacheUsage,
  ObjectState,
  RelationKind,
  CriterionKind,
  MembershipState,
  CacheKindLiteral,
} from './dds.js'
