import styles from "../../styles.module.scss";

import { Renderer } from "@k8slens/extensions";
import React from "react";
import { breakpointsStore } from "../breakpoint-store";
import { Breakpoint } from "../breakpoint";

enum sortBy {
  repository = "repository",
  branch = "branch",
  context = "context",
  breakpoint = "breakpoint",
  age = "age",
}


export class BreakpointPage extends React.Component<{ extension: Renderer.LensExtension }> {

  render() {
    return (
      <Renderer.Component.TabLayout>
        <Renderer.Component.KubeObjectListLayout
          tableId="breakpoints"
          className={styles.BreakpointList} store={breakpointsStore}
          sortingCallbacks={{
            [sortBy.repository]: (breakpoint: Breakpoint) => renderRepository(breakpoint),
            [sortBy.branch]: (breakpoint: Breakpoint) => breakpoint.spec.filter.branch,
            [sortBy.context]: (breakpoint: Breakpoint) => breakpoint.spec.filter.context,
            [sortBy.breakpoint]: (breakpoint: Breakpoint) => renderBreakpoint(breakpoint),
            [sortBy.age]: (breakpoint: Breakpoint) => breakpoint.createdTime,
          }}
          searchFilters={[
            (breakpoint: Breakpoint) => breakpoint.getSearchFields(),
          ]}
          renderHeaderTitle="Breakpoints"
          renderTableHeader={[
            { title: "Repository", className: "repository", sortBy: sortBy.repository },
            { title: "Branch", className: "branch", sortBy: sortBy.branch },
            { title: "Context", className: "context", sortBy: sortBy.context },
            { title: "Breakpoint", className: "breakpoint", sortBy: sortBy.breakpoint },
            { title: "Age", className: "age", sortBy: sortBy.age },
          ]}
          renderTableContents={(breakpoint: Breakpoint) => {
            return [
              renderRepository(breakpoint),
              breakpoint.spec.filter.branch,
              breakpoint.spec.filter.context,
              renderBreakpoint(breakpoint),
              breakpoint.createdAt,
            ];
          }}
        />
      </Renderer.Component.TabLayout>
    );
  }
}

// renderBreakpoint renders the try it button
function renderBreakpoint(breakpoint: Breakpoint) {
  if (!breakpoint || !breakpoint.spec || !breakpoint.spec.debug) {
    return "";
  }
  const bp = breakpoint.spec.debug.breakpoint;

  if (!bp) {
    return "";
  }

  return bp.join(", ");
}

// renderRepository renders the repository name
function renderRepository(breakpoint: Breakpoint) {
  const owner = breakpoint.spec.filter.owner;
  const repository = breakpoint.spec.filter.repository;

  if (owner) {
    return repository ? `${owner}/${repository}` : owner;
  }

  return repository ? repository : "";
}
