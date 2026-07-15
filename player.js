// ==========================================================================
// ATOZ BOMBAY - PLAYER ZONE CORE LOGIC (v5.2 - FULL INTEGRATION)
// ==========================================================================

// গেমপ্লে স্টেট ট্র্যাকিং ভেরিয়েবল
let selectedPatti = null;
let selectedWord = null;
let selectedColumn = null;
let currentGameMode = 'both'; // ডিফল্ট মোড (options: 'digit', 'word', 'both')
let selectedTimeSlot = null;  // প্লেয়ারের সিলেক্ট করা টাইম স্লট

document.addEventListener("DOMContentLoaded", () => {
    // সেশন চেক: লগইন ছাড়া কেউ ঢুকতে পারবে না
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "player") {
        window.location.href = "index.html";
        return;
    }

    // DOM এলিমেন্টসমূহ সিলেক্ট করা
    const playerNameDisplay = document.getElementById("playerNameDisplay");
    const playerLogoutBtn = document.getElementById("playerLogoutBtn");
    const gameChartTableBody = document.getElementById("gameChartTableBody");
    const printChartBtn = document.getElementById("printChartBtn");

    // ল্যাঙ্গুয়েজ ডিকশনারি
    const languageStrings = {
        bn: {
            logo: "এ টু জেড বোম্বে",
            logout: "লগআউট",
            welcome: "স্বাগতম, " + currentUser.username + "!",
            subtext: "আপনার লাইভ গেমিং ড্যাশবোর্ড এখানে দেখুন।",
            chartTitle: "📊 লাইভ গেম রেজাল্ট চার্ট",
            printBtn: "চার্ট প্রিন্ট করুন",
            thTime: "সময় (Time Slot)",
            thResult: "উইনিং নাম্বার (Result)"
        },
        en: {
            logo: "ATOZ BOMBAY",
            logout: "Logout",
            welcome: "Welcome, " + currentUser.username + "!",
            subtext: "View your live gaming dashboard here.",
            chartTitle: "📊 Live Game Result Chart",
            printBtn: "Print Chart",
            thTime: "Time Slot",
            thResult: "Winning Number"
        }
    };

    // ফায়ারবেস থেকে প্লেয়ারের রিয়েল-টাইম ডেটা (Points & Language) রিড এবং ট্র্যাক করা
    window.db.ref("users/" + currentUser.username).on("value", (snapshot) => {
        if (snapshot.exists()) {
            const userData = snapshot.val();
            
            // অ্যাকাউন্ট ব্লক করা থাকলে সঙ্গে সঙ্গে কিক-আউট
            if (userData.status === "blocked") {
                alert(userData.language === "en" ? "Your account is blocked!" : "আপনার অ্যাকাউন্টটি ব্লক করা হয়েছে!");
                logoutUser();
                return;
            }

            // প্লেয়ারের ড্যাশবোর্ডের Play Point এবং Win Point আপডেট করা
            const playPointElem = document.getElementById("playPointsDisplay");
            const winPointElem = document.getElementById("winPointsDisplay");
            if (playPointElem) playPointElem.innerText = userData.playPoints || 0;
            if (winPointElem) winPointElem.innerText = userData.winPoints || 0;

            // ভাষা সেটআপ করা
            const lang = userData.language === "en" ? "en" : "bn";
            applyLanguage(lang);
        }
    });

    // স্ক্রিনের টেক্সটগুলো নির্দিষ্ট ভাষায় রূপান্তর করার ফাংশন
    function applyLanguage(lang) {
        const str = languageStrings[lang];
        
        const logoText = document.getElementById("navLogoText");
        const welcomeHeading = document.getElementById("welcomeHeading");
        const welcomeSubtext = document.getElementById("welcomeSubtext");
        const chartTitle = document.getElementById("chartTitle");
        const printBtnText = document.getElementById("printBtnText");
        const thTime = document.getElementById("thTime");
        const thResult = document.getElementById("thResult");

        if (logoText) logoText.innerText = str.logo;
        if (playerLogoutBtn) playerLogoutBtn.innerText = str.logout;
        if (playerNameDisplay) playerNameDisplay.innerText = currentUser.username.toUpperCase();
        if (welcomeHeading) welcomeHeading.innerText = str.welcome;
        if (welcomeSubtext) welcomeSubtext.innerText = str.subtext;
        if (chartTitle) chartTitle.innerText = str.chartTitle;
        if (printBtnText) printBtnText.innerText = str.printBtn;
        if (thTime) thTime.innerText = str.thTime;
        if (thResult) thResult.innerText = str.thResult;

        // লাইভ চার্ট লিসেনার চালু করা
        listenToLiveChart();
    }

    // ১. রিয়েল-টাইম লাইভ গেম চার্ট (No Refresh)
    function listenToLiveChart() {
        window.db.ref("gameChart").on("value", (snapshot) => {
            if (gameChartTableBody) {
                gameChartTableBody.innerHTML = ""; // ডুপ্লিকেট এড়াতে টেবিল খালি করা
                if (snapshot.exists()) {
                    snapshot.forEach((childSnapshot) => {
                        const timeSlot = childSnapshot.key;
                        const data = childSnapshot.val();

                        const row = document.createElement("tr");
                        row.innerHTML = `
                            <td><strong>${timeSlot}</strong></td>
                            <td><span class="result-number-badge">${data.result}</span></td>
                        `;
                        gameChartTableBody.appendChild(row);
                    });
                }
            }
        });
    }

    // ২. স্মার্ট চার্ট প্রিন্ট মেকানিজম (Clean Layout)
    if (printChartBtn) {
        printChartBtn.addEventListener("click", () => {
            const printContent = document.getElementById("printableArea").innerHTML;
            const originalContent = document.body.innerHTML;

            document.body.innerHTML = `
                <div style="padding: 20px; font-family: sans-serif; text-align: center;">
                    <h2>ATOZ BOMBAY - OFFICIAL GAME CHART</h2>
                    <hr>
                    <br>
                    ${printContent}
                </div>
            `;
            
            window.print();
            document.body.innerHTML = originalContent;
            window.location.reload(); 
        });
    }

    // লগআউট হ্যান্ডলার
    if (playerLogoutBtn) {
        playerLogoutBtn.addEventListener("click", logoutUser);
    }

    function logoutUser() {
        sessionStorage.clear();
        window.location.href = "index.html";
    }

    // ==========================================
    // ৩. গেম খেলুন (PLAY GAME) মেকানিজম এবং বাটন লিসেনার
    // ==========================================
    const playGameCard = document.getElementById("playGameCard"); // 'গেম খেলুন' ক্লিকেবল কার্ড/বাটন
    if (playGameCard) {
        playGameCard.addEventListener("click", openPlayGameDashboard);
    }
});

