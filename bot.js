require('dotenv').config()

const Discord = require('discord.js');
const client = new Discord.Client();
let guildMessage;
let botIsRunning = 1;

//users that have opted into using the bot via the command
let users = [];

client.on('ready', () => {
	console.log('BOOM!!');
});

client.on('message', message => {
    //Check if message is exactly this (or else use contains to check for keywords inside messages)
    guildMessage = message;
    switch(message.content){
        case "commence moving":
            let checkUser = true;
            users.forEach(element =>{
                if(element == message.author){
                    checkUser = false;
                    message.reply("I'm already tracking you :O");
                }
            });
            if(checkUser){
                users.push(message.author);
                globalMessage = message;
                message.channel.send(users);
                // message.channel.send(`User: ${user}`);
                // message.channel.send(`Username: ${user.username}`);
                // message.channel.send(`ID: ${message.author.id}`);
                lastUser = users[users.length - 1];
                let ingameLocation = detectRunescape(lastUser.presence.activities)
                if(ingameLocation !== undefined){
                    message.channel.send(`Commencing movement for ${lastUser}`);
        
                    // moving user (get id from findCorrectChannel)
                    let correctChannelID = findCorrectChannel(ingameLocation);
                    let channel = message.guild.channels.cache.get(correctChannelID);
                    let rMember = message.guild.member(lastUser);
                    rMember.voice.setChannel(channel);
                }else{
                    message.channel.send("Please use Runelite and have your game activity turned on :(");
                    users.splice(-1,1);
                }
            }
            break;
        case "terminate cease":
            message.channel.send("I'll stop :(");
            users.forEach(element => {
                if(element == message.author){
                    users.splice(users.indexOf(message.author), 1);
                }
            });
            break;
    }
    //to check if a message contains a keyword
    if(message.content.toLowerCase().includes("monkeys") && message.author.id !== client.user.id){
        replyMonkey(message, 350, true);
    }else if(message.content.toLowerCase().includes("monkey") && message.author.id !== client.user.id){
        replyMonkey(message, 350, false);
    }
});

client.on('presenceUpdate', () => {
    //console.log("Called poggerschamp");
    users.forEach(element => {
        if(element !== undefined){
            let ingameLocation = detectRunescape(element.presence.activities)
            let correctChannelID = findCorrectChannel(ingameLocation);
            let channel = guildMessage.guild.channels.cache.get(correctChannelID);
            let rMember = guildMessage.guild.member(element);
            rMember.voice.setChannel(channel);
        }
    });
});

function detectRunescape(activities){
    let runeliteActivity;
    activities.forEach(entry => {
        if(entry.name === "RuneLite"){
            runeliteActivity = entry;
        }
    });
    if(runeliteActivity !== undefined){
        let runescapeLocation = runeliteActivity.state;
        return runescapeLocation;
    }else{
        return undefined;
    }
}

function findCorrectChannel(location){
    let correctChannel;
    let channels = client.channels.cache.array();
    channels.forEach(channel =>{
        if(location == channel.name){
            console.log(`Found the channel pog!!: ${channel.name}`);
            correctChannel = channel.id;
        }
    });
    if(correctChannel === undefined){
        console.log(`Non existing channel: ${location}`);
    }else{
        return correctChannel;
    }
}

async function replyMonkey(message, delay, double){
    let daysOfMonkey = ["Sexy monkey sunday", "Macho monkey monday", "Thrilling monkey tuesday", "Wacky monkey wednesday", "Tacky monkey thursday", "Funny monkey friday", "Saggy monkey saturday"]
    let monkeyArray = [":monkey:",":monkey_face:",":see_no_evil:",":hear_no_evil:",":speak_no_evil:"];
    let plural = "monkey";
    let today = new Date();
    message.channel.send(monkeyArray[Math.floor(Math.random() * monkeyArray.length)]);
    if(double){
        message.channel.send(monkeyArray[Math.floor(Math.random() * monkeyArray.length)]);
        plural = "monkeys";
    }
    await sleep(delay);
    message.channel.send("haha funny " + plural);
    message.channel.send(daysOfMonkey[today.getDay()]);
}


function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

client.login(process.env.BOT_TOKEN);