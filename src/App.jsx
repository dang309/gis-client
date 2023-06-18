import { Box, Grid, Stack } from "@mui/material";
import { useState, useEffect } from "react";

import geojson from "./utils/geojson";
import { useRef } from "react";
import { useCallback } from "react";

import Modal from "./components/Modal";

import useSWR from "swr";
import axios from "axios";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

function App() {
  const mapRef = useRef(null);
  const geoJsonRef = useRef(null);
  const infoRef = useRef(null);
  const legendRef = useRef(null);

  const { data: states } = useSWR(
    "http://localhost:1337/api/states?populate=property&pagination[pageSize]=100",
    (url) => {
      return axios.get(url).then((res) => {
        if (res.status === 200) {
          return res.data.data;
        }
      });
    }
  );

  const [shouldOpenModal, setShouldOpenModal] = useState(false);
  const [selectedState, setSelectedState] = useState();

  const handleCloseModal = () => {
    setShouldOpenModal(false);
  };

  function getColor(d) {
    return d > 1000000
      ? "#800026"
      : d > 500000
      ? "#BD0026"
      : d > 200000
      ? "#E31A1C"
      : d > 100000
      ? "#FC4E2A"
      : d > 50000
      ? "#FD8D3C"
      : d > 20000
      ? "#FEB24C"
      : d > 10000
      ? "#FED976"
      : "#FFEDA0";
  }

  const style = useCallback(
    (feature) => {
      if (states && states.length > 0) {
        const state = states.find(
          (state) => state.attributes.name === feature.properties.name
        );
        if (state) {
          if (state.attributes.property && state.attributes.property.data) {
            return {
              fillColor: getColor(
                state.attributes.property.data.attributes.infected
              ),
              weight: 1,
              opacity: 0.7,
              color: "blue",
              dashArray: "7",
              fillOpacity: 0.3,
            };
          }
        }
      }

      return {
        fillColor: getColor(0),
        weight: 1,
        opacity: 0.7,
        color: "blue",
        dashArray: "7",
        fillOpacity: 0.3,
      };
    },
    [states]
  );

  function highlightFeature(e) {
    const layer = e.target;

    layer.setStyle({
      weight: 5,
      color: "red",
      dashArray: "",
      fillOpacity: 0.7,
    });

    layer.bringToFront();

    layer.bindPopup(layer.feature.properties.name).openPopup();

    if (infoRef.current) {
      infoRef.current.update(layer.feature.properties);
    }
  }

  function resetHighlight(e) {
    if (geoJsonRef.current) {
      geoJsonRef.current.resetStyle(e.target);
    }

    if (infoRef.current) {
      infoRef.current.update();
    }
  }

  function handleClickFeature(e) {
    const { feature } = e.target;
    const { properties } = feature;
    if (properties && properties.name) {
      setSelectedState(properties.name);
      setShouldOpenModal(true);
    }
  }

  const onEachFeature = useCallback((feature, layer) => {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: handleClickFeature,
    });
  }, []);

  useEffect(() => {
    const container = window.L.DomUtil.get("map");

    if (container != null) {
      container._leaflet_id = null;
    }

    mapRef.current = window.L.map("map", { doubleClickZoom: false }).setView(
      [37.8, -96],
      4
    );
    geoJsonRef.current = window.L.geoJson(geojson, {
      style,
      onEachFeature,
    }).addTo(mapRef.current);
    infoRef.current = window.L.control();
    legendRef.current = window.L.control({ position: "bottomright" });

    window.L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current.off();
      }
    };
  }, [onEachFeature, style]);

  useEffect(() => {
    if (infoRef.current) {
      infoRef.current.onAdd = function () {
        this._div = window.L.DomUtil.create("div", "info"); // create a div with a class "info"
        this.update();
        return this._div;
      };

      // method that we will use to update the control based on feature properties passed
      infoRef.current.update = function (props) {
        this._div.innerHTML =
          "<h4>US Population Positive</h4>" +
          (props ? "<b>" + props.name + "</b><br />" : "Hover over a state");
      };

      infoRef.current.addTo(mapRef.current);
    }

    if (legendRef.current) {
      legendRef.current.onAdd = function () {
        const div = window.L.DomUtil.create("div", "info legend"),
          grades = [0, 10000, 20000, 50000, 100000, 200000, 500000, 1000000];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (let i = 0; i < grades.length; i++) {
          div.innerHTML +=
            '<i style="background:' +
            getColor(grades[i] + 1) +
            '"></i> ' +
            grades[i].toLocaleString() +
            (grades[i + 1]
              ? "&ndash;" + grades[i + 1].toLocaleString() + "<br>"
              : "+");
        }

        div.innerHTML =
          `<h3 style="text-align:center; font-weight:700" padding: 8px 0;>Positive</h3>` +
          div.innerHTML;

        return div;
      };

      legendRef.current.addTo(mapRef.current);
    }
  }, [states]);

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <Stack direction="column" sx={{ height: "100%" }}>
        <Header />
        <Grid container sx={{ height: "100%", width: "100%" }}>
          <Grid item lg={4} md={4} sx={{ p: 1 }}>
            <Sidebar />
          </Grid>
          <Grid item lg={8} md={8} sx={{ height: "100%", width: "100%", p: 1 }}>
            <div id="map" style={{ height: "100%" }}></div>
          </Grid>
        </Grid>
      </Stack>
      <Modal
        open={shouldOpenModal}
        handleClose={handleCloseModal}
        selectedState={selectedState}
      />
    </Box>
  );
}

export default App;
