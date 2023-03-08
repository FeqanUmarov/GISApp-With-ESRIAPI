require(["esri/Map", "esri/layers/GeoJSONLayer", "esri/views/MapView"], (
  Map,
  GeoJSONLayer,
  MapView
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
      width:1
    }
  }




    const placelayer = new GeoJSONLayer({
      url: placeurl,
      copyright: "USGS Earthquakes",
      popupTemplate: placetemplate,
      renderer: placerenderer,
      orderBy: {
        field: "name"
      },
      visible:false
    });

    const roadslayer = new GeoJSONLayer({
      url: roadsurl,
      copyright: "USGS Earthquakes",
      popupTemplate: roadstemplate,
      renderer: roadsrenderer,
      orderBy: {
        field: "name"
      },
      visible:false
    });

    const map = new Map({
      basemap: "gray-vector",
      layers: [placelayer,roadslayer]
    });

    const view = new MapView({
      container: "viewDiv",
      center: [47.5769, 40.1431],
      zoom: 7,
      map: map
    });

    const streetsLayerToggle = document.getElementById("streetlayer");
    const polygonlayerToggle = document.getElementById("polygonlayer");
    streetsLayerToggle.addEventListener("change",()=>{
      roadslayer.visible = streetlayer.checked
    }

    )
    polygonlayerToggle.addEventListener("change",()=>{
      placelayer.visible = polygonlayer.checked
    }

    )

  });