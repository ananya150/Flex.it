import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
  import {
    Tabs as ShadTabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs";
  import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Input } from "@/components/ui/input"

const ImagePicker = ({imageLink, setImageLink, handleInsertLink, handleInsertImage, setInsertedImage}: {imageLink : any, setImageLink : any, handleInsertLink : any, handleInsertImage : any, setInsertedImage : any} ) => {
  return (
    <AlertDialog>
        <AlertDialogTrigger asChild>
            <div className=''>
                <span className='font-semibold text-[12px] bg-white bg-opacity-50 px-4 py-2 rounded-lg'>Insert Image</span>
            </div>
        </AlertDialogTrigger>
        <AlertDialogContent className='max-w-[360px]'>
            <AlertDialogHeader>
                <AlertDialogDescription className='flex justify-center'>
                    <ShadTabs defaultValue="upload" className="w-[310px]">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="upload">Upload Image</TabsTrigger>
                            <TabsTrigger value="insert">Insert Link</TabsTrigger>
                        </TabsList>
                        <TabsContent value="upload">
                            <Card>
                                <CardHeader>
                                    <CardTitle className='text-[18px]'>Upload Image Here</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 h-[200px] flex flex-col justify-center items-center  ">
                                    <input
                                        type="file"
                                        name="myImage"
                                        className='ml-20'
                                        onChange={(event) => {
                                            // @ts-ignore
                                            setInsertedImage(event.target.files[0]);
                                        }}
                                    />
                                </CardContent>
                                <CardFooter className='flex justify-end px-5 space-x-5'>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleInsertImage}>Confirm</AlertDialogAction>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                        <TabsContent value="insert">
                            <Card>
                                <CardHeader>
                                    <CardTitle className='text-[18px]'>Insert Link Here</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 h-[200px] flex flex-col justify-center">
                                    <div className="space-y-1">
                                        <Input value={imageLink} onChange={(e) => {setImageLink(e.target.value)}} id="current"  />
                                    </div>
                                </CardContent>
                                <CardFooter className='flex justify-end px-5 space-x-5'>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleInsertLink}>Confirm</AlertDialogAction>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </ShadTabs>
                </AlertDialogDescription>
            </AlertDialogHeader>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default ImagePicker