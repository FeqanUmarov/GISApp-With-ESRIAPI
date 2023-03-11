require(["esri/Map", "esri/layers/GeoJSONLayer", "esri/views/MapView", "esri/widgets/Sketch", "esri/Graphic", "esri/layers/GraphicsLayer","esri/views/interactive/snapping/SnappingOptions"], (
  Map,
  GeoJSONLayer,
  MapView,
  Sketch,
  Graphic,
  GraphicsLayer,
  esriConfig, 
  SnappingOptions
) => {
  // If GeoJSON files are not on the same domain as your website, a CORS enabled server
  // or a proxy is required.
  const placeurl = "/geojson/Places.geojson";
  const roadsurl = "/geojson/roads.geojson";

  // Paste the url into a browser's address bar to download and view the attributes
  // in the GeoJSON file. These attributes include:
  // * mag - magnitude
  // * type - earthquake or other event such as nuclear test
  // * place - location of the event
  // * time - the time of the event
  // Use the Arcade Date() function to format time field into a human-readable format
  // places popup
  const placetemplate = {
    title: "Poliqon məlumatı",
    content: "Adı: {name}, Şəhər/Kənd {fclass}, Əhali {population}",
    fieldInfos: [
      {
        fieldName: 'time',
        format: {
          dateFormat: 'short-date-short-time'
        }
      }
    ]
  };


  // roads popup
  const roadstemplate = {
    title: "Yol məlumatı",
    content: "Adı: {name}",
    fieldInfos: [
      {
        fieldName: 'time',
        format: {
          dateFormat: 'short-date-short-time'
        }
      }
    ]
  };
  // place renderer
  const placerenderer = {
    type: "simple",
    field: "mag",
    symbol: {
      type: "simple-fill",
      color: "orange",
      outline: {
        color: "black"
      }
    },
    visualVariables: [{
      type: "size",
      field: "mag",
      stops: [{
        value: 2.5,
        size: "4px"
      },
      {
        value: 8,
        size: "40px"
      }
      ]
    }]
  };

  // place renderer
  const roadsrenderer = {
    type: "simple",
    symbol: {
      type: "simple-line",
      color: "blue",
      width: 1
    }
  }




  const placelayer = new GeoJSONLayer({
    url: placeurl,
    editingEnabled: true,
    copyright: "USGS Earthquakes",
    popupTemplate: placetemplate,
    renderer: placerenderer,
    orderBy: {
      field: "name"
    },
    visible: false
  });

  const roadslayer = new GeoJSONLayer({
    url: roadsurl,
    editingEnabled: true,
    copyright: "USGS Earthquakes",
    popupTemplate: roadstemplate,
    renderer: roadsrenderer,
    orderBy: {
      field: "name"
    },
    visible: false
  });
  // 
  var graphicsLayer = new GraphicsLayer();

  const map = new Map({
    basemap: "gray-vector",
    layers: [placelayer, roadslayer]
  });

  const view = new MapView({
    container: "viewDiv",
    center: [47.5769, 40.1431],
    zoom: 7,
    map: map
  });


  const snappingOptions = {
    enabled: true,
    featureSources: [
      {
        layer: graphicsLayer,
        enabled: true
      },
      {
        layer: placelayer,
        enabled: true
      },
      {
        layer: roadslayer,
        enabled: true
      }
    ]
  };



  // 
  var sketch = new Sketch({
    view: view,
    layer: graphicsLayer,
    creationMode: "click",
    //
    creationMode: "update",
    // 
    updateOnGraphicClick: true,
    allowedGeometries: ["polygon", "polyline"],
    snappingOptions: { // autocasts to SnappingOptions()
      enabled: true, // global snapping is turned on
      // assigns a collection of FeatureSnappingLayerSource() and enables feature snapping on this layer
      featureSources: [{ layer: graphicsLayer,placelayer,roadslayer, enabled: true }]
    }

  });







  //
  view.ui.add(sketch, "top-left");



  sketch.on("create", function (event) {
    // check if the create event's state has changed to complete indicating
    // the graphic create operation is completed.
    if (event.state === "complete") {
      const newGraphic = event.graphic;
      if (newGraphic.geometry.type === "polygon") {
        placelayer.applyEdits({
          addFeatures: [newGraphic]
        });
      } else if (newGraphic.geometry.type === "polyline") {
        roadslayer.applyEdits({
          addFeatures: [newGraphic]
        });
      }
    }
  });















  const streetsLayerToggle = document.getElementById("streetlayer");
  const polygonlayerToggle = document.getElementById("polygonlayer");
  streetsLayerToggle.addEventListener("change", () => {
    roadslayer.visible = streetlayer.checked
  }

  )
  polygonlayerToggle.addEventListener("change", () => {
    placelayer.visible = polygonlayer.checked
  }

  )

});
