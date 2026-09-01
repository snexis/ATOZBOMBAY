export function handlePlayerLogin(playerId, password) {
    const errorBox = document.getElementById('errorMessage');
    const users = JSON.parse(localStorage.getItem('game_users') || '{}');

    // पहले पुराने एरर मैसेज को छुपाएं
    errorBox.style.display = 'none';
    errorBox.innerText = '';

    if (!users[playerId]) {
        // ID ना मिलने पर एरर दिखाएं
        errorBox.innerText = "❌ प्लेटफ़ॉर्म पर यह आईडी मौजूद नहीं है!";
        errorBox.style.display = 'block';
        return;
    }

    if (users[playerId].password && users[playerId].password !== password) {
        // पासवर्ड गलत होने पर एरर दिखाएं
        errorBox.innerText = "❌ पासवर्ड गलत है!";
        errorBox.style.display = 'block';
        return;
    }

    // लॉगिन सफल होने पर
    sessionStorage.setItem('loggedInUser', playerId);
    window.location.href = "player.html";
}
