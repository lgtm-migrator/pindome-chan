import {
  ApplicationCommandType,
  Interaction,
  InteractionResponseType,
  InteractionType,
} from "../src/types";
import { createHandler } from "../src/handler";
import { webhook } from "../src/webhook";

declare const APPLICATION_ID: string;
declare const APPLICATION_SECRET: string;
declare const PUBLIC_KEY: string;
declare const GUILD_ID: string;
declare const DISCORD_WEBHOOK_ID: string;
declare const DISCORD_WEBHOOK_TOKEN: string;

const errorResponse = {
  type: InteractionResponseType.ChannelMessageWithSource,
  data: {
    content: "ピン留めできないみたいです…",
  },
};

const destination = webhook({
  webhookId: DISCORD_WEBHOOK_ID,
  webhookToken: DISCORD_WEBHOOK_TOKEN,
});

const handler = createHandler({
  commands: [
    [
      {
        type: ApplicationCommandType.Message,
        name: "ピン留め",
      },
      (interaction: Interaction) => {
        if (interaction.type !== InteractionType.ApplicationCommand) {
          return errorResponse;
        }
        const messages = interaction.data.resolved?.messages;
        if (messages === undefined) {
          return errorResponse;
        }
        const [message] = Object.values(messages);
        destination({
          ...message,
          content: `${message.content}\nby ${message.author.username}`,
        });
        const PREVIEW_LENGTH = 20;
        let preview = message.content.substr(0, PREVIEW_LENGTH);
        if (PREVIEW_LENGTH <= message.content.length) {
          preview += "...";
        }
        return {
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            content: `ピン留めしましたっ！\n「${preview}」`,
          },
        };
      },
    ],
  ],
  applicationId: APPLICATION_ID,
  applicationSecret: APPLICATION_SECRET,
  publicKey: PUBLIC_KEY,
  guildId: GUILD_ID,
});

addEventListener("fetch", (event) => event.respondWith(handler(event.request)));

console.log("ピン留めちゃん、準備完了ですっ！");