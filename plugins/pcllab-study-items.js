/**
 * jsPsych plugin for showing a list of words or images
 * Mehran Einakchi
 */

/**
 * @name Study Items
 * @param {array} stimuli - Each element of the array is either another array of strings or a string which is a word or a path to an image.
 * @param {number=} [frame_time=250] - How long to display each item or items (in milliseconds).
 * @param {number=} [blank_time=0] - If greater than 0, then a gap will be shown between each item/items in the sequence. This parameter specifies the length of the gap.
 */

jsPsych.plugins["study-items"] = (function () {

    var plugin = {};

    jsPsych.pluginAPI.registerPreload('study-items', 'stimuli', 'image');

    plugin.trial = function (display_element, trial) {

        // set default values for parameters
        trial.frame_time = trial.frame_time || 250;
        trial.blank_time = trial.blank_time || 0;

        trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);


        var animateFrame = -1;
        var intervalTime = trial.frame_time + trial.blank_time;
        var startTime = (new Date()).getTime();
        var containerId = 'study-items-container';

        var animationData = [];

        var animateInterval = null;

        function repeat() {
            var showImage = true;
            display_element.html(""); // clear everything
            animateFrame++;
            if (animateFrame == trial.stimuli.length) {

                clearInterval(animateInterval);
                showImage = false;
                var trialData = {
                    "study_sequence": JSON.stringify(animationData)
                };
                jsPsych.finishTrial(trialData);
            }
            if (showImage) {
                showNextFrame();
            }
            if (!animateInterval) {
                animateInterval = setInterval(repeat, intervalTime);
            }
        }

        repeat();

        function showNextFrame() {

            var current = trial.stimuli[animateFrame];
            animationData.push({
                "stimuli": current,
                "time": (new Date()).getTime() - startTime
            });
            showEntity(current);

            if (trial.blank_time > 0) {
                setTimeout(function() {
                    $('#'+ containerId).css('visibility', 'hidden');
                    animationData.push({
                        "stimuli": "blank",
                        "time": (new Date()).getTime() - startTime
                    });
                }, trial.frame_time);
            }
        }

        function showEntity(current) {


            display_element.html($('<div></div>', {
                'id': containerId
            }));

            if (!Array.isArray(current)) {
                current = Array(current);
            }

            for (var i = 0; i < current.length; i++) {
                var item = current[i];
                if (isImage(item)) {
                    $('#' + containerId).append($('<img>', {
                        'src': item
                    }));
                } else {
                    $('#' + containerId).append($('<p>' + item + '</p>'));
                }
            }

        }


        function isImage(input) {
            var comps = input.split('.');
            if (comps.length == 1) {
                return false;
            }
            var extension = comps[comps.length - 1].toLowerCase();
            if ( extension == "jpg" || extension == "png" || extension == "jpeg" || extension == "gif" ) {
                return true;
            }
            return false;
        }


    };

    return plugin;
})();
