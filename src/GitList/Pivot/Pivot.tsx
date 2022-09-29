import "./Pivot.scss";

import * as SDK from "azure-devops-extension-sdk";
import * as React from "react";

import { showRootComponent } from "../../Common";

import { CommonServiceIds, getClient, IHostNavigationService } from "azure-devops-extension-api";
import { CoreRestClient, ProjectVisibility, TeamProjectReference } from "azure-devops-extension-api/Core";
import { GitCommitRef, GitFullArray, GitQueryCommitsCriteria, GitRepository, GitRestClient } from "azure-devops-extension-api/Git";

import { Header, TitleSize } from "azure-devops-ui/Header";
import { ISimpleListCell } from "azure-devops-ui/List";
import { Page } from "azure-devops-ui/Page";
import { ITableColumn, ITableRow, renderSimpleCell, renderSimpleCellValue, Table, TableRow } from "azure-devops-ui/Table";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";

//interface that the table will use to render
interface IPivotContentState {
    projects?: ArrayItemProvider<TeamProjectReference>;
    gitRepos?: ArrayItemProvider<GitRepository>;
    gitCommits?: ArrayItemProvider<GitCommitRef>;
    gitComb?: ArrayItemProvider<GitFullArray>;
    columns: ITableColumn<any>[];
    nbrRepos: Number;
}

class PivotContent extends React.Component<{}, IPivotContentState> {

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
                id: 'project',
                name: 'Project',
                renderCell: (rowIndex: number, columnIndex: number, tableColumn: ITableColumn<GitRepository>, tableItem: GitRepository): JSX.Element => {
                  const content: ISimpleListCell = { text: tableItem.project.name };
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

    public componentDidMount() {
        SDK.init();
        this.initializeComponent();
    }
        //building the arrays to use in table
    private async initializeComponent() {
        const projects = await getClient(CoreRestClient).getProjects();
        var repositories = [] as GitRepository[];
        var lastCommits = [] as GitCommitRef [];
        //Retrieve the repositories in each project
        for (let i = 0; i < projects.length; i++) {
            const repos: GitRepository[] = await getClient(GitRestClient).getRepositories(projects[i].name);
            repositories = repositories.concat(repos);
        }
        //Sort the list in alphabetical on repository name
        repositories = repositories.sort((a, b) => {
            return a.name.localeCompare(b.name)
        });
        //Retrieve last commit for each repository
        for (let i = 0; i < repositories.length; i++){
            const repoName: string = repositories[i].name;
            const projName: string = repositories[i].project.name;
            const filter: GitQueryCommitsCriteria = { $top: 1 }
            const commit: GitCommitRef[] = await getClient(GitRestClient).getCommits(repoName, filter, projName);
            lastCommits = lastCommits.concat(commit);
        }
        //Combine the array of repositoris with the array of commits
        const combArray = repositories.map((r, idx) => ({
            ...r,
            ...(lastCommits[idx] || {}),
        }));

        this.setState({
            projects: new ArrayItemProvider(projects),
            gitRepos: new ArrayItemProvider(repositories),
            gitCommits: new ArrayItemProvider(lastCommits),
            gitComb: new ArrayItemProvider(combArray as any),
            nbrRepos: repositories.length
        });
    }

    public render(): JSX.Element {
        return (
            <Page className="page-pivot flex-grow">

                <Header title={"Their repositories (" + this.state.nbrRepos + ")"}
                    titleSize={TitleSize.Medium} />

                <div className="git-list-pivot">
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

showRootComponent(<PivotContent />);