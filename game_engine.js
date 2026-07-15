// ==========================================================================
// ATOZ BOMBAY - FINAL GAME DATA MAPPING (v4.9)
// ==========================================================================

// ১. আপনার দেওয়া চূড়ান্ত ২২০টি ডিজিট পাত্তি (১০টি কলাম, প্রতিটিতে ২২টি)
const PATTI_DATA = {
    '১': ['100', '678', '777', '560', '470', '380', '290', '119', '137', '236', '146', '669', '579', '399', '588', '489', '245', '155', '227', '344', '335', '128'],
    '২': ['200', '345', '444', '570', '480', '390', '660', '129', '237', '336', '246', '679', '255', '147', '228', '499', '688', '778', '138', '156', '110', '569'],
    '৩': ['300', '120', '111', '580', '490', '670', '238', '139', '337', '157', '346', '689', '355', '247', '256', '166', '599', '148', '788', '445', '229', '779'],
    '৪': ['400', '789', '888', '590', '130', '680', '248', '149', '347', '158', '446', '699', '455', '266', '112', '356', '239', '338', '257', '220', '770', '167'],
    '৫': ['500', '456', '555', '140', '230', '690', '258', '159', '357', '799', '267', '780', '447', '366', '113', '122', '177', '249', '339', '889', '348', '168'],
    '৬': ['600', '123', '222', '150', '330', '240', '268', '169', '367', '448', '899', '178', '790', '466', '358', '880', '114', '556', '259', '349', '457', '277'],
    '৭': ['700', '890', '999', '160', '340', '250', '278', '179', '377', '467', '115', '124', '223', '566', '557', '368', '359', '449', '269', '133', '188', '458'],
    '৮': ['800', '567', '666', '170', '350', '260', '288', '189', '116', '233', '459', '125', '224', '477', '990', '134', '558', '369', '378', '440', '279', '468'],
    '৯': ['900', '234', '333', '180', '360', '270', '450', '199', '117', '469', '126', '667', '478', '135', '225', '144', '379', '559', '289', '388', '577', '568'],
    '০': ['000', '127', '190', '280', '370', '460', '550', '235', '118', '578', '145', '479', '668', '299', '334', '488', '389', '226', '569', '677', '136', '244']
};

// ২. আপনার দেওয়া ১০টি কলামের চূড়ান্ত ২২০টি শব্দ ম্যাপিং (A-J)
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

