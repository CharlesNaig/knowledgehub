const client = new Discord.Client();
const channelID = '1251061246984323199';

client.login(process.env.TOKEN  );

const embedForm = document.querySelector('form');
const embedTitleInput = document.getElementById('embed-title');
const embedDescriptionInput = document.getElementById('embed-description');
const embedColorInput = document.getElementById('embed-color');

embedForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = embedTitleInput.value.trim();
  const description = embedDescriptionInput.value.trim();
  const color = embedColorInput.value;

  if (title && description) {
    const embed = new Discord.MessageEmbed()
     .setTitle(title)
     .setDescription(description)
     .setColor(color);

    client.channels.cache.get(channelID).send(embed)
     .then((message) => console.log(`Embed message sent successfully!`))
     .catch((error) => console.error(`Error sending embed message: ${error}`));
  }
});


// script.js
const floatingButton = document.getElementById('floating-button');
const discordButton = document.getElementById('discord-button');
const contactButton = document.getElementById('contact-button');
const contactForm = document.getElementById('contact-form');
const closeFormButton = document.getElementById('close-form');

// Show the smaller buttons when the floating button is clicked
floatingButton.addEventListener('click', () => {
    discordButton.classList.toggle('hidden');
    contactButton.classList.toggle('hidden');
});

// Show the contact form when the contact button is clicked
contactButton.addEventListener('click', () => {
    contactForm.classList.add('visible');
    discordButton.classList.add('hidden');
    contactButton.classList.add('hidden');
});

// Redirect to Discord invite when the Discord button is clicked
discordButton.addEventListener('click', () => {
    window.open('https://discord.gg/your-invite-code', '_blank'); // Replace with your actual Discord invite link
    discordButton.classList.add('hidden');
    contactButton.classList.add('hidden');
});

// Close the contact form and show the floating buttons again
closeFormButton.addEventListener('click', () => {
    contactForm.classList.remove('visible');
    setTimeout(() => {
        discordButton.classList.remove('hidden');
        contactButton.classList.remove('hidden');
    }, 300); // Match this delay to the CSS transition duration
});

// script.js

document.getElementById("purchase-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    try {
        const response = await fetch("/purchase", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId: 'USER_ID' }) // Replace 'USER_ID' with the actual user ID
        });

        if (!response.ok) {
            throw new Error("Failed to make purchase");
        }

        alert("Purchase successful! You will receive your product soon.");
    } catch (error) {
        console.error("Error making purchase:", error);
        alert("Failed to make purchase. Please try again later.");
    }
});
