const axios = require("axios");

module.exports = {
    name: "ai",
    description: "Talk to GPT4 (conversational)",
    nashPrefix: false,
    version: "1.0.2",
    cooldowns: 5,
    aliases: ["ai"],
    execute(api, event, args, prefix) {
        const { threadID, messageID, senderID } = event;
        let prompt = args.join(" ");
        if (!prompt) return api.sendMessage("Please enter a prompt.", threadID, messageID);

        if (!global.handle) {
            global.handle = {};
        }
        if (!global.handle.replies) {
            global.handle.replies = {};
        }

        api.sendMessage(
            "[ 𝙲𝙾𝙽𝚅𝙴𝚁𝚂𝙰𝚃𝙸𝙾𝙽𝙰𝙻 𝙰𝙸 ]\n\n" +
            "⏳ Searching for answer..." +
            '\n\n[ 𝚃𝚢𝚙𝚎 "𝚌𝚕𝚎𝚒𝚛" 𝚝𝚘 𝚛𝚎𝚜𝚎𝚝 𝚝𝚑𝚎 𝚌𝚘𝚗𝚟𝚎𝚛𝚜𝚎𝚜𝚜𝚒𝚘𝚟𝚎 𝚠𝚒𝚝𝚑 𝙰𝙸 ]',
            threadID,
            async (err, info) => {
                if (err) return;

                try {
                    const response = await axios.get(
                        `${global.NashBot.ENDPOINT}api/gpt-4o?q=${encodeURIComponent(prompt)}&uid=1`
                    );

                    const aiResponse = response.data.response;

                    api.editMessage(
                        "[ 𝙲𝙾𝙽𝚅𝙴𝚁𝚂𝙰𝚃𝙸𝙾𝙽𝙰𝙻 𝙰𝙸 ]\n\n" +
                        aiResponse +
                        "\n\n[ 𝚁𝙴𝙿𝙻𝚈 𝚃𝙾 𝚃𝙷𝙸𝚂 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 𝚃𝙾 𝙲𝙾𝙽𝚃𝙸𝙽𝚄𝙴 𝚃𝙷𝙴 𝙲𝙾𝙽𝚅𝙴𝚁𝚂𝙰𝚃𝙸𝙾𝙽 𝚆𝙸𝚃𝙷 𝙰𝙸 ]\n\nHow to unsend a message?, react to it with a thumbs up (👍) the bot will automatically unsend the message.",
                        info.messageID
                    );

                    global.handle.replies[info.messageID] = {
                        cmdname: module.exports.name,
                        this_mid: info.messageID,
                        this_tid: info.threadID,
                        tid: threadID,
                        mid: messageID,
                    };
                } catch (error) {
                    console.error("Error fetching data:", error.message);
                    api.sendMessage("Error processing your request: " + error.message, threadID);
                }
            },
            messageID
        );
    },
};
