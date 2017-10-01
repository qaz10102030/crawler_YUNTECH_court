var fs = require('fs');
var fetch = require('isomorphic-fetch');
var mongodb = require('mongodb');
var mongodbServer = new mongodb.Server('localhost', 27017, {
  auto_reconnect: true,
  poolSize: 10
});
var db = new mongodb.Db('yuntech', mongodbServer);

var time = '1061009-1061015'

db.open(function() {
    db.collection('court_table').find({},{_id:false,id:false}).toArray(function(err,result) {
        if(err) throw err;
            for(var i = 0;i<result[0].sheet.length;i++){
                if(result[0].sheet[i].text == time){
                    var gid = result[0].sheet[i].gid;
                    Download(gid);
                }
            }
        db.close();
    });
});

function Download(gid){
    var sheetId = '1rLXhqXVg9VpOksdeiH9JRsWbBQ3dFzpgVPeSViuyLRA';
    var downloadType = 'tsv';
    var downloadlink = 'https://docs.google.com/spreadsheets/d/'+ sheetId +'/export?format=' + downloadType + '&id=' + sheetId + '&gid=' + gid;
    fetch(downloadlink).then(function(res) {
        var dest = fs.createWriteStream('105學年度-場地借用狀況 - ' + time + '.' + downloadType);
        res.body.pipe(dest);
        console.log("file download OK");
        setTimeout(function(){
            Parse();            
        },10);
    });
}

function Parse(){
    var filename = '105學年度-場地借用狀況 - ' + time + '.tsv';

    //read tsv
    var read_tsv = fs.readFileSync(filename,'utf8');
    
    var test = [];
    test.push(read_tsv.split(/\t|\r|\n\r/));

    fs.writeFile('tsv.json', JSON.stringify(test) , (err) => {
        if (err) throw err;
        console.log('It\'s saved!');
    });
    console.log(test[0][4]);
    Analysis(test);
}

