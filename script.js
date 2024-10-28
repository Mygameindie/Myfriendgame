// Function to start the game
function enterGame() {
    document.querySelector('.main-menu').style.display = 'none';
    document.querySelector('.game-container').style.display = 'block';
}

// Helper function to hide all items in the same category except the one selected
function hideItemsByCategory(categoryClass) {
    const items = document.querySelectorAll(`.${categoryClass}`);
    items.forEach(item => {
        item.style.visibility = 'hidden';
    });
}

// Helper function to toggle visibility of a specific item in a category
function toggleItem(itemId, categoryClass) {
    const item = document.getElementById(itemId);

    // Check if item is the main layer and prevent toggling if so
    if (itemId === 'base-image') return; // Prevent changes to the main layer

    // Hide all other items in the same category
    hideItemsByCategory(categoryClass);

    // Show the selected item
    item.style.visibility = 'visible';
}