export default class JobModel {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  static getAll() {
    return jobs;
  }
}

var jobs = [];
