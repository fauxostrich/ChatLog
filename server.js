let app = require("express")();
let mongoClient = require("mongodb").MongoClient;
let http = require("http").Server(app);
let io = require("socket.io")(http);
let port = 9090;
let i = 1;
let url = "mongodb://localhost:27017";
app.get("/", (req, res) => {
    res.sendFile(__dirname+"/index.html");
});

io.on("connection", (socket) => {
    socket.on("chat", (json) => {
        var j = JSON.parse(json);
        var n = j.name;
        var msg = j.msg;
        mongoClient.connect(url, {useUnifiedTopology: true}, (error1, client) => {
            let db = client.db("meanstack");
            if(!error1){
                db.collection("Chat").insertOne({_id: i, name: n, message: msg}, (error2, result)=>{
                    if(!error2) console.log(result);
                    else console.log(error2);
                    client.close();
                })
            }
            else console.log(error1);

            i++;
        });
    });
});
http.listen(port);