const socket = io();

const urlSearch = new URLSearchParams(window.location.search);
const username = urlSearch.get('username');
const room = urlSearch.get('select_room');

const welcomeMessage = document.getElementById('username');
welcomeMessage.innerHTML = `Olá ${username}, você está na sala ${room}`;

socket.emit(
  'select_room',
  {
    username,
    room,
  },
  (messages) => {
    messages.forEach((msg) => createMessage(msg));
  }
);

document.getElementById('message_input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const message = e.target.value;

    const data = {
      room,
      message,
      username,
    };

    socket.emit('message', data);
    e.target.value = '';
  }
});

socket.on('message', (data) => {
  createMessage(data);
});

const createMessage = (data, state) => {
  const message = document.getElementById('messages');
  message.innerHTML += `
  <div class="new_message">
    <label class="form-label">
      <strong>${data.username}</strong> <span>${data.text} - ${dayjs(
    data.createdAt
  ).format('DD/MM HH:mm')}</span>
    </label>
  </div>
  `;
};

document.getElementById('logout').addEventListener('click', () => {
  const data = {
    username: username,
    message: 'saiu da sala',
  };

  socket.emit('message', data);
  createMessage(data);

  window.location.href = 'index.html';
});
