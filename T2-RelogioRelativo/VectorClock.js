class VectorClock {
  constructor(neighboors, this_port) {
    this._vector = [];

    let neighboors_data = neighboors.toString().split(',');
    for (let i in neighboors_data) {
      this._vector.push({
        "process_name": `P${i}`,
        "process_host": neighboors_data[i].split(':')[0],
        "process_port": neighboors_data[i].split(':')[1],
        "is_neighboor": ((neighboors_data[i].split(':')[1] !== this_port.toString()) &&
                         (neighboors_data[i].split(':')[0] === '127.0.0.1')),
        "counter": 0
      });
    }
  }
  get vector() {
    return _vector;
  }
  getPositionCurrentNode(vector_pos){
    return !vector_pos["is_neighboor"];
  }
  increment() {
    this._vector.forEach(v => {
      if (!v.is_neighboor) v.counter++;
    })
  }
  merge(data) {
    for (let i in data._vector) {
      if (data._vector[i].counter > this._vector[i].counter) {
        this._vector[i].counter = data._vector[i].counter;
      }
    }
  }
  print() {
    console.table(this._vector);
  }
}

module.exports = VectorClock;