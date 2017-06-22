//
var googleMapsClient = require('@google/maps').createClient({
  key: ''
});

// Geocode an address.
googleMapsClient.geocode({
  address: '1600 Amphitheatre Parkway, Mountain View, CA'
}, function(err, response){
    if (!err) {
        var result = response.json.results;
        console.log(result);
    }
});
*/
