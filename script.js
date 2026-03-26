// ===========================
// Hotel Mahalakshmi - Interactive Features
// ===========================

// ===========================
// AI CHATBOT CONFIGURATION
// ===========================
// To enable AI-powered responses, add your Anthropic API key below.
// Get one at: https://console.anthropic.com/
// IMPORTANT: For production, never expose your API key in frontend code.
// Use a backend proxy server instead.
const ANTHROPIC_API_KEY = 'YOUR_ANTHROPIC_API_KEY_HERE'; // Replace with your key

const HOTEL_SYSTEM_PROMPT = `You are a helpful and friendly AI assistant for Hotel Mahalakshmi, a luxury hotel and restaurant located in Kaneth, Uttarkashi, Uttarakhand, India.

Here is all the information about the hotel:

ROOMS:
- Deluxe Room: ₹1,999/night — King Size Bed, City View, Free WiFi, 24/7 Room Service, Mini Bar
- Executive Suite: ₹2,999/night — Spacious Living Area, Premium Amenities, Complimentary Breakfast, Private Balcony, Jacuzzi
- Family Suite: ₹3,999/night — 2 Bedrooms + Living Room, Panoramic Views, Personal Butler Service, Private Dining Area, Premium Bar

RESTAURANT:
- Fine dining offering traditional Indian flavors and contemporary culinary artistry
- Hours: 08:00 AM – 11:00 PM
- Time slots: Breakfast (12 PM), Lunch (1–2 PM), Dinner (7–10 PM)

AMENITIES: 24/7 Room Service, Spa & Wellness, Fitness Center, Free High-Speed WiFi, Complimentary Parking, Conference Rooms, Airport Transfer, Concierge Service

CONTACT:
- Address: PHX3+J26, Uttarkashi - Gangotri Rd, Kaneth, Uttarakhand 249194
- Phone: +91 8449130785, +91 8979047805
- Email: Mahalakshmihotel150@gmail.com
- WhatsApp: +91 8449130785
- Reception: 24/7

Keep your responses friendly, concise, and helpful. Always encourage guests to book or visit. If asked about something not covered above, politely let them know you can connect them with the front desk.`;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    initializeDateInputs();
    initializeChatbot();
    setupFormHandlers();
    initializeHamburgerMenu();
});

// ===========================
// Mobile Hamburger Menu
// ===========================

function initializeHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.id = 'nav-overlay';
    document.body.appendChild(overlay);

    hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        overlay.classList.toggle('active', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    overlay.addEventListener('click', closeMenu);

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });
}

function closeMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const overlay = document.getElementById('nav-overlay');
    if (!navLinks) return;
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
}

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
        checkInInput.addEventListener('change', function () {
            const checkInDate = new Date(this.value);
            const nextDay = new Date(checkInDate);
            nextDay.setDate(nextDay.getDate() + 1);
            checkOutInput.min = nextDay.toISOString().split('T')[0];
        });
    }
    if (checkOutInput) checkOutInput.min = today;
    if (reservationDateInput) reservationDateInput.min = today;
}

// ===========================
// Navigation
// ===========================

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
}

// ===========================
// Room Selection
// ===========================

function selectRoom(roomType, price) {
    const roomSelect = document.getElementById('room-type');
    if (roomSelect) {
        roomSelect.value = roomType;
        scrollToSection('booking');
        const bookingCard = document.querySelector('#hotel-booking-form').closest('.booking-card');
        bookingCard.style.border = '2px solid var(--primary-gold)';
        setTimeout(() => { bookingCard.style.border = '1px solid var(--light-gray)'; }, 2000);
    }
}

// ===========================
// Form Handlers
// ===========================

function setupFormHandlers() {
    const hotelForm = document.getElementById('hotel-booking-form');
    if (hotelForm) {
        hotelForm.addEventListener('submit', function (e) { e.preventDefault(); handleHotelBooking(); });
    }
    const restaurantForm = document.getElementById('restaurant-booking-form');
    if (restaurantForm) {
        restaurantForm.addEventListener('submit', function (e) { e.preventDefault(); handleRestaurantBooking(); });
    }
}

