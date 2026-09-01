export function handlePlayerLogin(playerId, password) {
    // লোকাল মেমরি থেকে ইউজার ডাটা আনা
    const users = JSON.parse(localStorage.getItem('game_users') || '{}');

    // প্লেয়ার আইডি মেমরিতে আছে কিনা চেক করা
    if (!users[playerId]) {
        alert("❌ এই আইডিটি পাওয়া যায়নি! আগে অ্যাডমিন প্যানেল থেকে আইডি রেজিস্টার করুন।");
        return;
    }

    // পাসওয়ার্ড চেক করা
    if (users[playerId].password && users[playerId].password !== password) {
        alert("❌ ভুল পাসওয়ার্ড!");
        return;
    }

    // সঠিক হলে সেশন সেভ করে ড্যাশবোর্ডে পাঠাবে
    sessionStorage.setItem('loggedInUser', playerId);
    window.location.href = "player.html";
}
