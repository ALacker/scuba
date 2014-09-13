$(function() {
    'use strict';

    var $meters = $('.meters'),
        $minutes = $('.minutes'),
        $output = $('.output');

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
            maxMeters = 16,
            // diveLookup is formatted with a key of meters, and an array of minutes
            diveLookup = {
                '10': [10, 20, 26, 30, 34, 37, 41, 45, 50, 54, 59, 64, 70, 75, 82, 88, 95, 104, 112, 122, 133, 145, 160, 178, 199, 219],
                '12': [9, 17, 23, 26, 29, 32, 35, 38, 42, 45, 49, 53, 57, 62, 66, 71, 76, 82, 88, 94, 101, 108, 116, 125, 134, 147],
                '14': [8, 15, 19, 22, 24, 27, 29, 32, 35, 37, 40, 43, 47, 50, 53, 57, 61, 64, 68, 73, 77, 82, 87, 92, 98],
                '16': [7, 13, 17, 19, 21, 23, 25, 27, 29, 32, 34, 37, 39, 42, 45, 48, 50, 53, 56, 60, 63, 67, 70, 72]
                // TODO: add the rest of the chart here
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

    // check the inputs for meters and minutes,
    // and update the output div with the value of the pressure group
    function calculate() {
        var meterVal = parseInt($meters.val(), 10),
            minuteVal = parseInt($minutes.val(), 10),
            pressureGroup = '';

        if (meterVal && minuteVal) {
            pressureGroup = getPressureGroup(meterVal, minuteVal);

        }

        $output.html(pressureGroup);
    }

    $('.meters').on('keyup', calculate);
    $('.minutes').on('keyup', calculate);

});