/**
 * ৪. "গেম খেলুন" বাটনে ক্লিক করলে সম্পূর্ণ ড্যাশবোর্ড ও গেম সেটআপ ওপেন করার ফাংশন
 */
function openPlayGameDashboard() {
    const modal = document.getElementById("playGameModal"); // আপনার ড্যাশবোর্ড পপআপ বা মডাল কন্টেইনার
    if (!modal) return;

    modal.style.display = "block"; // পপআপ স্ক্রিনে দৃশ্যমান করা

    // ক) টাইম স্লট এবং মোড সিলেক্টর তৈরি করা
    createGameControlsHTML();

    // খ) ডিফল্ট গেম টেবিল রেন্ডার করা (যা game_engine.js থেকে রেন্ডার হবে)
    if (typeof generateGameTable === "function") {
        generateGameTable();
    }
}

/**
 * ৫. প্লে-জোন মডালের ভেতর টাইম স্লট, মোড সিলেক্টর এবং ইনপুট ফিল্ড ডাইনামিকালি সেট করার ফাংশন
 */
function createGameControlsHTML() {
    const controlsContainer = document.getElementById("gameControlsWrapper");
    if (!controlsContainer) return;

    // খাতার নকশা ও আপনার রিকোয়েস্ট অনুযায়ী ওপরে মোড সিলেক্টর ও নিচে টাইম স্লট বাটন ও ইনপুট বসানো হচ্ছে
    controlsContainer.innerHTML = `
        <div class="mode-selector-container" id="gameModeSelector">
            <button type="button" class="mode-btn" id="btnModeDigit" onclick="switchGameMode('digit')">Digit Only</button>
            <button type="button" class="mode-btn" id="btnModeWord" onclick="switchGameMode('word')">Word Only</button>
            <button type="button" class="mode-btn active" id="btnModeBoth" onclick="switchGameMode('both')">Both (Digit + Word)</button>
        </div>

        <div class="time-box-section">
            <h4 class="section-title">🕒 সিলেক্ট টাইম স্লট (Time Slot)</h4>
            <div class="time-slot-list" id="timeBoxContainer">
                <button type="button" class="slot-btn" id="btn-slot1" onclick="selectTimeSlot('slot1', '1st Baji (10:00 AM)')">1st Baji (10 AM)</button>
                <button type="button" class="slot-btn" id="btn-slot2" onclick="selectTimeSlot('slot2', '2nd Baji (01:00 PM)')">2nd Baji (1 PM)</button>
                <button type="button" class="slot-btn" id="btn-slot3" onclick="selectTimeSlot('slot3', '3rd Baji (04:00 PM)')">3rd Baji (4 PM)</button>
            </div>
        </div>

        <div class="bet-input-section">
            <div class="selected-details" id="selectedPattiDisplay">সিলেকশন: কোনো ঘর সিলেক্ট করা হয়নি</div>
            <div class="bet-form">
                <input type="number" id="betAmountInput" placeholder="বাজির পরিমাণ লিখুন (যেমন: 50)" min="1">
                <button type="button" class="submit-bet-btn" onclick="submitPlayerBet()">বাজি সাবমিট করুন (Submit Bet)</button>
            </div>
        </div>
    `;
}

