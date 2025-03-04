### IMPORTS ###
import os
import json

from collections import defaultdict
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from huggingface_hub import login
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer, AsyncTextIteratorStreamer

from threading import Thread
from rag import query_rag

### MODELS ###
class ChatRequest(BaseModel):
    message: str


### HELPERS ###
def init_model():
    hf_token = os.environ.get("HF_TOKEN")
    login(hf_token)

    hf_cache_dir = os.environ.get("HF_CACHE_DIR")
    model = AutoModelForCausalLM.from_pretrained(
        "mistralai/Mistral-7B-Instruct-v0.2", device_map="auto", cache_dir=hf_cache_dir
    )
    tokenizer = AutoTokenizer.from_pretrained(
        "mistralai/Mistral-7B-Instruct-v0.2", cache_dir=hf_cache_dir
    )

    # Set pad token to eos token (but explicitly define it)
    tokenizer.pad_token = tokenizer.eos_token

    return model, tokenizer


def append_message(session_id, role, content):
    message_history[session_id].append({"role": role, "content": content})


def get_prompt():
    """Reads the system instruction prompt from a file."""
    with open("prompt.txt", "r") as file:
        return file.read().strip()

def get_sum_prompt():
    """Reads the system instruction prompt from a file."""
    with open("sum_prompt.txt", "r") as file:
        return file.read().strip()


### GLOBAL VARS ###

model = None
tokenizer = None
system_prompt = ""
message_history = defaultdict(list)
next_session_id = 0


### INIT ###

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


### ROUTES ###


# initialize on server startup
@app.on_event("startup")
async def startup_event():
    global model, tokenizer, system_prompt

    print("Initializing model...")
    model, tokenizer = init_model()
    print("Loading system prompts...")
    system_prompt = get_prompt()  # Load instructions from prompt.txt
    sum_prompt = get_sum_prompt()
    print("System is ready...")


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "api"}


@app.post("/chat/{session_id}")
async def generate_streaming_response(session_id: int, chatRequest: ChatRequest):
    # This is SSE, two newlines signifies end of event
    async def stream_generator(streamer):
        # a buffer to store responses, so the complete respond can be appended at the end
        responses = []
        try:
            async for text_chunk in streamer:
                responses.append(text_chunk)
                yield f"data: {json.dumps(text_chunk)}\n\n"

            response = "".join(responses)
            append_message(session_id, "assistant", response)
        except Exception as e:
            yield f"data: [Error: {json.dumps(e)}]\n\n"

    # Retrieve RAG context
    rag_context, _ = query_rag(chatRequest.message)

    # Format user message with RAG context
    formatted_input = (
        f"Relevant information: {rag_context}\n\nUser: {chatRequest.message}"
    )
    append_message(session_id, "user", formatted_input)
    """print("\n\n\nSENT TO the model!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n\n\n")
    print(message_history[session_id])"""
    # Convert messages to model input
    model_inputs = tokenizer.apply_chat_template(
        message_history[session_id], return_tensors="pt", padding=True
    ).to("cuda")

    # Start generating response
    streamer = AsyncTextIteratorStreamer(tokenizer, skip_prompt=True)
    generation_kwargs = dict(
        inputs=model_inputs, streamer=streamer, max_new_tokens=500, do_sample=True
    )
    thread = Thread(target=model.generate, kwargs=generation_kwargs)
    thread.start()

    return StreamingResponse(stream_generator(streamer), media_type="text/event-stream")


@app.get("/messages")
async def get_messages():
    return message_history


@app.get("/chat")
async def create_chat_session():
    global next_session_id
    next_session_id += 1
    message_history[next_session_id].append(
        {"role": "system", "content": system_prompt}
    )
    return next_session_id


@app.get("/summarize/{session_id}")
async def summarize_history(session_id: int):
    async def stream_generator(streamer):
        try:
            async for text_chunk in streamer:
                yield f"data: {json.dumps(text_chunk)}\n\n"
        except Exception as e:
            yield f"data: [Error: {json.dumps(e)}]\n\n"

    # Gather the conversation history content from the message history
    full_content = ""
    for message in message_history[session_id]:
        # Append only 'user' and 'assistant' roles to the content, not the original sytem prompt
        if message['role'] in ['user', 'assistant']:
            full_content += "\n*role*: *"+ message['role'] + "*, *content*: " + message['content'] + "*"

    # Create the system message with the appropriate context
    full_sum = [
        {
            "role": "system",
            "content": (
                "You are an expert business consultant called LegalEase **specializing in Washington State**. "
                "Your role is to help users determine the most suitable **business structure** based on their **business goals, financial situation, and legal considerations specific to Washington State**. \n\n"
                "You will summarize the following conversation that has been had between a user and an assistant. Summarize information the User provides, using information the assistant provides to flesh out the business structure. \n"
                "Only print out a summary, not an explination of how you got it. Display a factual summary, not in a conversational tone. "
            )
        },
        # Use the user's most recent message as the input context
        {"role": "user", "content": f"Summarize The following: \n\nUser: {full_content}"}, 
    ]

    print("\n\n\nSENT TO the model!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n\n\n")
    print(full_sum) 

    streamer = AsyncTextIteratorStreamer(tokenizer, skip_prompt=True)
    print('#######################checkpoint#################')

    # Convert full_sum to the imput format
    model_inputs = tokenizer.apply_chat_template(
        full_sum, return_tensors="pt", padding=True
    ).to("cuda")

    generation_kwargs = dict(
        inputs=model_inputs, streamer=streamer, max_new_tokens=500, do_sample=True
    )

    # Start generating the response in a separate thread
    thread = Thread(target=model.generate, kwargs=generation_kwargs)
    thread.start()

    return StreamingResponse(stream_generator(streamer), media_type="text/event-stream")