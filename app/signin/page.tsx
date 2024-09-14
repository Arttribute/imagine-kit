"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import RetroGrid from "@/components/magicui/retro-grid";
import { Sparkles } from "lucide-react";

function SignupPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/worlds");
    }
  }, [status, router]);

  //function to login with google and store details in loacal storage
  const handleGoogleLogin = async () => {
    const response = await signIn("google", {
      callbackUrl: `${window.location.origin}/worlds`,
      redirect: false, // Prevent auto-redirect to handle errors properly
    });

    if (response?.error) {
      console.error("Google sign-in error:", response.error);
      // Handle the error (e.g., display a message to the user)
    } else if (response?.url) {
      window.location.href = response.url; // Manually redirect after successful sign-in
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="border border-gray-500 shadow-2xl shadow-indigo-300 rounded-2xl bg-white z-10 p-2 w-96 lg:w-[460px]">
        <div className="p-6 border  border-purple-300 rounded-xl">
          <div className="flex  justify-center">
            <p className="p-1 whitespace-pre-wrap bg-gradient-to-r from-orange-500 via-pink-500 to-indigo-500 bg-clip-text text-xl font-bold text-center  leading-none tracking-tighter text-transparent">
              Imagine kit
            </p>
            <Sparkles className="h-4 w-4 mt-0.5 text-indigo-500" />
          </div>

          <div className="p-6 flex flex-col items-center justify-center">
            <h1 className="text-2xl font-semibold ">Start using it!</h1>
            <p className="text-base text-center mb-2 ">
              Sign up - or login in to your existing account
              <br />
            </p>
          </div>

          <div className="flex justify-center">
            <Button
              variant="outline"
              className="flex items-center space-x-2 my-1 w-full border border-gray-500"
              type="button"
              onClick={handleGoogleLogin}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="20"
                height="20"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#fbc02d"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
                <path
                  fill="#e53935"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                ></path>
                <path
                  fill="#4caf50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                ></path>
                <path
                  fill="#1565c0"
                  d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
              </svg>
              <span>Sign in with Google</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="z-10 flex items-center justify-center text-center mt-10 text-xs px-8 text-gray-600">
        By authenticating, you agree to our Terms of Service and Privacy Policy.
      </div>
      <RetroGrid />
    </div>
  );
}

export default SignupPage;
