$(function() {
    'use strict';

    var $meters = $('.meters'),
        $minutes = $('.minutes'),
        $output = $('.output'),
        $surfaceInterval = $('.surface-interval'),
        $diveTwo = $('.dive-two'),
        $diveTwoOutput = $('.dive-two-output'),
        pressureGroup = '';

    // give the index of the minute value as a number
    // return this as a letter that represents the dive index
    function getPressureGroupByNumber(number) {

        // 65 is the ASCII representation of 'A'
        return String.fromCharCode(number + 65);
    }

    // given the meter and minute, return a letter representing the dive index
    function getPressureGroup(meters, minutes) {

        var minuteArray,
            minuteIndex = 0,
            // update maxMeters as we fill out the diveLookup table
            maxMeters = 42,
            // diveLookup is formatted with a key of meters, and an array of minutes
            // -1 indicates that this level is skipped
            diveLookup = {
                '10': [10, 20, 26, 30, 34, 37, 41, 45, 50, 54, 59, 64, 70, 75, 82, 88, 95, 104, 112, 122, 133, 145, 160, 178, 199, 219],
                '12': [9, 17, 23, 26, 29, 32, 35, 38, 42, 45, 49, 53, 57, 62, 66, 71, 76, 82, 88, 94, 101, 108, 116, 125, 134, 147],
                '14': [8, 15, 19, 22, 24, 27, 29, 32, 35, 37, 40, 43, 47, 50, 53, 57, 61, 64, 68, 73, 77, 82, 87, 92, 98],
                '16': [7, 13, 17, 19, 21, 23, 25, 27, 29, 32, 34, 37, 39, 42, 45, 48, 50, 53, 56, 60, 63, 67, 70, 72],
                '18': [6, 11, 15, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 39, 41, 43, 46, 48, 51, 53, 55, 56],
                '20': [6, 10, 13, 15, 16, 18, 20, 21, 23, 25, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 45],
                '22': [5, 9, 12, 13, 15, 16, 18, 19, 21, 22, 24, 25, 27, 29, 30, 32, 34, 36, 37],
                '25': [4, 8, 10, 11, 13, 14, 15, 17, 18, 19, 21, 22, 23, 25, 26, 28, 29],
                '30': [3, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 20],
                '35': [3, 5, 7, 8, -1, 9, 10, 11, 12, 13, 14],
                '40': [-1, 5, -1, 6, 7, 8, 9],
                '42': [-1, 4, -1, 6, 7, 8]

            };

        if (meters > maxMeters) {
            return false;
        }

        while (meters <= maxMeters) {
            minuteArray = diveLookup[meters];

            if (minuteArray) {
                for (minuteIndex; minuteIndex < minuteArray.length; minuteIndex++) {
                    if (minuteArray[minuteIndex] >= minutes) {
                        return getPressureGroupByNumber(minuteIndex);
                    }
                }
                return 'you have exceeded the maximum number of minutes';
            }

            meters+=1;
        }
    }

    function getSecondPressureGroup(surfaceInterval) {

        var minuteIndex = 0,
            minuteArray = [],
            // This probably isn't the best way to format this, TODO: think about it
            // The dive lookup is a dictionary, each array is the amount of minutes it takes to get to the pressure group in that alphabet slot
            // ie, diveLookup['C'] has the pressure groups for initial pressure group of 'C'.
            // If you stay on the surface for 60 minutes, that is between diveLookup['C'][1] and diveLookup['C'][2],
            // so use the equivalent of '2' in presure group terms... which is 'B'
            diveLookup = {
                'A': [180],
                'B': [228, 47],
                'C': [250, 69, 21],
                'D': [259, 78, 30, 8],
                'E': [268, 87, 38, 16, 7],
                'F': [275, 94, 46, 24, 15, ],
                'G': [282, 101, 53, 31, 22, 13, 6],
                'H': [288, 107, 59, 37, 28, 20, 12, 5],
                'I': [294, 113, 65, 43, 34, 26, 18, 11, 5],
                'J': [300, 119, 71, 49, 40, 31, 24, 17, 11, 5],
                'K': [305, 124, 76, 54, 45, 37, 29, 22, 16, 10, 4],
                'L': [310, 129, 81, 59, 50, 42, 34, 27, 21, 15, 9, 4],
                'M': [315, 134, 85, 64, 55, 46, 39, 32, 25, 19, 14, 9, 4],
                'N': [319, 138, 90, 68, 59, 51, 43, 36, 30, 24, 18, 13, 8, 3],
                'O': [324, 143, 94, 72, 63, 55, 47, 41, 34, 28, 23, 17, 12, 4, 3],
                'P': [328, 147, 98, 76, 67, 59, 51, 45, 38, 32, 27, 21, 16, 12, 7, 3],
                'Q': [331, 150, 102, 80, 71, 63, 55, 48, 42, 36, 30, 25, 20, 16, 11, 7, 3],
                'R': [335, 154, 106, 84, 75, 67, 59, 52, 46, 40, 34, 29, 24, 19, 15, 11, 7, 3],
                'S': [339, 158, 109, 87, 78, 70, 63, 56, 49, 43, 38, 32, 27, 23, 18, 14, 10, 6, 3],
                'T': [342, 161, 113, 91, 82, 73, 66, 59, 53, 47, 41, 36, 31, 26, 22, 17, 13, 10, 6, 2],
                'U': [345, 164, 116, 94, 85, 77, 69, 62, 56, 50, 44, 39, 34, 29, 25, 21, 17, 13, 9, 6, 2],
                'V': [348, 167, 119, 97, 88, 80, 72, 65, 59, 53, 47, 42, 37, 33, 28, 24, 20, 16, 12, 9, 5, 2],
                'W': [351, 170, 122, 100, 91, 83, 75, 68, 62, 56, 50, 45, 40, 36, 31, 27, 23, 19, 15, 12, 8, 5, 2],
                'X': [354, 173, 125, 103, 94, 86, 78, 71, 65, 59, 53, 48, 43, 39, 34, 30, 26, 22, 18, 15, 11, 8, 5, 2],
                'Y': [357, 176, 128, 106, 97, 89, 81, 74, 68, 62, 56, 51, 46, 41, 37, 33, 29, 25, 21, 18, 14, 11, 8, 5, 2],
                'Z': [360, 179, 131, 109, 100, 91, 84, 77, 71, 65, 59, 54, 49, 44, 40, 35, 31, 28, 24, 20, 17, 14, 11, 8, 5, 2]
            };

        minuteArray = diveLookup[pressureGroup];

        if (minuteArray) {
            if (surfaceInterval > minuteArray[0]) {
                return 'you have waited long enough to be out of a pressure group';
            }

            for (minuteIndex; minuteIndex < minuteArray.length; minuteIndex++) {
                if (surfaceInterval >= minuteArray[minuteIndex]) {
                    return getPressureGroupByNumber(minuteIndex - 1);
                }
            }

            return pressureGroup;
        }

        return 'error, we could not find your pressure group';
    }

    // check the inputs for meters and minutes,
    // and update the output div with the value of the pressure group
    function calculate() {
        var meterVal = parseInt($meters.val(), 10),
            minuteVal = parseInt($minutes.val(), 10);

        if (meterVal && minuteVal) {
            pressureGroup = getPressureGroup(meterVal, minuteVal);
            $diveTwo.removeClass('is-hidden');
        }
        else {
            $diveTwo.addClass('is-hidden');
        }

        $output.html(pressureGroup);
        
    }

    function calculateDiveTwo() {
        var surfaceInterval = parseInt($surfaceInterval.val(), 10);
        if (typeof(surfaceInterval) === 'number') {
            $diveTwoOutput.html(getSecondPressureGroup(surfaceInterval));
            $diveTwo.removeClass('is-hidden');
        }
    }

    $('.meters').on('keyup', calculate);
    $('.minutes').on('keyup', calculate);
    $('.surface-interval').on('keyup', calculateDiveTwo);

});
