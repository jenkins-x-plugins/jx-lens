import styles from "../../styles.module.scss";

import { Renderer } from "@k8slens/extensions";
import React from "react";
import { repositoriesStore } from "../repository-store";
import { Repository } from "../repository";
import escape from "lodash/escape";

enum sortBy {
  owner = "owner",
  repository = "repository",
  age = "age",
}


export class RepositoryPage extends React.Component<{ extension: Renderer.LensExtension }> {

  render() {
    return (
      <Renderer.Component.TabLayout>
        <Renderer.Component.KubeObjectListLayout
          tableId="repositories"
          className={styles.RepositoryList} store={repositoriesStore}
          sortingCallbacks={{
            [sortBy.owner]: (repository: Repository) => `${repository.spec.org}/${repository.spec.repo}`,
            [sortBy.repository]: (repository: Repository) => repository.spec.repo,
            [sortBy.age]: (repository: Repository) => repository.createdTime,
          }}
          searchFilters={[
            (repository: Repository) => repository.getSearchFields(),
          ]}
          renderHeaderTitle="Repositories"
          renderTableHeader={[
            { title: "Owner", className: "owner", sortBy: sortBy.owner },
            { title: "Repository", className: "repository", sortBy: sortBy.repository },
            { title: "Status", className: "status" },
            { title: "Age", className: "age", sortBy: sortBy.age },
          ]}
          renderTableContents={(repository: Repository) => {
            return [
              repository.spec.org,
              repository.spec.repo,
              renderStatus(repository),
              repository.createdAt,
            ];
          }}
        />
      </Renderer.Component.TabLayout>
    );
  }
}

// renderStatus renders the status
function renderStatus(repository: Repository) {
  if (!repository || !repository.metadata || !repository.metadata.annotations) {
    return "";
  }
  const annotations = repository.metadata.annotations;
  let value = annotations["webhook.jenkins-x.io"] || "";

  if (!value) {
    return "";
  }
  value = value.toLowerCase();

  if (value === "true") {
    return (
      <span className={styles["status-succeeded"]} title="Webhook registered in git successfully">Succeeded</span>
    );
  }

  if (value.startsWith("creat")) {
    return (
      <span className={styles["status-running"]} title="Creating webhook on the git successfully">Creating</span>
    );
  }
  let title = "Failed to register webhook";
  const message = annotations["webhook.jenkins-x.io/error"];

  if (message) {
    title += `\n${escape(message)}`;
  }

  return (
    <span className={styles["status-failed"]} title={title}>Failed</span>
  );
}

