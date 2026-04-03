// ===========================
// Hotel Mahalakshmi - Interactive Features
// ===========================

// ===========================
// EXTERNAL INTEGRATION CONFIG
// ===========================
// Web3Forms Access Key for Email (Get from https://web3forms.com/)
const WEB3FORMS_ACCESS_KEY = '2eab75ab-1299-437a-9549-1688b81a9b51';

// Google Apps Script Web App URL for Google Sheets
const GOOGLE_SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbzXppBLXFV5h9Gkd0Si1vshQunFS_la1N3S9tZ-I9c6K4UUyX1yJZTjMqFU1Hd_PByK/exec';

// Hotel WhatsApp Number (include country code, without +)
const HOTEL_WHATSAPP_NUMBER = '918979047805';

// ===========================
// AI CHATBOT CONFIGURATION
// ===========================
// To enable AI-powered responses, add your Anthropic API key below.
// Get one at: https://console.anthropic.com/
// IMPORTANT: For production, never expose your API key in frontend code.
// Use a backend proxy server instead.
const ANTHROPIC_API_KEY = 'YOUR_ANTHROPIC_API_KEY_HERE'; // Replace with your key

const HOTEL_SYSTEM_PROMPT = `You are a helpful and friendly AI assistant for Hotel Mahalakshmi, a luxury hotel and restaurant located in Kaneth(Aungee), Uttarkashi, Uttarakhand, India.

Here is all the information about the hotel:

ROOMS:
- Deluxe Room: ₹1,999/night — King Size Bed, Valley View, Free WiFi, 24/7 Room Service
- Executive Suite: ₹2,999/night — Spacious Living Area, Premium Amenities, Complimentary Breakfast, Balcony, River View
- Family Suite: ₹3,999/night — 4 Bedrooms, Panoramic Views, Private Dining Area, 24/7 Room Service, River View

RESTAURANT:
- Fine dining offering traditional Indian flavors and contemporary culinary artistry
- Hours: 08:00 AM – 11:00 PM
- Time slots: Breakfast (12 PM), Lunch (1–2 PM), Dinner (7–10 PM)

AMENITIES: 24/7 Room Service, Free High-Speed WiFi, Complimentary Parking, Rooms, Info Service

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

async function handleHotelBooking() {
    const roomType = document.getElementById('room-type').value;
    const checkIn = document.getElementById('check-in').value;
    const checkOut = document.getElementById('check-out').value;
    const guests = document.getElementById('guests').value;
    const name = document.getElementById('guest-name').value;
    const email = document.getElementById('guest-email').value;
    const phone = document.getElementById('guest-phone') ? document.getElementById('guest-phone').value : '';

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    const prices = { 'Deluxe Room': 1999, 'Executive Suite': 2999, 'Family Suite': 3999 };
    const total = (prices[roomType] || 0) * nights;

    const bookingData = {
        type: 'Hotel Booking',
        roomType, checkIn, checkOut, nights, guests, name, email, phone,
        total: `₹${total.toLocaleString('en-IN')}`,
        timestamp: new Date().toISOString()
    };

    const emailMessage = `Room: ${roomType}\nGuest: ${name}\nEmail: ${email}\nPhone: ${phone}\nCheck-in: ${checkIn}\nCheck-out: ${checkOut}\nNights: ${nights}\nGuests: ${guests}\nTotal: ₹${total.toLocaleString('en-IN')}`;

    const submitBtn = document.querySelector('#hotel-booking-form .btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;

    try {
        if (WEB3FORMS_ACCESS_KEY && WEB3FORMS_ACCESS_KEY !== 'YOUR_WEB3FORMS_ACCESS_KEY_HERE') {
            await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    access_key: WEB3FORMS_ACCESS_KEY,
                    subject: `New Hotel Booking from ${name}`,
                    message: emailMessage,
                    from_name: "Hotel Mahalakshmi Bookings",
                    replyto: email
                })
            }).catch(err => console.error(err));
        }

        if (GOOGLE_SHEET_API_URL && GOOGLE_SHEET_API_URL !== 'YOUR_GOOGLE_SHEET_WEB_APP_URL_HERE') {
            const formData = new URLSearchParams();
            for (const key in bookingData) formData.append(key, bookingData[key]);

            await fetch(GOOGLE_SHEET_API_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            }).catch(err => console.error(err));
        }
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        document.getElementById('hotel-booking-form').reset();

        const wpMessage = `Hello, I'd like to confirm my *Hotel Booking* Request!\n\n*Name:* ${name}\n*Room:* ${roomType}\n*Check-in:* ${checkIn}\n*Check-out:* ${checkOut}\n*Nights:* ${nights}\n*Guests:* ${guests}\n*Total:* ₹${total.toLocaleString('en-IN')}\n\nPlease let me know the payment details!`;
        window.open(`https://wa.me/${HOTEL_WHATSAPP_NUMBER}?text=${encodeURIComponent(wpMessage)}`, '_blank');
    }
}

