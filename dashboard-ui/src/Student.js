import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import FaceIcon from '@material-ui/icons/Face';
import HelpIcon from '@material-ui/icons/ContactSupportRounded';
import CompleteIcon from '@material-ui/icons/ThumbUp';
import WaitingIcon from '@material-ui/icons/HourglassEmpty';

export default ({
   id, name, activityStudyFactor, overallStudyFactor, activityFeedbackState
}) => {

   const styles = {
      padding: '1em 1em 10px 1em',
      position: 'relative',
      width: '60px',
      height: '60px',
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center'
   };

   const halfCircleStylesLeft = {
      position: 'absolute',
      width: '36px',
      height: '36px',
      left: '9px',
      top: '50px',
      backgroundColor: getStudyFactorColor(activityStudyFactor),
      borderBottomLeftRadius: '200px',
      borderBottomRightRadius: '0'
   };

   const halfCircleStylesRight = {
      position: 'absolute',
      width: '36px',
      height: '36px',
      left: '46px',
      top: '50px',
      backgroundColor: getStudyFactorColor(overallStudyFactor),
      borderBottomLeftRadius: '0',
      borderBottomRightRadius: '200px'
   };

   return <div style={{ display: 'inline-block' }}>
      <div style={styles}>
         {
            renderBadge(
               activityFeedbackState,
               <Avatar style={{width: 40, height: 40, zIndex: 1}}>
                  <FaceIcon fontSize='large'/>
               </Avatar>
            )
         }
         <div style={halfCircleStylesLeft}></div>
         <div style={halfCircleStylesRight}></div>
      </div>
      <div style={{fontSize: '50%'}}>
         Current / Overall
      </div>
      <div style={{lineHeight: 1.25}}>[{name}]</div>
   </div>;
};

const renderBadge = (state, avatar) => {
   switch (state) {
      case 'COMPLETED':
         return <Badge badgeContent={<CompleteIcon fontSize='small' />} color="primary">
            {avatar}
         </Badge>;
      case 'NEED_HELP':
         return <Badge badgeContent={<HelpIcon fontSize='small' />}  color="error">
            {avatar}
         </Badge>;
      default:
         return <Badge badgeContent={<WaitingIcon fontSize='small' />}  color="default">
            {avatar}
         </Badge>;
   }
}

const getStudyFactorColor = factor => {
   if (factor > 0.8) {
      return 'green';
   } else if (factor > 0.6) {
      return 'limegreen';
   } else if (factor > 0.4) {
      return 'gold';
   } else if (factor > 0.2) {
      return 'orange';
   } else {
      return 'red';
   }
};
