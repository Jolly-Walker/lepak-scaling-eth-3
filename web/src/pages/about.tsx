export default function About() {
  return (
    <div className="space-y-4 text-lg max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">About RecurriPay</h1>
      <p>
        This project leverages account abstraction to build a wallet which
        enables recurring payments and social recovery. Under the hood, it uses
        Gelato Network to automate the recurring payment and Optimism’s
        Attestation Station to provide social recovery function.
      </p>
      <p>
        With account abstraction it has made wallet creation easier and more
        seamless. Social recovery function also enhances the user experience as
        now users can recover their wallet in the event of them losing their
        private key. Last but not least, being able to automate payments opens
        up a new capability for on-chain interactions such as paying for
        subscription or DCA-ing. This project is deployed to the Optimism,
        Scroll, and Polygon chains.
      </p>
      <h2 className="text-xl font-bold">How it&apos;s made</h2>
      <p>
        The frontend of this project is built using React. Under the hood, this
        project builds on top of the @account-abstraction-sdk by Eth-infinitism
        to enable first class citizen contract accounts. We wrote smart
        contracts inheriting from SimpleAccount and SimpleAccountFactory with
        additional features - recurring payment and social recovery.
      </p>
      <p>
        For the former, when a user sets up a recurring payment order, we write
        it to the account smart contract as well as creating a task in Gelato
        Network. It will then call the specified function to execute the
        transaction every interval defined by the user.
      </p>
      <p>
        As for social recovery, we are using Optimism’s Attestation Station.
        First, the user specifies 3 addresses that can attest for them in the
        event of lost access to the account. In order to recover the funds
        within it, the 3 addresses need to send an attestation to the smart
        contract. Then, a function can be called in the account contract to move
        the funds to another address. Optimism’s Attestation Station is easy to
        integrate and provides a simple and secure mechanism to build our social
        recovery feature.
      </p>
    </div>
  );
}
