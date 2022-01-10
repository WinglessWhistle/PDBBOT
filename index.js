const Discord = require('discord.js');
const ErrorMsg = require('./reaction_errors.js');
require('dotenv').config();
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS", "GUILD_MESSAGE_REACTIONS"] });
const prefix = '!';
const fs = require('fs');

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    console.log(`Found command ${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('Phazordatabase bot live');
}
)

client.on('guildMemberAdd', guildMember => {

    guildMember.guild.channels.cache.get('756455138977251433').send(`Welcome <@${guildMember.user.id}>!`)
});

client.on('message', message => {
    // Bail out if we didn't get a command.
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // Split the message on each whitespace charater, drop the first arg and use it as our command.
    const args = message.content.slice(prefix.length).split(/s+/);
    const command = args.shift().toLowerCase();

    try {
        // Check to see if the command exists and execute it.
        if (client.commands.has(command)) {
            client.commands.get(command).execute(message, args);
        }
        // We don't the user know command exitsts??? 😕🤷
        else {
            throw new Error(`The \`${command}\` command does not exist.`);
        }
    }
    catch (e) {
        ErrorMsg.HandleError(message, e);
    }
});

//Must Be Bottom Of File
client.login(process.env.DISCORDTOKEN);