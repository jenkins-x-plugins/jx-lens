import { Renderer } from "@k8slens/extensions";
import moment from "moment";

export class Activity extends Renderer.K8sApi.KubeObject {
  static kind = "PipelineActivity";
  static namespaced = true;
  static apiBase = "/apis/jenkins.io/v1/pipelineactivities";

  kind: string;
  apiVersion: string;
  metadata: {
    name: string;
    namespace: string;
    selfLink: string;
    uid: string;
    resourceVersion: string;
    creationTimestamp: string;
    labels: {
      [key: string]: string;
    };
    annotations: {
      [key: string]: string;
    };
  };
  spec: {
    build: string;
    context: string;
    gitBranch: string;
    gitOwner: string;
    gitRepository: string;
    gitUrl: string;
    lastCommitSHA: string;
    releaseNotesURL: string;
    status: string;
    version: string;
    creationTimestamp: string;
    completedTimestamp: string;
    steps: ActivityStep[];
  };

  get buildName(): string {
    const build = this.spec.build;
    const context = this.spec.context;

    if (build && context) {
      return `#${build} ${context}`;
    }

    return build || context || "";
  }

  get createdAt(): string {
    return dateFromNow(this.metadata.creationTimestamp);
  }

  get pipelineDescription(): string {
    const s = this.spec;

    if (!s) {
      return "";
    }

    return `${s.gitOwner}/${s.gitRepository}/${s.gitBranch} ${this.buildName}`;
  }

  get createdTime(): any {
    return createdTime(this.metadata.creationTimestamp);
  }
}

export function createdTime(timestamp: string | undefined) {
  if (timestamp) {
    return moment(timestamp);
  }

  return null;
}

export function dateFromNow(timestamp: string | undefined): string {
  if (timestamp) {
    return moment(timestamp).fromNow(false);
  }

  return "";
}


export class ActivityStep {
  kind: string;
  stage: StageActivityStep;
  preview: PreviewActivityStep;
  promote: PromoteActivityStep;
}

export class CoreActivityStep {
  name: string;
  description: string;
  status: string;
  startedTimestamp: string;
  completedTimestamp: string;
}

export class StageActivityStep extends CoreActivityStep {
  kind: string;
  steps: CoreActivityStep[];
}

export class PreviewActivityStep extends CoreActivityStep {
  environment: string;
  pullRequestURL: string;
  applicationURL: string;
}

export class PromoteActivityStep extends CoreActivityStep {
  environment: string;
  pullRequest: PromotePullRequestStep;
  update: PromoteUpdateStep;
  applicationURL: string;
}

export class PromotePullRequestStep extends CoreActivityStep {
  pullRequestURL: string;
  mergeCommitSHA: string;
}

export class PromoteUpdateStep extends CoreActivityStep {
  statuses: GitStatus[];
}

export class GitStatus {
  url: string;
  status: string;
}