// ৩. ফাইনাল ও ত্রুটিমুক্ত বোথ ম্যাপিং (Digit <--> Word)
// এটি সম্পূর্ণ স্বয়ংক্রিয়ভাবে PATTI_DATA এবং WORD_MAPPING এর ইনডেক্স অনুযায়ী তৈরি করা হয়েছে
const BOTH_MAPPING = {
    '১': [
        { pat: '100', wrd: 'AXZ' }, { pat: '678', wrd: 'BKP' }, { pat: '777', wrd: 'LMO' }, { pat: '560', wrd: 'RST' },
        { pat: '470', wrd: 'TUV' }, { pat: '380', wrd: 'WXY' }, { pat: '290', wrd: 'NOP' }, { pat: '119', wrd: 'ABC' },
        { pat: '137', wrd: 'EFG' }, { pat: '236', wrd: 'HIJ' }, { pat: '146', wrd: 'KLM' }, { pat: '669', wrd: 'QRS' },
        { pat: '579', wrd: 'UVW' }, { pat: '399', wrd: 'XYZ' }, { pat: '588', wrd: 'DEF' }, { pat: '489', wrd: 'GHI' },
        { pat: '245', wrd: 'JKL' }, { pat: '155', wrd: 'MNO' }, { pat: '227', wrd: 'PQR' }, { pat: '344', wrd: 'STU' },
        { pat: '335', wrd: 'VWX' }, { pat: '128', wrd: 'ZAB' }
    ],
    '২': [
        { pat: '200', wrd: 'BCA' }, { pat: '345', wrd: 'CAB' }, { pat: '444', wrd: 'DAB' }, { pat: '570', wrd: 'DAC' },
        { pat: '480', wrd: 'EAC' }, { pat: '390', wrd: 'FAD' }, { pat: '660', wrd: 'GAD' }, { pat: '129', wrd: 'HAD' },
        { pat: '237', wrd: 'JAD' }, { pat: '336', wrd: 'KAD' }, { pat: '246', wrd: 'LAD' }, { pat: '679', wrd: 'MAD' },
        { pat: '255', wrd: 'NAD' }, { pat: '147', wrd: 'PAD' }, { pat: '228', wrd: 'RAD' }, { pat: '499', wrd: 'SAD' },
        { pat: '688', wrd: 'TAD' }, { pat: '778', wrd: 'VAD' }, { pat: '138', wrd: 'WAD' }, { pat: '156', wrd: 'YAD' },
        { pat: '110', wrd: 'ZAD' }, { pat: '569', wrd: 'BAG' }
    ],
    '৩': [
        { pat: '300', wrd: 'CAG' }, { pat: '120', wrd: 'DAG' }, { pat: '111', wrd: 'EAG' }, { pat: '580', wrd: 'FAG' },
        { pat: '490', wrd: 'GAG' }, { pat: '670', wrd: 'HAG' }, { pat: '238', wrd: 'JAG' }, { pat: '139', wrd: 'KAG' },
        { pat: '337', wrd: 'LAG' }, { pat: '157', wrd: 'MAG' }, { pat: '346', wrd: 'NAG' }, { pat: '689', wrd: 'PAG' },
        { pat: '355', wrd: 'RAG' }, { pat: '247', wrd: 'SAG' }, { pat: '256', wrd: 'TAG' }, { pat: '166', wrd: 'VAG' },
        { pat: '599', wrd: 'WAG' }, { pat: '148', wrd: 'YAG' }, { pat: '788', wrd: 'ZAG' }, { pat: '445', wrd: 'BAK' },
        { pat: '229', wrd: 'CAK' }, { pat: '779', wrd: 'DAK' }
    ],
    '৪': [
        { pat: '400', wrd: 'EAK' }, { pat: '789', wrd: 'FAK' }, { pat: '888', wrd: 'GAK' }, { pat: '590', wrd: 'HAK' },
        { pat: '130', wrd: 'JAK' }, { pat: '680', wrd: 'KAK' }, { pat: '248', wrd: 'LAK' }, { pat: '149', wrd: 'MAK' },
        { pat: '347', wrd: 'NAK' }, { pat: '158', wrd: 'PAK' }, { pat: '446', wrd: 'RAK' }, { pat: '699', wrd: 'SAK' },
        { pat: '455', wrd: 'TAK' }, { pat: '266', wrd: 'VAK' }, { pat: '112', wrd: 'WAK' }, { pat: '356', wrd: 'YAK' },
        { pat: '239', wrd: 'ZAK' }, { pat: '338', wrd: 'BAL' }, { pat: '257', wrd: 'CAL' }, { pat: '220', wrd: 'DAL' },
        { pat: '770', wrd: 'EAL' }, { pat: '167', wrd: 'FAL' }
    ],
    '৫': [
        { pat: '500', wrd: 'GAL' }, { pat: '456', wrd: 'HAL' }, { pat: '555', wrd: 'JAL' }, { pat: '140', wrd: 'KAL' },
        { pat: '230', wrd: 'LAL' }, { pat: '690', wrd: 'MAL' }, { pat: '258', wrd: 'NAL' }, { pat: '159', wrd: 'PAL' },
        { pat: '357', wrd: 'RAL' }, { pat: '799', wrd: 'SAL' }, { pat: '267', wrd: 'TAL' }, { pat: '780', wrd: 'VAL' },
        { pat: '447', wrd: 'WAL' }, { pat: '366', wrd: 'YAL' }, { pat: '113', wrd: 'ZAL' }, { pat: '122', wrd: 'BAM' },
        { pat: '177', wrd: 'CAM' }, { pat: '249', wrd: 'DAM' }, { pat: '339', wrd: 'EAM' }, { pat: '889', wrd: 'FAM' },
        { pat: '348', wrd: 'GAM' }, { pat: '168', wrd: 'HAM' }
    ],
    '৬': [
        { pat: '600', wrd: 'JAM' }, { pat: '123', wrd: 'KAM' }, { pat: '222', wrd: 'LAM' }, { pat: '150', wrd: 'MAM' },
        { pat: '330', wrd: 'NAM' }, { pat: '240', wrd: 'PAM' }, { pat: '268', wrd: 'RAM' }, { pat: '169', wrd: 'SAM' },
        { pat: '367', wrd: 'TAM' }, { pat: '448', wrd: 'VAM' }, { pat: '899', wrd: 'WAM' }, { pat: '178', wrd: 'YAM' },
        { pat: '790', wrd: 'ZAM' }, { pat: '466', wrd: 'BAN' }, { pat: '358', wrd: 'CAN' }, { pat: '880', wrd: 'DAN' },
        { pat: '114', wrd: 'EAN' }, { pat: '556', wrd: 'FAN' }, { pat: '259', wrd: 'GAN' }, { pat: '349', wrd: 'HAN' },
        { pat: '457', wrd: 'JAN' }, { pat: '277', wrd: 'KAN' }
    ],
    '৭': [
        { pat: '700', wrd: 'LAN' }, { pat: '890', wrd: 'MAN' }, { pat: '999', wrd: 'NAN' }, { pat: '160', wrd: 'PAN' },
        { pat: '340', wrd: 'RAN' }, { pat: '250', wrd: 'SAN' }, { pat: '278', wrd: 'TAN' }, { pat: '179', wrd: 'VAN' },
        { pat: '377', wrd: 'WAN' }, { pat: '467', wrd: 'YAN' }, { pat: '115', wrd: 'ZAN' }, { pat: '124', wrd: 'BAP' },
        { pat: '223', wrd: 'CAP' }, { pat: '566', wrd: 'DAP' }, { pat: '557', wrd: 'EAP' }, { pat: '368', wrd: 'FAP' },
        { pat: '359', wrd: 'GAP' }, { pat: '449', wrd: 'HAP' }, { pat: '269', wrd: 'JAP' }, { pat: '133', wrd: 'KAP' },
        { pat: '188', wrd: 'LAP' }, { pat: '458', wrd: 'MAP' }
    ],
    '৮': [
        { pat: '800', wrd: 'NAP' }, { pat: '567', wrd: 'PAP' }, { pat: '666', wrd: 'RAP' }, { pat: '170', wrd: 'SAP' },
        { pat: '350', wrd: 'TAP' }, { pat: '260', wrd: 'VAP' }, { pat: '288', wrd: 'WAP' }, { pat: '189', wrd: 'YAP' },
        { pat: '116', wrd: 'ZAP' }, { pat: '233', wrd: 'BAR' }, { pat: '459', wrd: 'CAR' }, { pat: '125', wrd: 'DAR' },
        { pat: '224', wrd: 'EAR' }, { pat: '477', wrd: 'FAR' }, { pat: '990', wrd: 'GAR' }, { pat: '134', wrd: 'HAR' },
        { pat: '558', wrd: 'JAR' }, { pat: '369', wrd: 'KAR' }, { pat: '378', wrd: 'LAR' }, { pat: '440', wrd: 'MAR' },
        { pat: '279', wrd: 'NAR' }, { pat: '468', wrd: 'PAR' }
    ],
    '৯': [
        { pat: '900', wrd: 'RAR' }, { pat: '234', wrd: 'SAR' }, { pat: '333', wrd: 'TAR' }, { pat: '180', wrd: 'VAR' },
        { pat: '360', wrd: 'WAR' }, { pat: '270', wrd: 'YAR' }, { pat: '450', wrd: 'ZAR' }, { pat: '199', wrd: 'BAS' },
        { pat: '117', wrd: 'CAS' }, { pat: '469', wrd: 'DAS' }, { pat: '126', wrd: 'EAS' }, { pat: '667', wrd: 'FAS' },
        { pat: '478', wrd: 'GAS' }, { pat: '135', wrd: 'HAS' }, { pat: '225', wrd: 'JAS' }, { pat: '144', wrd: 'KAS' },
        { pat: '379', wrd: 'LAS' }, { pat: '559', wrd: 'MAS' }, { pat: '289', wrd: 'NAS' }, { pat: '388', wrd: 'PAS' },
        { pat: '577', wrd: 'RAS' }, { pat: '568', wrd: 'SAS' }
    ],
    '০': [
        { pat: '000', wrd: 'TAS' }, { pat: '127', wrd: 'VAS' }, { pat: '190', wrd: 'WAS' }, { pat: '280', wrd: 'YAS' },
        { pat: '370', wrd: 'ZAS' }, { pat: '460', wrd: 'BAT' }, { pat: '550', wrd: 'CAT' }, { pat: '235', wrd: 'DAT' },
        { pat: '118', wrd: 'EAT' }, { pat: '578', wrd: 'FAT' }, { pat: '145', wrd: 'GAT' }, { pat: '479', wrd: 'HAT' },
        { pat: '668', wrd: 'JAT' }, { pat: '299', wrd: 'KAT' }, { pat: '334', wrd: 'LAT' }, { pat: '488', wrd: 'MAT' },
        { pat: '389', wrd: 'NAT' }, { pat: '226', wrd: 'PAT' }, { pat: '569', wrd: 'RAT' }, { pat: '677', wrd: 'SAT' },
        { pat: '136', wrd: 'TAT' }, { pat: '244', wrd: 'VAT' }
    ]
};




