
$(document).ready(function() {

	var allDates = ["Sun 8/24", "Mon 8/25", "Tue 8/26", "Wed 8/27", "Thu 8/28", "Fri 8/29", "Sat 8/30"];
	var start = 0;
	var end = 12;

	initialize_page(allDates, start, end);
});

/*This class controlls the colums with availability*/
//incoming_dates is an array with each element formatted as follows: "Sun 8/24"
//incoming_startTime and incoming_endTime are between 0 and 47 inclusive

addCalEvents = function(filtr) {
	for (var de = 0; de < datesArr.length; de++) {
		var d = (de + 1);
		for(var i = stTime; i <= enTime; i++){

			var stArr = datesArr[de].split("-");
			var sDt = parseInt(stArr[1]);
			var sMn = parseInt(stArr[0]);
			var sYr = parseInt(stArr[2]);


			var sDte = Date.UTC(sYr, sMn, sDt, i, 0, 0, 0);

			var sDtH = Date.UTC(sYr, sMn, sDt, i, 30, 0, 0);

			var dc = document.getElementById('day'+d+'-'+i+':00');
			var dcH = document.getElementById('day'+d+'-'+i+':30');
			var showClass = false;
			for (var cE = 0; cE < calEvents.length; cE++) {
				if (((calEvents[cE].id + " Calendar") == filtr) || (filtr == "All")) {
					ev = calEvents[cE];
					if (ev.name == "Test Event") {
						console.log("NEW");
						console.log(sDte);
						console.log(dc);
						console.log(sDtH);
						console.log(dcH);
						console.log(ev.sDate);
						console.log(ev.eDate);
					}
					//add event for 00
					if (ev.sDate == sDte) {
						dc.className = dc.className + " slotTop";
						dc.innerHTML = "<p>"+ev.name+"</p>";
						showClass = true;
					}
					else if (ev.eDate == sDte) {
						dc.className = dc.className + " slotBottom";
						showClass = true;
					}
					else if ((sDte > ev.sDate) && (sDte < ev.eDate)) {
						dc.className = dc.className + " slotMid";
						showClass = true;
					}

					//add event for 30 min
					if (ev.sDate == sDtH) {
						dcH.className = dcH.className + " slotTop";
						dcH.innerHTML = "<p>"+ev.name+"</p>";
						showClass = true;
					}
					else if (ev.eDate == sDtH) {
						dcH.className = dcH.className + " slotBottom";
						showClass = true;
					}
					else if ((sDtH > ev.sDate) && (sDtH < ev.eDate)) {
						dcH.className = dcH.className + " slotMid";
						showClass = true;
					}
				}
			}
			 if (!showClass) {
			 	var sTop = 'slotTop';
				var sTopR = new RegExp(sTop, 'g');
				var sMid = 'slotMid';
				var sMidR = new RegExp(sMid, 'g');
				var sBott = 'slotBottom';
				var sBottR = new RegExp(sBott, 'g');
			 	dc.className = dc.className.replace(sTopR, "");
			 	dc.className = dc.className.replace(sMidR, "");
			 	dc.className = dc.className.replace(sBottR, "");
			 	dcH.className = dcH.className.replace(sTopR, "");
			 	dcH.className = dcH.className.replace(sMidR, "");
			 	dcH.className = dcH.className.replace(sBottR, "");
			 	dcH.innerHTML = "";
			 	dc.innerHTML = "";

			 }
		}
	}
}

