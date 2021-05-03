module.exports = class BaseEvent {
    constructor({
        name
    }) {
        this.name = name;
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
}