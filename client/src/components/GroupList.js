import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Fade from '@mui/material/Fade';
import { useNavigate } from 'react-router-dom';

export default function FolderList() {
  const groups = [
    { name: "Group 1", img: require('../assets/img/logoPlaceholder.png') },
    { name: "Group 2", img: require('../assets/img/logoPlaceholder3.png') },
    { name: "Group 3", img: require('../assets/img/placeholderlogo2.jpg') },
    { name: "Group 4", img: require('../assets/img/placeholderlogo2.jpg') },
    { name: "Group 5", img: require('../assets/img/placeholderlogo2.jpg') },
    { name: "Group 6", img: require('../assets/img/placeholderlogo2.jpg') },
    { name: "Group 7", img: require('../assets/img/placeholderlogo2.jpg') }
  ];
  const navigate = useNavigate();

  //To do - add a limit to how much groups can be displayed at once to prevent overload.

  const handleNavigate = (groupName, placeholderImg) => {
    navigate('/Group', { state: {groupName, placeholderImg}});
  }

  return (
    <List sx={{width: '100%', maxWidth: "100%", display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center',  bgcolor: 'background.paper' }}>
      {groups.map((group, index) => (
      <Fade in={true} timeout={{ enter: 500 + index * 300 }}>
      <ListItem sx={{justifyContent: 'center', width: "50%"}} button onClick={() => handleNavigate(group.name, group.img)}>
        <ListItemAvatar>
        <Avatar sx={{width: "100px", height: "100px"}} alt="Placeholder" src={group.img}/>
        </ListItemAvatar>
        <ListItemText sx={{marginLeft: "10px"}} primary={group.name} />
      </ListItem>
      </Fade>
      ))}
    </List>
  );
}
