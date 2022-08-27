# Alias Heaven Bot

This is a Discord bot for the [Alias' Heaven Discord server](discord.gg/zqBVPyvXYe).

## Running the bot

To run the bot, you will have to add a `.env` file to the root of the project (next to the index.js file) with the following contents:

```
BOT_TOKEN=<YOUR_BOT_TOKEN>
MONGO_URI=<YOUR_MONGO_DB_URI>
```

Example file (hopefully invalid, don't use it as they shouldn't work):

```
BOT_TOKEN=LOmqOKAOIHDJOSYzNz49asmA4.YngMNw.67nFtEOE96_DpGUIYwsqmOaYE
MONGO_URI=mongodb+srv://aliasheavenbot:strongpassword123@cluster0.s0qin.mongodb.net/PROJECT-0?retryWrites=true&w=majority
```

Once you do this, install all of the required npm packages with `npm i`. Then you will be able to run the bot with `node .`.

## Contributing

All contributions will be hand-checked before being merged. Make sure to write readable code.
