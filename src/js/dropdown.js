class DropdownManager {
  constructor() {
    this.dropdownButton = null;
    this.dropdownMenu = null;
    this.dropdownText = null;
    this.dropdownArrow = null;
    this.hiddenSelect = null;
    this.langOptions = null;
    this.isOpen = false;
    
    // Language labels
    this.langLabels = {
      'fa': 'فارسی',
      'en': 'English'
    };
    
    this.init();
  }

  init() {
    // Get DOM elements
    this.dropdownButton = document.getElementById('lang-dropdown-button');
    this.dropdownMenu = document.getElementById('lang-dropdown-menu');
    this.dropdownText = document.getElementById('lang-dropdown-text');
    this.dropdownArrow = document.getElementById('lang-dropdown-arrow');
    this.hiddenSelect = document.getElementById('lang-select');
    this.langOptions = document.querySelectorAll('.lang-option');
    
    if (!this.dropdownButton || !this.dropdownMenu || !this.hiddenSelect) {
      console.warn('Dropdown elements not found');
      return;
    }
    
    this.setupEventListeners();
    this.initializeSelection();
  }

  setupEventListeners() {
    // Toggle dropdown on button click
    this.dropdownButton.addEventListener('click', () => this.toggleDropdown());
    
    // Handle option selection
    this.langOptions.forEach(option => {
      option.addEventListener('click', () => {
        this.updateSelection(option.dataset.value);
      });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
      if (!document.getElementById('lang-dropdown').contains(event.target)) {
        this.closeDropdown();
      }
    });
    
    // Close dropdown on escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.closeDropdown();
      }
    });
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    
    if (this.isOpen) {
      this.dropdownMenu.classList.remove('opacity-0', 'invisible', 'scale-95');
      this.dropdownMenu.classList.add('opacity-100', 'visible', 'scale-100');
      this.dropdownArrow.style.transform = 'rotate(180deg)';
      this.dropdownButton.setAttribute('aria-expanded', 'true');
    } else {
      this.dropdownMenu.classList.add('opacity-0', 'invisible', 'scale-95');
      this.dropdownMenu.classList.remove('opacity-100', 'visible', 'scale-100');
      this.dropdownArrow.style.transform = 'rotate(0deg)';
      this.dropdownButton.setAttribute('aria-expanded', 'false');
    }
  }

  closeDropdown() {
    if (this.isOpen) {
      this.isOpen = false;
      this.dropdownMenu.classList.add('opacity-0', 'invisible', 'scale-95');
      this.dropdownMenu.classList.remove('opacity-100', 'visible', 'scale-100');
      this.dropdownArrow.style.transform = 'rotate(0deg)';
      this.dropdownButton.setAttribute('aria-expanded', 'false');
    }
  }

  updateSelection(value) {
    // Update hidden select
    this.hiddenSelect.value = value;
    
    // Update button text
    const textSpan = this.dropdownText.querySelector('span:last-child') || this.dropdownText;
    if (this.dropdownText.querySelector('span:last-child')) {
      this.dropdownText.querySelector('span:last-child').textContent = this.langLabels[value];
    } else {
      // If no span found, update the whole text content but preserve the icon
      this.dropdownText.innerHTML = `
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 12.236 11.618 14z" clip-rule="evenodd"></path>
        </svg>
        <span>${this.langLabels[value]}</span>
      `;
    }
    
    // Update checkmarks
    this.langOptions.forEach(option => {
      const checkmark = option.querySelector('svg:last-child');
      if (option.dataset.value === value) {
        checkmark.classList.remove('opacity-0');
        checkmark.classList.add('opacity-100');
      } else {
        checkmark.classList.add('opacity-0');
        checkmark.classList.remove('opacity-100');
      }
    });
    
    // Trigger change event on hidden select
    const changeEvent = new Event('change', { bubbles: true });
    this.hiddenSelect.dispatchEvent(changeEvent);
    
    this.closeDropdown();
  }

  initializeSelection() {
    // Initialize with current selection
    const currentValue = this.hiddenSelect.value;
    this.updateSelection(currentValue);
  }
}

export default DropdownManager;