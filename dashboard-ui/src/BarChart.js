import React from 'react';
import { connect } from 'react-redux';
import { ResponsiveBar } from '@nivo/bar'

const mapStateToProps = state => ({
   activities: state.activities,
   events: state.lesson ? state.lesson.events : []
});

const mapDispatchToProps = dispatch => ({
});

class BarChart extends React.Component {

   render() {
      const { events } = this.props;

      return <div style={{ marginLeft: '3em', width: '500px', height: '180px' }}>
         <ResponsiveBar
            width={800}
            height={180}
            data={reducerByAct(events)}
            colors="nivo"
            indexBy="activityId"
            keys={['Completed', 'Needed Help', 'Undecided']}
         />
      </div>;
   }

}

const reducerByAct = events => Object.values(
   events.reduce((accu, evt, idx) => {
      if (!accu[evt.activityId]) {
         accu[evt.activityId] = {
            'activityId': evt.activityId,
            'Completed': 0,
            'Needed Help': 0,
            'Undecided': 0
         };
      }

      switch (evt.status) {
         case 'COMPLETED':
            accu[evt.activityId]['Completed'] += 1;
            break;
         case 'NEED_HELP':
            accu[evt.activityId]['Needed Help'] += 1;
            break;
         default:
            accu[evt.activityId]['Undecided'] += 1;
            break;
      }

      return accu;
   }, {})
);

export default connect(mapStateToProps, mapDispatchToProps)(BarChart);




