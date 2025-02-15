import React, { useEffect, useState } from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { useNavigate } from "react-router-dom";
import UploadIcon from "../../assets/uploadicon.jpg"
import { Waveform } from '@uiball/loaders'
import Category from './Category';
import {Toaster,toast} from 'react-hot-toast'
export default function OrganiserTournamentForm() {
  const categories=[
    "Tournament", "Hackathon", "Event"
  ]
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(new Date());
  const[rules,setRules]=useState("");
  const[prize1,setPrize1]=useState("");
  const[prize2,setPrize2]=useState("");
  const[prize3,setPrize3]=useState("");
  const[bannerImg,setBannerImg]=useState("");
  const[teamSize,setTeamSize]=useState("");
  const[location,setLocation]=useState("");
  const[image,setImage]=useState("");
  const[url,setUrl]=useState("");
  const[isLoading, setIsLoading]=useState(false);
  const[category,setCategory]=useState(categories[0])
  const navigator=useNavigate();
  
  const loadFile = (e) => {
    let output = document.getElementById("output");
    output.src = URL.createObjectURL(e.target.files[0]);
    output.onload = () => {
      URL.revokeObjectURL(output.src);
    };
  };
  const sendImageToCloudinary = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "battlehost_assets");
    data.append("cloud_name", `${import.meta.env.VITE_CLOUD_KEY}`);
    fetch(`${import.meta.env.VITE_CLOUD_URL}`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
        setIsLoading(false)
      })
      .catch((err) => console.log(err));
  };
  const createTournament = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/tournament/createtournament`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: title,
                description: description,
                category,
                startDateTime: startDateTime,
                endDateTime: endDateTime,
                rules: rules,
                prizes: [
                    {
                        name: 'winner',
                        description: prize1
                    },
                    {
                        name: '1st RunnerUp',
                        description: prize2
                    },
                    {
                        name: '2nd RunnerUp',
                        description: prize3
                    }
                ],
                bannerImg: url,
                teamSize: teamSize,
                location: location
            }),
            credentials: 'include', // Send cookies with the request
        });

        const data = await response.json();
        if(data.stack!==null){
       toast.success(data.message)
        navigator("/dashboard")
        }
        else{
          toast.error(data.message)
        }
        // console.log(data)
        setIsLoading(false)
        
    } catch (error) {

        // console.error(error);
        setIsLoading(false)

    }
};
useEffect(()=>{
    if(!document.cookie.split('=')[1]){
        navigator('/signin')
        }
        if(JSON.parse(localStorage.getItem('user_data'))?.role!=='Host'){
          navigator('/accessdenied')
          }
},[])
useEffect(()=>{
if(url){
  createTournament()
}
},[url])
    
  return (
    <>
    <div><Toaster
    position="top-center"
    reverseOrder={false}
    /></div>
    <Navbar/>
    <div className='OrganiserTournamentForm bg-white m-auto w-9/12 md:w-1/2 mt-8 mb-24'>
    <form onSubmit={(e)=>{
      e.preventDefault(); 
      setIsLoading(true)
      sendImageToCloudinary();
    }}>
      <div className="space-y-12">
        <div >
          <h2 className="text-xl md:text-3xl font-bold leading-tight text-black sm:text-4xl">Create your own Tournamnet</h2>
          {/* <p className="mt-1 text-sm leading-6 text-gray-600">
            This information will be displayed publicly so be careful what you share.
          </p> */}

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-8">
              <label htmlFor="title" className="block text-base font-medium text-gray-900">
                Tournament Name
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="about" className="block text-base font-medium text-gray-900">
                Description
              </label>
              <div className="mt-2">
                <textarea
                  id="about"
                  name="about"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  
                />
              </div>
            </div>
            <div className="col-span-full">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="category"
            >
              Category
            </label>
            {/* <input
  className="flex h-10 w-full rounded-md border border-black/30 bg-transparent px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
  type="text"
  placeholder="Enter the category"
  id="category"
  required
></input>*/}
            <Category
              selected={category}
              setSelected={setCategory}
              category={categories}
            />
          </div>
            <div className="col-span-full">
              <label htmlFor="cover-photo" className="block text-base font-medium text-gray-900">
                Cover photo
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
        {/*<PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" id='output'/>*/}
                  <img src={UploadIcon} alt="no preview" id='output' height={250} className='m-auto w-16 md:w-28'/>
                  <div className="mt-4 md:flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" accept='image/*' 
                      onChange={(e)=>{
                        loadFile(e)
                        setImage(e.target.files[0])
                        // console.log(e.target.files[0])
                      }}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>

            <div className="col-span-full sm:col-span-3">
              <label htmlFor="location" className="block text-base font-medium text-gray-900">
                Location
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className=" col-span-full sm:col-span-3">
              <label htmlFor="startDate" className="block text-base font-medium text-gray-900">
              Start Date
              </label>
              <div className=" mt-2">
                <input
                  type="date"
                  name="startDate"
                  id="startDate"
                  value={startDateTime} 
                  onChange={(e) => setStartDateTime(e.target.value)}
                  className="block  w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-full sm:col-span-3">
              <label htmlFor="endDate" className="block text-base font-medium text-gray-900">
              End Date
              </label>
              <div className="mt-2">
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={endDateTime} 
                  onChange={(e) => setEndDateTime(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-2">
              <label htmlFor="teamSize" className="block text-base font-medium text-gray-900">
              Team Size
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  min="0"
                  name="teamSize"
                  id="teamSize"
                  autoComplete="teamSize"
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="rules" className="block text-base font-medium text-gray-900">
              Tournament Rules
              </label>
              <div className="mt-2">
                <textarea
                  name="rules"
                  id="rules"
                  rows={3}
                  value={rules}
                  onChange={(e) => setRules(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"

                />
              </div>
            </div>

            {/* <h2 className="block text-base font-medium text-gray-900">
              Prize Description
              </h2> */}
            <div className="col-span-3">
              <label htmlFor="prize1" className="block text-base font-medium text-gray-900">
              1st Prize
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="prize1"
                  id="prize1"
                  autoComplete="prize1"
                  value={prize1}
                  onChange={(e) => setPrize1(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-3">
              <label htmlFor="prize2" className="block text-base font-medium text-gray-900">
              2nd Prize
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="prize2"
                  id="prize2"
                  autoComplete="prize2"
                  value={prize2}
                  onChange={(e) => setPrize2(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-3">
              <label htmlFor="prize3" className="block text-base font-medium text-gray-900">
              3rd Prize
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="prize3"
                  id="prize3"
                  value={prize3}
                  onChange={(e) => setPrize3(e.target.value)}
                  autoComplete="prize3"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            
          </div>
        </div>

       
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
          Cancel
        </button>
        {!isLoading?
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
          Save
        </button>
        :
        <button
        type="submit"
        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
        <Waveform 
 size={20}
 lineWeight={3.5}
 speed={1} 
 color="white" 
/>
      </button>
        }
      </div>
    </form>
    </div>
    </>
  )
}
