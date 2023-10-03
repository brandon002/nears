import { useState, useEffect } from "react";
import Vector from "../assets/user.svg";
import Locked from "../assets/locked.svg";
import { NavbarUser, ProfileCard } from "../components";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetailAction } from "../redux/slices/profileSlice";
import { getFriendAction, getRequestAction, addFriendAction, removeFriendAction } from "../redux/slices/friendSlice";
import { getUserGroupListAction } from "../redux/slices/groupSlices";
import {
    Flex,
    Image,
    Divider,
    Skeleton,
    CircularProgress
} from "@chakra-ui/react"
import { format, parseISO } from "date-fns";
const User = (props: any) => {
    const navigate = useNavigate(); 
    const params = useParams();
    const dispatch = useDispatch<any>();
    const profile = useSelector((state:any)=> state.profile);  
    const friend = useSelector((state:any)=> state.friend);  
    const groups = useSelector((state:any)=> state.group);  
    const [birthdayDate, setBirthdayDate]:any = useState('');

    function handleClickFriend(type: 'add'|'remove'){
        if(type === 'add'){
            dispatch(addFriendAction(params?.id));
        };
        if(type === 'remove'){
            dispatch(removeFriendAction(params?.id));
        };
        setTimeout(()=>dispatch(getRequestAction('')), 1);
    }
    useEffect(()=>{
        if(profile?.userDetail?.data?.birthdayDate !== undefined){
            setBirthdayDate(format(parseISO(profile?.userDetail?.data?.birthdayDate), "dd-MM-yyyy"))
        } else {
            setBirthdayDate("-")
        }
    }, [profile])
    //if friend found dk perlu friend req, if friend found dk perlu mutual friend, forum je
    useEffect(()=>{
        dispatch(getRequestAction(''));
        dispatch(getFriendAction(params?.id));
        dispatch(getUserDetailAction(params?.id));
        dispatch(getUserGroupListAction({ page: 0, userId: params?.id }));
    }, [params])

    useEffect(()=>{
        if(!props.user.isAuthenticated) navigate("/login");
    }, [props.user.isAuthenticated])

    return profile.loadingGetUserDetail || friend.getFriendsLoading ? <CircularProgress position={'fixed'} top={'43%'} left={"48%"} isIndeterminate/> : (
        <div>
            <div className="flex items-center justify-center">
                <NavbarUser/>
            </div>

            <div className="flex flex-row h-[100%] justify-center items-center" >
                <div className="flex flex-row h-[100%] w-[75%] p-[3.7rem]">
                    <div className="flex flex-col w-[25%]">
                        <div className="flex flex-col justify-end items-center bg-purple2 h-48 w-[100%] rounded-xl rounded-b-none border-b-blue-light4 border-b-2">
                            <div className="flex flex-col justify-center items-center relative top-[-1rem]">
                                <div className="w-16 h-16 bg-white border-4 rounded-full border-purple-light">
                                    <Image rounded={'full'} w={'64px'} h={'56px'}
                                    src={profile?.userDetail?.data?.picture?.b64 !== undefined ? `data:${profile?.userDetail?.data?.picture?.contentType};base64,${profile?.userDetail?.data?.picture?.b64}` : Vector} 
                                    onError={({ currentTarget }) => {
                                        currentTarget.onerror = null; 
                                        currentTarget.src= Vector;
                                    }}  alt='pict' />
                                </div>
                                <span className="mt-3 text-xl text-white"> {profile?.userDetail?.data?.name} </span>
                                <span className="mt-1 text-sm text-white"> {profile?.userDetail?.data?.nickName} </span>
                            </div>
                        </div>
                        <div className="flex flex-col justify-start items-start bg-purple2 h-72 w-[100%] rounded-xl rounded-t-none">
                            <div className="flex flex-col justify-start items-start p-6 w-[100%]">
                                <div className="flex flex-col mb-4 text-white w-[100%]">
                                    <span>Groups</span>
                                    <span className="font-light opacity-[0.8] text-sm">{groups?.userGroupList?.groups?.length > 0 ? groups?.userGroupList?.groups?.map((p:any)=> `${p?.name}, `) : '-'}</span>
                                </div>
                                <div role="button" className="flex flex-col mb-4 text-white w-[100%]" onClick={()=>navigate(`/user-threads/${params?.id}`)}>
                                    <div className="flex justify-between">
                                        <span>Threads</span>
                                    </div>
                                    <span className="font-light opacity-[0.8] text-sm" >View threads detail</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {friend?.friendList?.data?.length > 0 ? 
                        <Flex className="flex flex-col w-[50%] ml-[6rem]">
                            <Flex className="flex flex-col w-[100%] rounded-[1.25rem] pl-8 relative h-72" >
                                <Flex className="flex flex-col">
                                    <Flex mb={3}> <span className="inline-block text-2xl font-semibold">{profile?.userDetail?.data?.name}'s Personal Information</span> </Flex>
                                    <Flex mb={3}> <span className="inline-block text-xl">{profile?.userDetail?.data?.description}</span> </Flex>
                                    <Divider mb={3} orientation="horizontal" borderColor={'#222A4A'} borderWidth={'3px'}/>
                                    <Flex className="flex flex-col mb-3">
                                        <span className="inline-block opacity-[0.9]">Fullname</span>
                                        <span className="inline-block text-lg font-semibold">{profile?.userDetail?.data?.fullName}</span>
                                    </Flex>
                                    <Flex className="flex flex-col mb-3">
                                        <span className="inline-block opacity-[0.9]">Email</span>
                                        <span className="inline-block text-lg font-semibold">{profile?.userDetail?.data?.email}</span>
                                    </Flex>
                                    <Flex className="flex flex-col mb-3">
                                        <span className="inline-block opacity-[0.9]">Hobby</span>
                                        <span className="inline-block text-lg font-semibold">{profile?.userDetail?.data?.hobby}</span>
                                    </Flex>
                                    <Flex className="flex flex-col mb-3">
                                        <span className="inline-block opacity-[0.9]">Gender</span>
                                        <span className="inline-block text-lg font-semibold">{profile?.userDetail?.data?.gender === undefined ? 'Male' : profile?.userDetail?.data?.gender}</span>
                                    </Flex>
                                    <Divider mb={3} orientation="horizontal" borderColor={'#222A4A'} borderWidth={'3px'}/>
                                    <Flex className="flex flex-col mb-3">
                                        <span className="inline-block opacity-[0.9]">Birthday Date</span>
                                        <span className="inline-block text-lg font-semibold">{birthdayDate}</span>
                                    </Flex>
                                    <Flex className="flex flex-col mb-3">
                                        <span className="inline-block opacity-[0.9]">Phone Number</span>
                                        <span className="inline-block text-lg font-semibold">+62 {profile?.userDetail?.data?.phone}</span>
                                    </Flex>
                                    <Flex className="flex flex-col mb-3">
                                        <span className="inline-block opacity-[0.9]">Address</span>
                                        <span className="inline-block text-lg font-semibold">{profile?.userDetail?.data?.address}</span>
                                    </Flex>
                                </Flex>
                            </Flex>
                        </Flex> 
                        :
                        <>
                            {friend?.addFriendLoading || friend?.getFriendsRequestLoading ? 
                                <Skeleton height='16rem' ml={'4rem'} width={'16rem'} rounded={'xl'}/> :
                                <div className="flex flex-col w-[50%] ml-[6rem]">
                                    <div className="flex flex-col bg-border w-[100%] rounded-[1.25rem] p-4 pl-8 relative h-72 justify-center items-center text-white" >
                                        <div>
                                            <img src={Locked} alt="Locked"/>
                                        </div>
                                        <div>
                                            <span className="" >This User Profile is Private</span>
                                        </div>
                                        <div>
                                            {friend?.friendRequests?.data?.find((e:any)=>e.user_id === params?.id) === undefined ? 
                                                <Button color={'#3C4B83'} onClick={()=>handleClickFriend('add')} mt={6}>Send Connection Request</Button> :
                                                <Button color={'#3C4B83'} onClick={()=>handleClickFriend('remove')} mt={6}>Connection Request Sent</Button>
                                            }     
                                        </div>
                                    </div>
                                </div>
                            }
                        </>
                    }
                    
                </div>
                
            </div>
        </div>

    )
}

export default User;