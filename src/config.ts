import dotenv from "dotenv";

type TBotConfig = {
    token: string;
    clientId: string;
    serverId: string;
    ytApiKey: string;
}

dotenv.config();

const { TOKEN, CLIENT_ID, SERVER_ID, YT_API_KEY } = process.env;

const config: TBotConfig = {
    token: String(TOKEN),
    clientId: String(CLIENT_ID),
    serverId: String(SERVER_ID),
    ytApiKey: String(YT_API_KEY)
}

export default config;