import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  PointElement
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import AppLayout from '../Layouts/AppLayout';
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, ArcElement, PointElement, Tooltip, Legend);

const dummyData = {
  safetyScore: 87,
  ppeCompliance: [
    { day: 'Mon', date: '2025-05-19', helmet: 90, vest: 85, gloves: 70, glasses: 60 },
    { day: 'Tue', date: '2025-05-20', helmet: 92, vest: 80, gloves: 65, glasses: 75 },
    { day: 'Wed', date: '2025-05-21', helmet: 88, vest: 90, gloves: 60, glasses: 70 },
    { day: 'Thu', date: '2025-05-22', helmet: 85, vest: 88, gloves: 55, glasses: 68 },
    { day: 'Fri', date: '2025-05-23', helmet: 87, vest: 83, gloves: 58, glasses: 65 },
  ],
  fireSpill: [
    { date: '2025-05-20', fire: 1, spill: 2 },
    { date: '2025-05-21', fire: 2, spill: 0 },
    { date: '2025-05-22', fire: 0, spill: 3 },
    { date: '2025-05-23', fire: 1, spill: 1 },
  ],
  fallClimb: [
    { date: '2025-05-20', falls: 2, climbs: 1 },
    { date: '2025-05-21', falls: 1, climbs: 0 },
    { date: '2025-05-22', falls: 3, climbs: 2 },
    { date: '2025-05-23', falls: 1, climbs: 1 },
  ],
  evacStatus: [
    { date: '2025-05-20', rescued: 5, unrescued: 1 },
    { date: '2025-05-21', rescued: 7, unrescued: 2 },
    { date: '2025-05-22', rescued: 6, unrescued: 1 },
    { date: '2025-05-23', rescued: 9, unrescued: 3 },
  ],
  gestures: [
    { date: '2025-05-20', zone: 'Zone A', count: 3 },
    { date: '2025-05-20', zone: 'Zone B', count: 1 },
    { date: '2025-05-21', zone: 'Zone A', count: 4 },
    { date: '2025-05-22', zone: 'Zone B', count: 2 },
  ],
  forkliftEvents: [
    { time: '9 AM', date: '2025-05-20', speed: 25 },
    { time: '11 AM', date: '2025-05-21', speed: 28 },
    { time: '3 PM', date: '2025-05-22', speed: 31 },
    { time: '4 PM', date: '2025-05-23', speed: 29 },
  ],
};

function CardWrapper({ title, children, className = '' }) {
  return (
    
    <div className={`card bg-base-100 shadow-xl ${className}`}>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        {children}
      </div>
    </div>
  );
}

function isDateInRange(dateStr, startDate, endDate) {
  const date = new Date(dateStr);
  return date >= startDate && date <= endDate;
}

