"use client";

import React, {useState} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {AuthModal} from "./AuthModal";
import { toast } from "sonner";
import { addProduct } from "@/app/actions";

const AddProductForm = ({user}) => {
    const [url,setUrl] = useState("");
    const [loading,setLoading] = useState(false);

    const [showAuthModal,setShowAuthModal] = useState(false);
    const handleSubmit = async (e) =>{
        e.preventDefault();
        if(!user){
            setShowAuthModal(true);
            return;
        }
        setLoading(true);
const formData = new FormData();
formData.append("url", url);

try {
  const result = await addProduct(formData);

  if (result.error) {
    toast.error(result.error);
  } else {
    toast.success(result.message || "Product tracked successfully");
    setUrl("");
  }
} finally {
  setLoading(false);
}
    };
    return (
    <>
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
                <Input
                    type="url"
                    value={url}
                    onChange={(e)=> setUrl(e.target.value)}
                    placeholder="Paste product URL (Flipkart, Amazon, etc..."
                    className="h-12 text-base"
                    required
                    disabled={loading}
                />
                <Button className="bg-orange-500 hover:bg-orange-600 h-10 sm:h-12 px-8" type="submit" disabled={loading} size="lg">
                    {loading? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding....
                        </>

                    ):(
                        "Track Price"
                    )}
                </Button>
            </div>
            
        </form>
    {/* Auth Modal */}
                <AuthModal 
                    isOpen={showAuthModal} 
                    onClose={() => setShowAuthModal(false)} 
                />
    </>
    )
}

export default AddProductForm;