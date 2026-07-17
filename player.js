// ==========================================================================
// ATOZ BOMBAY - MASTER LOGIC RECALL #2200 (FIXED UI & INTERACTION)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    // ১. রেঞ্জ এবং বেট টাইপ বাটন সিলেক্টর (আপনার স্ক্রিনশটের সাথে ম্যাচিং)
    const rangeButtons = document.querySelectorAll('.number-range-box button, [id*="Range"] button');
    const typeButtons = document.querySelectorAll('.bet-type-box button, [id*="Type"] button');

    // ২. বাটন ক্লিক হ্যান্ডলার (রিয়েল-টাইম আপডেট)
    rangeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            rangeButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            console.log("Range Changed:", e.target.innerText);
            // আপনার ফিল্টারিং ফাংশন এখানে কল হবে
        });
    });

    typeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            typeButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentBetType = e.target.innerText; // গ্লোবাল ভেরিয়েবল আপডেট
            console.log("Bet Type Changed:", currentBetType);
        });
    });

    // ৩. গেম বোর্ড সেল ক্লিক ইভেন্ট (সরাসরি প্যানেলের সাথে সিঙ্ক)
    document.querySelectorAll('td.patti-cell, .admin-cell').forEach(cell => {
        cell.addEventListener('click', () => {
            const cellId = cell.id || Math.random().toString(36).substr(2, 9);
            cell.id = cellId;

            // ১০ টাকা করে অটো-প্লাস লজিক
            if (!activeBets[cellId]) activeBets[cellId] = 0;
            activeBets[cellId] += 10;

            // গ্লো ইফেক্ট
            cell.classList.add('active-glow');
            
            // ভিজ্যুয়াল আপডেট
            addBetVisualIndicator(cell, activeBets[cellId]);
            updateSelectedItemsUI();
        });
    });
});

// সিলেকশন প্যানেল আপডেট ফাংশন
function updateSelectedItemsUI() {
    const container = document.getElementById("selectedItemsContainer");
    if (!container) return;
    
    container.innerHTML = "";
    Object.keys(activeBets).forEach(id => {
        const row = document.createElement("div");
        row.style.margin = "5px 0";
        row.style.borderBottom = "1px solid #334";
        row.innerHTML = `<span>[${currentBetType}]</span> <b style="color:#fbbf24">৳${activeBets[id]}</b>`;
        container.appendChild(row);
    });
}
