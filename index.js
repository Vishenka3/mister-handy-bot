const TelegramBot = require('node-telegram-bot-api');
const request = require('request');
const stym=require('static-yandex-map');
const mongoose = require('mongoose');
const ymaps = require('ymaps');

const https = require('https');
const url = require('url');

const weather_app_id = "f1bcc65e";
const weather_app_key = "045b08148266c1ff3be30d337c632722";

mongoose.connect("mongodb://localhost/handyDB");
mongoose.Promise = global.Promise;

let connection = mongoose.connection;
let usersTable = null;

connection.once('open', function () {
    connection.db.collection("user", function(err, collection){
        usersTable = collection;
        /*collection.find({tgID: 323}).toArray(function(err, data){
            console.log('result: ' + data[0]);// it will print your collection data
        });*/
    });
});


let token = '560722483:AAEoI7WdqU0_sfw1W8zZ6uJ3sYvnKqM0H7U';
let bot = new TelegramBot(token, {polling: true});

let opts = {
    reply_markup: JSON.stringify({
        keyboard: [
            ['/help','/sethome'],
            [{
                text: "My location",
                request_location: true
            }]
        ],
        resize_keyboard: true
    })
};


bot.onText(/\/exchange/i, function (msg) {
    const adwancedOptions = {
        reply_to_message_id: msg.message_id,
        reply_to_message_text: msg.text,
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'BTC-USD', callback_data: 'bt-us' }],
                [{ text: 'BTC-RUR', callback_data: 'bt-ru' }],
                [{ text: 'BTC-EUR', callback_data: 'bt-eu' }],
                [{ text: 'LTC-USD', callback_data: 'lt-us' }],
                [{ text: 'LTC-RUR', callback_data: 'lt-ru' }],
                [{ text: 'LTC-EUR', callback_data: 'lt-eu' }],
                [{ text: 'RUR-EUR', callback_data: 'ru-eu' }],
                [{ text: 'RUR-USD', callback_data: 'ru-us' }],
            ],
            one_time_keyboard: true,
            selective: true
        })
    };

    bot.sendMessage(msg.from.id, "Какая валюта нужна?", adwancedOptions);

    bot.on('callback_query', function (callback) {
        const msg = callback.message;
        console.log(callback.message);
        console.log(callback.data);
        let answer = callback.data;

        if (answer === 'bt-us') {
            let url = 'https://wex.nz/api/3/ticker/btc_usd';
            request(url, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    let bodyJson = JSON.parse(body);
                    let message = 'Продажа 1 BTC: ' + bodyJson.btc_usd.sell + '$ 🇺🇸 \r\n';
                    message += 'Покупка 1 BTC: ' + bodyJson.btc_usd.buy + '$ 🇺🇸';
                    bot.answerCallbackQuery(callback.id)
                        .then(() => bot.sendMessage(msg.chat.id, message));
                }
            });
        } else if (answer === 'bt-ru') {
            let url = 'https://wex.nz/api/3/ticker/btc_rur';
            request(url, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    let bodyJson = JSON.parse(body);
                    let message = 'Продажа 1 BTC: ' + bodyJson.btc_rur.sell + 'p. 🇷🇺 \r\n';
                    message += 'Покупка 1 BTC: ' + bodyJson.btc_rur.buy + 'p. 🇷🇺';
                    bot.answerCallbackQuery(callback.id)
                        .then(() => bot.sendMessage(msg.chat.id, message));
                }
            });
        } else if (answer === 'bt-eu') {
            let url = 'https://wex.nz/api/3/ticker/btc_eur';
            request(url, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    let bodyJson = JSON.parse(body);
                    let message = 'Продажа 1 BTC: ' + bodyJson.btc_eur.sell + ' &#8364; \r\n';
                    message += 'Покупка 1 BTC: ' + bodyJson.btc_eur.buy + ' &#8364;';
                    bot.answerCallbackQuery(callback.id)
                        .then(() => bot.sendMessage(msg.chat.id, message));
                }
            });
        } else if (answer === 'lt-us') {
            let url = 'https://wex.nz/api/3/ticker/ltc_usd';
            request(url, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    let bodyJson = JSON.parse(body);
                    let message = 'Продажа 1 LTC: ' + bodyJson.ltc_usd.sell + '$ 🇺🇸 \r\n';
                    message += 'Покупка 1 LTC: ' + bodyJson.ltc_usd.buy + '$ 🇺🇸';
                    bot.answerCallbackQuery(callback.id)
                        .then(() => bot.sendMessage(msg.chat.id, message));
                }
            });
        }else if(answer === 'lt-ru') {
            let url = 'https://wex.nz/api/3/ticker/ltc_rur';
            request(url, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    let bodyJson = JSON.parse(body);
                    let message = 'Продажа 1 LTC: ' + bodyJson.ltc_rur.sell + 'p. 🇷🇺 \r\n';
                    message += 'Покупка 1 LTC: ' + bodyJson.ltc_rur.buy + 'p. 🇷🇺';
                    bot.answerCallbackQuery(callback.id)
                        .then(() => bot.sendMessage(msg.chat.id, message));
                }
            });
        }else if (answer === 'lt-eu') {
            let url = 'https://wex.nz/api/3/ticker/ltc_eur';
            request(url, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    let bodyJson = JSON.parse(body);
                    let message = 'Продажа 1 LTC: ' + bodyJson.ltc_eur.sell + ' €; \r\n';
                    message += 'Покупка 1 LTC: ' + bodyJson.ltc_eur.buy + ' €;';
                    bot.answerCallbackQuery(callback.id)
                        .then(() => bot.sendMessage(msg.chat.id, message));
                }
            });
        }else if(answer === 'ru-us') {
            let url = 'https://wex.nz/api/3/ticker/usd_rur';
            request(url, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    let bodyJson = JSON.parse(body);
                    let message = 'Продажа 1 USD: ' + bodyJson.usd_rur.sell + '$ 🇺🇸 \r\n';
                    message += 'Покупка 1 USD: ' + bodyJson.usd_rur.buy + '$ 🇺🇸';
                    bot.answerCallbackQuery(callback.id)
                        .then(() => bot.sendMessage(msg.chat.id, message));
                }
            });
        }else if(answer === 'ru-eu') {
            let url = 'https://wex.nz/api/3/ticker/eur_rur';
            request(url, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    let bodyJson = JSON.parse(body);
                    let message = 'Продажа 1 EUR: ' + bodyJson.eur_rur.sell + ' €; \r\n';
                    message += 'Покупка 1 EUR: ' + bodyJson.eur_rur.buy + ' €;';
                    bot.answerCallbackQuery(callback.id)
                        .then(() => bot.sendMessage(msg.chat.id, message));
                }
            });
        }
    });
});

