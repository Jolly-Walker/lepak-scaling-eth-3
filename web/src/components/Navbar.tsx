import React, { useState } from "react";

export default function Navbar({ isSignedIn }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="">
        <div className="h-16 mx-auto flex items-center justify-between px-4 xl:container lg:px-16 xl:px-20">
          <a
            href="/"
            className="mr-6 flex gap-2 items-center text-xl font-bold"
          >
            <img src="/logo.png" alt="logo" className="h-16" />
            RecurriPay
          </a>
          <nav className="flex gap-6">
            <div className="hidden md:block space-x-6 ">
              {!isSignedIn ? (
                <>
                  <a href="/">Home</a>
                  <a href="/about">About</a>
                  <a
                    href="/dashboard"
                    className="bg-grad text-transparent bg-clip-text"
                  >
                    Sign in
                  </a>
                  <a
                    href="/dashboard"
                    className="text-xl bg-grad px-4 py-2 rounded-lg inline-block"
                  >
                    Get started
                  </a>
                </>
              ) : (
                <>
                  <a href="/dashboard">Dashboard</a>
                  <a href="/notifications">Notifications</a>
                  <a href="/account">Account</a>
                </>
              )}
            </div>
          </nav>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="btn btn-icon md:hidden"
          >
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </div>
      </header>
      <nav
        className={
          "md:hidden p-4 flex flex-col gap-2" + (!isOpen ? " hidden" : "")
        }
      >
        {!isSignedIn ? (
          <>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/dashboard">Sign in</a>
          </>
        ) : (
          <>
            <a href="/dashboard">Dashboard</a>
            <a href="/notifications">Notifications</a>
            <a href="/account">Account in</a>
          </>
        )}
      </nav>
    </>
  );
}
