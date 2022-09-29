interface lastDate {
    count: number;
    value: [
        {
        commitId: string
        author: {
            name: string
            email: string
            date: Date
        },
        committer: {
            name: string
            email: string
            date: Date
        },
        comment: string
        commentTruncated: boolean
        changeCounts: {
            Add: number
            Edit: number
            Delete: number
        },
        url: string
        remoteUrl: string

        }
    ]
}


function getDate(): Promise<lastDate[]> {
    return fetch('https://dev.azure.com/ZacharyNovember/Test/_apis/git/repositories/Test/commits?api-version=6.0', {
        method: 'GET',
        headers: {
            '-u': 'zachary.november@gmail.com:ibp3xspiazrc5rpq5or2vgrt2yved2bw77xvgar5e5std5cpwbva',
        },
    })
        .then(response => response.json())
        .then(response => {
            return response as lastDate[];
        });
}

const date = getDate()
    console.log(date)