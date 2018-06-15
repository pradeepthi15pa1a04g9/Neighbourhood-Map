var map;
var infoWindow;
// Foursquare API
var clientID = 'P4XIR0NSKJMNTSAV0IPGM1YC1QQ1ZOPTOXJHG4YW3TU1QFV1';
var clientSecret = 'ZW34A2NGAZDKYW3PHTCTWOBQFNQICOOSJBEFXE5Y3AJXTAKN';

var locationMarkers = [
    {
        name: 'Charminar',
        address : 'Old City,Hyderabad 500002,Telangana,India',
        lat:17.3616,lng:78.4747
    },
    {
        name: 'Birla Mandir',
        address : 'Adarsh Nagar,Hyderabad 503111,Telangana,India',
        lat:17.4062,lng:78.4691
    },
    {
        name: 'Golkonda',
        address : 'Gandipet (Gandipet),Hyderabad 500075,Telangana,India',

        lat: 17.3833,lng: 78.4011
    },
    {
        name: 'Salar Jung Musuem',
        address : 'Hafzalgunj,Hyderabad,Telangana,India',

        lat:17.3713,lng:78.4804
    },
    {
        name: 'Tank Bund',
        address : 'Hyderabad,Telangana,India',
    
        lat:17.4239,lng:78.4738
    },
    {
        name: 'InorbitMall',
        address : 'Near Durgam Cheruvu, Vittal Rao Nagar (Hitech City),Hyderabad 500034,Telangana,India',
        lat:17.4354,lng:78.3827
    },
    {
        name: 'Ramoji Film City',
        address : 'Ramoji Film Ciry,Hyderabad,Telangana,India',
        lat:17.2543,lng: 78.6808
    },
];

// Viewmodel
var ViewModel = function() {
  
  var self = this;

  this.markersArray = ko.observableArray([]);

  // Push marker to array of markers
  
  locationMarkers.forEach( function(markerItem) {
    self.markersArray.push( new MapMarker(markerItem) );
  });
  this.query = ko.observable('');
  this.filteredMarkers = ko.computed(function () {
    var filter = self.query().toLowerCase();
    if (!filter) {
      ko.utils.arrayForEach(self.markersArray(), function (item) {
        if (item.marker) {
          item.marker.setVisible(true);
        }
      });
      return self.markersArray();
    } else {
      return ko.utils.arrayFilter(self.markersArray(), function(item) {
        var result = (item.name().toLowerCase().search(filter) >= 0)
        if (item.marker) {
          item.marker.setVisible(result); 
        }
        return result;
        })
    }
  });
};
// Model
var MapMarker = function(markerItem) {
  var self = this;
  this.name = ko.observable(markerItem.name);
  this.address = ko.observable('');
  this.lat = ko.observable(markerItem.lat);
  this.lng = ko.observable(markerItem.lng);

  var fourSquareSearchURL = 'https://api.foursquare.com/v2/venues/search'
  var latLong = '?ll='
  var fourSquareAPIURL = fourSquareSearchURL + latLong + self.lat() +
  ',' + self.lng() + '&client_id=' + clientID + '&client_secret=' + clientSecret +
  '&v=20180101' + '&query=' + self.name();

  $.getJSON(fourSquareAPIURL, function(data) {
    var result = data.response.venues[0];
    self.address(result.location.formattedAddress);
    var marker = new google.maps.Marker({
      position: {
      lat: self.lat(),
      lng: self.lng()
      },

      map: map,
      icon:'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
      formatted_address: self.address(),
      title: self.name(),
    });
    marker.addListener('click', onMarkerClicked);

    self.marker = marker;

  })
};
var onMarkerClicked = function () {
  clickAnimation( this );
  
};

var onListItemClicked = function () {
  clickAnimation( this.marker );
};

var clickAnimation = function ( marker ) {
  animateMarker( marker );
  displayInfoWindow( marker );
};
var animateMarker = function ( marker ) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      marker.setAnimation(null);
    });
  }
};
var displayInfoWindow = function( marker ) {
  var self = this;
  var contentString = '<div id="content"></div>' +
  '<h3 id="firstHeading" class="firstHeading">' + marker.title + '</h3>'+
  '<div>Address: ' + marker.formatted_address + '</div>' ;

  if (infoWindow) {
    infoWindow.close();
  }

  infoWindow = new google.maps.InfoWindow({
    content: contentString
  });
  //Info window 
  infoWindow.open(map, marker);
};
// Google Maps Init
function initMap() {
  var mapStart = {lat:17.3616, lng: 78.4867};
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: mapStart
  });
  ko.applyBindings( new ViewModel() );
};
function googleMapsError() {
    alert("Google Maps has failed to load.");
};
