var markers,markerCluster;

  $(document).ready(function(){

    //create feature group
    markers = L.featureGroup();
    //create marker clustergroup
    markerCluster = L.markerClusterGroup();  
    
    /*parse json file, create charts, draw markers on map */
    $.getJSON('assets/mca_test.json', function(data){

      //console.log("echo");

      //set crossfilter
      var dx = crossfilter(data);

      //create dimensions
      var statusDim = dx.dimension(function(d){return d.c_status;}),
          classDim = dx.dimension(function(d){return d.c_class;}),
          allDim = dx.dimension(function(d) {return d;}),
          activityDim = dx.dimension(function(d) {return d.c_activity;}),
          categoryDim = dx.dimension(function(d) {return d.c_category;}),
          subcategoryDim = dx.dimension(function(d) {return d.c_sub_category;});


      //create groups
      var all = dx.groupAll();
      var statuscount = statusDim.group().reduceCount(),
          classcount = classDim.group().reduceCount(),
          activitycount = activityDim.group().reduceCount(),
          categorycount = categoryDim.group().reduceCount(),
          subcategorycount = subcategoryDim.group().reduceCount();

      //specify charts
      var statusChart = dc.pieChart('#chart-ring-status'),
          classChart = dc.pieChart('#chart-ring-class'),
          activityChart = dc.pieChart('#chart-ring-activity'),
          categoryChart = dc.pieChart('#chart-ring-category'),
          subcategoryChart = dc.pieChart('#chart-ring-subcategory');

      statusChart
            .width(200)
            .height(200)
            .dimension(statusDim)
            .group(statuscount)
            .innerRadius(20);

      classChart
            .width(200)
            .height(200)
            .dimension(classDim)
            .group(classcount)
            .innerRadius(20);

      activityChart
            .width(200)
            .height(200)
            .dimension(activityDim)
            .group(activitycount)
            .innerRadius(20);

      categoryChart
            .width(200)
            .height(200)
            .dimension(categoryDim)
            .group(categorycount)
            .innerRadius(20);

      subcategoryChart
            .width(200)
            .height(200)
            .dimension(subcategoryDim)
            .group(subcategorycount)
            .innerRadius(20);


      //update map with office locations
      subcategoryChart
        .on('renderlet', function(e){

          //clear previous map marker group
          markerCluster.clearLayers();

          _.each(allDim.top(Infinity),function(d){

            var marker = L.marker([d.lat, d.lng]);
            marker.bindPopup("<p>" + d.c_name + "</p> " + "<p>" + d.lat + "<p/>" + "<p>" + d.lng + "</p>");
            
            //add marker at position i to marker group
            markerCluster.addLayer(marker);
        });

      });

      //markerCluster group add to map instance
      markerCluster.addTo(map);
      //map.addLayer(myMarkers);
      //map.fitBounds(markerCluster.getBounds());

    // showtime!
    dc.renderAll();

    //register handlers
    d3.selectAll('a#all').on('click', function(){
      dc.filterAll();
      dc.renderAll();
    });

    d3.selectAll('a#status').on('click', function () {
      statusChart.filterAll();
      dc.redrawAll();
    });

    d3.selectAll('a#class').on('click', function () {
      classChart.filterAll();
      dc.redrawAll();
    });

    d3.selectAll('a#activity').on('click', function () {
      activityChart.filterAll();
      dc.redrawAll();
    });

    d3.selectAll('a#category').on('click', function (){
      categoryChart.filterAll();
      dc.redrawAll();
    });

    d3.selectAll('a#subcategory').on('click', function() {
      subcategoryChart.filterAll();
      dc.redrawAll();
    });


  });

  /*initialize map*/
    var map = L.map('map');

    
    // create the tile layer with correct attribution
    var osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
    var osm = new L.TileLayer(osmUrl, {minZoom: 4, maxZoom: 18, attribution: osmAttrib});   

    // start the map in Guwahati,AS
    map.setView(new L.LatLng(26.1445, 91.7362),9);
    map.addLayer(osm);

  });