bot.onText(/Скажи (.+)/i, function (msg, match) {
    bot.sendMessage(msg.from.id, match[1]);
});

bot.onText(/Спасибо/i, function (msg) {
    bot.sendMessage(msg.from.id, 'Я всегда рядом:)');
});

bot.onText(/Привет/i, function (msg) {
    if(msg.chat.id === 356127672){
        bot.sendMessage(msg.from.id, 'Долгой жизни тебе, за то, что создал меня!');
    }else if(msg.chat.id === 434038737){
        bot.sendMessage(msg.from.id, 'Котик, ето ты?! Ето правда ты!? Приветик:3');
    }else if(msg.chat.id === 144074802){
        bot.sendMessage(msg.from.id, 'А вот ты такой себе. не буду с тобой здороваться:(');
    }else {
        bot.sendMessage(msg.from.id, 'Привет, ' + msg.from.first_name);
    }
});

bot.onText(/\/nearestmetro/i, function (msg) {
    let myCoords =[];

    bot.sendMessage(msg.from.id, 'Где ты сейчас находишься?', {
        reply_markup: JSON.stringify({
            keyboard: [
                [{
                    text: "Вот тут.",
                    request_location: true
                }]
            ],
            resize_keyboard: true
        })
    });

    bot.once("location",(msg)=>{
            myCoords = [msg.location.longitude,msg.location.latitude];

            //let url = 'https://geocode-maps.yandex.ru/1.x/?format=json&geocode=54.7388,55.9721'/*'+myCoords[0] +',' +myCoords[1] +'*/ +'&spn=0.032069,0.030552&kind=metro&rspn=1';
            let url = 'https://geocode-maps.yandex.ru/1.x/?format=json&geocode='+myCoords[0] +',' +myCoords[1]+'&spn=0.032069,0.030552&kind=metro&rspn=1';
            console.dir('url: ' +url);
            request(url, { json: true }, (err, res, body) => {
                if (err) {
                    bot.sendMessage(msg.chat.id, "Ошибочка:( Будем исправлять.");
                    return console.log(err);
                }
                let metros = body.response.GeoObjectCollection.featureMember;
                //console.log(metros[0].GeoObject.Point);
                if(metros.length!==0) {
                    let  s=new stym(myCoords[0],myCoords[1])
                        .setType('map')
                        .setSize(650,450)
                        .setZ(13)
                        .setLang('en-US');
                    for (let i = 0; i < metros.length; i++) {
                        s.addPoint(metros[i].GeoObject.Point.pos.split(' ')[0],metros[i].GeoObject.Point.pos.split(' ')[1],'pm2','rd','l',i+1);
                    }
                    bot.sendMessage(msg.chat.id, "Отлично. Вот ближайшие к тебе станции: \n" + s.getUrl());
                    //s.getUrl();
                }else{
                    bot.sendMessage(msg.from.id, 'Поблизости нет метро:(');
                }
            });
    });
});


