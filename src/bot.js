require("dotenv").config();

const Discord = require("discord.js");
const client = new Discord.Client();
const PREFIX = "!";
const ADMINPREFIX = ".";
const fs = require("fs");
const Team = require("./class/team");
const questions = require("./class/question");

var teams = [];
client.commands = new Discord.Collection();

const commandFiles = fs
  .readdirSync(`./src/commands/`)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on("ready", () => {
  console.log(`${client.user.tag}`);
  // console.log(questions);
});

client.on(`message`, (message) => {
  if (message.author.bot) return;
  var team = teams.filter((team) => {
    return team.id === message.channel.id;
  })[0];
  try {
    var teamnumber = team.number;
    var currquestion = questions[team.current - 1];
    // console.log(currquestion);
  } catch (err) {
    var teamnumber = "none";
  }
  console.log(
    `[${message.author.tag} in team ${teamnumber}]: ${message.content} `
  );

  if (message.content.startsWith(PREFIX)) {
    const [CMD_NAME, ...args] = message.content
      .trim()
      .substring(PREFIX.length)
      .split(/\s+/);
    if (CMD_NAME === "answer") {
      if (team.stage === "Question") {
        if (
          message.content
            .toLowerCase()
            .includes(currquestion.answer.toLowerCase())
        ) {
          team.completequestion();
          message.channel.send(currquestion.challenge);
        } else {
          message.channel.send("Your answer is not correct");
        }
      } else {
        message.channel.send(
          "You are doing challenge, please tag @Admin to submit your answer"
        );
      }
    }
    if (CMD_NAME === "next") {
      if (team.stage === "Question") {
        message.channel.send(currquestion.question);
      } else {
        message.channel.send(
          "You have not complete your challenge challenge, please tag @Admin to submit your answer"
        );
      }
    }
    if (CMD_NAME === "clear") {
      client.commands.get("clear").execute(message, args);
    }
  }
  if (message.content.startsWith(ADMINPREFIX)) {
    if (message.author.bot) return;
    if (message.member.roles.cache.find((r) => r.name === "Admin")) {
      const [CMD_NAME, ...args] = message.content
        .trim()
        .substring(PREFIX.length)
        .split(/\s+/);
      if (CMD_NAME === "createteam") {
        teams[Number(args.toString()) - 1] = new Team(
          Number(args.toString()),
          message.channel.id
        );
        console.log(teams);
        message.channel.send("Created Team " + args.toString());
      }
      if (CMD_NAME === "progress") {
        teams.forEach((e) => {
          message.channel.send(
            `Team ${e.number} is currently doing ${e.stage} at question ${
              e.current
            }, their question series: ${e.questionseries.toString()}`
          );
        });
      }
      if (CMD_NAME === "complete") {
        if (
          team.current == team.questionseries[team.questionseries.length - 1]
        ) {
          message.channel.send(
            "Congrats you have finish the whole game YAYYYYYYYYYYYYYYYY"
          );
        } else {
          message.channel.send(
            `Congrats, you have completed your challenge for this location. Please use \`!next\` to continue`
          );
          team.completechallenge();
        }
      }
      if (CMD_NAME === "start") {
        message.channel.send(currquestion.question);
      }
      if (CMD_NAME === "answer") {
        message.channel.send(currquestion.answer.toLowerCase());
      }
    } else {
      message.reply("You don't have permission to use this command");
    }
  }
});

client.login(process.env.BOT_TOKEN);
