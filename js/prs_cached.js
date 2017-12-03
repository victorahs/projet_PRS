var remotedb = new PouchDB('http://10.0.3.208:5984/prs25');
remotedb.info().then(function (info) {
                console.log(info);
            })