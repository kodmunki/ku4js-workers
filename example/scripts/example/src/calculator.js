function calculator() { }
calculator.prototype = {
    calculateNumberOfAnswers: function(iteration){
        var answers = $.list(), i = 0;
        while(iteration > i++) {
            var answer = $.math.round(Math.random() * Math.random() * 10, -5);
            answers.add(answer);
        }
        return answers.toArray();
    }
};

$.calculator = function(){ return new calculator(); };