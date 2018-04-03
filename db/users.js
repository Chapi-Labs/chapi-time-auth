const users = [
  { id: '1', username: 'bob', password: 'secret', name: 'Bob Smith' },
  { id: '2', username: 'joe', password: 'password', name: 'Joe Davis' },
];

const findById = (id) => {
  for (let i = 0, len = users.length; i < len; i++) {
    if (users[i].id === id) return users[i];
  }
  return new Error('User Not Found');
};

const findByUsername = (username) => {
  for (let i = 0, len = users.length; i < len; i++) {
    if (users[i].username === username) return users[i];
  }
  return null;
};

export default { findById, findByUsername };