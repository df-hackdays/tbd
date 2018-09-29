import React from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { fetchLesson, sendMessage } from './utils/awscli';

import ActivityList from './ActivityList';
import SittingMap from './SittingMap';

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
   button: {
      margin: theme.spacing.unit,
   }
});

const lessonId = window.location.hash.substring('#/lesson/'.length);
var _reload_task_id;

const App = ({ lesson, loadLesson, classes }) => {
   if (!_reload_task_id) {
      loadLesson(lessonId);

      _reload_task_id = setInterval(
         () => loadLesson(lessonId),
         5000 // TODO: reduce to 2 to 5 seconds
      );

      sendMessage({
         type: 'CREATE_LESSON_IF_ABSENT',
         lessonId: lessonId
      });
   }

   const nextActivity = lesson => sendMessage({
      type: 'NEXT_ACTIVITY',
      lessonId: lesson.id
   }).then(
      () => setTimeout(
         () => loadLesson(lesson.id),
         800
      )
   );

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
               <Paper square className={classes.paper}>time line chart</Paper>
            </Grid>
            <Grid item xs={3}>
               <ActivityList />
               <Button
                     variant="contained"
                     style={{ width: '100%', marginTop: '1em' }}
                     onClick={() => lesson && nextActivity(lesson)}>
                  Start Next Activity
               </Button>
            </Grid>
            <Grid item xs={9}>
               <Paper square className={classes.paper} style={{ minHeight: '550px' }}>
                  <Typography gutterBottom variant="headline" component="h2">
                     Classroom
                  </Typography>
                  <SittingMap />
               </Paper>
            </Grid>
         </Grid>
      </div>
   </div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(App));
