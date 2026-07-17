// ==========================================================================
// ATOZ BOMBAY - PLAYER ZONE CORE LOGIC (v7.5.0 - PERFECT i18n & UI SYNC)
// MASTER RECALL CODE: #PZ-LOGIC-RECALL-2200
// ==========================================================================

let activeBets = {}; 
let cellDetails = {}; 
let currentBetType = 'Single'; 
let currentViewMode = 'Both';  
let isPrinterAllowed = false; 
let currentLanguage = 'bn'; 
let drawTimeLeft = 90; 

let connectedUSBDevice = null;
let connectedBTCharacteristic = null;
let activePrinterType = 'window'; 

document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "player") {
        window.location.href = "index.html";
        return;
    }

    // ১. রিয়েল-টাইম ক্লক ও ব্লিংকিং ইফেক্ট
    startLiveClock();
    startDrawTimer();

    const liveDot = document.querySelector(".dot") || document.querySelector(".live-dot");
    if (liveDot) liveDot.classList.add("live-blink");

    // ২. থার্মাল প্রিন্টার সেটআপ প্যানেল রেন্ডার
    initializePrinterSetupUI();

    // ৩. সেশন ও ফায়ারবেস প্রোফাইল সিঙ্ক
    const profileTextEl = document.querySelector(".profile-text") || document.getElementById("profileLoading");
    if (profileTextEl) {
        profileTextEl.innerText = "Profile: " + currentUser.username;
    }

    window.db.ref("users/" + currentUser.username).once("value")
        .then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                
                if (userData.status === "blocked") {
                    alert(userData.language === "en" ? "Your account is blocked!" : "আপনার অ্যাকাউন্টটি ব্লক করা হয়েছে!");
                    logoutUser();
                    return;
                }

                isPrinterAllowed = userData.printAllowed === true || userData.printAllowed === "true";
                updatePrinterPermissionStatusUI();

                // অ্যাডমিন প্যানেল বা ইউজার সেটিংস থেকে আসা ভাষা রিয়েল-টাইমে অ্যাপ্লাই করা
                const lang = userData.language === "en" ? "en" : "bn";
                applyLanguage(lang);
            }
        });

    // ৪. লাইভ ব্যালেন্স ও পয়েন্ট লিসেনার (স্ক্রিনশটের ব্যালেন্স বার ম্যাচিং)
    window.db.ref("users/" + currentUser.username + "/playPoints").on("value", (snap) => {
        const val = snap.val() || 0;
        const playDisp = document.getElementById("playPointsDisplay") || document.querySelector("[id*='playPoints']") || document.querySelector(".play-balance-val");
        if (playDisp) playDisp.innerText = "৳" + val;
    });

    window.db.ref("users/" + currentUser.username + "/winPoints").on("value", (snap) => {
        const val = snap.val() || 0;
        const winDisp = document.getElementById("winPointsDisplay") || document.querySelector("[id*='winPoints']") || document.querySelector(".win-balance-val");
        if (winDisp) winDisp.innerText = "৳" + val;
    });

    window.db.ref("users/" + currentUser.username + "/rewardPoints").on("value", (snap) => {
        const val = snap.val() || 0;
        const rewardDisp = document.getElementById("rewardPointsDisplay") || document.querySelector(".reward-val");
        if (rewardDisp) rewardDisp.innerText = val;
    });

    // ৫. লাইভ ব্লক ও প্রিন্ট পারমিশন ট্র্যাকিং
    window.db.ref("users/" + currentUser.username + "/status").on("value", (snap) => {
        if (snap.val() === "blocked") logoutUser();
    });

    window.db.ref("users/" + currentUser.username + "/printAllowed").on("value", (snap) => {
        if (snap.exists()) {
            isPrinterAllowed = snap.val() === true || snap.val() === "true";
            updatePrinterPermissionStatusUI();
        }
    });

    // ৬. বোতামের ইভেন্ট কানেকশন (লগআউট ও সাবমিট)
    const logoutBtn = document.getElementById("playerLogoutBtn") || document.getElementById("logoutBtn") || document.querySelector(".logout-btn");
    if (logoutBtn) logoutBtn.addEventListener("click", logoutUser);

    const submitBtn = document.getElementById("submitBetBtn") || document.querySelector(".btn-submit");
    if (submitBtn) submitBtn.addEventListener("click", submitAllBets);

    // বোর্ড ইন্টারঅ্যাকশন চালু
    setupTableInteraction();
    setupConfigButtons();
});

/**
 * গ্লোবাল ডাইনামিক UI ও i18n অনুবাদ ইঞ্জিন (স্ক্রিনশটের সব টেক্সট কভারড)
 */
