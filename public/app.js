// ============================================================================
// LISTINGAI - FRONTEND APPLICATION
// ============================================================================

// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const imageInput = document.getElementById('imageInput');
const progressSection = document.getElementById('progressSection');
const progressText = document.getElementById('progressText');
const outputSection = document.getElementById('outputSection');
const galleryGrid = document.getElementById('galleryGrid');
const resetButton = document.getElementById('resetButton');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.querySelector('.lightbox-close');

// State
let currentResponse = null;

// ============================================================================
// UPLOAD HANDLING
// ============================================================================

// Click to upload
uploadArea.addEventListener('click', () => {
  imageInput.click();
});

// File input change
imageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    handleUpload(file);
  }
});

// Drag and drop
uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', () => {
  uploadArea.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    handleUpload(file);
  }
});

// ============================================================================
// MAIN UPLOAD HANDLER
// ============================================================================

async function handleUpload(file) {
  // Show progress
  uploadArea.style.display = 'none';
  progressSection.style.display = 'block';
  outputSection.style.display = 'none';

  const formData = new FormData();
  formData.append('image', file);

  try {
    // Simulate progress updates
    updateProgress('Analyzing product image...');
    setTimeout(() => updateProgress('Generating lifestyle images...'), 1500);
    setTimeout(() => updateProgress('Creating SEO copy...'), 3000);

    const response = await fetch('/api/generate-copy', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    currentResponse = data;

    // Show results
    displayResults(data);
  } catch (error) {
    console.error('Error:', error);
    progressSection.innerHTML = `
      <div class="progress-container" style="color: var(--error-color);">
        <p>❌ Error: ${error.message}</p>
        <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--error-color); color: white; border: none; border-radius: 0.5rem; cursor: pointer;">Try Again</button>
      </div>
    `;
  }
}

// ============================================================================
// PROGRESS BAR ANIMATION
// ============================================================================

function updateProgress(text) {
  progressText.textContent = text;
}

// ============================================================================
// DISPLAY RESULTS
// ============================================================================

function displayResults(data) {
  progressSection.style.display = 'none';
  outputSection.style.display = 'block';

  // Display gallery
  displayGallery(data.images);

  // Display copy
  displayCopy(data.copy);

  // Scroll to results
  setTimeout(() => {
    outputSection.scrollIntoView({ behavior: 'smooth' });
  }, 100);
}

// ============================================================================
// GALLERY DISPLAY
// ============================================================================

function displayGallery(images) {
  galleryGrid.innerHTML = '';

  images.forEach((imageUrl, index) => {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';

    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = `Generated lifestyle image ${index + 1}`;
    img.loading = 'lazy';

    const overlay = document.createElement('div');
    overlay.className = 'gallery-overlay';

    const viewButton = document.createElement('button');
    viewButton.className = 'gallery-button';
    viewButton.textContent = '👁️ View';
    viewButton.onclick = (e) => {
      e.stopPropagation();
      openLightbox(imageUrl);
    };

    const downloadButton = document.createElement('button');
    downloadButton.className = 'gallery-button';
    downloadButton.textContent = '⬇️ Download';
    downloadButton.onclick = (e) => {
      e.stopPropagation();
      downloadImage(imageUrl, `listingai-image-${index + 1}.jpg`);
    };

    overlay.appendChild(viewButton);
    overlay.appendChild(downloadButton);

    galleryItem.appendChild(img);
    galleryItem.appendChild(overlay);
    galleryGrid.appendChild(galleryItem);
  });
}

// ============================================================================
// COPY DISPLAY
// ============================================================================

function displayCopy(copy) {
  const platforms = ['etsy', 'amazon', 'flipkart', 'meesho'];

  platforms.forEach((platform) => {
    const platformData = copy[platform];
    if (platformData) {
      // Title
      const titleEl = document.getElementById(`${platform}-title`);
      if (titleEl) {
        titleEl.textContent = platformData.title || 'N/A';
      }

      // Description
      const descEl = document.getElementById(`${platform}-description`);
      if (descEl) {
        descEl.textContent = platformData.description || 'N/A';
      }
    }
  });
}

// ============================================================================
// TAB SWITCHING
// ============================================================================

document.querySelectorAll('.tab-button').forEach((button) => {
  button.addEventListener('click', () => {
    const tabName = button.dataset.tab;

    // Remove active from all buttons and panes
    document.querySelectorAll('.tab-button').forEach((btn) => {
      btn.classList.remove('active');
    });
    document.querySelectorAll('.tab-pane').forEach((pane) => {
      pane.classList.remove('active');
    });

    // Add active to clicked button and corresponding pane
    button.classList.add('active');
    const pane = document.getElementById(`${tabName}-tab`);
    if (pane) {
      pane.classList.add('active');
    }
  });
});

// ============================================================================
// COPY TO CLIPBOARD
// ============================================================================

document.querySelectorAll('.copy-button').forEach((button) => {
  button.addEventListener('click', async () => {
    const targetId = button.dataset.target;
    const sourceEl = document.getElementById(targetId);

    if (!sourceEl) return;

    const text = sourceEl.textContent;

    try {
      await navigator.clipboard.writeText(text);

      // Visual feedback
      const originalText = button.textContent;
      button.textContent = '✓ Copied!';
      button.classList.add('copied');

      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('copied');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      button.textContent = '❌ Failed';
      setTimeout(() => {
        button.textContent = 'Copy';
      }, 2000);
    }
  });
});

// ============================================================================
// LIGHTBOX FUNCTIONALITY
// ============================================================================

function openLightbox(imageUrl) {
  lightboxImage.src = imageUrl;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = 'auto';
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    closeLightbox();
  }
});

// Close lightbox on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('active')) {
    closeLightbox();
  }
});

// ============================================================================
// IMAGE DOWNLOAD
// ============================================================================

function downloadImage(url, filename) {
  // Create a temporary anchor element
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ============================================================================
// RESET FUNCTIONALITY
// ============================================================================

resetButton.addEventListener('click', () => {
  // Reset state
  currentResponse = null;
  imageInput.value = '';

  // Hide sections
  progressSection.style.display = 'none';
  outputSection.style.display = 'none';

  // Show upload area
  uploadArea.style.display = 'flex';
  uploadArea.style.flexDirection = 'column';
  uploadArea.style.justifyContent = 'center';
  uploadArea.style.alignItems = 'center';

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================================================
// INITIALIZATION
// ============================================================================

console.log('✨ ListingAI Frontend Initialized');
