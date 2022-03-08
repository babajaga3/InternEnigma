### //Deprecated - Bot is out of order, since the server no longer uses it ###

Hello there fellow GitHub traveler who is opening this file! This is a README file that explains the ins and outs of the bot (files):

#### IMPORTANT ####
-I greatly advise making a `CHANGELOG.md` to keep track of changes.

-DON'T FORGET TO DO `npm install`

Go nuts!

**COMMAND HANDLER & EVENT HANDLER**

This bot uses a ~custom~ command that can handle lots of common things like a cooldown, permissions etc. More info in ***./src/utils/structures/BaseCommand.js***. The Event Handler and the Command Handler work the same way, so I won't be explaining again in the ***BaseEvent.js***.

**STRUCTURE**

--BASE FOLDER
 |___.env
 
 |___json.sqlite
 
 |___package.json
 
 |___package-lock.json
 
 |___slappey.json
 
 |___src
 
    |__commands
    
        |_ ...Category Folder
        
    |__events
    
        |_ ...Event Folder
        
    |__utils
    
        |_registry.js
        
        |_structures
        
        |_functions //honestly useless
        
        |_models  
        
        |_config 
        
    |__bot.js

**DATABASE**

InternEnigma as of now uses [quick.db](https://quickdb.js.org/overview/docs)

**NOTES**

-That's about it, so if you have to ask me anything, feel free to DM me on Discord (FClorp#7777)

-If a command file starts with "_" (underscore), it will not be loaded.
