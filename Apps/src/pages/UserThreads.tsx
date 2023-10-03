import { useState, useEffect, useRef } from "react";
import Vector from "../assets/user.svg";
import { NavbarUser, ProfileCard } from "../components";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetailAction } from "../redux/slices/profileSlice";
import { likeThreadAction, getThreadListAction, getThreadAction } from "../redux/slices/forumSlice";
import {
    Input, 
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    InputGroup,
    InputLeftElement,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Image,
    Flex,
    Divider,
    Skeleton,
    CircularProgress,
    useDisclosure
  } from '@chakra-ui/react'
const UserThreads = (props: any) => {
    const navigate = useNavigate(); 
    const dispatch = useDispatch<any>();
    const params = useParams();
    const ref = useRef<any>();
    const forum = useSelector((store: any) => store.forum);
    const profile = useSelector((store:any)=> store.profile);
    const [content, setContent] = useState("");
    const [insertOnProcess, setInsertOnProcess] = useState(true);
    const [threadDetailLoading, setThreadDetailLoading] = useState(false);
    const [threadDetailIndex, setThreadDetailIndex] = useState(0);
    const [threads, setThreads] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [preview, setPreview] = useState<any>('');
    const [commentPage, setCommentPage] = useState(0);
    const [comments, setComments] = useState<any[]>([]);
    const forumDetail = useDisclosure();
    const [openThreadDetail, setOpenThreadDetail] = useState({
        open: false,
        threadId: ''
    })
    
    function handleOpenThreadDetail(id:any){
        setOpenThreadDetail((prev:any)=>({...prev, open: true, threadId: id}));
    }
    function handleLoadMoreThread() {
        dispatch(getThreadListAction({ page: page, userId: params?.id }));
    }
    function handleShowDetail(index: any) {
        setThreadDetailIndex(index);
        setComments([]);
        setCommentPage(0);
        dispatch(getThreadAction({ page: commentPage, id: threads[index]._id }));
        forumDetail.onOpen();
    }
    let a = "";
    useEffect(() => {
        setPage(forum.page);
    }, [forum.page]);

    useEffect(() => {
        if(params?.id !== undefined){
            dispatch(getThreadListAction({ page: page, userId: params?.id  }));
        }
    }, [params]);
    useEffect(() => {
        setThreadDetailLoading(forum.threadDetailLoading);
    }, [forum.threadDetailLoading])
    useEffect(() => {
        setComments([...comments, ...forum.comments]);
    }, [forum.comments]);
    useEffect(() => {
        setInsertOnProcess(forum.insertLoading);
    }, [forum.insertLoading]);
    useEffect(() => {
        setThreads([...forum.forums, ...threads]);
    }, [forum.forums]);
    useEffect(()=>{
        dispatch(getUserDetailAction(params?.id));
    }, [])
    useEffect(()=>{
        if(!props.user.isAuthenticated) navigate("/login");
    }, [props.user.isAuthenticated])
    console.log(profile)
    const Thread = (threads: any) => {
        const dispatch = useDispatch<any>();
        function handleLikeThread() {
            let config: any = { id: threads.thread._id, index: threads.index };
            if (threads.hasOwnProperty("threadId")) {
                config.threadId = threads.threadId;
            }
            dispatch(likeThreadAction(config));
        }
        let commandText = "posted a thread";
        if (threads.hasOwnProperty("command")) {
            commandText = threads.command;
        }
        return (<>
            <div className="flex flex-row w-[50%]">
                <div className="flex rounded-full bg-white w-8 h-8 border-purple-light border-2 relative top-[0.3rem]">
                    <Image rounded={'full'} w={'1.8rem'} h={'1.75rem'} src={threads.thread.userId.picture !== undefined ? `data:${threads.thread.userId.contentType};base64,${threads.thread.userId.picture}` : Vector} alt='pict' />
                </div>
                <div className="flex flex-col ml-6 text-white">
                    <span className="text-md">{threads.thread.userId.name}</span>
                    <span className="text-sm opacity-[0.8]">{commandText}</span>
                </div>
            </div>
            <div className="flex flex-col text-white bg-border w-[100%] mt-4 rounded-2xl px-3 py-2">
                {threads.thread.title !== undefined && 
                    <>
                        <Flex className="px-1 mb-2">
                            <span className="text-lg font-semibold">{threads.thread.title}</span>
                        </Flex>
                        <Divider orientation="horizontal" mb={0}/>
                        <Divider orientation="horizontal" mb={2}/>
                    </>
                }
                {threads.thread.picture !== undefined &&
                    <Flex>
                        <Image
                            src={`data:${threads.thread.picture.contentType};base64,${threads.thread.picture.b64}`}
                            rounded={'xl'}
                            h={'28rem'}
                            border={'1px solid white'}
                            p={0}
                            backgroundColor={'white'}
                            alt="pic"
                        />
                    </Flex>
    
                }
                <span className="px-2 py-2 mb-2">{threads.thread.description}</span>
                <div className="flex justify-end px-6 pb-2">
                    {threads.hasOwnProperty("handleShowDetail") ? <span role="button" onClick={(e) => threads.handleShowDetail()} className="text-sm opacity-[0.7] mr-6">Reply</span> : <></>}
                    <button onClick={(e) => handleLikeThread()} className="text-sm opacity-[0.7] outline-none">{threads.thread.numberOfLikes} Like</button>
                </div>
            </div>
        </>
        );
    }
    return profile.loadingGetUserDetail ? <CircularProgress position={'fixed'} top={'43%'} left={"48%"} isIndeterminate/> :(
        <div>
            <Modal isOpen={forumDetail.isOpen} onClose={forumDetail.onClose}>
                <ModalHeader></ModalHeader>
                <ModalOverlay></ModalOverlay>
                <ModalContent>
                    <div className="flex flex-col w-[130%] bg-purple2 rounded-lg">
                        <div className="flex flex-col bg-purple2 bg-border-transparent w-[100%] p-4">
                            {threads.length !== 0 ?
                                <Thread thread={threads[threadDetailIndex]} key={threadDetailIndex} /> : ""}
                            
                            {/* disini tarok scroll */}
                            {
                                threadDetailLoading ?
                                    "loading" :
                                    comments.map(
                                        (value: any, key: any) =>
                                            <div className="mt-8"><Thread thread={value} command="Commented" key={key} /></div>

                                    )
                            }
                        </div>
                    </div>
                </ModalContent>
            </Modal>
            <div className="flex items-center justify-center">
                <NavbarUser user={props.user} />
            </div>
            <div className="flex flex-row h-[100%] justify-center items-center" ref={ref}>
                <div className="flex flex-row h-[100%] w-[75%] p-[2.7rem]">
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
                                    <span>Interest</span>
                                    <span className="font-light opacity-[0.8] text-sm"> {profile?.userDetail?.data?.interests[0]?.split(",")?.filter((s:any) => s).join(", ")} </span>
                                </div>
                                <div className="flex flex-col mb-4 text-white w-[100%]">
                                    <span>Skill</span>
                                    <span className="font-light opacity-[0.8] text-sm"> {profile?.userDetail?.data?.skills[0]?.split(",")?.filter((s:any) => s).join(", ")} </span>
                                </div>
                                <div className="flex flex-col mb-4 text-white w-[100%]">
                                    <span>Groups</span>
                                    <span className="font-light opacity-[0.8] text-sm">Insignia, Nears</span>
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

                        
                <div className="flex flex-col w-[65%] ml-[6rem]">
                        {threads.map((value: any, index: any) => {
                            return (<div className="flex flex-col w-[100%] mt-0">
                                <div className="flex flex-col bg-purple2 bg-border-transparent  w-[100%] rounded-xl p-4 mb-6">
                                    <Thread thread={value} index={index} handleShowDetail={(e: any) => {
                                        handleShowDetail(index);
                                    }} /></div></div>)
                        })}
                        {
                            <button onClick={handleLoadMoreThread}>Load more</button>
                        }
                    </div>
                </div>

            </div>
        </div>

    )
}

export default UserThreads;