'use strict';

/*
Put any interaction code here
 */

var removeDataPoint = function(index){};
var redrawBarGraph = function(){};

window.addEventListener('load', function() {

    //initiates models and views
    var model = new ActivityStoreModel();
    var graphModel = new GraphModel();
    var view = new uTrackView();

    //updating view and graph when model changes
    model.addListener(function(activityType, date, activityDataPoint){
        view.updateTable(activityType, date, activityDataPoint);
        view.updateGraph(graphModel.getNameOfCurrentlySelectedGraph(), model.getActivityDataPoints());
    });

    //redaws the canvas bar graph
    redrawBarGraph = function(){
        view.updateGraph('bar graph', model.getActivityDataPoints());
    };

    //removes datapoint from view table
    removeDataPoint = function(row){
      var dataPoints = model.getActivityDataPoints();
      var dataPoint = dataPoints[row.parentNode.rowIndex-1];
      model.removeActivityDataPoint(dataPoint);
    };

    //updating graphs for graphModel
    graphModel.addListener(function(graphName){
        view.updateGraph(graphName, model.getActivityDataPoints());
    });

    // Draw init graph
    graphModel.selectGraph('bar graph');

    //function that validates input and adds error messages
    var validateInput = function(el, err, checkRange){
        el.parentNode.querySelector(":scope > .error").innerHTML = "";
        el.classList.remove("err");
        if(el.value == ""){
          el.classList.add("err");
          err.status = true;
          el.parentNode.querySelector(":scope > .error").innerHTML = "input is mandatory";
        }
        else if(isNaN(el.value)){
          el.classList.add("err");
          err.status = true;
          el.parentNode.querySelector(":scope > .error").innerHTML = "input must be a number";
        }
        else if (checkRange && !(el.value >= 1 && el.value <= 5)){
          el.classList.add("err");
          err.status = true;
          el.parentNode.querySelector(":scope > .error").innerHTML = "input must be within the range";
        }
        else if(!checkRange && el.value < 0){
          el.classList.add("err");
          err.status = true;
          el.parentNode.querySelector(":scope > .error").innerHTML = "time must be greater than 0";
        }
    }

    //toggles between Input view and Analysis view
    var showInput = document.getElementById('show_input');
    var showAnalysis = document.getElementById('show_analysis');
    showInput.addEventListener('click', function(){
        document.getElementById('input_div').style.display="block";
        document.getElementById('analysis_div').style.display="none";
    });
    showAnalysis.addEventListener('click', function(){
        document.getElementById('input_div').style.display="none";
        document.getElementById('analysis_div').style.display="block";
    });

    //toggles between bar graph and table graph
    var switchGraph = document.getElementById('graphSwitch');
    switchGraph.addEventListener('click', function(){
        if(graphModel.getNameOfCurrentlySelectedGraph() === 'bar graph'){
          document.getElementById('graphSwitch').innerHTML = "show bar graph";
          graphModel.selectGraph('table graph');
          document.getElementById('graph_view_bar').style.display="none";
          document.getElementById('graph_view_table').style.display="block";
        }
        else if(graphModel.getNameOfCurrentlySelectedGraph() === 'table graph'){
          document.getElementById('graphSwitch').innerHTML = "show table chart";
          graphModel.selectGraph('bar graph');
          document.getElementById('graph_view_bar').style.display="block";
          document.getElementById('graph_view_table').style.display="none";
        }
    });

    //when submitting data, check for err and updates the time stamp
    var inputSubmitButton = document.getElementById('input_submit');
    inputSubmitButton.addEventListener('click', function() {
        var activity = document.getElementById('activity');
        var energy_level = document.getElementById('energy_level');
        var stress_level = document.getElementById('stress_level');
        var happiness_level = document.getElementById('happiness_level');
        var time_spent = document.getElementById('time_spent');
        var err = {status:false};

        //validates the input data
        validateInput(energy_level, err, true);
        validateInput(stress_level, err, true);
        validateInput(happiness_level, err, true);
        validateInput(time_spent, err, false);

        if(err.status == true){
            view.alertify("Fail");
            return;
        }
        else{
            //if no err occurred, update time stamp
            document.getElementById('time_stamp').innerHTML = "Last Data Entry was : " + new Date();

            var dataPoint = new ActivityData(
              activity.value,
              {energy:energy_level.value,
              stress:stress_level.value,
              happiness:happiness_level.value}, time_spent.value);

            //add data to model
            model.addActivityDataPoint(dataPoint);

            view.alertify("Success");
            energy_level.value = stress_level.value = happiness_level.value = time_spent.value = "";
        }
    });
    generateFakeData(model,100);
});
