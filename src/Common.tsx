import "azure-devops-ui/Core/override.css";
import "es6-promise/auto";
import * as React from "react";
import * as ReactDOM from "react-dom";
import "./Common.scss";

import * as Git from "azure-devops-extension-api/Git/Git";

export function showRootComponent(component: React.ReactElement<any>) {
    ReactDOM.render(component, document.getElementById("root"));
}

export interface GitFullArray {
    author: Git.GitCommitRef;
    commitId: Git.GitCommitRef;
    id: Git.GitRepository;
    name: Git.GitRepository;
    project: Git.GitRepository;
    size: Git.GitRepository;
    webUrl: Git.GitRepository;
}
