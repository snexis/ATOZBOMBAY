export function handlePlayerLogin(playerId, password) {
    // লোকাল মেমরি থেকে ইউজার ডাটা আনা
    const users = JSON.parse(localStorage.getItem('game_users') || '{}');

    // প্লেয়ার আইডি না থাকলে নতুন অ্যাকাউন্ট তৈরি করা (অটো-রেজিস্ট্রেশন)
    if (!users[playerId]) {
        users[playerId] = {
            id: playerId,
            password: password || '',
            balance: 0,
            winRate: 50
        };
        localStorage.setItem('game_users', JSON.stringify(users));
    } else {
        // পুরনো আইডি হলে পাসওয়ার্ড চেক করা
        if (users[playerId].password && users[playerId].password !== password) {
            alert("❌ ভুল পাসওয়ার্ড!");
            return;
        }
    }

    // সেশন সেভ করে গেম স্ক্রিনে পাঠানো
    sessionStorage.setItem('loggedInUser', playerId);
window.location.href = "player-dashboard.html";
}
