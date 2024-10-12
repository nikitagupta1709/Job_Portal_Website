// UserModal class represents a user and contains methods for managing user data.
export default class UserModal {
  constructor(id, name, email, password) {
    // Initialize the UserModal instance with the provided parameters
    this.id = id; // Unique identifier for the user
    this.name = name; // Name of the user
    this.email = email; // Email of the user
    this.password = password; // Password of the user
  }

  // Static method to add a new user to the users array
  static add(name, email, password) {
    // Create a new user instance and add it to the users array
    const newUser = new UserModal(users.length + 1, name, email, password);
    users.push(newUser); // Add the new user to the users array
  }

  // Static method to check if a user exists by email
  static isUserExist(email) {
    // Find a user in the users array with the matching email
    const result = users?.find((u) => u.email === email);
    return result; // Return the user if found, otherwise undefined
  }

  // Static method to validate a user's email and password
  static isValidUSer(email, password) {
    // Find a user in the users array with the matching email and password
    const result = users.find(
      (ele) => ele.email == email && ele.password == password
    );
    return result; // Return the user if valid, otherwise undefined
  }
}

// Array to hold user data
var users = [
  {
    id: 1,
    name: "Nikita",
    email: "nikita@test.com",
    password: "niki",
  },
];
