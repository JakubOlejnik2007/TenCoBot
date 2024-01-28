import { CacheType, ChatInputCommandInteraction, Client, TextChannel, EmbedBuilder } from "discord.js";

const mierzejewska = async (interaction: ChatInputCommandInteraction<CacheType>, client: Client) => {
    console.log("Executed")

    try {
        if (!interaction) return;
        const channel = client.channels.cache.get(String(interaction.options.getString('kanal'))) as TextChannel;
        if (!channel) return;
        const messages = await channel.messages.fetch();
        const messagesAsArray = Array.from(messages)
        const messageCount = messages.size;

        if (messageCount > 0) {
            const randomIndex = Math.floor(Math.random() * messageCount);
            const randomMessage = messagesAsArray[randomIndex];
            if (randomMessage[1].content) {
                const embed = new EmbedBuilder({

                })

                await interaction.reply({
                    embeds: [
                        {
                            title: `Złota myśl:`,
                            description: `${interaction.options.getString('kanal') === "1159217859369652245" ? "Mierzejewska mówi" : "Ludź ze szkoły mówi"}: ${randomMessage[1].content}`,
                            color: interaction.options.getString('kanal') === "1159217859369652245" ? 0xff0000 : 0xf9ac00,
                            footer: {
                                text: `TenCoBot, Razem tworzymy społeczność`,
                                icon_url: `https://tenco.waw.pl/img.png`
                            }
                        }
                    ]
                });
            }
        } else {
            await interaction.reply('Brak wiadomości w kanale.');
        }

    } catch (err) {
        console.error('Wystąpił błąd:', err);
        await interaction.reply('Wystąpił błąd podczas przetwarzania komendy.');
    }
}

export default mierzejewska;

