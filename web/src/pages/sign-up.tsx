import { useState } from 'react';

export default function SignUp() {
  const [isContinue, setIsContinue] = useState(false);

  return (
    <div className="flex justify-center">
      <div className="bg-bg2 rounded-xl shadow-lg space-y-4 p-6 w-full max-w-lg">
      {!isContinue
        ? (<>
          <h1 className="text-xl font-bold">Create your wallet</h1>
          <p>To get started with RecurPay, simply choose a strong, unique password to protect your wallet. We recommend using a combination of uppercase and lowercase letters, numbers, and special characters to create a strong password.</p>
          <div className="space-y-2 pb-4 pt-8">
            <div>
              <label className="block mb-2">Your password</label>
              <input required type="password" className="input"/>
            </div>
            <div>
              <label className="block mb-2">Confirm your password</label>
              <input required type="password" className="input"/>
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
          <p>Add atleast one recovery address to secure your wallet. You can choose a trusted friend or family member who will be able to help you regain access to your wallet in the event that you forget your password. You can have up to three recovery addresses.</p>
          <div className="space-y-2 pb-4 pt-8">
            <div>
              <label className="block mb-2">Address #1</label>
              <input 
                required
                className="input" 
                placeholder="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
              />
            </div>
            <div>
              <label className="block mb-2">Address #2</label>
              <input 
                className="input"
                placeholder="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
              />
            </div>
            <div>
              <label className="block mb-2">Address #3</label>
              <input 
                className="input"
                placeholder="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
              />
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
