const inputText = document.getElementById("inputText");
const speakButton = document.getElementById("speakButton");
const voiceSelect = document.getElementById("voiceSelect");

const API_KEY = "71e618f5143576fd52726d08f336bba1"; // Replace with your actual API key
const API_SECRET = "332031012efe4ae0a206c78a7b6931db"; // Replace with your actual API secret
const API_ID = "ga15e246"; // Replace with your actual API ID

// Function to populate voices in the dropdown
const populateVoices = (voices) => {
  voiceSelect.innerHTML = ""; // Clear previous options
  voices.forEach(voice => {
    const option = document.createElement("option");
    option.value = voice.name;
    option.text = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });
};

// Function to fetch available voices
const fetchVoices = () => {
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) {
    setTimeout(fetchVoices, 100); // Retry after a short delay
    return;
  }
  populateVoices(voices);
};

// Fetch available voices after voiceschanged event
window.speechSynthesis.onvoiceschanged = fetchVoices;

// Speak the provided text using the selected voice
const speakText = () => {
  const selectedVoice = voiceSelect.value;
  const text = inputText.value;

  if (text.trim() === "") {
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  const chosenVoice = voices.find(voice => voice.name === selectedVoice);
  utterance.voice = chosenVoice;

  
  const apiUrl = `ws://tts-api-sg.xf-yun.com/v2/ttss?authorization=aG1hYyB1c2VybmFtZT0iZGE0ZjMyOWUyZmQwMGQ1NjE4NjVjNjRkZjU3NDNiMjAiLCBhbGdvcml0aG09ImhtYWMtc2hhMjU2IiwgaGVhZGVycz0iaG9zdCBkYXRlIHJlcXVlc3QtbGluZSIsIHNpZ25hdHVyZT0ic1RtbzRobDBMdmRLWTRLRjltcGJKV0htRFFzNC8xZ2ZPdUgwZnBZbVdnbz0i&date=Thu%2C%2001%20Aug%202019%2001%3A53%3A21%20GMT&host=tts-api.xfyun.cn?text=${encodeURIComponent(
    text
  )}&voice=${encodeURIComponent(
    chosenVoice.name
  )}&api_key=${API_KEY}&api_secret=${API_SECRET}&appid=${API_ID}`;
  
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Handle the API response
      console.log(data);
    })
    .catch(error => {
      // Handle promise rejection (error) here
      console.error('API fetch error:', error);
    });

  window.speechSynthesis.speak(utterance);
};

// Initialize the page
window.addEventListener("load", () => {
  fetchVoices(); // Fetch voices on page load
});

// Bind event listeners
speakButton.addEventListener("click", speakText);
voiceSelect.addEventListener("change", speakText);
