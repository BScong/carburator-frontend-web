
function initMap(map) {
	var paris = {lat: 48.8566, lng: 2.3522};
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 10,
		center: paris
	});
	populateMap(map);
}

function populateMap(map){
	var stationsApiUrl = config.CARBURATOR_API_URL;
	$.getJSON(stationsApiUrl, function(data){
		var markers = [];
		var infowindow = new google.maps.InfoWindow({
			content: 'Chargement...'
		})
		for(var i = 0; i<data.length;i++){
			var prices = '<ul>'
			for(key in data[i].prices){
				prices += '<li>'+data[i].prices[key].name + ' : <b>' + data[i].prices[key].value + " €</b></li>"
			}
			prices+='</ul>'

			var services = ''
			if (data[i].services.length>0){
				services = '<h2> Services </h2><ul>'
				for(var j=0; j<data[i].services.length;j++){
					services += '<li>'+data[i].services[j]+"</li>"
				}
				services+='</ul>'
			}

			var times = '';
			if (data[i].hours.open != data[i].hours.close){
				times = '<h2>Horaires</h2><ul><li>Ouverture : '+data[i].hours.open+'</li>'+
				'<li>Fermeture : '+data[i].hours.close+'</li>'
				if (data[i].hours.except!="")
				times += '<li>Fermé ' + data[i].hours.except+'</li>'
				times+='</ul>'
			}



			var contentString = '<div id="content">'+
			'<div id="siteNotice">'+
			'</div>'+
			//'<h1 id="firstHeading" class="firstHeading">'+data[i].address + ", " + data[i].postcode + " " + data[i].city+'</h1>'+
			'<div id="bodyContent">'+
			'<h2>Adresse</h2>'+
			'<p>'+data[i].address + ",<br />"+ data[i].postcode + " " + data[i].city+'</p>'+
			times+
			'<h2> Prix </h2>'+ prices +
			services +
			'<p> Données au ' + new Date(data[i].last_modified) + '</p>'+
			'</div>'+
			'</div>';

			var marker = new google.maps.Marker({
				position: {lat:parseFloat(data[i].lonlat[1]),lng:parseFloat(data[i].lonlat[0])},
				map: map,
				title: data[i].address + ", " + data[i].postcode + " " + data[i].city,
				html: contentString
			});

			markers.push(marker);

			google.maps.event.addListener(marker, 'click', function () {
				infowindow.setContent(this.html);
				infowindow.open(map, this);
			});
		}
		var markerCluster = new MarkerClusterer(map, markers,{
			imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
		});
	});
}
