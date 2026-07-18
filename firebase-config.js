/* ==========================================================================
   🔑 PROJECT: A-TO-Z BOMBAY PLAY ZONE (A-TO-Z-PATTI)
   📁 FILE: firebase-config.js
   📌 VERSION: v6.1.0 [LOG #2200 MASTER SECURITY & DATA SYNC]
   ========================================================================== */

// ফায়ারবেস কনফিগারেশন অবজেক্ট (৪১৯ নম্বর লাইনের এরর ফিক্সড)
export const firebaseConfig = {
  apiKey: "AIzaSyB0HO_fnRt3FMjykq7Lo_Z0sAYy3kee2W4",
  authDomain: "a-toz-patti.firebaseapp.com",
  databaseURL: "https://a-toz-patti-default-rtdb.firebaseio.com",
  projectId: "a-toz-patti",
  storageBucket: "a-toz-patti.firebasestorage.app",
  messagingSenderId: "71546188781",
  appId: "1:71546188781:web:19bfea6537335132c86de4",
  measurementId: "G-8ENRFZRWLP"
};

// সিকিউরিটি গেটওয়ে: অনুমোদিত ডোমেন চেক (রাইট ক্লিক ও ইন্সপেক্ট ব্লক ইন্টিগ্রেশন রেডি)
const allowedDomains = ["snexis.github.io", "localhost", "127.0.0.1"];
const currentHostname = window.location.hostname;

if (!allowedDomains.includes(currentHostname)) {
  document.addEventListener("DOMContentLoaded", () => {
    document.body.innerHTML = `
      <div style="background:#020617; color:#ff0055; text-align:center; padding-top:20vh; height:100vh; font-family:sans-serif; text-shadow: 0 0 10px rgba(255,0,85,0.5); margin:0;">
        <h1 style="font-size: 3rem; margin-bottom: 10px;">🔴 Access Denied!</h1>
        <p style="font-size: 1.2rem; color: #ccc;">Security Alert: Unauthorized domain detected. System Locked.</p>
      </div>`;
  });
  throw new Error("Security Alert: Unauthorized domain access blocked.");
}

// গ্লোবাল স্টেট এবং লাইভ সেটিংস কন্টেইনার (মাস্টার কোর মেমোরি)
window.GameGlobals = {
  winPercentage: 90,        // ডিফল্ট উইনিং পার্সেন্টেজ (অ্যাডমিন সিঙ্ক হবে)
  playerCommissionRate: 5,  // #2200 সাইডবার মডিউলে ব্যবহারের জন্য কমিশন রেট
  printAllowedByAdmin: false,
  currentDraw: {
    drawId: "0000",
    drawTime: "00:00",
    nextDraw: "00:00"
  }
};

/**
 * ড্যাশবোর্ড স্ক্রিপ্ট থেকে কল করার জন্য মডিউল ফ্রেন্ডলি লাইভ সিঙ্ক গেটওয়ে
 * @param {Object} db - ফায়ারবেস রিয়েলটাইম ডাটাবেস ইন্সট্যান্স
 * @param {Function} ref - ফায়ারবেস ref ফাংশন
 * @param {Function} onValue - ফায়ারবেস onValue ফাংশন
 */
export function initFirebaseLiveSync(db, ref, onValue) {
  const settingsRef = ref(db, "system_settings");

  onValue(settingsRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    console.log("[#2200-MASTER-CORE] Live Settings Synced:", data);

    // ১. অ্যাডমিন কন্ট্রোলড উইনিং পার্সেন্টেজ ও কমিশন সিঙ্ক
    if (data.winPercentage !== undefined) window.GameGlobals.winPercentage = data.winPercentage;
    
    // #2200 আপডেট: কমিশন হেডার থেকে বাদ, কিন্তু ব্যাকএন্ড মেমোরিতে সিঙ্ক থাকবে সাইডবার প্যানেলের জন্য
    if (data.playerCommissionRate !== undefined) {
      window.GameGlobals.playerCommissionRate = data.playerCommissionRate;
    }

    // ২. থার্মাল প্রিন্ট পারমিশন এবং UI বাটন অ্যাকশন সিঙ্ক
    if (data.printAllowedByAdmin !== undefined) {
      window.GameGlobals.printAllowedByAdmin = data.printAllowedByAdmin;
      const printBtn = document.getElementById("btnInstantPrint");
      if (printBtn) {
        if (data.printAllowedByAdmin) {
          printBtn.removeAttribute("disabled");
          printBtn.style.opacity = "1";
          printBtn.style.cursor = "pointer";
        } else {
          printBtn.setAttribute("disabled", "true");
          printBtn.style.opacity = "0.4";
          printBtn.style.cursor = "not-allowed";
        }
      }
    }

    // ৩. লাইভ ড্র স্ট্যাটাস ও সাইডবার টাইমিং আপডেট
    if (data.currentDraw) {
      window.GameGlobals.currentDraw = data.currentDraw;
      
      const txtDrawId = document.getElementById("txtDrawId");
      const txtDrawTime = document.getElementById("txtDrawTime");
      const txtNextDraw = document.getElementById("txtNextDraw");
      
      if (txtDrawId) txtDrawId.innerText = `Draw ID: ${data.currentDraw.drawId}`;
      if (txtDrawTime) txtDrawTime.innerText = `Draw Time: ${data.currentDraw.drawTime}`;
      if (txtNextDraw) txtNextDraw.innerText = `Next Draw: ${data.currentDraw.nextDraw}`;
    }

    // ৪. অ্যাডমিন প্যানেল থেকে পাঠানো গেম মোড অনুযায়ী ভিউ অটো-ফিল্টার আপডেট (Both, Word, Digit)
    if (data.gameMode) {
      const activeBtn = document.querySelector(`.board-controls button[data-mode="${data.gameMode}"]`);
      if (activeBtn && typeof window.changeMode === "function") {
        window.changeMode(data.gameMode, activeBtn);
      } else if (window.PlayerEngine && typeof window.PlayerEngine.generateTable === "function") {
        // যদি ডিরেক্ট ইঞ্জিন এক্সপোজড থাকে
        window.PlayerEngine.generateTable(data.gameMode);
        document.querySelectorAll('.board-controls .btn-ctrl').forEach(b => {
          if(b.getAttribute('data-mode') === data.gameMode) b.classList.add('active');
          else b.classList.remove('active');
        });
      }
    }
  });
}
