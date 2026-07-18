// ==========================================================================
// ATOZ BOMBAY - MASTER LOGIC RECALL #2200 (FIXED UI & INTERACTION)
// ==========================================================================

// গ্লোবাল স্টেট ও কন্ট্রোল ভেরিয়েবল
let currentBetType = "Single";  // ডিফল্ট বেট টাইপ
let selectedCoinValue = 2;       // ডিফল্ট কয়েন ভ্যালু (সর্বনিম্ন ২ টাকা)
let activeBets = {};            // লাইভ বেটিং ডেটা স্টোর
let isAdminPrinterEnabled = false; // এডমিন প্রিন্টার গেটওয়ে (Default Off)

document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // ১. রাউটিং ও লগআউট ৪MD এরর প্রোটেকশন
    // ==========================================
    initAuthRouter();

    // ==========================================
    // ২. রেঞ্জ এবং বেট টাইপ বাটন সিলেক্টর
    // ==========================================
    const rangeButtons = document.querySelectorAll('.number-range-box button, [id*="Range"] button');
    const typeButtons = document.querySelectorAll('.bet-type-box button, [id*="Type"] button');

    rangeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            rangeButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            console.log("Range Changed:", e.target.innerText);
            // এখানে ২০০ রেঞ্জ ফিল্টারিং কোড ট্রিগার হবে
        });
    });

    typeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            typeButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentBetType = e.target.innerText;
            console.log("Bet Type Changed:", currentBetType);
            // মোড অনুযায়ী গ্রিড ফুল স্ক্রিন করার লজিক এখানে যুক্ত হবে
        });
    });

    // ==========================================
    // ৩. নতুন কয়েন বাটন সিলেকশন লজিক (২, ৫, ১০, ২০, ৫০, ১০০, ৫০০)
    // ==========================================
    initCoinSelectors();

    // ==========================================
    // ৪. গেম বোর্ড সেল ক্লিক ইভেন্ট (কঠোর লিমিট ও ফেইড অ্যানিমেশন)
    // ==========================================
    document.querySelectorAll('td.patti-cell, .admin-cell').forEach(cell => {
        cell.addEventListener('click', () => {
            const cellId = cell.id || 'cell_' + Math.random().toString(36).substr(2, 9);
            cell.id = cellId;

            // বর্তমান বেট অ্যামাউন্ট চেক
            if (!activeBets[cellId]) activeBets[cellId] = 0;

            // কঠোর নিয়ম: সর্বনিম্ন ২ টাকা, সর্বোচ্চ ৫ টাকার লিমিট লক (#2200 LOCK)
            let nextBetValue = activeBets[cellId] + selectedCoinValue;
            
            if (nextBetValue < 2) {
                console.log("সর্বনিম্ন বেট ২ টাকা হতে হবে।");
                return; 
            }
            if (nextBetValue > 5) {
                console.log("পাত্তি প্রতি সর্বোচ্চ লিমিট ৫ টাকা লকড!");
                return; // ৫ টাকার বেশি হলে কোড এখানেই আটকে যাবে
            }

            // লিমিট পাস হলে বেট আপডেট
            activeBets[cellId] = nextBetValue;

            // ভিজ্যুয়াল আপডেট: পাত্তি লেখা হালকা (Fade) হবে এবং উপরে কয়েন বসবে
            addBetVisualIndicator(cell, activeBets[cellId]);
            updateSelectedItemsUI();
        });
    });
});

// ==========================================================================
// ৫. রেগুলার ফাংশন ফ্রেমওয়ার্ক (আর্কিটেকচারাল নকশা)
// ==========================================================================

// লগইন/লগআউট হ্যান্ডলার
function initAuthRouter() {
    const logoutBtn = document.getElementById('btnLogout') || document.querySelector('.logout-item, #logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            let repoName = window.location.pathname.split('/')[1];
            if (window.location.hostname.includes('github.io')) {
                window.location.href = window.location.origin + '/' + repoName + '/login.html';
            } else {
                window.location.href = './login.html';
            }
        });
    }
}

// কয়েন বাটন হ্যান্ডলার
function initCoinSelectors() {
    const coinButtons = document.querySelectorAll('.coin-btn');
    coinButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            coinButtons.forEach(b => b.classList.remove('selected-coin'));
            e.target.classList.add('selected-coin');
            selectedCoinValue = parseInt(e.target.getAttribute('data-coin-val')) || 2;
            console.log("Selected Coin:", selectedCoinValue);
        });
    });
}

