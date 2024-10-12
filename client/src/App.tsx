import { useEffect } from 'react';
import './App.css';
import { useAppDispatch, useAppSelector } from "./redux/store";
import { ShowLoading, HideLoading } from "./redux/loaderSlice";
import { fetchUserInfo } from "./redux/userSlice";
import Loader from './components/Loader/Loader';
import Router from './router/Router';

function App() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.loader.isLoading);

  const fetchData = async () => {
    dispatch(ShowLoading());
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); //Timeout to display loader
      await dispatch(fetchUserInfo()).unwrap(); // Unwrap to handle success/error
    } catch (error) {
      console.error('Error fetching user info:', error);
    } finally {
      dispatch(HideLoading());
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  return (
    <div className='App'>
      {isLoading && <Loader />}
      <Router />
    </div>
  )
}

export default App;
