// ==========================================================================
// ATOZ BOMBAY - PLAYER ZONE CORE LOGIC (v5.6 - HYBRID SIDEBAR & THERMAL PRINT)
// ==========================================================================

// গেমপ্লে স্টেট ট্র্যাকিং এবং প্রিন্টার সেটিংস ভেরিয়েবল
let activeBets = {}; // { 'cell_id': { patti, word, column, amount, type } }
let currentGameMode = 'both'; 
let selectedTimeSlot = null;  
let isPrinterAllowed = false; // অ্যাডমিন পারমিশন ফ্ল্যাগ (ফায়ারবেস থেকে লাইভ আসবে)
let currentLanguage = 'bn'; // ডিফল্ট ভাষা

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
    const gameChartTableBody = document.getElementById("gameChartTableBody");

    if (playerNameDisplay) {
        playerNameDisplay.innerText = currentUser.username;
    }

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

    if (playerLogoutBtn) {
        playerLogoutBtn.addEventListener("click", logoutUser);
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
 * গ্লোবাল ডাইনামিক i18n অনুবাদক ইঞ্জিন (রিফ্রেশ ছাড়াই রিয়েল-টাইমে টেক্সট পরিবর্তন)
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

    // ১. data-i18n-key মেকানিজমে থাকা সব এলিমেন্টকে লুপ করে রিয়েল-টাইম অনুবাদ করা
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
 * থার্মাল প্রিন্টার ইন্টিগ্রেশন কন্ট্রোল প্যানেল (সবসময় স্ক্রিনে থাকবে)
 */
function initializePrinterSetupUI() {
    const container = document.getElementById("printerOptionContainer");
    if (!container) return;

    // নিয়ন গেমিং ইন্টারফেসের সাথে সামঞ্জস্য রেখে সাব-কন্ট্রোল তৈরি
    container.innerHTML = `
        <div class="printer-setup-box" style="display: flex; flex-direction: column; gap: 8px; font-family: sans-serif; color: #fff; font-size: 13px;">
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #334155; padding-bottom: 5px;">
                <span style="font-weight: 600; color: #38bdf8;">⚙️ Thermal Printer Setup</span>
                <span id="printerStatusBadge" style="background: #ef4444; color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">OFFLINE (ADMIN LOCKED)</span>
            </div>
            
            <!-- Connection Buttons (Always Visible) -->
            <div style="display: flex; gap: 8px;">
                <button type="button" id="btnConnectUSB" onclick="connectUSBPrinter()" style="flex: 1; padding: 6px; background: #0ea5e9; border: none; border-radius: 4px; color: #fff; cursor: pointer; font-size: 11px; font-weight: bold;">🔌 Connect USB</button>
                <button type="button" id="btnConnectBT" onclick="connectBluetoothPrinter()" style="flex: 1; padding: 6px; background: #a855f7; border: none; border-radius: 4px; color: #fff; cursor: pointer; font-size: 11px; font-weight: bold;">🔵 Connect Bluetooth</button>
            </div>

            <!-- Auto-Print Trigger Checkbox -->
            <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
                <input type="checkbox" id="printReceiptCheckbox" style="cursor: pointer;" checked>
                <label for="printReceiptCheckbox" style="cursor: pointer; user-select: none;">সাকসেস সাবমিটে রসিদ প্রিন্ট করুন (Auto-Print Slip)</label>
            </div>
        </div>
    `;
}

/**
 * অ্যাডমিন লক পরিবর্তনের ভিত্তিতে ইউজার ইন্টারফেসে লাইভ ফিডব্যাক
 */
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

/**
 * ১. ইউএসবি থার্মাল প্রিন্টার কানেকশন ইঞ্জিন (WebUSB API)
 */
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

/**
 * ২. ব্লুটুথ থার্মাল প্রিন্টার কানেকশন ইঞ্জিন (Web Bluetooth API)
 */
async function connectBluetoothPrinter() {
    try {
        if (!navigator.bluetooth) {
            alert("আপনার ডিভাইসে ব্লুটুথ সাপোর্ট করছে না বা ব্রাউজারে পারমিশন দেওয়া নেই!");
            return;
        }

        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb', '00001101-0000-1000-8000-00805f9b34fb'] // স্ট্যান্ডার্ড প্রিন্টার GATT UUIDs
        });

        const server = await device.gatt.connect();
        
        // প্রিন্ট সার্ভার সার্ভিস এবং ক্যারেক্টারিস্টিক খুঁজে নেওয়া
        const service = await server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
        const characteristics = await service.getCharacteristics();
        
        // প্রথম রাইটিং ক্যারেক্টারিস্টিক বাছাই করা
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

/**
 * ৩. স্মার্ট প্রিন্টার গেটওয়ে রানটাইম (USB/BT বাইনারি এবং উইন্ডো ফলব্যাক)
 */
function executeSmartPrint(betData) {
    // স্লিপ জেনারেট করার ডাটা স্ট্রাকচার
    const now = new Date();
    const formattedDate = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}`;
    
    // ESC/POS কমান্ড জেনারেট করা (বাইট কোড)
    const encoder = new TextEncoder();
    let commands = [];

    // প্রিন্টার ইনিশিয়ালাইজেশন
    commands.push(0x1B, 0x40); 
    // সেন্টার অ্যালাইনমেন্ট
    commands.push(0x1B, 0x61, 0x01); 
    
    // টাইটেল (বোল্ড ও লার্জ ফন্ট)
    commands.push(0x1B, 0x45, 0x01); // Bold ON
    commands.push(...encoder.encode("ATOZ BOMBAY\n"));
    commands.push(0x1B, 0x45, 0x00); // Bold OFF
    commands.push(...encoder.encode("PREMIUM CYBER PLAY\n"));
    commands.push(...encoder.encode("--------------------------------\n"));
    
    // লেফট অ্যালাইনমেন্ট
    commands.push(0x1B, 0x61, 0x00); 
    commands.push(...encoder.encode(`ID: ${betData.betId}\n`));
    commands.push(...encoder.encode(`Player: ${betData.player}\n`));
    commands.push(...encoder.encode(`Time: ${formattedDate}\n`));
    commands.push(...encoder.encode("--------------------------------\n"));
    
    // আইটেম টেবিল হেডার
    commands.push(...encoder.encode("ITEM            | POINTS\n"));
    commands.push(...encoder.encode("--------------------------------\n"));
    
    // বাজির ঘর ও পয়েন্ট ডাটা ম্যাপিং
    Object.keys(betData.items).forEach(key => {
        const item = betData.items[key];
        let rowStr = `${item.patti} (${item.single})`;
        // লেআউট সোজা রাখার জন্য প্যাডিং স্পেস অ্যাডজাস্টমেন্ট
        while (rowStr.length < 16) rowStr += ' ';
        rowStr += `| ${item.amount} Pts\n`;
        commands.push(...encoder.encode(rowStr));
    });
    
    commands.push(...encoder.encode("--------------------------------\n"));
    
    // রাইট অ্যালাইনমেন্ট (টোটাল পয়েন্ট)
    commands.push(0x1B, 0x61, 0x02);
    commands.push(0x1B, 0x45, 0x01); // Bold ON
    commands.push(...encoder.encode(`TOTAL: ${betData.totalAmount} Pts\n`));
    commands.push(0x1B, 0x45, 0x00); // Bold OFF
    
    // সেন্টার অ্যালাইনমেন্ট ও ফুটার
    commands.push(0x1B, 0x61, 0x01);
    commands.push(...encoder.encode("\nThank you! Good Luck!\n\n\n\n")); // পেপার স্পেসিং
    commands.push(0x1D, 0x56, 0x41, 0x03); // অটো পেপার কাট কমান্ড (ESC/POS)

    const dataBuffer = new Uint8Array(commands);

    // ১. ইউএসবি ক্যাবল প্রিন্ট লজিক
    if (activePrinterType === 'usb' && connectedUSBDevice) {
        connectedUSBDevice.transferOut(3, dataBuffer).catch(err => {
            console.error("USB Write error: ", err);
            printThermalWindowFallback(betData); // কোনো কারণে ক্র্যাশ করলে উইন্ডো ব্যাকআপে চলে যাবে
        });
    } 
    // ২. ব্লুটুথ প্রিন্ট লজিক
    else if (activePrinterType === 'bluetooth' && connectedBTCharacteristic) {
        // ব্লুটুথ প্যাকেট সাইজ লিমিটেশন (২০ বাইট চাঙ্ক আকারে সেন্ড করা হচ্ছে)
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
    // ৩. ফলব্যাক উইন্ডো প্রিন্ট মেকানিজম (যদি সরাসরি কানেক্টেড ড্রাইভার সচল না থাকে)
    else {
        printThermalWindowFallback(betData);
    }
}

/**
 * ফলব্যাক সিস্টেম: ব্রাউজার পপআপ উইন্ডো প্রিন্টিং সিস্টেম (মোবাইল ও পিসির জন্য নিরাপদ ব্যাকআপ)
 */
function printThermalWindowFallback(betData) {
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
    
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
}

// ==========================================================================
// 🎮 GAME BOARD INTERACTION & BET TRANSACTION SUBMISSION
// ==========================================================================

/**
 * গেম বোর্ডের পাত্তি বা সিঙ্গেল ঘর সিলেক্ট করার রিয়েল-টাইম মেকানিজম
 */
function setupTableInteraction() {
    // টেবিলে কোনো সেলের ক্লাস নেম চেক করে ইভেন্ট বাইন্ডিং
    const cells = document.querySelectorAll(".game-table-wrapper td.patti-cell");
    
    cells.forEach(cell => {
        cell.addEventListener("click", () => {
            const cellId = cell.getAttribute("id");
            const pattiValue = cell.getAttribute("data-patti");
            const singleValue = cell.getAttribute("data-single");
            const columnVal = cell.getAttribute("data-column");

            if (cell.classList.contains("selected")) {
                cell.classList.remove("selected");
                delete activeBets[cellId];
                removeBetOverlay(cell);
            } else {
                cell.classList.add("selected");
                activeBets[cellId] = {
                    id: cellId,
                    patti: pattiValue,
                    single: singleValue,
                    column: columnVal,
                    amount: 0 
                };
                createBetOverlay(cell);
            }
            updateActiveBetsPanel();
        });
    });
}

/**
 * সেলের ভেতর সুন্দর নিয়ন গোল্ড প্লে পয়েন্ট ব্যাজ রেন্ডার করা
 */
function createBetOverlay(cell) {
    removeBetOverlay(cell);

    const overlayDiv = document.createElement("div");
    overlayDiv.className = "active-bet-overlay";
    
    const targetValSpan = document.createElement("span");
    targetValSpan.className = "bet-target-val";
    targetValSpan.innerText = cell.getAttribute("data-patti") || cell.getAttribute("data-single");
    
    const ptsBadge = document.createElement("span");
    ptsBadge.className = "bet-pts-badge";
    ptsBadge.innerText = "0 Pts";

    overlayDiv.appendChild(targetValSpan);
    overlayDiv.appendChild(ptsBadge);
    cell.appendChild(overlayDiv);
}

/**
 * আনসিলেক্ট করার সাথে সাথে গোল্ড ব্যাজ কন্টেইনার মুছে ফেলা
 */
function removeBetOverlay(cell) {
    const overlay = cell.querySelector(".active-bet-overlay");
    if (overlay) {
        overlay.remove();
    }
}

/**
 * সাইডবার বা প্লেয়ার জোন বেটিং ডাটা লিস্ট ইনপুট বক্স জেনারেটর
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

    // ইনপুট ভ্যালু পরিবর্তনের সাথে সাথে রিয়েল-টাইম অবজেক্ট ডাটা সিঙ্ক
    const inputs = activeBetsList.querySelectorAll(".bet-amount-input");
    inputs.forEach(input => {
        input.addEventListener("input", (e) => {
            const cellId = e.target.getAttribute("data-id");
            const val = parseInt(e.target.value) || 0;
            
            if (activeBets[cellId]) {
                activeBets[cellId].amount = val;
                
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
 * ফায়ারবেস রিয়েলটাইম ডাটাবেজে বাজি সাবমিট করার কোর ট্রানজেকশন ফাংশন
 */
function submitBets() {
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if (!currentUser) return;

    const keys = Object.keys(activeBets);
    if (keys.length === 0) {
        alert(currentLanguage === 'en' ? "Please select at least one cell!" : "অনুগ্রহ করে কমপক্ষে একটি ঘর নির্বাচন করুন!");
        return;
    }

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
        alert(currentLanguage === 'en' ? "Please enter a valid points amount for all selected cells!" : "নির্বাচিত সমস্ত ঘরে পয়েন্টের সঠিক পরিমাণ লিখুন!");
        return;
    }

    const userRef = window.db.ref("users/" + currentUser.username);
    userRef.once("value").then((snapshot) => {
        if (!snapshot.exists()) return;

        const userData = snapshot.val();
        const currentPlayPoints = userData.playPoints || 0;

        if (currentPlayPoints < totalBetPoints) {
            alert(currentLanguage === 'en' ? "Insufficient Play Points!" : "আপনার প্লে পয়েন্ট পর্যাপ্ত নয়!");
            return;
        }

        const newPlayPoints = currentPlayPoints - totalBetPoints;
        const betId = "BET_" + Date.now();
        const betData = {
            betId: betId,
            player: currentUser.username,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            totalAmount: totalBetPoints,
            items: activeBets,
            status: "pending"
        };

        const updates = {};
        updates["/users/" + currentUser.username + "/playPoints"] = newPlayPoints;
        updates["/bets/" + betId] = betData;

        window.db.ref().update(updates)
            .then(() => {
                alert(currentLanguage === 'en' ? "Bet placed successfully!" : "বাজি সফলভাবে সাবমিট হয়েছে!");
                
                // প্রিন্টার পারমিশন এবং অটো-প্রিন্ট চেক অন থাকলে প্রিন্টিং মেকানিজম ট্রিগার হবে
                const printReceiptCheckbox = document.getElementById("printReceiptCheckbox");
                if (isPrinterAllowed && printReceiptCheckbox && printReceiptCheckbox.checked) {
                    executeSmartPrint(betData);
                }

                // বাজি জমা হওয়ার পর গেম স্টেট রিসেট করা
                clearAllBets();
            })
            .catch((error) => {
                console.error("Bet placement failed: ", error);
                alert(currentLanguage === 'en' ? "Failed to place bet. Try again." : "বাজি সাবমিট করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
            });
    });
}

/**
 * সিলেক্টেড সমস্ত বাজি ও বোর্ডের ব্যাজগুলো এক ক্লিকে পরিষ্কার করা
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
