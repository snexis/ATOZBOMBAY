// ==========================================================================
// ATOZ BOMBAY - PLAYER ZONE CORE LOGIC (v5.5 - SIDEBAR UI & THERMAL PRINT)
// ==========================================================================

// গেমপ্লে স্টেট ট্র্যাকিং ভেরিয়েবল (মাল্টি-বেটিং সিস্টেমের জন্য অবজেক্ট হিসেবে ট্র্যাক করা হচ্ছে)
let activeBets = {}; // { 'cell_id': { patti, word, column, amount, type } }
let currentGameMode = 'both'; 
let selectedTimeSlot = null;  
let isPrinterAllowed = false; // অ্যাডমিন পারমিশন ফ্ল্যাগ
let currentLanguage = 'bn'; // ডিফল্ট ভাষা বাংলা

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

    if (playerNameDisplay) {
        playerNameDisplay.innerText = currentUser.username;
    }

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

    // মাল্টি-বেটিং টেবিল সেল সিলেক্ট করার ইভেন্ট হ্যান্ডলার সেটআপ
    setupTableInteraction();
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

/**
 * ল্যাঙ্গুয়েজ চেঞ্জার মেকানিজম (বাংলা ও ইংরেজি টগল)
 */
function applyLanguage(lang, username) {
    currentLanguage = lang;
    
    // UI ভাষা অনুযায়ী টেক্সট আপডেট করার অভিধান
    const dictionary = {
        bn: {
            welcome: "স্বাগতম",
            playPoints: "প্লে পয়েন্ট",
            winPoints: "উইনিং পয়েন্ট",
            logout: "লগআউট",
            printTxt: "প্রিন্ট রিসিট",
            placeBet: "বাজি ধরুন",
            clearBtn: "সব মুছুন",
            patti: "পাত্তি",
            single: "সিঙ্গেল"
        },
        en: {
            welcome: "Welcome",
            playPoints: "Play Points",
            winPoints: "Win Points",
            logout: "Logout",
            printTxt: "Print Receipt",
            placeBet: "Place Bet",
            clearBtn: "Clear All",
            patti: "Patti",
            single: "Single"
        }
    };

    const selectedDict = dictionary[lang];

    // DOM টেক্সট ট্রান্সলেশন পরিবর্তন
    const welcomeLabel = document.getElementById("welcomeLabel");
    if (welcomeLabel) welcomeLabel.innerText = selectedDict.welcome;

    const playPointsLabel = document.getElementById("playPointsLabel");
    if (playPointsLabel) playPointsLabel.innerText = selectedDict.playPoints;

    const winPointsLabel = document.getElementById("winPointsLabel");
    if (winPointsLabel) winPointsLabel.innerText = selectedDict.winPoints;

    const submitBetBtn = document.getElementById("submitBetBtn");
    if (submitBetBtn) submitBetBtn.innerText = selectedDict.placeBet;

    const clearBetsBtn = document.getElementById("clearBetsBtn");
    if (clearBetsBtn) clearBetsBtn.innerText = selectedDict.clearBtn;
}

/**
 * প্রিন্টার চেক বক্স ও পারমিশন কন্ট্রোল
 */
function togglePrinterCheckboxUI() {
    const printerOptionContainer = document.getElementById("printerOptionContainer");
    if (printerOptionContainer) {
        if (isPrinterAllowed) {
            printerOptionContainer.classList.remove("hidden");
        } else {
            printerOptionContainer.classList.add("hidden");
        }
    }
}

/**
 * গেম বোর্ডের ঘর (Patti/Single Cell) সিলেক্ট করার ইন্টারেকশন
 */
function setupTableInteraction() {
    const cells = document.querySelectorAll(".game-table-wrapper td.patti-cell");
    
    cells.forEach(cell => {
        cell.addEventListener("click", () => {
            const cellId = cell.getAttribute("id");
            const pattiValue = cell.getAttribute("data-patti");
            const singleValue = cell.getAttribute("data-single");
            const columnVal = cell.getAttribute("data-column");

            if (cell.classList.contains("selected")) {
                // অলরেডি সিলেক্টেড থাকলে আনসিলেক্ট করুন
                cell.classList.remove("selected");
                delete activeBets[cellId];
                removeBetOverlay(cell);
            } else {
                // নতুন সিলেক্ট করলে হাইলাইট করুন ও অবজেক্টে ডাটা যুক্ত করুন
                cell.classList.add("selected");
                activeBets[cellId] = {
                    id: cellId,
                    patti: pattiValue,
                    single: singleValue,
                    column: columnVal,
                    amount: 0 // ডিফল্ট বাজি এমাউন্ট 0, যা ইনপুট থেকে পরে রিসিভ হবে
                };
                createBetOverlay(cell);
            }
            updateActiveBetsPanel();
        });
    });
}

