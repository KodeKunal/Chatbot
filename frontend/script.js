document.addEventListener('DOMContentLoaded', () => {
  const chatOutput = document.getElementById('chat-output');
  const input = document.getElementById('chat-input');
  const sendButton = document.getElementById('send-button');

  const scrollToBottom = () => {
    chatOutput.scrollTop = chatOutput.scrollHeight;
  };

  const addMessage = (message, isBot = false) => {
    const messageDiv = document.createElement('div');
    messageDiv.innerHTML = `<strong>${isBot ? 'Bot' : 'You'}:</strong> ${message}`;
    chatOutput.appendChild(messageDiv);
    scrollToBottom();
  };

  const handleSubmit = async () => {
    const message = input.value.trim();
    if (!message) return;

    input.value = '';
    addMessage(message);

    try {
      const response = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      addMessage(data.reply, true);
    } catch (error) {
      console.error('Error:', error);
      addMessage(`Error: ${error.message}`, true);
    }
  };

  sendButton.addEventListener('click', handleSubmit);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSubmit();
  });
});
