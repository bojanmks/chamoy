import sendTextReply from "@modules/messaging/sendTextReply";

export default (daysLeft: any, interaction: any) => {
    sendTextReply(interaction, `${daysLeft} days left`, true);
};