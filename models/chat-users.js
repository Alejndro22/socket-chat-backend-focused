class ChatUsers {
  constructor() {
    this.users = {};
  }

  get usersArr() {
    return Object.values(this.users);
  }

  connectUser(user) {
    this.users[user.id] = user;
  }

  disconnectUser(id) {
    delete this.users[id];
  }
}

export default ChatUsers;
