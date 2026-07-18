/* ==========================================================================
   ATOZ BOMBAY - CORE ENGINE (v7.2.5 Lite - MASTER LIVE EDITION)
   ========================================================================== */

const EngineConfig = {
    version: "7.2.5 Lite",
    rows: 22,
    cols: 10
};
let gameMode = 'Both';    

// ডাইনামিক হেডার রেজাল্ট রেন্ডারার (লাইভ আপডেট মোড)
function updateRealTimeResultUI(liveData = null) {
    if(liveData) {
        window.LiveGameState.currentResult = liveData;
    }
    
    const resultBox = document.getElementById('liveResultContainer') || document.querySelector('.player-commission-wrapper');
    if (!resultBox) return;

    resultBox.className = "live-result-header-block";
    let resDisplay = "";
    
    if (gameMode === 'Digit') {
        resDisplay = window.LiveGameState.currentResult.digit;
    } else if (gameMode === 'Word') {
        resDisplay = window.LiveGameState.currentResult.word;
    } else {
        resDisplay = `${window.LiveGameState.currentResult.patti} - ${window.LiveGameState.currentResult.word}`;
    }

    resultBox.innerHTML = `
        <span style="color:#ffffff; margin-right:6px; font-size:14px;">Result:</span>
        <span style="color:#00ffcc; font-weight:bold; font-size:16px;">${resDisplay}</span>
        <span style="font-size:11px; color:#ffcc00; margin-left:8px;">(${window.LiveGameState.currentResult.time})</span>
    `;
}

// টেবিল ও ভিউ বাই জেনারেশন
function generateGameTable(mode = 'Both') {
    gameMode = mode;
    updateRealTimeResultUI();
    
    const wrapper = document.getElementById('gameTableWrapper');
    if (!wrapper) return;

    let html = `<table><thead><tr>`;
    const colDigits = ['1','2','3','4','5','6','7','8','9','0'];
    const colWords = ['A','B','C','D','E','F','G','H','I','J'];
    
    colDigits.forEach((col, idx) => {
        let title = gameMode === 'Digit' ? `Col ${col}` : (gameMode === 'Word' ? `Col ${colWords[idx]}` : `${col} - ${colWords[idx]}`);
        html += `<th>${title}</th>`;
    });
    html += `</tr></thead><tbody><tr class="single-row-header">`;
    
    colDigits.forEach((col, idx) => {
        let singleVal = gameMode === 'Digit' ? col : (gameMode === 'Word' ? colWords[idx] : `${col}-${colWords[idx]}`);
        let label = gameMode === 'Digit' ? col : (gameMode === 'Word' ? colWords[idx] : `${col}/${colWords[idx]}`);
        html += `<td class="patti-cell single-cell" data-column="${col}" data-val="${singleVal}" data-type="Single" onclick="selectPattiCell(this)">${label} <br><small>(Single)</small></td>`;
    });
    html += `</tr>`;

    for (let r = 0; r < EngineConfig.rows; r++) {
        html += `<tr>`;
        colDigits.forEach((col) => {
            const pattiValue = PATTI_DATA[col][r] || '';
            const wordValue = WORD_MAPPING[colWords[colDigits.indexOf(col)]][r] || '';
            let valStr = gameMode === 'Digit' ? pattiValue : (gameMode === 'Word' ? wordValue : `<span class="both-pat">${pattiValue}</span><hr class="both-split"><span class="both-wrd">${wordValue}</span>`);
            html += `<td class="patti-cell" data-column="${col}" data-patti="${pattiValue}" data-word="${wordValue}" data-type="Patti" onclick="selectPattiCell(this)">${valStr}</td>`;
        });
        html += `</tr>`;
    }
    wrapper.innerHTML = html + `</tbody></table>`;
}

// গ্রিড সিলেক্টেড আইটেম ফিল্ড ট্র্যাকিং
function selectPattiCell(cellElement) {
    document.querySelectorAll('.patti-cell').forEach(c => {
        c.classList.remove('selected', 'overlimit-red');
    });
    cellElement.classList.add('selected');
    
    const type = cellElement.getAttribute('data-type');
    const col = cellElement.getAttribute('data-column');
    const displayBox = document.getElementById('selectedPattiDisplay') || document.querySelector('.selected-items-box');

    if (!displayBox) return;

    if (type === 'Single') {
        const val = cellElement.getAttribute('data-val');
        displayBox.innerHTML = `<span style="color:#ffcc00; font-weight:bold;">সিঙ্গেল ঘর: [ ${val} ] (কলাম ${col})</span>`;
    } else {
        const pat = cellElement.getAttribute('data-patti');
        const wrd = cellElement.getAttribute('data-word');
        displayBox.innerHTML = `<span style="color:#00ffcc; font-weight:bold;">প্রার্থী পাত্তি: [ ${pat} ] | ওয়ার্ড: [ ${wrd} ] (কলাম ${col})</span>`;
    }
}

