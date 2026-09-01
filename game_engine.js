/* ==========================================================================
   🔑 PROJECT: A-TO-Z BOMBAY PLAY ZONE (A-TO-Z-PATTI)
   📁 FILE: game_engine.js
   📌 VERSION: v7.4.0 [LOG #2200 SYSTEM ALIGNED]
   ========================================================================== */

const EngineConfig = {
    version: "7.4.0 Aligned",
    rows: 22,/* ==========================================================================
   🔑 PROJECT: A-TO-Z BOMBAY PLAY ZONE (A-TO-Z-PATTI)
   📁 FILE: game_engine.js
   📌 VERSION: v7.5.0 [OFFLINE & ONLINE DUAL HYBRID ALIGNED]
   ========================================================================== */

const EngineConfig = {
    version: "7.5.0 Dual Hybrid",
    rows: 22,
    cols: 10
};

// #2200 কোর স্টেট - লাইভ ড্র ডেটাবেস কানেকশন
window.LiveGameState = {
    currentResult: {
        digit: "-",
        patti: "---",
        word: "-",
        time: "Loading..."
    }
};

// গ্লোবাল একটিভ বেটিং অবজেক্ট ট্র্যাকিং
window.activeBets = {}; 
let selectedCoinValue = 10; // ডিফল্ট কয়েন মাল্টিপ্লায়ার
let gameMode = 'Both';    
let activeBetType = 'Single';
let activeRange = 'A';

// সম্পূর্ণ ২২ লাইনের পাত্তি ডেটাবেস
const PATTI_DATA = {
    '1': ['100', '678', '777', '560', '470', '380', '290', '119', '137', '236', '146', '669', '579', '399', '588', '489', '245', '155', '227', '344', '335', '128'],
    '2': ['200', '345', '444', '570', '480', '390', '660', '129', '237', '336', '246', '679', '255', '147', '228', '499', '688', '778', '138', '156', '110', '569'],
    '3': ['300', '120', '111', '580', '490', '670', '238', '139', '337', '157', '346', '689', '355', '247', '256', '166', '599', '148', '788', '445', '229', '779'],
    '4': ['400', '789', '888', '590', '130', '680', '248', '149', '347', '158', '446', '699', '455', '266', '112', '356', '239', '338', '257', '220', '770', '167'],
    '5': ['500', '456', '555', '140', '230', '690', '258', '159', '357', '799', '267', '780', '447', '366', '113', '122', '177', '249', '339', '889', '348', '168'],
    '6': ['600', '123', '222', '150', '330', '240', '268', '169', '367', '448', '899', '178', '790', '466', '358', '880', '114', '556', '259', '349', '457', '277'],
    '7': ['700', '890', '999', '160', '340', '250', '278', '179', '377', '467', '115', '124', '223', '566', '557', '368', '359', '449', '269', '133', '188', '458'],
    '8': ['800', '567', '666', '170', '350', '260', '288', '189', '116', '233', '459', '125', '224', '477', '990', '134', '558', '369', '378', '440', '279', '468'],
    '9': ['900', '234', '333', '180', '360', '270', '450', '199', '117', '469', '126', '667', '478', '135', '225', '144', '379', '559', '289', '388', '577', '568'],
    '0': ['000', '127', '190', '280', '370', '460', '550', '235', '118', '578', '145', '479', '668', '299', '334', '488', '389', '226', '569', '677', '136', '244']
};

// সম্পূর্ণ ২২ লাইনের ওয়ার্ড ম্যাপিং
const WORD_MAPPING = {
    'A': ['AXZ', 'BKP', 'LMO', 'RST', 'TUV', 'WXY', 'NOP', 'ABC', 'EFG', 'HIJ', 'KLM', 'QRS', 'UVW', 'XYZ', 'DEF', 'GHI', 'JKL', 'MNO', 'PQR', 'STU', 'VWX', 'ZAB'],
    'B': ['BCA', 'CAB', 'DAB', 'DAC', 'EAC', 'FAD', 'GAD', 'HAD', 'JAD', 'KAD', 'LAD', 'MAD', 'NAD', 'PAD', 'RAD', 'SAD', 'TAD', 'VAD', 'WAD', 'YAD', 'ZAD', 'BAG'],
    'C': ['CAG', 'DAG', 'EAG', 'FAG', 'GAG', 'HAG', 'JAG', 'KAG', 'LAG', 'MAG', 'NAG', 'PAG', 'RAG', 'SAG', 'TAG', 'VAG', 'WAG', 'YAG', 'ZAG', 'BAK', 'CAK', 'DAK'],
    'D': ['EAK', 'FAK', 'GAK', 'HAK', 'JAK', 'KAK', 'LAK', 'MAK', 'NAK', 'PAK', 'RAK', 'SAK', 'TAK', 'VAK', 'WAK', 'YAK', 'ZAK', 'BAL', 'CAL', 'DAL', 'EAL', 'FAL'],
    'E': ['GAL', 'HAL', 'JAL', 'KAL', 'LAL', 'MAL', 'NAL', 'PAL', 'RAL', 'SAL', 'TAL', 'VAL', 'WAL', 'YAL', 'ZAL', 'BAM', 'CAM', 'DAM', 'EAM', 'FAM', 'GAM', 'HAM'],
    'F': ['JAM', 'KAM', 'LAM', 'MAM', 'NAM', 'PAM', 'RAM', 'SAM', 'TAM', 'VAM', 'WAM', 'YAM', 'ZAM', 'BAN', 'CAN', 'DAN', 'EAN', 'FAN', 'GAN', 'HAN', 'JAN', 'KAN'],
    'G': ['LAN', 'MAN', 'NAN', 'PAN', 'RAN', 'SAN', 'TAN', 'VAN', 'WAN', 'YAN', 'ZAN', 'BAP', 'CAP', 'DAP', 'EAP', 'FAP', 'GAP', 'HAP', 'JAP', 'KAP', 'LAP', 'MAP'],
    'H': ['NAP', 'PAP', 'RAP', 'SAP', 'TAP', 'VAP', 'WAP', 'YAP', 'ZAP', 'BAR', 'CAR', 'DAR', 'EAR', 'FAR', 'GAR', 'HAR', 'JAR', 'KAR', 'LAR', 'MAR', 'NAR', 'PAR'],
    'I': ['RAR', 'SAR', 'TAR', 'VAR', 'WAR', 'YAR', 'ZAR', 'BAS', 'CAS', 'DAS', 'EAS', 'FAS', 'GAS', 'HAS', 'JAS', 'KAS', 'LAS', 'MAS', 'NAS', 'PAS', 'RAS', 'SAS'],
    'J': ['TAS', 'VAS', 'WAS', 'YAS', 'ZAS', 'BAT', 'CAT', 'DAT', 'EAT', 'FAT', 'GAT', 'HAT', 'JAT', 'KAT', 'LAT', 'MAT', 'NAT', 'PAT', 'RAT', 'SAT', 'TAT', 'VAT']
};

const COLUMNS_DIGIT = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const COLUMNS_WORD = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

// ১. অফলাইন প্লেয়ার তথ্য ও ব্যালেন্স আপডেট
function loadOfflineUserData() {
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        window.location.href = "index.html";
        return;
    }

    const users = JSON.parse(localStorage.getItem('game_users') || '{}');
    const user = users[loggedInUser] || { balance: 0, winRate: 50 };

    const profileEls = document.querySelectorAll('.user-profile, .profile-name, [data-user-name]');
    profileEls.forEach(el => {
        el.innerText = `Profile: ${loggedInUser}`;
    });

    updateBalanceUI(user.balance);
}

