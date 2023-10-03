import { useState, useEffect } from "react";
import Vector from "../assets/user.svg";
import { NavbarUser } from "../components";
import story from "../assets/unsplash_iusJ25iYu1c.png"
import insignia from "../assets/insignia.png"
import storyGroup from "../assets/storygroup.png"
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"
import 'material-symbols';
import ImageButtonUploader from "../components/imageButtonUploader";

import {
    Modal, useDisclosure,
    Flex,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Image,
    Divider,
    CircularProgress,
    Button,
    Select
} from '@chakra-ui/react'
import { getThreadListAction, insertThreadAction, likeThreadAction, commentThreadAction, getThreadAction, dislikeThreadAction } from "../redux/slices/forumSlice"
import { getGroupDetailAction } from "../redux/slices/groupSlices"
import { getSkillInterestAction, getProfileAction } from "../redux/slices/profileSlice";
import Compressor from "compressorjs";
const Group = (props: any) => {
    const dispatch = useDispatch<any>();
    const navigate = useNavigate();
    const [groupData, setgroupData] = useState(
        {
            name: "?",
            description: "?",
            rules: [],
            interests: ["?"],
            skills: ["?"]
        }
    ); 
    const token = localStorage.getItem('jwtToken');
    const [errorInterest, setErrorInterest] = useState(false);
    const [threads, setThreads] = useState<any[]>([]);
    const [categoryInterest, setCategoryInterest]:any = useState(null);
    const [threadDetailId, setThreadDetailId]:any = useState('');
    const [content, setContent] = useState("");
    const forum = useSelector((store: any) => store.groupForum);
    const groupSlice = useSelector((store: any) => store.group);
    const params = useParams();
    const groupId = params.id;
    const [createThreadOpen, setCreateThreadOpen] = useState(false);
    const [createThreadConfig, setCreateThreadConfig] = useState({
        title: '',
        description: '',
        image: '',
        skillInterestId: groupSlice?.groupDetail?.skillInterests
    })
    useEffect(() => {
        setThreads([...forum.forums]);
    }, [forum]);
    function handleInsertThread() {
        const idx = profile?.profile?.skillinterests?.findIndex((p:any)=>p?.skillinterestId?._id===createThreadConfig?.skillInterestId);
        if(profile?.profile?.skillinterests[idx]?.point < 0){
            setErrorInterest(true);
        }  else{
            dispatch(insertThreadAction({ groupId: groupId, title: createThreadConfig?.title,
                    description: createThreadConfig.description,
                    image: createThreadConfig.image,
                    skillInterestId: groupSlice?.groupDetail?.skillInterests[0]?.skillInterestId
            }));
            setCreateThreadOpen(false)
            setCreateThreadConfig({
                title: '',
                description: '',
                image: '',
                skillInterestId: groupSlice?.groupDetail?.skillInterests
            })
        }
        setContent("");
        setTimeout(()=>{
            dispatch(getThreadListAction({ page: 0, skillInterestId: categoryInterest, groupId: groupId}));
        }, 200)
    }
    const [comments, setComments] = useState<any[]>([]);
    const [threadDetailIndex, setThreadDetailIndex] = useState(0);
    const [commentPage, setCommentPage] = useState(0);
    const forumDetail = useDisclosure()
    function handleShowDetail(index: any) {
        setThreadDetailIndex(index);
        setComments([]);
        setCommentPage(0);
        dispatch(getThreadAction({ page: commentPage, id: threads[index]._id }));
        setThreadDetailId(index)
        forumDetail.onOpen();
    }
    const [insertOnProcess, setInsertOnProcess] = useState(true);
    const [threadDetailLoading, setThreadDetailLoading] = useState(false);
    useEffect(() => {
        setThreadDetailLoading(forum.threadDetailLoading);
    }, [forum.threadDetailLoading])
    useEffect(() => {
        setInsertOnProcess(forum.insertLoading);
    }, [forum.insertLoading]);
    function handleCancelThread() {
        setCreateThreadOpen(false)
        setCreateThreadConfig({
            title: '',
            description: '',
            image: '',
            skillInterestId: groupSlice?.groupDetail?.skillInterests
        })
    }
    const [preview, setPreview] = useState<any>('');
    let a = "";

    function handleChangePicture(e:any){
        const file = e[0];
        if (!file) {
            return;
        }
        new Compressor(file, {
            convertSize: 50000,
            quality: 0.4,
            success(result:any) {
                setCreateThreadConfig((prev:any)=> ({...prev, image: new File([result], file.name, {type: file.type})}));
            },
            error(err:any) {
                console.error(err.message);
            },
        });
    }

    function handleLoadMoreThread() {
        if(categoryInterest !== null){
            dispatch(getThreadListAction({ page: page, skillInterestId: categoryInterest, groupId: groupId}));
        } else {
            dispatch(getThreadListAction({ page: page, skillInterestId: categoryInterest, groupId: groupId}));
        }
    }
    function handleCommentThread() {
        const idx = profile?.profile?.skillinterests?.findIndex((p:any)=>p?.skillinterestId?._id===threads[threadDetailIndex]?.skillinterestId);
        if(profile?.profile?.skillinterests[idx]?.point < 0){
            setErrorInterest(true);
        } else if(idx === -1){
            setErrorInterest(true);
        } else{
            dispatch(commentThreadAction({ description: a, id:threads[threadDetailIndex]._id}));
            a = "";
            setTimeout(()=>{
                dispatch(getThreadAction({ page: commentPage, id: threads[threadDetailId]._id }));
            }, 200)
        }
    }
    useEffect(() => {
        setPage(forum.page);
    }, [forum.page]);
    const [page, setPage] = useState(0);
    const profile: any = useSelector((state: any) => state.profile);
    function handleOpenCreateThread() {
        setCreateThreadOpen(true)
    }
    useEffect(() => {
        if(categoryInterest !== null){
            dispatch(getThreadListAction({ page: page, skillInterestId: categoryInterest, groupId: groupId }));
            dispatch(getSkillInterestAction(''));
        } else {
            dispatch(getThreadListAction({ page: page, skillInterestId: categoryInterest, groupId: groupId }));
            dispatch(getSkillInterestAction(''));
        }
    }, []);
    useEffect(() => {
        dispatch(getGroupDetailAction({ groupId: groupId }));
    }, []);
    useEffect(() => {
        setgroupData(groupSlice.groupDetail);
    }, [groupSlice.groupDetail])
    useEffect(() => {
        if (!props.user.isAuthenticated) navigate("/login");
    }, [props.user.isAuthenticated])
    useEffect(()=>{
        dispatch(getProfileAction(token))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return profile.loadingGetUserDetail || forum.loading || forum.insertLoading ? <CircularProgress position={'fixed'} top={'43%'} left={"48%"} isIndeterminate/> :(
        <div>
            <Modal isOpen={forumDetail.isOpen} onClose={forumDetail.onClose}>
                <ModalHeader></ModalHeader>
                <ModalOverlay></ModalOverlay>
                <ModalContent >
                    <div className="flex flex-col w-[130%] bg-purple2 rounded-lg">
                        <div className="flex flex-col bg-purple2 bg-border-transparent w-[100%] p-4">
                            {threads.length !== 0 ?
                                <Thread setErrorInterest={setErrorInterest} interestArr={profile?.profile?.skillinterests} thread={threads[threadDetailIndex]} key={threadDetailIndex} page={0} setThreads={setThreads} categoryInterest={categoryInterest} groupId={groupId}  /> : ""}
                                <Divider display={'flex'} alignSelf={'center'} orientation="horizontal" mt={'4px'} mb={'2px'} width={'100%'}/>
                            {/* disini tarok scroll */}
                            {
                                threadDetailLoading && forum.forumsDetailLoading?
                                    "loading" :
                                    comments.map(
                                        (value: any, key: any) =>
                                            <div className="mt-8">
                                                <Thread setErrorInterest={setErrorInterest} interestArr={profile?.profile?.skillinterests} thread={value} command="Commented" key={key} page={0} setThreads={setThreads} categoryInterest={categoryInterest} groupId={groupId}/>
                                                <Divider display={'flex'} alignSelf={'center'} orientation="horizontal" mt={'4px'} mb={'2px'} width={'100%'}/>
                                            </div>
                                            
                                    )
                            }
                            <div className="flex flex-row mt-8 "><input type="text" onChange={(e) => { a = e.target.value }} className="flex flex-col justify-center items-start text-white bg-border w-[100%] p-3 h-12 ml-8 rounded-3xl outline-none" />
                                <button className="ml-4 text-white" onClick={handleCommentThread}> <span className="material-symbols-outlined" >send</span> </button></div>
                        </div>
                    </div>
                </ModalContent>
            </Modal>
            <Modal isOpen={errorInterest} onClose={()=>setErrorInterest(false)}>
                <ModalOverlay />
                <ModalContent display={'flex'} w={'100%'} border={'2px solid #8EA7E9'} className="shadow-lg shadow-box-shadow">
                    <ModalHeader mt={6} display={'flex'} alignSelf={'center'} >You don't have interest or enough point!</ModalHeader>
                    <ModalCloseButton />

                    <ModalFooter >
                        <Button onClick={()=>setErrorInterest(false)} variant={'outline'} colorScheme="twitter">OK</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal isOpen={false} onClose={forumDetail.onClose}>
                    <ModalOverlay />
                    <ModalContent display={'flex'} w={'100%'} border={'2px solid #8EA7E9'} className="shadow-lg shadow-box-shadow">
                        <ModalHeader display={'flex'} alignSelf={'center'} >Create Meeting</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            
                        </ModalBody>

                        <ModalFooter>
                            <Button variant={'outline'} colorScheme="twitter">Create</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            <div className="flex items-center justify-center">
                <NavbarUser user={props.user} />
            </div>
            <div className="flex flex-row h-[100%] justify-center items-center">
                <div className="flex flex-row h-[100%] w-[75%] p-[2.7rem]">
                    <div className="flex flex-col w-[25%] h-fit">
                        <div className="flex flex-col justify-end items-center bg-purple2 h-48 w-[100%] rounded-xl rounded-b-none border-b-blue-light4 border-b-2">
                            <div className="flex flex-col justify-center items-center relative top-[-1rem]">
                                {/* <div className="w-16 h-16 bg-white rounded-full border-purple-light border-3"> */}
                                    <Image
                                        src={groupSlice?.groupDetail?.picture?.b64 !== undefined ? `data:${groupSlice?.groupDetail?.picture?.contentType};base64,${groupSlice?.groupDetail?.picture?.b64}` : insignia}
                                        rounded={'full'}
                                        h={'4rem'}
                                        w={'4rem'}
                                        border={'1px solid white'}
                                        p={0}
                                        backgroundColor={'white'}
                                        alt="pic"
                                        className="border-purple-light border-3"
                                    />
                                {/* </div> */}
                                <span className="mt-3 text-xl text-white">{groupData.name}</span>
                            </div>
                        </div>
                        <div className="flex flex-col justify-start items-start bg-purple2 h-fit w-[100%] rounded-xl rounded-t-none pb-4">
                            <div className="flex flex-col p-6 pb-0 w-[100%]">
                                <div className="flex flex-col justify-start items-start w-[100%] bg-border p-4 rounded-2xl">
                                    <div className="flex flex-col mb-4 text-white w-[100%]">
                                        <span className="text-lg">Description</span>
                                        <span className="mt-2 text-sm">{groupData.description}</span>
                                        <span className="mt-2 text-sm">Rules:</span>
                                        <ul className="list-disc ml-[1.2rem] text-xs">
                                            {groupData.rules.map((rule) => {
                                                return <li>{rule}</li>
                                            })}
                                        </ul>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col w-[65%] ml-[6rem]">
                        {/* <Select name="type" onChange={(e:any)=>handleChangeCategoryInterest(e)} defaultValue="" value={categoryInterest}
                            className="block w-full px-3 mt-0 mb-2 bg-white border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 sm:text-sm focus:ring-1">
                                <option hidden disabled value="">Select Interest Category</option>
                                {profile?.skillInterest?.InterestSkill?.map((interests:any)=>
                                    <option value={interests._id}>{interests.skillInterestName}</option>
                                )}
                        </Select> */}
                        <div className="flex flex-col w-[100%]">
                                {
                                    createThreadOpen ?
                                        <Flex className="flex flex-col items-start text-white bg-purple2 pt-2 pb-10 w-[100%] rounded-xl px-8 border-0">
                                            <span className="flex self-center mb-2 text-xl"> Start New Thread </span> 
                                            {/* <Select w={'50%'} name="type" onChange={(e: any) => { setCreateThreadConfig({ ...createThreadConfig, skillInterestId: e.target.value }) }} 
                                                className="block w-full px-3 mt-0 mb-2 bg-white border-none rounded-md outline-none placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 sm:text-sm focus:ring-1">
                                                    <option selected hidden disabled value="" color="#FFF">Select Thread Category</option>
                                                    {profile?.profile?.skillinterests?.map((interests:any)=>
                                                        <option className="text-black" value={interests.skillinterestId._id}>{interests.skillinterestId.skillInterestName}</option>
                                                    )}
                                            </Select> */}
                                            <input
                                                onChange={(e: any) => { setCreateThreadConfig({ ...createThreadConfig, title: e.target.value }) }}
                                                type="text"
                                                name="content" value={createThreadConfig.title}
                                                className="flex flex-col justify-center items-start text-white bg-border w-[100%] p-2 pl-4 h-10 rounded-xl outline-none"
                                                disabled={insertOnProcess} placeholder="Title"
                                            />
                                            <Flex className="flex flex-col justify-center items-start bg-border w-[100%] mt-4 p-2 rounded-xl">
                                                <Flex direction={"column"} w={'100%'} >
                                                    {preview !== '' &&
                                                        <Image
                                                            src={preview[0]?.preview}
                                                            rounded={'xl'}
                                                            h={'28rem'}
                                                            border={'1px solid white'}
                                                            p={0}
                                                            backgroundColor={'white'}
                                                            alt="pic"
                                                        />
                                                    }
                                                    <textarea value={createThreadConfig.description} disabled={insertOnProcess} placeholder="Description"
                                                        className="flex flex-col justify-center outline-none items-start bg-transparent text-white w-[100%] p-2" rows={5}
                                                        onChange={(e: any) => { setCreateThreadConfig({ ...createThreadConfig, description: e.target.value }) }} >
                                                    </textarea>
                                                </Flex>
                                                <Flex className="flex flex-row border-t border-white w-[100%]" justifyContent={'space-between'}>
                                                    <Flex>
                                                        <button onClick={handleCancelThread} type="button" className="h-10 text-base text-white bg-inherit w-32 rounded-xl flex mt-[0.9rem] ml-3">
                                                            <span className="flex mr-3 material-symbols-outlined">close</span>
                                                            <span className="flex">Cancel</span>
                                                        </button>
                                                    </Flex>
                                                    <Flex>
                                                        <Flex>
                                                            <ImageButtonUploader
                                                                setPreview={setPreview}
                                                                handleChangePicture = {handleChangePicture}
                                                            /> 
                                                        </Flex>   
                                                        <button onClick={handleInsertThread} type="button" className="h-10 mt-2 text-base text-white bg-purple2 w-28 rounded-xl">
                                                            Post
                                                        </button>
                                                    </Flex>
                                                </Flex>
                                            </Flex>
                                        </Flex>
                                        : 
                                        <div className="flex flex-row items-center bg-purple2 py-5 w-[100%] rounded-xl px-8 border-0">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="w-12 h-12 bg-white border-4 rounded-full border-purple-light">
                                                    <Image rounded={'full'} w={'3rem'} h={'2.5rem'}
                                                    src={profile?.profile?.picture?.b64 !== undefined ? `data:${profile?.profile?.picture?.contentType};base64,${profile?.profile?.picture?.b64}` : Vector} alt='pict' />
                                                </div>
                                            </div>
                                            <input
                                                type="text"
                                                name="content" value={content} onClick={handleOpenCreateThread}
                                                className="flex flex-col justify-center items-start text-white bg-border w-[80%] h-16 ml-8 rounded-3xl placeholder:text-white p-4 hover:cursor-pointer hover:opacity-[0.6]"
                                                disabled={insertOnProcess} placeholder="Start new thread..." 
                                            />
                                        </div>
                                }

                           
                        </div>
                        {threads.map((value: any, index: any) => {
                            return (<div className="flex flex-col w-[100%] mt-8">
                                <div className="flex flex-col bg-purple2 bg-border-transparent  w-[100%] rounded-xl p-4">
                                    <Thread setErrorInterest={setErrorInterest} interestArr={profile?.profile?.skillinterests} groupId={groupId} page={0} setThreads={setThreads} categoryInterest={categoryInterest} thread={value} index={index} handleShowDetail={(e: any) => {
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

const Thread = (threads: any) => {
    const dispatch = useDispatch<any>();
    function handleLikeThread() {
        const idx = threads?.interestArr?.findIndex((p:any)=>p?.skillinterestId?._id===threads?.thread?.skillinterestId);
        if(idx === -1){
            threads?.setErrorInterest(true);
        } else {
            if(threads?.interestArr[idx]?.point < 0){
                threads?.setErrorInterest(true);
            } else {
                let config: any = { id: threads.thread._id, index: threads.index };
                if (threads.hasOwnProperty("threadId")) {
                    config.threadId = threads.threadId;
                }
                dispatch(likeThreadAction(config));
                threads?.setThreads([]);
                setTimeout(()=>{
                    dispatch(getThreadListAction({ page: threads?.page, skillInterestId: threads?.categoryInterest, groupId: threads?.groupId}));
                }, 200)
            }
        }
    }
    function handleDislikeThread(){
        const idx = threads?.interestArr?.findIndex((p:any)=>p?.skillinterestId?._id===threads?.thread?.skillinterestId);
        if(idx === -1){
            threads?.setErrorInterest(true);
        } else {
            if(threads?.interestArr[idx]?.point < 0){
                threads?.setErrorInterest(true);
            } else {
                let config: any = { id: threads.thread._id, index: threads.index };
                if (threads.hasOwnProperty("threadId")) {
                    config.threadId = threads.threadId;
                }
                dispatch(dislikeThreadAction(config));
                threads?.setThreads([]);
                setTimeout(()=>{
                    dispatch(getThreadListAction({ page: threads?.page, skillInterestId: threads?.categoryInterest, groupId: threads?.groupId}));
                }, 200)
            }
        }
    }
    let commandText = "posted a thread";
    if (threads.hasOwnProperty("command")) {
        commandText = threads.command;
    }
    return (<>
            {threads?.thread !== undefined && 
            <> 
                <div className="flex flex-row w-[100%]">
                    <div className="flex flex-row w-[100%]">
                        <div className="flex rounded-full bg-white w-8 h-8 border-purple-light border-2 relative top-[0.3rem]">
                            <Image rounded={'full'} w={'1.8rem'} h={'1.75rem'} src={threads?.thread?.userId?.picture !== undefined ? `data:${threads?.thread?.userId?.contentType};base64,${threads?.thread?.userId?.picture}` : Vector} alt='pict' />
                        </div>
                        <div className="flex flex-col ml-6 text-white">
                            <span className="text-md">{threads?.thread?.userId?.name}</span>
                            <span className="text-sm opacity-[0.8]">{commandText}</span>
                        </div>
                    </div>
                    <div className="">
                        <span className="float-right text-2xl text-white">{threads?.thread?.numberOfLikes}</span>
                    </div>
                </div>
                <div className="flex flex-col text-white bg-border w-[100%] mt-4 rounded-2xl px-3 py-2">
                    {threads?.thread?.title !== undefined && 
                        <>
                            <Flex className="px-1 mb-2">
                                <span className="text-lg font-semibold">{threads?.thread?.title}</span>
                            </Flex>
                            <Divider orientation="horizontal" mb={0}/>
                            <Divider orientation="horizontal" mb={2}/>
                        </>
                    }
                    {threads?.thread?.picture !== undefined &&
                        <Flex>
                            <Image
                                src={`data:${threads?.thread?.picture.contentType};base64,${threads?.thread?.picture?.b64}`}
                                rounded={'xl'}
                                h={'28rem'}
                                border={'1px solid white'}
                                p={0}
                                backgroundColor={'white'}
                                alt="pic"
                            />
                        </Flex>
                    }
                    <span className="px-2 py-2 mb-2">{threads?.thread?.description}</span>
                    <div className="flex justify-end">
                        {threads?.hasOwnProperty("handleShowDetail") ? <span role="button" onClick={(e) => threads?.handleShowDetail()} className="text-sm opacity-[0.7] mr-6">Reply</span> : <></>}
                        <button onClick={(e) => handleLikeThread()} className="text-sm opacity-[0.7] outline-none mr-2">
                            <span className={threads?.thread?.userLike === 1 ? "material-symbols-outlined text-neon" : "material-symbols-outlined"}>
                                sentiment_satisfied
                            </span>
                        </button>
                        <button onClick={(e) => handleDislikeThread()} className="text-sm opacity-[0.7] outline-none">
                            <span className={threads?.thread?.userDislike === 1 ? "material-symbols-outlined text-neon" : "material-symbols-outlined"}>
                                sentiment_dissatisfied
                            </span>
                        </button>
                    </div>
                </div>
            </>
            }
        </>
    );
}
export default Group