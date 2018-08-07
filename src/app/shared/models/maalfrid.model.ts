export interface Reply {
  value: any;
}

export interface MaalfridReply {
  value: any[];
  count: string;
}


export interface ExtractedText {
  warcId: string;
  text: string;
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
  referrer: string;
  size: number;
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
  startTime: number;
  endTime: number;

  jobExecutionId: string;
  jobId: string;
  seedId: string;
  executionId: string;
  state: ExecutionState;
}

export interface AggregateText extends ExtractedText, CrawlLog, Execution {}

export interface Statistic {
  count: number;
  language: string;
  long: number;
  short: number;
}

export interface ExecutionStatistic {
  id: string;
  stats: Statistic[];
}
