"""
Groq Intelligence Engine
Enterprise-grade Singleton AI Service for Agricultural Insights.
"""

import os
import logging
from groq import Groq
from typing import List, Dict, Optional, Generator

logger = logging.getLogger(__name__)

class GroqAssistant:
    _instance = None

    def __new__(cls, *args, **kwargs):
        """
        Singleton pattern for consistent API connection.
        Synchronized with __init__ arguments to prevent instantiation errors.
        """
        if cls._instance is None:
            cls._instance = super(GroqAssistant, cls).__new__(cls)
            cls._instance.initialized = False
        return cls._instance

    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the Groq Client. 
        Ensures the engine is only configured once despite multiple calls.
        """
        if getattr(self, 'initialized', False):
            return
            
        self.api_key = api_key or os.getenv('GROQ_API_KEY')
        self.client = None
        
        if self.api_key:
            try:
                self.client = Groq(api_key=self.api_key)
                self.initialized = True
                logger.info("🚀 AgroVision AI Engine: Online & Optimized")
            except Exception as e:
                logger.error(f"Groq Initialization Failed: {e}")
        else:
            logger.warning("⚠️ GROQ_API_KEY missing. Engine running in offline/mock mode.")

    def get_recovery_plan(self, disease_name: str, crop_name: str, language: str = 'en') -> str:
        """
        Generates a 7-day high-impact recovery protocol for identified diseases.
        """
        prompts = {
            'en': (
                f"Act as an expert agronomist. Create a detailed 7-day recovery plan for {crop_name} "
                f"affected by {disease_name}. Include specific organic treatments, watering adjustments, "
                f"and isolation steps. Use clear bullet points."
            ),
            'hi': (
                f"एक विशेषज्ञ कृषि विज्ञानी के रूप में कार्य करें। {crop_name} में {disease_name} के लिए "
                f"7 दिनों का विस्तृत रिकवरी प्लान बनाएं। जैविक उपचार और सिंचाई में सुधार शामिल करें।"
            )
        }
        
        prompt = prompts.get(language, prompts['en'])
        return self.ask_question(prompt, language)

    def ask_question(self, question: str, language: str = 'en', context: Optional[List[Dict]] = None) -> str:
        """
        Process complex agricultural queries with Llama-3 reasoning.
        """
        if not self.client:
            return self._mock_response(question, language)
        
        try:
            # Build narrative context
            messages = [{"role": "system", "content": self._get_system_prompt(language)}]
            
            # Efficient Context Window management
            if context:
                for msg in context[-5:]: # Increased slightly to 5 for better reasoning
                    # Map 'bot' or 'assistant' to 'assistant', everything else to 'user'
                    role = "assistant" if msg.get('sender') in ['bot', 'assistant', 'ai'] else "user"
                    content = msg.get('text') or msg.get('content') or ""
                    if content:
                        messages.append({"role": role, "content": content})
            
            messages.append({"role": "user", "content": str(question)})

            chat_completion = self.client.chat.completions.create(
                messages=messages,
                model="llama-3.3-70b-versatile",
                temperature=0.3,
                max_tokens=1024,
                top_p=0.9
            )
            
            # Defensive extraction of content
            if chat_completion.choices and len(chat_completion.choices) > 0:
                raw_response = chat_completion.choices[0].message.content
                if raw_response:
                    return self._post_process_response(raw_response, language)
            
            return self._error_response(language)

        except Exception as e:
            logger.error(f"Groq API Transaction Error: {e}")
            return self._error_response(language)

    def stream_response(self, question: str, language: str = 'en') -> Generator[str, None, None]:
        """
        High-performance streaming for real-time AI interaction.
        """
        if not self.client:
            yield self._mock_response(question, language)
            return

        try:
            messages = [
                {"role": "system", "content": self._get_system_prompt(language)},
                {"role": "user", "content": question}
            ]

            stream = self.client.chat.completions.create(
                messages=messages,
                model="llama-3.3-70b-versatile",
                temperature=0.3,
                max_tokens=1024,
                stream=True,
            )

            for chunk in stream:
                if chunk.choices and chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content

        except Exception as e:
            logger.error(f"Groq Streaming Error: {e}")
            yield self._error_response(language)

    def _get_system_prompt(self, language='en'):
        """Professional persona definition for the AI."""
        if language == 'hi':
            return (
                "आप AgroVision AI के विशेषज्ञ कृषि सलाहकार हैं। "
                "किसानों को सटीक, वैज्ञानिक और जैविक खेती की सलाह दें। "
                "जवाब छोटा, स्पष्ट और बुलेट पॉइंट्स में रखें।"
            )
        return (
            "You are the AgroVision AI Principal Agronomist. Your mission is to provide "
            "farmers with precise, sustainable, and scientifically-backed advice. "
            "Focus on organic solutions, pest management, and soil health. "
            "Format: Use Markdown, bold headings, and concise bullet points for mobile clarity."
        )

    def _post_process_response(self, response: str, language: str = 'en') -> str:
        """Standardizes output and attaches professional disclaimers."""
        disclaimer = {
            'en': "\n\n---\n⚠️ **Note:** This is an AI recommendation. For critical crop failure, "
                  "consult your local Krishi Vigyan Kendra (KVK).",
            'hi': "\n\n---\n⚠️ **नोट:** यह एक AI सुझाव है। गंभीर समस्या के लिए अपने स्थानीय "
                  "कृषि विज्ञान केंद्र (KVK) से संपर्क करें।"
        }
        return str(response).strip() + disclaimer.get(language, disclaimer['en'])

    def _mock_response(self, question: str, language: str) -> str:
        """Fallback response for development without API keys."""
        if language == 'hi':
            return "क्षमा करें, AI वर्तमान में ऑफ़ライン है। कृपया अपनी API कुंजी जांचें।"
        return "The AI Intelligence Engine is currently in maintenance mode. Please check back shortly."

    def _error_response(self, language: str) -> str:
        if language == 'hi':
            return "क्षमा करें, आपका अनुरोध संसाधित करने में समस्या हुई। कृपया पुनः प्रयास करें।"
        return "I apologize, but I encountered an error processing your request. Please try again."