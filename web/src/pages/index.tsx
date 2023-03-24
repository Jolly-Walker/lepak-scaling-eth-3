import { Player } from '@lottiefiles/react-lottie-player';
import animation from '@/lib/hero.json';

export default function Home() {
  return (
    <div className="flex justify-between items-center md:pt-12">
      <div className="w-full hidden md:block">
        <Player
          autoplay
          loop
          src={animation}
          className="max-w-xl"
        >
        </Player>
      </div>
      <div className="space-y-8">
        <h1 className="font-bold text-4xl sm:text-6xl lg:text-7xl max-w-5xl">
          Simplify Your Crypto Payments With Recurpay
        </h1>
        <p className="text-xl lg:text-2xl max-w-7xl font-medium">
          Getting started with crypto and web3 and can be an overwhelming experience. 
          We take care of the complex, techy stuff for you so that you can get the 
          best web3 experience without all the hassle.
        </p>
        <a href="/sign-up" className="text-xl bg-grad px-5 py-4 rounded-lg inline-block">
          Create your wallet
        </a>
      </div>
    </div>
  )
}
