// ===========================
// Hotel Mahalakshmi - Interactive Features
// ===========================

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeDateInputs();
    initializeChatbot();
    loadRoomImages();
    setupFormHandlers();
});

// ===========================
// Date Input Initialization
// ===========================

function initializeDateInputs() {
    const today = new Date().toISOString().split('T')[0];
    const checkInInput = document.getElementById('check-in');
    const checkOutInput = document.getElementById('check-out');
    const reservationDateInput = document.getElementById('reservation-date');
    
    if (checkInInput) {
        checkInInput.min = today;
        checkInInput.addEventListener('change', function() {
            const checkInDate = new Date(this.value);
            const nextDay = new Date(checkInDate);
            nextDay.setDate(nextDay.getDate() + 1);
            checkOutInput.min = nextDay.toISOString().split('T')[0];
        });
    }
    
    if (checkOutInput) {
        checkOutInput.min = today;
    }
    
    if (reservationDateInput) {
        reservationDateInput.min = today;
    }
}

// ===========================
// Load Room Images
// ===========================

function loadRoomImages() {
    // Set room images from generated assets
    const deluxeImg = document.getElementById('deluxe-room-img');
    const suiteImg = document.getElementById('suite-room-img');
    const presidentialImg = document.getElementById('presidential-room-img');
    const hotelBookingImg = document.getElementById('hotel-booking-img');
    const restaurantBookingImg = document.getElementById('restaurant-booking-img');
    const restaurantMainImg = document.getElementById('restaurant-main-img');
    
    // These will be replaced with actual generated images
    if (deluxeImg) deluxeImg.src = 'C:/Users/universal/.gemini/antigravity/brain/cca42eb9-c493-46e8-bb93-d4bbecacdaba/deluxe_room_image_1767542017640.png';
    if (suiteImg) suiteImg.src = 'C:/Users/universal/.gemini/antigravity/brain/cca42eb9-c493-46e8-bb93-d4bbecacdaba/suite_room_image_1767542087198.png';
    if (presidentialImg) presidentialImg.src = 'C:/Users/universal/.gemini/antigravity/brain/cca42eb9-c493-46e8-bb93-d4bbecacdaba/suite_room_image_1767542087198.png';
    if (hotelBookingImg) hotelBookingImg.src = 'C:/Users/universal/.gemini/antigravity/brain/cca42eb9-c493-46e8-bb93-d4bbecacdaba/hotel_hero_image_1767541992642.png';
    if (restaurantBookingImg) restaurantBookingImg.src = 'C:/Users/universal/.gemini/antigravity/brain/cca42eb9-c493-46e8-bb93-d4bbecacdaba/restaurant_image_1767542068228.png';
    if (restaurantMainImg) restaurantMainImg.src = 'C:/Users/universal/.gemini/antigravity/brain/cca42eb9-c493-46e8-bb93-d4bbecacdaba/restaurant_image_1767542068228.png';
}

// ===========================
// Navigation
// ===========================

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// ===========================
// Room Selection
// ===========================

function selectRoom(roomType, price) {
    const roomSelect = document.getElementById('room-type');
    if (roomSelect) {
        roomSelect.value = roomType;
        scrollToSection('booking');
        
        // Highlight the booking form
        const bookingCard = document.querySelector('#hotel-booking-form').closest('.booking-card');
        bookingCard.style.border = '2px solid var(--primary-gold)';
        setTimeout(() => {
            bookingCard.style.border = '1px solid var(--light-gray)';
        }, 2000);
    }
}

// ===========================
// Form Handlers
// ===========================

function setupFormHandlers() {
    // Hotel Booking Form
    const hotelForm = document.getElementById('hotel-booking-form');
    if (hotelForm) {
        hotelForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleHotelBooking();
        });
    }
    
    // Restaurant Booking Form
    const restaurantForm = document.getElementById('restaurant-booking-form');
    if (restaurantForm) {
        restaurantForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRestaurantBooking();
        });
    }
}

function handleHotelBooking() {
    const roomType = document.getElementById('room-type').value;
    const checkIn = document.getElementById('check-in').value;
    const checkOut = document.getElementById('check-out').value;
    const guests = document.getElementById('guests').value;
    const name = document.getElementById('guest-name').value;
    const email = document.getElementById('guest-email').value;
    const phone = document.getElementById('guest-phone').value;
    
    // Calculate nights
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
    // Show confirmation
    alert(`✅ Booking Confirmed!\n\nRoom: ${roomType}\nGuest: ${name}\nCheck-in: ${checkIn}\nCheck-out: ${checkOut}\nNights: ${nights}\nGuests: ${guests}\n\nA confirmation email will be sent to ${email}`);
    
    // Reset form
    document.getElementById('hotel-booking-form').reset();
}

