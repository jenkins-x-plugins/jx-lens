import { Renderer } from "@k8slens/extensions";
import { Repository } from "./repository";

export class RepositoriesApi extends Renderer.K8sApi.KubeApi<Repository> {
}
export const repositoriesApi = new RepositoriesApi({
  objectConstructor: Repository,
});

export class RepositoriesStore extends Renderer.K8sApi.KubeObjectStore<Repository> {
  api = repositoriesApi;
}

export const repositoriesStore = new RepositoriesStore();
Renderer.K8sApi.apiManager.registerStore(repositoriesStore);
