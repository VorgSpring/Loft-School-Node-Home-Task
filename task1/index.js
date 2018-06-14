const commandsManager = require(`./commands/index`);
const userCommand = process.argv[2];

commandsManager(userCommand);
