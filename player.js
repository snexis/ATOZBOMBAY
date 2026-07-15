// ==========================================================================
// ATOZ BOMBAY - PLAYER ZONE CORE LOGIC (v5.5 - SIDEBAR UI & THERMAL PRINT)
// ==========================================================================

// গেমপ্লে স্টেট ট্র্যাকিং ভেরিয়েবল (মাল্টি-বেটিং সিস্টেমের জন্য অবজেক্ট হিসেবে ট্র্যাক করা হচ্ছে)
let activeBets = {}; // { 'cell_id': { patti, word, column, amount, type } }
let currentGameMode = 'both'; 
let selectedTimeSlot = null;  
let isPrinterAllowed = false; // অ্যাডমিন পারমিশন ফ্ল্যাগ

document.addEventListener("DOMContentLoaded", () => {
    // সেশন চেক: লগইন ছাড়া কেউ ঢুকতে পারবে না
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "player") {
        window.location.href = "index.html";
        return;
    }

    // DOM এলিমেন্টসমূহ
    const playerNameDisplay = document.getElementById("playerNameDisplay");
    const playerLogoutBtn = document.getElementById("playerLogoutBtn");
    const gameChartTableBody = document.getElementById("gameChartTableBody");
    const printChartBtn = document.getElementById("printChartBtn");

    // ১. লাইভ ডেট ও সেকেন্ডসহ সময় আপডেট করার কন্টিনিউয়াস ঘড়ি
    startLiveClock();

    // ২. সেশন অনুযায়ী প্লেয়ার ডেটা এবং প্রিন্ট পারমিশন রিড করা
    window.db.ref("users/" + currentUser.username).once("value")
        .then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                
                // ব্লক চেক
                if (userData.status === "blocked") {
                    alert(userData.language === "en" ? "Your account is blocked!" : "আপনার অ্যাকাউন্টটি ব্লক করা হয়েছে!");
                    logoutUser();
                    return;
                }

                // প্রিন্টার পারমিশন চেক
                isPrinterAllowed = userData.printAllowed === true || userData.printAllowed === "true";
                togglePrinterCheckboxUI();

                // ভাষা সেটআপ
                const lang = userData.language === "en" ? "en" : "bn";
                applyLanguage(lang, currentUser.username);
            }
        });

    // ৩. রিয়েল-টাইম পয়েন্ট লিসেনার
    window.db.ref("users/" + currentUser.username + "/playPoints").on("value", (snap) => {
        const playPointElem = document.getElementById("playPointsDisplay");
        if (playPointElem) playPointElem.innerText = snap.val() || 0;
    });

    window.db.ref("users/" + currentUser.username + "/winPoints").on("value", (snap) => {
        const winPointElem = document.getElementById("winPointsDisplay");
        if (winPointElem) winPointElem.innerText = snap.val() || 0;
        
        const withdrawWinBalance = document.getElementById("withdrawWinBalance");
        if (withdrawWinBalance) withdrawWinBalance.innerText = snap.val() || 0;
    });

    // ৪. অ্যাডমিন কর্তৃক হুট করে ব্লক চেক
    window.db.ref("users/" + currentUser.username + "/status").on("value", (snap) => {
        if (snap.val() === "blocked") {
            logoutUser();
        }
    });

    // চার্ট প্রিন্ট মেকানিজম
    if (printChartBtn) {
        printChartBtn.addEventListener("click", () => {
            const printContent = document.getElementById("printableArea").innerHTML;
            const originalContent = document.body.innerHTML;

            document.body.innerHTML = `
                <div style="padding: 20px; font-family: sans-serif; text-align: center;">
                    <h2>ATOZ BOMBAY - OFFICIAL GAME CHART</h2>
                    <hr><br>${printContent}
                </div>
            `;
            
            window.print();
            document.body.innerHTML = originalContent;
            window.location.reload(); 
        });
    }

    if (playerLogoutBtn) {
        playerLogoutBtn.addEventListener("click", logoutUser);
    }
});

/**
 * লাইভ ডেট ও সেকেন্ডসহ কন্টিনিউয়াস ডিজিটাল ক্লক
 */
function startLiveClock() {
    const liveTimeElem = document.getElementById("liveTimeDisplay");
    const liveDateElem = document.getElementById("liveDateDisplay");
    
    if (!liveTimeElem || !liveDateElem) return;

    setInterval(() => {
        const now = new Date();
        
        // ঘড়ির সময় ফরম্যাট (HH:MM:SS AM/PM)
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 কে 12 এ কনভার্ট করা হলো
        
        const timeString = `${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
        
        // তারিখ ফরম্যাট (DD-MM-YYYY)
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const dateString = `${day}-${month}-${year}`;

        liveTimeElem.innerText = timeString;
        liveDateElem.innerText = dateString;
    }, 1000);
}

/**
 * ইউজার লগআউট হ্যান্ডলার
 */
function logoutUser() {
    sessionStorage.clear();
    localStorage.removeItem("loggedInUser");
    if (typeof firebase !== 'undefined' && firebase.auth()) {
        firebase.auth().signOut().then(() => {
            window.location.href = "index.html";
        }).catch(() => {
            window.location.href = "index.html";
        });
    } else {
        window.location.href = "index.html";
    }
}
