const BaseCommand = require("../../utils/structures/BaseCommand");
const config = require("../../utils/config/config.json");
const { messageOrEmbed } = require("../../utils/models/converter.js");
require("dotenv").config();
const { MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");
const path = require("path");
const { stripIndents } = require("common-tags");

module.exports = class HelpCommand extends BaseCommand {
    constructor() {
        super({
            name: "help",
            category: "Help",
            description: "The help command",
            usage: "[command]",
            aliases: ["h", "commands", "cmds", "cmdhelp", "cmdshelp"],
        });
    }

    async run(client, message, args) {
        let command = client.commands.get(args[0]);
        const filePath = path.join(process.cwd(), "/src/commands");
        const dirs = (source) =>
            readdirSync(source, {
                withFileTypes: true,
            })
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => dirent.name);

        if (command) {
            const commandembed = new MessageEmbed()
                .setFooter(config.usagefooter)
                .setColor(message.member.displayHexColor || "RANDOM")
                .setTitle(command.name.split(" ").map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase()).join(" ") + " command")
                .setDescription(stripIndents`\`Command Description\` - **${command.description}**
                \`Command Usage\` - **${
                  command.usage === "No arguments"
                    ? command.usage
                    : config.prefix +
                      command.name +
                      " " +
                      command.usage
                }**
                \`Command Aliases\` - **${
                  !command.aliases.length
                    ? "No aliases"
                    : command.aliases.join(" ")
                }**
                \`Command Cooldown\` - **${command.cooldown}s**
                \`Required Permissions\` - **${
                  !command.permissions.length
                    ? "No required permissions"
                    : command.permissions
                        .toString()
                        .replace("_", " ")
                        .split(" ")
                        .map(
                          (w) => w[0].toUpperCase() + w.substr(1).toLowerCase()
                        )
                        .join(" ")
                }**
                ${
                  command.subcommands.length
                    ? `\`Subcommands\` - **${command.subcommands}**`
                    : ""
                }`);
            message.channel.send(commandembed);
        } else {
            const embed = new MessageEmbed()
                .setTitle("Help Command")
                .setThumbnail(
                    message.member.user.avatarURL({
                        dynamic: true,
                        size: 512,
                    })
                )
                .setColor(message.member.displayHexColor || "RANDOM")
                .setDescription(`Commands for **Radon**.
            Made with :heart: in <:js:814395678944002069>
            by **FClorp#0003**`);

            for (const category of dirs(filePath)) {
                function onlyUnique(value, index, self) {
                    return self.indexOf(value) === index;
                }

                var cmdnames = [];
                for (let cmd of client.commands) {
                    if (cmd[1].category === category && cmd[1].category !== "Owner") cmdnames.push(cmd[1].name);
                }

                var unique = cmdnames.filter(onlyUnique);
                if (category !== "Owner") {
                    embed.addField(category, "`" + unique.join("` `") + "`", false);
                }
            }

            message.channel.send(embed);
        }
    }
};