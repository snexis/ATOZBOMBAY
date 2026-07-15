// ==========================================================================
// ATOZ BOMBAY - PLAYER ZONE CORE LOGIC (v5.3 - SECURE & FAST)
// ==========================================================================

// গেমপ্লে স্টেট ট্র্যাকিং ভেরিয়বল
let selectedPatti = null;
let selectedWord = null;
let selectedColumn = null;
let currentGameMode = 'both'; 
let selectedTimeSlot = null;  

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

    // ক) ভাষা এবং ব্লক স্ট্যাটাস একবার রিড করা (যাতে লুপ বা রিফ্রেশ না হয়)
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

                // ভাষা সেটআপ
                const lang = userData.language === "en" ? "en" : "bn";
                applyLanguage(lang);
            }
        });

    // খ) শুধুমাত্র পয়েন্ট রিয়েল-টাইম ট্র্যাক করা (অন্য কোনো ফাংশন এখানে লুপ করবে না)
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

    // গ) ব্লক স্ট্যাটাস রিয়েলটাইম লিসেন করা (যদি এডমিন হুট করে ব্লক করে)
    window.db.ref("users/" + currentUser.username + "/status").on("value", (snap) => {
        if (snap.val() === "blocked") {
            logoutUser();
        }
    });

    // স্ক্রিনের টেক্সট রূপান্তর করার ফাংশন
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

        // রেজাল্ট চার্ট লিসেনার কেবল একবারই চালু হবে
        listenToLiveChart();
    }

    // লাইভ রেজাল্ট চার্ট
    function listenToLiveChart() {
        window.db.ref("gameChart").on("value", (snapshot) => {
            if (gameChartTableBody) {
                gameChartTableBody.innerHTML = ""; 
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

    // চার্ট প্রিন্ট মেকানিজম
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

    // লগআউট
    if (playerLogoutBtn) {
        playerLogoutBtn.addEventListener("click", logoutUser);
    }

    function logoutUser() {
        sessionStorage.clear();
        window.location.href = "index.html";
    }
});

/**
 * ২. "গেম খেলুন" বাটনে ক্লিক করলে রান হবে (HTML Onclick থেকে সরাসরি ট্রিগার্ড)
 */
window.openPlayGameDashboard = function() {
    // পপআপ স্ক্রিনে আনা (Flex মোডে)
    const modal = document.getElementById("playGameBox"); 
    if (modal) {
        modal.style.display = "flex";
    }

    // ক) মোড সিলেক্টর ও টাইম স্লট জেনারেট করা
    createGameControlsHTML();

    // খ) টেবিল জেনারেট করা
    if (typeof generateGameTable === "function") {
        generateGameTable();
    }
};

/**
 * ৩. প্লে-জোন মডালের কন্ট্রোল প্যানেল জেনারেশন
 */
function createGameControlsHTML() {
    const controlsContainer = document.getElementById("gameControlsWrapper");
    if (!controlsContainer) return;

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

        <div class="bet-control-panel">
            <div class="selected-patti-info">
                <span>সিলেক্টেড পাত্তি / ওয়ার্ড: </span>
                <strong id="selectedPattiDisplay">কোনোটি নয়</strong>
            </div>
            <div class="bet-input-row">
                <input type="number" id="betAmountInput" placeholder="অ্যামাউন্ট লিখুন" min="10">
                <button type="button" id="submitBetBtn" class="submit-bet-btn" onclick="submitPlayerBet()">বাজি ধরুন (Bet / Submit)</button>
            </div>
        </div>
    `;
}

/**
 * ৪. মোড স্যুইচ লজিক
 */
window.switchGameMode = function(mode) {
    currentGameMode = mode;

    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    if (mode === 'digit') document.getElementById('btnModeDigit').classList.add('active');
    if (mode === 'word') document.getElementById('btnModeWord').classList.add('active');
    if (mode === 'both') document.getElementById('btnModeBoth').classList.add('active');

    if (typeof generateGameTable === 'function') {
        generateGameTable();
    }
    
    selectedPatti = null;
    selectedWord = null;
    selectedColumn = null;
    const displayElement = document.getElementById('selectedPattiDisplay');
    if (displayElement) displayElement.innerText = "কোনোটি নয়";
};

/**
 * ৫. টাইম স্লট সিলেক্ট লজিক
 */
window.selectTimeSlot = function(slotId, slotName) {
    document.querySelectorAll('.slot-btn').forEach(btn => btn.classList.remove('active'));
    
    const targetBtn = document.getElementById(`btn-${slotId}`);
    if (targetBtn) targetBtn.classList.add('active');
    selectedTimeSlot = slotId;
};

/**
 * ৬. বাজি সাবমিট লজিক
 */
window.submitPlayerBet = function() {
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    const betAmountInput = document.getElementById('betAmountInput');
    const betAmount = parseInt(betAmountInput ? betAmountInput.value : 0);

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

    window.db.ref("users/" + currentUser.username).once("value").then((snapshot) => {
        if (snapshot.exists()) {
            const userData = snapshot.val();
            const currentPlayPoints = parseInt(userData.playPoints || 0);

            if (betAmount > currentPlayPoints) {
                alert("আপনার কাছে পর্যাপ্ত Play Point নেই!");
                return;
            }

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

            const newBetKey = window.db.ref().child(`bets`).push().key;
            const updates = {};
            updates[`bets/${newBetKey}`] = betData;
            updates[`users/${currentUser.username}/playPoints`] = currentPlayPoints - betAmount;

            window.db.ref().update(updates)
                .then(() => {
                    alert("আপনার বাজি সফলভাবে সাবমিট হয়েছে!");
                    if (betAmountInput) betAmountInput.value = ''; 
                    
                    selectedPatti = null;
                    selectedWord = null;
                    selectedColumn = null;
                    const displayElement = document.getElementById('selectedPattiDisplay');
                    if (displayElement) displayElement.innerText = "কোনোটি নয়";
                    
                    document.querySelectorAll('.patti-cell.selected').forEach(cell => cell.classList.remove('selected'));
                })
                .catch((error) => {
                    console.error("Bet Submission Error: ", error);
                    alert("বাজি সাবমিট করতে সমস্যা হয়েছে।");
                });
        }
    });
};