async function handleRestaurantBooking() {
    const date = document.getElementById('reservation-date').value;
    const time = document.getElementById('reservation-time').value;
    const partySize = document.getElementById('party-size').value;
    const name = document.getElementById('diner-name').value;
    const email = document.getElementById('diner-email').value;
    const phone = document.getElementById('diner-phone') ? document.getElementById('diner-phone').value : '';
    const requests = document.getElementById('special-requests').value;

    const bookingData = {
        type: 'Restaurant Reservation',
        date, time, partySize, name, email, phone,
        requests: requests || 'None',
        timestamp: new Date().toISOString()
    };

    let messageBody = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nDate: ${date}\nTime: ${time}\nParty Size: ${partySize}`;
    if (requests) messageBody += `\nSpecial Requests: ${requests}`;

    const submitBtn = document.querySelector('#restaurant-booking-form .btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;

    try {
        if (WEB3FORMS_ACCESS_KEY && WEB3FORMS_ACCESS_KEY !== 'YOUR_WEB3FORMS_ACCESS_KEY_HERE') {
            await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    access_key: WEB3FORMS_ACCESS_KEY,
                    subject: `New Restaurant Reservation from ${name}`,
                    message: messageBody,
                    from_name: "Mahalakshmi Restaurant Bookings",
                    replyto: email
                })
            }).catch(err => console.error(err));
        }

        if (GOOGLE_SHEET_API_URL && GOOGLE_SHEET_API_URL !== 'YOUR_GOOGLE_SHEET_WEB_APP_URL_HERE') {
            const formData = new URLSearchParams();
            for (const key in bookingData) formData.append(key, bookingData[key]);

            await fetch(GOOGLE_SHEET_API_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            }).catch(err => console.error(err));
        }
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        document.getElementById('restaurant-booking-form').reset();

        let wpMessage = `Hello, I'd like to confirm my *Restaurant Reservation*!\n\n*Name:* ${name}\n*Date:* ${date}\n*Time:* ${time}\n*Party Size:* ${partySize}`;
        if (requests) wpMessage += `\n*Requests:* ${requests}`;

        window.open(`https://wa.me/${HOTEL_WHATSAPP_NUMBER}?text=${encodeURIComponent(wpMessage)}`, '_blank');
    }
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
        response: "We offer three luxurious room types:\n\n🏨 Deluxe Room — ₹1,999/night\n• King Size Bed, Valley View, Free WiFi\n\n🏨 Executive Suite — ₹2,999/night\n• Spacious Living Area, Complimentary Breakfast, Balcony, River View\n\n🏨 Family Suite — ₹3,999/night\n• 4 Bedrooms, Panoramic Views, Private Dining Area, 24/7 Room Service, River View\n\nWould you like to book a room?"
    },
    restaurant: {
        keywords: ['restaurant', 'food', 'dining', 'menu', 'eat', 'dinner', 'lunch', 'breakfast', 'cuisine', 'table'],
        response: "Our fine dining restaurant is a culinary delight! 🍽️\n\n⏰ Hours: 08:00 AM – 11:00 PM\n🍴 Cuisine: Traditional Indian & Contemporary\n\nDining slots:\n• Breakfast: 12:00 PM\n• Lunch: 1:00 PM – 2:00 PM\n• Dinner: 7:00 PM – 10:00 PM\n\nShall I help you reserve a table?"
    },
    amenities: {
        keywords: ['amenities', 'facilities', 'services', 'spa', 'gym', 'wifi', 'parking', 'pool'],
        response: "Hotel Mahalakshmi's premium amenities:\n\n✨ 24/7 Room Service\n✨ Free High-Speed WiFi\n✨ Complimentary Parking\n✨ Rooms\n✨ Info Service\n\nAnything specific you'd like to know about?"
    },
    location: {
        keywords: ['location', 'address', 'where', 'directions', 'map', 'nearby', 'uttarkashi'],
        response: "📍 Hotel Mahalakshmi\nPHX3+J26, Uttarkashi - Gangotri Rd\nKaneth(Aungee), Uttarakhand 249194\n\n📞 +91 8449130785\n📞 +91 8979047805\n✉️ Mahalakshmihotel150@gmail.com\n\nWe're on the Uttarkashi–Gangotri route, perfect for Char Dham pilgrims and Himalayan travellers!"
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

// ===========================
// Gallery Dynamic Upload System
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    const uploadInput = document.getElementById('gallery-upload-input');
    const galleryGrid = document.getElementById('gallery-grid');
    const uploadCard = document.getElementById('upload-card');

    // Load saved images from LocalStorage on page load
    const loadSavedMedia = () => {
        const savedMedia = JSON.parse(localStorage.getItem('hotel_gallery_media')) || [];
        savedMedia.forEach(media => {
            renderMediaCard(media.dataUrl, media.type, media.name);
        });
    };

    // Save a new media item to LocalStorage
    const saveMedia = (dataUrl, type, name) => {
        const savedMedia = JSON.parse(localStorage.getItem('hotel_gallery_media')) || [];
        savedMedia.push({ dataUrl, type, name });
        // Keeping it small to prevent Quota Exceeded errors roughly 5MB limit
        try {
            localStorage.setItem('hotel_gallery_media', JSON.stringify(savedMedia));
        } catch (e) {
            console.error('Storage limit exceeded, cannot save more images');
            alert('Browser storage is full. Cannot save more images directly to cache.');
        }
    };

    // Render new card visually
    const renderMediaCard = (dataUrl, type, name) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'gallery-item';

        if (type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = dataUrl;
            img.alt = name || "User Uploaded Image";
            itemDiv.appendChild(img);
        } else if (type.startsWith('video/')) {
            const video = document.createElement('video');
            video.src = dataUrl;
            video.controls = true;
            video.style.width = '100%';
            video.style.height = '100%';
            video.style.objectFit = 'cover';
            itemDiv.appendChild(video);
        }

        const overlayDiv = document.createElement('div');
        overlayDiv.className = 'gallery-overlay';
        const span = document.createElement('span');
        span.textContent = 'Guest Upload';
        overlayDiv.appendChild(span);
        itemDiv.appendChild(overlayDiv);

        // Insert before the upload card so the button stays at the end
        galleryGrid.insertBefore(itemDiv, uploadCard);
    };

    if (uploadInput) {
        uploadInput.addEventListener('change', (e) => {
            const files = e.target.files;
            if (!files) return;

            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const dataUrl = event.target.result;
                    renderMediaCard(dataUrl, file.type, file.name);
                    saveMedia(dataUrl, file.type, file.name);
                };
                reader.readAsDataURL(file);
            });
            
            // Reset input so the same file can be uploaded again if needed
            uploadInput.value = '';
        });
    }

    loadSavedMedia();
});