function updateBalanceUI(balance) {
    const balanceEls = document.querySelectorAll('.play-balance, #lblPlayBalance, .balance-val');
    balanceEls.forEach(el => {
        el.innerText = `৳${Number(balance).toLocaleString()}`;
    });
}

// ৩টি ডাইনামিক লাইভ মোড বক্স আপডেট ফাংশন
function updateRealTimeResultUI(liveData = null) {
    if(liveData) {
        window.LiveGameState.currentResult = liveData;
    }
    
    const bothEl = document.getElementById('lblLiveBoth');
    const wordEl = document.getElementById('lblLiveWord');
    const digitEl = document.getElementById('lblLiveDigit');

    if (bothEl && wordEl && digitEl) {
        bothEl.innerHTML = `<span style="color:#00ffcc;">${window.LiveGameState.currentResult.patti} - ${window.LiveGameState.currentResult.word}</span>`;
        wordEl.innerHTML = `<span style="color:#ffc107;">${window.LiveGameState.currentResult.word}</span>`;
        digitEl.innerHTML = `<span style="color:#3b82f6;">${window.LiveGameState.currentResult.digit}</span>`;
    }
}

// সম্পূর্ণ ২২ লাইনের মেটাবলিক টেবিল জেনারেটর
function generateGameTable(mode = 'Both') {
    gameMode = mode;
    updateRealTimeResultUI();
    
    const wrapper = document.getElementById('gameTableWrapper') || document.querySelector('.table-container') || document.querySelector('.game-table');
    if (!wrapper) return;

    let html = `<table><thead><tr>`;
    
    COLUMNS_DIGIT.forEach((col, idx) => {
        let title = gameMode === 'Digit' ? `কলাম ${col}` : (gameMode === 'Word' ? `কলাম ${COLUMNS_WORD[idx]}` : `${col} - ${COLUMNS_WORD[idx]}`);
        html += `<th>${title}</th>`;
    });
    html += `</tr></thead><tbody><tr class="single-row-header">`;
    
    COLUMNS_DIGIT.forEach((col, idx) => {
        let singleVal = gameMode === 'Digit' ? col : (gameMode === 'Word' ? COLUMNS_WORD[idx] : `${col}-${COLUMNS_WORD[idx]}`);
        let label = gameMode === 'Digit' ? col : (gameMode === 'Word' ? COLUMNS_WORD[idx] : `${col}/${COLUMNS_WORD[idx]}`);
        html += `<td class="patti-cell single-cell" data-column="${col}" data-val="${singleVal}" data-type="Single" onclick="selectPattiCell(this)">${label} <br><small>(Single)</small></td>`;
    });
    html += `</tr>`;

    for (let r = 0; r < EngineConfig.rows; r++) {
        html += `<tr>`;
        COLUMNS_DIGIT.forEach((col, idx) => {
            const pattiValue = PATTI_DATA[col][r] || '';
            const wordValue = WORD_MAPPING[COLUMNS_WORD[idx]][r] || '';
            
            let valStr = gameMode === 'Digit' ? pattiValue : (gameMode === 'Word' ? wordValue : `<span class="both-pat" style="color:#fff; display:block; padding:2px 0;">${pattiValue}</span><hr style="border:0; border-top:1px dashed rgba(255,255,255,0.1); margin:2px 0;"><span class="both-wrd" style="color:#94a3b8; display:block; padding:2px 0;">${wordValue}</span>`);
            html += `<td class="patti-cell" data-column="${col}" data-patti="${pattiValue}" data-word="${wordValue}" data-type="Patti" data-row-index="${r}" onclick="selectPattiCell(this)">${valStr}</td>`;
        });
        html += `</tr>`;
    }
    wrapper.innerHTML = html + `</tbody></table>`;
    
    restoreCellVisualStates();
}

