const trigger = "!quoteoftheday"

const random = require('random-seed')


//this currently only works correctly for the first 100 quotes added to the channel, need to add pagination for proper functionality
async function quoteoftheday_handler(msg){
    var quotes_channel = global.bot.channels.cache.get(global.channels.quotes_channel);
    var last_100_messages =  Array.from((await quotes_channel.messages.fetch({limit: 100})).values());
    
    let d = new Date();
    let seed = toString(d.getFullYear() )+ toString(d.getMonth()) + toString(d.getDate());
    let rng = random.create(seed);
    let ind = rng.range(Math.min(100, last_100_messages.length));
    
    let msgOfDay = last_100_messages[ind].content;
    msg.channel.send(msgOfDay);
}

module.exports = {
    trigger: trigger,
    handler: quoteoftheday_handler
}