bot.onText(/Покажи/i, function (msg, match) {
    bot.sendMessage(msg.from.id, 'Вы не сказали, что вам необходимо показать. попробуйте еще раз.');
});


bot.onText(/Покажи (.+)/i, function (msg, match) {
    let myCoords =[];

    console.log('match: ' +match);
    let string = match[1].split(' ');
    string = string.join('%20');


    console.log('mycoords: ' +myCoords);
    let url = 'https://geocode-maps.yandex.ru/1.x/?format=json&geocode='+match[1] + '';
    console.log('url: ' +url);
    request(url, { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        console.log('url:' +url);
        let place = body.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos;
        if(place.length!==0) {
            let  s=new stym(place.split(' ')[0],place.split(' ')[1])
                .setType('map')
                .setSize(650,450)
                .setZ(13)
                .setLang('en-US')
                .addPoint(place.split(' ')[0],place.split(' ')[1],'pm2','rd','l',1);
            bot.sendMessage(msg.chat.id, "Отлично. Вот место, о котором ты спрашивал: \n" + s.getUrl());
        }else{
            bot.sendMessage(msg.from.id, 'Поблизости нет метро:(');
        }
    });

});

bot.onText(/\/traffic/i, function (msg) {
    let myCoords =[];

    bot.sendMessage(msg.from.id, 'Где ты сейчас находишься?', {
        reply_markup: JSON.stringify({
            keyboard: [
                [{
                    text: "Вот тут.",
                    request_location: true
                }]
            ],
            resize_keyboard: true
        })
    });

    bot.once("location",(msg)=>{
        myCoords = [msg.location.longitude,msg.location.latitude];
        console.log('mycoords: ' +myCoords);
        let  s=new stym(myCoords[0],myCoords[1])
            .setType('traffic')
            .setSize(650,450)
            .setZ(14)
            .setLang('en-US');
        bot.sendMessage(msg.chat.id, "Отлично. Текущая ситуация с транспортом такова: \n" + s.getUrl());
    });
});