// সেল সিলেকশন ট্র্যাকিং
function selectPattiCell(cellElement) {
    const type = cellElement.getAttribute('data-type');
    const col = cellElement.getAttribute('data-column');
    let keyIdentifier = "";

    if (type === 'Single') {
        keyIdentifier = `Single-${cellElement.getAttribute('data-val')}`;
    } else {
        const pat = cellElement.getAttribute('data-patti');
        const wrd = cellElement.getAttribute('data-word');
        keyIdentifier = `Patti-${pat}-${wrd}`;
    }

    if (window.activeBets[keyIdentifier]) {
        window.activeBets[keyIdentifier].coins += selectedCoinValue;
    } else {
        window.activeBets[keyIdentifier] = {
            type: type,
            column: col,
            value: type === 'Single' ? cellElement.getAttribute('data-val') : cellElement.getAttribute('data-patti'),
            word: type === 'Single' ? '' : cellElement.getAttribute('data-word'),
            coins: selectedCoinValue
        };
    }

    cellElement.classList.add('selected');
    updateSelectedItemsDisplay();
    renderTokenInsideCell(cellElement, window.activeBets[keyIdentifier].coins);
}

// সেল এরিয়ার ভেতরে কয়েনের টোকেন রেন্ডারার
function renderTokenInsideCell(cellElement, totalCoins) {
    let token = cellElement.querySelector('.bet-anim-token');
    if (!token) {
        token = document.createElement('span');
        token.className = 'bet-anim-token';
        token.style.cssText = "position:absolute; bottom:2px; right:2px; background:#00ffcc; color:#000; font-size:9px; font-weight:bold; border-radius:3px; padding:1px 3px; line-height:1;";
        cellElement.style.position = 'relative';
        cellElement.appendChild(token);
    }
    token.innerText = totalCoins;
}

