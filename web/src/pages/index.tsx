import { Player } from "@lottiefiles/react-lottie-player";
import animation from "@/lib/hero.json";
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="space-y-16 e">
      <div className="flex justify-between items-center md:pt-12">
        <div className="w-full hidden md:block">
          <Player autoplay loop src={animation} className="max-w-xl"></Player>
        </div>
        <div className="space-y-8">
          <h1 className="font-bold text-4xl sm:text-6xl lg:text-7xl max-w-5xl">
            Simplify Your Crypto Payments With RecurriPay
          </h1>
          <p className="text-lg lg:text-xl max-w-7xl font-medium">
            Getting started with crypto and web3 and can be an overwhelming
            experience. We take care of the complex, techy stuff for you so that
            you can get the best web3 experience without all the hassle.
          </p>
          <Link
            href="/sign-up"
            className="text-xl bg-grad px-5 py-4 rounded-lg inline-block"
          >
            Create your wallet
          </Link>
        </div>
      </div>
      <div className="md:pt-12 lg:text-xl pb-32">
        <h2 className="font-bold text-3xl sm:text-4xl lg:text-5xl max-w-5xl">
          A Better Wallet
        </h2>
        <p className="mb-4 mt-2 sm:mb-8 max-w-3xl">RecurPay is a next-generation crypto wallet that offers a seamless and user-friendly experience for managing cryptocurrency. Our goal is to make it easy for users to participate in the world of web3 and manage their digital assets without having to worry about the technical details.</p>
        <div className="flex gap-8">
          <div className="w-full space-y-2">
            <div className="w-16 bg-grad rounded-lg p-4 flex justify-center items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" />
              </svg>
            </div>
            <p className="text-xl sm:text-2xl font-bold">Account Abstraction</p>
            <p>Account abstraction simplifies the process of interacting with the blockchain, making it easier for users to manage their cryptocurrency without having to worry about complex technical details.</p>
          </div>
          <div className="w-full space-y-2">
            <div className="w-16 bg-grad rounded-lg p-4 flex justify-center items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
              </svg>
            </div>
            <p className="text-xl sm:text-2xl font-bold">Recurring Payments</p>
            <p>We make it easy to set up automatic recurring payments for managing your monthly bills or subsription payments and avoid the hassle of having to manually make the transaction each time.</p>
          </div>
          <div className="w-full space-y-2">
            <div className="w-16 bg-grad rounded-lg p-4 flex justify-center items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>

            <p className="text-xl sm:text-2xl font-bold">Social Recovery</p>
            <p>Users can transfer their funds from their old wallet to a new one in case they lose their password. They can do this by simply asking the owners of the recovery addresses to confirm their identity.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