// ৪MD গিটহাব পেজেস রিডাইরেক্ট ও লগআউট ফিক্স
function secureLogoutRouter() {
    const logoutBtn = document.getElementById('btnLogout') || document.querySelector('.logout-item, [href*="logout"]');
    if (logoutBtn) {
        logoutBtn.removeAttribute('href'); 
        logoutBtn.style.cursor = "pointer";
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Secure Logout Executing... #2200");
            
            // GitHub Pages 404 এড়াতে রিলেটিভ পাথ ফিক্স
            let currentPath = window.location.pathname;
            let repoName = currentPath.split('/')[1]; 
            
            if (window.location.hostname.includes('github.io')) {
                window.location.href = window.location.origin + '/' + repoName + '/login.html';
            } else {
                window.location.href = '/login.html';
            }
        });
    }
}

// ফায়ারবেস রিয়েলটাইম লিসেনার মক (লাইভ ডেটা স্ট্রিমিং গেটওয়ে)
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

document.addEventListener("DOMContentLoaded", () => {
    generateGameTable('Both');
    secureLogoutRouter();
    simulateFirebaseLiveResult();
    
    // ভিউ কন্ট্রোল বাটন লিসেনার
    document.querySelectorAll('.view-by-btn, [data-mode]').forEach(btn => {
        btn.addEventListener('click', function() {
            const mode = this.getAttribute('data-mode') || this.innerText.trim();
            if(['Both', 'Digit', 'Word'].includes(mode)) generateGameTable(mode);
        });
    });
});
// লাইভ রেজাল্ট ও স্টেট হোল্ডার
window.LiveGameState = {
    currentResult: {
        digit: "9",
        patti: "900",
        word: "I",
        time: "04:00 PM"
    }
};

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

const GAME_DATABASE = {
    '1': { patti: PATTI_DATA['1'], words: WORD_MAPPING['A'] },
    '2': { patti: PATTI_DATA['2'], words: WORD_MAPPING['B'] },
    '3': { patti: PATTI_DATA['3'], words: WORD_MAPPING['C'] },
    '4': { patti: PATTI_DATA['4'], words: WORD_MAPPING['D'] },
    '5': { patti: PATTI_DATA['5'], words: WORD_MAPPING['E'] },
    '6': { patti: PATTI_DATA['6'], words: WORD_MAPPING['F'] },
    '7': { patti: PATTI_DATA['7'], words: WORD_MAPPING['G'] },
    '8': { patti: PATTI_DATA['8'], words: WORD_MAPPING['H'] },
    '9': { patti: PATTI_DATA['9'], words: WORD_MAPPING['I'] },
    '0': { patti: PATTI_DATA['0'], words: WORD_MAPPING['J'] }
};

const COLUMNS_DIGIT = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const COLUMNS_WORD = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

let selectedPatti = null;
let selectedWord = null;
let selectedColumn = null;
let selectedType = null; 
let gameMode = 'Both';    

// ডাইনামিক হেডার রেজাল্ট রেন্ডারার
function renderLiveResultDisplay() {
    const headerRightContainer = document.getElementById('liveResultContainer') || document.querySelector('.player-commission-wrapper');
    
    // যদি পুরানো প্লেয়ার কমিশন টপ বারে থাকে, তা রিমুভ করে রেজাল্ট প্যানেল সেট করা হবে
    if (headerRightContainer) {
        headerRightContainer.className = "live-result-header-block";
        headerRightContainer.style.display = "inline-flex";
        headerRightContainer.style.alignItems = "center";
        headerRightContainer.style.color = "#00ffcc";
        headerRightContainer.style.fontWeight = "bold";
        
        let resVal = "";
        if (gameMode === 'Digit') {
            resVal = window.LiveGameState.currentResult.digit;
        } else if (gameMode === 'Word') {
            resVal = window.LiveGameState.currentResult.word;
        } else {
            resVal = `${window.LiveGameState.currentResult.patti} / ${window.LiveGameState.currentResult.word}`;
        }
        
        headerRightContainer.innerHTML = `
            <span style="color:#ffffff; margin-right:5px;">Result:</span>
            <span>${resVal}</span>
            <span style="font-size:11px; color:#aaa; margin-left:8px;">(${window.LiveGameState.currentResult.time})</span>
        `;
    }
}

