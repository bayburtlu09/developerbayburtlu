const { EmbedBuilder,PermissionsBitField } = require("discord.js");
module.exports = {
    name:"unban",
    description: 'Belirlenen kullanının yasağını kaldırır',
    type:1,

    options: [
        {
            name:"id",
            description:"Yasağı kaldılacak Kullanıcıyı Seçin",
            type:3,
            required:true
        }
    ],
    run: async (client, interaction) => {
        const model = require("../models/ban")
        const data = await model.findOne({ guildID: interaction.guild.id }) || null;

        const banRol = data ? data.roleID : null;

        if(
            interaction.member.roles.cache.has(banRol) ||
            interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)
            
         ){
            const id = interaction.options.getString('id')
            try{
                await interaction.guild.bans.fetch(id)
                .then((s) =>{
                 console.log(s)   
                      interaction.guild.members.unban(id);
                      
                      const embed = new EmbedBuilder()
                      .setAuthor({name:interaction.member.user.tag,iconURL:interaction.member.user.avatarURL({dynamic:true})})
                      .setDescription(`<@!${id}> isimli kullanıcının yasağı kaldırıldı`)
                      .setColor("Green");
                      interaction.reply({embeds:[embed]});
                })
            }
             catch{  interaction.reply({content:'Kullanıcı Bulunamadı',  ephemeral: true}) }    
            }
        else  return interaction.reply({content:"Bu komutu kullanmak için yetkiniz yok",ephemeral:true});
    }
};