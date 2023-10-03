import { useState, useEffect } from "react";
import Vector from "../assets/user.svg";
import { NavbarUser } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUsersAction} from "../redux/slices/profileSlice";
import { addFriendAction, removeFriendAction, getRequestAction, getFriendAction, getRequestReceivedAction, acceptFriendAction } from "../redux/slices/friendSlice";
import {
    Input,
    InputGroup,
    InputLeftElement,
    FormControl,
    Image,
    CircularProgress,
    CircularProgressLabel,
    Skeleton,
    SkeletonCircle,
    SkeletonText,
    Stack,
    Box,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Flex,
    Avatar
} from '@chakra-ui/react'
import {ProfileCard} from "../components";
const SearchUser = (props: any) => {
    const navigate = useNavigate(); 
    const dispatch = useDispatch<any>();
    const users = useSelector((state:any)=> state.users); 
    const friend = useSelector((state:any)=> state.friend);
    const [search, setSearch] = useState("");
    const [config, setConfig] = useState('');
    const [modalRequestOpen, setModalRequestOpen] = useState(false);
    function handleChangeSearch(e:any){
        setSearch(e.target.value)
    }
    function handleClickFriend(user:any, type: 'add'|'remove'){
        if(type === 'add'){
            dispatch(addFriendAction(user?._id))
        };
        if(type === 'remove'){
            dispatch(removeFriendAction(user?._id))
        };
        setTimeout(()=>dispatch(getRequestAction('')), 1);
        setTimeout(()=>dispatch(getFriendAction('')), 2);
    }
    function handleRequest(user:any, type: 'add'|'remove'){
        if(type === 'add'){
            dispatch(acceptFriendAction(user?.requestor_id))
        };
        if(type === 'remove'){
            dispatch(removeFriendAction(user?.requestor_id))
        };
        setTimeout(()=>dispatch(getRequestReceivedAction('')), 1);
        setTimeout(()=>dispatch(getFriendAction('')), 2);
    }
    useEffect(()=>{
        dispatch(getUsersAction(config));
        dispatch(getRequestAction(''));
        dispatch(getFriendAction(''));
        dispatch(getRequestReceivedAction(''));
        // dispatch(acceptFriendAction('646b001d4fa9efba96c15aac'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(()=>{
        if(!props.user.isAuthenticated) navigate("/login");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.user.isAuthenticated])
    return(
        <div>
            <div className="flex items-center justify-center">
                <NavbarUser/>
            </div>

            <div className="flex flex-row h-[100%] justify-center items-center" >
                <div className="flex flex-row h-[100%] w-[75%] p-[3.7rem]">
                    <ProfileCard/>
                    <div className="flex flex-col w-[50%] ml-[6rem]">
                        <div className="flex flex-row w-[100%]">
                            <FormControl mb={4}>
                                <InputGroup className="flex items-center">
                                    <InputLeftElement
                                        mr={8}
                                        pointerEvents='none'
                                        children={<span className="material-symbols-outlined" style={{ 'fontSize': '20px', 'top': '1.2px', 'position': 'relative' }}> search </span>}
                                    />
                                    <Input size={'md'} onChange={(e:any)=> handleChangeSearch(e)}  type='search' inputMode="search" placeholder="Search user" borderColor={'#7286D3'} />
                                </InputGroup>
                            </FormControl>
                            <div className="relative ml-4 w-fit" onClick={()=>setModalRequestOpen(true)}>
                                {friend?.requestReceived?.data?.length > 0 && 
                                    <Flex top={'-0.42rem'} right={'-0.42rem'} rounded={'full'} justifyContent={'center'} alignItems={'center'} position={'absolute'} backgroundColor={'#B70404'} height={'1.1rem'} width={'1.1rem'}> <span className="text-xs text-white">{friend?.requestReceived?.data?.length}</span> </Flex>
                                }
                                <button className="flex items-center h-[75%] border border-logo rounded-lg p-2 material-symbols-outlined text-logo">notifications</button>
                            </div>
                        </div>
                        {users.loadingGetUsers || friend.addFriendLoading || friend.removeFriendLoading || friend.loadingGetRequestReceived || friend.getFriendsLoading || friend.getFriendsRequestLoading? 
                            <Stack spacing={1}>
                                <Skeleton height='4rem' rounded={'xl'}/>
                                <Skeleton
                                    height='4rem'
                                    color='white'
                                    fadeDuration={1}
                                    rounded={'xl'}
                                />
                                <Skeleton
                                    height='4rem'                        
                                    fadeDuration={2}
                                    rounded={'xl'}
                                />
                            </Stack> :
                            <>
                                {search === "" ? 
                                    <> 
                                        {users?.users?.users?.slice(0, 5).map((user: any, index: number)=> 
                                            <> 
                                                <div className="flex flex-col w-[100%] mt-4" key={index}>
                                                    <div className="flex flex-col bg-border w-[100%] rounded-[1.25rem] p-4 pl-8 relative">
                                                        <div className="flex flex-row w-[100%] h-16">
                                                            <div className="flex rounded-full bg-white w-10 h-10 mt-1 border-purple-light border-4 relative top-[0.3rem]">
                                                                <Image onError={({ currentTarget }) => {
                                                                        currentTarget.onerror = null; 
                                                                        currentTarget.src= Vector;
                                                                    }} 
                                                                    rounded={'full'}
                                                                    src={`data:${user.picture?.contentType};base64,${user.picture?.b64}`} alt='pict' />
                                                            </div>
                                                            <div className="flex flex-col mt-2 ml-6 text-white" role="button" onClick={()=>navigate(`/friend/${user._id}`)}>
                                                                <span className="text-md"> {user?.name} </span>
                                                                <span className="text-sm opacity-[0.8]"> {user?.nickName} </span>
                                                            </div>
                                                            {friend?.friendList?.data?.find((e:any)=>e?.friend_id?.includes(user?._id)) !== undefined ?
                                                                <span className="absolute text-white material-symbols-outlined right-6 bottom-10">group</span> :
                                                                <>
                                                                    {friend?.friendRequests?.data?.find((e:any)=>e.user_id === user._id) === undefined ? 
                                                                        <span className="absolute text-white material-symbols-outlined right-6 bottom-10" onClick={()=>handleClickFriend(user, 'add')} role="button">add</span>
                                                                        :
                                                                        <span className="absolute text-white material-symbols-outlined right-6 bottom-10" onClick={()=>handleClickFriend(user, 'remove')} role="button">close</span>
                                                                    }
                                                                </> 
                                                            
                                                            }

                                                        </div>
                                                        
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </> : 
                                    <> 
                                        {users?.users?.users?.map((user: any, index: number)=> 
                                        <> 
                                            <> 
                                                {(user.name.toLowerCase().includes(search.toLowerCase())) &&
                                                    <div className="flex flex-col w-[100%] mt-4" key={index}>
                                                        <div className="flex flex-col bg-border w-[100%] rounded-[1.25rem] p-4 pl-8 relative">
                                                            <div className="flex flex-row w-[100%] h-16">
                                                                <div className="flex rounded-full bg-white w-10 h-10 mt-1 border-purple-light border-4 relative top-[0.3rem]">
                                                                    <Image onError={({ currentTarget }) => {
                                                                            currentTarget.onerror = null; 
                                                                            currentTarget.src= Vector;
                                                                        }} 
                                                                        rounded={'full'}
                                                                        src={`data:${user.picture?.contentType};base64,${user.picture?.b64}`} alt='pict' />
                                                                </div>
                                                                <div className="flex flex-col mt-2 ml-6 text-white" role="button" onClick={()=>navigate(`/friend/${user._id}`)}>
                                                                    <span className="text-md"> {user?.name} </span>
                                                                    <span className="text-sm opacity-[0.8]"> {user?.nickName} </span>
                                                                </div>
                                                                {friend?.friendRequests?.data?.find((e:any)=>e.user_id === user._id) === undefined ? 
                                                                    <span className="absolute text-white material-symbols-outlined right-6 bottom-10" onClick={()=>handleClickFriend(user, 'add')} role="button">add</span>
                                                                    :
                                                                    
                                                                    <span className="absolute text-white material-symbols-outlined right-6 bottom-10" onClick={()=>handleClickFriend(user, 'remove')} role="button">close</span>
                                                                }
                                                            </div>
                                                            
                                                        </div>
                                                    </div>
                                                }   
                                            </>
                                        </>
                                        )}
                                    </>
                                }
                            </>
                        }

                    </div>
                </div>
                
            </div>
            <Modal isOpen={modalRequestOpen} onClose={()=>setModalRequestOpen(false)}>
                <ModalOverlay/>
                <ModalContent display={'flex'} w={'100%'} border={'2px solid #8EA7E9'} className="shadow-lg shadow-box-shadow">
                    <ModalHeader display={'flex'} alignSelf={'center'}>Friend Requests</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {friend?.loadingGetRequestReceived || friend?.addFriendLoading?
                            <CircularProgress position={'fixed'} top={'43%'} left={"48%"} isIndeterminate/>
                            :
                            <>
                                {friend?.requestReceived?.data?.map((item:any, index: number)=>
                                    <Flex className="flex-row border-logo border w-[100%] rounded-[1.25rem] p-4 mb-2"  key={index}>
                                        <Flex className="flex-row relative w-[100%]" justifyContent={'space-between'}>
                                            <Flex className="flex-col w-[100%] h-8 justify-center">
                                                <span className="text-md"> {item?.requestor_name} </span>
                                                <span className="text-sm opacity-[0.8]"> {item?.requestor_email} </span>
                                            </Flex>
                                            <Flex>
                                                <Flex w={'100%'}>
                                                    <span onClick={()=>handleRequest(item, 'add')} className="mr-2 material-symbols-outlined text-logo right-6 bottom-10" role="button">add_circle</span>
                                                    <span onClick={()=>handleRequest(item, 'remove')} className="material-symbols-outlined text-logo right-6 bottom-10" role="button">cancel</span>
                                                </Flex>
                                            </Flex>
                                        </Flex>
                                    </Flex>
                                )}
                            </>
                        }
                    </ModalBody> 
                    <ModalFooter>
                        <Button variant={'outline'} colorScheme="twitter" onClick={()=>setModalRequestOpen(false)}> Ok </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>

    )
}

export default SearchUser;