function Analysis(test){
    var week = []; //一周日期
    var parse_state = [];
    var output = [];
    var multi = [];

    //塞日期
    for(var i = 3;i<10;i++){
        week[i-3] = test[0][i];
    }

    //塞借場資訊
    for(var i = 24;i<31;i++){
        parse_state[i-24] = test[0][i];
    }
    output.push({ //田徑場
        name : test[0][22],
        type : "室外場地",
        multi: false,
        week : week,
        state: parse_state
    });

    parse_state = [];
    //44 65 86 107 128 149
    for(var j = 44;j<150;j = j + 21){ //取場地
        multi = [];
        for(var i = j + 1;i<j+8;i++){//取那個場
            multi[i-j-1] = test[0][i];
        }
        parse_state.push({
            court:test[0][j],
            state:multi
        });
    }
    output.push({ //排球場
        name : test[0][43],
        type : "室外場地",
        multi: true,
        week : week,
        state:parse_state
    });

    parse_state = [];
    //170 191 212 233 254 275 296 317
    for(var j = 170;j<318;j = j + 21){ //取場地
        multi = [];
        for(var i = j + 1;i<j+8;i++){//取那個場
            multi[i-j-1] = test[0][i];
        }
        parse_state.push({
            court:test[0][j],
            state:multi
        });
    }
    output.push({ //籃球場
        name : test[0][169],
        type : "室外場地",
        multi: true,        
        week : week,
        state:parse_state
    });

    parse_state = [];
    //塞借場資訊
    for(var i = 339;i<346;i++){
        parse_state[i-339] = test[0][i];
    }
    output.push({ //司令台後方廣場
        name : test[0][337],
        type : "室外場地",
        multi: false,
        week : week,
        state:parse_state
    });

    parse_state = [];
    //塞借場資訊
    for(var i = 360;i<367;i++){
        parse_state[i-360] = test[0][i];
    }
    output.push({ //棒壘球場
        name : test[0][358],
        type : "室外場地",
        multi: false,
        week : week,
        state:parse_state
    });

    parse_state = [];
    //380 401
    for(var j = 380;j<402;j = j + 21){ //取場地
        multi = [];
        for(var i = j + 1;i<j+8;i++){//取那個場
            multi[i-j-1] = test[0][i];
        }
        parse_state.push({
            court:test[0][j],
            state:multi
        });
    }
    output.push({ //網球場
        name : test[0][379],
        type : "室外場地",
        multi: true,
        week : week,
        state:parse_state
    });

    parse_state = [];
    //塞借場資訊
    for(var i = 423;i<430;i++){
        parse_state[i-423] = test[0][i];
    }
    output.push({ //溜冰場
        name : test[0][421],
        type : "室外場地",
        multi: false,
        week : week,
        state:parse_state
    });

    parse_state = [];
    //34 55 76
    for(var j = 34;j<77;j = j + 21){ //取場地
        multi = [];
        for(var i = j + 1;i<j+8;i++){//取那個場
            multi[i-j-1] = test[0][i];
        }
        parse_state.push({
            court:test[0][j],
            state:multi
        });
    }
    output.push({ //綜合球場
        name : test[0][33],
        type : "體育館本館",
        multi: true,
        week : week,
        state:parse_state
    });

    parse_state = [];
    //97 118 139
    for(var j = 97;j<140;j = j + 21){ //取場地
        multi = [];
        for(var i = j + 1;i<j+8;i++){//取那個場
            multi[i-j-1] = test[0][i];
        }
        if(j == 97){
            j += 21;
            for(var i = j + 1;i<j+8;i++){//取那個場
                multi[i-j-1] += '   ' + test[0][i];
            }
        }
        parse_state.push({
            court:test[0][j],
            state:multi
        });
    }
    output.push({ //羽球場
        name : test[0][96],
        type : "體育館本館",
        multi: true,
        week : week,
        state:parse_state
    });

    parse_state = [];
    //塞借場資訊
    for(var i = 161;i<168;i++){
        parse_state[i-161] = test[0][i];
    }
    output.push({ //選手村
        name : test[0][159],
        type : "體育館本館",
        multi: false,
        week : week,
        state:parse_state
    });

    parse_state = [];
    //181 202
    for(var j = 181;j<203;j = j + 21){ //取場地
        multi = [];
        for(var i = j + 1;i<j+8;i++){//取那個場
            multi[i-j-1] = test[0][i];
        }
        if(j == 181){
            j += 21;
            for(var i = j + 1;i<j+8;i++){//取那個場
                multi[i-j-1] += '   ' + test[0][i];
            }
        }
        parse_state.push({
            court:test[0][j],
            state:multi
        });
    }
    output.push({ //桌球教室
        name : test[0][180],
        type : "體育館本館",
        multi: false,
        week : week,
        state:parse_state
    });

    parse_state = [];
    //塞借場資訊
    for(var i = 224;i<231;i++){
        parse_state[i-224] = test[0][i];
    }
    output.push({ //韻律教室
        name : test[0][222],
        type : "體育館本館",
        multi: false,
        week : week,
        state:parse_state
    });

    parse_state = [];
    //塞借場資訊
    for(var i = 245;i<252;i++){
        parse_state[i-245] = test[0][i];
    }
    output.push({ //柔道教室
        name : test[0][243],
        type : "體育館本館",
        multi: false,
        week : week,
        state:parse_state
    });

    parse_state = [];
    //塞借場資訊
    for(var i = 266;i<273;i++){
        parse_state[i-266] = test[0][i];
    }
    output.push({ //B2重訓室
        name : test[0][264],
        type : "體育館本館",
        multi: false,
        week : week,
        state:parse_state
    });

    parse_state = [];
    //塞借場資訊
    for(var i = 287;i<294;i++){
        parse_state[i-287] = test[0][i];
    }
    output.push({ //游泳館
        name : test[0][285],
        type : "體育館本館",
        multi: false,
        week : week,
        state:parse_state
    });

    parse_state = [];
    //塞借場資訊
    for(var i = 308;i<315;i++){
        parse_state[i-308] = test[0][i];
    }
    output.push({ //體適能中心
        name : test[0][306],
        type : "體育館本館",
        multi: false,
        week : week,
        state:parse_state
    });

    parse_state = [];
    //328
    for(var j = 328;j<329;j = j + 21){ //取場地
        multi = [];
        for(var i = j + 1;i<j+8;i++){//取那個場
            multi[i-j-1] = test[0][i];
        }
        parse_state.push({
            court:test[0][j],
            state:multi
        });
    }
    output.push({ //視聽教室
        name : test[0][327],
        type : "體育館本館",
        multi: false,
        week : week,
        state:parse_state
    });

    parse_state = [];
    //塞借場資訊
    for(var i = 350;i<357;i++){
        parse_state[i-350] = test[0][i];
    }
    output.push({ //B1射箭場
        name : test[0][348],
        type : "體育館本館",
        multi: false,
        week : week,
        state:parse_state
    });

    parse_state = [];
    //塞借場資訊
    for(var i = 371;i<378;i++){
        parse_state[i-371] = test[0][i];
    }
    output.push({ //2F撞球桌
        name : test[0][369],
        type : "體育館本館",
        multi: false,
        week : week,
        state:parse_state
    });
    
    fs.writeFile('output.json', JSON.stringify(output) , (err) => {
        if (err) throw err;
        console.log('It\'s saved!');
    });

    insertToDB(output);
}

function insertToDB(data){
    db.open(function() {
        /*
        * Ordered Bulk Insert 測試 
        */
        console.time("Bulk Insert");
        var bulk = db.collection('court').initializeOrderedBulkOp();
        for (var i = 0; i < data.length; i++) {
            bulk.insert(data[i]);
        }
        bulk.execute(function(err,res){
            console.timeEnd("Bulk Insert");
            db.close();
        });        
    });            
}