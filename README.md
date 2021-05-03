Hello there fellow person who is opening this file (prob Vis)! This is a readme file that explains the ins and outs of the bot (files):

#### IMPORTANT ####

Before you go ahead and mess everything up (jk), making a CHANGELOG.md file is absolutely necessary. Not making one will basically mean that i won't look at it (sorry). In the CHANGELOG.md, **every** major chage should be well documented (making comments can help greatly). 

DON'T FORGET TO DO `npm install`

Go nuts!

**COMMAND HANDLER & EVENT HANDLER**

This bot uses a ~custom~ written command that can handle lots of common things like a cooldown, permissions etc. More info in ***./src/utils/structures/BaseCommand.js***. The Event Handler and the Command Handler work the same way, so I won't be explaining again in the ***BaseEvent.js***.

**STRUCTURE**

The structure of the bot is as follows:


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


Honestly, prolly ain't the best configuration, but it works for me

**DATABASE**

It uses [quick.db](https://quickdb.js.org/overview/docs).. Ain't there much to say, other than enjoy the bot.js file >:)

**NOTES**

That's about it, so if you have to ask me anything, feel free to ping me :)

If a command file starts with "_" (underscore), it will not be loaded.