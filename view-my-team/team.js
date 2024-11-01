/**
 * Name: Ken Cage
 * Date: 10/29/2024
 * Description: JavaScript to display the Pokémon team from local storage,
 * with options to nickname or release each Pokémon.
 */


// Load the team from local storage and display it
function loadTeam() {
    const teamDisplay = document.getElementById("teamDisplay");

    // Get the starter and additional Pokémon from local storage
    const starter = JSON.parse(localStorage.getItem("starterPokemon"));
    const additionalTeam = JSON.parse(localStorage.getItem("additionalPokemon")) || [];

    // Clear existing content
    teamDisplay.innerHTML = "";

    // Display starter Pokémon
    if (starter) {
        const starterElement = createPokemonCard(starter, "starterPokemon");
        teamDisplay.appendChild(starterElement);
    }

    // Display additional Pokémon
    additionalTeam.forEach((pokemon, index) => {
        const pokemonElement = createPokemonCard(pokemon, `additionalPokemon-${index}`);
        teamDisplay.appendChild(pokemonElement);
    });

    // Fill in empty slots if the team has fewer than 6 Pokémon
    const emptySlots = 6 - (additionalTeam.length + (starter ? 1 : 0));
    for (let i = 0; i < emptySlots; i++) {
        const emptySlot = document.createElement("div");
        emptySlot.className = "pokemon-card empty-slot";
        emptySlot.innerHTML = "<p>Empty Slot</p>";
        teamDisplay.appendChild(emptySlot);
    }
}

// Create a Pokémon card element
function createPokemonCard(pokemon, storageKey) {
    const card = document.createElement("div");
    card.className = "pokemon-card";
    card.innerHTML = `
        <h3>${pokemon.nickname || pokemon.name}</h3>
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" alt="${pokemon.name}">
    `;
    
    // Add click event for nickname and release options
    card.addEventListener("click", () => showPromptBox(pokemon, storageKey));
    
    return card;
}

// Show prompt box with options to nickname or release Pokémon
function showPromptBox(pokemon, storageKey) {
    const promptBox = document.getElementById("promptBox");
    promptBox.innerHTML = `
        <p>Choose an action for ${pokemon.nickname || pokemon.name}:</p>
        <button onclick="nicknamePokemon('${storageKey}')">Nickname</button>
        <button onclick="releasePokemon('${storageKey}')">Release</button>
        <button onclick="cancelPrompt()">Cancel</button>
    `;
    promptBox.style.display = "block";
}

// Function to nickname Pokémon
function nicknamePokemon(storageKey) {
    const promptBox = document.getElementById("promptBox");
    promptBox.innerHTML = `
        <p>Enter a new nickname:</p>
        <input type="text" id="nicknameInput" placeholder="Nickname">
        <button onclick="submitNickname('${storageKey}')">Submit</button>
        <button onclick="cancelPrompt()">Cancel</button>
    `;
}

// Submit the new nickname and update storage
function submitNickname(storageKey) {
    const newNickname = document.getElementById("nicknameInput").value;
    if (newNickname) {
        const pokemon = getPokemonFromStorage(storageKey);
        pokemon.nickname = newNickname;
        updatePokemonInStorage(storageKey, pokemon);
        loadTeam(); // Refresh the team display
    }
    cancelPrompt(); // Hide prompt box after updating
}

// Function to release Pokémon
function releasePokemon(storageKey) {
    const pokemon = getPokemonFromStorage(storageKey);
    const promptBox = document.getElementById("promptBox");
    promptBox.innerHTML = `
        <p>Are you sure you want to release ${pokemon.nickname || pokemon.name}?</p>
        <button onclick="confirmRelease('${storageKey}')">Yes</button>
        <button onclick="cancelPrompt()">Cancel</button>
    `;
}

// Confirm the release of the Pokémon
function confirmRelease(storageKey) {
    removePokemonFromStorage(storageKey);
    loadTeam(); // Refresh the team display
    cancelPrompt(); // Hide prompt box after release
}

// Hide the prompt box
function cancelPrompt() {
    document.getElementById("promptBox").style.display = "none";
}

// Retrieve Pokémon from local storage based on storageKey
function getPokemonFromStorage(storageKey) {
    if (storageKey === "starterPokemon") {
        return JSON.parse(localStorage.getItem("starterPokemon"));
    } else {
        const additionalTeam = JSON.parse(localStorage.getItem("additionalPokemon")) || [];
        const index = parseInt(storageKey.split("-")[1]); // Extract index from storageKey
        return additionalTeam[index];
    }
}

// Update a Pokémon's nickname in local storage
function updatePokemonInStorage(storageKey, updatedPokemon) {
    if (storageKey === "starterPokemon") {
        localStorage.setItem("starterPokemon", JSON.stringify(updatedPokemon));
    } else {
        const additionalTeam = JSON.parse(localStorage.getItem("additionalPokemon")) || [];
        const index = parseInt(storageKey.split("-")[1]); // Extract index from storageKey
        additionalTeam[index] = updatedPokemon;
        localStorage.setItem("additionalPokemon", JSON.stringify(additionalTeam));
    }
}

// Remove a Pokémon from local storage
function removePokemonFromStorage(storageKey) {
    if (storageKey === "starterPokemon") {
        localStorage.removeItem("starterPokemon");
    } else {
        const additionalTeam = JSON.parse(localStorage.getItem("additionalPokemon")) || [];
        const index = parseInt(storageKey.split("-")[1]); // Extract index from storageKey
        additionalTeam.splice(index, 1); // Remove Pokémon from team
        localStorage.setItem("additionalPokemon", JSON.stringify(additionalTeam));
    }
}

// Navigate to Find Pokémon page to add more Pokémon
function goToFindPokemon() {
    window.location.href = "../find-pokemon/index.html";
}

// Load the team when the page loads
window.addEventListener("load", loadTeam);
