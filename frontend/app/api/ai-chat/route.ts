import { sendChatMessage } from "@/utils/config/aimodel";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
 const {prompt} = await req.json();
 
 console.log('prompt',prompt);

 try {
    const response = await sendChatMessage(prompt);
    //console.log('res',response)


    return NextResponse.json({
        result:response
    })
 } catch (error) {
    if(error instanceof Error)
    console.log(error.message)
    return NextResponse.json({error})
 }   
}