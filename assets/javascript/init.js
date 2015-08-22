
$(document).ready(function(){

   /* do jQuery/Javascript */ 
   var firebaseURL = "https://availa.firebaseio.com/sessions/-JcTpEjZETQx6cO58EaD"
   parse(firebaseURL);  
});

 /* 
 * extract the fireBase URL created via mobil device 
 */ 
  
function parse(firebaseURL) {

	/* week days indexed according to Date Object standard */ 
	var weekDays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]; 

	/* constructs a new Firebase reference from a firebase URL */
	var myDataRef = new Firebase(firebaseURL);
   
	/* extract and parse JSON received from fireBase */
	myDataRef.on('value', function (snapshot) {

		/* get json from data ref */ 
		var json = snapshot.val();

		/* TODO: pull the time span information "time,timezone" string */ 
		if (json.dates.length <= 0) { return null; }
		var timeinfo = json.dates[0].split("T")[1];

		/* TODO: acccount for time zone, discrepancies */
		if (timeinfo.split("+").length == 2) {
			console.log("TIMEZONE: right of UTC"); 
		}

		if (timeinfo.split("-").length == 2) {
			console.log("TIMEZONE: left of UTC"); 
		}

		/* time is a two array [hour,minute] (int) */ 
		strTime = new Array(2);
		endTime = new Array(2); 
		strTime[0] = parseInt(timeinfo.split("-")[0].split(":")[0]); 
		strTime[1] = parseInt(timeinfo.split("-")[0].split(":")[1]);
		endTime[0] = strTime[0] + (json.halfHours/2);
		endTime[1] = strTime[1] + (json.halfHours%2)*30; 
		
		/* TODO: pull the dates to schedule over */ 
		/* get the session info, convert date strings to Date objects */ 
		var dates = new Array(); 

		/* remove the fluff from the dates */
		for (i = 0; i < json.dates.length; i++) {

			currDate = json.dates[i].split("T")[0]; 
			var splitdate = (currDate).split("-"); 
			splitdate[0] = parseInt(splitdate[0]); /* year  */
			splitdate[1] = parseInt(splitdate[1]); /* month */
			splitdate[2] = parseInt(splitdate[2]); /* day   */
			var testdate = new Date(splitdate[0], (splitdate[1] - 1), splitdate[2]);
			var datestr = weekDays[testdate.getDay()] + " " + splitdate[1] + "/" + splitdate[2]; 
			dates.push(datestr); 
		}

		/* TODO: pull the name of the initiator */ 
		console.log("initiator: " + json.initiator); 
		console.log("Start Time: " + strTime[0] + ":" + strTime[1]);
		console.log("End Time: " + endTime[0] + ":" + endTime[1]);

		/* display the initiator graphically (could make this nicer) */ 
		$( "#message" ).append("<p>" + json.initiator + "</p>");
		

		/* TODO create the date picker and the calendar */ 
		var start_month = parseInt(dates[0].split(" ")[1].split("/")[0]);  
		var end_month   = parseInt(dates[dates.length-1].split(" ")[1].split("/")[0]); 
		var start_year  = parseInt(json.dates[0].split("-")[0]);
		var span_month  = Math.abs(start_month - end_month) + 1; 

   		/* build the calendar widget */ 
   		initialize_calendar(dates,(start_month-1),start_year,span_month); 

   		/* build the date picker */ 
   		var date_picker_strt = strTime[0]; 
   		var date_picker_endd = endTime[0];
		initialize_page(dates, date_picker_strt, date_picker_endd);

	}, function (errorObject) {
     	console.log('The read failed: ' + errorObject.code);
	});

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
 	   $( "#calendar-container" ).append("<div class = 'month-block' id = " + container + "> </div>");
 	  
 	   /* initialize calendar */ 
	   $(containerID).kalendar(); 

	   /*select some options for calendar */ 
 	   var options = { 

 	    	firstDayOfWeek: "Sunday",
 	    	showDays: true,
 			startMonth: curr_month,
 			startYear: curr_year,
 			color: "green"
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
 	   $( containerID + " .c-day" ).not( ".this-day" ).css("background-color",dap_grey);

 	   /* start with a clean slate remove tag from today */ 
 	   $( containerID + " .this-day" ).removeClass( "this-day" );

 	   /* pick out the days to highlight for that month */ 
 	   var highlight_days = new Array(); 

 	   for (j = 0; j < days.length; j++) {
			var curr_mon = days[j].split(" ")[1].split("/")[0];
			var curr_day = days[j].split(" ")[1].split("/")[1];
			if (parseInt(curr_mon) == (curr_month + 1)) { highlight_days.push(curr_day); }
 	   }

 	   /* highlight dates parsed from firebase */ 
 	   $( containerID + " .c-day" ).not( containerID + " .other-month" ).each(function() {
	   
 			/*parse the divs and find the day each represents*/ 
 			var day = $( this ).text(); 

 			/* -1 means "not found" */ 
 			// if ( $.inArray(day, days) != -1) { $( this ).addClass( "this-day" ); }; 
 			if ( $.inArray(day, highlight_days) != -1) { $( this ).addClass( "this-day" ); };
	 
 	 		var dap_green = "rgb(40, 174, 97)";
 			$( containerID + " .this-day" ).css("background-color", dap_green); 
 			$( containerID + " .this-day .date-holder" ).css("color", "white");
 	   });

 	  /* disable the next and prev buttons */ 
 	  $( ".c-month-arrow-left" ).hide(); 
 	  $( ".c-month-arrow-right" ).hide();

 	  /* rename to prevent hover events */ 
 	  $(containerID + " .c-month-view" ).addClass("cm-view"); 
 	  $(containerID + " .c-month-view" ).removeClass("c-month-view"); 

	  /* handle wrapping of years, for next run through */ 
 	  if (curr_month == 11) { curr_year += 1}; 
   
 	  /* update current month and wrap */ 
 	  curr_month = (curr_month + 1) % 12 
	}

	$("#calendar-container").slick({
		arrows: true,
		dots: false
	});

} /*end of function*/