function applyLanguage(lang) {
    currentLanguage = lang;
    
    const dictionary = {
        bn: {
            // টপ বার ও ব্যালেন্স
            play_balance_lbl: "প্লে ব্যালেন্স",
            win_balance_lbl: "উইনিং ব্যালেন্স",
            reward_points_lbl: "রিওয়ার্ড পয়েন্ট",
            logout_txt: "লগআউট",
            // ফিল্টার ও রেঞ্জ
            view_by_lbl: "ভিউ মোড:",
            num_range_lbl: "নাম্বার রেঞ্জ",
            bet_type_lbl: "বাজির ধরন",
            bet_amount_lbl: "বাজির পয়েন্ট",
            selected_items_lbl: "নির্বাচিত ঘরসমূহ",
            no_selection_txt: "আপনার নির্বাচিত ঘরগুলো এখানে দেখাবে",
            // বোতাম
            btn_submit: "🚀 বাজি সাবমিট করুন",
            btn_reset: "🔄 রিসেট"
        },
        en: {
            play_balance_lbl: "Play Balance",
            win_balance_lbl: "Winning Balance",
            reward_points_lbl: "Reward Points",
            logout_txt: "Logout",
            view_by_lbl: "View By:",
            num_range_lbl: "NUMBER RANGE",
            bet_type_lbl: "BET TYPE",
            bet_amount_lbl: "BET AMOUNT",
            selected_items_lbl: "SELECTED ITEMS",
            no_selection_txt: "Your selections will appear here",
            btn_submit: "Submit Bet",
            btn_reset: "Reset"
        }
    };

    const dict = dictionary[lang] || dictionary['bn'];

    // ১. data-i18n-key মেকানিজম চেক
    document.querySelectorAll('[data-i18n-key]').forEach(elem => {
        const key = elem.getAttribute('data-i18n-key');
        if (dict[key]) {
            if (elem.tagName === 'INPUT') elem.setAttribute('placeholder', dict[key]);
            else elem.innerText = dict[key];
        }
    });

    // ২. ফলব্যাক হার্ডকোডেড ক্লাস/ইউআই ডাইনামিক অনুবাদ (যদি HTML-এ কি না থাকে)
    const viewByText = document.querySelector(".view-by-label") || document.evaluate("//text()[contains(., 'View By:')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (viewByText && viewByText.parentElement) {
        viewByText.parentElement.firstChild.textContent = dict.view_by_lbl + " ";
    }
    
    // সেকশন হেডার অনুবাদ
    document.querySelectorAll(".sidebar-section h3, .right-panel-title").forEach(el => {
        const txt = el.innerText.trim().toUpperCase();
        if (txt.includes("NUMBER RANGE")) el.innerText = dict.num_range_lbl;
        if (txt.includes("BET TYPE")) el.innerText = dict.bet_type_lbl;
        if (txt.includes("BET AMOUNT")) el.innerText = dict.bet_amount_lbl;
        if (txt.includes("SELECTED ITEMS")) el.innerText = dict.selected_items_lbl;
    });

    // ফাঁকা সিলেকশন টেক্সট
    const noSel = document.getElementById("noSelectionsNotice") || document.querySelector(".no-selection-notice");
    if (noSel && Object.keys(activeBets).length === 0) {
        noSel.innerText = dict.no_selection_txt;
    }
}

/**
 * ভিউ মোড এবং বেট টাইপ বাটন ক্লিকের লাইভ ট্র্যাকিং
 */
function setupConfigButtons() {
    // View By বাটন ট্র্যাকিং (Both, Word, Digit)
    document.querySelectorAll(".view-btn, [class*='view-by'] button").forEach(btn => {
        btn.addEventListener("click", (e) => {
            currentViewMode = e.target.innerText.trim();
            updateSelectedItemsUI();
        });
    });

    // Bet Type বাটন ট্র্যাকিং (Single, Jora, Triple)
    document.querySelectorAll(".type-btn, [class*='bet-type'] button").forEach(btn => {
        btn.addEventListener("click", (e) => {
            currentBetType = e.target.innerText.trim();
            updateSelectedItemsUI();
        });
    });
}

/**
 * ডিজিটাল ঘড়ি ইঞ্জিন
 */