function initialize_page(incoming_dates, incoming_startTime, incoming_endTime){
	var Times = ["12 AM","1 AM","2 AM","3 AM","4 AM","5 AM","6 AM","7 AM","8 AM","9 AM","10 AM","11 AM",
				  "Noon","1 PM","2 PM","3 PM","4 PM","5 PM","6 PM","7 PM","8 PM","9 PM","10 PM","11 PM",
				  "12 AM","1 AM","2 AM","3 AM","4 AM","5 AM","6 AM","7 AM","8 AM","9 AM","10 AM","11 AM",
				  "Noon","1 PM","2 PM","3 PM","4 PM","5 PM","6 PM","7 PM","8 PM","9 PM","10 PM","11 PM"];

    //all of this will be variable and subject to change based on information received from sender
	//var array
	//numDays = arary.length;

 	var numDays = incoming_dates.length;
 	var startTime = incoming_startTime;
	var endTime = incoming_endTime;
	stTime = startTime;
	enTime = endTime;
	datesArr = incoming_dates;

	var dates = [" "];
    for (i=1; i<=numDays; i++){
    	dates[i]=incoming_dates[i-1];

    }

//						Calendar Construction
//------------------------------------------------------------//Columns Below

//creates the columns below each date
    var $hourCol = $('<div/>')
    	.addClass('hourCol');

    $('.fullCal').append($hourCol);	//hour column holds the titles for times
    // $('#rightpanel').prepend($hourCol);
    for (var i=1; i<dates.length; i++){
	    var $colDiv = $('<div/>')
	    	.attr('id', 'day'+i)		//each column gets an id indicating which day it represents
	    	.addClass('col')
 			$('.fullCal').append($colDiv);


    }

//------------------------------------------------------------//Top Row of Dates in Cols

//creates the dates row at the top of the page

	var $dateDiv2 = $('<div/>')
	.addClass('dateCell')

    for (var i=0; i<dates.length; i++){
    	var day = dates[i];
    	var $dateDiv1 = $('<div/>')
    		.attr('id', day)
    		.addClass('dateCell')
    		.text(day)

    	if (i!=0){
    		$('#day'+ i).append($dateDiv1)
		}
		else{
			$('.hourCol').append($dateDiv2)
		}
    }

//------------------------------------------------------------//Cells in Columns + Slots in cells

//inserts the time cells into each column as well as slots into each cell
	var numHours = (endTime-startTime);
	for(var i = startTime; i <=endTime; i++){
		for (var d = 1; d<=numDays; d++){
			var $selectAll = $('<div/>')
				.attr('id', 'selectAll'+d)
				.addClass('selectAll')

			var $cell = $('<div/>')
				.attr('id', 'day'+d+'-'+i)
				.addClass('day'+d)
				.addClass('cell')
				.addClass('norm');

			var $slot1 = $('<div/>')
				.attr('id', 'day'+d+'-'+i+':00')
				.addClass('day'+d)
				.addClass('slot1')
				.addClass('slot');

			var $slot2 = $('<div/>')
				.attr('id', 'day'+d+'-'+i+':30')
				.addClass('day'+d)
				.addClass('slot2')
				.addClass('slot');

			if (i==startTime){
				$('#day'+d).append($selectAll);
			}
			$('#day'+d).append($cell);
			$('#day'+d+'-'+i).append($slot1);
			$('#day'+d+'-'+i).append($slot2);
		}

		var $hourCell = $('<div/>')
			.addClass('cell')
			.attr('id', Times[i])
			.append('<p>'+Times[i]+'</p>');
		$('.hourCol').append($hourCell);
	}


//						Functions							  //
//------------------------------------------------------------//

//when a slot is clicked, toggle it to selected.
    // $('.slot').click(function() {
    // 	$(this).toggleClass('selected');
    // });

    $('.selectAll').click(function(){
    	$(this).toggleClass('selectAllSelected');
    	var on = $(this).hasClass('selectAllSelected');
    	var par = $(this).parent()
    	//par.children().children().toggleClass('selected');
    	var children = par.children().children();
		if (on){
			children.addClass('selected-timeslot');
			on = false;
		}
		else{
			children.removeClass('selected-timeslot')
			on = true;
		}


    });


//------------------------------------------------------------//

//synchronizes the scrolling of the dates div and the fullCal Div
    $("#rightpanel").scroll(function () {
        $(".hourCol").scrollLeft($("#rightpanel").scrollLeft());
    });
    $(".hourCol").scroll(function () {
        $("#rightpanel").scrollLeft($(".hourCol").scrollLeft());
    });


//------------------------------------------------------------//

    $('.sendbutton').click(function() {

    	var selected = document.getElementsByClassName('selected-timeslot');
    	var len = selected.length;
    	var strings = [0];
    	var send = [];
    	var i;

    	for (i = 0; i < numDays; i++){
    		send[i] = [];
    	}

    	for (i = 0; i < len; i++){
    		var div = selected[i];
    		var id = div.id;
    		var currDate = id.substring(3,4);
    		var currTime = id.substring(5);
    		strings[i] = (dates[currDate]+", Time:"+currTime);
    		send[currDate-1].push(strings[i]);
    	}

		console.log(send);

		// for (i = 0; i < numDays; i++){
		// 	console.log(send[i].length);
		// }

    });

 //------------------------------------------------------------//
  	var isMouseDown = false;
  	var hasSelected;
  	$(".slot").mousedown(function () {
  		isMouseDown = true;
  		hasSelected = $(this).hasClass('selected-timeslot');
	    $(this).toggleClass("selected-timeslot");
	    return false; // prevent text selection
 	})
   	$(".slot").mouseover(function () {
		if (isMouseDown){
			var currHasSelected = $(this).hasClass('selected-timeslot');
			if(hasSelected==currHasSelected){
				$(this).toggleClass("selected-timeslot");
			}
  		}
	});

  	$(document).mouseup(function () {
    	isMouseDown = false;
		});

  	//----------------------------------------------------------//

	// $( document )
	// 	.drag("start",function( ev, dd ){
	// 		return $('<div class="selection" />')
	// 			.css('opacity', .65 )
	// 			.appendTo( document.body );
	// 	})
	// 	.drag(function( ev, dd ){
	// 		$( dd.proxy ).css({
	// 			top: Math.min( ev.pageY, dd.startY ),
	// 			left: Math.min( ev.pageX, dd.startX ),
	// 			height: Math.abs( ev.pageY - dd.startY ),
	// 			width: Math.abs( ev.pageX - dd.startX )
	// 		});
	// 	})
	// 	.drag("end",function( ev, dd ){
	// 		$( dd.proxy ).remove();
	// 	});
	// $('.drop')
	// 	.drop("start",function(){
	// 		$( this ).addClass("active");
	// 	})
	// 	.drop(function( ev, dd ){
	// 		$( this ).toggleClass("selected");
	// 	})
	// 	.drop("end",function(){
	// 		$( this ).removeClass("active");
	// 	});
	// $.drop({ multi: true });


}
