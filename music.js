const Discord = require('discord.js');
const yt = require('ytdl-core');
const colors = require('colors');
const search = require('youtube-search');
const config = require('./config.json');

const bot = new Discord.Client();

var tab = [];
var i = 0;
const prefix = "!!";
var bool = false;

colors.setTheme({
  custom: ['red', 'underline']
});

var opts = {
  maxResults: 3,
  key: config.APIKey
};

function music(voiceChannel, i, bool)
{
    if (bool == true) {
        voiceChannel.join().then(connection => {
            let stream = yt(tab[i], {audioonly: true});
            const streamOptions = { seek: 0, volume: 0.05 };
            const dispatcher = connection.playStream(stream, streamOptions);
            dispatcher.on("end", () => {
              if (i < tab.length) i++;
              if (i >= tab.length) i = 0;
              music(voiceChannel, i, true);
            });
        });
    }
}

bot.on('ready', () => {
  console.log("I am ready!".custom);
  bot.user.setStatus("online", "Need help ? !!help");
});

bot.on('message', message => {
    const voiceChannel = message.member.voiceChannel;


    if (message.content.startsWith(prefix + "play")) {
        bool = true;
        message.delete(message.author);
        if (!voiceChannel) return message.reply("You need to connect a voice channel");
        if (tab[0] == null) return message.reply('No music, please add with `!!add musicname/link`');
        music(voiceChannel, i, true);
        message.channel.sendMessage("Run the playlist with " + tab.length + " music");
        console.log(message.author.username + " run the playlist with " + tab.length + " music");
    }

    else if (message.content.startsWith(prefix + "stop")) {
        message.delete(message.author);
        voiceChannel.leave();
        bool = false;
        music(voiceChannel, i, false);
    }


    // else if (message.content.startsWith(prefix + "next")) {
    //     message.delete();
    //     if (i < tab.length) {
    //         i++;
    //         yt.getInfo(tab[i], function(err, info) {
    //           search(tab[i], opts, function(err, results) {
    //             console.log(results[0].title);
    //             message.channel.sendMessage([
    //               `Music : **${results[0].title}**`,
    //               `Link : ${results[0].link}`
    //             ].join("\n"));
    //           });
    //         });
    //     }
    //
    //     if (i >= tab.length) {
    //       message.channel.sendMessage("No music, please add with `!!add musicname/link` or `!!stop`");
    //       i = 0;
    //       tab = [];
    //       bool = false;
    //       voiceChannel.leave();
    //     }
    //     if(bool) {
    //       music(voiceChannel, i , true)
    //     }
    // }

    else if (message.content.startsWith(prefix + "add")){
        message.delete();
        var link = message.content.split(' ');
        link.shift();
        link = link.join(' ');
        search(link, opts, function(err, results) {
            if(err) return console.log(err);
            for (var y = 0; results[y].kind == 'youtube#channel'; y++);
              console.log(message.author.username + " add " + results[0].title + " in the playlist");
              message.channel.sendMessage([
                `Succesfully add :`,
                `Title : **${results[0].title}**`,
                `Link : **${results[0].link}**`,
                `${tab.length + 1} music in the playlist`
              ]);
              tab[tab.length] = (results[y].link);
        });
    }

    else if (message.content === prefix + "clear") {
        message.delete(message.author);
        tab = [];
        message.channel.sendMessage("Playlist has been deleted");
    }

    else if (message.content.startsWith(prefix + "volume ")) {
      message.delete(message.author);
      var volume = message.content.split(' ');
      volume.shift();
      newvolume = volume / 100;
      var dispatcher = bot.voiceConnections.get(message.guild.id).player.dispatcher
      dispatcher.setVolume(newvolume)
      message.channel.sendMessage(message.author.username + " set volume to " + volume + "%")
    }

    else if (message.content === prefix + "pause") {
      message.delete(message.author);
      var dispatcher = bot.voiceConnections.get(message.guild.id).player.dispatcher
      dispatcher.pause()
      console.log("pause")
    }

    else if (message.content === prefix + "unpause") {
      message.delete(message.author);
      var dispatcher = bot.voiceConnections.get(message.guild.id).player.dispatcher
      dispatcher.resume()
      console.log("unpause")
    }

    if (message.content === "plane") {
      message.channel.sendMessage("http://i.imgur.com/r5D9925.gifv");
    }

    if (message.content === prefix + "help") {
      message.delete(message.author);
      message.channel.sendMessage("Command list :\n```!!media - See help about the media player\n!!botversion - See informations about the bot```");
    }

    if (message.content === prefix + "media") {
      message.delete(message.author);
      message.channel.sendMessage("Command list :\n```!!add <musicname/link> - Add music in the playlist\n!!play - Play music in the playlist\n!!stop - Stop the music\n!!clear - Delete the playlist\n !!next - Play the next video in the playlist (not available now)\n!!pause - Pause music\n!!unpause - Unpause music\n\n!!volume <0-200> - Set bot volume.```");
    }

    if (message.content === prefix + "botversion") {
      message.delete(message.author);
      message.channel.sendMessage([
        `Version : **1.5.7**`,
        `Creator : MrDragonXM15 | **@MrDragonXM15#7887**`,
        `With : {Creaprog} | **@Creaprog#9531**`,
        ``,
        `Info : Play Music, and more ...`
      ].join("\n"));
    }

    if (message.content === prefix + "profil") {
      console.log('Information about '.red + message.author.username.red + ' required'.red);
      message.channel.sendMessage([
        `Username : **${message.author.username}**`,
        `Avatar : ${message.author.avatarURL}`,
        `ID : **${message.author.id}**`,
        `Created on : **${message.author.creationDate}**`,
        `Status on the server : **${message.author.status}**`,
        `Game : **${message.author.game}**`,
      ].join("\n"));
    }

});

bot.login(config.token);
