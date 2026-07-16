// ==========================================================================
// ATOZ BOMBAY - FIREBASE CONFIGURATION & SECURITY GATE (v5.0 - LIVE SYNC)
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

// সিকিউরিটি গেটওয়ে: অনুমোদিত ডোমেন চেক (snexis.github.io অথবা local development)
const allowedDomains = ["snexis.github.io", "localhost", "127.0.0.1"];
const currentHostname = window.location.hostname;

if (!allowedDomains.includes(currentHostname)) {
  // অননুমোদিত ডোমেন হলে ফায়ারবেস ইনিশিয়ালাইজ-ই হবে না এবং পেজ লক হবে
  document.addEventListener("DOMContentLoaded", () => {
    document.body.innerHTML = `
      <div style="color:#ff0055; text-align:center; margin-top:20vh; font-family:sans-serif; text-shadow: 0 0 10px rgba(255,0,85,0.5);">
        <h1 style="font-size: 3rem; margin-bottom: 10px;">🔴 Access Denied!</h1>
        <p style="font-size: 1.2rem; color: #ccc;">Security Alert: Unauthorized domain detected. System Locked.</p>
      </div>`;
  });
  throw new Error("Security Alert: Unauthorized domain access blocked.");
} else {
  // ডোমেন সঠিক থাকলে তবেই ফায়ারবেস ইনিশিয়ালাইজ হবে
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  
  // গ্লোবাল উইন্ডো অবজেক্টে সেটআপ
  window.auth = firebase.auth();
  window.db = firebase.database();
  
  // গেম ইঞ্জিন ও এডমিন সেটিংসে লাইভ কানেকশন সচল করা
  initFirebaseLiveSync();
}

/**
 * ফায়ারবেস থেকে লাইভ সেটিংস (গেম মোড, প্রিন্ট পারমিশন) সিঙ্ক করার ফাংশন
 * এটি আপনার game_engine.js এর generateGameTable() এর সাথে সরাসরি যুক্ত
 */
function initFirebaseLiveSync() {
  if (!window.db) return;

  const settingsRef = window.db.ref("system_settings");

  // এডমিন প্যানেল থেকে কোনো পরিবর্তন হলেই সাথে সাথে গেম আপডেট হবে
  settingsRef.on("value", (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    // ১. গেম মোড সিঙ্ক (Digit, Word, Both)
    if (data.gameMode && typeof generateGameTable === "function") {
      console.log(`[Firebase] Game Mode Synced: ${data.gameMode}`);
      generateGameTable(data.gameMode);
    }

    // ২. থার্মাল প্রিন্ট পারমিশন সিঙ্ক
    if (data.printAllowedByAdmin !== undefined) {
      window.printAllowedByAdmin = data.printAllowedByAdmin;
      console.log(`[Firebase] Print Permission: ${window.printAllowedByAdmin}`);
    }
  });
}
