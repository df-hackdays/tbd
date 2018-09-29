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
   activities: state.lesson ? state.lesson.activities : []
});

const mapDispatchToProps = dispatch => ({
});

class ActivityList extends React.Component {

   render() {
      const { classes, activities } = this.props;

      return <Paper square>
         <List
            dense
            component="nav"
            subheader={<ListSubheader component="div">Lesson Activities:</ListSubheader>}
         >
            {
               activities.map((activity, idx) => {
                  return <React.Fragment key={idx}>
                     <ListItem>
                        {
                           activity.state === 'CURRENT' && <ListItemIcon>
                              <StarIcon />
                           </ListItemIcon>
                        }
                        <ListItemText inset primary={activity.name} />
                     </ListItem>
                     { idx < activities.length - 1 && <Divider /> }
                  </React.Fragment>;
               })
            }
         </List>
      </Paper>;
   }

}

export default connect(mapStateToProps, mapDispatchToProps)(ActivityList);