export default function SafetyDashboard() {
  const [startDate, setStartDate] = useState('2025-05-20');
  const [endDate, setEndDate] = useState('2025-05-22');

  // Filter by date range
  const filteredPpeCompliance = dummyData.ppeCompliance.filter(({ date }) =>
    isDateInRange(date, new Date(startDate), new Date(endDate))
  );
  const filteredFireSpill = dummyData.fireSpill.filter(({ date }) =>
    isDateInRange(date, new Date(startDate), new Date(endDate))
  );
  const filteredFallClimb = dummyData.fallClimb.filter(({ date }) =>
    isDateInRange(date, new Date(startDate), new Date(endDate))
  );
  const filteredForkliftEvents = dummyData.forkliftEvents.filter(({ date }) =>
    isDateInRange(date, new Date(startDate), new Date(endDate))
  );

  // Filter gestures by date and aggregate counts by zone
  const filteredGestures = dummyData.gestures
    .filter(({ date }) => isDateInRange(date, new Date(startDate), new Date(endDate)))
    .reduce((acc, curr) => {
      acc[curr.zone] = (acc[curr.zone] || 0) + curr.count;
      return acc;
    }, {});
  const gestureZones = Object.keys(filteredGestures);
  const gestureCounts = gestureZones.map((zone) => filteredGestures[zone]);

  // Filter evacuation by date and sum rescued/unrescued counts
  const filteredEvac = dummyData.evacStatus.filter(({ date }) =>
    isDateInRange(date, new Date(startDate), new Date(endDate))
  );
  const totalRescued = filteredEvac.reduce((sum, entry) => sum + entry.rescued, 0);
  const totalUnrescued = filteredEvac.reduce((sum, entry) => sum + entry.unrescued, 0);

  return (
    <AppLayout>
    <div className="p-6">
      
      <div className="mb-6 flex flex-wrap gap-4 items-center mt-12">
        <label className="flex flex-col">
          <span>Start Date</span>
          <input
            type="date"
            className="input input-bordered"
            value={startDate}
            max={endDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label className="flex flex-col">
          <span>End Date</span>
          <input
            type="date"
            className="input input-bordered"
            value={endDate}
            min={startDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <CardWrapper title="Safety Score" className="col-span-full">
          <p className="text-3xl font-bold">{dummyData.safetyScore}%</p>
        </CardWrapper>

        <CardWrapper title="PPE Compliance Trends">
          <Bar
            data={{
              labels: filteredPpeCompliance.map((d) => d.day),
              datasets: [
                { label: 'Helmet', data: filteredPpeCompliance.map((d) => d.helmet), backgroundColor: 'rgba(255, 99, 132, 0.5)' },
                { label: 'Vest', data: filteredPpeCompliance.map((d) => d.vest), backgroundColor: 'rgba(54, 162, 235, 0.5)' },
                { label: 'Gloves', data: filteredPpeCompliance.map((d) => d.gloves), backgroundColor: 'rgba(255, 206, 86, 0.5)' },
                { label: 'Glasses', data: filteredPpeCompliance.map((d) => d.glasses), backgroundColor: 'rgba(75, 192, 192, 0.5)' },
              ],
            }}
            options={{ responsive: true }}
          />
        </CardWrapper>

        <CardWrapper title="Fire & Spill Detection">
          <Line
            data={{
              labels: filteredFireSpill.map((d) => d.date),
              datasets: [
                { label: 'Fire', data: filteredFireSpill.map((d) => d.fire), borderColor: 'red', backgroundColor: 'rgba(255, 0, 0, 0.1)', fill: true, tension: 0.3 },
                { label: 'Spill', data: filteredFireSpill.map((d) => d.spill), borderColor: 'blue', backgroundColor: 'rgba(0, 0, 255, 0.1)', fill: true, tension: 0.3 },
              ],
            }}
            options={{ responsive: true }}
          />
        </CardWrapper>

        <CardWrapper title="Fall & Climb Detection">
          <Bar
            data={{
              labels: filteredFallClimb.map((d) => d.date),
              datasets: [
                { label: 'Falls', data: filteredFallClimb.map((d) => d.falls), backgroundColor: 'rgba(153, 102, 255, 0.5)' },
                { label: 'Climbs', data: filteredFallClimb.map((d) => d.climbs), backgroundColor: 'rgba(255, 159, 64, 0.5)' },
              ],
            }}
            options={{ responsive: true }}
          />
        </CardWrapper>

        <CardWrapper title="Evacuation Status">
          <Pie
            data={{
              labels: ['Rescued', 'Unrescued'],
              datasets: [
                { data: [totalRescued, totalUnrescued], backgroundColor: ['green', 'red'] },
              ],
            }}
            options={{ responsive: true }}
          />
        </CardWrapper>

        <CardWrapper title="Emergency Gestures">
          <Bar
            data={{
              labels: gestureZones,
              datasets: [
                { label: 'Gestures Detected', data: gestureCounts, backgroundColor: 'orange' },
              ],
            }}
            options={{ responsive: true }}
          />
        </CardWrapper>

        <CardWrapper title="Forklift Overspeed Events">
          <Line
            data={{
              labels: filteredForkliftEvents.map((e) => e.time),
              datasets: [
                { label: 'Speed (km/h)', data: filteredForkliftEvents.map((e) => e.speed), borderColor: 'purple', backgroundColor: 'rgba(128, 0, 128, 0.1)', fill: true },
              ],
            }}
            options={{ responsive: true }}
          />
        </CardWrapper>
      </div>
    </div>
    </AppLayout>
  );
}
