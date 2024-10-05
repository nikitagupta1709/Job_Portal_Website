export default class UserModal {
  constructor(id, name, email, password) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }
  static add(name, email, password) {
    const newUser = new UserModal(users.length + 1, name, email, password);
    users.push(newUser);
    console.log("newUser", newUser);
  }

  static isValidUSer(email, password) {
    const result = users.find(
      (ele) => ele.email == email && ele.password == password
    );
    return result;
  }
}

var users = [];