// ==========================================================================
// GAME ENGINE - COMPLETE 220 PATTI & WORD MAPPING SYSTEM (v5.0)
// ==========================================================================

// আপনার চূড়ান্ত ২২০টি পাত্তি এবং তার সমপরিমাণ ওয়ার্ড ম্যাপিং ডেটাবেজ
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

// গেমপ্লে স্টেট ট্র্যাকিং ভেরিয়েবল
let selectedPatti = null;
let selectedWord = null;
let selectedColumn = null;

/**
 * ১. ২২×১০ গেম টেবিলটি ডাইনামিকালি জেনারেট করার ফাংশন
 */
function generateGameTable() {
    const wrapper = document.getElementById('gameTableWrapper');
    if (!wrapper) return;

    let html = `<table>
                    <thead>
                        <tr>`;
    
    // টেবিল হেডার তৈরি (১ থেকে ০ কলাম)
    const columns = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    columns.forEach(col => {
        html += `<th>Col ${col}</th>`;
    });
    
    html += `   </tr>
                    </thead>
                    <tbody>`;

    // ২২টি রো (Row) তৈরি করার লুপ
    for (let rowIndex = 0; rowIndex < 22; rowIndex++) {
        html += `<tr>`;
        columns.forEach(col => {
            const pattiValue = GAME_DATABASE[col].patti[rowIndex] || '';
            const wordValue = GAME_DATABASE[col].words[rowIndex] || '';
            
            // প্রতিটি সেলে পাত্তি এবং তার ব্যাকএন্ড ওয়ার্ড অ্যাসোসিয়েট করে রাখা হচ্ছে
            html += `<td class="patti-cell" 
                         data-column="${col}" 
                         data-patti="${pattiValue}" 
                         data-word="${wordValue}" 
                         onclick="selectPattiCell(this)">
                        ${pattiValue}
                     </td>`;
        });
        html += `</tr>`;
    }

    html += `    </tbody>
                </table>`;
    
    wrapper.innerHTML = html;
}

