//imports for initializing bot
var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var emotes = require('./emotes')
var fs = require('fs')
var path = require('path')

global.auth = auth; //this seems very unsafe but im going to do it this way for now.

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
global.logger = logger;

// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
global.bot = bot;

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

//load message commands
const msg_commands_dir = "./message_commands";
var message_commands = []
let msg_command_files = fs.readdirSync(msg_commands_dir);
msg_command_files.forEach((file) => {
    if (file.endsWith(".js")){
        var message_command = require(msg_commands_dir + "/" + file);
        message_commands.push(message_command);
    }
});

console.log(message_commands); //log all loaded message commands



bot.on('message', function (user, userID, channelID, message, evt) {
    console.log(message)
    
    if (message.substring(0, 1) == '!') {
        message_commands.some((command) => {
            if (message.trimLeft().trimRight().startsWith(command.trigger)){
                var err = command.handler(user, userID, channelID, message, evt);
                if (err){
                    bot.sendMessage({
                        to: channelID,
                        message: err
                    });
                }
                return true
            }
        });
    }


});