// রাইট সাইডবার ডিসপ্লে বক্স আপডেট
function updateSelectedItemsDisplay() {
    const container = document.getElementById('selectedItemsContainer') || document.querySelector('.selected-items-matrix') || document.querySelector('.matrix-box');
    if (!container) return;

    let keys = Object.keys(window.activeBets);
    if (keys.length === 0) {
        container.innerHTML = "Your selections will appear here";
        return;
    }

    let html = `<div style="display:flex; flex-direction:column; gap:6px; max-height:150px; overflow-y:auto;">`;
    keys.forEach(key => {
        const item = window.activeBets[key];
        if (item.type === 'Single') {
            html += `<div style="border-bottom:1px solid #233; padding-bottom:4px;">🎯 সিঙ্গেল [<b>${item.value}</b>] → <span style="color:#00ffcc;">৳${item.coins}</span></div>`;
        } else {
            html += `<div style="border-bottom:1px solid #233; padding-bottom:4px;">🃏 পাত্তি [<b>${item.value}</b>] ওয়ার্ড [<b>${item.word}</b>] → <span style="color:#00ffcc;">৳${item.coins}</span></div>`;
        }
    });
    html += `</div>`;
    container.innerHTML = html;
}

// সেল স্টেট রিস্টোর
function restoreCellVisualStates() {
    document.querySelectorAll('.patti-cell').forEach(cell => {
        const type = cell.getAttribute('data-type');
        let keyIdentifier = "";

        if (type === 'Single') {
            keyIdentifier = `Single-${cell.getAttribute('data-val')}`;
        } else {
            keyIdentifier = `Patti-${cell.getAttribute('data-patti')}-${cell.getAttribute('data-word')}`;
        }

        if (window.activeBets[keyIdentifier]) {
            cell.classList.add('selected');
            renderTokenInsideCell(cell, window.activeBets[keyIdentifier].coins);
        }
    });
}

// কয়েন মাল্টিপ্লায়ার বাটন ক্লিক হ্যান্ডলার
function setupCoinSelectors() {
    const coinBtns = document.querySelectorAll('.coin-btn, [data-coin-val], button:has-text("৳")');
    coinBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.coin-btn, [data-coin-val]').forEach(b => b.classList.remove('selected-coin', 'active'));
            this.classList.add('selected-coin', 'active');
            
            let val = parseInt(this.getAttribute('data-coin-val') || this.innerText.replace(/[^0-9]/g, ''));
            if (val) selectedCoinValue = val;
        });
    });
}

// View By (Both, Word, Digit) বাটন হ্যান্ডলার
function setupViewBySelectors() {
    const viewBtns = document.querySelectorAll('.view-btn, [data-view]');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const mode = this.getAttribute('data-view') || this.innerText.trim();
            if (['Both', 'Word', 'Digit'].includes(mode)) {
                document.querySelectorAll('.view-btn, [data-view]').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                generateGameTable(mode);
            }
        });
    });
}

// Bet Type (Single, Jora, Triple) বাটন হ্যান্ডলার
function setupBetTypeSelectors() {
    const betTypeBtns = document.querySelectorAll('.bet-type-btn, [data-bet-type], button:has-text("Single"), button:has-text("Jora"), button:has-text("Triple")');
    betTypeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.bet-type-btn, [data-bet-type]').forEach(b => b.classList.remove('active', 'selected'));
            this.classList.add('active', 'selected');
            activeBetType = this.getAttribute('data-bet-type') || this.innerText.trim();
            alert(`Bet Type নির্বাচিত হয়েছে: ${activeBetType}`);
        });
    });
}

// Number Range (A 1-25, B 26-50, etc.) বাটন হ্যান্ডলার
function setupRangeSelectors() {
    const rangeBtns = document.querySelectorAll('.range-btn, [data-range]');
    rangeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.range-btn, [data-range]').forEach(b => b.classList.remove('active', 'selected'));
            this.classList.add('active', 'selected');
            activeRange = this.getAttribute('data-range') || this.innerText.trim();
            alert(`Range নির্বাচিত হয়েছে: ${activeRange}`);
        });
    });
}

// নেভিগেশন সাইডবার অ্যাকশন (Withdraw, History, etc.)
function setupNavigationHandlers() {
    const navItems = document.querySelectorAll('.nav-item, .sidebar a, .sidebar button, .menu-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const text = this.innerText.trim();
            if (text.includes("Play Board")) return;
            
            e.preventDefault();
            alert(`📌 [${text}] সেকশনটি বর্তমানে অফলাইন ডেমো মোডে রয়েছে।`);
        });
    });
}

