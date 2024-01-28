import { ChatInputCommandInteraction, CacheType, GuildMember, Guild } from "discord.js";
import { VoiceConnection, createAudioPlayer, createAudioResource, entersState, getVoiceConnection, joinVoiceChannel, VoiceConnectionStatus, StreamType, PlayerSubscription } from '@discordjs/voice';
import Queue from "../utils/queue";
import { getInfo } from "ytdl-core-discord";
import get from "axios";
import config from "../config";
import ytdl from "ytdl-core";
import { generateDependencyReport } from '@discordjs/voice';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
console.log(generateDependencyReport());

const urlPattern: RegExp = /^(https?|ftp):\/\//i

type MusicItem = {
    title: string;
    url: string;
}

class MusicControls {
    private queue: Queue<MusicItem> = new Queue();


    async handlePlay(interaction: ChatInputCommandInteraction<CacheType>) {
        const options = interaction.options;
        const titleOrUrl = options.getString('title');

        if (titleOrUrl) {
            try {
                const voiceChannel = (interaction.member as GuildMember | null)?.voice?.channel;

                if (!voiceChannel) {
                    interaction.reply('You need to be in a voice channel to use this command.');
                    return;
                }

                let info;

                if (urlPattern.test(titleOrUrl)) {
                    info = await getInfo(titleOrUrl);
                } else {
                    const searchResponse = await get('https://www.googleapis.com/youtube/v3/search', {
                        params: {
                            q: titleOrUrl,
                            part: 'snippet',
                            type: 'video',
                            key: config.ytApiKey,
                        },
                    });

                    const videoId = searchResponse.data.items[0]?.id?.videoId;

                    if (!videoId) {
                        throw new Error('No matching videos found.');
                    }

                    info = await getInfo(videoId);
                }

                const title = info.videoDetails.title;
                const url = info.videoDetails.video_url;

                const musicItem: MusicItem = { title, url };
                this.queue.push(musicItem);
                console.log("Odpalone")

                // Sprawdź, czy bot jest już połączony z kanałem głosowym
                const voiceConnection = interaction.guildId ? getVoiceConnection(interaction.guildId) : null;

                if (!voiceConnection || voiceConnection.state.status === VoiceConnectionStatus.Destroyed) {
                    // Jeśli nie, dołącz do kanału
                    console.log("Before joining voice channel");
                    const connection = joinVoiceChannel({
                        channelId: voiceChannel.id,
                        guildId: String(interaction.guildId),
                        adapterCreator: (interaction.guild as Guild).voiceAdapterCreator,
                    });
                    console.log("After joining voice channel");


                    // Odtwórz utwór
                    await this.play(connection);
                    interaction.reply(`Playing ${title} to the queue.`);
                } else {
                    interaction.reply(`Added ${title} to the queue.`);
                }
            } catch (error) {
                console.error('Error:', error);
                interaction.reply('An error occurred while processing the request.');
            }
        } else {
            interaction.reply('Please provide a title or URL for the song.');
        }
    }

    // Funkcja do odtwarzania utworu
    async play(connection: VoiceConnection) {
        console.log("Executed")
        const currentSong = this.queue.front();

        if (currentSong) {
            const stream = ytdl(currentSong.url, { filter: 'audioonly' });
            console.log(stream)
            const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });

            const audioPlayer = createAudioPlayer();
            console.log(resource);
            console.log(audioPlayer)
            const subscription = connection.subscribe(audioPlayer);
            console.log(subscription)
            console.log("Grane")
            audioPlayer.play(resource);

            await entersState(connection, VoiceConnectionStatus.Ready, 5000);
            this.queue.pop();
            console.log("Zagrane")
        } else {
            // Kolejka jest pusta, opuść kanał głosowy
            connection.destroy();
        }
    }

    handleSkip(interaction: ChatInputCommandInteraction<CacheType>) {
        const currentSong = this.queue.front();
        if (currentSong) {
            interaction.reply(`Skipping: ${currentSong.title}`);
            this.queue.pop();
        } else {
            interaction.reply('The queue is empty.');
        }
    }

    handleNowPlaying(interaction: ChatInputCommandInteraction<CacheType>) {
        const currentSong = this.queue.front();
        if (currentSong) {
            interaction.reply(`Now playing: ${currentSong.title}`);
        } else {
            interaction.reply('The queue is empty.');
        }
    }

    handleQueue(interaction: ChatInputCommandInteraction<CacheType>) {
        const queueItems = this.queue.getElements();
        if (queueItems.length > 0) {
            const queueList = queueItems.map((item, index) => `${index + 1}. ${item.title}: ${item.url}`).join('\n');
            interaction.reply(`Queue:\n${queueList}`);
        } else {
            interaction.reply('The queue is empty.');
        }
    }

}

export default MusicControls;