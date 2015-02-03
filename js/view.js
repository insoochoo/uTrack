'use strict';

// Put your view code here (e.g., the graph renderering code)

var uTrackView = function () {

};

_.extend(uTrackView.prototype, {
  updateTable: function (activityType, date, activityDataPoint){
    if (activityType === 'ACTIVITY_DATA_ADDED_EVENT'){
      //adds the duration
      document.getElementById(activityDataPoint.activityType).innerHTML = parseInt(document.getElementById(activityDataPoint.activityType).innerHTML) + parseInt(activityDataPoint.activityDurationInMinutes);
    }
    else if (activityType === 'ACTIVITY_DATA_REMOVED_EVENT'){
      //subtracts the duration
      document.getElementById(activityDataPoint.activityType).innerHTML = parseInt(document.getElementById(activityDataPoint.activityType).innerHTML) - parseInt(activityDataPoint.activityDurationInMinutes);
    }
  },
  alertify : function(type){
    var styling;
    if (type === "Success"){
      styling = "1px solid #09FF00";

    }
    else if (type === "Fail"){
      styling = "1px solid red";
    }
    //changes the border for 1 second
    document.querySelector("#input_div").style.border = styling;
    setTimeout(function(){
      document.querySelector("#input_div").style.border = "";
    },1000);
  },
  updateGraph : function(graphName, dataPoints) {
    //analyze datapoints here
    if(graphName === 'table graph'){
      var map = {
        wc : "Writing code",
        ed : "Eating dinner",
        ps : "Playing sports",
        se : "Studying for exams",
        al : "Attending lecture",
        wt : "Watching tv"
      }
      var table = document.getElementById("graph_data");
      //initiates the table html
      var str = "<tbody><tr><td>Activity</td><td>Energy level</td><td>Stress level</td><td>Happiness level</td><td>Duration</td><td></td>";
      //dynamically adds rows with detailed data
      for(var i = 0; i < dataPoints.length; i++){
        str += "<tr>";
        str += "<td>" + map[dataPoints[i].activityType] + "</td>";
        str += "<td>" + dataPoints[i].activityDataDict.energy + "</td>";
        str += "<td>" + dataPoints[i].activityDataDict.stress + "</td>";
        str += "<td>" + dataPoints[i].activityDataDict.happiness + "</td>";
        str += "<td>" + dataPoints[i].activityDurationInMinutes + "</td>";
        str += "<td onclick='removeDataPoint(this)'> Delete </td>";
        str += "</tr>";
      }
      str += "</tbody>";
      table.innerHTML = str;
    }
    else if(graphName === 'bar graph'){
      var canvas = document.getElementById('bar_graph');

      var width = canvas.width = 625;
      var height = canvas.height = 350;
      //initiate canvas with width x height

      var dataSummary = {
          wc:{energy:{avg:0,count:0},stress:{avg:0,count:0},happiness:{avg:0,count:0}},
          ed:{energy:{avg:0,count:0},stress:{avg:0,count:0},happiness:{avg:0,count:0}},
          ps:{energy:{avg:0,count:0},stress:{avg:0,count:0},happiness:{avg:0,count:0}},
          se:{energy:{avg:0,count:0},stress:{avg:0,count:0},happiness:{avg:0,count:0}},
          al:{energy:{avg:0,count:0},stress:{avg:0,count:0},happiness:{avg:0,count:0}},
          wt:{energy:{avg:0,count:0},stress:{avg:0,count:0},happiness:{avg:0,count:0}}
      };

      //for each dataPoint, calculate the average level value
      for(var i = 0; i < dataPoints.length; i++){
          var point = dataSummary[dataPoints[i].activityType];
          var avg; var count;

          if(document.getElementById('el_checkbox').checked){
            avg = point.energy.avg;
            count = point.energy.count;
            point.energy.avg = (parseFloat(avg) * parseFloat(count) + parseFloat(dataPoints[i].activityDataDict.energy))/(parseInt(count+1));
            point.energy.count++;
          }

          if(document.getElementById('sl_checkbox').checked){
            avg = point.stress.avg;
            count = point.stress.count;
            point.stress.avg = (parseFloat(avg) * parseFloat(count) + parseFloat(dataPoints[i].activityDataDict.stress))/(parseInt(count+1));
            point.stress.count++;
          }

          if(document.getElementById('hl_checkbox').checked){
            avg = point.happiness.avg;
            count = point.happiness.count;
            point.happiness.avg = (parseFloat(avg) * parseFloat(count) + parseFloat(dataPoints[i].activityDataDict.happiness))/(parseInt(count+1));
            point.happiness.count++;
          }
      }

      var data = new Array(18);
      data[0] = dataSummary.wc.energy.avg;
      data[1] = dataSummary.wc.stress.avg;
      data[2] = dataSummary.wc.happiness.avg;
      data[3] = dataSummary.ed.energy.avg;
      data[4] = dataSummary.ed.stress.avg;
      data[5] = dataSummary.ed.happiness.avg;
      data[6] = dataSummary.ps.energy.avg;
      data[7] = dataSummary.ps.stress.avg;
      data[8] = dataSummary.ps.happiness.avg;
      data[9] = dataSummary.se.energy.avg;
      data[10] = dataSummary.se.stress.avg;
      data[11] = dataSummary.se.happiness.avg;
      data[12] = dataSummary.al.energy.avg;
      data[13] = dataSummary.al.stress.avg;
      data[14] = dataSummary.al.happiness.avg;
      data[15] = dataSummary.wt.energy.avg;
      data[16] = dataSummary.wt.stress.avg;
      data[17] = dataSummary.wt.happiness.avg;

      this.drawBarChart(canvas, data);
    }
  },

  drawBarChart : function(canvas, data){
      //initiating necessary variables
      var context = canvas.getContext('2d');
      var graphHeight = canvas.height - 20;
      var barWidth = (canvas.width-40)/18;
      var startX = 20;
      var startY = 380;

      //draws the x-axis and y-axis
      this.line(context, startX, startY-50, startX, 30);
      this.line(context, startX, startY, 570, startY);

      //writes the column values from 0 ~ 5
      for (var i=0; i < 6; i++) {
        context.fillText(i, (startX - 10), (graphHeight - i*graphHeight/6));
      }

      //draws the bar graphs
      for (var i=0; i < data.length; i++) {
        //calculates the barHeight using the graphHeight
        var barHeight = (graphHeight/6) * (data[i]);

        //sets different colors for different values
        if(i%3 === 0){context.fillStyle = "#EEBA4C"}
        else if(i%3 === 1){context.fillStyle = "#E3493B"}
        else{context.fillStyle = "#23B5AF"}

        //actually drawing the bar graphs
        context.beginPath();
        context.rect(startX + (i * barWidth) + i, (graphHeight - barHeight), barWidth, barHeight);
        context.closePath();
        context.stroke();
        context.fill();

        //types the value of the bar graph below the bar
        context.fillText(parseFloat(data[i]).toFixed(2), startX + (i * barWidth) + i + 5, graphHeight + 10);
      }


  },

  //drawing line function takes in two coordinates (x1, y1) and (x2, y2)
  line : function(c, x1, y1, x2, y2) {
    c.beginPath();
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.closePath();
    c.stroke();
  }

});
