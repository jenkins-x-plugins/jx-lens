import { Renderer } from "@k8slens/extensions";
import { dateFromNow } from "./activity";

export class Environment extends Renderer.K8sApi.KubeObject {
  static kind = "Environment";
  static namespaced = true;
  static apiBase = "/apis/jenkins.io/v1/environments";

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
    kind: string;
    label: string;
    namespace: string;
    order: number;
    promotionStrategy: string;
    remoteCluster: boolean;
    source: EnvironmentSource;
  };

  get sourceUrl(): string {
    if (!this.spec || !this.spec.source) {
      return "";
    }

    return this.spec.source.url || "";
  }

  get createdAt(): string {
    return dateFromNow(this.metadata.creationTimestamp);
  }

  get createdTime(): any {
    return this.createdTime(this.metadata.creationTimestamp);
  }
}

export class EnvironmentSource {
  ref: string;
  url: string;
}

