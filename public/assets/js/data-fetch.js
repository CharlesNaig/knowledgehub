document.getElementById("fetchDataButton").addEventListener("click", async () => {
    try {
        const response = await fetch("/store-discord-data", { method: "POST" });
        if (response.ok) {
            const data = await response.json();
            console.log(data.message);
        } else {
            console.error("Failed to fetch data");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
});
