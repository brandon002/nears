import Vector from "../assets/user.svg";
import {useState, useEffect} from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProfileAction } from "../redux/slices/profileSlice";
import { getUserGroupListAction } from "../redux/slices/groupSlices";
import { Image, Skeleton, SkeletonCircle, SkeletonText, Box } from "@chakra-ui/react";
const ProfileCard = (props: any) => {
    const navigate = useNavigate(); 
    const dispatch = useDispatch<any>();
    const profile: any = useSelector((state:any)=> state.profile); 
    const groups: any = useSelector((state:any)=> state.group);
    const token = localStorage.getItem('jwtToken');
    useEffect(()=>{
        dispatch(getProfileAction(token))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(()=>{
        if(profile?.profile?._id !== undefined){
            dispatch(getUserGroupListAction({ page: 0, userId: profile?.profile?._id }));
        }
    }, [profile])

    return profile.loading || Object.keys(profile?.profile).length === 0 || groups?.getUserGroupListLoading || Object.keys(groups?.userGroupList).length === 0? 
        <Box padding='6' boxShadow='lg' bg='white' w={'25%'}>
            <SkeletonCircle size='14' position={'relative'} left={'30%'} />
            <SkeletonText mt='4' noOfLines={4} spacing='6' skeletonHeight='2' />
        </Box> :
        (
            <div className="flex flex-col w-[25%]">
                <div className="flex flex-col justify-end items-center bg-purple2 h-48 w-[100%] rounded-xl rounded-b-none border-b-blue-light4 border-b-2">
                    <div className="flex flex-col justify-center items-center relative top-[-1rem]">
                        <div className="w-16 h-16 bg-white border-4 rounded-full border-purple-light">
                            <Image rounded={'full'} w={'64px'} h={'56px'}
                            src={profile?.profile?.picture?.b64 !== undefined ? `data:${profile?.profile?.picture?.contentType};base64,${profile?.profile?.picture?.b64}` : Vector} 
                            onError={({ currentTarget }) => {
                                currentTarget.onerror = null; 
                                currentTarget.src= Vector;
                            }}  alt='pict' />
                        </div>
                        <span className="mt-3 text-xl text-white">{profile?.profile?.name}</span>
                        <span className="mt-1 text-sm text-white">{profile?.profile?.nickName}</span>
                    </div>
                </div>
                <div className="flex flex-col justify-start items-start bg-purple2 h-72 w-[100%] rounded-xl rounded-t-none">
                    <div className="flex flex-col justify-start items-start p-6 w-[100%]">
                        <div className="flex flex-col mb-4 text-white w-[100%]">
                            <span>Interest</span>
                            <span className="font-light opacity-[0.8] text-sm">{profile?.profile?.skillinterests?.map((p:any)=> `${p?.skillinterestId.skillInterestName}, `)}</span>
                        </div>
                        <div className="flex flex-col mb-4 text-white w-[100%]">
                            <span>Groups</span>
                            <span className="font-light opacity-[0.8] text-sm">{groups?.userGroupList?.groups?.map((p:any)=> `${p?.name}, `)}</span>
                        </div>
                        <div className="flex flex-col mb-4 text-white w-[100%]" role="button" onClick={()=>navigate(`/user-threads/${profile?.profile?._id}`)}>
                            <div className="flex justify-between">
                                <span>Threads</span>
                            </div>
                            <span className="font-light opacity-[0.8] text-sm">View threads detail</span>
                        </div>
                        <div className="flex flex-col mb-4 text-white w-[100%]" role="button" onClick={()=>navigate("/meetings")}>
                            <div className="flex justify-between">
                                <span>Meetings</span>
                            </div>
                            <span className="font-light opacity-[0.8] text-sm">View meetings detail</span>
                        </div>
                    </div>
                </div>
            </div>
        )
}

export default ProfileCard;