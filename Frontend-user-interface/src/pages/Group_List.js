import '../styles/GameList.css'
import React, {useEffect, useState} from 'react';
import {redirect} from "react-router-dom";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import {Box, ListItemButton, ListItemText, Divider, List, Fab, Toolbar, Typography, AppBar} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from "@mui/material/CircularProgress";

const GroupList = () => {
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;
    const [groups, setGroups] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const handleDetails = (id) => {
        console.log(groups[id].groupId);
        navigate('/ex', {state: groups[id].groupId})
    };

    const fetchGroups = (uid) => {
        fetch(`${apiUrl}api/user/${uid}`)
            .then(response => response.ok ? response.json() : Promise.reject("Error fetching groups"))
            .then(data => {
                setGroups(data);
                setIsLoaded(true);
            })
            .catch(error => console.log('error: ' + error));
    };

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchGroups(user.uid);
            } else {
                redirect('/login');
            }
        });
    }, []);

    if (!isLoaded) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                <CircularProgress/>
            </Box>
        );
    }
    return (
        <Box>
            <AppBar position="fixed" color="primary" style={{marginTop: 55, backgroundColor: "grey", height: 45}}>
                <Toolbar>
                    <Typography variant="h6">Groups</Typography>
                </Toolbar>
            </AppBar>
            <List component="nav">
                {Object.keys(groups).length === 0 ? (
                    <ListItemText primary="You have no groups."/>
                ) : (
                    Object.keys(groups).map(id => (
                        <React.Fragment key={id}>
                            <ListItemButton
                                onClick={() => handleDetails(id)}
                            >
                                <ListItemText
                                    primary={groups[id].title}
                                    secondary={groups[id].description || "No description"}
                                />
                            </ListItemButton>
                            <Divider/>
                        </React.Fragment>
                    ))
                )}
            </List>
            <Box sx={{position: 'fixed', bottom: 16, right: 16, zIndex: 1000}}>
                <Fab color="primary" aria-label="add" onClick={() => navigate('/grpc')}>
                    <AddIcon/>
                </Fab>
            </Box>
        </Box>
    );
};

export default GroupList;
