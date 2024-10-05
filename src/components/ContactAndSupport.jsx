import React from 'react';
import { Mail } from 'lucide-react';

const ContactAndSupport = () => (
  <div className="-mt-20 mb-8 p-4 bg-transparent rounded-lg max-w-56 mx-auto">
    <div className='flex flex-row space-x-2 text-gray-400'>
      <h3 className="text-base font-bold mb-4">Get in Touch</h3>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
        <path fill-rule="evenodd" d="M12 1.5a.75.75 0 0 1 .75.75V4.5a.75.75 0 0 1-1.5 0V2.25A.75.75 0 0 1 12 1.5ZM5.636 4.136a.75.75 0 0 1 1.06 0l1.592 1.591a.75.75 0 0 1-1.061 1.06l-1.591-1.59a.75.75 0 0 1 0-1.061Zm12.728 0a.75.75 0 0 1 0 1.06l-1.591 1.592a.75.75 0 0 1-1.06-1.061l1.59-1.591a.75.75 0 0 1 1.061 0Zm-6.816 4.496a.75.75 0 0 1 .82.311l5.228 7.917a.75.75 0 0 1-.777 1.148l-2.097-.43 1.045 3.9a.75.75 0 0 1-1.45.388l-1.044-3.899-1.601 1.42a.75.75 0 0 1-1.247-.606l.569-9.47a.75.75 0 0 1 .554-.68ZM3 10.5a.75.75 0 0 1 .75-.75H6a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 10.5Zm14.25 0a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5H18a.75.75 0 0 1-.75-.75Zm-8.962 3.712a.75.75 0 0 1 0 1.061l-1.591 1.591a.75.75 0 1 1-1.061-1.06l1.591-1.592a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" />
      </svg>
    </div>
    <div className="space-y-4">
      <a
        href="mailto:ncrumpton90@gmail.com?subject=Feedback on Tailwind Config Generator"
        className="flex text-purple-600 hover:text-[#1A202C] items-center justify-center py-2 px-4 border border-purple-600 bg-transparent shadow-sm shadow-black/25 hover:bg-purple-800 rounded-md transition duration-300 ease-in-out"
      >
        <Mail size={18} className="mr-2" />
        Send us an Email
      </a>
    </div>
  </div>
);

export default ContactAndSupport;