/**
 * সিলেক্টেড সেলের ভেতর সুন্দর নিয়ন গোল্ড প্লে পয়েন্ট ব্যাজ বা ওভারলে বসানো
 */
function createBetOverlay(cell) {
    // আগের কোনো ওভারলে থাকলে তা মুছে ফেলা
    removeBetOverlay(cell);

    const overlayDiv = document.createElement("div");
    overlayDiv.className = "active-bet-overlay";
    
    const targetValSpan = document.createElement("span");
    targetValSpan.className = "bet-target-val";
    targetValSpan.innerText = cell.getAttribute("data-patti") || cell.getAttribute("data-single");
    
    const ptsBadge = document.createElement("span");
    ptsBadge.className = "bet-pts-badge";
    ptsBadge.innerText = "0 Pts"; // ইনিশিয়াল বাজি পয়েন্ট

    overlayDiv.appendChild(targetValSpan);
    overlayDiv.appendChild(ptsBadge);
    cell.appendChild(overlayDiv);
}

/**
 * আনসিলেক্ট করার সাথে সাথে ওভারলে রিমুভ করা
 */
function removeBetOverlay(cell) {
    const overlay = cell.querySelector(".active-bet-overlay");
    if (overlay) {
        overlay.remove();
    }
}

/**
 * সিলেক্টেড ঘরগুলোর জন্য বাজির পয়েন্ট বা এমাউন্ট ইনপুট দেওয়ার প্যানেল আপডেট
 */
function updateActiveBetsPanel() {
    const activeBetsList = document.getElementById("activeBetsList");
    if (!activeBetsList) return;

    activeBetsList.innerHTML = "";

    const keys = Object.keys(activeBets);
    if (keys.length === 0) {
        activeBetsList.innerHTML = `<p style="color: var(--text-muted); font-size: 13px;">No cells selected</p>`;
        return;
    }

    keys.forEach(key => {
        const bet = activeBets[key];
        const row = document.createElement("div");
        row.className = "form-group bet-input-row";
        row.style.marginBottom = "10px";
        row.style.display = "flex";
        row.style.alignItems = "center";
        row.style.justifyContent = "space-between";

        row.innerHTML = `
            <span style="font-weight: 600; color: var(--accent-blue);">${bet.patti} (${bet.single}):</span>
            <input type="number" class="bet-amount-input" data-id="${key}" value="${bet.amount || ''}" placeholder="Points" style="width: 100px; padding: 6px; text-align: center;">
        `;

        activeBetsList.appendChild(row);
    });

    // ইনপুট ভ্যালু রিয়েল-টাইম ট্র্যাকিং
    const inputs = activeBetsList.querySelectorAll(".bet-amount-input");
    inputs.forEach(input => {
        input.addEventListener("input", (e) => {
            const cellId = e.target.getAttribute("data-id");
            const val = parseInt(e.target.value) || 0;
            
            if (activeBets[cellId]) {
                activeBets[cellId].amount = val;
                
                // গেম বোর্ডের ওভারলে ব্যাজে পয়েন্ট রিয়েল-টাইম শো করান
                const cell = document.getElementById(cellId);
                if (cell) {
                    const badge = cell.querySelector(".bet-pts-badge");
                    if (badge) {
                        badge.innerText = val + " Pts";
                    }
                }
            }
        });
    });
}

/**
 * ফায়ারবেস ডেটাবেজে বাজি সাবমিট করার কোর ফাংশন
 */
