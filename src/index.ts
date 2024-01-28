import { ChatInputCommandInteraction, Client, IntentsBitField } from "discord.js";
import config from "./config";
import mierzejewska from "./commands/getRandomMierzejewskaMessage";
import "./commands/registerSlashCommands";


const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildVoiceStates
    ]
});

const greet = (interaction: any) => interaction.reply("Hey!")

client.on('ready', (c) => {
    console.log(`${c.user.tag} is online.`)
})

client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    console.log(interaction.commandName)
    switch (interaction.commandName) {
        case "hey": greet(interaction); break;
        case "zlotamysl": mierzejewska(interaction, client); break;
    }
});

client.login(config.token);