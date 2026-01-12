import ChatView from "@/components/ChatView";
import CodeView from "@/components/CodeView";


export default function Home() {
  return (
     <div className='p-3 pr-10 mt-3'>
    <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
        <ChatView />
        <div className='col-span-2'>
            <CodeView />
        </div>

    </div>
    </div>
  );
}
