var SplatnetScraper = require('./splatoon/scraper-main'),
    async = require('async'),
    Permit = require('./security/permit'),
    server = require('./info/server'),
    user = require('./info/user'),
    music = require('./music/commands'),
    command = require('./command-utilities'),
    auth = require('./auth.json');

var splatnet = new SplatnetScraper();

var channel = {
  default: {
    cooldown: 600,
    help: '',
    script: function(bot, message, args) {
      message.channel.sendMessage('channel default stub function');
    },
  },
  info: {
    cooldown: 600,
    help: '',
    script: function(bot, message, args) {
      var channel = message.channel;
      var info = '';
      info += '__**' + channel.name + '**__\n';
      info += 'id: ' + channel.id + '\n';

      message.channel.sendMessage(info);
    },
  },
}

var commands = {
  list: {
    help: {
      cooldown: 0,
      help: 'call this command to get help',
      script: function(bot, message, args) {
        if (args[0]) {
          message.channel.sendMessage( commands.list[args[0]].help);
        } else {
          //list commands
          message.channel.sendMessage( Object.keys(commands.list).toString());
        }
      },
    },

    user: {
      cooldown: 600,
      help: 'user commands',
      script: function(bot, message, args) {
        if (args[0]) {
          if (user[args[0]]) {
            user[args[0]].script(bot, message, args.slice(1));
          } else {
            message.channel.sendMessage( 'there is no user command: ' + args[0]);
          }
        } else {
          user.default.script(bot, message, args);
        }
      },
    },

    servers: {
      cooldown: 600,
      help: 'a list of servers this bot is in',
      script: function(bot, message, args) {
        message.channel.sendMessage( bot.servers);
      },
    },

    server: {
      cooldown: 600,
      help: 'server specific commands',
      script: function(bot, message, args) {
        if (args[0]) {
          if (server[args[0]]) {
            server[args[0]].script(bot, message, args.slice(1));
          } else {
            message.channel.sendMessage( 'command not supported');
          }
        } else {
          server.default.script(bot, message, args);
        }
      },
    },

    channel: {
      cooldown: 600,
      help: 'server specific commands',
      script: function(bot, message, args) {
        if (args[0]) {
          channel[args[0]].script(bot, message, args);
        } else {
          channel.default.script(bot, message, args);
        }
      },
    },

    channels: {
      cooldown: 600,
      help: 'a list of channels this bot is in',
      script: function(bot, message, args) {
        message.channel.sendMessage( message.channels);
      },
    },

    schedule: {
      cooldown: 600,
      help: 'upcoming map rotations in splatoon',
      script: function(bot, message, args) {
        splatnet.getSchedule(function(err, newMess) {
          message.channel.sendMessage(newMess);
        });
      },
    },

    selky: {
      cooldown: 600,
      help: 'what a selky is',
      script: function(bot, message, args) {
        message.channel.sendMessage( 'Is quiet and oblivious, and sometimes very hilarious without even trying to be. ' +
          'She hates being seen as cute and enjoy watching other people cry, for science of course. ' +
          "She's very hard working when it comes to the things she's passionate about.");
      },
    },

    invite: {
      cooldown: 600,
      help: 'make the bot join another discord server',
      script: function(bot, message, args) {
        var invite = "https://discordapp.com/oauth2/authorize?client_id=" + auth.discord.client_id + "&scope=bot&permissions=0"
        message.channel.sendMessage( invite);
      }
    },

    permit: {
      cooldown: 600,
      help: 'permit bot to speak in this channel',
      userGroups: ['owner', 'creator'],
      script: Permit.permit,
    },

    forbid: {
      cooldown: 600,
      help: 'prevent bot from speaking in this channel',
      userGroups: ['owner', 'creator'],
      script: Permit.forbid,
    },

    music: {
      cooldown: 600,
      help: 'bot plays music',
      script: command.useNested(music),
    }
  },

  parse: function parseCommand(messageContent) {
    var args = messageContent.slice(1).split(' ');
    return {
      command: args[0].toLowerCase(),
      arguments: args.slice(1),
    }
  },
};

//create an alias
commands.list['dj'] = commands.list.music;

module.exports = commands;
