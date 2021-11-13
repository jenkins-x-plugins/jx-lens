import { Renderer } from "@k8slens/extensions";
import { Preview } from "./preview";

export class PreviewsApi extends Renderer.K8sApi.KubeApi<Preview> {
}
export const previewsApi = new PreviewsApi({
  objectConstructor: Preview,
});

export class PreviewsStore extends Renderer.K8sApi.KubeObjectStore<Preview> {
  api = previewsApi;
}

export const previewsStore = new PreviewsStore();
Renderer.K8sApi.apiManager.registerStore(previewsStore);
