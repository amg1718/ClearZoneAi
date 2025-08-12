import React from 'react';
import { useParams } from 'react-router-dom';
 import PPE from './dashboards/PPE';
import Gestures from './dashboards/Gestures';
import Spill from './dashboards/Spill';
import Fall from './dashboards/Fall';
import Climb from './dashboards/Climb';
import Fire from './dashboards/Fire';
import Missing from './dashboards/Missing';
import Speed from './dashboards/Speed';
const DashboardRouter = () => {
  const { name } = useParams();

  const getDashboardComponent = () => {
    switch (name) {
      case 'ppe1-ppe2':
        return <PPE />;
      case 'mask-ppe1':
        return <Gestures/>;
      case 'spill':
        return <Spill/>;
      case 'fall':
        return <Fall/>
      case 'climb':
        return <Climb/>
      case 'missing':
         return <Missing/>
      case 'speed':
          return <Speed/>
      case 'fire':
          return <Fire/>
        
      
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      {getDashboardComponent()}
    </div>
  );
};

export default DashboardRouter;
