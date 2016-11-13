"use strict";

const Discord = require('discord.js');
const yt = require('ytdl-core');
const colors = require('colors');
const search = require('youtube-search');


const Music = require("./Music.js");
const config =  require("./config.json")

const bot = new Discord.Client();
var music = new Music();
const prefix = config.prefix;

var musicName = [];
var i = 0;
var pos = 0;

colors.setTheme({
  custom: ['green', 'underline']
});

const opts = {
  maxResults: 3,
  key: config.APIKey
};

bot.on('ready', () => {
  console.log("I am ready!".custom);
  bot.user.setStatus("online", "Need help ? !!help");
});

bot.on('message', message => {
    music.setVoiceChannel(message.member.voiceChannel);
    var array_msg = message.content.split(' ');
    switch (array_msg[0]) {
        case (prefix + "play") :
            message.delete(message.author);
            if (!music.getVoiceChannel()) return message.reply("You need to connect a voice channel");
            if (music.getTab(0) == null) return message.reply("No music, please add with `!!add musicname/link`");
            else music.voice();
            break;
        case (prefix + "pause") :
            message.delete(message.author);
            music.pause();
            break;
        case (prefix + "resume") :
            message.delete(message.author);
            music.resume();
            break;
        case (prefix + "stop") :
            message.delete(message.author);
            music.stop();
            musicName = [];
            break;
        case (prefix + "clear") :
            message.delete(message.author);
            message.channel.sendMessage("Playlist deleted succesfully")
            music.clear();
            musicName = [];
            break;
        case (prefix + "add") :
            message.delete(message.author);
            var link = message.content.split(' ');
            link.shift();
            link = link.join(' ');
            search(link, opts, function(err, results) {
                if(err) return console.log(err);
                for (var y = 0; results[y].kind == 'youtube#channel'; y++);
                message.channel.sendMessage([
                    `Succesfully add :`,
                    `Title : **${results[0].title}**`,
                    `Link : **${results[0].link}**`,
                    `${musicName.length + 1} music in the playlist`
                ]);
                musicName[musicName.length] = (results[y].title);
                music.setTabEnd(results[y].link);
            });
            break;
        case (prefix + "volume") :
            message.delete(message.author);
            var link = message.content.split(' ');
            link.shift();
            link = link.join(' ');
            music.volume(link/100);
            message.channel.sendMessage(`${message.author.username} set volume to ${link}%`);
            break;
        case (prefix + "playlist") :
            message.delete(message.author);
            if (musicName[0] == null) return message.channel.sendMessage("No music, please add with `!!add musicname/link`");
            else {
                while (i < musicName.length) {
                    pos = i+1;
                    message.channel.sendMessage(`${pos} : ${musicName[i]}`);
                    i++
                }
                console.log(musicName);
                i = 0;
            }
            break;
        // remove music in the playlist (work in progress)
        /*case (prefix + "remove") :
            message.delete(message.author);
            
            var link = message.content.split(' ');  
            var id = parseInt(link[1], 10);
           
            var newLink = id-1;
            var nom = musicName[newLink];
            var removed = musicName.splice(newLink, 1);
            music.remove(newLink);
            message.channel.sendMessage(`**${nom}** deleted succesfully !`);
            break;*/
    }

    if (message.content === prefix + "plane") {
      message.channel.sendMessage("http://i.imgur.com/r5D9925.gifv");
    }

    else if (message.content === prefix + "help") {
      message.delete(message.author);
      message.channel.sendMessage("Command list :\n```!!media - See help about the media player\n!!botversion - See informations about the bot```");
    }

    else if (message.content === prefix + "media") {
      message.delete(message.author);
      message.channel.sendMessage("Command list :\n```!!add <musicname/link> - Add music in the playlist\n!!play - Play music in the playlist\n!!stop - Stop the music\n!!clear - Delete the playlist\n!!pause - Pause music\n!!unpause - Unpause music\n\n!!volume <0-200> - Set bot volume.\n!!playlist - See music in playlist.```");
    }

    else if (message.content === prefix + "botversion") {
      message.delete(message.author);
      message.channel.sendMessage([
        `Version : **1.6.9**`,
        `Creator : MrDragonXM15 | **@MrDragonXM15#7887**`,
        `With : {Creaprog} | **@Creaprog#9531**`,
        ``,
        `Info : Play Music, and more ...`
      ].join("\n"));
    }

    else if (message.content === prefix + "profil") {
      console.log('Information about '.red + message.author.username.red + ' required'.red);
      message.channel.sendMessage([
        `Username : **${message.author.username}**`,
        `Avatar : ${message.author.avatarURL}`,
        `ID : **${message.author.id}**`,
      ].join("\n"));
    }

//skip music (work in progress)
/*
    if (message.content.startsWith(prefix + "next")) {
        message.delete(message.author);
        if (i < tab.length) i++;
        if (i >= tab.length) i = 0;
        voiceChannel.leave();
        music(voiceChannel, i);
    }
*/

});

bot.login(config.token);