bot.onText(/\/currentweather/i, function (msg) {

    bot.sendMessage(msg.from.id, 'Выберете локацию для прогноза:', {
        reply_markup: JSON.stringify({
            keyboard: [
                [{
                    text: "Home location",
                    request_location: false
                }],
                [{
                    text: "Current location",
                    request_location: true
                }]
            ],
            resize_keyboard: true
        })
    });

    bot.once("location",(msg)=>{
        myCoords = [msg.location.longitude,msg.location.latitude].join(',');
        console.log('myCoords: ' + myCoords);
        let url = 'http://api.weatherunlocked.com/api/current/' + myCoords + '?lang=ru&app_id=' + weather_app_id + '&app_key=' + weather_app_key + '';
        console.dir('url: ' + url);
        request(url, {json: true}, (err, res, body) => {
            if (err) {
                return console.log(err);
            }
            bot.sendMessage(msg.from.id, '<b>Текущая погода у вас:</b>\n       Температура: '+body.temp_c+'C\n       Скорость ветра: '+body.windspd_ms+'м/с \n       Направление: '+body.windspd_ms, {parse_mode: 'HTML'});
        });
    });

    bot.on('message', function (msg) {
        console.log(msg.text);
        if(msg.text === "Home location") {
            usersTable.find({tgID: msg.chat.id}).toArray(function (err, data) {
                myCoords = data[0].home_location;
                console.log('myCoords: ' + myCoords);
                let url = 'http://api.weatherunlocked.com/api/current/' + myCoords[1] + ',' + myCoords[0] + '?lang=ru&app_id=' + weather_app_id + '&app_key=' + weather_app_key + '';
                console.dir('url: ' + url);
                request(url, {json: true}, (err, res, body) => {
                    if (err) {
                        return console.log(err);
                    }
                    bot.sendMessage(msg.from.id, '<b>Текущая погода у вас:</b>\n       Температура: '+body.temp_c+'C\n       Скорость ветра: '+body.windspd_ms+'м/с \n       Направление: '+body.windspd_ms, {parse_mode: 'HTML'});
                });
            });
        }
    });
});

bot.onText(/\/forecastweather/i, function (msg) {
    bot.sendMessage(msg.from.id, 'Выберете локацию для прогноза:', {
        reply_markup: JSON.stringify({
            keyboard: [
                [{
                    text: "Home location c/w",
                    request_location: false
                }],
                [{
                    text: "Current location",
                    request_location: true
                }]
            ],
            resize_keyboard: true
        })
    });

    bot.on('message', function (msg) {
        console.log(msg.text);
        if(msg.text === "Home location c/w") {
            usersTable.find({tgID: msg.chat.id}).toArray(function (err, data) {
                myCoords = data[0].home_location;
                console.log('myCoords: ' + myCoords);
                let url = 'http://api.weatherunlocked.com/api/forecast/' + myCoords[1] + ',' + myCoords[0] + '?lang=ru&app_id=' + weather_app_id + '&app_key=' + weather_app_key + '';
                console.dir('url: ' + url);
                request(url, {json: true}, (err, res, body) => {
                    if (err) {
                        return console.log(err);
                    }
                    bot.sendMessage(msg.from.id, '<b>Погода на неделю:</b>\n', {parse_mode: 'HTML'});
                    for (let i = 0; i < 7; i++) {
                        bot.sendMessage(msg.from.id, '<i>Дата: ' + body.Days[i].date + '</i> \n       Максимальная температура: ' + body.Days[i].temp_max_c + 'C \n       Минимальная температура: ' + body.Days[i].temp_min_c + 'C\n       Восход: ' + body.Days[i].sunrise_time + ' \n       Закат: ' + body.Days[i].sunset_time, {parse_mode: 'HTML'});
                    }
                });
            });
        }
        bot.on('message', function (msg) {return false});
    });

    bot.once("location",(msg)=>{
        myCoords = [msg.location.longitude,msg.location.latitude].join(',');
        console.log('myCoords: ' + myCoords);
        let url = 'http://api.weatherunlocked.com/api/forecast/' + myCoords + '?lang=ru&app_id=' + weather_app_id + '&app_key=' + weather_app_key + '';
        console.dir('url: ' + url);
        request(url, {json: true}, (err, res, body) => {
            if (err) {
                return console.log(err);
            }
            bot.sendMessage(msg.from.id, '<b>Погода на неделю:</b>\n', {parse_mode: 'HTML'});
            for (let i = 0; i < 7; i++) {
                bot.sendMessage(msg.from.id, '<i>Дата: ' + body.Days[i].date + '</i> \n       Максимальная температура: ' + body.Days[i].temp_max_c + 'C \n       Минимальная температура: ' + body.Days[i].temp_min_c + 'C\n       Восход: ' + body.Days[i].sunrise_time + ' \n       Закат: ' + body.Days[i].sunset_time, {parse_mode: 'HTML'});
            }
        });
    });
});

