

export class Meta {
  name: string;
  description: string;
  created?: string ;
  createdBy?: string;
  lastModified?: string;
  lastModifiedBy?: string;
  label: Label[];

  constructor(name = '') {
    this.name = name;
    this.description = '';
    this.createdBy = '';
    this.created = '';
    this.lastModifiedBy = '';
    this.lastModified = '';
    this.label = [];
  }
}

export class Label {
  key?: string;
  value?: string;
}

export class Entity {
  id: string;
  meta: Meta;

  constructor(name = '') {
    this.id = '';
    this.meta = new Meta(name);
  }
}

export class Scope {
  surtPrefix: string;

  constructor() {
    this.surtPrefix = '';
  }
}

export class Seed {
  id: string;
  meta: Meta;
  entityId: string;
  scope: Scope;
  jobId: string[];
  disabled: boolean;

  constructor(entityId: string) {
    this.id = '';
    this.entityId = entityId;
    this.scope = new Scope();
    this.meta = new Meta();
    this.jobId = [];
    this.disabled = false;
  }
}

export class CrawlLimitsConfig {
  depth: number;
  maxDurationS: string; // int64
  maxBytes: string; // int64
}

export class CrawlJob {
  id: string;
  meta: Meta;
  scheduleId?: string;
  limits: CrawlLimitsConfig;
  crawlConfigId?: string;
  disabled?: boolean;

  constructor() {
    this.id = '';
    this.meta = new Meta();
    this.limits = new CrawlLimitsConfig();
    this.scheduleId = '';
    this.crawlConfigId = '';
  }
}

export enum Role {
  // Any authenticated user
  ANY_USER = 0,
  // Any user including unauthenticated users
  ANY = 1,
  // Administrator
  ADMIN = 2,
  // Curator
  CURATOR = 3,
  // A user with permission to read internal data
  READONLY = 4,
  // A crawl operator
  OPERATOR = 5,
  // Machine to machine
  SYSTEM = 6,
}
