"use client"

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';

const FaceCheckAI: React.FC = () => {
    const [imageUrl, setImageUrl] = useState<string>("");
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [result, setResult] = useState<string>("");
    const [confidence, setConfidence] = useState<number | null>(null);
    const [realPercentage, setRealPercentage] = useState<number | null>(null);
    const [fakePercentage, setFakePercentage] = useState<number | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");

    const resetResults = () => {
        setResult("");
        setConfidence(null);
        setRealPercentage(null);
        setFakePercentage(null);
        setPreviewUrl("");
    };

    const handleImageCheck = async () => {
        if (!imageUrl.trim()) {
            toast.error("Please enter an image URL");
            return;
        }

        // Basic URL validation
        try {
            new URL(imageUrl);
        } catch {
            toast.error("Please enter a valid URL");
            return;
        }

        setIsAnalyzing(true);
        resetResults();

        try {
            const formData = new FormData();
            formData.append("url", imageUrl);

            const res = await fetch("http://127.0.0.1:8000/predict/url", {
                method: "POST",
                body: formData
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            console.log("Prediction from URL:", data);
            
            if (data.status === "success") {
                setResult(data.classification);
                setConfidence(Number(data.confidence.toFixed(2)));
                setRealPercentage(Number(data.real_percentage.toFixed(2)));
                setFakePercentage(Number(data.fake_percentage.toFixed(2)));
                setPreviewUrl(imageUrl);
                toast.success("Analysis completed successfully!");
            } else {
                toast.error(data.message || "Analysis failed. Please try again.");
            }
            setImageUrl("");
        } catch (err) {
            console.error("URL check failed:", err);
            toast.error("Failed to analyze image. Please check the URL and try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleImageCheck();
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // File validation
        if (!file.type.startsWith('image/')) {
            toast.error("Please select a valid image file");
            return;
        }

        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            toast.error("File size too large. Please select an image under 10MB");
            return;
        }

        const fileUrl = URL.createObjectURL(file);
        setIsAnalyzing(true);
        resetResults();
        setPreviewUrl(fileUrl);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("http://127.0.0.1:8000/predict/file", {
                method: "POST",
                body: formData
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            console.log("Prediction from Upload:", data);
            
            if (data.status === "success") {
                setResult(data.classification);
                setConfidence(Number(data.confidence.toFixed(2)));
                setRealPercentage(Number(data.real_percentage.toFixed(2)));
                setFakePercentage(Number(data.fake_percentage.toFixed(2)));
                toast.success("Analysis completed successfully!");
            } else {
                toast.error(data.message || "Analysis failed. Please try again.");
                // Clean up the preview URL on error
                URL.revokeObjectURL(fileUrl);
                setPreviewUrl("");
            }
        } catch (err) {
            console.error("File upload failed:", err);
            toast.error("File upload failed. Please try again later!");
            // Clean up the preview URL on error
            URL.revokeObjectURL(fileUrl);
            setPreviewUrl("");
        } finally {
            setIsAnalyzing(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="relative flex min-h-screen flex-col bg-white font-[Inter,'Noto_Sans',sans-serif]">
            <ToastContainer />
            <div className="layout-container flex h-full grow flex-col">
                {/* Header */}
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f4] px-4 sm:px-6 lg:px-10 py-3">
                    <div className="flex items-center gap-4 text-[#111418]">
                        <div className="size-6">
                            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z"
                                    fill="currentColor"
                                />
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </div>
                        <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em]">FaceCheck.AI</h2>
                    </div>
                    <div className="flex flex-1 justify-end">
                        <div className="hidden md:flex items-center gap-9 mr-8">
                            <Link href="#" className="text-[#111418] text-sm font-medium leading-normal">
                                How it works
                            </Link>
                            <Link href="#" className="text-[#111418] text-sm font-medium leading-normal">
                                Pricing
                            </Link>
                            <Link href="#" className="text-[#111418] text-sm font-medium leading-normal">
                                API
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <div className="px-4 sm:px-8 lg:px-40 flex flex-1 justify-center py-5">
                    <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                        {/* Hero Section */}
                        <div className="@container">
                            <div className="@[480px]:p-4">
                                <div
                                    className="flex min-h-[400px] sm:min-h-[500px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-lg items-center justify-center p-4"
                                    style={{
                                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBsjYoKcyfptHyfIiS6oaHDq01YsCqadCT3VBFobyXvs6YUqaeFTelLCZnFiQWETLl_OxyEl8ibLpcLi5vMYezMhRM9ursOYbyn-lg6aQ_TQEs8nFdJKTfYRawIq1EmNq-Vj9EZLtMfNZgldX3nuNYVQYgfT2qSZm4NJOgVHPGy-HzojlwK5IcDKpXvjSTarbsBVnYQtemADlaf2Iit7TVxfC5q862CzXJZQ2zjYiqgQEUiwPdLvB463mxzNks7lYCVs1SdghrXW6A1")`
                                    }}
                                >
                                    <div className="flex flex-col gap-2 text-center">
                                        <h1 className="text-white text-2xl sm:text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                                            Detect Real vs AI Faces with One Click
                                        </h1>
                                        <h2 className="text-white text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal px-4">
                                            Upload an image or paste an image URL to detect whether a face is AI-generated or real using deep learning.
                                        </h2>
                                    </div>

                                    {/* Upload Button */}
                                    <div className="flex flex-col md:flex-row gap-4 w-full max-w-5xl items-stretch p-4">
                                        {/* Upload Button */}
                                        <div className="flex w-full md:w-auto items-center">
                                            <button
                                                onClick={triggerFileUpload}
                                                disabled={isAnalyzing}
                                                className="flex items-center justify-center h-12 px-6 rounded-lg bg-[#078838] text-white text-sm font-bold tracking-[0.015em] hover:bg-[#066b2f] transition-colors w-full disabled:opacity-50"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="20"
                                                    height="20"
                                                    fill="currentColor"
                                                    viewBox="0 0 256 256"
                                                    className="mr-2"
                                                >
                                                    <path d="M74.34,85.66A8,8,0,0,1,85.66,74.34L120,108.69V24a8,8,0,0,1,16,0v84.69l34.34-34.35a8,8,0,0,1,11.32,11.32l-48,48a8,8,0,0,1-11.32,0ZM240,136v64a16,16,0,0,1-16,16H32a16,16,0,0,1-16-16V136a16,16,0,0,1,16-16H80a8,8,0,0,1,0,16H32v64H224V136H176a8,8,0,0,1,0-16h48A16,16,0,0,1,240,136Z" />
                                                </svg>
                                                <span className="truncate">
                                                    {isAnalyzing ? 'Analyzing...' : 'Upload Image'}
                                                </span>
                                            </button>
                                        </div>

                                        {/* OR separator - only visible on medium+ screens */}
                                        <div className="hidden md:flex items-center justify-center px-2 text-sm font-medium text-white">
                                            or
                                        </div>

                                        {/* URL Input */}
                                        <div className="flex w-full p-4">
                                            <div className="flex w-full items-stretch rounded-lg h-12 overflow-hidden border border-[#dce0e5]">
                                                <div className="flex items-center justify-center pl-3 pr-2 bg-white text-[#637588] border-r border-[#dce0e5]">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="20px"
                                                        height="20px"
                                                        fill="currentColor"
                                                        viewBox="0 0 256 256"
                                                    >
                                                        <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Paste image URL"
                                                    className="flex-1 px-3 text-sm text-[#111418] bg-white placeholder:text-[#637588] focus:outline-none"
                                                    value={imageUrl}
                                                    onChange={(e) => setImageUrl(e.target.value)}
                                                    onKeyPress={handleKeyPress}
                                                    disabled={isAnalyzing}
                                                />
                                                <button
                                                    onClick={handleImageCheck}
                                                    disabled={isAnalyzing || !imageUrl.trim()}
                                                    className="px-4 bg-[#197fe5] text-white font-bold text-sm hover:bg-[#156bd4] transition-colors disabled:opacity-50"
                                                >
                                                    {isAnalyzing ? 'Analyzing...' : 'Check'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Hidden File Input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept="image/*"
                            className="hidden"
                        />

                        {/* Results Section */}
                        <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                            Prediction Output
                        </h2>
                        <div className="flex w-full grow bg-white @container p-4">
                            <div className="w-full gap-1 overflow-hidden bg-white @[480px]:gap-2 aspect-[3/2] rounded-lg flex">
                                <div
                                    className="w-full bg-center bg-no-repeat bg-cover aspect-auto rounded-none flex-1"
                                    style={{
                                        backgroundImage: `url("${previewUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2v9Xp0w35h--6E80aj_F7hP6cICuGJLYdot9tOVsmSj4EqU8HkhbMC0G75Ly-hznWQ2eEyDjnM9Ak5gUMCx_Bb2Bn_Jrzjn1q1m2OQQfMWzIpWCtKWuImCD0TkWvqo2_kIsutKOElA1UAw5wIa36Kymh0Jtm3m8eoIoVRiXtNktATJW27kqVZV37TCotXOxb_0H9iDhDQwHiIba0wC4H2BACnlYsctQvEpdYVufyfsHfQNk2_gfMhj1TKaa6IjD6Vgh767IhH6v1B'}")`,
                                    }}
                                />
                            </div>
                        </div>

                        {/* Result Display */}
                        {result && (
                            <h2 className="text-[#111418] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
                                {result}
                            </h2>
                        )}
                        {confidence !== null && (
                            <>
                                <div className="flex justify-between px-1 pb-1">
                                    <p className="text-[#111418] text-base font-medium">Confidence</p>
                                    <p className="text-[#111418] text-sm font-medium">{confidence}%</p>
                                </div>
                                <div className="rounded bg-[#dce0e5] h-2">
                                    <div className="h-2 rounded bg-[#111418]" style={{ width: `${confidence}%` }} />
                                </div>
                            </>
                        )}

                        {/* Detailed Stats */}
                        <div className="flex flex-wrap gap-4 px-4 py-6">
                            <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border border-[#dce0e5] p-6">
                                <p className="text-[#111418] text-base font-medium leading-normal">Real vs Fake</p>
                                <p className="text-[#111418] tracking-light text-[32px] font-bold leading-tight truncate">
                                    {confidence !== null ? `${confidence}% ${result}` : '--'}
                                </p>
                                <div className="grid min-h-[180px] gap-x-4 gap-y-6 grid-cols-[auto_1fr] items-center py-3">
                                    <p className="text-[#637588] text-[13px] font-bold">Real</p>
                                    <div className="h-full flex-1">
                                        <div className="border-[#637588] bg-[#f0f2f4] border-r-2 h-full" style={{ width: `${fakePercentage || 0}%` }} />
                                    </div>

                                    <p className="text-[#637588] text-[13px] font-bold">Fake</p>
                                    <div className="h-full flex-1">
                                        <div className="border-[#637588] bg-[#f0f2f4] border-r-2 h-full" style={{ width: `${realPercentage || 0}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Simple Footer */}
                <footer className="flex justify-center py-6">
                    <p className="text-[#637588] text-base font-normal leading-normal">@2025 FaceCheck.AI. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default FaceCheckAI;