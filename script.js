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
    // Set the first face on each side as visible by default
    const leftFace = getElementById(lockedFaceElements.left[0]);
    const rightFace = getElementById(lockedFaceElements.right[0]);
    if (leftFace) leftFace.style.visibility = 'visible';
    if (rightFace) rightFace.style.visibility = 'visible';
}

// Show a single face for a given side and hide others
function showSingleFace(faceId, side) {
    // Hide all faces for the specified side
    lockedFaceElements[side].forEach(id => {
        const face = getElementById(id);
        if (face) face.style.visibility = 'hidden';
    });

    // Show only the selected face
    const selectedFace = getElementById(faceId);
    if (selectedFace) selectedFace.style.visibility = 'visible';
}

// Hide all items in a category, excluding specified IDs
function hideItemsByCategory(categoryClass, excludeIds = []) {
    const excludeSet = new Set(excludeIds);
    const items = cacheCategoryElements(categoryClass);
    items.forEach(item => {
        if (!excludeSet.has(item.id) && item.style.visibility !== 'hidden') {
            item.style.visibility = 'hidden';
        }
    });
}

// Toggle visibility of an item, respecting face locking and non-stacking
function toggleItem(itemId, categoryClass) {
    // Check if the item is part of the locked face elements
    if (lockedFaceElements.left.includes(itemId)) {
        // Handle left side faces to prevent stacking
        showSingleFace(itemId, 'left');
        return;
    } else if (lockedFaceElements.right.includes(itemId)) {
        // Handle right side faces to prevent stacking
        showSingleFace(itemId, 'right');
        return;
    }

    // Toggle visibility for non-face items
    const item = getElementById(itemId);
    if (!item) {
        console.warn(`Element with ID '${itemId}' not found.`);
        return;
    }

    if (item.style.visibility === 'visible') {
        item.style.visibility = 'hidden';
    } else {
        hideItemsByCategory(categoryClass, [itemId]);
        item.style.visibility = 'visible';
    }
}

// Transition from main menu to game container
function enterGame() {
    const mainMenu = document.querySelector('.main-menu');
    const gameContainer = document.querySelector('.game-container');
    if (mainMenu && gameContainer) {
        mainMenu.style.display = 'none';
        gameContainer.style.display = 'block';
    } else {
        console.warn("Main menu or game container not found. Check your HTML structure.");
    }
}

// Initialize the game setup
function initializeGame() {
    document.addEventListener('DOMContentLoaded', () => {
        initializeLockedFaces();

        const playButton = document.querySelector('.play-button');
        if (playButton) {
            playButton.addEventListener('click', enterGame);
        } else {
            console.warn("Play button not found. Check your HTML structure.");
        }
    });
}

// Start game initialization
initializeGame();