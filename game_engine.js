/* ==========================================================================
   ATOZ BOMBAY - CORE GAME ENGINE (v7.2.0 Master - INTEGRATED EDITION)
   ========================================================================== */

const EngineConfig = {
    version: "7.2.0 Master",
    rows: 22,
    cols: 10
};

// গ্লোবাল কনফিগারেশন ও অ্যাডমিন রেশিও গেটওয়ে
window.GameGlobals = {
    playerCommissionRate: 5.0, // ৫% ডাইনামিক সেলস কমিশন
    winningRatioSingle: 9.0,   // সিঙ্গেলে ৯ গুণ রিটার্ন
    winningRatioPatti: 90.0    // পাত্তিতে ৯০ গুণ রিটার্ন
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

// টেবিল জেনারেশন
function generateGameTable(mode = 'Both') {
    gameMode = mode;
    const wrapper = document.getElementById('gameTableWrapper');
    if (!wrapper) return;

    let html = `<table><thead><tr>`;
    
    COLUMNS_DIGIT.forEach((col, index) => {
        let headerText = '';
        if (gameMode === 'Digit') {
            headerText = `Col ${col}`;
        } else if (gameMode === 'Word') {
            headerText = `Col ${COLUMNS_WORD[index]}`;
        } else {
            headerText = `${col} - ${COLUMNS_WORD[index]}`;
        }
        html += `<th>${headerText}</th>`;
    });
    
    html += `</tr></thead><tbody><tr class="single-row-header">`;
    
    COLUMNS_DIGIT.forEach((col, index) => {
        let singleVal = '';
        let displayVal = '';
        
        if (gameMode === 'Digit') {
            singleVal = col;
            displayVal = `${col} <br><small>(Single)</small>`;
        } else if (gameMode === 'Word') {
            singleVal = COLUMNS_WORD[index];
            displayVal = `${COLUMNS_WORD[index]} <br><small>(Single)</small>`;
        } else {
            singleVal = `${col}-${COLUMNS_WORD[index]}`;
            displayVal = `${col} / ${COLUMNS_WORD[index]} <br><small>(Single)</small>`;
        }

        html += `<td class="patti-cell single-cell" data-column="${col}" data-val="${singleVal}" data-type="Single" onclick="selectPattiCell(this)">${displayVal}</td>`;
    });
    html += `</tr>`;

    for (let rowIndex = 0; rowIndex < EngineConfig.rows; rowIndex++) {
        html += `<tr>`;
        COLUMNS_DIGIT.forEach((col) => {
            const pattiValue = GAME_DATABASE[col].patti[rowIndex] || '';
            const wordValue = GAME_DATABASE[col].words[rowIndex] || '';
            
            let displayValue = '';
            if (gameMode === 'Digit') {
                displayValue = pattiValue;
            } else if (gameMode === 'Word') {
                displayValue = wordValue;
            } else {
                displayValue = `<span class="both-pat">${pattiValue}</span><hr style="border:0; border-top:1px dashed rgba(255,255,255,0.15); margin:4px 0;"><span class="both-wrd">${wordValue}</span>`;
            }

            html += `<td class="patti-cell" data-column="${col}" data-patti="${pattiValue}" data-word="${wordValue}" data-type="Patti" onclick="selectPattiCell(this)">${displayValue}</td>`;
        });
        html += `</tr>`;
    }

    html += `</tbody></table>`;
    wrapper.innerHTML = html;
}

// ক্লিক হ্যান্ডলার
function selectPattiCell(cellElement) {
    document.querySelectorAll('.patti-cell').forEach(c => {
        c.classList.remove('selected');
        c.classList.remove('overlimit-red');
    });

    cellElement.classList.add('selected');

    selectedType = cellElement.getAttribute('data-type');
    selectedColumn = cellElement.getAttribute('data-column');

    if (selectedType === 'Single') {
        selectedPatti = cellElement.getAttribute('data-val');
        selectedWord = "N/A";
    } else {
        selectedPatti = cellElement.getAttribute('data-patti');
        selectedWord = cellElement.getAttribute('data-word');
    }

    const displayElement = document.getElementById('selectedPattiDisplay');
    if (displayElement) {
        if (selectedType === 'Single') {
            displayElement.innerHTML = `সিঙ্গেল ঘর: [ ${selectedPatti} ]<br>Est. Win: ${window.GameGlobals.winningRatioSingle}x`;
        } else {
            displayElement.innerHTML = `পাত্তি: [ ${selectedPatti} ]<br>ওয়ার্ড: [ ${selectedWord} ]<br>Est. Win: ${window.GameGlobals.winningRatioPatti}x`;
        }
    }

    runLimitCheck();
}

// লিমিট চেকার (ম্যাক্স ৫ PTS পাত্তি এবং ১০০০ PTS সিঙ্গেল ফিল্ড)
function runLimitCheck() {
    const betInput = document.getElementById('betAmountInput');
    const activeCell = document.querySelector('.patti-cell.selected') || document.querySelector('.patti-cell.overlimit-red');
    if (!betInput || !activeCell) return;

    const val = parseFloat(betInput.value) || 0;
    
    if (selectedType === 'Patti') {
        if (val > 5.0) {
            activeCell.classList.add('overlimit-red');
            activeCell.classList.remove('selected');
        } else {
            activeCell.classList.remove('overlimit-red');
            activeCell.classList.add('selected');
        }
    } else if (selectedType === 'Single') {
        if (val > 1000.0) {
            activeCell.classList.add('overlimit-red');
            activeCell.classList.remove('selected');
        } else {
            activeCell.classList.remove('overlimit-red');
            activeCell.classList.add('selected');
        }
    }
}

// থার্মাল ব্লুটুথ প্রিন্টার রিসিট জেনারেটর
function printThermalReceipt(receiptData) {
    const receiptText = `
--------------------------------
          ATOZ BOMBAY           
--------------------------------
তারিখ: ${receiptData.date || new Date().toLocaleDateString()}
সময়: ${receiptData.time || new Date().toLocaleTimeString()}
প্লেয়ার আইডি: ${receiptData.playerId || 'PLAYER'}
--------------------------------
টাইপ: ${receiptData.type}
টার্গেট ঘর: ${receiptData.target}
বেট অ্যামাউন্ট: ৳${receiptData.points}
সম্ভাব্য রিটার্ন: ৳${receiptData.estWin}
--------------------------------
       ধন্যবাদ এবং শুভকামনা!     
--------------------------------
\n\n`;

    const printWindow = window.open('', '_blank', 'width=300,height=400');
    printWindow.document.write('<pre>' + receiptText + '</pre>');
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
}

// ফায়ারবেস সাবমিশন ইভেন্ট লিঙ্কার
document.addEventListener("DOMContentLoaded", () => {
    generateGameTable('Both');
    
    const betInput = document.getElementById('betAmountInput');
    if (betInput) {
        betInput.addEventListener('input', runLimitCheck);
    }

    const submitBtn = document.getElementById('btnSubmitBet');
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            const betInputEl = document.getElementById('betAmountInput');
            const amt = parseFloat(betInputEl ? betInputEl.value : 0);

            if (!selectedPatti || amt <= 0) {
                alert("অনুগ্রহ করে একটি ঘর সিলেক্ট করুন এবং সঠিক অ্যামাউন্ট বসান!");
                return;
            }

            // লিমিট ক্রস প্রটেকশন চেক
            if (selectedType === 'Patti' && amt > 5.0) {
                alert("ত্রুটি: পাত্তিতে সর্বোচ্চ ৫ PTS পর্যন্ত বেট দেওয়া সম্ভব!");
                return;
            }
            if (selectedType === 'Single' && amt > 1000.0) {
                alert("ত্রুটি: সিঙ্গেলে সর্বোচ্চ ১০০০ PTS পর্যন্ত বেট দেওয়া সম্ভব!");
                return;
            }

            const estWinAmount = selectedType === 'Single' ? amt * window.GameGlobals.winningRatioSingle : amt * window.GameGlobals.winningRatioPatti;

            const betData = {
                type: selectedType,
                target: selectedPatti,
                word: selectedWord,
                points: amt,
                estWin: estWinAmount,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString()
            };

            // লোকাল ডেমো রিসিট প্রিন্ট কল
            printThermalReceipt(betData);
            alert("বেট সফলভাবে সাবমিট ও রিসিট জেনারেট হয়েছে!");
            if (typeof resetSelection === "function") resetSelection();
        });
    }

    // ইনস্ট্যান্ট প্রিন্ট বাটন ডেলিগেশন
    const instantPrintBtn = document.getElementById('btnInstantPrint');
    if (instantPrintBtn) {
        instantPrintBtn.addEventListener('click', () => {
            alert("কোনো অ্যাক্টিভ টিকিট স্লট পাওয়া যায়নি!");
        });
    }
});

window.PlayerEngine = {
    generateTable: generateGameTable,
    print: printThermalReceipt
};
