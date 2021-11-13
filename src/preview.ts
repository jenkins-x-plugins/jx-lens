import { Renderer } from "@k8slens/extensions";
import { dateFromNow } from "./activity";

export class Preview extends Renderer.K8sApi.KubeObject {
  static kind = "Preview";
  static namespaced = true;
  static apiBase = "/apis/preview.jenkins.io/v1alpha1/previews";

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
    source: PreviewSource;
    pullRequest: PreviewPullRequest;
    resources: PreviewResources;
  };

  get createdAt(): string {
    return dateFromNow(this.metadata.creationTimestamp);
  }

  get createdTime(): any {
    return this.createdTime(this.metadata.creationTimestamp);
  }
}


export class PreviewResources {
  name: string;
  url: string;
  namespace: string;
}


export class PreviewSource {
  url: string;
  cloneURL: string;
  ref: string;
  path: string;
}

export class PreviewPullRequest {
  number: number;
  owner: string;
  repository: string;
  url: string;
  title: string;
  description: string;
  user: PreviewUser;
}

export class PreviewUser {
  name: string;
  username: string;
  imageUrl: string;
  linkUrl: string;
}
