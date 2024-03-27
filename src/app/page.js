"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { CiSearch, CiPower } from "react-icons/ci";
import Card from "./components/Card";
import Link from "next/link";
import { UserAuth } from "./context/AuthContext";
import { useRouter } from "next/navigation";
import { db } from "./firebase"; // Import Firestore
import { updateDoc, doc, onSnapshot } from "firebase/firestore";
import CircularMeter from "./components/CreditBar";
import CreditModal from "./components/CreditModal";
import { BackendLoading } from "./components/BackendLoading";

const Homepage = () => {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [truncatedAnswer, setTruncatedAnswer] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [backendLoading, setBackendLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false); // State to track expansion
  const [credits, setCredits] = useState(0); // State to store user's credits
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const { user, logOut } = UserAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to sign-in page if user is not logged in
    if (!user?.email) {
      router.push("/login");
    } else {
      // Fetch user's credits from Firestore
      const fetchCredits = async () => {
        try {
          const docRef = doc(db, "users", user.uid);
          onSnapshot(docRef, (doc) => {
            setCredits(doc.data()?.credits || 0);
          });
        } catch (error) {
          console.error("Error fetching user credits:", error);
        }
      };
      fetchCredits();
    }
  }, [user]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make a request to your backend endpoint
        await axios.get("https://smartsearch-backend.onrender.com/"); // Assuming your backend server is running on the same host as your frontend
        // If the request is successful, navigate the user to the desired page
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setBackendLoading(false); // Update loading state when request completes (success or failure)
      }
    };

    fetchData(); // Call the fetchData function when the component mounts
  }, [backendLoading]); // Empty dependency array ensures the effect runs only once when the component mounts

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (credits === 0) {
      setIsCreditModalOpen(true); // Open the credit modal
      return;
    }
    setLoading(true);
    try {
      const queryResponse = await axios.post("https://smartsearch-backend.onrender.com/query", {
        question: query,
      });
      console.log("Query Response:", queryResponse);

      const answer = queryResponse.data.answer;
      setAnswer(answer);

      // Truncate the answer to display
      setTruncatedAnswer(truncateAnswer(answer, 50));

      const contextResponse = await axios.post(
        "https://smartsearch-backend.onrender.com/context",
        {
          question: query,
        }
      );
      console.log("Context Response:", contextResponse);

      const results = contextResponse.data.context;
      setResults(results);

      // Deduct one credit after successful search
      setCredits(credits - 1);
      // Update credits in Firestore
      await updateDoc(doc(db, "users", user.uid), {
        credits: credits - 1,
      });
      setCredits(credits - 1);
    } catch (error) {
      console.error("Error searching:", error);
      setAnswer("Error searching. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  // Function to truncate the answer
  const truncateAnswer = (text, limit) => {
    const words = text.split(" ");
    if (words.length > limit) {
      return words.slice(0, limit).join(" ") + "...";
    } else {
      return text;
    }
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const handleLogout = async () => {
    try {
      await logOut(); // Log out using the provided logOut function
      router.push("/login"); // Redirect to the sign-in page after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  if (backendLoading) {
    return <BackendLoading/>
  }
  return (
    <>
      <div className="w-full h-screen flex justify-center items-center">
        <img
          className=" absolute w-full h-screen object-cover"
          src="https://images.unsplash.com/photo-1706708316348-942c80a29576?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="/"
        />
        <div className="bg-black/10 backdrop-blur-3xl absolute top-0 left-0 w-full h-screen"></div>
        <Link
          href="/"
          className="text-3xl text-white cursor-pointer font-semibold p-5 absolute top-0 left-0 right-0"
        >
          Smart<span className="font-thin">Search</span>
        </Link>
        <div className="flex items-center gap-5 absolute p-5 top-0 right-0">
          {credits === 0 && (
            <p className="text-white hidden md:block text-sm bg-yellow-400/30 p-1 px-3 rounded-full ">
              No credits left
            </p>
          )}
          <CircularMeter credits={credits} totalCredits={2} />
          <button title="Logout" onClick={handleLogout}>
            <CiPower color="white" size={25} />
          </button>
        </div>

        <div className="max-w-6xl mx-auto bg-gray-300/20 rounded-2xl shadow-md backdrop-blur-md text-white w-full">
          <div className="max-w-3xl lg:max-h-[500px] max-h-[700px] px-5 mx-auto py-16 overflow-scroll">
            <form
              onSubmit={handleSubmit}
              className="flex items-center justify-center"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="SmartSearch the web"
                className="rounded-full w-full placeholder:text-gray-300 placeholder:text-sm bg-gray-100/20 px-4 py-2 mr-2 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-red-500 hover:bg-red-600 font-thin text-sm text-white px-4 py-2 rounded-full focus:outline-none"
                disabled={loading}
              >
                {loading ? "Searching..." : <CiSearch size={25} />}
              </button>
            </form>
            <div className="overflow-y-scroll">
              {truncatedAnswer && (
                <div className="mt-10">
                  <p className="mb-2">
                    {isExpanded ? answer : truncatedAnswer}
                  </p>
                  {answer.split(" ").length > 50 && (
                    <button
                      className="text-blue-500 text-sm hover:text-blue-700 focus:outline-none"
                      onClick={handleToggleExpand}
                    >
                      {isExpanded ? "Read Less" : "Read More"}
                    </button>
                  )}
                </div>
              )}
              {results.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl font-bold mb-4">Related Articles:</h2>
                  {results.map((result, index) => (
                    <Card key={index} result={result} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <CreditModal
        isOpen={isCreditModalOpen}
        setIsOpen={() => setIsCreditModalOpen(false)}
      />
    </>
  );
};

export default Homepage;
