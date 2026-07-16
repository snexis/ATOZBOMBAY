// ==========================================================================
// ATOZ BOMBAY - GAME ENGINE (v5.6 - DYNAMIC MODES, INTEGRATED VIEWPORT)
// ==========================================================================

// আপনার আসল ২২০টি পাত্তি এবং তার সমপরিমাণ ওয়ার্ড ম্যাপিং ডেটাবেজ (সম্পূর্ণ অপরিবর্তিত)
const GAME_DATABASE = {
    '1': {
        patti: ['100', '678', '777', '560', '470', '380', '290', '119', '137', '236', '146', '669', '579', '399', '588', '489', '245', '155', '227', '344', '335', '128'],
        words: ['AXZ', 'BKP', 'LMO', 'RST', 'TUV', 'WXY', 'NOP', 'ABC', 'EFG', 'HIJ', 'KLM', 'QRS', 'UVW', 'XYZ', 'DEF', 'GHI', 'JKL', 'MNO', 'PQR', 'STU', 'VWX', 'ZAB']
    },
    '2': {
        patti: ['200', '345', '444', '570', '480', '390', '660', '129', '237', '336', '246', '679', '255', '147', '228', '499', '688', '778', '138', '156', '110', '569'],
        words: ['BKP', 'LMO', 'RST', 'TUV', 'WXY', 'NOP', 'ABC', 'EFG', 'HIJ', 'KLM', 'QRS', 'UVW', 'XYZ', 'DEF', 'GHI', 'JKL', 'MNO', 'PQR', 'STU', 'VWX', 'ZAB', 'AXZ']
    },
    '3': {
        patti: ['300', '120', '111', '580', '490', '670', '238', '139', '337', '157', '346', '689', '355', '247', '256', '166', '599', '148', '788', '445', '229', '779'],
        words: ['LMO', 'RST', 'TUV', 'WXY', 'NOP', 'ABC', 'EFG', 'HIJ', 'KLM', 'QRS', 'UVW', 'XYZ', 'DEF', 'GHI', 'JKL', 'MNO', 'PQR', 'STU', 'VWX', 'ZAB', 'AXZ', 'BKP']
    },
    '4': {
        patti: ['400', '789', '888', '590', '130', '680', '248', '149', '347', '158', '446', '699', '455', '266', '112', '356', '239', '338', '257', '220', '770', '167'],
        words: ['RST', 'TUV', 'WXY', 'NOP', 'ABC', 'EFG', 'HIJ', 'KLM', 'QRS', 'UVW', 'XYZ', 'DEF', 'GHI', 'JKL', 'MNO', 'PQR', 'STU', 'VWX', 'ZAB', 'AXZ', 'BKP', 'LMO']
    },
    '5': {
        patti: ['500', '456', '555', '140', '230', '690', '258', '159', '357', '799', '267', '780', '447', '366', '113', '122', '177', '249', '339', '889', '348', '168'],
        words: ['TUV', 'WXY', 'NOP', 'ABC', 'EFG', 'HIJ', 'KLM', 'QRS', 'UVW', 'XYZ', 'DEF', 'GHI', 'JKL', 'MNO', 'PQR', 'STU', 'VWX', 'ZAB', 'AXZ', 'BKP', 'LMO', 'RST']
    },
    '6': {
        patti: ['600', '123', '222', '150', '330', '240', '268', '169', '367', '448', '899', '178', '790', '466', '358', '880', '114', '556', '259', '349', '457', '277'],
        words: ['WXY', 'NOP', 'ABC', 'EFG', 'HIJ', 'KLM', 'QRS', 'UVW', 'XYZ', 'DEF', 'GHI', 'JKL', 'MNO', 'PQR', 'STU', 'VWX', 'ZAB', 'AXZ', 'BKP', 'LMO', 'RST', 'TUV']
    },
    '7': {
        patti: ['700', '890', '999', '160', '340', '250', '278', '179', '377', '467', '115', '124', '223', '566', '557', '368', '359', '449', '269', '133', '188', '458'],
        words: ['NOP', 'ABC', 'EFG', 'HIJ', 'KLM', 'QRS', 'UVW', 'XYZ', 'DEF', 'GHI', 'JKL', 'MNO', 'PQR', 'STU', 'VWX', 'ZAB', 'AXZ', 'BKP', 'LMO', 'RST', 'TUV', 'WXY']
    },
    '8': {
        patti: ['800', '567', '666', '170', '350', '260', '288', '189', '116', '233', '459', '125', '224', '477', '990', '134', '558', '369', '378', '440', '279', '468'],
        words: ['ABC', 'EFG', 'HIJ', 'KLM', 'QRS', 'UVW', 'XYZ', 'DEF', 'GHI', 'JKL', 'MNO', 'PQR', 'STU', 'VWX', 'ZAB', 'AXZ', 'BKP', 'LMO', 'RST', 'TUV', 'WXY', 'NOP']
    },
    '9': {
        patti: ['900', '234', '333', '180', '360', '270', '450', '199', '117', '469', '126', '667', '478', '135', '225', '144', '379', '559', '289', '388', '577', '568'],
        words: ['EFG', 'HIJ', 'KLM', 'QRS', 'UVW', 'XYZ', 'DEF', 'GHI', 'JKL', 'MNO', 'PQR', 'STU', 'VWX', 'ZAB', 'AXZ', 'BKP', 'LMO', 'RST', 'TUV', 'WXY', 'NOP', 'ABC']
    },
    '0': {
        patti: ['000', '127', '190', '280', '370', '460', '550', '235', '118', '578', '145', '479', '668', '299', '334', '488', '389', '226', '569', '677', '136', '244'],
        words: ['HIJ', 'KLM', 'QRS', 'UVW', 'XYZ', 'DEF', 'GHI', 'JKL', 'MNO', 'PQR', 'STU', 'VWX', 'ZAB', 'AXZ', 'BKP', 'LMO', 'RST', 'TUV', 'WXY', 'NOP', 'ABC', 'EFG']
    }
};