bot.onText(/\/SendPussy/i, function (msg) {
    let chatId = msg.chat.id;
    let number = randomInteger(1,10);
    let photo = 'assets/nudes/'+number+'.jpg';
    bot.sendPhoto(chatId, photo, {caption: 'Милые котята'});
});

let notes = [];

bot.onText(/Напомни (.+) в (.+)/i, function (msg, match) {
    let userId = msg.from.id;
    let text = match[1];
    let time = match[2];

    notes.push( { 'uid':userId, 'time':time, 'text':text } );
    bot.sendMessage(userId, 'Отлично! Я обязательно напомню, если не сдохну :)');
});

setInterval(function(){
    for (let i = 0; i < notes.length; i++){
        let curDate = new Date().getHours() + ':' + new Date().getMinutes();
        if ( notes[i]['time'] === curDate ) {
            bot.sendMessage(notes[i]['uid'], 'Напоминаю, что вы должны: '+ notes[i]['text'] + ' сейчас.');
            notes.splice(i,1);
        }
    }
},1000);

bot.onText(/start/, function (msg, match) {
    let userId = msg.from.id;
    usersTable.insert({tgID: msg.from.id, first_name: msg.from.first_name, last_name: msg.from.last_name, username: msg.from.username,});
    bot.sendMessage(userId, 'Ну привет, бродяга! А у тебя смешное имя, ' + msg.from.first_name + ' :)\nТы ведь знаешь что, чтобы узнать меня поближе тебе надо написать /help ?', opts);
});

bot.onText(/\/help/, function (msg) {
    let userId = msg.from.id;
    bot.sendMessage(userId, 'Хух, так, ну шо, малой, смотри и запоминай, что я тебе тут снизу напишу.\nА то совсем не сможешь со мной общаться.\n\n' +
        'Список моих комманд:\n' +
        '/help - Для слабых.\n' +
        '/exchange - Текущий курс валют.\n' +
        '/currentweather - Текущая погода.\n' +
        '/forecastweather - Прогноз погоды на неделю.\n' +
        '/nearestmetro - Получить расположение ближайших станций метро.\n' +
        '/traffic - Я покажу тебе загруженнолсть дорог.\n' +
        '/sethome - Скажите мне ваш домашний адрес.\n' +
        '/setphone - Дайте мне ваш номерочек.\n' +
        '\nПривет - и я вежливо с тобой поздороваюсь.\n' +
        'Покажи PLACE - Я покажу место на карте.\n' +
        'Напомни ACTION в TIME(ЧЧ:ММ) - И я напомню тебе сделать свои грязные делишки. Надеюсь ты справишься с синтаксисом команды\n\n' +
        'Ну, удачи тебе, путник!');
});

bot.onText(/\/sethome/, function (msg) {
    let userId = msg.from.id;

    bot.sendMessage(userId, 'Если ты сейчас дома, то нажми на кнопочки снизу, и отправь мне свой адресок.', {
        reply_markup: JSON.stringify({
            keyboard: [
                [{
                    text: "Send Home Location",
                    request_location: true
                }]
            ],
            resize_keyboard: true
        })
    });

    bot.once("location",(msg)=>{
        bot.sendMessage(msg.chat.id, "Success! Your home is here: " + [msg.location.longitude,msg.location.latitude].join(";"));
        usersTable.update({tgID: msg.from.id},{$set:{home_location: [msg.location.longitude,msg.location.latitude]}});
    });
});

bot.onText(/\/setphone/, function (msg) {
    let userId = msg.from.id;

    bot.sendMessage(userId, 'text', {
        reply_markup: JSON.stringify({
            keyboard: [
                [{
                    text: "Send Phone Number",
                    request_contact: true
                }]
            ],
            resize_keyboard: true
        })
    });

    bot.once("contact",(msg)=>{
        bot.sendMessage(msg.chat.id, "Success! Your phone is: " + msg.contact.phone_number);
        usersTable.update({tgID: msg.from.id},{$set:{phone_number: msg.contact.phone_number}});
    });
});

function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    rand = Math.round(rand);
    return rand;
}