// সেল অ্যানিমেশন ও ফেইড ইন্ডিকেটর
function addBetVisualIndicator(cell, totalBet) {
    // অরিজিনাল টেক্সট হালকা করা (Fade Effect)
    cell.style.color = "rgba(255, 255, 255, 0.2)";
    cell.style.position = "relative";
    
    // পুরনো টোকেন থাকলে রিমুভ করা
    const oldToken = cell.querySelector('.bet-anim-token');
    if (oldToken) oldToken.remove();

    // নতুন অ্যানিমেটেড টোকেন বসানো
    const token = document.createElement('div');
    token.className = 'bet-anim-token';
    token.style.cssText = `
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        background: radial-gradient(#00ffcc, #0055ff);
        color: #fff; font-weight: bold; font-size: 12px;
        width: 22px; height: 22px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        animation: tokenPop 0.3s ease-out;
        box-shadow: 0 0 6px #00ffcc;
    `;
    token.innerText = totalBet;
    cell.appendChild(token);
}

// সিলেক্ট আইটেম ড্র ম্যাট্রিক্স লাইভ সামারি প্যানেল
function updateSelectedItemsUI() {
    const container = document.getElementById("selectedItemsContainer");
    if (!container) return;
    
    container.innerHTML = "";
    let totalHouses = 0;
    let totalAmount = 0;

    Object.keys(activeBets).forEach(id => {
        if (activeBets[id] > 0) {
            totalHouses++;
            totalAmount += activeBets[id];
            
            const row = document.createElement("div");
            row.style.cssText = "margin: 4px 0; border-bottom: 1px dashed #334; color: #00ffcc; font-family: monospace;";
            row.innerHTML = `<span>[${currentBetType}] ID: ${id}</span> -> <b style="color:#ffcc00">৳${activeBets[id]}</b>`;
            container.appendChild(row);
        }
    });

    // সামারি ফুটার ও সাবমিট বাটন জেনারেশন
    const summaryFooter = document.createElement("div");
    summaryFooter.style.cssText = "margin-top: 10px; padding-top: 5px; border-top: 1px solid #00ffcc;";
    summaryFooter.innerHTML = `
        <div>টোটাল ঘর: ${totalHouses}</div>
        <div style="font-size: 14px; color: #ffcc00; font-weight: bold;">সর্বমোট পয়েন্ট: ৳${totalAmount}</div>
        <button id="btnSubmitBetMatrix" class="submit-btn" style="width:100%; margin-top:8px; background:#00ffcc; color:#000; font-weight:bold; border:none; padding:6px; cursor:pointer;">SUBMIT</button>
    `;
    container.appendChild(summaryFooter);
    
    // সাবমিট ক্লিক ইভেন্ট বাইন্ডিং
    const submitBtn = document.getElementById("btnSubmitBetMatrix");
    if(submitBtn) {
        submitBtn.addEventListener('click', () => handleFinalBetSubmit(totalAmount));
    }
}

// ফাইনাল সাবমিট ও প্রিন্টার হ্যান্ডলার
function handleFinalBetSubmit(totalAmount) {
    console.log("Bet Submitted. Total:", totalAmount);
    
    // এডমিন কন্ট্রোলড ব্লুটুথ/ইউএসবি প্রিন্ট লজিক
    if (isAdminPrinterEnabled) {
        executePrinterHardwareCommand();
    } else {
        console.log("Normal mode active: Printer is turned OFF by Admin.");
    }
}

// প্রিন্টার হার্ডওয়্যার ফাংশন
function executePrinterHardwareCommand() {
    console.log("Bluetooth/USB Printer command sent to hardware...");
    // এখানে থার্মাল প্রিন্টারের কোর প্লাগইন রান হবে
}

// উইন্ডো ও ট্রান্সপোর্ট ওপেনিং ফাংশন ফ্রেম (পরবর্তী ধাপে কোড বসবে)
function openWithdrawWindow() { /* Structure Locked */ }
function openTransportWindow() { /* Structure Locked */ }
function updateAccountBalanceUI() { /* Structure Locked */ }
