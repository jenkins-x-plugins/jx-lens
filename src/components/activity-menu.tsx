/**
 * Copyright (c) 2021 OpenLens Authors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


import React from "react";
import { Common, Renderer } from "@k8slens/extensions";
import { Activity, ActivityStep, CoreActivityStep } from "../activity";
import * as electron from "electron";
import { IPodContainer } from "@k8slens/extensions/dist/src/renderer/api/endpoints";
import { breakpointsStore } from "../breakpoint-store";
import { Breakpoint, BreakpointFilter } from "../breakpoint";

const {
  Component: {
    ConfirmDialog,
    createTerminalTab,
    logTabStore,
    terminalStore,
    Icon,
    MenuItem,
    SubMenu,
    StatusBrick,
  },
  Navigation,
} = Renderer;

const {
  Util,
} = Common;


export interface ActivityMenuProps extends Renderer.Component.KubeObjectMenuProps<Activity> {
}

export class ActivityMenu extends React.Component<ActivityMenuProps> {

  render() {
    const { object, toolbar } = this.props;

    const link = object.spec.gitUrl || "";
    const containers = activityContainers(object);

    const runningContainerStep = findLatestRunningContainerStep(containers, false);
    const latestContainerName = findLatestRunningContainerStep(containers, true);

    const menuLinks = renderMenuItems(object, toolbar);
    const breakpoint = breakpointFromActivity(object);

    return (
      <>
        {containers.length > 0 && (
          <MenuItem>
            <Icon material="subject" interactive={toolbar} tooltip={toolbar && "View the pipeline logs"}/>
            <span className="title">Logs</span>
            <>
              <Icon className="arrow" material="keyboard_arrow_right"/>
              <SubMenu>
                {latestContainerName && (
                  <MenuItem key={`latest-step-${latestContainerName}`}
                    onClick={Util.prevDefault(() => this.viewLogs(latestContainerName))}
                    className="flex align-center"
                    title={`view logs for the latest pipeline step: ${latestContainerName}`}>
                    <StatusBrick/>
                    <span>latest step</span>
                  </MenuItem>
                )}
                {latestContainerName && containers.length > 1 && (
                  <>
                    <MenuItem key={"-separator-"}
                      className="flex align-center">
                      <span></span>
                    </MenuItem>
                    {
                      containers.map(container => {
                        const name = toContainerName(container.name);

                        return (
                          <MenuItem key={name} onClick={Util.prevDefault(() => this.viewLogs(name))}
                            className="flex align-center"
                            title="view logs for this pipeline step">
                            <StatusBrick/>
                            <span>{name}</span>
                          </MenuItem>
                        );
                      })
                    }
                  </>
                )}
              </SubMenu>
            </>
          </MenuItem>
        )}
        {containers.length > 0 && runningContainerStep && (
          <MenuItem>
            <Icon svg="ssh" interactive={toolbar} tooltip={toolbar && "Pod Shell"}/>
            <span className="title">Shell</span>
            {containers.length > 0 && runningContainerStep && (
              <>
                <Icon className="arrow" material="keyboard_arrow_right"/>
                <SubMenu>
                  {runningContainerStep && (
                    <MenuItem key={`latest-step-${runningContainerStep}`}
                      onClick={Util.prevDefault(() => this.execShell(runningContainerStep))}
                      className="flex align-center"
                      title={`open a shell in the latest pipeline step: ${runningContainerStep}`}>
                      <StatusBrick/>
                      <span>latest step</span>
                    </MenuItem>
                  )}
                  {runningContainerStep && containers.length > 1 && (
                    <>
                      <MenuItem key={"-separator-"}
                        className="flex align-center">
                        <span></span>
                      </MenuItem>
                      {
                        containers.map(container => {
                          const name = toContainerName(container.name);

                          return (
                            <MenuItem key={name} onClick={Util.prevDefault(() => this.execShell(name))}
                              className="flex align-center"
                              title="open a shell into this pipeline step">
                              <StatusBrick/>
                              <span>{name}</span>
                            </MenuItem>
                          );
                        })
                      }
                    </>
                  )}
                </SubMenu>
              </>
            )}
          </MenuItem>
        )}
        {breakpointsStore.isLoaded && (
          <MenuItem>
            <Icon material="adb" interactive={toolbar} tooltip={toolbar && "Pipeline breakpoint"}/>
            <span className="title">Breakpoint</span>
            <>
              <Icon className="arrow" material="keyboard_arrow_right"/>
              <SubMenu>
                {breakpoint && (
                  <MenuItem onClick={Util.prevDefault(() => this.removeBreakpoint(breakpoint))}
                    title="Delete the breakpoint">
                    <Icon material="delete" interactive={toolbar} tooltip="Delete"/>
                    <span className="title">Remove</span>
                  </MenuItem>
                )}
                {!breakpoint && (
                  <MenuItem onClick={Util.prevDefault(() => this.addBreakpoint(object))}
                    title="Add breakpoint breakpoint">
                    <Icon material="add" interactive={toolbar}/>
                    <span className="title">Add</span>
                  </MenuItem>
                )}
              </SubMenu>
            </>
          </MenuItem>
        )}
        <MenuItem onClick={Util.prevDefault(() => this.openLink(link))} title="View git repository">
          <Icon material="source" interactive={toolbar}/>
          <span className="title">Repository</span>
        </MenuItem>
        {menuLinks}
      </>
    );
  }

  async openLink(link: string) {
    Navigation.hideDetails();

    openExternalLink(link);
  }

  async viewLogs(containerName: string) {
    Navigation.hideDetails();

    const pa = this.props.object;
    const pod = podFromActivity(pa);

    //console.log("found pod", pod);
    if (!pod) {
      console.log("could not find pod for PipelineActivity", pa);

      return;
    }

    const container = pod.spec.containers.find((c: IPodContainer) => c.name == containerName);

    if (!container) {
      console.log("could not find container", containerName);

      return;
    }

    logTabStore.createPodTab({
      selectedPod: pod,
      selectedContainer: container,
    });
  }

  async execShell(container?: string) {
    Navigation.hideDetails();

    const pa = this.props.object;
    const pod = podFromActivity(pa);

    console.log("found pod", pod);

    if (!pod) {
      return;
    }

    const containerParam = container ? `-c ${container}` : "";
    let command = `kubectl exec -i -t -n ${pod.getNs()} ${pod.getName()} ${containerParam} "--"`;

    if (window.navigator.platform !== "Win32") {
      command = `exec ${command}`;
    }

    if (pod.getSelectedNodeOs() === "windows") {
      command = `${command} powershell`;
    } else {
      command = `${command} sh -c "clear; (bash || ash || sh)"`;
    }

    const shell = createTerminalTab({
      title: `Pod: ${pod.getName()} (namespace: ${pod.getNs()})`,
    });

    terminalStore.sendCommand(command, {
      enter: true,
      tabId: shell.id,
    });
  }

  async removeBreakpoint(breakpoint: Breakpoint) {
    ConfirmDialog.open({
      ok: () => this.doRemoveBreakpoint(breakpoint),
      labelOk: `Remove`,
      message: <div>Remove the Breakpoint <b>{breakpoint.metadata.name}</b>?</div>,
    });
  }

  private doRemoveBreakpoint(breakpoint: Breakpoint) {
    return breakpointsStore.remove(breakpoint);
  }


  async addBreakpoint(pa: Activity) {
    ConfirmDialog.open({
      ok: () => this.doAddBreakpoint(pa),
      labelOk: `Add`,
      message: <div>Add a breakpoint for the Pipeline <b>{pa.metadata.name}</b>?</div>,
    });
  }

  async doAddBreakpoint(pa: Activity) {
    const ns = pa.metadata.namespace;
    const name = pa.metadata.name;
    const filter = activityToBreakpointFilter(pa);
    const bp = {
      spec: {
        filter,
        debug: {
          breakpoint: ["onFailure"],
        },
      },
    };
    
    breakpointsStore.create({
      name,
      namespace: ns,
    }, bp);
  }
}

/**
 * openExternalLink opens the external browser link
 * @param link
 */
