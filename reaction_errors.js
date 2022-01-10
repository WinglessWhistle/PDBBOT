const { MessageEmbed } = require("discord.js");

const ErrorEmoji = '⚠️';

async function HandleError(message, e) {
    // React with an emoji. If the user reacts within 15 seconds, show the error.
    await message.react(ErrorEmoji);

    const filter = (reaction, user) => {
        return reaction.emoji.name === ErrorEmoji && user.id === message.author.id;
    };

    const collector = message.createReactionCollector({ filter, time: 15_000, max: 1 });
    collector.on('collect', () => PrintError(message.channel, e))
}
function PrintError(channel, e) {
    // Send the error off to the channel.
    const embed = new MessageEmbed()
        .setColor("#FF0000")
        .setTitle("Error")
        .setDescription(e.toString());
    channel.send({ embeds: [embed] });
}

module.exports = { HandleError, PrintError };