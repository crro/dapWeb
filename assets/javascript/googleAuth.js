var clientId = '261135696321-gj14qu2s7fdv662cc664v75qbbgeo823.apps.googleusercontent.com';
var apiKey = 'AIzaSyAsVzXOPOogj9TaIpqME0a5sw6Odq3QqBQ';
var scopes = 'email https://www.googleapis.com/auth/calendar';
var testStr = "it didn't Work";
var loadCalEvents;
var stTime;
var enTime;
var datesArr = [];
var calEvents = [];
var addCalEvents;
var currentCal = "ALL";


 function parseHour(dTime)
 {
 	if (dTime.indexOf("T") > -1) {
 		var tm = (dTime.split("T"))[1];
 		var splTm = (tm.split("-"))[0];
 		return (splTm.split(":"))[0];
 	}
 	else {
 		return "ALL";
 	}
 }
 
 function parseMin(dTime)
 {
 	if (dTime.indexOf("T") > -1) {
	 	var tm = (dTime.split("T"))[1];
	 	var splTm = (tm.split("-"))[0];
	 	var min = parseInt((splTm.split(":"))[1]);
	 	if (min >= 30) {
	 		return "30";
	 	}
	 	else {
	 		return "00";
	 	}
	 }
	 else {
	 	return "ALL";
	 }
 }
 
 function parseDay(dTime)
 {
 	var tm;
 	if (dTime.indexOf("T") > -1) {
 		tm = (dTime.split("T"))[0];
 	}
 	else {
 		tm = dTime;
 	}
 	var splTm = tm.split("-");
 	return splTm[2];
 }
 
  function parseMonth(dTime)
 {
 	var tm;
 	if (dTime.indexOf("T") > -1) {
 		tm = (dTime.split("T"))[0];
 	}
 	else {
 		tm = dTime;
 	}
 	var splTm = tm.split("-");
 	return splTm[1];
 }
 
  function parseYear(dTime)
 {
 	var tm;
 	if (dTime.indexOf("T") > -1) {
 		tm = (dTime.split("T"))[0];
 	}
 	else {
 		tm = dTime;
 	}
 	var splTm = tm.split("-");
 	return splTm[0];
 }
 
function reqCallback(jsonResp,rawResp)
{
	if (!jsonResp || jsonResp.error) {
		return;
	}
	var currSz = calEvents.length;
	for (var i = 0; i < jsonResp.items.length; i++) {
		if (!(jsonResp.items[i].status == "cancelled")) {
			var calItem = new Object();
			var name = jsonResp.items[i].summary;
			var locat = jsonResp.items[i].location;
			var ste = jsonResp.items[i].start;
			var ete = jsonResp.items[i].end;
			var sDate;
			var eDate;
	
			if (ste.hasOwnProperty("dateTime")) {
				sDate = ste.dateTime;
				eDate = ete.dateTime;
			} else if (ste.hasOwnProperty("date")) {
				sDate = ste.date;
				eDate = ete.date;
			}
	// 
			calItem.name = name;
			calItem.location = locat;
			var dt = parseInt(parseDay(sDate));
			var mnth = parseInt(parseMonth(sDate));
			var yr = parseInt(parseYear(sDate));
			var sMin = parseMin(sDate);
			var sHour = parseHour(sDate);
			var sMn;
			var sHr;
	
			if (sMin == "ALL") {
				sMn = 0;
			}
			else {
				sMn = parseInt(sMin);
			}
			if (sHour == "ALL") {
				sHr = 0;
			}
			else {
				sHr = parseInt(sHour);
			}
	
			var dateS = Date.UTC(yr, mnth, dt, sHr, sMn, 0, 0);
			
			
			var dtE = parseInt(parseDay(eDate));
			var mnthE = parseInt(parseMonth(eDate));
			var yrE = parseInt(parseYear(eDate));
			var eMin = parseMin(eDate);
			var eHour = parseHour(eDate);
			var eMn;
			var eHr;
	
			if (eMin == "ALL") {
				eMn = 0;
			}
			else {
				eMn = parseInt(eMin);
			}
			if (eHour == "ALL") {
				eHr = 0;
			}
			else {
				eHr = parseInt(eHour);
			}
			eMn = Math.abs((eMn - 30));
			var dateE = Date.UTC(yrE, mnthE, dtE, eHr, eMn, 0, 0);
		
			calItem.sDate = dateS;
			calItem.eDate = dateE;
			calItem.id = jsonResp.summary;
			calEvents[calEvents.length] = calItem;
		}

	}
	addCalEvents("All");


}

function httpGetCal(calId)
{
    var xmlHttp = null;
	var url = "https://www.googleapis.com/calendar/v3/calendars/" + calId + "/events";
	var args = {
		path:url,
		method:"GET"
	};
	var resp = gapi.client.request(args);
	resp.execute(reqCallback);
}

function changeCal(event) {
	var ind = ($(event.target).index() + 1);
	for (var i = 1; i < ($('#key-data li').size() + 1); ++i) {
		$('#key-data ul li:nth-child('+i+')').css("background-color", "#F0F0F0");
	}
	$(event.target).css("background-color", "rgb(155, 155, 155)");

	addCalEvents($(event.target).html());

}

function handleCalList(jsonResp,rawResp) {
	var innerHTM = "<ul><li onclick='changeCal(event)'>All</li>";
	for (var i = 0; i < jsonResp.items.length; i++) {
		innerHTM += "<li onclick='changeCal(event)'>"+jsonResp.items[i].summary+" Calendar</li>";
		httpGetCal(jsonResp.items[i].id);
	}
	innerHTM += "</ul>";
	document.getElementById('key-data').innerHTML = innerHTM;	
	$('#key-data ul li:nth-child(1)').css("background-color", "rgb(155, 155, 155)");
	document.getElementById('calendar-key').style.visibility = "visible";
	document.getElementById('calendar-key').style.top = "-45px";
	document.getElementById('load-google').style.visibility = "hidden";

}

window.onload = function handleClientLoad() {
  gapi.client.setApiKey(apiKey);
 // window.setTimeout(checkAuth,1);
}

// function checkAuth() {
  // gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
// }

function handleAuthResult(authResult) {
  var authorizeButton = document.getElementById('authorize-button');
  
  var testr = gapi.client.request({path: "https://www.googleapis.com/calendar/v3/users/me/calendarList", method: "GET"});

  if (authResult && !authResult.error) {
   testr.execute(handleCalList);

  } else {
  //  authorizeButton.style.visibility = '';
 //   authorizeButton.onclick = handleAuthClick;
  }
}

function handleAuthClick(event) {
  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
  return false;
}




