const form = document.getElementById('contactForm');
const responseDiv = document.getElementById('response');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  fetch('contact.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `name=${name}&email=${email}&message=${message}`
  })
  .then(response => response.text())
  .then((message) => {
    responseDiv.innerHTML = message;
  })
  .catch((error) => {
    responseDiv.innerHTML = 'Error sending message: ' + error.message;
  });
});




// dashboard

// Assuming you have a Discord client instance and a channel ID
const client = new Discord.Client();
const channelID = '1251061246984323199';

// Get the form elements
const embedForm = document.querySelector('form');
const embedTitleInput = document.getElementById('embed-title');
const embedDescriptionInput = document.getElementById('embed-description');
const embedColorInput = document.getElementById('embed-color');

// Add event listener to form submission
embedForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = embedTitleInput.value.trim();
  const description = embedDescriptionInput.value.trim();
  const color = embedColorInput.value;

  if (title && description) {
    // Create a new embed message
    const embed = new Discord.MessageEmbed()
      .setTitle(title)
      .setDescription(description)
      .setColor(color);

    // Send the embed message to the channel
    client.channels.cache.get(channelID).send(embed);
  }
});