/**
 * ৬. প্লেয়ার মোড চেঞ্জ করলে রান হওয়া ফাংশন (৩টি আলাদা অপশন হ্যান্ডলিং)
 */
window.switchGameMode = function(mode) {
    currentGameMode = mode;

    // বাটনগুলোর অ্যাক্টিভ ক্লাস টগল করা
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    if (mode === 'digit') document.getElementById('btnModeDigit').classList.add('active');
    if (mode === 'word') document.getElementById('btnModeWord').classList.add('active');
    if (mode === 'both') document.getElementById('btnModeBoth').classList.add('active');

    // নতুন মোড অনুযায়ী টেবিল রি-রেন্ডার করা
    if (typeof generateGameTable === 'function') {
        generateGameTable();
    }
    
    // আগের ভুল বাজি সিলেকশন রিসেট করা
    selectedPatti = null;
    selectedWord = null;
    selectedColumn = null;
    const displayElement = document.getElementById('selectedPattiDisplay');
    if (displayElement) displayElement.innerText = "সিলেকশন: কোনো ঘর সিলেক্ট করা হয়নি";
};

/**
 * ৭. টাইম স্লট সিলেক্ট করার ফাংশন
 */
window.selectTimeSlot = function(slotId, slotName) {
    document.querySelectorAll('.slot-btn').forEach(btn => btn.classList.remove('active'));
    
    const targetBtn = document.getElementById(`btn-${slotId}`);
    if (targetBtn) targetBtn.classList.add('active');
    selectedTimeSlot = slotId;

    console.log(`Selected Slot: ${slotName}`);
};

/**
 * ৮. সিকিউর বাজি সাবমিট করার ফাংশন (ফায়ারবেস ইন্টিগ্রেশন)
 */
window.submitPlayerBet = function() {
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    const betAmountInput = document.getElementById('betAmountInput');
    const betAmount = parseInt(betAmountInput ? betAmountInput.value : 0);

    // সিকিউরিটি ভ্যালিডেশন চেক
    if (!selectedTimeSlot) {
        alert("দয়া করে আগে একটি Time Slot সিলেক্ট করুন!");
        return;
    }
    if (!selectedPatti || !selectedWord || !selectedColumn) {
        alert("চার্ট থেকে আপনার পাত্তি বা ওয়ার্ড সিলেক্ট করুন!");
        return;
    }
    if (isNaN(betAmount) || betAmount <= 0) {
        alert("সঠিক বাজির পরিমাণ (Amount) লিখুন!");
        return;
    }

    // ফায়ারবেস থেকে প্লেয়ারের লাইভ ব্যালেন্স রিড করা
    window.db.ref("users/" + currentUser.username).once("value").then((snapshot) => {
        if (snapshot.exists()) {
            const userData = snapshot.val();
            const currentPlayPoints = parseInt(userData.playPoints || 0);

            if (betAmount > currentPlayPoints) {
                alert("আপনার কাছে পর্যাপ্ত Play Point নেই!");
                return;
            }

            // বাজির ডাটা অবজেক্ট
            const betData = {
                username: currentUser.username,
                patti: selectedPatti,
                word: selectedWord,
                column: selectedColumn,
                amount: betAmount,
                timeSlot: selectedTimeSlot,
                mode: currentGameMode,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                status: 'pending'
            };

            // ডাটাবেজ আপডেট ডিক্লেয়ারেশন
            const newBetKey = window.db.ref().child(`bets`).push().key;
            const updates = {};
            updates[`bets/${newBetKey}`] = betData;
            updates[`users/${currentUser.username}/playPoints`] = currentPlayPoints - betAmount;

            window.db.ref().update(updates)
                .then(() => {
                    alert("আপনার বাজি সফলভাবে সাবমিট হয়েছে!");
                    if (betAmountInput) betAmountInput.value = ''; // ইনপুট খালি করা
                    
                    // সিলেকশন ক্লিয়ার
                    selectedPatti = null;
                    selectedWord = null;
                    selectedColumn = null;
                    const displayElement = document.getElementById('selectedPattiDisplay');
                    if (displayElement) displayElement.innerText = "সিলেকশন: কোনো ঘর সিলেক্ট করা হয়নি";
                    
                    // টেবিল ক্লিয়ার
                    document.querySelectorAll('.patti-cell.selected').forEach(cell => cell.classList.remove('selected'));
                })
                .catch((error) => {
                    console.error("Bet Submission Error: ", error);
                    alert("বাজি সাবমিট করতে সমস্যা হয়েছে, আবার চেষ্টা করুন।");
                });
        }
    });
};
