// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDAlab9BnsyOOMiKOcSlcgvuPDwE9ppc2Y",
  authDomain: "food247-5905e.firebaseapp.com",
  databaseURL: "https://food247-5905e.firebaseio.com",
  projectId: "food247-5905e",
  storageBucket: "food247-5905e.appspot.com",
  messagingSenderId: "526310084175",
  appId: "1:526310084175:web:6a7000ed289e0fb38de43a"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

document.addEventListener('init', function (event) {

  var page = event.target;


  if (page.id === 'homePage') {
    console.log("homePage");

    $("#thaibtn").click(function () {
      localStorage.setItem("selectedCategory", "thai");
      $("#content")[0].load("category.html");
    });

    $("#drinkbtn").click(function () {
      localStorage.setItem("selectedCategory", "drink");
      $("#content")[0].load("category.html");
    });

    $("#menubtn").click(function () {
      $("#sidemenu")[0].open();
    });

    $("#carousel").empty();
    db.collection("recommended").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var item = `<ons-carousel-item modifier="nodivider" id="item${doc.data().id}" class="recomended_item">
            <div class="thumbnail" style="background-image: url('${doc.data().photoUrl}')">
            </div>
            <div class="recomended_item_title" id="item1_${doc.data().id}">${doc.data().name}</div>
        </ons-carousel-item>`
        $("#carousel").append(item);
      });
    });
  }

  if (page.id === 'menuPage') {
    console.log("menuPage");

    $("#login").click(function () {
      $("#content")[0].load("login.html");
      $("#sidemenu")[0].close();
    });

    $("#home").click(function () {
      $("#content")[0].load("home.html");
      $("#sidemenu")[0].close();
    });

    $("#address").click(function () {
      $("#content")[0].load("address.html");
      $("#sidemenu")[0].close();
    });

    $("#mapbox").click(function () {
      $("#content")[0].load("mapbox.html");
      $("#sidemenu")[0].close();
    });
  }

  if (page.id === 'categoryPage') {
    var category = localStorage.getItem("selectedCategory");
    console.log("categoryPage:" + category);

    $("#header").html(category);

    $("#menubtn").click(function () {
      $("#sidemenu")[0].open();
    });

    $("#list").empty();
    db.collection("recommended").where("category", "==", category).get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          var item = `<ons-row class="category">
                <ons-col modifier="nodivider">
                    <div class="category_header" style="background-image: url('${doc.data().photoUrl}')">
                        <figure class="category_thumbnail" id="thaibtn">
                            <div class="category_title" id="Category_1_name">${doc.data().name}</div>
                        </figure>
                    </div>
                </ons-col>
         </ons-row>`
          $("#list").append(item);
          console.log(doc.data().name);

        });
      });

  }

  if (page.id === 'loginPage') {
    console.log("loginPage");

    $("#backhomebtn").click(function () {
      $("#content")[0].load("home.html");
    });
  }

  if (page.id === 'addressPage') {
    console.log("addressPage");

    $("#backhomebtn").click(function () {
      $("#content")[0].load("home.html");
    });

    var Latitude = undefined;
    var Longitude = undefined;
    var map;

    // Get geo coordinates

    function getMapLocation() {

      navigator.geolocation.getCurrentPosition
        (onMapSuccess, onMapError, { enableHighAccuracy: true });
    }

    // Success callback for get geo coordinates

    var onMapSuccess = function (position) {

      Latitude = position.coords.latitude;
      Longitude = position.coords.longitude;


      getMap(Latitude, Longitude);

    }

    // Get map by using coordinates

    function getMap(latitude, longitude) {

      console.log(latitude);
      console.log(longitude);


      var mapOptions = {
        center: new google.maps.LatLng(0, 0),
        zoom: 1,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      map = new google.maps.Map
        (document.getElementById("map"), mapOptions);

      var latLong = new google.maps.LatLng(latitude, longitude);

      var marker = new google.maps.Marker({
        position: latLong
      });

      marker.setMap(map);
      map.setZoom(15);
      map.setCenter(marker.getPosition());

      $("#map").css("position", "static");

      console.log("show map");
    }

    // Success callback for watching your changing position

    var onMapWatchSuccess = function (position) {

      var updatedLatitude = position.coords.latitude;
      var updatedLongitude = position.coords.longitude;

      if (updatedLatitude != Latitude && updatedLongitude != Longitude) {

        Latitude = updatedLatitude;
        Longitude = updatedLongitude;

        getMap(updatedLatitude, updatedLongitude);
      }
    }

    // Error callback

    function onMapError(error) {
      console.log('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
    }

    // Watch your changing position

    function watchMapPosition() {

      return navigator.geolocation.watchPosition
        (onMapWatchSuccess, onMapError, { enableHighAccuracy: true });
    }

    getMapLocation();

  }

  if (page.id === 'mapboxPage') {
    console.log("mapboxPage");

    $("#backhomebtn").click(function () {
      $("#content")[0].load("home.html");
    });


    $("#setaddress").click(function () {
      ons.notification.alert(Latitude + "," + Longitude);
    });


    var Latitude = undefined;
    var Longitude = undefined;  

    var onMapSuccess = function (position) {

      Latitude = position.coords.latitude;
      Longitude = position.coords.longitude;
      getMap(Latitude, Longitude);
    }

    function onMapError(error) {
      console.log('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
    }

    function getMap(latitude, longitude) {

      console.log(latitude);
      console.log(longitude);

      mapboxgl.accessToken = 'pk.eyJ1Ijoia29yYXdpdCIsImEiOiJjazJmc2xmYjIwOWxoM21vYnVwenN4ZnVnIn0.H97KOAE41i7mJ_il10OsRQ';
      var coordinates = document.getElementById('coordinates');
      var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center:[longitude,latitude],
        zoom: 14
      });

      map.addControl(new mapboxgl.NavigationControl());

      var marker = new mapboxgl.Marker({
        draggable: true
      })
        .setLngLat([longitude,latitude])
        .addTo(map);

      function onDragEnd() {
        var lngLat = marker.getLngLat();
        coordinates.style.display = 'block';
        coordinates.innerHTML = 'Longitude: ' + lngLat.lng + '<br />Latitude: ' + lngLat.lat;
      }

      marker.on('dragend', onDragEnd);
    }


    navigator.geolocation.getCurrentPosition
      (onMapSuccess, onMapError, { enableHighAccuracy: true });

  }


});