function handleHotelBooking() {
    const roomType = document.getElementById('room-type').value;
    const checkIn = document.getElementById('check-in').value;
    const checkOut = document.getElementById('check-out').value;
    const guests = document.getElementById('guests').value;
    const name = document.getElementById('guest-name').value;
    const email = document.getElementById('guest-email').value;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    const prices = { 'Deluxe Room': 1999, 'Executive Suite': 2999, 'Family Suite': 3999 };
    const total = (prices[roomType] || 0) * nights;

    alert(`✅ Booking Confirmed!\n\nRoom: ${roomType}\nGuest: ${name}\nCheck-in: ${checkIn}\nCheck-out: ${checkOut}\nNights: ${nights}\nGuests: ${guests}\nTotal: ₹${total.toLocaleString('en-IN')}\n\nA confirmation email will be sent to ${email}`);
    document.getElementById('hotel-booking-form').reset();
}

function handleRestaurantBooking() {
    const date = document.getElementById('reservation-date').value;
    const time = document.getElementById('reservation-time').value;
    const partySize = document.getElementById('party-size').value;
    const name = document.getElementById('diner-name').value;
    const email = document.getElementById('diner-email').value;
    const requests = document.getElementById('special-requests').value;

    let message = `✅ Table Reserved!\n\nName: ${name}\nDate: ${date}\nTime: ${time}\nParty Size: ${partySize}`;
    if (requests) message += `\nSpecial Requests: ${requests}`;
    message += `\n\nA confirmation will be sent to ${email}`;

    alert(message);
    document.getElementById('restaurant-booking-form').reset();
}

// ===========================
// AI-Powered Chatbot System
// ===========================

let chatbotState = {
    isOpen: false,
    conversationHistory: []
};

function initializeChatbot() {
    const toggleBtn = document.getElementById('chatbot-toggle');
    const closeBtn = document.getElementById('chatbot-close');
    const sendBtn = document.getElementById('chatbot-send');
    const input = document.getElementById('chatbot-input');

    toggleBtn.addEventListener('click', toggleChatbot);
    closeBtn.addEventListener('click', toggleChatbot);
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') sendMessage();
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

    addMessage(message, 'user');
    input.value = '';
    showTypingIndicator();

    // Add to conversation history
    chatbotState.conversationHistory.push({ role: 'user', content: message });

    // Try AI response first, fall back to local
    if (ANTHROPIC_API_KEY && ANTHROPIC_API_KEY !== 'YOUR_ANTHROPIC_API_KEY_HERE') {
        getAIResponse(message);
    } else {
        setTimeout(() => {
            hideTypingIndicator();
            const response = getLocalResponse(message);
            addMessage(response, 'bot');
            chatbotState.conversationHistory.push({ role: 'assistant', content: response });
        }, 800 + Math.random() * 700);
    }
}

function sendQuickReply(message) {
    document.getElementById('chatbot-input').value = message;
    sendMessage();
}

// ===========================
// Anthropic AI API Call
// ===========================

async function getAIResponse(userMessage) {
    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true'
            },
            body: JSON.stringify({
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 400,
                system: HOTEL_SYSTEM_PROMPT,
                messages: chatbotState.conversationHistory
            })
        });

        if (!response.ok) throw new Error('API request failed');

        const data = await response.json();
        const aiReply = data.content[0].text;

        hideTypingIndicator();
        addMessage(aiReply, 'bot');
        chatbotState.conversationHistory.push({ role: 'assistant', content: aiReply });

    } catch (error) {
        console.error('AI API error:', error);
        hideTypingIndicator();
        const fallback = getLocalResponse(userMessage);
        addMessage(fallback, 'bot');
    }
}

// ===========================
// Local Fallback Responses
// ===========================

