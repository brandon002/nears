import {useState, useEffect} from 'react';
import { useDropzone } from 'react-dropzone';
import { Flex, Image } from '@chakra-ui/react';
import Vector from '../assets/user.svg'
const ImageUploadGroup = (props: any) => {
    const {
        handleChangePicture,
        picture,
        preview,
        setPreview
    } = props;
    const {getRootProps, getInputProps} = useDropzone({
        accept: {'image/*': []},
        onDrop: (acceptedFiles: any) => {
            setPreview(acceptedFiles.map((file: any)=> Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        },
        multiple: false,
        onDropAccepted: handleChangePicture,
        onDropRejected: (e:any) => {
            alert('Please input valid image');
        },
        maxSize: 2000000
    });
    return(
        <Flex direction={'column'} mb={2}>
            <Flex {...getRootProps()}  gap={'12px'} cursor={'pointer'}>
                <input {...getInputProps()}/>
                {picture === undefined || picture === 'data:undefined;base64,undefined' || picture === '' ? 
                    <Image  className="mb-2 border-solid border-[3px] border-border rounded-full w-16 h-16" fit={'cover'} src={preview === '' ? Vector : preview[0]?.preview} alt='pic'/>
                    :
                    <Image  className="mb-2 border-solid border-[3px] border-border rounded-full w-16 h-16" fit={'cover'} src={preview !== '' ? preview[0]?.preview : picture} alt='pic'/>
                }
            </Flex>
        </Flex>
    )
}

export default ImageUploadGroup;