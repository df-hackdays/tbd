import React from 'react';
import { connect } from 'react-redux';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import StarIcon from '@material-ui/icons/Star';

const mapStateToProps = state => ({
   students: state.lesson ? state.lesson.students : {}
});

const mapDispatchToProps = dispatch => ({
});

class SittingMap extends React.Component {

   render() {
      const { students } = this.props;

      return <div ref={(elem) => { this.container = elem; }}>
         {}
      </div>;
   }

}

const scatterStudents = (students, elem) => {};

export default connect(mapStateToProps, mapDispatchToProps)(SittingMap);
