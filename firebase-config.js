// ==========================================================================
// ATOZ BOMBAY - FIREBASE CONFIGURATION & SECURITY GATE (v5.6 - COMPAT MODE)
// ==========================================================================

// ফায়ারবেস কনফিগারেশন অবজেক্ট (অপরিবর্তিত)
const firebaseConfig = {
  apiKey: "AIzaSyB0HO_fnRt3FMjykq7Lo_Z0sAYy3kee2W4",
  authDomain: "a-toz-patti.firebaseapp.com",
  databaseURL: "https://a-toz-patti-default-rtdb.firebaseio.com",
  projectId: "a-toz-patti",
  storageBucket: "a-toz-patti.firebasestorage.app",
  messagingSenderId: "71546188781",
  appId: "1:71546188781:web:19bfea6537335132c86de4",
  measurementId: "G-8ENRFZRWLP"
};

// সিকিউরিটি গেটওয়ে: অনুমোদিত ডোমেন চেক
const allowedDomains = ["snexis.github.io", "localhost", "127.0.0.1"];
const currentHostname = window.location.hostname;

if (!allowedDomains.includes(currentHostname)) {
  document.addEventListener("DOMContentLoaded", () => {
    document.body.innerHTML = `
      <div style="color:#ff0055; text-align:center; margin-top:20vh; font-family:sans-serif; text-shadow: 0 0 10px rgba(255,0,85,0.5);">
        <h1 style="font-size: 3rem; margin-bottom: 10px;">🔴 Access Denied!</h1>
        <p style="font-size: 1.2rem; color: #ccc;">Security Alert: Unauthorized domain detected. System Locked.</p>
      </div>`;
  });
  throw new Error("Security Alert: Unauthorized domain access blocked.");
} else {
  // ডোমেন ঠিক থাকলে ফায়ারবেস অ্যাপ ইনিশিয়ালাইজ হবে (Compat Version Syntax)
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  
  // মেন্টর ফিক্স: উইন্ডো অবজেক্ট এবং গ্লোবাল অবজেক্ট নিশ্চিত করা (সার্ভার এরর ফিক্স)
  window.auth = firebase.auth();
  window.db = firebase.database();
  
  // লাইভ সিঙ্ক ফাংশন চালু
  initFirebaseLiveSync();
}

/**
 * ফায়ারবেস রিয়েলটাইম ডেটাবেজ থেকে লাইভ সেটিংস সিঙ্ক করার ফাংশন
 */
function initFirebaseLiveSync() {
  // মেন্টর ফিক্স: যদি কোনো কারণে window.db লোড হতে দেরি হয়, সরাসরি ফায়ারবেস অবজেক্ট ব্যাকআপ হিসেবে কাজ করবে
  if (!window.db) {
    window.db = firebase.database();
  }

  const settingsRef = window.db.ref("system_settings");

  // ডাটাবেজে কোনো চেঞ্জ হলেই লাইভ রিড হবে
  settingsRef.on("value", (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    // ১. গেম মোড আপডেট (Digit / Word / Both)
    if (data.gameMode && typeof generateGameTable === "function") {
      console.log(`[Firebase v5.6] Game Mode Synced: ${data.gameMode}`);
      generateGameTable(data.gameMode);
    }

    // ২. থার্মাল প্রিন্ট পারমিশন আপডেট
    if (data.printAllowedByAdmin !== undefined) {
      window.printAllowedByAdmin = data.printAllowedByAdmin;
      console.log(`[Firebase v5.6] Print Permission: ${window.printAllowedByAdmin}`);
    }
  });
}
