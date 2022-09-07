import { Renderer } from "@k8slens/extensions";
import React from "react";
import { ActivityDetails, ActivityDetailsProps } from "./src/components/activity-details";
import { ActivityPage } from "./src/components/activity-page";
import { Activity } from "./src/activity";
import { ActivityMenu, ActivityMenuProps } from "./src/components/activity-menu";
import { PreviewPage } from "./src/components/preview-page";
import { PreviewMenu, PreviewMenuProps } from "./src/components/preview-menu";
import { Preview } from "./src/preview";
import { RepositoryPage } from "./src/components/repository-page";
import { Repository } from "./src/repository";
import { RepositoryMenu, RepositoryMenuProps } from "./src/components/repository-menu";
import { Environment } from "./src/environment";
import { EnvironmentMenu, EnvironmentMenuProps } from "./src/components/environment-menu";
import { EnvironmentPage } from "./src/components/environment-page";
import { BreakpointPage } from "./src/components/breakpoint-page";

export function JXIcon(props: Renderer.Component.IconProps) {
  const JXLogo = require(`!!raw-loader!./jx.svg`).default;

  return <Renderer.Component.Icon {...props} svg={JXLogo} tooltip="Jenkins X"/>;
}

export default class JenkinsXExtension extends Renderer.LensExtension {
  clusterPages = [
    {
      id: "breakpoints",
      components: {
        Page: () => <BreakpointPage extension={this}/>,
        MenuIcon: JXIcon,
      },
    }, {
      id: "environments",
      components: {
        Page: () => <EnvironmentPage extension={this}/>,
        MenuIcon: JXIcon,
      },
    }, {
      id: "pipelines",
      components: {
        Page: () => <ActivityPage extension={this}/>,
        MenuIcon: JXIcon,
      },
    }, {
      id: "previews",
      components: {
        Page: () => <PreviewPage extension={this}/>,
        MenuIcon: JXIcon,
      },
    }, {
      id: "repositories",
      components: {
        Page: () => <RepositoryPage extension={this}/>,
        MenuIcon: JXIcon,
      },
    },
  ];

  clusterPageMenus = [
    {
      id: "jenkins-x",
      title: "Jenkins X",
      components: {
        Icon: JXIcon,
      },
    },
    {
      id: "jenkins-x/breakpoints",
      parentId: "jenkins-x",
      target: { pageId: "breakpoints" },
      title: "Breakpoints",
      components: {
        Icon: JXIcon,
      },
    },
    {
      id: "jenkins-x/environments",
      parentId: "jenkins-x",
      target: { pageId: "environments" },
      title: "Environments",
      components: {
        Icon: JXIcon,
      },
    },
    {
      id: "jenkins-x/pipelines",
      parentId: "jenkins-x",
      target: { pageId: "pipelines" },
      title: "Pipelines",
      components: {
        Icon: JXIcon,
      },
    },
    {
      id: "jenkins-x/previews",
      parentId: "jenkins-x",
      target: { pageId: "previews" },
      title: "Previews",
      components: {
        Icon: JXIcon,
      },
    },
    {
      id: "jenkins-x/repositories",
      parentId: "jenkins-x",
      target: { pageId: "repositories" },
      title: "Repositories",
      components: {
        Icon: JXIcon,
      },
    },
  ];

  kubeObjectMenuItems = [
    {
      kind: Environment.kind,
      apiVersions: ["jenkins.io/v1"],
      components: {
        MenuItem: (props: EnvironmentMenuProps) => <EnvironmentMenu {...props} />,
      },
    },
    {
      kind: Activity.kind,
      apiVersions: ["jenkins.io/v1"],
      components: {
        MenuItem: (props: ActivityMenuProps) => <ActivityMenu {...props} />,
      },
    },
    {
      kind: Preview.kind,
      apiVersions: ["preview.jenkins.io/v1alpha1"],
      components: {
        MenuItem: (props: PreviewMenuProps) => <PreviewMenu {...props} />,
      },
    },
    {
      kind: Repository.kind,
      apiVersions: ["jenkins.io/v1"],
      components: {
        MenuItem: (props: RepositoryMenuProps) => <RepositoryMenu {...props} />,
      },
    },
  ];


  kubeObjectDetailItems = [{
    kind: Activity.kind,
    apiVersions: ["jenkins.io/v1"],
    components: {
      Details: (props: ActivityDetailsProps) => <ActivityDetails {...props} />,
    },
  }];
}
