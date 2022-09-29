fetch('https://dev.azure.com/ZacharyNovember/Test/_apis/git/repositories/Test/commits?api-version=6.0', {
    method: 'GET',
    headers: {
        '-u': 'zachary.november@gmail.com:ibp3xspiazrc5rpq5or2vgrt2yved2bw77xvgar5e5std5cpwbva'
    }
})
    .then(function (res) {
    console.log(res);
})["catch"](function (err) {
    console.error(err);
});