export function openExternalLink(link: string) {
  //console.log("openning link", link);
  window.setTimeout(() => {
    //console.log("starting to open link", link);
    electron.shell.openExternal(link);
    console.log("opened link", link);
  }, 1);
}


export function podFromActivity(pa: Activity) {
  const podApi = Renderer.K8sApi.apiManager.getApi(api => api.kind === "Pod");

  if (!podApi) {
    console.log("no pod api");
  }
  //console.log("found pod api", podApi);

  const store = Renderer.K8sApi.apiManager.getStore(podApi);

  if (!store) {
    console.log("no store");

    return null;
  }

  if (!pa || !pa.metadata || !pa.metadata.labels) {
    return null;
  }
  const namespace = pa.metadata.namespace || "jx";

  if (pa.metadata && pa.metadata.labels) {
    const podName = pa.metadata.labels["podName"];

    if (podName) {
      //console.log("looking up pod", podName, "in namespace", namespace)
      return store.getByName(podName, namespace);
    }
  }
  const s = pa.spec;

  if (s) {
    // lets use the selector to find the pod...
    const pods = store.getByLabel(
      {
        branch: s.gitBranch,
        build: s.build,
        owner: s.gitOwner,
        repository: s.gitRepository,
      },
    );

    return pods.find((pod) => !pod.labels || pod.labels["jenkins.io/pipelineType"] != "meta");
  }

  return null;
}

