export interface Reply<T> {
  value: T;
}

export interface MaalfridReply {
  value: any[];
  count: string;
}


export interface ExtractedText {
  warcId: string;
  text?: string;
  sentenceCount: number;
  wordCount: number;
  longWordCount: number;
  characterCount: number;
  lix: number;
  language: string;
}


export interface CrawlLog {
  executionId: string;
  contentType: string;
  discoveryPath: string;
  recordType: string;
  requestedUri: string;
  referrer?: string;
  size: number;
  warcRefersTo?: string;
  timeStamp?: string;
  collectionFinalName?: string;
}


export enum ExecutionState {
  UNDEFINED = 'UNDEFINED',
  CREATED = 'CREATED',
  FETCHING = 'FETCHING',
  SLEEPING = 'SLEEPING',
  FINISHED = 'FINISHED',
  ABORTED_TIMEOUT = 'ABORTED_TIMEOUT',
  ABORTED_SIZE = 'ABORTED_TIMEOUT',
  ABORTED_MANUAL = 'ABORTED_TIMEOUT',
  FAILED = 'FAILED',
  DIED = 'DIED',
}

export enum JobExecutionState {
  UNDEFINED = 'UNDEFINED',
  CREATED = 'CREATED',
  RUNNING = 'RUNNING',
  FINISHED = 'FINISHED',
  ABORTED_MANUAL = 'ABORTED_MANUAL',
  FAILED = 'FAILED',
  DIED = 'DIED',
}

export interface Execution {
  startTime?: number | string;
  endTime?: number | string;

  jobExecutionId: string;
  jobId?: string;
  seedId: string;
  executionId: string;
  state?: ExecutionState;
}

export interface AggregateText extends ExtractedText, CrawlLog, Execution {}

export interface FilterSet {
  id?: string;
  seedId?: string;
  validFrom?: string;
  validTo?: string;
  filters: Filter[];
}

export interface Filter {
  name: string;
  value: any;
  exclusive?: boolean;
  field?: string;
}

export interface LanguageComposition {
  nbPercentage: number;
  nnPercentage: number;
}

export interface TextCount {
  nbPercentage: number;
  nnPercentage: number;
  nbShortCount: number;
  nbLongCount: number;
  nnShortCount: number;
  nnLongCount: number;
}

export interface SeedStatistic {
  id: string;
  uri: string;
  primary: boolean;
  nbPercentage: number;
  nnPercentage: number;
}
