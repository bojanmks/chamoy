class CompleteMemeMessageStore {
    completeMemeMessages = [];

    addMessage(userId, messageId) {
        this.completeMemeMessages.splice(this.completeMemeMessages.findIndex(x => x.userId === userId), 1);
    
        this.completeMemeMessages.push({
            userId,
            messageId
        });
    }
    
    findMessageByUser(userId) {
        return this.completeMemeMessages.find(x => x.userId === userId)?.messageId;
    }
}

const completeMemeMessageStore = new CompleteMemeMessageStore();

module.exports = completeMemeMessageStore;