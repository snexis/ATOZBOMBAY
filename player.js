// ==========================================================================
// ATOZ BOMBAY - PLAYER ZONE CORE LOGIC (v7.2.0 - LIVE ENGAGED & RE-UPDATED)
// MASTER RECALL CODE: #PZ-LOGIC-RECALL-2200
// ==========================================================================

// গেমপ্লে স্টেট ট্র্যাকিং এবং প্রিন্টার সেটিংস ভেরিয়েবল
let activeBets = {}; // { 'cell_id': amount } -> আমাদের অ্যামাউন্ট অ্যাকুমুলেটর লজিক
let cellDetails = {}; // সেলের বাকি মেটাডাটা ব্যাকআপ রাখার জন্য
let currentBetType = 'Single'; // ডিফল্ট বেট টাইপ (সিঙ্গেল/জোড়া/ট্রিপল ফিল্টারের জন্য)
let currentViewMode = 'Both';  // ডিফল্ট ভিউ মোড (Both/Word/Digit)
let isPrinterAllowed = false; // অ্যাডমিন পারমিশন ফ্ল্যাগ (ফায়ারবেস থেকে লাইভ আসবে)
let currentLanguage = 'bn'; // ডিফল্ট ভাষা
let drawTimeLeft = 90; // ড্র টাইম লকের কাউন্টডাউন সেকেন্ড (সার্ভার মেকানিজম)

// থার্মাল প্রিন্টিং কানেক্টিভিটি ভেরিয়েবল (USB & Bluetooth)
let connectedUSBDevice = null;
let connectedBTCharacteristic = null;
let activePrinterType = 'window'; // 'window' (default fallback), 'usb', 'bluetooth'

document.addEventListener("DOMContentLoaded", () => {
    // সেশন চেক: লগইন ছাড়া কেউ প্রবেশ করতে পারবে না
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "player") {
        window.location.href = "index.html";
        return;
    }

    // DOM এলিমেন্টসমূহ
    const playerNameDisplay = document.getElementById("playerNameDisplay");
    const playerLogoutBtn = document.getElementById("playerLogoutBtn");
    
    // প্রোফাইল নেম ফিক্স (Loading সরিয়ে সরাসরি A01 বা ইউজারের নাম রিয়েল-টাইমে শো করা)
    if (playerNameDisplay) {
        playerNameDisplay.innerText = currentUser.username; // অ্যাডমিন থেকে সেট করা ইউনিক আইডি বা নাম
    }
    const profileTextEl = document.querySelector(".profile-text") || document.getElementById("profileLoading");
    if (profileTextEl) {
        profileTextEl.innerText = "Profile: " + currentUser.username;
    }

    // লাইভ ডট ব্লিংকিং ইফেক্ট ও ডাইনামিক কাউন্টডাউন টাইমার চালু
    const liveDot = document.querySelector(".dot") || document.querySelector(".live-dot");
    if (liveDot) {
        liveDot.classList.add("live-blink");
    }
    startDrawTimer();

    // ১. লাইভ ডেট ও সেকেন্ডসহ রিয়েল-টাইম ক্লক রান করা
    startLiveClock();

    // ২. রেন্ডার থার্মাল প্রিন্টার সেটিংস প্যানেল (সবসময় দৃশ্যমান থাকবে)
    initializePrinterSetupUI();

    // ৩. সেশন অনুযায়ী প্লেয়ার ডেটা এবং প্রিন্ট পারমিশন রিড করা
    window.db.ref("users/" + currentUser.username).once("value")
        .then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                
                // ব্লক অ্যাকাউন্ট চেক
                if (userData.status === "blocked") {
                    alert(userData.language === "en" ? "Your account is blocked!" : "আপনার অ্যাকাউন্টটি ব্লক করা হয়েছে!");
                    logoutUser();
                    return;
                }

                // প্রিন্টার পারমিশন চেক (অ্যাডমিন লক)
                isPrinterAllowed = userData.printAllowed === true || userData.printAllowed === "true";
                updatePrinterPermissionStatusUI();

                // ভাষা সেটআপ
                const lang = userData.language === "en" ? "en" : "bn";
                applyLanguage(lang);
            }
        });

    // ৪. রিয়েল-টাইম পয়েন্ট লিসেনার (প্লেয়ার স্ক্রিন ডাটা অটো-সিঙ্ক)
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

    // ৫. অ্যাডমিন কর্তৃক লাইভ ব্লক স্ট্যাটাস ট্র্যাকিং
    window.db.ref("users/" + currentUser.username + "/status").on("value", (snap) => {
        if (snap.val() === "blocked") {
            logoutUser();
        }
    });

    // ৬. অ্যাডমিন কর্তৃক রিয়েল-টাইম প্রিন্টার পারমিশন ট্র্যাকিং
    window.db.ref("users/" + currentUser.username + "/printAllowed").on("value", (snap) => {
        if (snap.exists()) {
            isPrinterAllowed = snap.val() === true || snap.val() === "true";
            updatePrinterPermissionStatusUI();
        }
    });

    // বন্ধ হয়ে যাওয়া লগ আউট বাটন রি-কানেক্ট ও সচল করা
    if (playerLogoutBtn) {
        playerLogoutBtn.addEventListener("click", logoutUser);
    }
    const alternativeLogout = document.getElementById("logoutBtn");
    if (alternativeLogout) {
        alternativeLogout.addEventListener("click", logoutUser);
    }

    // সাবমিট বাটন অ্যাকশন ইভেন্ট কানেক্ট করা
    const submitBtn = document.getElementById("submitBetBtn");
    if (submitBtn) {
        submitBtn.addEventListener("click", submitAllBets);
    }

    // গেম টেবিলে বাজির ঘর সিলেক্ট করার ইভেন্ট হ্যান্ডলার সচল করা
    setupTableInteraction();
});

