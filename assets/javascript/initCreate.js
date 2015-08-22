var app = angular.module("createDap", ["firebase"]);

$(document).ready(function(){

    /* do jQuery/Javascript */
    var firebaseURL = "https://availa.firebaseio.com/sessions/-JcTpEjZETQx6cO58EaD"
    initialize_calendar(null, 2, 2015, 5);


    // app.controller("SampleCtrl", function($scope, $firebaseArray) {
    //   var ref = new Firebase("https://tutituti.firebaseio.com");
    //
    //   // create a synchronized array
    //   $scope.messages = $firebaseArray(ref);
    //
    //   // add new items to the array
    //   // the message is automatically added to our Firebase database!
    //   $scope.addMessage = function() {
    //     $scope.messages.$add({
    //       text: $scope.newMessageText
    //     });
    //   };
    //
    //   // click on `index.html` above to see $remove() and $save() in action
    // });

});

function init_time_selector() {
    var times = ["12 AM","01 AM","02 AM","03 AM","04 AM","05 AM","06 AM","07 AM",
                    "08 AM","09 AM","10 AM","11 AM","12 PM","01 PM","02 PM",
                    "03 PM","04 PM","05 PM","06 PM","07 PM","08 PM","09 PM",
                    "10 PM","11 PM"];
    for (var i = 0; i < times.length; i++) {
        var time_slot = $('<div/>')
            .addClass('time_slot_picker').mouseover(mouseover_event).mousedown(mousedown_event);
        time_array = times[i].split(" ");
        var time_number = $('<div/>')
            .addClass('time_slot_number')
            .text(time_array[0]);
        var time_day_time = $('<div/>')
            .addClass('time_slot_day')
            .text(time_array[1]);
        time_slot.append(time_number);
        time_slot.append(time_day_time);
        $('#select-time-pane').append(time_slot);
    }
    console.log(i);
}



/*
input: days, months
output: a calendar widget to the DOM
*/
function initialize_calendar(days, start_month, start_year, span_month){

    /* find the current month and extract the span */
    var date = new Date();
    // var curr_month = date.getMonth();
    var curr_month = start_month;
    // var curr_year  = date.getFullYear();
    var curr_year  = start_year;

    /* generate calendars for months spanning span */
    for (i = 0; i < span_month; i++){

        /* unique container div names generated (account for zero base) */
        container = "container" + (i+1).toString();
        containerID = "#" + container;

        /* generate a div and add to calendar container */
        $( "#calendar-container" ).append("<div class = 'month-block-create' id = " + container + "> </div>");

        /* initialize calendar */
        $(containerID).kalendar();

        /*select some options for calendar */
        var options = {

            firstDayOfWeek: "Sunday",
            showDays: true,
            startMonth: curr_month,
            startYear: curr_year,
            color: "green",
            onDayClick: function(e) {
                e.currentTarget.classList.toggle('selected-day');
                // e.currentTarget.className = e.currentTarget.className + " selected-calendar-date"
                $('.selected-day').css("background-color","rgb(154, 206, 103)");
                $('.c-day').not('.selected-day').css("background-color","rgb(240,240,240)");
            }
        };

        console.log("Curr month: " + (curr_month + 1));

        /* set calendar options */
        $(containerID).kalendar(options);

        /* mark current day somehow */
        var dap_red = "rgb(255,102,102)";
        $( containerID + " .this-day" ).css("background-color", dap_red);
        $( containerID + " .this-day .date-holder" ).css("color", "white");

        /* set color scheme for days that are not today */
        var dap_grey = "rgb(240,240,240)";
        //$( containerID + " .c-day" ).not( ".this-day" ).css("background-color",dap_grey);

        /* start with a clean slate remove tag from today */
        $( containerID + " .this-day" ).removeClass( "this-day" );

        /* pick out the days to highlight for that month */
        //  highlight_days = new Array();
        //
        //  (j = 0; j < days.length; j++) {
        // 	var curr_mon = days[j].split(" ")[1].split("/")[0];
        // 	var curr_day = days[j].split(" ")[1].split("/")[1];
        // 	if (parseInt(curr_mon) == (curr_month + 1)) { highlight_days.push(curr_day); }
        //
        //
        // highlight dates parsed from firebase */
        // containerID + " .c-day" ).not( containerID + " .other-month" ).each(function() {
        //
        // 		/*parse the divs and find the day each represents*/
        // 		var day = $( this ).text();
        //
        // 		/* -1 means "not found" */
        // 		// if ( $.inArray(day, days) != -1) { $( this ).addClass( "this-day" ); };
        // 		if ( $.inArray(day, highlight_days) != -1) { $( this ).addClass( "this-day" ); };
        //
        //  		var dap_green = "rgb(40, 174, 97)";
        // 		$( containerID + " .this-day" ).css("background-color", dap_green);
        // 		$( containerID + " .this-day .date-holder" ).css("color", "white");
        //

        /* disable the next and prev buttons*/
        $( ".c-month-arrow-left" ).hide();
        $( ".c-month-arrow-right" ).hide();

        /* rename to prevent hover events */
        $(containerID + " .c-month-view" ).addClass("cm-view");
        $(containerID + " .c-month-view" ).removeClass("c-month-view");

        /* handle wrapping of years, for next run through */
        if (curr_month == 11) { curr_year += 1};

        /* update current month and wrap */
        curr_month = (curr_month + 1) % 12;

    }
    init_time_selector();
    $("#calendar-container").slick({
        arrows: false,
        dots: false
    });

} /*end of function*/

// Function to get things clicking:
function time_choose_click() {
    $(this).toggleClass('selected');
    console.log($(this));
}

var isMouseDown = false;
var hasSelected;
function mousedown_event() {
    isMouseDown = true;
    hasSelected = $(this).hasClass('selected');
    $(this).toggleClass("selected");
    return false; // prevent text selection
};
function mouseover_event() {
    if (isMouseDown){
        var currHasSelected = $(this).hasClass('selected');
        if(hasSelected==currHasSelected){
            $(this).toggleClass("selected");
        }
    }
};

$(document).mouseup(function () {
    isMouseDown = false;
});
