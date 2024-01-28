import config from '../config';
import { ApplicationCommandOptionType, REST, Routes } from "discord.js";

type TCommand = {
    name: string;
    description: string;
    options?: any
}

const commands: TCommand[] = [
    {
        name: "hey",
        description: "Replies with hey👋!"
    },
    {
        name: "zlotamysl",
        description: "Bot wylosuje złotą myśl Sz. P. Mierzejewskiej, która ma męża programistę.",
        options: [
            {
                name: 'kanal',
                description: 'Wybierz kanał cytatów do wyboru złotej myśli',
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    {
                        name: 'najlepszeteksty',
                        value: '1159217859369652245' // Zastąp CHANNEL_ID_1 ID pierwszego kanału
                    },
                    {
                        name: 'cytatyludzizeszkoly',
                        value: '1100843413982695486' // Zastąp CHANNEL_ID_2 ID drugiego kanału
                    }
                ]
            }
        ]
    },
    {
        name: "play",
        description: "Odtwórz ten utwór!",
        options: [
            {
                name: 'title',
                description: 'Tytuł utworu do odtworzenia lub jego adres url!',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ],
    },
    {
        name: "skip",
        description: "Pomiń ten utwór!"
    },
    {
        name: "nowplaying",
        description: "Co teraz jest grane?"
    },
    {
        name: "queue",
        description: "Co teraz będzie grane?"
    }
]

const rest = new REST(
    {
        version: "10"
    }
);

rest.setToken(config.token);

const register = async () => {
    try {
        await rest.put(
            Routes.applicationCommands(config.clientId), {
            body: commands
        }
        )
        console.log(`Slash command registered.`)
    } catch (err: any) {
        console.error(err.rawError.errors["1"].options["0"]);
    }
}

register();