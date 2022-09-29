import "azure-devops-ui/Core/override.css";
import "es6-promise/auto";
import * as React from "react";
import * as ReactDOM from "react-dom";
import "./Common.scss";

import { IVssRestClientOptions } from "azure-devops-extension-api/Common/Context";
import { RestClientBase } from "azure-devops-extension-api/Common/RestClientBase";
import * as Git from "azure-devops-extension-api/Git/Git";

export function showRootComponent(component: React.ReactElement<any>) {
    ReactDOM.render(component, document.getElementById("root"));
}

export interface GitQueryCommitsCriteria {
    /**
     * Maximum number of entries to retrieve
     */
    $top: number;
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

export declare class CustRestClient extends RestClientBase {
    constructor(options: IVssRestClientOptions);
    static readonly RESOURCE_AREA_ID: string;
    /**
     * Retrieve git commits for a project
     *
     * @param repositoryId - The id or friendly name of the repository. To use the friendly name, projectId must also be specified.
     * @param searchCriteria -
     * @param project - Project ID or project name
     */
 getCommits(repositoryId: string, searchCriteria: GitQueryCommitsCriteria, project?: string): Promise<Git.GitCommitRef[]>;

}
