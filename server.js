var express = require('express');
var app = express();
var fs = require("fs");
var path = require('path');
var bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


var myTasks = [];
function getDataJson(callback){
    fs.readFile("./files/data.json", function (err, data) {
        if(err) {
            console.log(err);
            return;
        }
        callback(JSON.parse(data));
    });
}
getDataJson(function(jsonData){
    myTasks = jsonData.tasks;
});

app.get('/', function(req, res) {
    res.render('pages/index');
});

app.get('/about', function(req, res) {
    res.render('pages/about', {
        list: myTasks
    });
    // getDataJson(function(jsonData){
    //     myTasks = jsonData.tasks;
    //     res.send(myTasks);
    // });
});

app.get('/about/getList', function(req, res) {
    getDataJson(function(jsonData){
        myTasks = jsonData.tasks;
        res.send(myTasks);
    });
});

app.post('/about/search', function(req, res) {
    var myTasks;
    var input_val = req.body.input_val;
    getDataJson(function(jsonData){
        myTasks = jsonData.tasks;
        var filtered = myTasks.filter(function(task){
                return task.name.indexOf(input_val) >= 0;
        })
        res.send(filtered);
    });
});

app.put('/about/add', function(req, res) {
    var tasks;
    var new_item = req.body.new_item;
    getDataJson(function(jsonData){
        tasks = jsonData.tasks;
        var exists = false;
        tasks.forEach(function(item){
            if(item.name === new_item){
                console.log('Task already exists!');
                exists = true;
            }
        });
        if(!exists){
            jsonData.tasks.push({
                name: new_item,
                completed: false
            });
            var newTasksJsonStr = JSON.stringify(jsonData,  null, 4);
            fs.writeFile('./files/data.json', newTasksJsonStr, 'utf8', function(err){
                if(err){
                    console.log(err);
                }
            });
        }
        var response = {
            tasks: tasks,
            exists: exists
        }
        res.send(response);
    });
});

app.put('/about/update', function(req, res) {
    var tasks;
    var task_name = req.body.task_name;
    var new_item_complete = req.body.completed;
    getDataJson(function(jsonData){
        tasks = jsonData.tasks;
        jsonData.tasks.forEach(function(task){
            if(task.name == task_name){
                task.completed = new_item_complete
            }
        });
        var newTasksJsonStr = JSON.stringify(jsonData,  null, 4);
        fs.writeFile('./files/data.json', newTasksJsonStr, 'utf8', function(err){
            if(err){
                console.log(err);
            }
        });
        res.send(jsonData.tasks);
    });

});


app.delete('/about/delete', function(req, res) {
    var tasks;
    var task_name = req.body.task_name;
    getDataJson(function(jsonData){
        tasks = jsonData.tasks;
        for(var i = 0; i < tasks.length; i++){
            if(tasks[i].name == task_name){
                jsonData.tasks.splice(i, 1);
                break;
            }
        };
        var newTasksJsonStr = JSON.stringify(jsonData,  null, 4);
        fs.writeFile('./files/data.json', newTasksJsonStr, 'utf8', function(err){
            if(err){
                console.log(err);
            }
        });
        res.send(jsonData.tasks);
    });
});

app.listen(4000, console.log('Port 4000'));
