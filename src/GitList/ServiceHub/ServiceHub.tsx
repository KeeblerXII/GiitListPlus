import "./ServiceHub.scss";

import * as SDK from "azure-devops-extension-sdk";
import * as React from "react";

import { Header, TitleSize } from "azure-devops-ui/Header";
import { Page } from "azure-devops-ui/Page";

import { CommonServiceIds, getClient, IProjectPageService } from "azure-devops-extension-api";
import { GitRestClient } from "azure-devops-extension-api/Git";
import { GitCommitRef, GitFullArray, GitQueryCommitsCriteria, GitRepository } from "azure-devops-extension-api/Git/Git";
import { ISimpleListCell } from "azure-devops-ui/List";
import { ITableColumn, ITableRow, renderSimpleCell, renderSimpleCellValue, Table, TableRow } from "azure-devops-ui/Table";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
import { showRootComponent } from "../../Common";

interface IRepositoryServiceHubContentState {
    gitRepos?: ArrayItemProvider<GitRepository>;
    gitCommits?: ArrayItemProvider<GitCommitRef>;
    gitComb?: ArrayItemProvider<GitFullArray>;
    columns: ITableColumn<any>[];
    nbrRepos: Number;
}

class RepositoryServiceHubContent extends React.Component<{}, IRepositoryServiceHubContentState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            columns: [
                {
                    id: 'name',
                    name: 'Repository',
                    renderCell: (rowIndex: number, columnIndex: number, tableColumn: ITableColumn<GitRepository>, tableItem: GitRepository): JSX.Element => {
                      const content: ISimpleListCell = { href: tableItem.webUrl, text: tableItem.name };
                      return renderSimpleCellValue<any>(columnIndex, tableColumn, content);
                    },
                    width: 300,
                },
                {
                    id: "size",
                    name: "Size",
                    renderCell: (rowIndex: number, columnIndex: number, tableColumn: ITableColumn<GitRepository>, tableItem: GitRepository): JSX.Element => {
                        var size = tableItem.size
                        if (size == NaN) {
                            size = 0
                        }
                        size = (tableItem.size / 1000000) //Size in MB
                        var suffix = "MB"
                        if (size > 1000) {
                            size = size / 1000
                            suffix = "GB"
                        }
                        return renderSimpleCellValue<any>(columnIndex, tableColumn, size.toFixed(2) + suffix);
                    },
                    width: 100
                },
                {
                    id: "dates",
                    name: "Last Commit Date",
                    renderCell: (rowIndex: number, columnIndex: number, tableColumn: ITableColumn<GitRepository>, tableItem: GitCommitRef): JSX.Element => {
                        var date = tableItem.author.date
                        return renderSimpleCellValue<any>(columnIndex, tableColumn, date.toString().slice(0, 15));
                    },
                    width: 150
                },
                {
                    id: "name",
                    name: "Last Author",
                    renderCell: (rowIndex: number, columnIndex: number, tableColumn: ITableColumn<GitRepository>, tableItem: GitCommitRef): JSX.Element => {
                        const content: ISimpleListCell = { text: tableItem.author.name }
                        return renderSimpleCellValue<any>(columnIndex, tableColumn, content);
                    },
                    width: 150
                },
                {
                    id: "commit",
                    name: "Last Commit ID",
                    renderCell: (rowIndex: number, columnIndex: number, tableColumn: ITableColumn<GitRepository>, tableItem: GitCommitRef): JSX.Element => {
                        const content: ISimpleListCell = { href: tableItem.remoteUrl, text: tableItem.commitId.slice(0, 8) }
                        return renderSimpleCellValue<any>(columnIndex, tableColumn, content);
                    },
                    width: 120
                },
                
        ],
            nbrRepos: 0
        };
    }

    public async componentWillMount() {
        SDK.init();

        const projectService = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService);
        const project = await projectService.getProject();
        var repos = [] as GitRepository[]
        var lastCommits = [] as GitCommitRef [];
        if (project) {
            repos = await getClient(GitRestClient).getRepositories(project.name);
        }

        //Sort the list in alphabetical on repository name
        repos = repos.sort((a, b) => {
            return a.name.localeCompare(b.name)
        });
        for (let i = 0; i < repos.length; i++){
            const repoName: string = repos[i].name;
            const projName: string = repos[i].project.name;
            const filter: GitQueryCommitsCriteria = { $top: 1 }
            const commit: GitCommitRef[] = await getClient(GitRestClient).getCommits(repoName, filter, projName);
            lastCommits = lastCommits.concat(commit);
        }
        //Combine the array of repositoris with the array of commits
        const combArray = repos.map((r, idx) => ({
            ...r,
            ...(lastCommits[idx] || {}),
        }));

        this.setState({
            gitRepos: new ArrayItemProvider(repos),
            gitCommits: new ArrayItemProvider(lastCommits),
            gitComb: new ArrayItemProvider(combArray as any),
            nbrRepos: repos.length
        });
    }

    public render(): JSX.Element {
        return (
            <Page className="sample-hub flex-grow">

                <Header title={"Git repositories (" + this.state.nbrRepos + ")"}
                titleSize={TitleSize.Medium} />

                <div className="git-list-hub">
                    {
                        !this.state.gitRepos &&
                        !this.state.gitCommits &&
                        !this.state.gitComb &&
                        <p>Loading...</p>
                    }
                    {
                        this.state.gitRepos &&
                        this.state.gitCommits &&
                        this.state.gitComb &&
                        <Table
                            columns={this.state.columns}
                            itemProvider={this.state.gitComb}
                        />
                    }
                </div>
            </Page>
        );
    }
}

showRootComponent(<RepositoryServiceHubContent />);