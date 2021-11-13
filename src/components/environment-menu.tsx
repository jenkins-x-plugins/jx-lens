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
import { Environment } from "../environment";
import { openExternalLink } from "./activity-menu";

const {
  Component: {
    Icon,
    MenuItem,
  },
  Navigation,
} = Renderer;

const {
  Util,
} = Common;


export interface EnvironmentMenuProps extends Renderer.Component.KubeObjectMenuProps<Environment> {
}


export class EnvironmentMenu extends React.Component<EnvironmentMenuProps> {
  render() {
    const { object, toolbar } = this.props;

    const appURL = object.sourceUrl;

    if (!appURL) {
      return "";
    }

    return (
      <MenuItem onClick={Util.prevDefault(() => openExternalLink(appURL))}
        title="View the environment source repository">
        <Icon material="visibility" interactive={toolbar}/>
        <span className="title">View Repository</span>
      </MenuItem>
    );
  }

  async openLink(link: string) {
    Navigation.hideDetails();

    openExternalLink(link);
  }
}

