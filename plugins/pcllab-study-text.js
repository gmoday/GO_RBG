/**
 * @name Study Text
 *
 * @param {string} [url=texts.json] - Path to the file containing the json of all texts used in the experiment, the root
 * should be an object containing objects with properties title and text. For a sample see
 * https://github.com/PCLLAB/Framework/blob/master/tests/texts.json
 * @param {number} [minimum_time=1000*60] - How long to wait to show the advance button (in milliseconds).
 * @param {string} [label] - The label of the specific text from the json file.
 *
 * @desc Put all the texts required by your experiment in the a json file and reference it by the url and index.
 *
 * @data {"study_text_time":45002, "study_text_title":"the text title", "study_text_label":"label1"}
 *
 * @author Mehran Einakchi https://github.com/LOG67
 */

jsPsych.plugins["pcllab-study-text"] = (function () {

    var plugin = {};

    plugin.trial = function (display_element, trial) {

        // set default values for parameters
        trial.minimum_time = trial.minimum_time || 1000 * 60;
        trial.url = trial.url || "texts.json";

        trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

        if (!jsPsych.userInfo) {
            jsPsych.userInfo = {};
        }

        if (!jsPsych.userInfo.texts) {
            $.getJSON(trial.url, function (data) {
                jsPsych.userInfo.texts = data;
                show();
            });
        } else {

            show();
        }

        function show() {
            var startTime = (new Date()).getTime();
            var title = jsPsych.userInfo.texts[trial.label].title;

            display_element.append("<h2>" + title + "</h2><br>");
            display_element.append("<div>" + jsPsych.userInfo.texts[trial.label].text + "</div><br>");
            display_element.append('<div class="progress" style="margin-top: 15px; height: 26px;">' + //progress bar
                '<div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuenow="100" aria-valuemax="100" style="width: 100%">' +
                '</div>');
            display_element.append('<button class="btn btn-primary btn-lg pcllab-button-center" style="display: none">Continue</button>');
            $(".btn").click(function () {
                display_element.html("");
                jsPsych.finishTrial({
                    study_text_time: (new Date()).getTime() - startTime,
                    study_text_title: title,
                    study_text_label: trial.label
                });

            });

            var timeSpent = trial.minimum_time;
            var timerInterval = setInterval(function () {
                timeSpent -= 100;
                if (timeSpent <= 0) {
                    clearInterval(timerInterval);
                    $(".progress").css('display', 'none');
                    $(".btn").css('display', 'block');
                    return;
                }

                var newValue = Math.round((timeSpent / trial.minimum_time) * 100);
                $("div.progress-bar").css('width', newValue + '%');
                $("div.progress-bar").prop('aria-valuenow', newValue);
            }, 100);


        }
    };


    return plugin;
})();