// Submit Bet & Reset All বাটন হ্যান্ডলার
function setupBetActionHandlers() {
    const resetBtn = document.getElementById('btnResetAll') || document.querySelector('.btn-reset') || document.querySelector('button:has-text("Reset All")');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            window.activeBets = {};
            generateGameTable(gameMode);
            updateSelectedItemsDisplay();
        });
    }

    const submitBtn = document.getElementById('btnSubmitBet') || document.querySelector('.btn-submit') || document.querySelector('button:has-text("Submit Bet")');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            const keys = Object.keys(window.activeBets);
            if (keys.length === 0) {
                alert("❌ কোনো বেট সিলেক্ট করা হয়নি!");
                return;
            }

            let totalBetAmount = 0;
            keys.forEach(k => totalBetAmount += window.activeBets[k].coins);

            const loggedInUser = sessionStorage.getItem('loggedInUser');
            const users = JSON.parse(localStorage.getItem('game_users') || '{}');

            if (users[loggedInUser]) {
                if (users[loggedInUser].balance < totalBetAmount) {
                    alert(`❌ আপনার পর্যাপ্ত ব্যালেন্স নেই! মোট প্রয়োজন: ৳${totalBetAmount}, আপনার আছে: ৳${users[loggedInUser].balance}`);
                    return;
                }

                users[loggedInUser].balance -= totalBetAmount;
                localStorage.setItem('game_users', JSON.stringify(users));
                updateBalanceUI(users[loggedInUser].balance);

                alert(`✅ সফলভাবে ৳${totalBetAmount} টাকার বেট প্লেস হয়েছে!`);
                
                window.activeBets = {};
                generateGameTable(gameMode);
                updateSelectedItemsDisplay();
            }
        });
    }
}

// গিটহাব পেজেস ও অফলাইন নিরাপদ লগআউট রউটার
function secureLogoutRouter() {
    const logoutBtns = document.querySelectorAll('#btnLogout, .btn-logout, button:has-text("Logout"), a:has-text("Logout")');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            sessionStorage.removeItem('loggedInUser');
            
            let repoName = window.location.pathname.split('/')[1]; 
            if (window.location.hostname.includes('github.io') && repoName) {
                window.location.href = window.location.origin + '/' + repoName + '/index.html';
            } else {
                window.location.href = './index.html';
            }
        });
    });
}

// লাইভ ডেমো ডেটা ট্রিগার
function simulateFirebaseLiveResult() {
    setTimeout(() => {
        updateRealTimeResultUI({
            digit: "4",
            patti: "400",
            word: "D",
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        });
    }, 3000);
}

// ইঞ্জিন গ্লোবাল এক্সপোজার
window.PlayerEngine = {
    generateTable: generateGameTable
};

// ইঞ্জিন ইনিশিয়ালাইজেশন
document.addEventListener("DOMContentLoaded", () => {
    loadOfflineUserData();
    generateGameTable('Both');
    setupCoinSelectors();
    setupViewBySelectors();
    setupBetTypeSelectors();
    setupRangeSelectors();
    setupNavigationHandlers();
    setupBetActionHandlers();
    secureLogoutRouter();
    simulateFirebaseLiveResult();
});
    cols: 10
};

// #2200 কোর স্টেট - লাইভ ড্র ডেটাবেস কানেকশন
window.LiveGameState = {
    currentResult: {
        digit: "-",
        patti: "---",
        word: "-",
        time: "Loading..."
    }
};

// গ্লোবাল একটিভ বেটিং অবজেক্ট ট্র্যাকিং
window.activeBets = {}; 
let selectedCoinValue = 2; // ডিফল্ট কয়েন মাল্টিপ্লায়ার
let gameMode = 'Both';    

// সম্পূর্ণ ২২ লাইনের পাত্তি ডেটাবেস
const PATTI_DATA = {
    '1': ['100', '678', '777', '560', '470', '380', '290', '119', '137', '236', '146', '669', '579', '399', '588', '489', '245', '155', '227', '344', '335', '128'],
    '2': ['200', '345', '444', '570', '480', '390', '660', '129', '237', '336', '246', '679', '255', '147', '228', '499', '688', '778', '138', '156', '110', '569'],
    '3': ['300', '120', '111', '580', '490', '670', '238', '139', '337', '157', '346', '689', '355', '247', '256', '166', '599', '148', '788', '445', '229', '779'],
    '4': ['400', '789', '888', '590', '130', '680', '248', '149', '347', '158', '446', '699', '455', '266', '112', '356', '239', '338', '257', '220', '770', '167'],
    '5': ['500', '456', '555', '140', '230', '690', '258', '159', '357', '799', '267', '780', '447', '366', '113', '122', '177', '249', '339', '889', '348', '168'],
    '6': ['600', '123', '222', '150', '330', '240', '268', '169', '367', '448', '899', '178', '790', '466', '358', '880', '114', '556', '259', '349', '457', '277'],
    '7': ['700', '890', '999', '160', '340', '250', '278', '179', '377', '467', '115', '124', '223', '566', '557', '368', '359', '449', '269', '133', '188', '458'],
    '8': ['800', '567', '666', '170', '350', '260', '288', '189', '116', '233', '459', '125', '224', '477', '990', '134', '558', '369', '378', '440', '279', '468'],
    '9': ['900', '234', '333', '180', '360', '270', '450', '199', '117', '469', '126', '667', '478', '135', '225', '144', '379', '559', '289', '388', '577', '568'],
    '0': ['000', '127', '190', '280', '370', '460', '550', '235', '118', '578', '145', '479', '668', '299', '334', '488', '389', '226', '569', '677', '136', '244']
};

