const model = require("../models/guild");
const klm = require("../models/yasaklıKelime");
const kelimeler = require("../kfr.json");
const linkler = require("../lnks.json");
const { EmbedBuilder, Client, Message, PermissionsBitField } = require("discord.js");
/**
 *
 * @param {Client} _
 * @param {Message} oldMessage
 * @param {Message} newMessage
 * @returns
 */
module.exports = async (_, oldMessage, newMessage) => {
  if (oldMessage.author.bot) return;
  if (oldMessage.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return;
  const {
    kfrEngel,
    lnkEngl,
    modlogChannel,
    kelimeEngl,
  } = (await model.findOne({ guildID: oldMessage.guild.id })) || {
    kelimeEngl: false,
    modlogChannel: null,
    kfrEngel: false,
    lnkEngl: false,
  };
  if (!modlogChannel) return;

  const channel = oldMessage.guild.channels.cache.get(modlogChannel);
  if (!channel) return;
  try {
    channel.send({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: oldMessage.member.user.tag,
            iconURL: oldMessage.member.user.avatarURL(),
          })
          .setDescription(
            `**${oldMessage.member} tarafından gönderilen mesaj ${oldMessage.channel} kanalında güncellendi!** [Mesaja Git](${newMessage.url})`
          )
          .addFields(
            {
              name: "Eski Mesaj",
              value: `\`\`\`${oldMessage.content}\`\`\``,
              inline: false,
            },
            {
              name: "Yeni Mesaj",
              value: `\`\`\`${newMessage.content}\`\`\``,
              inline: false,
            }
          )

          .setColor("#2ACAEA")
          .setFooter({ text: `${oldMessage.guild.name}` })
          .setTimestamp(),
      ],
    });
  } catch { }

  if (kfrEngel) {
    let blacklist = kelimeler;
    let foundInText = false;
    for (var i in blacklist) {
      if (newMessage.content.toLowerCase().includes(blacklist[i].toLowerCase()))
        foundInText = true;
    }
    if (foundInText) {
      newMessage.delete();
      newMessage.channel.send({
        embeds: [
          {
            description: `Hey! ${newMessage.author}, beni kandırmaya mı çalışıyorsun? Ben sunucuda küfürlere izin vermiyorum`,
          },
        ],
      });
      return;
    }
  }
  if (lnkEngl) {
    let blacklist = linkler;
    let foundInText = false;
    for (var i in blacklist) {
      if (newMessage.content.toLowerCase().includes(blacklist[i].toLowerCase()))
        foundInText = true;
    }
    if (foundInText) {
      newMessage.delete();
      newMessage.channel.send({
        embeds: [
          {
            description: `Hey! ${newMessage.author}, beni kandıramazsın dostum! Ben bu sunucuda link paylaşmana izin vermem`,
          },
        ],
      });
      return;
    }
  }
  if (kelimeEngl) {
    const { bKlm } = await klm.findOne({ GuildID: message.guild.id });
    let blacklist = bKlm;
    let foundInText = false;
    for (var i in blacklist) {
      if (message.content.toLowerCase().includes(blacklist[i].toLowerCase()))
        foundInText = true;
    }
    if (foundInText) {
      message.delete();
      message.channel.send({
        embeds: [
          {
            description: `Hey! ${message.author}, bu kelime bu sunucda yasaklanmış!`,
          },
        ],
      });
      return;
    }
  }
};
