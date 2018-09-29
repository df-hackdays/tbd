import React from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { fetchLesson } from './utils/awscli';

const mapStateToProps = state => ({
   lesson: state.lesson
});

const mapDispatchToProps = dispatch => ({
   loadLesson: lessonId => fetchLesson(lessonId)
      .then(lesson => dispatch({
         type: 'LESSON_LOADED',
         payload: lesson
      }))
});

const styles = theme => ({
   root: {
      flexGrow: 1,
   },
   paper: {
      padding: theme.spacing.unit * 2,
      textAlign: 'center',
      color: theme.palette.text.secondary,
   },
});

const lessonId = window.location.hash.substring('#/lesson/'.length);
var _reload_task_id;

const App = ({ loadLesson, classes }) => {
   if (!_reload_task_id) {
      loadLesson(lessonId);

      _reload_task_id = setInterval(
         () => loadLesson(lessonId),
         30000 // TODO: reduce to 2 to 5 seconds
      );
   }

   return <div className={classes.root}>
      <AppBar position="static">
         <Toolbar>
            <Typography variant="title" color="inherit">
            Lesson: {lessonId}
            </Typography>
        </Toolbar>
      </AppBar>
      <div style={{ margin: '1em 4em' }}>
         <Grid container spacing={16}>
            <Grid item xs={12}>
               <Paper className={classes.paper}>time line chart</Paper>
            </Grid>
            <Grid item xs={3}>
               <Paper className={classes.paper}>activity list</Paper>
            </Grid>
            <Grid item xs={9}>
               <Paper className={classes.paper}>sitting chart</Paper>
            </Grid>
         </Grid>
      </div>
   </div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(App));