// সম্পূর্ণ ২২ লাইনের ওয়ার্ড ম্যাপিং
const WORD_MAPPING = {
    'A': ['AXZ', 'BKP', 'LMO', 'RST', 'TUV', 'WXY', 'NOP', 'ABC', 'EFG', 'HIJ', 'KLM', 'QRS', 'UVW', 'XYZ', 'DEF', 'GHI', 'JKL', 'MNO', 'PQR', 'STU', 'VWX', 'ZAB'],
    'B': ['BCA', 'CAB', 'DAB', 'DAC', 'EAC', 'FAD', 'GAD', 'HAD', 'JAD', 'KAD', 'LAD', 'MAD', 'NAD', 'PAD', 'RAD', 'SAD', 'TAD', 'VAD', 'WAD', 'YAD', 'ZAD', 'BAG'],
    'C': ['CAG', 'DAG', 'EAG', 'FAG', 'GAG', 'HAG', 'JAG', 'KAG', 'LAG', 'MAG', 'NAG', 'PAG', 'RAG', 'SAG', 'TAG', 'VAG', 'WAG', 'YAG', 'ZAG', 'BAK', 'CAK', 'DAK'],
    'D': ['EAK', 'FAK', 'GAK', 'HAK', 'JAK', 'KAK', 'LAK', 'MAK', 'NAK', 'PAK', 'RAK', 'SAK', 'TAK', 'VAK', 'WAK', 'YAK', 'ZAK', 'BAL', 'CAL', 'DAL', 'EAL', 'FAL'],
    'E': ['GAL', 'HAL', 'JAL', 'KAL', 'LAL', 'MAL', 'NAL', 'PAL', 'RAL', 'SAL', 'TAL', 'VAL', 'WAL', 'YAL', 'ZAL', 'BAM', 'CAM', 'DAM', 'EAM', 'FAM', 'GAM', 'HAM'],
    'F': ['JAM', 'KAM', 'LAM', 'MAM', 'NAM', 'PAM', 'RAM', 'SAM', 'TAM', 'VAM', 'WAM', 'YAM', 'ZAM', 'BAN', 'CAN', 'DAN', 'EAN', 'FAN', 'GAN', 'HAN', 'JAN', 'KAN'],
    'G': ['LAN', 'MAN', 'NAN', 'PAN', 'RAN', 'SAN', 'TAN', 'VAN', 'WAN', 'YAN', 'ZAN', 'BAP', 'CAP', 'DAP', 'EAP', 'FAP', 'GAP', 'HAP', 'JAP', 'KAP', 'LAP', 'MAP'],
    'H': ['NAP', 'PAP', 'RAP', 'SAP', 'TAP', 'VAP', 'WAP', 'YAP', 'ZAP', 'BAR', 'CAR', 'DAR', 'EAR', 'FAR', 'GAR', 'HAR', 'JAR', 'KAR', 'LAR', 'MAR', 'NAR', 'PAR'],
    'I': ['RAR', 'SAR', 'TAR', 'VAR', 'WAR', 'YAR', 'ZAR', 'BAS', 'CAS', 'DAS', 'EAS', 'FAS', 'GAS', 'HAS', 'JAS', 'KAS', 'LAS', 'MAS', 'NAS', 'PAS', 'RAS', 'SAS'],
    'J': ['TAS', 'VAS', 'WAS', 'YAS', 'ZAS', 'BAT', 'CAT', 'DAT', 'EAT', 'FAT', 'GAT', 'HAT', 'JAT', 'KAT', 'LAT', 'MAT', 'NAT', 'PAT', 'RAT', 'SAT', 'TAT', 'VAT']
};

const COLUMNS_DIGIT = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const COLUMNS_WORD = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

