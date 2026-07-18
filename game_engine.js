/* ==========================================================================
   ATOZ BOMBAY - COMPLETE ENGINE (v7.3.0 - #2200 FULL STRUCTURE LOCK)
   ========================================================================== */

const EngineConfig = {
    version: "7.3.0 Full",
    rows: 22,
    cols: 10
};

// #2200 কোর স্টেট - লাইভ ড্র ডেটাবেস কানেকশন (শুরুতে ফ্লেক্সিবল ডেমো, পরে ডাইনামিক)
window.LiveGameState = {
    currentResult: {
        digit: "-",
        patti: "---",
        word: "-",
        time: "Loading..."
    }
};

// সম্পূর্ণ ২২ লাইনের পাত্তি ডেটাবেস (কোনো কাটছাঁট ছাড়া)
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

// সম্পূর্ণ ২২ লাইনের ওয়ার্ড ম্যাপিং (কোনো কাটছাঁট ছাড়া)
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

let gameMode = 'Both';    

// টপ হেডার রেজাল্ট রেন্ডারার ফাংশন
function updateRealTimeResultUI(liveData = null) {
    if(liveData) {
        window.LiveGameState.currentResult = liveData;
    }
    
    // টপ হেডার প্যানেল সিলেকশন (প্লেয়ার কমিশন রিমুভ করে রেজাল্ট দেখানোর জন্য)
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

// ২২ কলামের সম্পূর্ণ ডাইনামিক টেবিল জেনারেটর
function generateGameTable(mode = 'Both') {
    gameMode = mode;
    updateRealTimeResultUI();
    
    const wrapper = document.getElementById('gameTableWrapper');
    if (!wrapper) return;

    let html = `<table><thead><tr>`;
    
    COLUMNS_DIGIT.forEach((col, idx) => {
        let title = gameMode === 'Digit' ? `Col ${col}` : (gameMode === 'Word' ? `Col ${COLUMNS_WORD[idx]}` : `${col} - ${COLUMNS_WORD[idx]}`);
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
            
            let valStr = gameMode === 'Digit' ? pattiValue : (gameMode === 'Word' ? wordValue : `<span class="both-pat">${pattiValue}</span><hr class="both-split"><span class="both-wrd">${wordValue}</span>`);
            html += `<td class="patti-cell" data-column="${col}" data-patti="${pattiValue}" data-word="${wordValue}" data-type="Patti" onclick="selectPattiCell(this)">${valStr}</td>`;
        });
        html += `</tr>`;
    }
    wrapper.innerHTML = html + `</tbody></table>`;
}

// সেল সিলেকশন ট্র্যাকিং এবং ডিসপ্লে বক্স আপডেট
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

// গিটহাব পেজেস ৪MD লগআউট ক্র্যাশ ফিক্স রউটার
function secureLogoutRouter() {
    const logoutBtn = document.getElementById('btnLogout') || document.querySelector('.logout-item, [href*="logout"], #logout');
    if (logoutBtn) {
        logoutBtn.removeAttribute('href'); 
        logoutBtn.style.cursor = "pointer";
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Secure Logout Executing... #2200");
            
            let currentPath = window.location.pathname;
            let repoName = currentPath.split('/')[1]; 
            
            // যদি গিটহাব পেজেসে হোস্ট করা থাকে তবে রিপো নাম ধরে রিডাইরেক্ট করবে
            if (window.location.hostname.includes('github.io')) {
                window.location.href = window.location.origin + '/' + repoName + '/login.html';
            } else {
                window.location.href = '/login.html';
            }
        });
    }
}

// লাইভ ডেমো ডেটা ট্রিগার (৩ সেকেন্ড পর রিয়াল টাইম আপডেট হবে)
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

// ইঞ্জিন ইনিশিয়ালাইজেশন
document.addEventListener("DOMContentLoaded", () => {
    generateGameTable('Both');
    secureLogoutRouter();
    simulateFirebaseLiveResult();
    
    // ভিউ কন্ট্রোল বাটন লিসেনার (Both, Digit, Word)
    document.querySelectorAll('.view-by-btn, [data-mode]').forEach(btn => {
        btn.addEventListener('click', function() {
            const mode = this.getAttribute('data-mode') || this.innerText.trim();
            if(['Both', 'Digit', 'Word'].includes(mode)) generateGameTable(mode);
        });
    });
});
