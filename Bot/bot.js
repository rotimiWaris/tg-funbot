import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const bot = new Telegraf(process.env.BOT_TOKEN);

// Command to start the game
bot.command('start', (ctx) => {
  const username = ctx.from.username || "Guest";
  const gameLink = `https://rotimiwaris.github.io/tg-funbot/username=${encodeURIComponent(
    username
  )}`;
  ctx.reply(
    `Click the link to start the game: [Play Whack-a-Mole](${gameLink})`,
    { parse_mode: "Markdown" }
  );
});

// Launch the bot
bot.launch();
console.log("Bot is running!");