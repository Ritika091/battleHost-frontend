import React,{useState,useEffect} from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import TournamentsCard from '../../Components/TournamentsCard/TournamentsCard';
import { Link, useParams } from 'react-router-dom';
import SkeletalCardLayout from '../../Components/SkeletalCardLayout/SkeletalCardLayout';

export default function HostDashboard() {
  const [tournaments, setTournaments] = useState([]);
  const [loading,setLoading]=useState(true)
  const getAllTournaments = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/tournament/alltournaments`
    );
    const data = await response.json();
    // console.log(data);
    setTournaments(data.allTournaments)
    setLoading(false)
  };
  useEffect(() => {
    getAllTournaments();
  }, []);
  return (
    <>
    <Navbar/>
     <div className='HostDashboard mt-12'>
     <h1 className='text-3xl font-extrabold ml-4 md:ml-16'>My Tournaments</h1>
     <div className='flex flex-wrap justify-center md:justify-none'>
     {loading && <SkeletalCardLayout/>}
     {tournaments?.filter(filt=>filt.organizerId._id===JSON.parse(localStorage.getItem('user_data'))?._id)?.map(tournament=>(
      <Link to={`/hostdashboard/manage/${tournament._id}/general`}>
      <TournamentsCard key={tournament._id} tournament={tournament} buttonContent={'Manage'}/>
      </Link>
     ))
    
     }
     </div>
     
     </div>
    </>
   
  )
}
