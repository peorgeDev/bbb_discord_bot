//imports for initializing bot
const Discord = require('discord.js');
var logger = require('winston');
var auth = require('./auth.json');
var emotes = require('./emotes')
var fs = require('fs')
var path = require('path')

var channels = require('./channels')

global.channels = channels;

global.auth = auth; //this seems very unsafe but im going to do it this way for now.

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
global.logger = logger;

// Initialize Discord Bot
var bot = new Discord.Client();
bot.login(auth.token);
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
        if (!message_command.trigger || !message_command.handler){
            logger.error("Tried to load a message_command but failed due to missing trigger or handler");
        } else {
            message_commands.push(message_command);
        }
    }
});

console.log(message_commands); //log all loaded message commands



bot.on('message', function (msg) {
    console.log(msg.content)
    
    if (msg.content.substring(0, 1) == '!') {
        message_commands.some((command) => {
            if (msg.content.trimLeft().trimRight().startsWith(command.trigger)){
                var err = command.handler(msg);
                if (err){
                    msg.channel.send(err);
                }
                return true
            }
        });
    }


});