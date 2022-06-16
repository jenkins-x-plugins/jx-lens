import { Renderer } from "@k8slens/extensions";
import { dateFromNow } from "./activity";

export class Repository extends Renderer.K8sApi.KubeObject {
  static kind = "SourceRepository";
  static namespaced = true;
  static apiBase = "/apis/jenkins.io/v1/sourcerepositories";

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
    httpCloneURL: string;
    org: string;
    provider: string;
    providerKind: string;
    providerName: string;
    repo: string;
    url: string;
  };

  get createdAt(): string {
    return dateFromNow(this.metadata.creationTimestamp);
  }

  get createdTime(): any {
    return this.createdTime(this.metadata.creationTimestamp);
  }
}
