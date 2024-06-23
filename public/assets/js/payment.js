 document.addEventListener("DOMContentLoaded", () => {
    const paymentForm = document.getElementById("paymentForm");
    const qrCodeContainer = document.getElementById("qrCodeContainer");
    const qrCodeImage = document.getElementById("qrCode");

    paymentForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const paymentMethod = document.getElementById("paymentMethod").value;
        const productCode = document.getElementById("productCode").value;
        const amount = document.getElementById("amount").value;
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const submitButton = event.target.querySelector("button[type='submit']");

        // Show loading message
        submitButton.innerHTML = "Processing Payment...";

        // Prepare the product and user data
        const product = {
            name: productCode, // Assuming productCode is the product name
            price: amount
        };

        const user = {
            username: name,
            email: email
        };

        // Send payment method to the server for processing
        try {
            const response = await fetch("/api/purchase", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ paymentMethod, product, user }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Generate QR Code
                QRCode.toDataURL(JSON.stringify({ paymentMethod, productCode, amount }), function (error, url) {
                    if (error) {
                        console.error(error);
                        submitButton.innerHTML = "Payment failed. Try again.";
                    } else {
                        qrCodeImage.src = url;
                        qrCodeContainer.style.display = "block";
                        submitButton.innerHTML = "Payment completed.";

                        // Optionally, send data to Discord via another fetch request
                        // Example: Send data to Discord webhook for notification
                        sendToDiscord(name, email);
                    }
                });

                // Clear form
                paymentForm.reset();
            } else {
                console.error("Failed to process payment: " + data.error);
                submitButton.innerHTML = "Payment failed. Try again.";
            }
        } catch (error) {
            console.error("Error processing payment:", error);
            submitButton.innerHTML = "Payment failed. Try again.";
        }
    });

    async function sendToDiscord(name, email) {
        try {
            const response = await fetch("/api/discord", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email }),
            });

            const data = await response.json();
            if (response.ok && data.success) {
                console.log("Data sent to Discord successfully.");
            } else {
                console.error("Failed to send data to Discord:", data.error);
            }
        } catch (error) {
            console.error("Error sending data to Discord:", error);
        }
    }
});
