import styles from "../../styles.module.scss";

import { Renderer } from "@k8slens/extensions";
import React from "react";
import { previewsStore } from "../preview-store";
import { Preview } from "../preview";
import { ExternalLink } from "./external-link";

enum sortBy {
  owner = "owner",
  repository = "repository",
  pr = "pr",
  comment = "comment",
  author = "author",
  age = "age",
}


export class PreviewPage extends React.Component<{ extension: Renderer.LensExtension }> {

  render() {
    return (
      <Renderer.Component.TabLayout>
        <Renderer.Component.KubeObjectListLayout
          tableId="previews"
          className={styles.PreviewList} store={previewsStore}
          sortingCallbacks={{
            [sortBy.owner]: (preview: Preview) => preview.spec.pullRequest.owner,
            [sortBy.repository]: (preview: Preview) => preview.spec.pullRequest.repository,
            [sortBy.pr]: (preview: Preview) => preview.spec.pullRequest.number,
            [sortBy.comment]: (preview: Preview) => preview.spec.pullRequest.title,
            [sortBy.author]: (preview: Preview) => `${preview.spec.pullRequest.user.username || ""}/${preview.spec.pullRequest.owner}/${preview.spec.pullRequest.repository}`,
            [sortBy.age]: (preview: Preview) => preview.createdTime,
          }}
          searchFilters={[
            (preview: Preview) => preview.getSearchFields(),
          ]}
          renderHeaderTitle="Previews"
          renderTableHeader={[
            { title: "Owner", className: "owner", sortBy: sortBy.owner },
            { title: "Repository", className: "repository", sortBy: sortBy.repository },
            { title: "PR", className: "pr", sortBy: sortBy.pr },
            { title: "Comment", className: "comment", sortBy: sortBy.comment },
            { title: "Author", className: "author" },
            { title: "Preview", className: "preview" },
            { title: "Age", className: "age", sortBy: sortBy.age },
          ]}
          renderTableContents={(preview: Preview) => {
            return [
              preview.spec.pullRequest.owner,
              preview.spec.pullRequest.repository,
              preview.spec.pullRequest.number,
              renderComment(preview),
              renderAuthor(preview),
              renderPreview(preview),
              preview.createdAt,
            ];
          }}
        />
      </Renderer.Component.TabLayout>
    );
  }
}

// renderPreview renders the try it button
function renderPreview(preview: Preview) {
  if (!preview || !preview.spec) {
    return "";
  }
  const appURL = preview.spec.resources.url;

  if (!appURL) {
    return "";
  }

  return (
    <ExternalLink href={appURL} text="try me" title="try out the preview"></ExternalLink>
  );
}

// renderComment renders the try it button
function renderComment(preview: Preview) {
  const comment = preview.spec.pullRequest.title;

  return (
    <span title={comment}>{comment}</span>
  );
}

// renderAuthor renders the author
function renderAuthor(preview: Preview) {
  if (!preview || !preview.spec || !preview.spec.pullRequest) {
    return "";
  }
  const user = preview.spec.pullRequest.user;

  if (!user || !user.username) {
    return "";
  }
  const imageUrl = user.imageUrl;

  if (!imageUrl) {
    return <span>{user.username}</span>;
  }
  let linkUrl = user.linkUrl;

  if (!linkUrl) {
    linkUrl = `https://github.com/${user.username}`;
  }

  return (
    <span title={user.username}>
      <figure key="image">
        <img
          height='24' width='24'
          src={imageUrl}
          onLoad={evt => evt.currentTarget.classList.add("visible")}
        />
      </figure>
      &nbsp;
      <ExternalLink href={linkUrl} text={user.username} title="view the user in git"/>
    </span>
  );
}

