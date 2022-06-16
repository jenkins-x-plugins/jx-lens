import { Renderer } from "@k8slens/extensions";
import { Environment } from "./environment";

export class EnvironmentsApi extends Renderer.K8sApi.KubeApi<Environment> {
}
export const environmentsApi = new EnvironmentsApi({
  objectConstructor: Environment,
});

export class EnvironmentsStore extends Renderer.K8sApi.KubeObjectStore<Environment> {
  api = environmentsApi;
}

export const environmentsStore = new EnvironmentsStore();
Renderer.K8sApi.apiManager.registerStore(environmentsStore);
