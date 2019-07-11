

export class Meta {
  name: string;
  description: string;
  created?: string ;
  created_by?: string;
  last_modified?: string;
  last_modified_by?: string;
  label: Label[];

  constructor(name = '') {
    this.name = name;
    this.description = '';
    this.created_by = '';
    this.created = '';
    this.last_modified_by = '';
    this.last_modified = '';
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
  surt_prefix: string;

  constructor() {
    this.surt_prefix = '';
  }
}

export class Seed {
  id: string;
  meta: Meta;
  entity_id: string;
  scope: Scope;
  job_id: string[];
  disabled: boolean;

  constructor(entityId: string) {
    this.id = '';
    this.entity_id = entityId;
    this.scope = new Scope();
    this.meta = new Meta();
    this.job_id = [];
    this.disabled = false;
  }
}

export class CrawlLimitsConfig {
  depth: number;
  max_duration_s: string; // int64
  max_bytes: string; // int64
}

export class CrawlJob {
  id: string;
  meta: Meta;
  schedule_id?: string;
  limits: CrawlLimitsConfig;
  crawl_config_id?: string;
  disabled?: boolean;

  constructor() {
    this.id = '';
    this.meta = new Meta();
    this.limits = new CrawlLimitsConfig();
    this.schedule_id = '';
    this.crawl_config_id = '';
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
