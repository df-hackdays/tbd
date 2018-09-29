import React from 'react';
import { connect } from 'react-redux';
import { ResponsivePie } from '@nivo/pie'

const mapStateToProps = state => ({
   events: state.lesson ? state.lesson.events : []
});

const mapDispatchToProps = dispatch => ({
});

class PieChart extends React.Component {

   render() {
      const { events } = this.props;

      const data = [
         { id: 'Completed', value: events.filter(evt => evt.type === 'FEEDBACK').filter(e => e.status === "COMPLETED").length },
         { id: 'Needed Help', value: events.filter(evt => evt.type === 'FEEDBACK').filter(e => e.status === "NEED_HELP").length },
         { id: 'Undecided', value: events.filter(evt => evt.type === 'FEEDBACK').filter(e => e.status !== "NEED_HELP" && e.status !== "COMPLETED").length }
      ];

      return <div style={{ width: '300px', height: '160px', display: 'inline-block' }}>
         <ResponsivePie
            colors="nivo"
            innerRadius={0.5}
            padAngle={5}
            data={data}
            margin={{
               "top": 40,
               "right": 40,
               "bottom": 40,
               "left": 40
           }}
         />
      </div>;
   }

}

export default connect(mapStateToProps, mapDispatchToProps)(PieChart);