/**
 * লাইভ ডেট ও সেকেন্ডসহ কন্টিনিউয়াস ডিজিটাল ক্লক জেনারেটর
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
        hours = hours ? hours : 12;
        
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
 * ডায়নামিক ড্র টাইমার ফাংশন (টাইম শেষ হলে লক হবে)
 */
function startDrawTimer() {
    const timerDisplay = document.getElementById("drawTimeDisplay");
    
    const interval = setInterval(() => {
        if (drawTimeLeft <= 0) {
            clearInterval(interval);
            if (timerDisplay) timerDisplay.innerText = "Draw Closed! Locking...";
            lockBoard(true); // ড্র টাইম শেষ হলে বোর্ড লক হবে
            
            // সার্ভার ড্র রেসপন্স সিমুলেশন (৫ সেকেন্ড পর পরবর্তী ড্র ও টাইমার রিস্টার্ট)
            setTimeout(() => {
                drawTimeLeft = 90;
                lockBoard(false);
                startDrawTimer();
            }, 5000);
        } else {
            let minutes = Math.floor(drawTimeLeft / 60);
            let seconds = drawTimeLeft % 60;
            if (timerDisplay) {
                timerDisplay.innerText = `Draw Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            }
            drawTimeLeft--;
        }
    }, 1000);
}

/**
 * বোর্ড লক/আনলক করার মেকানিজম
 */
function lockBoard(isLocked) {
    const mainBoard = document.getElementById("gameChartTableBody") || document.getElementById("mainPlayBoard");
    if (mainBoard) {
        if (isLocked) {
            mainBoard.style.pointerEvents = "none";
            mainBoard.style.opacity = "0.4";
        } else {
            mainBoard.style.pointerEvents = "auto";
            mainBoard.style.opacity = "1";
        }
    }
}

/**
 * ইউজার লগআউট সেশন ম্যানেজমেন্ট
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
 * গ্লোবাল ডাইনামিক i18n অনুবাদক ইঞ্জিন
 */
function applyLanguage(lang) {
    currentLanguage = lang;
    
    const dictionary = {
        bn: {
            nav_logo: "ATOZ BOMBAY",
            btn_play_game: "🎮 গেম খেলুন",
            btn_withdraw: "💰 টাকা তুলুন",
            btn_result: "📜 রেজাল্ট চার্ট",
            welcome_title: "স্বাগতম, প্লেয়ার!",
            dashboard_sub: "আপনার লাইভ গেমিং ড্যাশবোর্ড এখানে দেখুন।",
            play_points_label: "প্লে পয়েন্ট (Play Point)",
            win_points_label: "উইনিং পয়েন্ট (Win Point)",
            withdraw_win_balance: "আপনার উইনিং ব্যালেন্স:",
            withdraw_amount_placeholder: "উইথড্র অ্যামাউন্ট লিখুন"
        },
        en: {
            nav_logo: "ATOZ BOMBAY",
            btn_play_game: "🎮 Play Game",
            btn_withdraw: "💰 Withdraw",
            btn_result: "📜 Result Chart",
            welcome_title: "Welcome, Player!",
            dashboard_sub: "View your live gaming dashboard here.",
            play_points_label: "Play Point",
            win_points_label: "Winning Point",
            withdraw_win_balance: "Your Winning Balance:",
            withdraw_amount_placeholder: "Enter withdraw amount"
        }
    };

    const dict = dictionary[lang] || dictionary['bn'];

    document.querySelectorAll('[data-i18n-key]').forEach(elem => {
        const key = elem.getAttribute('data-i18n-key');
        if (dict[key]) {
            if (elem.tagName === 'INPUT') {
                elem.setAttribute('placeholder', dict[key]);
            } else {
                elem.innerText = dict[key];
            }
        }
    });
}

/**
 * থার্মাল প্রিন্টার ইন্টিগ্রেশন কন্ট্রোল প্যানেল
 */
function initializePrinterSetupUI() {
    const container = document.getElementById("printerOptionContainer");
    if (!container) return;

    container.innerHTML = `
        <div class="printer-setup-box" style="display: flex; flex-direction: column; gap: 8px; font-family: sans-serif; color: #fff; font-size: 13px;">
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #334155; padding-bottom: 5px;">
                <span style="font-weight: 600; color: #38bdf8;">⚙️ Thermal Printer Setup</span>
                <span id="printerStatusBadge" style="background: #ef4444; color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">OFFLINE (ADMIN LOCKED)</span>
            </div>
            
            <div style="display: flex; gap: 8px;">
                <button type="button" id="btnConnectUSB" onclick="connectUSBPrinter()" style="flex: 1; padding: 6px; background: #0ea5e9; border: none; border-radius: 4px; color: #fff; cursor: pointer; font-size: 11px; font-weight: bold;">🔌 Connect USB</button>
                <button type="button" id="btnConnectBT" onclick="connectBluetoothPrinter()" style="flex: 1; padding: 6px; background: #a855f7; border: none; border-radius: 4px; color: #fff; cursor: pointer; font-size: 11px; font-weight: bold;">🔵 Connect Bluetooth</button>
            </div>

            <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
                <input type="checkbox" id="printReceiptCheckbox" style="cursor: pointer;" checked>
                <label for="printReceiptCheckbox" style="cursor: pointer; user-select: none;">সাকসেস সাবমিটে রসিদ প্রিন্ট করুন (Auto-Print Slip)</label>
            </div>
        </div>
    `;
}

function updatePrinterPermissionStatusUI() {
    const badge = document.getElementById("printerStatusBadge");
    if (!badge) return;

    if (isPrinterAllowed) {
        badge.innerText = "PRINTER ACTIVE";
        badge.style.background = "#22c55e";
    } else {
        badge.innerText = "OFFLINE (ADMIN LOCKED)";
        badge.style.background = "#ef4444";
    }
}

// ==========================================================================
// 🔌 WEB THERMAL DRIVER ENGINE (USB & BLUETOOTH ESC/POS)
// ==========================================================================

async function connectUSBPrinter() {
    try {
        if (!navigator.usb) {
            alert("আপনার ব্রাউজারে USB প্রিন্টিং সাপোর্ট করে না! অনুগ্রহ করে Google Chrome ব্যবহার করুন।");
            return;
        }
        connectedUSBDevice = await navigator.usb.requestDevice({ filters: [] });
        await connectedUSBDevice.open();
        if (connectedUSBDevice.configuration === null) {
            await connectedUSBDevice.selectConfiguration(1);
        }
        await connectedUSBDevice.claimInterface(0);
        activePrinterType = 'usb';
        alert("🔌 থার্মাল প্রিন্টার USB ক্যাবলের মাধ্যমে সফলভাবে কানেক্ট হয়েছে!");
    } catch (err) {
        console.error("USB Connection Error: ", err);
        alert("ইউএসবি প্রিন্টার কানেক্ট করা যায়নি। ক্যাবল এবং পাওয়ার চেক করুন।");
    }
}

async function connectBluetoothPrinter() {
    try {
        if (!navigator.bluetooth) {
            alert("আপনার ডিভাইসে ব্লুটুথ সাপোর্ট করছে না বা ব্রাউজারে পারমিশন দেওয়া নেই!");
            return;
        }
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb', '00001101-0000-1000-8000-00805f9b34fb']
        });
        const server = await device.gatt.connect();
        const service = await server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
        const characteristics = await service.getCharacteristics();
        connectedBTCharacteristic = characteristics.find(c => c.properties.write || c.properties.writeWithoutResponse);

        if (!connectedBTCharacteristic) {
            throw new Error("কোনো সচল রাইটিং ক্যারেক্টারিস্টিক খুঁজে পাওয়া যায়নি।");
        }
        activePrinterType = 'bluetooth';
        alert("🔵 থার্মাল প্রিন্টার ব্লুটুথের মাধ্যমে পেয়ার ও কানেক্ট হয়েছে!");
    } catch (err) {
        console.error("Bluetooth Connection Error: ", err);
        alert("ব্লুটুথ থার্মাল প্রিন্টারের সাথে কানেক্ট করা সম্ভব হয়নি।");
    }
}

function executeSmartPrint(betData) {
    const now = new Date();
    const formattedDate = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}`;
    const encoder = new TextEncoder();
    let commands = [];

    commands.push(0x1B, 0x40); 
    commands.push(0x1B, 0x61, 0x01); 
    commands.push(0x1B, 0x45, 0x01); 
    commands.push(...encoder.encode("ATOZ BOMBAY\n"));
    commands.push(0x1B, 0x45, 0x00); 
    commands.push(...encoder.encode("PREMIUM CYBER PLAY\n"));
    commands.push(...encoder.encode("--------------------------------\n"));
    
    commands.push(0x1B, 0x61, 0x00); 
    commands.push(...encoder.encode(`ID: ${betData.betId}\n`));
    commands.push(...encoder.encode(`Player: ${betData.player}\n`));
    commands.push(...encoder.encode(`Time: ${formattedDate}\n`));
    commands.push(...encoder.encode("--------------------------------\n"));
    
    commands.push(...encoder.encode("ITEM            | POINTS\n"));
    commands.push(...encoder.encode("--------------------------------\n"));
    
    Object.keys(betData.items).forEach(key => {
        const item = betData.items[key];
        let rowStr = `${item.label}`;
        while (rowStr.length < 16) rowStr += ' ';
        rowStr += `| ${item.amount} Pts\n`;
        commands.push(...encoder.encode(rowStr));
    });
    
    commands.push(...encoder.encode("--------------------------------\n"));
    commands.push(0x1B, 0x61, 0x02);
    commands.push(0x1B, 0x45, 0x01); 
    commands.push(...encoder.encode(`TOTAL: ${betData.totalAmount} Pts\n`));
    commands.push(0x1B, 0x45, 0x00); 
    
    commands.push(0x1B, 0x61, 0x01);
    commands.push(...encoder.encode("\nThank you! Good Luck!\n\n\n\n")); 
    commands.push(0x1D, 0x56, 0x41, 0x03); 

    const dataBuffer = new Uint8Array(commands);

    if (activePrinterType === 'usb' && connectedUSBDevice) {
        connectedUSBDevice.transferOut(3, dataBuffer).catch(err => {
            console.error("USB Write error: ", err);
            printThermalWindowFallback(betData);
        });
    } 
    else if (activePrinterType === 'bluetooth' && connectedBTCharacteristic) {
        const chunkSize = 20;
        let offset = 0;
        function sendBTChunks() {
            if (offset >= dataBuffer.length) return;
            const chunk = dataBuffer.slice(offset, offset + chunkSize);
            connectedBTCharacteristic.writeValue(chunk)
                .then(() => {
                    offset += chunkSize;
                    sendBTChunks();
                })
                .catch(err => {
                    console.error("BT Write Error: ", err);
                    printThermalWindowFallback(betData);
                });
        }
        sendBTChunks();
    } 
    else {
        printThermalWindowFallback(betData);
    }
}

function printThermalWindowFallback(betData) {
    const printWindow = window.open("", "_blank", "width=300,height=600");
    if (!printWindow) return;

    let itemsHtml = "";
    Object.keys(betData.items).forEach(key => {
        const item = betData.items[key];
        itemsHtml += `
            <tr style="border-bottom: 1px dashed #000;">
                <td style="padding: 5px 0; font-size: 12px;">${item.label}</td>
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
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
}

// ==========================================================================
// 🎮 GAME BOARD INTERACTION & MULTI-CLICK ACCUMULATOR ENGINE
// ==========================================================================

/**
 * গেম বোর্ডের পাত্তি বা সিঙ্গেল ঘর সিলেক্ট করার রিয়েল-টাইম মেকানিজম (Accumulator + Glow)
 */
function setupTableInteraction() {
    // টেবিলে থাকা সব সেলের উপর ইভেন্ট লিসেনার বাইন্ড করা
    const cells = document.querySelectorAll(".admin-cell, td.patti-cell");
    
    cells.forEach(cell => {
        cell.addEventListener("click", () => {
            if (drawTimeLeft <= 0) return; // টাইম শেষ হলে ক্লিক নিষ্ক্রিয়

            const cellId = cell.getAttribute("id") || "cell_" + Math.random().toString(36).substr(2, 9);
            if (!cell.getAttribute("id")) cell.setAttribute("id", cellId);

            const pattiValue = cell.getAttribute("data-patti") || cell.querySelector(".both-pat")?.innerText || "000";
            const wordValue = cell.getAttribute("data-word") || cell.querySelector(".both-wrd")?.innerText || "XYZ";
            const colNum = cell.getAttribute("data-column") || cell.querySelector(".cell-title")?.innerText || "0";

            // সিএসএস অ্যাক্টিভ গ্লো ক্লাস যুক্ত করা
            cell.classList.add("active-glow");

            // মাল্টি-ক্লিক প্লাস লজিক (Accumulator): প্রতি ক্লিকে ১০ টাকা করে বাড়বে
            let clickAmount = 10;
            if (activeBets[cellId]) {
                activeBets[cellId] += clickAmount;
            } else {
                activeBets[cellId] = clickAmount;
            }

            // সেলের ব্যাকআপ মেটাডাটা সেভ করা
            cellDetails[cellId] = {
                patti: pattiValue,
                word: wordValue,
                column: colNum
            };

            // সেলের ভেতরেই ভিজ্যুয়াল লাইভ পয়েন্ট ব্যাজ আপডেট করা
            addBetVisualIndicator(cell, activeBets[cellId]);

            // ডানদিকের প্যানেলে ডায়নামিক গ্রাফিক্যাল র (Row) এবং গ্র্যান্ড টোটাল রি-রেন্ডার করা
            updateSelectedItemsUI();
        });
    });
}

/**
 * সেলের ভেতর লাইভ স্কোর বা ব্যাজ ডিসপ্লে করানো
 */
function addBetVisualIndicator(cell, amount) {
    let existing = cell.querySelector(".live-load") || cell.querySelector(".bet-badge");
    if (existing) {
        existing.innerText = amount + " Pts";
    } else {
        const badge = document.createElement("span");
        badge.className = "live-load";
        badge.innerText = amount + " Pts";
        cell.appendChild(badge);
    }
}

/**
 * SELECTED ITEMS বক্সে সুন্দর মডার্ন ইংরেজি ও বাংলা র (Row) তৈরি ও টোটাল ডিসপ্লে
 */
function updateSelectedItemsUI() {
    const container = document.getElementById("selectedItemsContainer");
    if (!container) return;
    
    container.innerHTML = ""; // কন্টেইনার খালি করা
    let grandTotal = 0;

    Object.keys(activeBets).forEach(id => {
        const amt = activeBets[id];
        grandTotal += amt;

        const details = cellDetails[id];
        let displayPrefix = "";

        // ভিউ মোড ও বেট টাইপ মেপে ইংরেজি সংক্ষেপ তৈরি (P = Patti, W = Word, S = Single)
        if (currentBetType === 'Single') {
            displayPrefix = `S: ${details.column}`;
        } else {
            if (currentViewMode === 'Both') {
                displayPrefix = `P: ${details.patti} | W: ${details.word}`;
            } else if (currentViewMode === 'Word') {
                displayPrefix = `W: ${details.word}`;
            } else if (currentViewMode === 'Digit') {
                displayPrefix = `P: ${details.patti}`;
            }
        }

        // কাস্টম সিএসএস থিমে ডায়নামিক র (Row) বক্স ইনপুট করা
        const row = document.createElement("div");
        row.className = "selected-item-row";
        row.innerHTML = `
            <span>[ ${displayPrefix} ]</span>
            <strong>৳${amt}</strong>
        `;
        container.appendChild(row);
    });

    // নিচে লাইভ গ্র্যান্ড টোটাল বসানো
    const totalDisplay = document.getElementById("grandTotalDisplay");
    if (totalDisplay) {
        totalDisplay.innerText = `Total Points: ৳${grandTotal}`;
    }
}

/**
 * সাবমিট বাটন অ্যাকশন, রসিদ প্রিন্ট গেটওয়ে ও অটো-ক্লিনআপ মেকানিজম
 */
function submitAllBets() {
    const container = document.getElementById("selectedItemsContainer");
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    
    if (Object.keys(activeBets).length === 0) {
        alert(currentLanguage === 'en' ? "Please select a bet first!" : "অনুগ্রহ করে আগে বাজি সিলেক্ট করুন!");
        return;
    }

    let grandTotal = 0;
    let itemsForReceipt = {};
    
    Object.keys(activeBets).forEach(id => {
        grandTotal += activeBets[id];
        const det = cellDetails[id];
        itemsForReceipt[id] = {
            label: currentBetType === 'Single' ? `Single ${det.column}` : `${det.patti}-${det.word}`,
            amount: activeBets[id]
        };
    });

    const betSubmissionData = {
        betId: "BOM-" + Math.floor(100000 + Math.random() * 900000),
        player: currentUser ? currentUser.username : "Unknown",
        items: itemsForReceipt,
        totalAmount: grandTotal
    };

    // ফায়ারবেস ডেটাবেসে বাজি পুশ করা (লাইভ ফায়ারবেস ইন্টিগ্রেশন)
    if (window.db && currentUser) {
        window.db.ref("bets/" + betSubmissionData.betId).set({
            player: betSubmissionData.player,
            totalAmount: betSubmissionData.totalAmount,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            status: "pending"
        });
    }

    // ১. স্ক্রিনে "✔ Bet Submitted Successfully!" পপ-আপ মেসেজ দেখানো
    if (container) {
        container.innerHTML = `<div class="bet-success-msg">✔ Bet Submitted Successfully!</div>`;
    }

    // ২. অটো-প্রিন্ট চেকড থাকলে থার্মাল ড্রাইভার সচল করা
    const autoPrintCheckbox = document.getElementById("printReceiptCheckbox");
    if (autoPrintCheckbox && autoPrintCheckbox.checked) {
        executeSmartPrint(betSubmissionData);
    }

    // ৩. ৩ সেকেন্ড পর পুরো বোর্ড, সিলেক্টেড আইটেম ও গ্লো মার্ক অটোমেটিক ভ্যানিশ (Reset) করা
    setTimeout(() => {
        // মেমোরি খালি করা
        activeBets = {};
        cellDetails = {};

        // সিএসএস গ্লো এবং ব্যাজ রিমুভ করা
        document.querySelectorAll(".admin-cell, td.patti-cell").forEach(cell => {
            cell.classList.remove("active-glow");
            let badge = cell.querySelector(".live-load") || cell.querySelector(".bet-badge");
            if (badge) badge.remove();
        });

        // কন্টেইনার ফ্লাশ
        if (container) container.innerHTML = "";
        
        const totalDisplay = document.getElementById("grandTotalDisplay");
        if (totalDisplay) totalDisplay.innerText = "Total Points: ৳0";
    }, 3000);
}
