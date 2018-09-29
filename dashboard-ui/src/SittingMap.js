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
import Student from './Student';

const mapStateToProps = state => ({
   students: state.lesson ? state.lesson.students : {}
});

const mapDispatchToProps = dispatch => ({
});

class SittingMap extends React.Component {

   constructor(props) {
      super(props);
      this.state = {};
   }

   render() {
      const { students } = this.props;

      return <div
         style={{
            minHeight: '550px',
            minWidth: '550px',
            position: 'relative'
         }}
         ref={elem => {
            if (!this.state.elem && elem) {
               this.setState({ elem });
            }
         }}
      >
         { scatterStudents(students, this.state.elem) }
      </div>;
   }

}

// sit arrangement is stored purely client-side


const displacement = 200;

window._sittingMap = {};
window._elemMap = {};
window._draggingTarget = null;
window._dragStart = null;

const scatterStudents = (students, elem) => {
   if (students && elem) {
      const
         box = elem.getClientRects()[0],
         mw = Math.max(Math.max(0, box.width - displacement / 2), displacement / 2),
         mh = Math.max(Math.max(0, box.height - displacement / 2), displacement / 2);

      return Object.keys(students).sort().map(id => {
         const student = students[id];

         if (!window._sittingMap[student.id]) {
            student.position = window._sittingMap[student.id] = {
               offsetX: 0,
               offsetY: 0
            };
         } else {
            student.position = window._sittingMap[student.id];
         }

         return <div
            key={student.id}
            style={{
               position: 'relative',
               display: 'inline-block',
               left: student.position.offsetX,
               top: student.position.offsetY,
               cursor: 'pointer',
               margin: '1em'
            }}
            ref={elem => {elem && (_elemMap[student.id] = elem);}}
            onMouseDown={event => {
               if (!_draggingTarget && _elemMap[student.id]) {
                  // start dragging
                  _draggingTarget = _elemMap[student.id];
                  _dragStart = {
                     x: event.clientX,
                     y: event.clientY,
                     startOffset:  window._sittingMap[student.id]
                  };

                  const
                     f = event => {
                        if (_draggingTarget && _dragStart) {
                           const
                              offset = window._sittingMap[student.id],
                              dispX = event.clientX - _dragStart.x,
                              dispY = event.clientY - _dragStart.y;

                           window._sittingMap[student.id] = {
                              offsetX: _dragStart.startOffset.offsetX + dispX,
                              offsetY: _dragStart.startOffset.offsetY + dispY
                           };

                           _elemMap[student.id].style.left = window._sittingMap[student.id].offsetX + 'px';
                           _elemMap[student.id].style.top = window._sittingMap[student.id].offsetY + 'px'
                        }
                     },
                     g = event => {
                        _draggingTarget = null;
                        _dragStart = null;

                        document.body.removeEventListener('mousemove', f);
                        document.body.removeEventListener('mouseup', g);
                     };

                  document.body.addEventListener('mousemove', f);
                  document.body.addEventListener('mouseup', g);
               }
            }}
         >
            <Student
               id={student.id}
               position={student.position}
               name={student.name}
               activityFeedbackState='COMPLETED'
               activityStudyFactor={0.81}
               overallStudyFactor={0}
            />
         </div>;
      });
   } else {
      return null;
   }
};

export default connect(mapStateToProps, mapDispatchToProps)(SittingMap);
