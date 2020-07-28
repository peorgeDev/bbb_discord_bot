var trigger = "!jnm";
var search = require('youtube-search');

function jnm_handler(user, userID, channelID, message, evt){
    var opts = {
        maxResults: 1,
        key: global.auth.yt_api_key
      };

      let query = "jake and amir " +  message.substring(4);
      global.logger.info("Searching youtube for: " + query);
      search(query, opts, function(err, results) {
        if(err) return console.log(err);
       
        global.bot.sendMessage({
            to: channelID,
            message: results[0].link
        });
      });

    return ""
};

module.exports = {
    trigger: trigger,
    handler: jnm_handler
};