// টেবিল জেনারেশন
function generateGameTable(mode = 'Both') {
    gameMode = mode;
    renderLiveResultDisplay();
    
    const wrapper = document.getElementById('gameTableWrapper');
    if (!wrapper) return;

    let html = `<table><thead><tr>`;
    
    COLUMNS_DIGIT.forEach((col, index) => {
        let headerText = gameMode === 'Digit' ? `Col ${col}` : (gameMode === 'Word' ? `Col ${COLUMNS_WORD[index]}` : `${col} - ${COLUMNS_WORD[index]}`);
        html += `<th>${headerText}</th>`;
    });
    
    html += `</tr></thead><tbody><tr class="single-row-header">`;
    
    COLUMNS_DIGIT.forEach((col, index) => {
        let singleVal = gameMode === 'Digit' ? col : (gameMode === 'Word' ? COLUMNS_WORD[index] : `${col}-${COLUMNS_WORD[index]}`);
        let displayVal = gameMode === 'Digit' ? `${col} <br><small>(Single)</small>` : (gameMode === 'Word' ? `${COLUMNS_WORD[index]} <br><small>(Single)</small>` : `${col} / ${COLUMNS_WORD[index]} <br><small>(Single)</small>`);

        html += `<td class="patti-cell single-cell" data-column="${col}" data-val="${singleVal}" data-type="Single" onclick="selectPattiCell(this)">${displayVal}</td>`;
    });
    html += `</tr>`;

    for (let rowIndex = 0; rowIndex < EngineConfig.rows; rowIndex++) {
        html += `<tr>`;
        COLUMNS_DIGIT.forEach((col) => {
            const pattiValue = GAME_DATABASE[col].patti[rowIndex] || '';
            const wordValue = GAME_DATABASE[col].words[rowIndex] || '';
            
            let displayValue = gameMode === 'Digit' ? pattiValue : (gameMode === 'Word' ? wordValue : `<span class="both-pat">${pattiValue}</span><hr class="both-split"><span class="both-wrd">${wordValue}</span>`);

            html += `<td class="patti-cell" data-column="${col}" data-patti="${pattiValue}" data-word="${wordValue}" data-type="Patti" onclick="selectPattiCell(this)">${displayValue}</td>`;
        });
        html += `</tr>`;
    }

    html += `</tbody></table>`;
    wrapper.innerHTML = html;
}

// সেল ক্লিক হ্যান্ডলার 
function selectPattiCell(cellElement) {
    document.querySelectorAll('.patti-cell').forEach(c => {
        c.classList.remove('selected');
        c.classList.remove('overlimit-red');
    });

    cellElement.classList.add('selected');
    selectedType = cellElement.getAttribute('data-type');
    selectedColumn = cellElement.getAttribute('data-column');

    const displayElement = document.getElementById('selectedPattiDisplay') || document.querySelector('.selected-items-box');
    
    if (selectedType === 'Single') {
        selectedPatti = cellElement.getAttribute('data-val');
        selectedWord = "N/A";
        if (displayElement) {
            displayElement.innerHTML = `<span style="color: #ffcc00; font-weight:bold;">সিঙ্গেল ঘর: [ ${selectedPatti} ] (কলাম ${selectedColumn})</span>`;
        }
    } else {
        selectedPatti = cellElement.getAttribute('data-patti');
        selectedWord = cellElement.getAttribute('data-word');
        if (displayElement) {
            displayElement.innerHTML = `<span style="color: #00ffcc; font-weight:bold;">প্রার্থী পাত্তি: [ ${selectedPatti} ] | ওয়ার্ড: [ ${selectedWord} ] (কলাম ${selectedColumn})</span>`;
        }
    }

    runLimitCheck();
}

// ডাইনামিক লিমিট চেকার
function runLimitCheck() {
    const betInput = document.getElementById('betAmountInput') || document.querySelector('.bet-amount-field input');
    const activeCell = document.querySelector('.patti-cell.selected');
    if (!betInput || !activeCell) return;

    const val = parseFloat(betInput.value) || 0;
    
    if (selectedType === 'Patti' && val > 5.0) {
        activeCell.classList.add('overlimit-red');
        activeCell.classList.remove('selected');
    } else if (selectedType === 'Single' && val > 1000.0) {
        activeCell.classList.add('overlimit-red');
        activeCell.classList.remove('selected');
    } else {
        activeCell.classList.remove('overlimit-red');
        activeCell.classList.add('selected');
    }
}

// নাম্বার রেঞ্জ কন্ট্রোলার লিঙ্কার
function initNumberRangeFilters() {
    document.querySelectorAll('.range-btn, [data-range]').forEach(btn => {
        btn.addEventListener('click', function() {
            const rangeAttr = this.getAttribute('data-range') || this.innerText;
            console.log("Filtering Number Range Matrix for: ", rangeAttr);
            // এখানে ম্যাট্রিক্স স্ক্রোল বা হাইলাইট ট্রিগার কোড এক্সিকিউট হবে
        });
    });
}

// সাইডবার ও ড্যাশবোর্ড মেনু আনলকার ইন্টারফেস
function unlockSidebarNavigation() {
    const menuSelectors = ['.sidebar-menu a', '.menu-item', '[data-target]'];
    menuSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(item => {
            item.addEventListener('click', function(e) {
                const targetMenu = this.innerText.trim();
                console.log(`Navigating securely to: ${targetMenu}`);
                // অ্যাকাউন্ট ব্যালেন্স, উইথড্র ও হিস্ট্রি লোড রুট
            });
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    generateGameTable('Both');
    initNumberRangeFilters();
    unlockSidebarNavigation();
    
    // মোড সুইচ বাটনের সাথে রিয়েল টাইম রেজাল্ট সিঙ্ক
    document.querySelectorAll('.view-by-btn, .btn-ctrl').forEach(btn => {
        btn.addEventListener('click', function() {
            const selectedMode = this.innerText.trim();
            if(['Both', 'Digit', 'Word'].includes(selectedMode)) {
                generateGameTable(selectedMode);
            }
        });
    });
});
