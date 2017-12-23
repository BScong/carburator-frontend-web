// Put your Google Maps api key here
var mapsApiKey = "";

$.getScript("https://maps.googleapis.com/maps/api/js?key="+ mapsApiKey + "&callback=initMap",function(data, status,jqxhr){
	console.log(status);
})