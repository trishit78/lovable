import { generateCode } from "@/utils/config/aimodel";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
 const {prompt} = await req.json();
 
 console.log('prompt',prompt);

 try {
    const response = await generateCode(prompt);
    //console.log('res',response)
if(!response){
    throw new Error('')
}

    return NextResponse.json({
        result:JSON.parse(response)
    })
 } catch (error) {
    if(error instanceof Error)
    console.log(error.message)
    return NextResponse.json({error})
 }   
}