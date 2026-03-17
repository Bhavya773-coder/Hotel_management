// Hotel Management JavaScript
class Hotel {
    constructor() {
        this.init();
        this.rooms = [];
        this.testimonials = [];
        this.bookingData = {};
    }

    init() {
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupBookingForm();
        this.setupContactForm();
        this.setupModal();
        this.loadRooms();
        this.loadTestimonials();
        this.setupAnimations();
        this.setupDateValidation();
    }

    // Navigation Setup
    setupNavigation() {
        const navbar = document.getElementById('navbar');
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Mobile menu toggle
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close mobile menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Scroll Effects
    setupScrollEffects() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.section-header, .room-card, .amenity-item, .testimonial-card, .offer-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // Booking Form Setup
    setupBookingForm() {
        const bookingForm = document.getElementById('booking-form');
        
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleBookingSearch(e.target);
        });

        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('checkin').setAttribute('min', today);
        document.getElementById('checkout').setAttribute('min', today);
    }

    // Handle Booking Search
    handleBookingSearch(form) {
        this.scrollToSection('rooms');
    }

    // Date Validation
    validateDates(checkin, checkout) {
        if (!checkin || !checkout) return false;
        
        const checkinDate = new Date(checkin);
        const checkoutDate = new Date(checkout);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return checkinDate >= today && checkoutDate > checkinDate;
    }

    setupDateValidation() {
        const checkinInput = document.getElementById('checkin');
        const checkoutInput = document.getElementById('checkout');

        checkinInput.addEventListener('change', () => {
            const checkinDate = new Date(checkinInput.value);
            const nextDay = new Date(checkinDate);
            nextDay.setDate(nextDay.getDate() + 1);
            
            checkoutInput.setAttribute('min', nextDay.toISOString().split('T')[0]);
            
            if (checkoutInput.value && new Date(checkoutInput.value) <= checkinDate) {
                checkoutInput.value = nextDay.toISOString().split('T')[0];
            }
        });
    }

    // Load Rooms Data
    loadRooms() {
        this.rooms = [
            {
                id: 1,
                name: 'Monthly Rooms',
                price: 8000,
                image: './images/Room.jpeg',
                features: [
                    'Fully Furnished Rooms',
                    'Affordable Monthly Rent',
                    'Close to Reliance _NAYARA',
                    '24/7 Water & Electricity',
                    'WiFi Facility',
                    'Parking Available',
                    'Clean & Hygienic Environment',
                    'Security & Peaceful Location'
                ],
                maxGuests: 2
            }
        ];

        this.renderRooms();
    }

    // Render Rooms
    renderRooms() {
        const roomsGrid = document.getElementById('rooms-grid');
        if (!roomsGrid) {
            console.error('Rooms grid not found!');
            return;
        }
        
        roomsGrid.innerHTML = '';
        console.log('Rendering rooms:', this.rooms.length);

        this.rooms.forEach(room => {
            const roomCard = this.createRoomCard(room);
            roomsGrid.appendChild(roomCard);
        });
        
        console.log('Rooms rendered successfully');
    }

    // Create Room Card
    createRoomCard(room) {
        const card = document.createElement('div');
        card.className = 'room-card';
        card.innerHTML = `
            <img src="${room.image}" alt="${room.name}" class="room-image">
            <div class="room-content">
                <h3 class="room-title">${room.name}</h3>
                <ul class="room-features">
                    ${room.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                </ul>
                <button class="btn-primary" onclick="scrollToSection('contact')">Book Now</button>
            </div>
        `;
        return card;
    }

    // Filter Available Rooms
    filterAvailableRooms() {
        const guests = parseInt(this.bookingData.guests);
        const availableRooms = this.rooms.filter(room => room.maxGuests >= guests);
        
        const roomsGrid = document.getElementById('rooms-grid');
        roomsGrid.innerHTML = '';

        if (availableRooms.length === 0) {
            roomsGrid.innerHTML = '<p style="text-align: center; color: var(--text-muted);">No rooms available for the selected dates and guests.</p>';
            return;
        }

        availableRooms.forEach(room => {
            const roomCard = this.createRoomCard(room);
            roomsGrid.appendChild(roomCard);
        });
    }

    // Book Room
    bookRoom(roomId) {
        const room = this.rooms.find(r => r.id === roomId);
        if (!room) return;

        // Scroll to contact section
        this.scrollToSection('contact');
        
        // Pre-fill contact form with room inquiry
        const messageField = document.getElementById('message');
        if (messageField) {
            messageField.value = `I'm interested in booking the ${room.name}. Please provide me with more details about availability and pricing.`;
        }
        
        this.showNotification('Please fill in your details below and we\'ll contact you soon!', 'info');
    }

    // Load Testimonials
    loadTestimonials() {
        this.testimonials = [
            {
                name: 'Rahul Sharma',
                avatar: 'https://picsum.photos/seed/user1/60/60',
                rating: 5,
                text: 'Exceptional service and luxurious rooms. The staff was very attentive and the amenities were top-notch. Will definitely visit again!'
            },
            {
                name: 'Priya Patel',
                avatar: 'https://picsum.photos/seed/user2/60/60',
                rating: 5,
                text: 'Perfect location for business travelers. The conference facilities are excellent and the rooms are comfortable and well-equipped.'
            },
            {
                name: 'Amit Kumar',
                avatar: 'https://picsum.photos/seed/user3/60/60',
                rating: 4,
                text: 'Great experience overall. The food was delicious and the spa services were relaxing. Only minor issue was check-in timing.'
            },
            {
                name: 'Neha Gupta',
                avatar: 'https://picsum.photos/seed/user4/60/60',
                rating: 5,
                text: 'Beautiful hotel with amazing views. The honeymoon suite was perfect for our anniversary celebration. Highly recommended!'
            }
        ];

        this.renderTestimonials();
    }

    // Render Testimonials
    renderTestimonials() {
        const slider = document.getElementById('testimonials-slider');
        slider.innerHTML = '';

        this.testimonials.forEach(testimonial => {
            const card = document.createElement('div');
            card.className = 'testimonial-card';
            card.innerHTML = `
                <div class="testimonial-header">
                    <img src="${testimonial.avatar}" alt="${testimonial.name}" class="testimonial-avatar">
                    <div class="testimonial-info">
                        <h4>${testimonial.name}</h4>
                        <div class="testimonial-rating">
                            ${this.generateStars(testimonial.rating)}
                        </div>
                    </div>
                </div>
                <p class="testimonial-text">${testimonial.text}</p>
            `;
            slider.appendChild(card);
        });
    }

    // Generate Star Rating
    generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += `<i class="fas fa-star${i <= rating ? '' : '-o'}"></i>`;
        }
        return stars;
    }

    // Contact Form Setup
    setupContactForm() {
        const contactForm = document.getElementById('contact-form');
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleContactSubmit(e.target);
        });
    }

    // Handle Contact Form Submit
    handleContactSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Validate form
        if (!this.validateContactForm(data)) {
            this.showNotification('Please fill all fields correctly', 'error');
            return;
        }

        // Show loading
        this.showLoadingState();

        // Submit to Formspree
        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            this.hideLoadingState();
            if (response.ok) {
                this.showSuccessPopup();
                form.reset();
            } else {
                throw new Error('Form submission failed');
            }
        })
        .catch(error => {
            this.hideLoadingState();
            this.showNotification('Something went wrong. Please try again.', 'error');
        });
    }

    // Show Success Popup
    showSuccessPopup() {
        const popup = document.createElement('div');
        popup.className = 'success-popup';
        popup.innerHTML = `
            <div class="success-popup-content">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>Thank You!</h2>
                <p>Your inquiry has been sent successfully. We'll get back to you within 24 hours.</p>
                <div class="success-details">
                    <h3>What happens next?</h3>
                    <ul>
                        <li><i class="fas fa-phone"></i> We'll call you to discuss room availability</li>
                        <li><i class="fas fa-envelope"></i> You'll receive an email confirmation</li>
                        <li><i class="fas fa-calendar"></i> We'll help you choose the best dates</li>
                        <li><i class="fas fa-handshake"></i> Complete your booking process</li>
                    </ul>
                </div>
                <button class="btn-primary" onclick="this.closest('.success-popup').remove()">Got it!</button>
            </div>
        `;
        
        // Style popup
        Object.assign(popup.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '5000',
            backdropFilter: 'blur(5px)'
        });

        // Add popup styles
        const style = document.createElement('style');
        style.textContent = `
            .success-popup-content {
                background: var(--secondary-color);
                padding: 3rem;
                border-radius: 20px;
                border: 1px solid rgba(212, 175, 55, 0.3);
                max-width: 500px;
                text-align: center;
                animation: slideIn 0.3s ease-out;
            }
            
            .success-icon {
                font-size: 4rem;
                color: var(--accent-color);
                margin-bottom: 1.5rem;
            }
            
            .success-popup-content h2 {
                color: var(--accent-color);
                margin-bottom: 1rem;
            }
            
            .success-popup-content p {
                color: var(--text-muted);
                margin-bottom: 2rem;
            }
            
            .success-details {
                text-align: left;
                background: rgba(11, 11, 11, 0.5);
                padding: 1.5rem;
                border-radius: 15px;
                margin-bottom: 2rem;
            }
            
            .success-details h3 {
                color: var(--accent-color);
                margin-bottom: 1rem;
                text-align: center;
            }
            
            .success-details ul {
                list-style: none;
            }
            
            .success-details li {
                color: var(--text-muted);
                padding: 0.5rem 0;
                display: flex;
                align-items: center;
            }
            
            .success-details li i {
                color: var(--accent-color);
                margin-right: 1rem;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateY(-50px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            @media (max-width: 768px) {
                .success-popup-content {
                    margin: 20px;
                    padding: 2rem;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(popup);
    }

    // Validate Contact Form
    validateContactForm(data) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[6-9]\d{9}$/;

        return data.name && 
               data.email && 
               emailRegex.test(data.email) &&
               data.phone && 
               phoneRegex.test(data.phone) &&
               data.message;
    }

    // Modal Setup
    setupModal() {
        const modal = document.getElementById('booking-modal');
        const closeBtn = modal.querySelector('.close');
        const bookingForm = document.getElementById('complete-booking-form');

        closeBtn.addEventListener('click', () => {
            this.closeModal();
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCompleteBooking(e.target);
        });
    }

    // Show Booking Modal
    showBookingModal(room) {
        const modal = document.getElementById('booking-modal');
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Store room data
        this.selectedRoom = room;
    }

    // Close Modal
    closeModal() {
        const modal = document.getElementById('booking-modal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Handle Complete Booking
    handleCompleteBooking(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Validate form
        if (!this.validateBookingForm(data)) {
            this.showNotification('Please fill all required fields', 'error');
            return;
        }

        // Show loading
        this.showLoadingState();

        // Simulate API call
        setTimeout(() => {
            this.hideLoadingState();
            this.closeModal();
            this.showNotification('Booking confirmed! Check your email for details.', 'success');
            form.reset();
            
            // Reset booking data
            this.bookingData = {};
            this.selectedRoom = null;
        }, 2000);
    }

    // Validate Booking Form
    validateBookingForm(data) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[6-9]\d{9}$/;

        return data.fullname && 
               data.email && 
               emailRegex.test(data.email) &&
               data.phone && 
               phoneRegex.test(data.phone);
    }

    // Setup Animations
    setupAnimations() {
        // Parallax effect for hero section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroBackground = document.querySelector('.hero-background');
            if (heroBackground) {
                heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });

        // Number counter animation for stats
        this.animateCounters();
    }

    // Animate Counters
    animateCounters() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counters = entry.target.querySelectorAll('.stat-number');
                    counters.forEach(counter => {
                        const target = counter.innerText;
                        const isNumber = /^\d+/.test(target);
                        
                        if (isNumber) {
                            const number = parseInt(target);
                            let current = 0;
                            const increment = number / 50;
                            const timer = setInterval(() => {
                                current += increment;
                                if (current >= number) {
                                    counter.innerText = target;
                                    clearInterval(timer);
                                } else {
                                    counter.innerText = Math.floor(current) + '+';
                                }
                            }, 30);
                        }
                    });
                    observer.unobserve(entry.target);
                }
            });
        });

        const statsSection = document.querySelector('.about-stats');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }

    // Utility Functions
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            padding: '15px 25px',
            borderRadius: '10px',
            color: 'white',
            fontWeight: '500',
            zIndex: '3000',
            transform: 'translateX(400px)',
            transition: 'transform 0.3s ease',
            maxWidth: '300px'
        });

        // Set background color based on type
        const colors = {
            success: 'linear-gradient(135deg, #28a745, #20c997)',
            error: 'linear-gradient(135deg, #dc3545, #e74c3c)',
            info: 'linear-gradient(135deg, #17a2b8, #3498db)'
        };
        notification.style.background = colors[type] || colors.info;

        // Add to DOM
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    showLoadingState() {
        const loader = document.createElement('div');
        loader.className = 'loader';
        loader.innerHTML = '<div class="spinner"></div>';
        
        Object.assign(loader.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'rgba(11, 11, 11, 0.9)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '4000'
        });

        const spinner = document.createElement('div');
        Object.assign(spinner.style, {
            width: '50px',
            height: '50px',
            border: '3px solid rgba(212, 175, 55, 0.3)',
            borderTop: '3px solid #D4AF37',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
        });

        loader.appendChild(spinner);
        document.body.appendChild(loader);

        // Add spinner animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    hideLoadingState() {
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.remove();
        }
    }
}

// Initialize hotel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.hotel = new Hotel();
});

// Global function for external calls
function scrollToSection(sectionId) {
    if (window.hotel) {
        window.hotel.scrollToSection(sectionId);
    }
}
