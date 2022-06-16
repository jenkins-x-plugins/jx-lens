import { Renderer } from "@k8slens/extensions";
import { Activity } from "./activity";

export class ActivitiesApi extends Renderer.K8sApi.KubeApi<Activity> {
}
export const activitiesApi = new ActivitiesApi({
  objectConstructor: Activity,
});

export class ActivitiesStore extends Renderer.K8sApi.KubeObjectStore<Activity> {
  api = activitiesApi;
}

export const activitiesStore = new ActivitiesStore();
Renderer.K8sApi.apiManager.registerStore(activitiesStore);
