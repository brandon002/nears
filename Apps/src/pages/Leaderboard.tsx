import React,{ useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Vector from "../assets/user.svg";
import { NavbarUser, ProfileCard } from "../components";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUsersAction } from "../redux/slices/profileSlice";
import { getLeaderBoardAction } from "../redux/slices/leaderBoardSlice";
import { getSkillInterestAction } from "../redux/slices/profileSlice";
import {
    Input,
    InputGroup,
    InputLeftElement,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Select,
    Avatar,
    Flex,
    Divider,
    CircularProgress
  } from '@chakra-ui/react'
const Leaderboard = (props: any) => {
    const navigate = useNavigate(); 
    const dispatch = useDispatch<any>();
    const profile = useSelector((state:any)=> state.profile); 
    const leaderboard = useSelector((state:any)=> state.leaderboard); 
    const [interest, setInterest] = useState('');
    const [selected, setSelected] = useState(0);
    const [interestName, setInterestName] = useState('');
    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
      );
      
    const options = {
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: `${interestName} Leaderboard`,
          },
        },
      };
    const datasetBg = ["#4C5FA6", "#f46a9b", "#ef9b20", "#edbf33", "#ede15b", "#bdcf32", "#87bc45", "#27aeef", "#b33dc6"];
    const [labels, setLabels]:any = useState([]);
    function handleConfigCreateMeeting(e:any){
        setInterest(e.value)
        setSelected(e.selectedIndex)
        setInterestName(e.options[e.selectedIndex].label)
        setTimeout(()=>{
          dispatch(getLeaderBoardAction({skillInterestId: e.value, limit: 10}));
        }, 2)
    }
    useEffect(()=>{
        if(profile?.skillInterest?.InterestSkill !== undefined){
            setInterest(profile?.skillInterest?.InterestSkill[0]?._id);
            setInterestName(profile?.skillInterest?.InterestSkill[0]?.skillInterestName);
            dispatch(getLeaderBoardAction({skillInterestId: profile?.skillInterest?.InterestSkill[0]?._id, limit: 10}));
        }
    }, [profile?.skillInterest])
    useEffect(()=>{
        dispatch(getSkillInterestAction(''))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(()=>{
        if(!props.user.isAuthenticated) navigate("/login");
    }, [props.user.isAuthenticated])
    return leaderboard?.loadingGetLeaderboard ? <CircularProgress position={'fixed'} top={'43%'} left={"48%"} isIndeterminate/> : (
        <div>
            <div className="flex items-center justify-center">
                <NavbarUser/>
            </div>

            <div className="flex flex-row h-[100%] justify-center items-center" >
                <div className="flex flex-row h-[100%] w-[75%] p-[3.7rem]">
                    <ProfileCard/>
                    <div className="flex flex-col">
                        <div className="flex flex-col w-[50%] ml-[6rem]">
                            <Select name="type" onChange={(e:any)=>handleConfigCreateMeeting(e.target)}
                                className="block w-full px-3 mt-1 bg-white border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 sm:text-sm focus:ring-1">
                                    {profile?.skillInterest?.InterestSkill?.map((interests:any, index:number)=>
                                        <option selected={selected === index} value={interests._id} label={interests.skillInterestName} >{interests.skillInterestName}</option>
                                    )}
                            </Select>
                            
                        </div>
                        <div className="flex w-[100%] ml-[6rem] mt-[1rem]">
                          {!leaderboard?.loadingGetLeaderboard && leaderboard?.leaderboard !==undefined &&
                              <Bar options={options} data={{
                                labels: leaderboard?.leaderboard?.user?.map((p:any)=>p?.name),
                                datasets: [{
                                  data: leaderboard?.leaderboard?.user?.map((p:any)=>p?.importantInterest?.point),
                                  backgroundColor: datasetBg[0]
                                }]
                              }} />
                          }
                        </div>

                    </div>
                </div>
            </div>
        </div>

    )
}

export default Leaderboard;