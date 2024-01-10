
import React, { useState, useEffect } from 'react';
import { CircularProgress, Button, Card, CardContent, CardActions, Typography } from '@mui/material';
import { deleteUserData, fetchRandomUserData, saveUserData, getAllUserData } from './api';

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const storedData = await getAllUserData();
        if (storedData.length === 0) {
          const newData = await fetchRandomUserData();
          await saveUserData(newData);
          setUserData(newData);
        } else {
          setUserData(storedData);
        }
      } catch (error) {
        console.error('Error fetching or saving data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const data = await fetchRandomUserData();
      await saveUserData(data);
      setUserData(data);
    } catch (error) {
      console.error('Error fetching or saving data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteUserData(id);
    const allData = await getAllUserData();
    setUserData(allData);
  };

  return (
    <div>
      <Button variant="contained" onClick={handleRefresh}>
        Refresh
      </Button>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Typography variant="h6">Total Items: {userData.length}</Typography>
          {userData.map((user) => (
            <Card key={user.id}>
              <CardContent>
                <img src={user.picture.thumbnail} alt={user.name.first} />
                <Typography variant="h6">{`${user.name.first} ${user.name.last}`}</Typography>
              </CardContent>
              <CardActions>
                <Button onClick={() => handleDelete(user.id)}>Delete</Button>
              </CardActions>
            </Card>
          ))}
        </>
      )}
    </div>
  );
};

export default App;
