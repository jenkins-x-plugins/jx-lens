import { Renderer } from "@k8slens/extensions";
import { Breakpoint, BreakpointFilter, BreakpointFilterMatches } from "./breakpoint";

export class BreakpointsApi extends Renderer.K8sApi.KubeApi<Breakpoint> {
}
export const breakpointsApi = new BreakpointsApi({
  objectConstructor: Breakpoint,
});

export class BreakpointsStore extends Renderer.K8sApi.KubeObjectStore<Breakpoint> {
  api = breakpointsApi;

  getBreakpointForActivity(filter: BreakpointFilter): Breakpoint {
    return this.items.find(r => BreakpointFilterMatches(filter, r.spec.filter));
  }

}

export const breakpointsStore = new BreakpointsStore();
Renderer.K8sApi.apiManager.registerStore(breakpointsStore);