// কলাম এবং সিঙ্গেল ম্যাপিং রেফারেন্স
const COLUMNS_DIGIT = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const COLUMNS_WORD = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

// গেমপ্লে স্টেট ট্র্যাকিং ভেরিয়েবল
let selectedPatti = null;
let selectedWord = null;
let selectedColumn = null;
let selectedType = null; 
let gameMode = 'Both';   

/**
 * ১. ডাইনামিকালি গেম টেবিল জেনারেট করার ফাংশন
 */
function generateGameTable(mode = 'Both') {
    gameMode = mode;
    const wrapper = document.getElementById('gameTableWrapper');
    if (!wrapper) return;

    let html = `<table>
                    <thead>
                        <tr>`;
    
    // মোড অনুযায়ী কলাম হেডার
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
    
    html += `   </tr>
                    </thead>
                    <tbody>`;

    // সিঙ্গেল ডিজিট/ওয়ার্ডের বিশেষ রো
    html += `<tr class="single-row-header">`;
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

        html += `<td class="patti-cell single-cell" 
                     data-column="${col}" 
                     data-val="${singleVal}" 
                     data-type="Single"
                     onclick="selectPattiCell(this)">
                     ${displayVal}
                 </td>`;
    });
    html += `</tr>`;

    // ২২টি পাত্তি/ওয়ার্ড রো তৈরি করার লুপ
    for (let rowIndex = 0; rowIndex < 22; rowIndex++) {
        html += `<tr>`;
        COLUMNS_DIGIT.forEach((col, index) => {
            const pattiValue = GAME_DATABASE[col].patti[rowIndex] || '';
            const wordValue = GAME_DATABASE[col].words[rowIndex] || '';
            
            let displayValue = '';
            if (gameMode === 'Digit') {
                displayValue = pattiValue;
            } else if (gameMode === 'Word') {
                displayValue = wordValue;
            } else {
                displayValue = `<span class="both-pat">${pattiValue}</span><hr class="both-split"><span class="both-wrd">${wordValue}</span>`;
            }

            html += `<td class="patti-cell" 
                         data-column="${col}" 
                         data-patti="${pattiValue}" 
                         data-word="${wordValue}" 
                         data-type="Patti"
                         onclick="selectPattiCell(this)">
                         ${displayValue}
                     </td>`;
        });
        html += `</tr>`;
    }

    html += `    </tbody>
                </table>`;
    
    wrapper.innerHTML = html;
}

/**
 * ২. প্লেয়ারের ক্লিক হ্যান্ডল করার ফাংশন
 */
