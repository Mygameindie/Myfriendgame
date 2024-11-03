// Cached DOM elements
const elementCache = new Map();
const categoryCache = new Map();

// Utility to cache elements by ID
function getElementById(id) {
    if (!elementCache.has(id)) {
        elementCache.set(id, document.getElementById(id));
    }
    return elementCache.get(id);
}

// Cache all items in a category
function cacheCategoryElements(categoryClass) {
    if (!categoryCache.has(categoryClass)) {
        categoryCache.set(categoryClass, Array.from(document.querySelectorAll(`.${categoryClass}`)));
    }
    return categoryCache.get(categoryClass);
}

// List of face elements (non-removable and non-stackable)
const lockedFaceElements = {
    left: ['face-left1', 'face-left2', 'face-left3', 'face-left4', 'face-left5'],
    right: ['face-right1', 'face-right2', 'face-right3', 'face-right4', 'face-right5']
};

// Initialize visibility of locked face elements
function initializeLockedFaces() {
    const leftFace = getElementById(lockedFaceElements.left[0]);
    const rightFace = getElementById(lockedFaceElements.right[0]);
    if (leftFace) leftFace.style.visibility = 'visible';
    if (rightFace) rightFace.style.visibility = 'visible';
}

// Show a single face for a given side without hiding it
function showSingleFace(faceId, side) {
    lockedFaceElements[side].forEach(id => {
        const face = getElementById(id);
        if (face) face.style.visibility = 'hidden';
    });
    const selectedFace = getElementById(faceId);
    if (selectedFace) selectedFace.style.visibility = 'visible';
}

// Lock z-index layering for suits and base
function lockLayering() {
    const baseImage = getElementById('base-image');
    if (baseImage) baseImage.style.zIndex = 2; // Ensure base image is between backpacks and suits

    const backpackLeft = cacheCategoryElements('backpackl');
    const backpackRight = cacheCategoryElements('backpackr');
    backpackLeft.forEach(backpack => backpack.style.zIndex = 1);
    backpackRight.forEach(backpack => backpack.style.zIndex = 1);

    const suitsLeft = cacheCategoryElements('suitl');
    const suitsRight = cacheCategoryElements('suitr');
    suitsLeft.forEach(suit => suit.style.zIndex = 3);
    suitsRight.forEach(suit => suit.style.zIndex = 3);
}

// Toggle visibility of an item, with special handling for faces and suits
function toggleItem(itemId, categoryClass) {
    const item = getElementById(itemId);
    if (!item) {
        console.warn(`Element with ID '${itemId}' not found.`);
        return;
    }

    // Handle faces separately to keep them unremovable
    if (categoryClass === 'facel' || categoryClass === 'facer') {
        const side = categoryClass === 'facel' ? 'left' : 'right';
        showSingleFace(itemId, side); // Show only the selected face, keeping at least one visible
        return;
    }

    // Handle suits separately to ensure only one suit per side
    if (categoryClass === 'suitl' || categoryClass === 'suitr') {
        // Hide all other suits on the same side before showing the selected one
        const suits = cacheCategoryElements(categoryClass);
        suits.forEach(suit => {
            if (suit.id !== itemId) {
                suit.style.visibility = 'hidden';
            }
            // Ensure the correct z-index is applied to suits
            suit.style.zIndex = 3;
        });
        // Toggle the visibility of the selected suit
        item.style.visibility = (item.style.visibility === 'visible') ? 'hidden' : 'visible';
        item.style.zIndex = 3; // Reapply z-index for the toggled suit
        return;
    }

    // Toggle visibility of other items as normal
    item.style.visibility = (item.style.visibility === 'visible') ? 'hidden' : 'visible';
}

// Transition from main menu to game container
function enterGame() {
    const mainMenu = document.querySelector('.main-menu');
    const gameContainer = document.querySelector('.game-container');
    if (mainMenu && gameContainer) {
        mainMenu.style.display = 'none';
        gameContainer.style.display = 'block';
    } else {
        console.warn("Main menu or game container not found.");
    }
}

// Initialize the game setup
function initializeGame() {
    initializeLockedFaces();
    lockLayering(); // Lock layering on initialization

    const playButton = document.querySelector('.play-button');
    if (playButton) {
        playButton.addEventListener('click', enterGame);
    } else {
        console.warn("Play button not found.");
    }
}

// Ensure game initializes after full page load
window.onload = initializeGame;