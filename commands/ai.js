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
            "•| 𝙱𝙾𝙶𝙰𝚁𝚃 𝙰𝙸 𝙱𝙾𝚃 |•\n\n" +
            "⏳ Searching for answer..." +
            '\n\n•| 𝙲𝚁𝙴𝙰𝚃𝙴𝙳 𝙱𝚈 𝙱𝙾𝙶𝙰𝚁𝚃 𝙶𝚆𝙰𝙿𝙾 |•',
            threadID,
            async (err, info) => {
                if (err) return;

                try {
                    const response = await axios.get(
                        `${global.NashBot.ENDPOINT}api/gpt-4o?q=${encodeURIComponent(prompt)}&uid=1`
                    );

                    const aiResponse = response.data.response;

                    api.editMessage(
                        "•| 𝙱𝙾𝙶𝙰𝚁𝚃 𝙰𝙸 𝙱𝙾𝚃 |•\n\n" +
                        aiResponse +
                        "\n\n•| 𝙲𝚁𝙴𝙰𝚃𝙴𝙳 𝙱𝚈 𝙱𝙾𝙶𝙰𝚁𝚃 𝙶𝚆𝙰𝙿𝙾 |•",
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
