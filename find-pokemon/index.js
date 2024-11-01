/**
 * Name: Ken Cage
 * Date: 10/26/2024
 * Description: JavaScript to handle Fetch API calls to PokeAPI and display Pokémon data on the webpage.
 */

"use strict";

/**
 * Check fetch response status and throw an error if status is not OK.
 * @param {Response} response - The fetch response object.
 * @throws Will throw an error if response is not OK.
 */
function statusCheck(response) {
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response;
}

/**
 * Capitalizes the first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} - The capitalized string
 */
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Type colors for Pokémon types
 */
const typeColors = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD",
};

// Fetch Pokémon data based on user input
async function fetchPokemonData() {
    const pokemonName = document.getElementById("pokemonInput").value.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
    
    try {
        const response = await fetch(url);
        statusCheck(response); // Call the status check here
        const data = await response.json();
        displayPokemonData(data);
        playPokemonCry(data.id); // Play the Pokémon's cry
    } catch (error) {
        handleError(error);
    }
}

// Display Pokémon data with type-specific background for each type and an "Add to Team" button
function displayPokemonData(data) {
    const displaySection = document.getElementById("pokemonDisplay");

    // Convert height to feet and inches
    let totalInches = Math.round(data.height * 3.937); // Convert decimeters to inches and round
    const feet = Math.floor(totalInches / 12); // Calculate feet
    const inches = totalInches % 12; // Calculate remaining inches

    // Convert weight to pounds
    const weightInLbs = (data.weight * 0.220462).toFixed(1); // Convert hectograms to pounds

    // Generate HTML for types with individual background colors
    const typeHTML = data.types
        .map(typeInfo => {
            const typeName = typeInfo.type.name;
            const backgroundColor = typeColors[typeName] || "#FFFFFF"; // Default to white if type not found
            return `<span style="background-color: ${backgroundColor}; color: #FFF; padding: 2px 6px; border-radius: 4px; margin: 0 4px;">
                ${capitalizeFirstLetter(typeName)}
            </span>`;
        })
        .join("");

    displaySection.innerHTML = `
        <h2>${capitalizeFirstLetter(data.name)}</h2>
        <img src="${data.sprites.front_default}" alt="${data.name}">
        <p>Type: ${typeHTML}</p>
        <p>Height: ${feet}'${inches}"</p>
        <p>Weight: ${weightInLbs} lbs</p>
        <button id="playCryButton">Play Cry</button>
        <button id="addToTeamButton">Add to Team</button>
    `;
    
    // Event listeners for Play Cry and Add to Team buttons
    document.getElementById("playCryButton").addEventListener("click", () => playPokemonCry(data.id));
    document.getElementById("addToTeamButton").addEventListener("click", () => addToTeam(data.id, data.name));
}

// Play Pokémon cry
function playPokemonCry(id) {
    const audio = new Audio(`https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`);
    audio.play();
}

/**
 * Add selected Pokémon to the team in local storage
 * @param {number} id - Pokémon ID
 * @param {string} name - Pokémon name
 */
function addToTeam(id, name) {
    const additionalTeam = JSON.parse(localStorage.getItem("additionalPokemon")) || [];

    // Check if team is full
    if (additionalTeam.length >= 5) {
        showPopupMessage("Your team is full! You can only have 6 Pokémon including your starter.", "error");
        return;
    }

    // Create Pokémon object to add
    const newPokemon = { id, name };

    // Add to team and save to local storage
    additionalTeam.push(newPokemon);
    localStorage.setItem("additionalPokemon", JSON.stringify(additionalTeam));
    showPopupMessage(`${capitalizeFirstLetter(name)} has been added to your team!`, "success");
}

/**
 * Show a popup message with fade-out effect
 * @param {string} message - The message to display
 * @param {string} type - Message type, either "success" or "error"
 */
function showPopupMessage(message, type) {
    const popupMessage = document.getElementById("popupMessage");
    if (popupMessage) {
        popupMessage.textContent = message;
        popupMessage.style.backgroundColor = type === "error" ? "#f44336" : "#4CAF50"; // Red for error, green for success
        popupMessage.classList.add("show");

        // Fade out after 3 seconds
        setTimeout(() => {
            popupMessage.classList.remove("show");
        }, 3000);
    }
}

// Error handling function
function handleError(error) {
    const displaySection = document.getElementById("pokemonDisplay");
    displaySection.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
}

// Event listener for fetch button
document.getElementById("fetchButton").addEventListener("click", fetchPokemonData);