const chatbotKnowledge = {
    rooms: {
        keywords: ['room', 'accommodation', 'stay', 'suite', 'deluxe', 'family', 'price', 'cost', 'rate', 'night'],
        response: "We offer three luxurious room types:\n\n🏨 Deluxe Room — ₹1,999/night\n• King Size Bed, City View, Free WiFi\n\n🏨 Executive Suite — ₹2,999/night\n• Spacious Living Area, Complimentary Breakfast, Jacuzzi\n\n🏨 Family Suite — ₹3,999/night\n• 2 Bedrooms + Living Room, Panoramic Views, Butler Service\n\nWould you like to book a room?"
    },
    restaurant: {
        keywords: ['restaurant', 'food', 'dining', 'menu', 'eat', 'dinner', 'lunch', 'breakfast', 'cuisine', 'table'],
        response: "Our fine dining restaurant is a culinary delight! 🍽️\n\n⏰ Hours: 08:00 AM – 11:00 PM\n🍴 Cuisine: Traditional Indian & Contemporary\n\nDining slots:\n• Breakfast: 12:00 PM\n• Lunch: 1:00 PM – 2:00 PM\n• Dinner: 7:00 PM – 10:00 PM\n\nShall I help you reserve a table?"
    },
    amenities: {
        keywords: ['amenities', 'facilities', 'services', 'spa', 'gym', 'wifi', 'parking', 'pool'],
        response: "Hotel Mahalakshmi's premium amenities:\n\n✨ 24/7 Room Service\n✨ Spa & Wellness Center\n✨ Fitness Center\n✨ Free High-Speed WiFi\n✨ Complimentary Parking\n✨ Conference Rooms\n✨ Airport Transfer Service\n✨ Concierge Service\n\nAnything specific you'd like to know about?"
    },
    location: {
        keywords: ['location', 'address', 'where', 'directions', 'map', 'nearby', 'uttarkashi'],
        response: "📍 Hotel Mahalakshmi\nPHX3+J26, Uttarkashi - Gangotri Rd\nKaneth, Uttarakhand 249194\n\n📞 +91 8449130785\n📞 +91 8979047805\n✉️ Mahalakshmihotel150@gmail.com\n\nWe're on the Uttarkashi–Gangotri route, perfect for Char Dham pilgrims and Himalayan travellers!"
    },
    booking: {
        keywords: ['book', 'reserve', 'reservation', 'availability', 'check-in', 'checkout', 'how to'],
        response: "Booking is easy! 📅\n\n1️⃣ Scroll to the 'Book Now' section\n2️⃣ Choose Hotel Booking or Restaurant Reservation\n3️⃣ Fill in your details and submit\n\nOr reach us directly:\n📞 +91 8449130785\n💬 WhatsApp us using the green button!\n\nWhat dates are you considering?"
    },
    contact: {
        keywords: ['contact', 'phone', 'call', 'email', 'reach', 'support', 'whatsapp'],
        response: "You can reach us anytime!\n\n📞 +91 8449130785\n📞 +91 8979047805\n✉️ Mahalakshmihotel150@gmail.com\n💬 WhatsApp: +91 8449130785\n\n🕐 Reception is open 24/7.\n\nWe're always happy to assist you!"
    },
    greeting: {
        keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'namaste'],
        response: "Namaste! 🙏 Welcome to Hotel Mahalakshmi!\n\nI'm your AI assistant. I can help you with:\n• Room information & prices\n• Restaurant reservations\n• Hotel amenities\n• Location & directions\n• Booking assistance\n\nHow can I make your visit special? 😊"
    },
    thanks: {
        keywords: ['thank', 'thanks', 'appreciate', 'great', 'awesome'],
        response: "You're most welcome! 😊 We look forward to hosting you at Hotel Mahalakshmi. Is there anything else I can help with?"
    }
};

function getLocalResponse(userMessage) {
    const msg = userMessage.toLowerCase();
    for (const [, data] of Object.entries(chatbotKnowledge)) {
        if (data.keywords.some(kw => msg.includes(kw))) {
            return data.response;
        }
    }
    return "Thank you for your message! 😊 I can help you with room bookings, restaurant reservations, amenities, pricing, and directions.\n\nFor immediate assistance, please call us at +91 8449130785 or use the WhatsApp button. What would you like to know?";
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
    textP.style.whiteSpace = 'pre-line';

    content.appendChild(textP);
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
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
    if (indicator) indicator.remove();
}

// ===========================
// Smooth Scroll for Nav Links
// ===========================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ===========================
// Navbar Scroll Effect
// ===========================

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.pageYOffset > 100) {
        navbar.style.background = 'rgba(10, 25, 41, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(10, 25, 41, 0.95)';
        navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
    }
});
