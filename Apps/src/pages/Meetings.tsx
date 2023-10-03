import { useState, useEffect } from "react";
import Vector from "../assets/user.svg";
import { NavbarUser, ProfileCard } from "../components";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUsersAction } from "../redux/slices/profileSlice";
import { createMeetingAction, getMeetingListAction } from "../redux/slices/meetingSlice";
import { CUIAutoComplete } from 'chakra-ui-autocomplete'
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
    Divider
  } from '@chakra-ui/react'
const Meetings = (props: any) => {
    const navigate = useNavigate(); 
    const dispatch = useDispatch<any>();
    const users = useSelector((state:any)=> state.users); 
    const meeting = useSelector((state:any)=> state.meeting);
    const [createMeetingOpen, setCreateMeetingOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [openMeetingDetail, setOpenMeetingDetail]:any = useState({
        open: false,
        details: ''
    })
    const [configCreateMeeting, setConfigCreateMeeting] = useState({
        title: '',
        description: '',
        type: '',
        platform: '',
        attendee: []
    })
    const [createError, setCreateError] = useState(false)
    const createMeetingError = {
        title: configCreateMeeting.title.length < 3,
        description: configCreateMeeting.description.length < 3,
        type: configCreateMeeting.type.length < 3,
        platform: configCreateMeeting.platform.length < 3,
        attendee: configCreateMeeting.attendee.length === 0
    }
    function handleOpenMeetingDetail(meet:any){
        setOpenMeetingDetail({open: true, details: meet});
    }
    function handleConfigCreateMeeting(e:any){
        setConfigCreateMeeting((prev:any)=>{
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })
    }
    function handleCreateMeeting(){
        if(!createMeetingError.title&& !createMeetingError.description&& !createMeetingError.type&& !createMeetingError.platform&& !createMeetingError.attendee){
            dispatch(createMeetingAction({
                title: configCreateMeeting.title,
                description: configCreateMeeting.description,
                type: configCreateMeeting.type,
                platform: configCreateMeeting.platform,
                attendee: configCreateMeeting.attendee
            }));
            setCreateMeetingOpen(false)
            setConfigCreateMeeting({
                title: '',
                description: '',
                type: '',
                platform: '',
                attendee: []
            });
            setCreateError(false);
        } else{
            setCreateError(true);
        }
    }
    function handleChangeSearch(e:any){
        setSearch(e.target.value)
    }
    const [pickerItems, setPickerItems]: any = useState([]);
    const [selectedItems, setSelectedItems]: any = useState([]);
  
    const handleCreateItem = (item: any) => {
      setPickerItems((curr:any) => [...curr, item]);
      setSelectedItems((curr:any) => [...curr, item]);
    };
  
    const handleSelectedItemsChange = (selectedItems:any) => {
        var attendArr:any;
        if (selectedItems) {
            setSelectedItems(selectedItems);
            attendArr = selectedItems;
            setConfigCreateMeeting( (prev:any)=> {
                return{
                  ...prev,
                  attendee: attendArr
                }
            })
        }
    };
    useEffect(()=>{
        if(!users?.loadingGetUsers){
            users?.users?.users?.map((user:any)=>{
                if(pickerItems.find((e:any)=>e.name === user.name) === undefined){
                    setPickerItems((prev:any)=>[...prev,{
                        value: user._id,
                        label: user.name
                    }])
                }   

            })
        }
    }, [users])
    useEffect(()=>{
        dispatch(getUsersAction(''));
        dispatch(getMeetingListAction(''));
    }, [])
    useEffect(()=>{
        if(!props.user.isAuthenticated) navigate("/login");
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
                            <FormControl>
                                <InputGroup className="flex items-center">
                                    <InputLeftElement
                                        mr={8}
                                        pointerEvents='none'
                                        children={<span className="material-symbols-outlined" style={{ 'fontSize': '20px', 'top': '1.2px', 'position': 'relative' }}> search </span>}
                                    />
                                    <Input onChange={(e:any)=> handleChangeSearch(e)} size={'md'} type='search' inputMode="search" placeholder="Search meeting" borderColor={'#7286D3'} />
                                </InputGroup>
                            </FormControl>
                            <div className="ml-4 w-fit" onClick={()=>setCreateMeetingOpen(true)}>
                                <button className="flex items-center h-[100%] bg-logo text-white rounded-lg p-2"><span className="mr-3 material-symbols-outlined">add</span>Create</button>
                            </div>
                        </div>
                        <div className="flex flex-row w-[100%] mt-8 flex-wrap gap-x-[4%]">
                            {meeting?.meetingList?.data?.map((meet:any, index:number)=>
                                <>
                                    {search === '' ?
                                        <div key={index} className="flex flex-col w-[48%] mb-4" role="button" onClick={()=>handleOpenMeetingDetail(meet)}>
                                            <div className="flex flex-col bg-border w-[100%] rounded-[1.25rem] relative">
                                                <div className="flex flex-row w-[100%]  p-4">
                                                    <div className="flex flex-col ml-2 text-white">
                                                        <span className="mb-2 text-xl">{meet.title}</span>
                                                        <span className="text-sm opacity-[0.8]">{meet.description}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> :
                                        <>
                                            {(meet.title.toLowerCase().includes(search.toLowerCase()) || meet.description.toLowerCase().includes(search.toLowerCase())) &&
                                                <div key={index} className="flex flex-col w-[48%] mb-4" role="button" onClick={()=>handleOpenMeetingDetail(meet)}>
                                                    <div className="flex flex-col bg-border w-[100%] rounded-[1.25rem] relative">
                                                        <div className="flex flex-row w-[100%]  p-4">
                                                            <div className="flex flex-col ml-2 text-white">
                                                                <span className="mb-2 text-xl">{meet.title}</span>
                                                                <span className="text-sm opacity-[0.8]">{meet.description}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div> 
                                            }
                                        </>
                                    } 
                                </>

                            )}

                        </div>
                    </div>
                </div>
                <Modal isOpen={createMeetingOpen} onClose={()=>setCreateMeetingOpen(false)}>
                    <ModalOverlay />
                    <ModalContent display={'flex'} w={'100%'} border={'2px solid #8EA7E9'} className="shadow-lg shadow-box-shadow">
                        <ModalHeader display={'flex'} alignSelf={'center'} >Create Meeting</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <FormControl width={'100%'} isInvalid={createMeetingError.title} mb={4}>
                                <FormLabel className="block text-sm">Title</FormLabel>
                                <Input type='text' name="title" 
                                onChange={(e:any)=>handleConfigCreateMeeting(e)} value={configCreateMeeting.title}
                                className="block w-full px-3 py-2 mt-1 bg-white border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 sm:text-sm focus:ring-1"
                                /> 
                                {createMeetingError.title && createError && 
                                    <FormErrorMessage position={'absolute'} bottom={'-16px'}>Please enter more than 3 characters.</FormErrorMessage>
                                }
                            </FormControl>
                            <FormControl width={'100%'} isInvalid={createMeetingError.description} mb={4}>
                                <FormLabel className="block text-sm">Description</FormLabel>
                                <Input type='text' name="description" 
                                onChange={(e:any)=>handleConfigCreateMeeting(e)} value={configCreateMeeting.description}
                                className="block w-full px-3 py-2 mt-1 bg-white border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 sm:text-sm focus:ring-1"
                                /> 
                                {createMeetingError.description && createError && 
                                    <FormErrorMessage position={'absolute'} bottom={'-16px'}>Please enter more than 3 characters.</FormErrorMessage>
                                }
                            </FormControl>
                            <FormControl width={'100%'} isInvalid={createMeetingError.type} mb={4}>
                                <FormLabel className="block text-sm">Type</FormLabel>
                                <Select name="type" onChange={(e:any)=>handleConfigCreateMeeting(e)} 
                                 className="block w-full px-3 mt-1 bg-white border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 sm:text-sm focus:ring-1">
                                    <option selected hidden disabled value="">Onsite / Online</option>
                                    <option value='onsite'>Onsite</option>
                                    <option value='online'>Online</option>
                                </Select>
                                {createMeetingError.type && createError && 
                                    <FormErrorMessage position={'absolute'} bottom={'-16px'}>Please choose meeting type.</FormErrorMessage>
                                }
                            </FormControl>
                            <FormControl width={'100%'} isInvalid={createMeetingError.platform} mb={4}>
                                <FormLabel className="block text-sm">Location / Platform</FormLabel>
                                <Input type='text' name="platform" 
                                onChange={(e:any)=>handleConfigCreateMeeting(e)} value={configCreateMeeting.platform}
                                className="block w-full px-3 py-2 mt-1 bg-white border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 sm:text-sm focus:ring-1"
                                /> 
                                {createMeetingError.platform && createError && 
                                    <FormErrorMessage position={'absolute'} bottom={'-16px'}>Please enter more than 3 characters.</FormErrorMessage>
                                }
                            </FormControl>
                            <FormControl width={'100%'} isInvalid={createMeetingError.attendee} mb={1}>
                                <CUIAutoComplete
                                    label="Choose Member"
                                    placeholder="Choose Member"
                                    onCreateItem={handleCreateItem}
                                    items={pickerItems}
                                    selectedItems={selectedItems}
                                    onSelectedItemsChange={(changes) =>
                                        handleSelectedItemsChange(changes.selectedItems)
                                    }
                                />
                                {createMeetingError.attendee && createError && 
                                    <FormErrorMessage position={'absolute'} bottom={'-1px'}>Please select a user.</FormErrorMessage>
                                }
                            </FormControl>
                        </ModalBody>

                        <ModalFooter>
                            <Button variant={'outline'} colorScheme="twitter" onClick={handleCreateMeeting} >Create</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
                <Modal isOpen={openMeetingDetail.open} onClose={()=>setOpenMeetingDetail({open:false, details: ''})}>
                    <ModalOverlay />
                    <ModalContent display={'flex'} w={'100%'} border={'2px solid #8EA7E9'} className="shadow-lg shadow-box-shadow">
                        <ModalHeader display={'flex'} alignSelf={'center'} >Meeting Details</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Flex className="flex flex-col mb-3">
                                <span className="inline-block text-lg font-semibold">Title</span>
                                <span className="inline-block opacity-[0.9]">{openMeetingDetail?.details?.title}</span>
                            </Flex>
                            <Flex className="flex flex-col mb-3">
                                <span className="inline-block text-lg font-semibold">Description</span>
                                <span className="inline-block opacity-[0.9]">{openMeetingDetail?.details?.description}</span>
                            </Flex>
                            <Flex className="flex flex-col mb-3">
                                <span className="inline-block text-lg font-semibold">host</span>
                                <span className="inline-block opacity-[0.9]">{openMeetingDetail?.details?.host?.name}</span>
                            </Flex>
                            <Flex className="flex flex-col mb-3">
                                <span className="inline-block text-lg font-semibold">Type</span>
                                <span className="inline-block opacity-[0.9]">{openMeetingDetail?.details?.type}</span>
                            </Flex>
                            <Flex className="flex flex-col mb-3">
                                <span className="inline-block text-lg font-semibold">Location / Platform</span>
                                <span className="inline-block opacity-[0.9]">{openMeetingDetail?.details?.platform}</span>
                            </Flex>
                            <Flex className="flex flex-col mb-3">
                                <span className="inline-block text-lg font-semibold">Attendee</span>
                                <span className="inline-block opacity-[0.9]">{openMeetingDetail?.details?.attendee?.map((att:any)=>att.label).join(", ")}</span>
                            </Flex>
                        </ModalBody>

                        <ModalFooter>
                            <Button variant={'outline'} onClick={()=>setOpenMeetingDetail({open:false, details: ''})} colorScheme="twitter">Ok</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
        </div>

    )
}

export default Meetings;