/**
 * ২. প্লেয়ারের ক্লিক হ্যান্ডল করার ফাংশন
 * @param {HTMLElement} cellElement 
 */
function selectPattiCell(cellElement) {
    // আগে কোনো সেল সিলেক্ট করা থাকলে সেটির ক্লাস রিমুভ করা
    const previouslySelected = document.querySelector('.patti-cell.selected');
    if (previouslySelected) {
        previouslySelected.classList.remove('selected');
    }

    // কারেন্ট সেলে 'selected' ক্লাস অ্যাড করা (CSS দিয়ে এটি সবুজ দেখাবে)
    cellElement.classList.add('selected');

    // স্টেট আপডেট করা
    selectedPatti = cellElement.getAttribute('data-patti');
    selectedWord = cellElement.getAttribute('data-word');
    selectedColumn = cellElement.getAttribute('data-column');

    // ড্যাশবোর্ডে কোন পাত্তি এবং তার সমমানের ওয়ার্ড সিলেক্ট হয়েছে তা দেখানো
    const displayElement = document.getElementById('selectedPattiDisplay');
    if (displayElement) {
        displayElement.innerText = `Col ${selectedColumn} -> Patti: [ ${selectedPatti} ] | Word: [ ${selectedWord} ]`;
    }
}

// ৩. পেজ ডম (DOM) পুরোপুরি লোড হলে টেবিল জেনারেট করা
document.addEventListener("DOMContentLoaded", () => {
    generateGameTable();
});
