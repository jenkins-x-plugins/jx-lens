import styles from "../../styles.module.scss";

import { Renderer } from "@k8slens/extensions";
import React from "react";
import { environmentsStore } from "../environment-store";
import { Environment } from "../environment";

enum sortBy {
  name = "name",
  namespace = "namespace",
  strategy = "strategy",
  source = "source",
  age = "age",
}


export class EnvironmentPage extends React.Component<{ extension: Renderer.LensExtension }> {

  render() {
    return (
      <Renderer.Component.TabLayout>
        <Renderer.Component.KubeObjectListLayout
          tableId="environments"
          className={styles.EnvironmentList} store={environmentsStore}
          sortingCallbacks={{
            [sortBy.name]: (environment: Environment) => environment.metadata.name,
            [sortBy.namespace]: (environment: Environment) => environment.spec.namespace,
            [sortBy.strategy]: (environment: Environment) => `${environment.spec.promotionStrategy}/${environment.metadata.name}`,
            [sortBy.source]: (environment: Environment) => `${environment.sourceUrl || ""}/${environment.metadata.name}`,
            [sortBy.age]: (environment: Environment) => environment.createdTime,
          }}
          searchFilters={[
            (environment: Environment) => environment.getSearchFields(),
          ]}
          renderHeaderTitle="Environments"
          renderTableHeader={[
            { title: "Name", className: "name", sortBy: sortBy.name },
            { title: "Namespace", className: "namespace", sortBy: sortBy.namespace },
            { title: "Strategy", className: "strategy", sortBy: sortBy.strategy },
            { title: "Source", className: "strategy", sortBy: sortBy.source },
            { title: "Age", className: "age", sortBy: sortBy.age },
          ]}
          renderTableContents={(environment: Environment) => {
            return [
              environment.metadata.name,
              environment.spec.namespace,
              environment.spec.promotionStrategy,
              environment.sourceUrl,
              environment.createdAt,
            ];
          }}
        />
      </Renderer.Component.TabLayout>
    );
  }
}
