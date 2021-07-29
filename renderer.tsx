import { Renderer } from "@k8slens/extensions";
import React from "react";
import { ActivityDetails, ActivityDetailsProps } from "./src/components/activity-details";
import { ActivityPage } from "./src/components/activity-page";
import { Activity} from "./src/activity"
import JenkinsXMainExtension from "./main";

export function CertificateIcon(props: Renderer.Component.IconProps) {
  return <Renderer.Component.Icon {...props} material="security" tooltip="Certificates"/>
}

export default class JenkinsXExtension extends Renderer.LensExtension {
  clusterPages = [{
    id: "activities",
    components: {
      Page: () => <ActivityPage extension={this} />,
      MenuIcon: CertificateIcon,
    }
  }]

  clusterPageMenus = [
    {
      target: { pageId: "activities" },
      title: "Activities",
      components: {
        Icon: CertificateIcon,
      }
    },
  ];

  kubeObjectDetailItems = [{
    kind: Activity.kind,
    apiVersions: ["jenkins.io/v1"],
    components: {
      Details: (props: ActivityDetailsProps) => <ActivityDetails {...props} />
    }
  }]
}
