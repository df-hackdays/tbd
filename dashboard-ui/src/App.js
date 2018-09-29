import React from 'react';
import { connect } from 'react-redux'

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

var _reload_task_id;

const App = props => {
   const lessonId = window.location.hash.substring('#/lesson/'.length);

   if (!_reload_task_id) {
      props.loadLesson(lessonId);

      _reload_task_id = setInterval(
         () => props.loadLesson(lessonId),
         30000 // TODO: reduce to 2 to 5 seconds
      );
   }

   return <pre>{ props.lesson ? JSON.stringify(props.lesson, null, 2): "loading" }</pre>;
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
