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
    // Hide all faces for the specified side except the one to show
    lockedFaceElements[side].forEach(id => {
        const face = getElementById(id);
        if (face) face.style.visibility = 'hidden';
    });
    const selectedFace = getElementById(faceId);
    if (selectedFace) selectedFace.style.visibility = 'visible';
}

// Ensure suit items stay visible in the correct layer
function lockSuitVisibility() {
    const suits = [...cacheCategoryElements('suitl'), ...cacheCategoryElements('suitr')];
    suits.forEach(suit => {
        suit.style.zIndex = suit.classList.contains('suitl') ? 7 : 8; // Locking z-index layers for left and right suits
        suit.style.visibility = 'visible'; // Ensure they stay visible
    });
}

// Hide all items in a category, excluding specified IDs
function hideItemsByCategory(categoryClass, excludeIds = []) {
    const excludeSet = new Set(excludeIds);
    const items = cacheCategoryElements(categoryClass);
    items.forEach(item => {
        if (!excludeSet.has(item.id)) {
            item.style.visibility = 'hidden';
        }
    });
}

// Toggle visibility of an item with face lock and suit layer lock
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

    // Lock visibility for suits
    if (categoryClass === 'suitl' || categoryClass === 'suitr') {
        lockSuitVisibility();
        return;
    }

    // Toggle visibility of non-face, non-suit items as normal
    const isLeft = itemId.includes('left');
    const isRight = itemId.includes('right');

    const items = cacheCategoryElements(categoryClass);
    items.forEach(otherItem => {
        if ((isLeft && otherItem.id.includes('left')) || 
            (isRight && otherItem.id.includes('right'))) {
            if (otherItem.id !== itemId) {
                otherItem.style.visibility = 'hidden';
            }
        }
    });

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
    lockSuitVisibility();

    const playButton = document.querySelector('.play-button');
    if (playButton) {
        playButton.addEventListener('click', enterGame);
    } else {
        console.warn("Play button not found.");
    }
}

// Ensure game initializes after full page load
window.onload = initializeGame;