function submitBets() {
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if (!currentUser) return;

    const keys = Object.keys(activeBets);
    if (keys.length === 0) {
        alert(currentLanguage === 'en' ? "Please select at least one cell!" : "অনুগ্রহ করে কমপক্ষে একটি ঘর নির্বাচন করুন!");
        return;
    }

    // টোটাল বাজির এমাউন্ট ও সলিড ভ্যালিডেশন চেক
    let totalBetPoints = 0;
    let hasInvalidAmount = false;

    keys.forEach(key => {
        const amt = activeBets[key].amount;
        if (amt <= 0) {
            hasInvalidAmount = true;
        }
        totalBetPoints += amt;
    });

    if (hasInvalidAmount) {
        alert(currentLanguage === 'en' ? "Please enter a valid points amount for all selected cells!" : "নির্বাচিত সমস্ত ঘরে পয়েন্টের সঠিক পরিমাণ লিখুন!");
        return;
    }

    // ফায়ারবেস থেকে প্লেয়ারের রানিং পয়েন্ট যাচাইকরণ
    const userRef = window.db.ref("users/" + currentUser.username);
    userRef.once("value").then((snapshot) => {
        if (!snapshot.exists()) return;

        const userData = snapshot.val();
        const currentPlayPoints = userData.playPoints || 0;

        if (currentPlayPoints < totalBetPoints) {
            alert(currentLanguage === 'en' ? "Insufficient Play Points!" : "আপনার প্লে পয়েন্ট পর্যাপ্ত নয়!");
            return;
        }

        // পয়েন্ট ঠিক থাকলে ডেটাবেজ আপডেট করার ট্রানজেকশন প্রসেস
        const newPlayPoints = currentPlayPoints - totalBetPoints;
        
        // ফায়ারবেসে বাজির হিস্ট্রি সেভ করা
        const betId = "BET_" + Date.now();
        const betData = {
            betId: betId,
            player: currentUser.username,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            totalAmount: totalBetPoints,
            items: activeBets,
            status: "pending"
        };

        // ফায়ারবেস মাল্টি-পাথ আপডেট ট্রানজেকশন
        const updates = {};
        updates["/users/" + currentUser.username + "/playPoints"] = newPlayPoints;
        updates["/bets/" + betId] = betData;

        window.db.ref().update(updates)
            .then(() => {
                alert(currentLanguage === 'en' ? "Bet placed successfully!" : "বাজি সফলভাবে সাবমিট হয়েছে!");
                
                // থার্মাল প্রিন্ট পারমিশন থাকলে অটো-প্রিন্ট রিসিট
                const printReceiptCheckbox = document.getElementById("printReceiptCheckbox");
                if (isPrinterAllowed && printReceiptCheckbox && printReceiptCheckbox.checked) {
                    printThermalReceipt(betData);
                }

                // ক্লিনআপ স্টেট ও UI রিসেট
                clearAllBets();
            })
            .catch((error) => {
                console.error("Bet placement failed: ", error);
                alert(currentLanguage === 'en' ? "Failed to place bet. Try again." : "বাজি সাবমিট করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
            });
    });
}

/**
 * সিলেক্টেড সমস্ত বাজি ক্লিয়ার করার বাটন লজিক
 */
function clearAllBets() {
    activeBets = {};
    const cells = document.querySelectorAll(".game-table-wrapper td.patti-cell");
    cells.forEach(cell => {
        cell.classList.remove("selected");
        removeBetOverlay(cell);
    });
    updateActiveBetsPanel();
}

/**
 * থার্মাল প্রিন্টারের জন্য স্পেশাল রিসিট ডক উইন্ডো জেনারেটর
 */
function printThermalReceipt(betData) {
    const printWindow = window.open("", "_blank", "width=300,height=600");
    if (!printWindow) return;

    let itemsHtml = "";
    Object.keys(betData.items).forEach(key => {
        const item = betData.items[key];
        itemsHtml += `
            <tr style="border-bottom: 1px dashed #000;">
                <td style="padding: 5px 0; font-size: 12px;">${item.patti} (${item.single})</td>
                <td style="padding: 5px 0; text-align: right; font-size: 12px;">${item.amount} Pts</td>
            </tr>
        `;
    });

    const now = new Date();
    const formattedDate = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}`;

    const content = `
        <html>
        <head>
            <style>
                @page { size: auto; margin: 0mm; }
                body { font-family: 'Courier New', Courier, monospace; width: 58mm; padding: 10px; margin: 0; color: #000; }
                .text-center { text-align: center; }
                .divider { border-top: 1px dashed #000; margin: 10px 0; }
                table { width: 100%; border-collapse: collapse; }
            </style>
        </head>
        <body>
            <h3 class="text-center" style="margin: 0; font-size: 14px;">ATOZ BOMBAY</h3>
            <p class="text-center" style="margin: 2px 0; font-size: 10px;">PREMIUM CYBER PLAY</p>
            <div class="divider"></div>
            <p style="margin: 2px 0; font-size: 10px;">ID: ${betData.betId}</p>
            <p style="margin: 2px 0; font-size: 10px;">Player: ${betData.player}</p>
            <p style="margin: 2px 0; font-size: 10px;">Time: ${formattedDate}</p>
            <div class="divider"></div>
            <table>
                <thead>
                    <tr style="border-bottom: 1px dashed #000;">
                        <th style="text-align: left; font-size: 11px;">ITEM</th>
                        <th style="text-align: right; font-size: 11px;">POINTS</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>
            <div class="divider"></div>
            <h4 style="margin: 5px 0; text-align: right; font-size: 12px;">TOTAL: ${betData.totalAmount} Pts</h4>
            <p class="text-center" style="margin-top: 15px; font-size: 9px;">Thank you! Good Luck!</p>
        </body>
        </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
    
    // অটোমেটিক প্রিন্ট কম্যান্ড চালু ও উইন্ডো ক্লোজ
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
}