// ৩টি ডাইনামিক লাইভ মোড বক্স আপডেট ফাংশন (#2200 REFACTORED UPGRADE)
function updateRealTimeResultUI(liveData = null) {
    if(liveData) {
        window.LiveGameState.currentResult = liveData;
    }
    
    const bothEl = document.getElementById('lblLiveBoth');
    const wordEl = document.getElementById('lblLiveWord');
    const digitEl = document.getElementById('lblLiveDigit');

    if (bothEl && wordEl && digitEl) {
        bothEl.innerHTML = `<span style="color:#00ffcc;">${window.LiveGameState.currentResult.patti} - ${window.LiveGameState.currentResult.word}</span>`;
        wordEl.innerHTML = `<span style="color:#ffc107;">${window.LiveGameState.currentResult.word}</span>`;
        digitEl.innerHTML = `<span style="color:#3b82f6;">${window.LiveGameState.currentResult.digit}</span>`;
    }
}

// সম্পূর্ণ ২২ লাইনের মেটাবলিক টেবিল জেনারেটর
function generateGameTable(mode = 'Both') {
    gameMode = mode;
    updateRealTimeResultUI();
    
    const wrapper = document.getElementById('gameTableWrapper');
    if (!wrapper) return;

    let html = `<table><thead><tr>`;
    
    COLUMNS_DIGIT.forEach((col, idx) => {
        let title = gameMode === 'Digit' ? `কলাম ${col}` : (gameMode === 'Word' ? `কলাম ${COLUMNS_WORD[idx]}` : `${col} - ${COLUMNS_WORD[idx]}`);
        html += `<th>${title}</th>`;
    });
    html += `</tr></thead><tbody><tr class="single-row-header">`;
    
    COLUMNS_DIGIT.forEach((col, idx) => {
        let singleVal = gameMode === 'Digit' ? col : (gameMode === 'Word' ? COLUMNS_WORD[idx] : `${col}-${COLUMNS_WORD[idx]}`);
        let label = gameMode === 'Digit' ? col : (gameMode === 'Word' ? COLUMNS_WORD[idx] : `${col}/${COLUMNS_WORD[idx]}`);
        html += `<td class="patti-cell single-cell" data-column="${col}" data-val="${singleVal}" data-type="Single" onclick="selectPattiCell(this)">${label} <br><small>(Single)</small></td>`;
    });
    html += `</tr>`;

    for (let r = 0; r < EngineConfig.rows; r++) {
        html += `<tr>`;
        COLUMNS_DIGIT.forEach((col, idx) => {
            const pattiValue = PATTI_DATA[col][r] || '';
            const wordValue = WORD_MAPPING[COLUMNS_WORD[idx]][r] || '';
            
            let valStr = gameMode === 'Digit' ? pattiValue : (gameMode === 'Word' ? wordValue : `<span class="both-pat" style="color:#fff; display:block; padding:2px 0;">${pattiValue}</span><hr style="border:0; border-top:1px dashed rgba(255,255,255,0.1); margin:2px 0;"><span class="both-wrd" style="color:#94a3b8; display:block; padding:2px 0;">${wordValue}</span>`);
            html += `<td class="patti-cell" data-column="${col}" data-patti="${pattiValue}" data-word="${wordValue}" data-type="Patti" data-row-index="${r}" onclick="selectPattiCell(this)">${valStr}</td>`;
        });
        html += `</tr>`;
    }
    wrapper.innerHTML = html + `</tbody></table>`;
    
    // মোড পরিবর্তনের পর পূর্বের সিলেক্টেড সেলগুলোর ভিজ্যুয়াল স্টেট ফিরিয়ে আনা
    restoreCellVisualStates();
}

// সেল সিলেকশন ট্র্যাকিং এবং রাইট সাইডবার ড্র ম্যাট্রিক্স লাইভ সামারি আপডেট
function selectPattiCell(cellElement) {
    const type = cellElement.getAttribute('data-type');
    const col = cellElement.getAttribute('data-column');
    let keyIdentifier = "";

    if (type === 'Single') {
        keyIdentifier = `Single-${cellElement.getAttribute('data-val')}`;
    } else {
        const pat = cellElement.getAttribute('data-patti');
        const wrd = cellElement.getAttribute('data-word');
        keyIdentifier = `Patti-${pat}-${wrd}`;
    }

    // যদি অলরেডি সিলেক্টেড থাকে তবে কয়েন কাউন্ট এড হবে, নাহলে নতুন এন্ট্রি হবে
    if (window.activeBets[keyIdentifier]) {
        window.activeBets[keyIdentifier].coins += selectedCoinValue;
    } else {
        window.activeBets[keyIdentifier] = {
            type: type,
            column: col,
            value: type === 'Single' ? cellElement.getAttribute('data-val') : cellElement.getAttribute('data-patti'),
            word: type === 'Single' ? '' : cellElement.getAttribute('data-word'),
            coins: selectedCoinValue
        };
    }

    cellElement.classList.add('selected');
    updateSelectedItemsDisplay();
    renderTokenInsideCell(cellElement, window.activeBets[keyIdentifier].coins);
}

