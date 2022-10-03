require('dotenv').config()

const Discord = require('discord.js');
const client = new Discord.Client();
let guildMessage;

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
            if(!checkUser){
                globalMessage = message;
                let lastUser = message.author;

                //see if user is using runelite
                let ingameLocation = detectRunescape(lastUser.presence.activities)
                //print error if user is not running runelite
                if(ingameLocation === undefined){
                    message.channel.send(`${lastUser} Please use Runelite and have your game activity turned on :(`);
                    break;
                }
                users.push(message.author);
                message.channel.send(`Commencing movement for ${lastUser}`);
        
                // moving user (get id from findCorrectChannel)
                let correctChannelID = findCorrectChannel(ingameLocation);
                let channel = message.guild.channels.cache.get(correctChannelID);
                let rMember = message.guild.member(lastUser);
                rMember.voice.setChannel(channel);
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

    if(runeliteActivity === undefined){
        return undefined;
    }    

    let runescapeLocation = runeliteActivity.state;
    return runescapeLocation;
}

function findCorrectChannel(location){
    let correctChannel;
    let channels = client.channels.cache.array();

    //loop through channels
    channels.forEach(channel =>{
        if(location == channel.name){
            console.log(`Found the channel pog!!: ${channel.name}`);
            correctChannel = channel.id;
        }
    });

    //found the channel
    if(correctChannel !== undefined){
        return correctChannel;
    }

    //didn't find the channel
    console.log(`Non existing channel: ${location}`);
}

async function replyMonkey(message, delay, double){
    let daysOfMonkey = ["Sexy monkey sunday", "Macho monkey monday", "Thrilling monkey tuesday", "Wacky monkey wednesday", "Tacky monkey thursday", "Funny monkey friday", "Saggy monkey saturday"];
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