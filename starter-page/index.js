/**
 * Name: Ken Cage
 * Date: 10/27/2024
 * Description: JavaScript to display starter Pokémon options, play their cries,
 * allow selection, and store chosen Pokémon details in local storage.
 */


// Starter Pokémon data with names, IDs, and types
const starters = [
    { name: "Charmander", id: 4, type: "fire" },
    { name: "Cyndaquil", id: 155, type: "fire" },
    { name: "Torchic", id: 255, type: "fire" },
    { name: "Chimchar", id: 390, type: "fire" },
    { name: "Tepig", id: 498, type: "fire" },
    { name: "Fennekin", id: 653, type: "fire" },
    { name: "Litten", id: 725, type: "fire" },
    { name: "Scorbunny", id: 813, type: "fire" },
    { name: "Fuecoco", id: 909, type: "fire" },
    { name: "Bulbasaur", id: 1, type: "grass" },
    { name: "Chikorita", id: 152, type: "grass" },
    { name: "Treecko", id: 252, type: "grass" },
    { name: "Turtwig", id: 387, type: "grass" },
    { name: "Snivy", id: 495, type: "grass" },
    { name: "Chespin", id: 650, type: "grass" },
    { name: "Rowlet", id: 722, type: "grass" },
    { name: "Grookey", id: 810, type: "grass" },
    { name: "Sprigatito", id: 906, type: "grass" },
    { name: "Squirtle", id: 7, type: "water" },
    { name: "Totodile", id: 158, type: "water" },
    { name: "Mudkip", id: 258, type: "water" },
    { name: "Piplup", id: 393, type: "water" },
    { name: "Oshawott", id: 501, type: "water" },
    { name: "Froakie", id: 656, type: "water" },
    { name: "Popplio", id: 728, type: "water" },
    { name: "Sobble", id: 816, type: "water" },
    { name: "Quaxly", id: 912, type: "water" }
];

// Populate starter Pokémon cards in each type container
function displayStarters() {
    const fireContainer = document.getElementById("fire-starters");
    const grassContainer = document.getElementById("grass-starters");
    const waterContainer = document.getElementById("water-starters");

    starters.forEach(pokemon => {
        const card = document.createElement("div");
        card.classList.add("starter-card");
        card.innerHTML = `
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" alt="${pokemon.name}">
        `;
        
        // Click event to show Pokémon info
        card.addEventListener("click", () => showPokemonInfo(pokemon));
        
        // Append to the appropriate container based on type
        if (pokemon.type === "fire") fireContainer.appendChild(card);
        else if (pokemon.type === "grass") grassContainer.appendChild(card);
        else if (pokemon.type === "water") waterContainer.appendChild(card);
    });
}

// Display Pokémon info at the bottom, play cry, and show confirm button
function showPokemonInfo(pokemon) {
    const infoSection = document.getElementById("pokemonInfo");
    infoSection.innerHTML = `
        <h2>${pokemon.name}</h2>
        <button id="confirmButton">Confirm</button>
    `;
    infoSection.style.display = "block"; // Show info section

    // Play the Pokémon cry
    playPokemonCry(pokemon.id);

    // Add event listener to Confirm button
    document.getElementById("confirmButton").addEventListener("click", () => confirmSelection(pokemon));
}

// Function to play the Pokémon's cry
function playPokemonCry(id) {
    const audio = new Audio(`https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`);
    audio.play();
}

// Confirm selection function with nickname input
function confirmSelection(pokemon) {
    const infoSection = document.getElementById("pokemonInfo");
    infoSection.innerHTML = `
        <h2>Nickname your ${pokemon.name}</h2>
        <input type="text" id="nicknameInput" placeholder="Enter nickname" />
        <button id="nicknameButton">Submit</button>
    `;

    // Add event listener to nickname button
    document.getElementById("nicknameButton").addEventListener("click", () => submitNickname(pokemon));
}

// Handle nickname submission and display Next button
function submitNickname(pokemon) {
    const nickname = document.getElementById("nicknameInput").value;
    const infoSection = document.getElementById("pokemonInfo");

    // Create a Pokémon object to store, with nickname if provided
    const selectedPokemon = {
        id: pokemon.id,
        name: pokemon.name,
        type: pokemon.type,
        nickname: nickname || pokemon.name // Use nickname if available, otherwise default to name
    };

    // Save to local storage
    localStorage.setItem("starterPokemon", JSON.stringify(selectedPokemon));

    // Display final selection message in the info section with a "Next" button
    infoSection.innerHTML = `<p>You selected ${selectedPokemon.name} with the nickname "${selectedPokemon.nickname}".</p>`;
    
    const nextButton = document.createElement("button");
    nextButton.innerText = "Next";
    nextButton.id = "nextButton";
    infoSection.appendChild(nextButton);

    // Add event listener to the Next button to display the navigation menu
    nextButton.addEventListener("click", showNavigationMenu);
}

// Display navigation menu with options
function showNavigationMenu() {
    const infoSection = document.getElementById("pokemonInfo");
    infoSection.innerHTML = `
        <h2>Choose an Option</h2>
        <button id="findPokemonButton">Find Pokémon</button>
        <button id="viewTeamButton">View My Team</button>
    `;

    // Event listeners for each button in the navigation menu
    document.getElementById("findPokemonButton").addEventListener("click", () => {
        window.location.href = "../find-pokemon/index.html"; // Link to the Find Pokémon page
    });

    document.getElementById("viewTeamButton").addEventListener("click", () => {
        window.location.href = "../view-my-team/index.html"; // Link to the View My Team page
    });
}

// Run displayStarters on page load
window.addEventListener("load", displayStarters);