// সেল এরিয়ার ভেতরে কয়েনের ডাইনামিক এনিমেশন টোকেন রেন্ডারার
function renderTokenInsideCell(cellElement, totalCoins) {
    let token = cellElement.querySelector('.bet-anim-token');
    if (!token) {
        token = document.createElement('span');
        token.className = 'bet-anim-token';
        token.style.cssText = "position:absolute; bottom:2px; right:2px; background:#00ffcc; color:#000; font-size:9px; font-weight:bold; border-radius:3px; padding:1px 3px; line-height:1;";
        cellElement.style.position = 'relative';
        cellElement.appendChild(token);
    }
    token.innerText = totalCoins;
}

// রাইট সাইডবার ডিসপ্লে বক্স আপডেট লজিক
function updateSelectedItemsDisplay() {
    const container = document.getElementById('selectedItemsContainer');
    if (!container) return;

    let keys = Object.keys(window.activeBets);
    if (keys.length === 0) {
        container.innerHTML = "No Patti Active / Counter Zero";
        return;
    }

    let html = `<div style="display:flex; flex-direction:column; gap:6px;">`;
    keys.forEach(key => {
        const item = window.activeBets[key];
        if (item.type === 'Single') {
            html += `<div style="border-bottom:1px solid #233; padding-bottom:4px;">🎯 সিঙ্গেল [<b>${item.value}</b>] → <span style="color:#00ffcc;">${item.coins} Coins</span></div>`;
        } else {
            html += `<div style="border-bottom:1px solid #233; padding-bottom:4px;">🃏 পাত্তি [<b>${item.value}</b>] ওয়ার্ড [<b>${item.word}</b>] → <span style="color:#00ffcc;">${item.coins} Coins</span></div>`;
        }
    });
    html += `</div>`;
    container.innerHTML = html;
}

// টেবিল রি-রেন্ডার হওয়ার পরও কয়েন টোকেন ও বর্ডার স্টেট রিস্টোর করার মেকানিজম
function restoreCellVisualStates() {
    document.querySelectorAll('.patti-cell').forEach(cell => {
        const type = cell.getAttribute('data-type');
        let keyIdentifier = "";

        if (type === 'Single') {
            keyIdentifier = `Single-${cell.getAttribute('data-val')}`;
        } else {
            keyIdentifier = `Patti-${cell.getAttribute('data-patti')}-${cell.getAttribute('data-word')}`;
        }

        if (window.activeBets[keyIdentifier]) {
            cell.classList.add('selected');
            renderTokenInsideCell(cell, window.activeBets[keyIdentifier].coins);
        }
    });
}

// কয়েন মাল্টিপ্লায়ার বাটন ক্লিক হ্যান্ডলার বাইন্ডিং
function setupCoinSelectors() {
    document.querySelectorAll('.coin-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.coin-btn').forEach(b => b.classList.remove('selected-coin'));
            this.classList.add('selected-coin');
            selectedCoinValue = parseInt(this.getAttribute('data-coin-val')) || 2;
        });
    });
}

// গিটহাব পেজেস ৪MD লগআউট ক্র্যাশ ফিক্স রউটার
function secureLogoutRouter() {
    const logoutBtn = document.getElementById('btnLogout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
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

// লাইভ ডেমো ডেটা ট্রিগার (৩ সেকেন্ড পর রিয়াল টাইম আপডেট হবে)
function simulateFirebaseLiveResult() {
    setTimeout(() => {
        updateRealTimeResultUI({
            digit: "4",
            patti: "400",
            word: "D",
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        });
    }, 3000);
}

// ইঞ্জিন গ্লোবাল এক্সপোজার
window.PlayerEngine = {
    generateTable: generateGameTable
};

// ইঞ্জিন ইনিশিয়ালাইজেশন
document.addEventListener("DOMContentLoaded", () => {
    generateGameTable('Both');
    setupCoinSelectors();
    secureLogoutRouter();
    simulateFirebaseLiveResult();
});
