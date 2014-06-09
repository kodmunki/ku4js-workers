(function(l){
function calculator() { }
calculator.prototype = {
    calculateNumberOfAnswers: function(iteration){
        var answers = $.list(), i = 0;
        while(iteration > i++) {
            var answer = Math.random() * Math.random();
            answers.add(answer);
        }
        return answers;
    }
};

$.calculator = function(){ return new calculator(); };

})();
