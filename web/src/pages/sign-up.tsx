import { useState } from 'react';

export default function SignUp() {
  const [isContinue, setIsContinue] = useState(false);

  return (
    <div className="flex justify-center">
      <div className="bg-bg2 rounded-xl shadow-lg space-y-4 p-6 w-full max-w-lg">
      {!isContinue
        ? (<>
          <h1 className="text-xl font-bold">Create your wallet</h1>
          <p>desc</p>
          <div className="space-y-2 pb-4 pt-8">
            <div>
              <label className="block mb-2">Your password</label>
              <input type="password" className="bg-bg3 rounded-lg p-2 w-full"/>
            </div>
            <div>
              <label className="block mb-2">Confirm your password</label>
              <input type="password" className="bg-bg3 rounded-lg p-2 w-full"/>
            </div>
          </div>
          <button 
            onClick={() => setIsContinue(true)} 
            className="bg-grad px-4 py-3 rounded-lg w-full"
          >
            Continue
          </button>
        </>) : (<>
          <h1 className="text-xl font-bold">Add recovery addresses</h1>
          <p>desc</p>
          <div className="space-y-2 pb-4 pt-8">
            <div>
              <label className="block mb-2">Address #1</label>
              <input className="bg-bg3 rounded-lg p-2 w-full"/>
            </div>
            <div>
              <label className="block mb-2">Address #2</label>
              <input className="bg-bg3 rounded-lg p-2 w-full"/>
            </div>
            <div>
              <label className="block mb-2">Address #3</label>
              <input className="bg-bg3 rounded-lg p-2 w-full"/>
            </div>
          </div>
          <button 
            onClick={() => setIsContinue(true)} 
            className="bg-grad px-4 py-3 rounded-lg w-full"
          >
            Create wallet
          </button>
        </>)}
      </div>
    </div>
  )
}