export function breakpointFromActivity(pa: Activity) {
  const filter = activityToBreakpointFilter(pa);

  return breakpointsStore.getBreakpointForActivity(filter);
}

export function activityToBreakpointFilter(pa: Activity): BreakpointFilter {
  const ps = pa.spec;

  return {
    branch: ps.gitBranch,
    owner: ps.gitOwner,
    repository: ps.gitRepository,
    context: ps.context,
  };
}


/**
 * activityContainers returns an array of pipeline steps in order
 */
export function activityContainers(pa: Activity): CoreActivityStep[] {
  const answer: CoreActivityStep[] = [];

  if (!pa || !pa.spec) {
    return answer;
  }
  const steps = pa.spec.steps;

  if (!steps) {
    return answer;
  }
  steps.forEach((step) => {
    const st = step.stage;

    if (st) {
      const ssteps = st.steps;

      if (ssteps) {
        ssteps.forEach((ss) => {
          answer.push(ss);
        });
      }
    }
  });

  return answer;
}

function findLatestRunningContainerStep(containers: CoreActivityStep[], useLastIfNotRunning: boolean): string {
  let last = "";

  if (containers) {
    for (const c of containers) {
      if (!c.completedTimestamp) {
        return toContainerName(c.name);
      }
      last = c.name;
    }
  }

  if (useLastIfNotRunning && last) {
    return toContainerName(last);
  }

  return "";
}

export function toContainerName(name: string) {
  return `step-${name.toLowerCase().split(" ").join("-")}`;
}

// renderMenuItems returns the menu item links for an activity
function renderMenuItems(pa: Activity, toolbar?: boolean) {
  const links: any[] = [];

  if (!pa || !pa.spec) {
    return links;
  }
  const steps = pa.spec.steps;

  if (!steps || !steps.length) {
    return links;
  }
  const version = pa.spec.version;
  const releaseNotesURL = pa.spec.releaseNotesURL;

  if (version && releaseNotesURL) {
    links.push((
      <MenuItem onClick={Util.prevDefault(() => openExternalLink(releaseNotesURL))} title="view the release notes">
        <Icon material="description" interactive={toolbar}/>
        <span className="title">{version}</span>
      </MenuItem>
    ));
  }

  pa.spec.steps.forEach((step: ActivityStep) => {
    const promote = step.promote;

    if (promote) {
      let prURL = "";
      let title = "";
      const pr = promote.pullRequest;

      if (pr) {
        prURL = pr.pullRequestURL;
        title = pr.name;
      }

      if (prURL) {
        let prName = "PR";
        const i = prURL.lastIndexOf("/");

        if (i > 0 && i < prURL.length) {
          /* eslint-disable-next-line unused-imports/no-unused-vars-ts */
          prName = prURL.substr(i + 1);
        }
        const env = promote.environment;

        if (env) {
          // TODO to title for env
          title = `Promote to ${env}`;
        }

        links.push((
          <MenuItem onClick={Util.prevDefault(() => openExternalLink(prURL))}
            title="view the promote Pull Request">
            <Icon material="code" interactive={toolbar}/>
            <span className="title">{title}</span>
          </MenuItem>
        ));
      }
    }
    const preview = step.preview;

    if (preview) {
      const appURL = preview.applicationURL;

      if (appURL) {
        let title = preview.name;

        if (!title) {
          title = "Preview";
        }
        links.push((
          <MenuItem onClick={Util.prevDefault(() => openExternalLink(appURL))}
            title="View the preview environment application">
            <Icon material="visibility" interactive={toolbar}/>
            <span className="title">View Preview</span>
          </MenuItem>
        ));
      }
    }
  });

  return links;
}