function handleRestaurantBooking() {
    const date = document.getElementById('reservation-date').value;
    const time = document.getElementById('reservation-time').value;
    const partySize = document.getElementById('party-size').value;
    const name = document.getElementById('diner-name').value;
    const email = document.getElementById('diner-email').value;
    const phone = document.getElementById('diner-phone').value;
    const requests = document.getElementById('special-requests').value;
    
    // Show confirmation
    let message = `✅ Table Reserved!\n\nName: ${name}\nDate: ${date}\nTime: ${time}\nParty Size: ${partySize}`;
    if (requests) {
        message += `\nSpecial Requests: ${requests}`;
    }
    message += `\n\nA confirmation will be sent to ${email}`;
    
    alert(message);
    
    // Reset form
    document.getElementById('restaurant-booking-form').reset();
}

// ===========================
// Advanced Chatbot System
// ===========================

let chatbotState = {
    isOpen: false,
    conversationHistory: [],
    context: null
};

// Chatbot Knowledge Base
const chatbotKnowledge = {
    rooms: {
        keywords: ['room', 'rooms', 'accommodation', 'stay', 'suite', 'deluxe', 'presidential', 'price', 'cost'],
        responses: [
            "We offer three types of luxurious accommodations:\n\n🏨 Deluxe Room - ₹4,999/night\n• King Size Bed\n• City View\n• Free WiFi & Room Service\n\n🏨 Executive Suite - ₹8,999/night\n• Spacious Living Area\n• Complimentary Breakfast\n• Private Balcony & Jacuzzi\n\n🏨 Presidential Suite - ₹15,999/night\n• 2 Bedrooms + Living Room\n• Personal Butler Service\n• Premium Amenities\n\nWould you like to book a room?",
            "Our rooms are designed for ultimate comfort and luxury. Each room features premium amenities, modern furnishings, and exceptional service. Which room type interests you?"
        ]
    },
    restaurant: {
        keywords: ['restaurant', 'food', 'dining', 'menu', 'eat', 'dinner', 'lunch', 'cuisine', 'table'],
        responses: [
            "Our fine dining restaurant offers an exquisite culinary experience! 🍽️\n\n⏰ Hours: 12:00 PM - 11:00 PM\n🍴 Cuisine: Contemporary Indian & International\n👨‍🍳 Award-winning chefs\n\nReservation times available:\n• Lunch: 12 PM - 2 PM\n• Dinner: 7 PM - 10 PM\n\nWould you like to reserve a table?",
            "Our restaurant combines traditional Indian flavors with contemporary culinary artistry. We use only the finest ingredients and offer an intimate, elegant atmosphere perfect for any occasion."
        ]
    },
    amenities: {
        keywords: ['amenities', 'facilities', 'services', 'spa', 'gym', 'pool', 'wifi', 'parking'],
        responses: [
            "Hotel Mahalakshmi offers premium amenities:\n\n✨ 24/7 Room Service\n✨ Spa & Wellness Center\n✨ Fitness Center\n✨ Swimming Pool\n✨ Free High-Speed WiFi\n✨ Complimentary Parking\n✨ Conference Rooms\n✨ Airport Transfer Service\n✨ Concierge Service\n\nWhat would you like to know more about?",
            "We pride ourselves on providing world-class facilities to ensure your stay is comfortable and memorable. All our amenities are available to our guests 24/7."
        ]
    },
    location: {
        keywords: ['location', 'address', 'where', 'directions', 'map', 'nearby', 'airport'],
        responses: [
            "📍 Hotel Mahalakshmi Location:\n\n123 Luxury Avenue\nMumbai, Maharashtra 400001\nIndia\n\n📞 Contact:\n+91 22 1234 5678\n+91 98765 43210\n\n✉️ Email:\ninfo@hotelmahalakshmi.com\n\nWe're centrally located with easy access to major attractions and the airport!",
            "We're located in the heart of Mumbai, making it convenient to explore the city. We also offer complimentary airport transfer service for our guests."
        ]
    },
    booking: {
        keywords: ['book', 'reserve', 'reservation', 'availability', 'available', 'check-in', 'checkout'],
        responses: [
            "I'd be happy to help you with a booking! 📅\n\nYou can:\n1️⃣ Book a room - Starting from ₹4,999/night\n2️⃣ Reserve a table at our restaurant\n\nSimply scroll to the 'Book Now' section on our website, or I can guide you through the process. What would you like to book?",
            "Booking with us is easy! You can make reservations directly on our website. For immediate assistance, you can also call us at +91 22 1234 5678. What dates are you considering?"
        ]
    },
    pricing: {
        keywords: ['price', 'cost', 'rate', 'charge', 'expensive', 'cheap', 'budget'],
        responses: [
            "Our room rates are:\n\n💰 Deluxe Room: ₹4,999 per night\n💰 Executive Suite: ₹8,999 per night\n💰 Presidential Suite: ₹15,999 per night\n\nAll rates include:\n✓ Complimentary WiFi\n✓ 24/7 Room Service\n✓ Access to all amenities\n\nSpecial packages and discounts available for extended stays!",
            "We offer competitive luxury pricing with exceptional value. Our rates include premium amenities and services. Would you like to know about any special offers or packages?"
        ]
    },
    contact: {
        keywords: ['contact', 'phone', 'call', 'email', 'reach', 'support', 'help'],
        responses: [
            "You can reach us through:\n\n📞 Phone:\n+91 22 1234 5678\n+91 98765 43210\n\n✉️ Email:\ninfo@hotelmahalakshmi.com\nreservations@hotelmahalakshmi.com\n\n🕐 We're available 24/7 to assist you!\n\nHow else can I help you today?",
            "Our team is always ready to assist you! Feel free to call us anytime at +91 22 1234 5678 or email info@hotelmahalakshmi.com. What can I help you with?"
        ]
    },
    greeting: {
        keywords: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good evening'],
        responses: [
            "Hello! 👋 Welcome to Hotel Mahalakshmi! I'm here to help you with any questions about our rooms, restaurant, amenities, or bookings. What would you like to know?",
            "Hi there! 😊 Thank you for choosing Hotel Mahalakshmi. How can I assist you today?"
        ]
    },
    thanks: {
        keywords: ['thank', 'thanks', 'appreciate'],
        responses: [
            "You're very welcome! 😊 Is there anything else I can help you with?",
            "My pleasure! Feel free to ask if you have any other questions about Hotel Mahalakshmi."
        ]
    }
};