function selectPattiCell(cellElement) {
    const previouslySelected = document.querySelector('.patti-cell.selected');
    if (previouslySelected) {
        previouslySelected.classList.remove('selected');
    }

    // যদি এটি আগে থেকেই ওভারলিমিট লাল হয়ে থাকে, তবে ক্লিক করার সাথে সাথে রিসেট করা হবে
    cellElement.classList.remove('overlimit-red');
    cellElement.classList.add('selected');

    // ডাটা রিসিভ করা
    selectedType = cellElement.getAttribute('data-type');
    selectedColumn = cellElement.getAttribute('data-column');

    if (selectedType === 'Single') {
        selectedPatti = cellElement.getAttribute('data-val');
        selectedWord = "N/A";
    } else {
        selectedPatti = cellElement.getAttribute('data-patti');
        selectedWord = cellElement.getAttribute('data-word');
    }

    // স্ক্রিনে ডিসপ্লে আপডেট
    const displayElement = document.getElementById('selectedPattiDisplay');
    if (displayElement) {
        if (selectedType === 'Single') {
            displayElement.innerHTML = `<span class="badge-single">সিঙ্গেল ঘর: [ ${selectedPatti} ] (কলাম ${selectedColumn})</span>`;
        } else {
            displayElement.innerHTML = `<span class="badge-patti">পাত্তি: [ ${selectedPatti} ] | ওয়ার্ড: [ ${selectedWord} ] (কলাম ${selectedColumn})</span>`;
        }
    }

    // ঘর বদলানোর সাথে সাথে কারেন্ট ইনপুটের লিমিট ইনস্ট্যান্ট রি-চেক করা
    runLimitCheck();
}

/**
 * ৩. প্লেয়ারের বাজেট ও লাল ওয়ার্নিং চেক করার কোর লজিক
 */
function runLimitCheck() {
    const betInput = document.getElementById('betAmountInput');
    const activeCell = document.querySelector('.patti-cell.selected') || document.querySelector('.patti-cell.overlimit-red');
    if (!betInput || !activeCell) return;

    const val = parseFloat(betInput.value) || 0;
    
    if (selectedType === 'Patti') {
        // পাত্তিতে সর্বোচ্চ ৫ টাকা লিমিট
        if (val > 5.0) {
            activeCell.classList.add('overlimit-red');
            activeCell.classList.remove('selected');
        } else {
            activeCell.classList.remove('overlimit-red');
            activeCell.classList.add('selected');
        }
    } else if (selectedType === 'Single') {
        // সিঙ্গেলের বেলায় সর্বোচ্চ ১০০০ টাকা লিমিট
        if (val > 1000.0) {
            activeCell.classList.add('overlimit-red');
            activeCell.classList.remove('selected');
        } else {
            activeCell.classList.remove('overlimit-red');
            activeCell.classList.add('selected');
        }
    }
}

/**
 * ৪. থার্মাল প্রিন্টার ড্রাইভার সাপোর্ট (USB / Bluetooth)
 */
function printThermalReceipt(receiptData) {
    if (!window.printAllowedByAdmin) {
        console.log("প্রিন্ট অপশন অ্যাডমিন দ্বারা অফ করা রয়েছে।");
        return;
    }

    const receiptText = `
--------------------------------
          ATOZ BOMBAY           
--------------------------------
তারিখ: ${receiptData.date}
সময়: ${receiptData.time}
প্লেয়ার আইডি: ${receiptData.playerId}
--------------------------------
টাইপ: ${receiptData.type}
ঘর: ${receiptData.target}
পয়েন্ট: ${receiptData.points} PTS
--------------------------------
     ধন্যবাদ এবং শুভকামনা!     
--------------------------------
\n\n`;

    if (navigator.bluetooth) {
        console.log("Bluetooth Thermal printing initiating...", receiptText);
    } else {
        const printWindow = window.open('', '_blank', 'width=300,height=400');
        printWindow.document.write('<pre>' + receiptText + '</pre>');
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
    }
}

/**
 * ৫. গ্লোবাল ইভেন্ট লিসেনার ইনিশিয়ালাইজেশন (মেমোরি লিক প্রোটেকশন সহ)
 */
document.addEventListener("DOMContentLoaded", () => {
    // টেবিল তৈরি
    generateGameTable('Both');

    // ইনপুট ফিল্ডে একবারই গ্লোবাল লিসেনার সেট করা হচ্ছে
    const betInput = document.getElementById('betAmountInput');
    if (betInput) {
        betInput.addEventListener('input', runLimitCheck);
    }
});
