require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  ChannelType,
  PermissionsBitField,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  AttachmentBuilder
} = require("discord.js");

const fs = require('fs');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ],
});

let userCount = 0;

client.once("ready", async () => {
  console.log(`Bot ${client.user.tag} is online!`);
  await updateUserCount();
});

client.on("guildMemberAdd", async () => {
  await updateUserCount();
});

client.on("guildMemberRemove", async () => {
  await updateUserCount();
});

async function updateUserCount() {
  try {
    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    await guild.members.fetch();
    userCount = guild.memberCount;
    console.log(`The server has ${userCount} members.`);
  } catch (error) {
    console.error("Error fetching user count:", error);
  }
}

function getUserCount() {
  return userCount;
}

async function createTicketChannel(guild, userId, ticketType) {
  try {
    const user = await guild.members.fetch(userId);

    const ticketChannel = await guild.channels.create({
      name: `${ticketType}-ticket-${user.user.username}`,
      type: ChannelType.GuildText,
      topic: `Ticket Type: ${ticketType}, User: ${user.user.tag}`,
      parent: process.env.TICKET_CATEGORY_ID, // Replace with your category ID
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
          ],
        },
      ],
    });

    const claimButton = new ButtonBuilder()
      .setCustomId("claim")
      .setLabel("Claim")
      .setStyle(ButtonStyle.Primary);

    const closeButton = new ButtonBuilder()
      .setCustomId("close")
      .setLabel("Close")
      .setStyle(ButtonStyle.Danger);

    const editButton = new ButtonBuilder()
      .setCustomId("edit")
      .setLabel("Edit")
      .setStyle(ButtonStyle.Secondary);

    const unclaimButton = new ButtonBuilder()
      .setCustomId("unclaim")
      .setLabel("Unclaim")
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(
      claimButton,
      closeButton,
      editButton,
      unclaimButton
    );

    await ticketChannel.send({
      content: `**Ticket Creation Detected!!**\n> *<@${user.user.id}> state your concern regarding your **${ticketType} ticket***\nSupport Staff will be with you shortly.\nWarm Regards,\n<@&${process.env.SUPPORT_STAFF_ROLE_ID}>`,
      embeds: [
        {
          title: `Welcome to your ticket, ${user.user.username}!`,
          description: `Hello there!\nWe are thrilled to hear your queries about your ${ticketType} request.\n\nState your request/concern below, and we will get back to you shortly.`,
          color: 0x202020,
          footer: {
            text: `Ticket System by KNH | Ticket Type: ${ticketType}`,
            iconUrl: `https://cdn.discordapp.com/avatars/${user.user.id}/${user.user.avatar}.png`,
          },
          thumbnail: {
            url: `https://media.discordapp.net/attachments/1252939977109798912/1252940094617161779/aboutimg-removebg-preview.png?ex=6676ade5&is=66755c65&hm=685855244e8466f135f51e4978dee80cda3886a952f5bb62930664d64754298b&=&format=webp&quality=lossless&width=423&height=423`,
          },
        },
      ],
      components: [row],
    });

    client.on("interactionCreate", async (interaction) => {
      if (!interaction.isButton()) return;

      switch (interaction.customId) {
        case "claim":
          await handleClaim(interaction);
          break;
        case "close":
          await handleClose(interaction);
          break;
        case "edit":
          await handleEdit(interaction);
          break;
        case "unclaim":
          await handleUnclaim(interaction);
          break;
        default:
          break;
      }
    });

    return ticketChannel;
  } catch (error) {
    console.error("Error creating ticket channel:", error);
    throw error;
  }
}

async function handleClaim(interaction) {
  try {
    if (!interaction.member.roles.cache.has(process.env.SUPPORT_STAFF_ROLE_ID)) {
      await interaction.reply({ content: "Only Support Staff can claim tickets.", ephemeral: true });
      return;
    }
    await interaction.deferUpdate();
    // Logic for claiming the ticket
    await interaction.followUp({ content: "Ticket has been claimed!", ephemeral: true });
  } catch (error) {
    console.error("Error handling claim:", error);
  }
}

async function handleClose(interaction) {
  try {
    if (!interaction.member.roles.cache.has(process.env.SUPPORT_STAFF_ROLE_ID)) {
      await interaction.reply({ content: "Only Support Staff can close tickets.", ephemeral: true });
      return;
    }
    await interaction.deferUpdate();
    const channel = interaction.channel;
    if (channel) {
      const messages = await channel.messages.fetch();
      const transcript = messages.map(m => `${m.author.tag}: ${m.content}`).join('\n');
      fs.writeFileSync('transcript.txt', transcript);
      const attachment = new AttachmentBuilder('transcript.txt');

      const logChannel = await client.channels.fetch(process.env.LOG_CHANNEL_ID);
      if (logChannel) {
        await logChannel.send({ content: `Transcript for ticket channel ${channel.name}:`, files: [attachment] });
      }

      await channel.delete();
    } else {
      console.error("Channel not found!");
    }
  } catch (error) {
    if (error.code === 10003) {
      console.error("Channel already deleted or not found.");
    } else {
      console.error("Error closing the channel:", error);
    }
  }
}

async function handleEdit(interaction) {
  try {
    await interaction.deferUpdate();
    // Logic for editing the ticket
    await interaction.followUp({ content: "You can edit your ticket now!", ephemeral: true });
  } catch (error) {
    console.error("Error handling edit:", error);
  }
}

async function handleUnclaim(interaction) {
  try {
    if (!interaction.member.roles.cache.has(process.env.SUPPORT_STAFF_ROLE_ID)) {
      await interaction.reply({ content: "Only Support Staff can unclaim tickets.", ephemeral: true });
      return;
    }
    await interaction.deferUpdate();
    // Logic for unclaiming the ticket
    await interaction.followUp({ content: "Ticket has been unclaimed!", ephemeral: true });
  } catch (error) {
    console.error("Error handling unclaim:", error);
  }
}

client.login(process.env.TOKEN).catch(console.error);

module.exports = { getUserCount, client, createTicketChannel };
