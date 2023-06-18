import { Stack, Divider, Chip } from "@mui/material";
import {
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Area,
  Bar,
  Line,
  ResponsiveContainer,
} from "recharts";
import DataTable from "./DataTable";

import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

import useSWR from "swr";
import axios from "axios";
import moment from "moment";
import { useState } from "react";

const Sidebar = () => {
  const { data: chartData } = useSWR(
    "https://api.covidtracking.com/v1/us/daily.json",
    (url) => {
      return axios.get(url).then((res) => {
        if (res.status === 200) return res.data;
      });
    }
  );

  const [selectedDuration, setSelectedDuration] = useState(7);

  return (
    <SimpleBar style={{ maxHeight: "100%" }}>
      <Stack
        direction="column"
        spacing={2}
        divider={<Divider orientation="vertical" flexItem />}
        sx={{ maxHeight: "100%" }}
      >
        <DataTable />
        <Stack direction="row" justifyContent="center" spacing={1}>
          <Chip
            label="7 days"
            color="primary"
            variant={selectedDuration === 7 ? "filled" : "outlined"}
            onClick={() => setSelectedDuration(7)}
          />
          <Chip
            label="30 days"
            color="primary"
            variant={selectedDuration === 30 ? "filled" : "outlined"}
            onClick={() => setSelectedDuration(30)}
          />
          <Chip
            label="60 days"
            color="primary"
            variant={selectedDuration === 60 ? "filled" : "outlined"}
            onClick={() => setSelectedDuration(60)}
          />
        </Stack>
        {chartData && (
          <ResponsiveContainer width="100%" height={256}>
            <ComposedChart
              data={
                chartData.length > 0
                  ? chartData
                      .map((item) => ({
                        date: moment(item.date, "YYYYMMDD").format(
                          "DD/MM/YYYY"
                        ),
                        positive: item.positive || 0,
                      }))
                      .slice(0, selectedDuration)
                      .reverse()
                  : []
              }
              margin={{ left: 32, bottom: 64 }}
            >
              <XAxis dataKey="date" angle={-45} textAnchor="end" />
              <YAxis />
              <Tooltip />
              <Legend align="center" verticalAlign="top" />
              <CartesianGrid stroke="#f5f5f5" />
              {selectedDuration === 7 && (
                <Bar
                  type="monotone"
                  dot={false}
                  dataKey="positive"
                  stroke="blue"
                  fill="blue"
                />
              )}
              {selectedDuration === 30 && (
                <Line
                  type="monotone"
                  dot={false}
                  dataKey="positive"
                  stroke="blue"
                />
              )}
              {selectedDuration === 60 && (
                <Area
                  type="monotone"
                  dot={false}
                  dataKey="positive"
                  stroke="blue"
                  fill="blue"
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        )}
        {chartData && (
          <ResponsiveContainer width="100%" height={256}>
            <ComposedChart
              data={
                chartData.length > 0
                  ? chartData
                      .map((item) => ({
                        date: moment(item.date, "YYYYMMDD").format(
                          "DD/MM/YYYY"
                        ),
                        death: item.death || 0,
                      }))
                      .slice(0, selectedDuration)
                      .reverse()
                  : []
              }
              margin={{ left: 12, bottom: 64 }}
            >
              <XAxis dataKey="date" angle={-45} textAnchor="end" />
              <YAxis />
              <Tooltip />
              <Legend align="center" verticalAlign="top" />
              <CartesianGrid stroke="#f5f5f5" />
              {selectedDuration === 7 && (
                <Bar
                  type="monotone"
                  dot={false}
                  dataKey="death"
                  stroke="red"
                  fill="red"
                />
              )}
              {selectedDuration === 30 && (
                <Line
                  type="monotone"
                  dot={false}
                  dataKey="death"
                  stroke="red"
                />
              )}
              {selectedDuration === 60 && (
                <Area
                  type="monotone"
                  dot={false}
                  dataKey="death"
                  stroke="red"
                  fill="red"
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </Stack>
    </SimpleBar>
  );
};

export default Sidebar;
