/**
 * Hey ~waves~
 * 
 * This is a quick run-through this file and the command handler in general:
 * 
 * Some of the properties bellow are required, others, optional. 
 * When a value isn't specified, a default one will be used. Obviously for the required values, it will throw an error and the bot won't start!
 * 
 * Syntax :
 *    
 *     ~import things here~
 *  module.exports = class ~Command Name~ extends BaseCommand {
 *      constructor() {
 *          super({
 *              ~props you want here~
 *      })
 *    }
 *      async run(client, message, args) {
 *          const whatever = you.want.here();
 *      }   
 * }
 */
const guild = require('../../models/guildSettings')

module.exports = class BaseCommand {
    constructor({
        name, //Required
        category, //Required
        description, //Required
        usage, //Optional
        cooldown, //Optional
        aliases, //Optional
        permissions, //Optional
        subcommands, //Optional, For specific commands 
        owner, //Optional
        hidden //Optional
    }) 
    {
        
        if (name) {
            this.name = name;
        } else {
            throw new Error("No name provided for the command!");
        }
        if (category) {
            this.category = category;
        } else {
            throw new Error("No category provided for the command");
        }
        if (description) {
            this.description = description;
        } else {
            throw new Error("No description provided for the command");
        }
        if (usage) {
            this.usage = usage;
        } else {
            this.usage = "No usage provided";
        }
        if (cooldown) {
            this.cooldown = cooldown;
        } else {
            this.cooldown = 0;
        }
        if (aliases) {
            this.aliases = aliases;
        } else {
            this.aliases = [];
        }
        if (permissions) {
            this.permissions = permissions;
        } else {
            this.permissions = [];
        }
        if (subcommands) {
            this.subcommands = subcommands;
        } else {
            this.subcommands = [];
        }
        if (owner) {
            this.owner = owner;
        } else if (this.category === "Owner") {
            this.owner = true;
        } else {
            this.owner = false;
        }
        if (hidden) {
            this.hidden = hidden;
        } else if (owner) {
            this.hidden = true;
        } else {
            this.hidden = false;
        }
    }

      /**
  * Get Data from DB
  * @param {number} id
  */
  async getGuildDataDB(id){
    let data = await guild.findOne({guildID: id});
    if(!data) data = await new guild({guildID: id}).save();
    return data;
  }

  /**
  * Get Data from cache
  * @param {number} id
  */
  async getGuildCacheData(client, id){
    let guildData = await client.guildSettings.get(id);
    if(!guildData){
        await this.updateGuildDataCache(id);
        guildData = await client.guildSettings.get(id);
    }
    return guildData;
  }

  /**
  * update cache data
  * @param {number} id
  * @param {Object} newData
  */
  async updateGuildDataCache(client, id, newData){
    let data = await this.getGuildDataDB(id);
    if(newData){
        data = newData;
        await data.save();
    }
    client.guildSettings.set(id, data.gConfig);
  }
}