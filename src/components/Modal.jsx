import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import axios from "axios";
import { useState } from "react";
import {
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
} from "recharts";

import useSWR from "swr";

export default function Modal({ open, handleClose, selectedState }) {
  const [chartData, setChartData] = useState();

  const { data: state, isLoading } = useSWR(
    `http://localhost:1337/api/states?populate=*&filters[name][$eq]=${selectedState}`,
    (url) => {
      return axios.get(url).then((res) => {
        if (res.status === 200) {
          const state = res.data.data[0];
          let _chartData = state.attributes.cases.data
            .map((item) => ({
              date: item.attributes.date,
              positive: item.attributes.infected,
            }))
            .sort((a, b) => {
              return new Date(a.date) - new Date(b.date);
            });

          setChartData(_chartData);
          return state;
        }
      });
    }
  );

  return (
    selectedState && (
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="xl"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {state?.attributes && state.attributes.name}
          </DialogTitle>
          <DialogContent sx={{ p: 2, paddingTop: "16px !important" }}>
            <Stack spacing={2}>
              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <Paper elevation={4} sx={{ p: 2 }}>
                    <Stack direction="column">
                      <Typography sx={{ fontSize: "24px", fontWeight: 700 }}>
                        Population
                      </Typography>
                      <Typography sx={{ fontSize: "20px" }}>
                        {state?.attributes.property.data.attributes.population.toLocaleString()}
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>

                <Grid item>
                  <Paper elevation={4} sx={{ p: 2 }}>
                    <Stack direction="column">
                      <Typography sx={{ fontSize: "24px", fontWeight: 700 }}>
                        Tested
                      </Typography>
                      <Typography sx={{ fontSize: "20px" }}>
                        {state?.attributes.property.data.attributes.tested.toLocaleString()}
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>

                <Grid item>
                  <Paper elevation={4} sx={{ p: 2 }}>
                    <Stack direction="column">
                      <Typography sx={{ fontSize: "24px", fontWeight: 700 }}>
                        Infected
                      </Typography>
                      <Typography sx={{ fontSize: "20px" }}>
                        {state?.attributes.property.data.attributes.infected.toLocaleString()}
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>

                <Grid item>
                  <Paper elevation={4} sx={{ p: 2 }}>
                    <Stack direction="column">
                      <Typography sx={{ fontSize: "24px", fontWeight: 700 }}>
                        Deaths
                      </Typography>
                      <Typography sx={{ fontSize: "20px" }}>
                        {state?.attributes.property.data.attributes.deaths.toLocaleString()}
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>

                <Grid item>
                  <Paper elevation={4} sx={{ p: 2 }}>
                    <Stack direction="column">
                      <Typography sx={{ fontSize: "24px", fontWeight: 700 }}>
                        GDP
                      </Typography>
                      <Typography sx={{ fontSize: "20px" }}>
                        {state?.attributes.property.data.attributes.gdp.toLocaleString()}
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>

              <Paper sx={{ p: 4 }} elevation={4}>
                {!isLoading && chartData && (
                  <ResponsiveContainer height={512} width="100%">
                    <ComposedChart
                      data={chartData}
                      margin={{ top: 0, right: 4, left: 32, bottom: 64 }}
                    >
                      <CartesianGrid strokeDasharray="10 10" />
                      <XAxis dataKey="date" angle={-45} textAnchor="end" />
                      <YAxis />
                      <Tooltip />
                      <Legend align="center" verticalAlign="top" />
                      <Area
                        type="monotone"
                        dataKey="positive"
                        fill="blue"
                        stroke="blue"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                )}
                {isLoading && (
                  <Stack
                    sx={{ height: "100%", width: "100%" }}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <CircularProgress />
                  </Stack>
                )}
                {!isLoading && !chartData && (
                  <Stack
                    sx={{ height: "100%", width: "100%" }}
                    alignItems="center"
                    justifyContent="center"
                  >
                    {" "}
                    No chart data{" "}
                  </Stack>
                )}
              </Paper>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="contained">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  );
}
