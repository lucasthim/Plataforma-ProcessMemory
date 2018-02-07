var Storage = require('./storage.js');
var restify = require('restify');
var server = restify.createServer();
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());


var sto = new Storage({mongoip: "localhost", database : "process_memory"});

function format(instanceId) {
    var d = new Date();
    return {
        instanceId: instanceId,
        timestamp: d.getTime()
    };
}

//salva qualquer entidade
server.post('/:instanceId/create', (req, res, next)=>{
    
    var instanceId = req.params.instanceId;
    data = {}
    if(req.body){
        data = req.body;
    }

    sto.create(instanceId, data).
        then((result) => {
            res.send(200);            
        }).
        catch((err) => {
            console.log("Erro no 'create':",err);
            res.send(500);
        });
});

server.post('/:instanceId/commit', (req, res, next)=>{
    var instanceId = req.params.instanceId;
    data = {}
    if(req.body){
        data = req.body;
    }

    sto.commit(instanceId, data).
        then((result) => {
            res.send(200);
        }).
        catch((err) => {
            console.log("Erro no 'commit':",err);
            res.send(500);
        });    
});

server.get('/:instanceId/head', (req, res, next)=>{
    var instanceId = req.params.instanceId;
    sto.head(instanceId).
        then((result) => {
            res.send(result);
        }).
        catch((err) => {
            console.log("Erro no 'head':",err);
            res.send(500);
        });      
});

server.get('/:instanceId/history', (req, res, next)=>{
    var instanceId = req.params.instanceId;
    var first = req.query.first;
    var last = req.query.last;
    sto.history(instanceId, first, last).
        then((result) => {
            res.send(result);
        }).
        catch((err) => {
            console.log("Erro no 'history':",err);
            res.send(500);
        }); 
});

server.get('/:instanceId/first', (req, res, next)=>{
    var instanceId = req.params.instanceId;
    sto.first(instanceId).
        then((result) => {
            res.send(result);
        }).
        catch((err) => {
            console.log("Erro no 'first':",err);
            res.send(500);
        });   
});

var port = process.env.PORT || 9091;
server.listen(port, function() {
    console.log('%s listening at %s', server.name, server.url);
});
