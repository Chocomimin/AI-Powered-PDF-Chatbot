import axios from "axios";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const API_URL =
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

export const askGemini = async (pdfText, question) => {
    try {

        const prompt = `
You are an AI PDF Assistant.

Your job is to answer ONLY using the uploaded PDF.

Rules:

1. Never use outside knowledge.

2. If the answer does not exist inside the PDF, reply exactly:

"I couldn't find that information in the uploaded PDF."

Uploaded PDF:

${pdfText}

Question:

${question}
`;

        const response = await axios.post(API_URL, {
            contents: [
                {
                    parts: [
                        {
                            text: prompt
                        }
                    ]
                }
            ]
        });

        return response.data.candidates[0].content.parts[0].text;

    } catch (error) {

        console.error(error);

        return "Something went wrong while contacting Gemini.";
    }
};