
import { GoogleGenerativeAI } from "@google/generative-ai";
    
async function get() {
    try {
       let apikey = "AIzaSyDLwhf_f1chzoIqW-LtUiMGEl8CAWILI7U";
       console.log(apikey)
       if (!apikey) {
        throw new Error("API key is not defined. Check your .env file.");
    }
        const genAI = new GoogleGenerativeAI(apikey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent("who builds you");
        console.log((result.response.text()));
    } catch (error) {
        console.error("Error:", error);
    }
}
get()