function startLiveClock() {
    const liveTimeElem = document.getElementById("liveTimeDisplay");
    const liveDateElem = document.getElementById("liveDateDisplay");
    setInterval(() => {
        const now = new Date();
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        
        if (liveTimeElem) liveTimeElem.innerText = `${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
        
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        if (liveDateElem) liveDateElem.innerText = `${day}-${month}-${now.getFullYear()}`;
    }, 1000);
}

/**
 * ড্র টাইমার কাউন্টডাউন
 */
function startDrawTimer() {
    const timerDisplay = document.getElementById("drawTimeDisplay") || document.querySelector(".timer-countdown");
    const interval = setInterval(() => {
        if (drawTimeLeft <= 0) {
            clearInterval(interval);
            if (timerDisplay) timerDisplay.innerText = "Draw Locked";
            lockBoard(true);
            setTimeout(() => {
                drawTimeLeft = 90;
                lockBoard(false);
                startDrawTimer();
            }, 5000);
        } else {
            let mins = Math.floor(drawTimeLeft / 60);
            let secs = drawTimeLeft % 60;
            if (timerDisplay) timerDisplay.innerText = `0${mins}:${secs < 10 ? '0' : ''}${secs}`;
            drawTimeLeft--;
        }
    }, 1000);
}

function lockBoard(isLocked) {
    const board = document.getElementById("gameChartTableBody") || document.querySelector(".game-table-wrapper");
    if (board) {
        board.style.pointerEvents = isLocked ? "none" : "auto";
        board.style.opacity = isLocked ? "0.4" : "1";
    }
}

/**
 * গেম বোর্ড মাল্টি-ক্লিক অ্যাকুমুলেটর ইঞ্জিন (৳১০ করে প্লাস হবে)
 */
function setupTableInteraction() {
    // টেবিলের প্রতিটি ডাটা সেল টার্গেট করা
    const cells = document.querySelectorAll(".game-table-wrapper td, td.patti-cell, .admin-cell");
    
    cells.forEach(cell => {
        cell.addEventListener("click", () => {
            if (drawTimeLeft <= 0) return;

            // ইউনিক আইডি জেনারেট বা রিড
            let cellId = cell.getAttribute("id");
            if (!cellId) {
                cellId = "c_" + (cell.getAttribute("data-patti") || Math.random().toString(36).substr(2, 5));
                cell.setAttribute("id", cellId);
            }

            // স্ক্রিনশটের UI স্ট্রাকচার থেকে ডাটা রিড করা
            const pattiValue = cell.getAttribute("data-patti") || cell.childNodes[0]?.textContent?.trim() || "000";
            const wordValue = cell.getAttribute("data-word") || cell.querySelector("span:last-child")?.innerText || "XYZ";
            const colNum = cell.getAttribute("data-column") || "0";

            cell.classList.add("active-glow");
            cell.style.boxShadow = "0 0 12px #38bdf8";

            // প্রতি ক্লিকে ১০ টাকা করে বৃদ্ধি
            if (activeBets[cellId]) {
                activeBets[cellId] += 10;
            } else {
                activeBets[cellId] = 10;
            }

            cellDetails[cellId] = { patti: pattiValue, word: wordValue, column: colNum };

            // সেলের ভেতরে লাইভ পয়েন্ট ওভারলে দেখানো
            addBetVisualIndicator(cell, activeBets[cellId]);
            updateSelectedItemsUI();
        });
    });
}

function addBetVisualIndicator(cell, amount) {
    let badge = cell.querySelector(".live-load");
    if (!badge) {
        badge = document.createElement("span");
        badge.className = "live-load";
        badge.style.cssText = "display:block; font-size:11px; color:#fbbf24; font-weight:bold; text-shadow:0 0 4px #000;";
        cell.appendChild(badge);
    }
    badge.innerText = "৳" + amount;
}

/**
 * SELECTED ITEMS প্যানেল রি-রেন্ডার ইঞ্জিন
 */
function updateSelectedItemsUI() {
    const container = document.getElementById("selectedItemsContainer") || document.querySelector(".selected-items-box");
    if (!container) return;
    
    container.innerHTML = "";
    let grandTotal = 0;

    if (Object.keys(activeBets).length === 0) {
        container.innerHTML = `<p class="no-selection-notice" style="color:#64748b; font-size:12px; text-align:center; padding:20px;">${currentLanguage === 'en' ? 'Your selections will appear here' : 'আপনার নির্বাচিত ঘরগুলো এখানে দেখাবে'}</p>`;
        const totalDisplay = document.getElementById("grandTotalDisplay");
        if (totalDisplay) totalDisplay.innerText = "৳0";
        return;
    }

    Object.keys(activeBets).forEach(id => {
        const amt = activeBets[id];
        grandTotal += amt;
        const det = cellDetails[id];
        
        let prefix = "";
        if (currentBetType.toLowerCase().includes('single')) {
            prefix = `S: ${det.patti.substring(0,1)}`;
        } else {
            if (currentViewMode.toLowerCase().includes('both')) prefix = `P:${det.patti} | W:${det.word}`;
            else if (currentViewMode.toLowerCase().includes('word')) prefix = `W:${det.word}`;
            else prefix = `P:${det.patti}`;
        }

        const row = document.createElement("div");
        row.style.cssText = "display:flex; justify-content:space-between; background:#1e293b; padding:6px 10px; border-radius:4px; margin-bottom:5px; font-size:12px; color:#fff; border-left:3px solid #38bdf8;";
        row.innerHTML = `<span>[${prefix}]</span><strong style="color:#38bdf8;">৳${amt}</strong>`;
        container.appendChild(row);
    });

    const totalDisplay = document.getElementById("grandTotalDisplay") || document.querySelector(".total-amount-display");
    if (totalDisplay) totalDisplay.innerText = "Total: ৳" + grandTotal;
}

/**
 * সাবমিট ও অটো-রিসেট গেটওয়ে
 */
function submitAllBets() {
    if (Object.keys(activeBets).length === 0) {
        alert(currentLanguage === 'en' ? "Please select a bet first!" : "অনুগ্রহ করে আগে বাজি সিলেক্ট করুন!");
        return;
    }

    const container = document.getElementById("selectedItemsContainer") || document.querySelector(".selected-items-box");
    let grandTotal = 0;
    let itemsForReceipt = {};
    
    Object.keys(activeBets).forEach(id => {
        grandTotal += activeBets[id];
        itemsForReceipt[id] = { label: cellDetails[id].patti, amount: activeBets[id] };
    });

    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    const betSubmissionData = {
        betId: "BOM-" + Math.floor(100000 + Math.random() * 900000),
        player: currentUser ? currentUser.username : "Player",
        items: itemsForReceipt,
        totalAmount: grandTotal
    };

    // ফায়ারবেস পুশ লজিক
    if (window.db && currentUser) {
        window.db.ref("bets/" + betSubmissionData.betId).set({
            player: betSubmissionData.player,
            totalAmount: betSubmissionData.totalAmount,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            status: "pending"
        });
    }

    if (container) {
        container.innerHTML = `<div style="color:#22c55e; font-weight:bold; text-align:center; padding:15px;">✔ Bet Submitted Successfully!</div>`;
    }

    const autoPrintCheckbox = document.getElementById("printReceiptCheckbox");
    if (autoPrintCheckbox && autoPrintCheckbox.checked) {
        executeSmartPrint(betSubmissionData);
    }

    // ৩ সেকেন্ড পর স্বয়ংক্রিয় ক্লিনআপ ও রিসেট
    setTimeout(() => {
        activeBets = {};
        cellDetails = {};
        document.querySelectorAll(".game-table-wrapper td").forEach(cell => {
            cell.classList.remove("active-glow");
            cell.style.boxShadow = "none";
            const badge = cell.querySelector(".live-load");
            if (badge) badge.remove();
        });
        updateSelectedItemsUI();
    }, 3000);
}

function initializePrinterSetupUI() {
    const container = document.getElementById("printerOptionContainer");
    if (!container) return;
    container.innerHTML = `
        <div class="printer-setup-box" style="display:flex; flex-direction:column; gap:6px; background:#1e293b; padding:8px; border-radius:6px; margin-top:10px;">
            <div style="display:flex; justify-content:between; align-items:center; font-size:11px;">
                <span style="color:#38bdf8; font-weight:bold;">⚙️ Thermal Printer</span>
                <span id="printerStatusBadge" style="background:#ef4444; padding:2px 4px; border-radius:3px; font-size:9px;">OFFLINE</span>
            </div>
            <input type="checkbox" id="printReceiptCheckbox" checked style="display:none;">
        </div>
    `;
}

function updatePrinterPermissionStatusUI() {
    const badge = document.getElementById("printerStatusBadge");
    if (!badge) return;
    badge.innerText = isPrinterAllowed ? "ACTIVE" : "LOCKED";
    badge.style.background = isPrinterAllowed ? "#22c55e" : "#ef4444";
}

function logoutUser() {
    sessionStorage.clear();
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
}

// থার্মাল ড্রাইভার ফলব্যাক
function executeSmartPrint(betData) { printThermalWindowFallback(betData); }
function printThermalWindowFallback(betData) {
    const printWindow = window.open("", "_blank", "width=300,height=500");
    if (!printWindow) return;
    let itemsHtml = "";
    Object.keys(betData.items).forEach(k => {
        itemsHtml += `<tr><td>${betData.items[k].label}</td><td style="text-align:right;">${betData.items[k].amount} Pts</td></tr>`;
    });
    printWindow.document.write(`<html><body><h3 style="text-align:center;">ATOZ BOMBAY</h3><hr><table>${itemsHtml}</table><hr><h4 style="text-align:right;">Total: ${betData.totalAmount}</h4></body></html>`);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
}
