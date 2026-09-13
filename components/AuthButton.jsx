"use client";
import React, { useState } from 'react';
import { logOut } from "lucide-react";
import { AuthModal } from "@/components/AuthModal";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";
import { signOut } from "@/app/actions";

const AuthButton = ({user}) => {
    const [showAuthModal, setShowAuthModal] = useState(false);
    if (user) {
        return (
            <form action={signOut} className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 gap-2"
              
                >
                    <LogOut className="w-4 h-4"/>
                    Sign Out
            </Button>
            </form>

        )
    }
    return (
    <>
            <Button
              onClick={() => setShowAuthModal(true)}
              variant="default"
              size="sm"
              className="bg-orange-500 hover:bg-orange-600 gap-2"
              
            >
              <LogIn className="w-4 h-4"/>
              Sign In
            </Button>

            <AuthModal 
                isOpen={showAuthModal} 
                onClose={() => setShowAuthModal(false)} 
            />
    </>

  )
}

export default AuthButton