
var mapOptions = {
    center: new naver.maps.LatLng(35.228785159506995, 129.0758026631008),
    zoom: 10,
};
var mapDiv = document.getElementById("map")
var map = new naver.maps.Map(mapDiv, mapOptions);
var HOME_PATH = window.HOME_PATH || 'C:\Users\User\AppData\Local\Programs\Microsoft VS Code\bin';

var bounds = map.getBounds(),
    southWest = bounds.getSW(),
    northEast = bounds.getNE(),
    lngSpan = northEast.lng() - southWest.lng(),
    latSpan = northEast.lat() - southWest.lat();

var markers = [],
    infoWindows = [];

var positions = [
      {
        title: '강서체육공원 테니스장',
        latlng: new naver.maps.LatLng(35.208785159506995, 128.9708026631008),
        content: ['<h3>날짜: <\h3>',
                  '<h3>장소: 강서체육공원 테니스장<\h3>',
                  '시간: '].join("") 
      },
      {
        title: '맥도생태공원 테니스장',
        latlng: new naver.maps.LatLng(35.14750686067209, 128.95359269844224),
        content: ['<h3>날짜: <\h3>',
                  '<h3>장소: 맥도생태공원 테니스장<\h3>',
                  '시간: '].join("")       
      },
      {
        title: '대저생태공원 테니스장',
        latlng: new naver.maps.LatLng(35.19660162180902, 128.9674589701034),
        content: `날짜: 
                  장소: 
                  시간: `
      },
      {
        title: '화명생태공원 테니스장',
        latlng: new naver.maps.LatLng(35.21868793820246, 129.00270695563023),
        content: `날짜: 
                  장소: 
                  시간: `
      },
      {
        title: '삼락생태공원 테니스장',
        latlng: new naver.maps.LatLng(35.16477005616013, 128.97325979670947),
        content: `날짜: 
                  장소: 
                  시간: `
      },
      {
        title: '구덕운동장 테니스장',
        latlng: new naver.maps.LatLng(35.11629905845608, 129.01629212440938),
        content: `날짜: 
                  장소: 
                  시간: `
      },
      {
        title: '스포원파크 테니스장',
        latlng: new naver.maps.LatLng(35.29144153676313, 129.1067314636474),
        content: `날짜: 
                  장소: 
                  시간: `
      },
      {
        title: '삽량 테니스장',
        latlng: new naver.maps.LatLng(35.32524492420958, 129.05970340008793),
        content: `날짜: 
                  장소: 
                  시간: `
      },
      {
        title: '사직구장 부산종합 실내테니스장',
        latlng: new naver.maps.LatLng(35.19386765608011, 129.06346684938026),
        content: `날짜: 
                  장소: 
                  시간: `
      },  
    ];

    for(let i = 0; i < positions.length; i++) {
      var marker = new naver.maps.Marker({
          position: positions[i].latlng,
          map: map,
          title: positions[i].title,
          clickable: true,
          icon: {
            url: 'css/지도 마커80px(테니스공).png',
            size: new naver.maps.Size(47, 47),
            origin: new naver.maps.Point(16, 16),
            anchor: new naver.maps.Point(16, 16)
        } 
        });

      var infowindow = new naver.maps.InfoWindow({
          content: positions[i].content}); 
          
      markers.push(marker);
      infoWindows.push(infowindow);
    }
          
      naver.maps.Event.addListener(map, 'idle', function() {
        updateMarkers(map, markers);
      });

    function updateMarkers(map, markers) {
      var mapBounds = map.getBounds();
      var marker, position;

        for (var i = 0; i < markers.length; i++) {

          marker = markers[i]
          position = marker.getPosition();

          if (mapBounds.hasLatLng(position)) {
              showMarker(map, marker);
          } else {
              hideMarker(map, marker);
          }
        }
    }

    function showMarker(map, marker) {

      if (marker.getMap()) return;
        marker.setMap(map);
    }

    function hideMarker(map, marker) {

      if (!marker.getMap()) return;
         marker.setMap(null);
}

    function getClickHandler(seq) {
      return function(e) {
          var marker = markers[seq],
            infoWindow = infoWindows[seq];

          if (infoWindow.getMap()) {
              infoWindow.close();
          } else {
              infoWindow.open(map, marker);
          }
      }
    }
    for (var i=0, ii=markers.length; i<ii; i++) {
       naver.maps.Event.addListener(markers[i], 'click', getClickHandler(i));
    }

    function part_zoom() {
      var part = document.querySelector("#select_part").value;
      switch(part) {
        case 'gangseo': 
          map.setCenter(positions[0].latlng);
          map.setZoom(14);
          break;
        case 'macdo':  
          map.setCenter(positions[1].latlng);
          map.setZoom(15);
          break;
        case 'daejeo':  
          map.setCenter(positions[2].latlng);
          map.setZoom(14);
          break;
        case 'hwamyeong':  
          map.setCenter(positions[3].latlng);
          map.setZoom(14);
          break;
        case 'samnak':  
          map.setCenter(positions[4].latlng);
          map.setZoom(16);
          break;
        case 'gudeok':  
          map.setCenter(positions[5].latlng);
          map.setZoom(16);
          break;
        case 'spoonePark':  
          map.setCenter(positions[6].latlng);
          map.setZoom(14);
          break;
        case 'sapryang':  
          map.setCenter(positions[7].latlng);
          map.setZoom(14);
          break;  
        case 'sajik':  
          map.setCenter(positions[8].latlng);
          map.setZoom(15);
          break;  
      }
    }