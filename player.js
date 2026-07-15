// ==========================================================================
// PLAYER SYSTEM - FIREBASE & DASHBOARD INTEGRATION (v5.2)
// ==========================================================================

// গেমপ্লে স্টেট ট্র্যাকিং
let currentUser = null;
let selectedTimeSlot = null; // প্লেয়ারের সিলেক্ট করা টাইম স্লট

// ১. পেজ লোড হলে এবং প্লেয়ার লগইন থাকলে ফায়ারবেস থেকে ডাটা আনা
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        loadPlayerDashboardData(user.uid);
    } else {
        // লগইন না থাকলে ইনডেক্স পেজে পাঠিয়ে দেওয়া
        window.location.href = "index.html";
    }
});

/**
 * ২. প্লেয়ারের ড্যাশবোর্ড ডাটা (Play Point & Win Point) ফায়ারবেস থেকে রিয়েলটাইম লোড করা
 */
function loadPlayerDashboardData(uid) {
    const userRef = db.ref(`users/${uid}`);
    userRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            // আপনার স্ক্রিনের আইডি অনুযায়ী পয়েন্ট আপডেট
            document.getElementById('playPointsDisplay').innerText = data.playPoints || 0;
            document.getElementById('winPointsDisplay').innerText = data.winPoints || 0;
        }
    });

    // আজকের গেমের রেজাল্ট ও হিস্ট্রি লোড করা
    loadTodayResults();
    loadTodayPlayerHistory(uid);
}

/**
 * ৩. "গেম খেলুন (Play Game)" বাটনে ক্লিক করলে যা ঘটবে (খাতার নকশা অনুযায়ী)
 */
function openPlayGameDashboard() {
    const modal = document.getElementById('playGameModal'); // আপনার পপআপ কন্টেইনার
    if (!modal) return;

    // পপআপটি স্ক্রিনে শো করা
    modal.style.display = 'block';

    // ১. প্রথমে টাইম স্লট বা টাইম বক্স জেনারেট করা
    generateTimeSlots();

    // ২. গেম টেবিল (২২×১০) জেনারেট করা (যা game_engine.js এ তৈরি করেছি)
    if (typeof generateGameTable === 'function') {
        generateGameTable();
    }
}

/**
 * ৪. খাতার বামদিকের "Time Box" (1st, 2nd, 3rd) জেনারেট করার ফাংশন
 */
function generateTimeSlots() {
    const timeBoxContainer = document.getElementById('timeBoxContainer');
    if (!timeBoxContainer) return;

    // আপনার ফায়ারবেস বা লোকাল থেকে টাইম স্লটের লিস্ট
    const slots = [
        { id: 'slot1', name: '1st Baji (10:00 AM)' },
        { id: 'slot2', name: '2nd Baji (01:00 PM)' },
        { id: 'slot3', name: '3rd Baji (04:00 PM)' }
    ];

    let html = '<h4>Select Time Slot</h4><div class="time-slot-list">';
    slots.forEach(slot => {
        html += `
            <button type="button" class="slot-btn" id="btn-${slot.id}" onclick="selectTimeSlot('${slot.id}', '${slot.name}')">
                ${slot.name}
            </button>
        `;
    });
    html += '</div>';
    timeBoxContainer.innerHTML = html;
}

/**
 * ৫. প্লেয়ার কর্তৃক নির্দিষ্ট টাইম স্লট সিলেক্ট করা
 */
function selectTimeSlot(slotId, slotName) {
    // আগের সিলেক্টেড স্টাইল রিমুভ করা
    document.querySelectorAll('.slot-btn').forEach(btn => btn.classList.remove('active'));
    
    // নতুন স্লট অ্যাক্টিভ করা
    document.getElementById(`btn-${slotId}`).classList.add('active');
    selectedTimeSlot = slotId;

    console.log(`Selected Time Slot: ${slotName}`);
}

/**
 * ৬. বাজি সাবমিট করার ফাংশن (BET / Submit)
 */
function submitPlayerBet() {
    const betAmountInput = document.getElementById('betAmountInput');
    const betAmount = parseInt(betAmountInput ? betAmountInput.value : 0);

    // সিকিউরিটি ও ভ্যালিডেশন চেক
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

    // প্লেয়ারের ব্যালেন্স চেক করা
    const currentPlayPoints = parseInt(document.getElementById('playPointsDisplay').innerText);
    if (betAmount > currentPlayPoints) {
        alert("আপনার কাছে পর্যাপ্ত Play Point নেই!");
        return;
    }

    // বাজি ডেটাবেজে সেভ করার অবজেক্ট তৈরি
    const betData = {
        patti: selectedPatti,
        word: selectedWord,
        column: selectedColumn,
        amount: betAmount,
        timeSlot: selectedTimeSlot,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        status: 'pending'
    };

    // ফায়ারবেসে বাজি সাবমিট এবং ব্যালেন্স কেটে নেওয়া
    const newBetKey = db.ref().child(`bets/${currentUser.uid}`).push().key;
    const updates = {};
    updates[`bets/${currentUser.uid}/${newBetKey}`] = betData;
    updates[`users/${currentUser.uid}/playPoints`] = currentPlayPoints - betAmount;

    db.ref().update(updates)
        .then(() => {
            alert("আপনার বাজি সফলভাবে সাবমিট হয়েছে!");
            if (betAmountInput) betAmountInput.value = ''; // ইনপুট খালি করা
        })
        .catch((error) => {
            console.error("Bet Submission Error: ", error);
            alert("বাজি সাবমিট করতে সমস্যা হয়েছে, আবার চেষ্টা করুন।");
        });
}

/**
 * ৭. আজকের হিস্ট্রি লিস্ট লোড করা (Today History List)
 */
function loadTodayPlayerHistory(uid) {
    const historyContainer = document.getElementById('todayHistoryList');
    if (!historyContainer) return;

    db.ref(`bets/${uid}`).limitToLast(10).on('value', (snapshot) => {
        let html = '<ul>';
        snapshot.forEach((childSnapshot) => {
            const bet = childSnapshot.val();
            html += `
                <li>
                    Slot: ${bet.timeSlot.toUpperCase()} | 
                    Patti: ${bet.patti} (${bet.word}) | 
                    Amt: ${bet.amount} | 
                    Status: <span class="status-${bet.status}">${bet.status}</span>
                </li>
            `;
        });
        html += '</ul>';
        historyContainer.innerHTML = html;
    });
}
