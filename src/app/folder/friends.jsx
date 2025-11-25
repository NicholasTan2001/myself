"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Timeout from "../components/Timeout";
import Loading from "../components/Loading";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import FontA from "../components/FontA";
import FormInput from "../components/FormInput";
import ButtonA from "../components/ButtonA";
import ButtonB from "../components/ButtonB";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function FriendsPage() {

    const router = useRouter();
    const [userID, setUserID] = useState("");
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState([]);
    const [myData, setMyData] = useState([]);
    const [searchResult, setSearchResult] = useState(false);
    const [userError, setUserError] = useState("");
    const [loadingAddFriend, setLoadingAddFriend] = useState(false);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [relation, setRelation] = useState("");
    const [loadingDeleteFriend, setLoadingDeleteFriend] = useState("");


    {/* Effect: loading in 3 seconds */ }
    useEffect(() => {

        const timer = setTimeout(() => setLoading(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    {/* Effect: get  data user */ }
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/user");
                const data = await res.json();

                if (!data.error) {
                    setMyData(data.user);
                }

            } catch (err) {
                console.error("*Error fetching tasks:", err);
            }
        };
        const timer = setTimeout(fetchUser, 2900);
        return () => clearTimeout(timer);
    }, []);

    {/* Effect: get data from relation */ }
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/friend");
                const data = await res.json();

                if (!data.error) {
                    setRelation(data.relation);
                }

            } catch (err) {
                console.error("*Error fetching tasks:", err);
            }
        };
        const timer = setTimeout(fetchUser, 2900);
        return () => clearTimeout(timer);
    }, []);

    {/* Function: loading page */ }
    if (loading) return <Loading />;

    {/* Function: submit friend's ID */ }
    const handleSubmitID = async (e) => {
        e.preventDefault();

        setLoadingSearch(true);

        if (!userID) {

            setUserError("* Friend's ID is required");
            return;
        }

        if (!Number.isInteger(Number(userID))) {

            setUserError("* Friend's ID must be number");
            return;
        }

        if (userID == myData.id) {

            setUserError("* Friend's ID is yours");
            return;
        }

        try {
            const res = await fetch("/api/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: Number(userID) }),
            });

            const data = await res.json();
            setUserData(data);
            setSearchResult(true);

        } catch (err) {
            console.error(err);
        } finally {

            setLoadingSearch(false);
        }
    };

    {/* Function: add friend */ }
    const handleAddFriend = async (e) => {
        e.preventDefault();

        setLoadingAddFriend(true);

        try {
            const res = await fetch("/api/friend", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ friendID: userData.id }),
            });

            const data = await res.json();

            if (data) {

                router.push("/auth/dashboard");

            }

        } catch (err) {
            console.error(err);
        } finally {

            setLoadingAddFriend(false);
        }
    };

    {/* Function: delete friend */ }
    const handleDeleteFriend = async (e) => {
        e.preventDefault();

        setLoadingDeleteFriend(true);

        try {
            const res = await fetch("/api/friend", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ friendID: userData.id }),
            });

            const data = await res.json();

            if (data) {

                router.push("/auth/dashboard");

            }

        } catch (err) {
            console.error(err);
        } finally {
            setLoadingDeleteFriend(false);
        }
    };

    return (
        <>
            <header><Navbar /></header>

            <main className="flex flex-col max-w-screen-2xl mx-auto">

                <Timeout />

                {/* Title */}
                <motion.div
                    className="flex justify-center items-center mt-10"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <div className="bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.8)] rounded-2xl px-10 py-5 text-center w-[70%] lg:w-[50%]">
                        <FontA>
                            <h1 className="text-xl lg:text-2xl">👯 Friends</h1>
                        </FontA>
                    </div>
                </motion.div>

                {/* Search Friends */}
                <motion.div
                    className="flex justify-center mt-10 px-10"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <div className="bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.8)] rounded-2xl px-10 py-5 w-full lg:w-[70%]">
                        <h1 className="font-semibold text-md lg:text-lg"> Find Friends </h1>
                        <h1 className="font-semibold text-md lg:text-lg text-gray-500 mb-5">
                            * Connect with genuine friends
                        </h1>
                        <form onSubmit={handleSubmitID}>
                            <div className="flex flex-col">
                                <div className="flex flex-row gap-5 items-center justify-center">
                                    <FormInput
                                        label="Friend's ID"
                                        type="text"
                                        name="id"
                                        value={userID}
                                        placeholder="Enter your friend's ID"
                                        onChange={(e) => {
                                            setUserID(e.target.value)
                                            setUserError(" ");
                                        }}
                                    />

                                    <div className="mt-2">
                                        <ButtonA type="submit">{loadingSearch ? "Searching..." : "Search"}</ButtonA>
                                    </div>
                                </div>
                            </div>

                            {userError && <p className="text-red-500 text-sm text-left mb-5">{userError}</p>}

                        </form>
                    </div>
                </motion.div>

                {/* Friend Search Result */}
                {searchResult &&
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={userData && Object.keys(userData).length > 0 ? userData.id : "not-found"}
                            className="flex justify-center mt-10 px-10"
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                        >
                            <div className="bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.8)] rounded-2xl px-10 py-5 w-full lg:w-[70%]">
                                <h1 className="font-semibold text-md lg:text-lg"> Friend Search Result </h1>
                                <h1 className="font-semibold text-md lg:text-lg text-gray-500 mb-5">
                                    * A friend found based on the search
                                </h1>

                                {userData && userData.id ? (
                                    <>
                                        <div className="flex flex-col items-left justify-center mt-5">

                                            <div className="flex flex-row mb-5">
                                                <p className="flex text-sm lg:text-base font-semibold">Friend's ID </p>
                                                <p className="flex text-sm lg:text-base font-semibold text-gray-500">&nbsp;: {userData.id} </p>
                                            </div>

                                            <div className="flex flex-row">
                                                <p className="flex text-sm lg:text-base font-semibold">Name </p>
                                                <p className="flex text-sm lg:text-base font-semibold text-gray-500">&nbsp;: {userData.name} </p>
                                            </div>

                                            <div className="flex flex-row">
                                                <p className="flex text-sm lg:text-base font-semibold">Email </p>
                                                <p className="flex text-sm lg:text-base font-semibold text-gray-500">&nbsp;: {userData.email} </p>
                                            </div>

                                            <div className="flex flex-row mt-5">
                                                <p className="flex text-sm lg:text-base font-semibold">Friend's Type </p>
                                                {relation.length > 0 && relation.find(r => r.friendId === userData.id) ? (
                                                    <p className="flex text-sm lg:text-base text-blue-500 font-semibold">
                                                        &nbsp;: {relation.find(r => r.friendId === userData.id).type.charAt(0).toUpperCase() + relation.find(r => r.friendId === userData.id).type.slice(1)}
                                                    </p>
                                                ) : (
                                                    <p className="flex text-sm lg:text-base text-green-500 font-semibold">
                                                        &nbsp;: New
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex justify-end mt-3 items-center">
                                            {relation.length > 0 && relation.find(r => r.friendId === userData.id) ? (
                                                <div className="flex flex-row items-center gap-5">
                                                    {loadingDeleteFriend && (
                                                        <div className="animate-spin rounded-full h-5 w-5 border-3 border-red-300 border-solid border-t-transparent"></div>
                                                    )}
                                                    <ButtonB onClick={handleDeleteFriend}>
                                                        {loadingDeleteFriend ? "Deleting..." : "Delete Friend"}
                                                    </ButtonB>
                                                </div>
                                            ) : (
                                                <div className="flex flex-row items-center gap-5">
                                                    {loadingAddFriend && (
                                                        <div className="animate-spin rounded-full h-5 w-5 border-3 border-blue-300 border-solid border-t-transparent"></div>
                                                    )}
                                                    <ButtonA onClick={handleAddFriend}>
                                                        {loadingAddFriend ? "Adding..." : "Add Friend"}
                                                    </ButtonA>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex flex-col items-center justify-center mt-5 ">
                                            <Image
                                                src="/nofriends.jpg"
                                                alt="No tasks"
                                                width={120}
                                                height={120}
                                                className="opacity-80"
                                            />
                                            <p className="text-gray-400 text-sm lg:text-base font-semibold text-center">
                                                Friend's ID not found.
                                            </p>
                                        </div>

                                    </>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence >
                }

                <div className="flex mt-100"> hi </div>

            </main >

            <footer><Footer /></footer>

        </>
    );
}
