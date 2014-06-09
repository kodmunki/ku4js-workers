function calculator() { }
calculator.prototype = {
    calculateNumberOfAnswers: function(iteration){
        var answers = $.list(), i = 0, value = 0;
        while(iteration > i++) {
            var answer = $.math.round(Math.random() * Math.random() * 10, -5);
            answers.add(answer);
        }
        answers.each(function(item){
            return value += item
        });
        return $.math.round(value, -3);
    }
};

$.calculator = function(){ return new calculator(); };