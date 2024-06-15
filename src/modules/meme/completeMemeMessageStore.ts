class CompleteMemeMessageStore {
    completeMemeMessages: any[] = [];

    addMessage(userId: any, messageId: any) {
        this.completeMemeMessages.splice(this.completeMemeMessages.findIndex(x => x.userId === userId), 1);
    
        this.completeMemeMessages.push({
            userId,
            messageId
        });
    }
    
    findMessageByUser(userId: any) {
        return this.completeMemeMessages.find(x => x.userId === userId)?.messageId;
    }
}

const completeMemeMessageStore = new CompleteMemeMessageStore();

export default completeMemeMessageStore;