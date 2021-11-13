import { Renderer } from "@k8slens/extensions";
import { dateFromNow } from "./activity";

export class Breakpoint extends Renderer.K8sApi.KubeObject {
  static kind = "LighthouseBreakpoint";
  static namespaced = true;
  static apiBase = "/apis/lighthouse.jenkins.io/v1alpha1/lighthousebreakpoints";

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
    filter: BreakpointFilter;
    debug: BreakpointDebug;
  };

  get createdAt(): string {
    return dateFromNow(this.metadata.creationTimestamp);
  }

  get createdTime(): any {
    return this.createdTime(this.metadata.creationTimestamp);
  }
}


export class BreakpointFilter {
  owner: string;
  repository: string;
  branch: string;
  context: string;
}

export class BreakpointDebug {
  breakpoint: string[];
}


// BreakpointFilterMatches returns true if this filter matches the given filter
export function BreakpointFilterMatches(a: BreakpointFilter, b: BreakpointFilter): boolean {
  if (!a || !b) {
    return false;
  }

  if (a.owner && a.owner !== b.owner) {
    return false;
  }

  if (a.repository && a.repository !== b.repository) {
    return false;
  }

  if (a.branch && a.branch !== b.branch) {
    return false;
  }

  if (a.context && a.context !== b.context) {
    return false;
  }

  return true;
}
