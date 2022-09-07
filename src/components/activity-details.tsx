import { Renderer } from "@k8slens/extensions";
import React from "react";
import { Activity } from "../activity";
import { activityContainers, podFromActivity, toContainerName } from "./activity-menu";
import { IPodContainer } from "@k8slens/extensions/dist/src/renderer/api/endpoints";

export interface ActivityDetailsProps extends Renderer.Component.KubeObjectDetailsProps<Activity> {
}

export class ActivityDetails extends React.Component<ActivityDetailsProps> {

  render() {
    const { object: activity } = this.props;

    if (!activity) return null;

    const containers = activityContainers(activity);
    const pod = podFromActivity(activity);

    return (
    /*
      <div>
        <nav>
          <Renderer.Component..
          <RecursiveTreeView data={dataTree}/>
        </nav>
        <section id="application">
          <h1>Application</h1>
        </section>
      </div>
        */

    // TODO a tree would be great! :)


      <div className="Activity">
        <Renderer.Component.DrawerItem name="Pipeline">
          {activity.pipelineDescription}
        </Renderer.Component.DrawerItem>

        {pod && containers.length > 1 && containers.map(step => {
          const name = toContainerName(step.name);

          const container = pod.spec.containers.find((c: IPodContainer) => c.name == name);

          return (
            <Renderer.Component.DrawerItem key={step.name} name={step.name}>
              {container && container.image}
            </Renderer.Component.DrawerItem>
          );
        })
        }
      </div>
    );
  }
}