function initializeChatbot() {
    const toggleBtn = document.getElementById('chatbot-toggle');
    const closeBtn = document.getElementById('chatbot-close');
    const sendBtn = document.getElementById('chatbot-send');
    const input = document.getElementById('chatbot-input');
    
    toggleBtn.addEventListener('click', toggleChatbot);
    closeBtn.addEventListener('click', toggleChatbot);
    sendBtn.addEventListener('click', sendMessage);
    
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

function toggleChatbot() {
    const container = document.getElementById('chatbot-container');
    chatbotState.isOpen = !chatbotState.isOpen;
    
    if (chatbotState.isOpen) {
        container.classList.add('active');
        document.getElementById('chatbot-input').focus();
    } else {
        container.classList.remove('active');
    }
}

function sendMessage() {
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();
    
    if (message === '') return;
    
    // Add user message
    addMessage(message, 'user');
    input.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Process message and respond
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateResponse(message);
        addMessage(response, 'bot');
    }, 1000 + Math.random() * 1000); // Random delay for natural feel
}

function sendQuickReply(message) {
    const input = document.getElementById('chatbot-input');
    input.value = message;
    sendMessage();
}

function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = sender === 'user' ? 'Y' : 'M';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const textP = document.createElement('p');
    textP.textContent = text;
    textP.style.whiteSpace = 'pre-line'; // Preserve line breaks
    
    content.appendChild(textP);
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Store in conversation history
    chatbotState.conversationHistory.push({ text, sender });
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbot-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot';
    typingDiv.id = 'typing-indicator';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = 'M';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    
    content.appendChild(indicator);
    typingDiv.appendChild(avatar);
    typingDiv.appendChild(content);
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

function generateResponse(userMessage) {
    const messageLower = userMessage.toLowerCase();
    
    // Check each knowledge category
    for (const [category, data] of Object.entries(chatbotKnowledge)) {
        for (const keyword of data.keywords) {
            if (messageLower.includes(keyword)) {
                // Return random response from category
                const responses = data.responses;
                return responses[Math.floor(Math.random() * responses.length)];
            }
        }
    }
    
    // Default response if no match found
    const defaultResponses = [
        "I'd be happy to help! Could you please provide more details? I can assist you with:\n• Room bookings and pricing\n• Restaurant reservations\n• Hotel amenities and services\n• Location and contact information",
        "I'm here to help! You can ask me about our rooms, restaurant, amenities, pricing, or how to make a reservation. What would you like to know?",
        "Thank you for your question! I can provide information about Hotel Mahalakshmi's accommodations, dining options, facilities, and booking process. What interests you most?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// ===========================
// Smooth Scroll for Navigation
// ===========================

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

// ===========================
// Navbar Scroll Effect
// ===========================

let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(10, 25, 41, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(10, 25, 41, 0.95)';
        navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
    }
    
    lastScroll = currentScroll;
});
