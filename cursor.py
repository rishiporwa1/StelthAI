from dotenv import load_dotenv
from openai import OpenAI
import json
import os
import requests
import subprocess


load_dotenv()

client = OpenAI(
    api_key=os.getenv("COHERE_API_KEY"),
    base_url="https://api.cohere.ai/compatibility/v1"
)


def get_weather(city):
    print("🔨 Tool Called: get_weather", city)

    url = f"https://wttr.in/{city}?format=%C+%t"
    response = requests.get(url)

    if response.status_code == 200:
        return f"The weather in {city} is {response.text}."
    return "Something went wrong"


def run_command(command):
    print("🔨 Tool Called: run_command ->", command)
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True, timeout=60)
        output = f"STDOUT:\n{result.stdout}\nSTDERR:\n{result.stderr}\nExit Code: {result.returncode}"
        return output
    except Exception as e:
        return f"Error executing command: {str(e)}"


def write_file(params):
    print("🔨 Tool Called: write_file")
    if isinstance(params, str):
        try:
            params = json.loads(params)
        except Exception:
            return "Error: Input must be a JSON object with 'filepath' and 'content' keys."
            
    filepath = params.get("filepath")
    content = params.get("content")
    if not filepath or content is None:
        return "Error: Both 'filepath' and 'content' keys are required."
        
    try:
        dirname = os.path.dirname(os.path.abspath(filepath))
        if dirname:
            os.makedirs(dirname, exist_ok=True)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        return f"Successfully wrote content to {filepath}"
    except Exception as e:
        return f"Error writing file: {str(e)}"


def read_file(filepath):
    print("🔨 Tool Called: read_file ->", filepath)
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return f.read()
    except Exception as e:
        return f"Error reading file {filepath}: {str(e)}"


def list_directory(path="."):
    print("🔨 Tool Called: list_directory ->", path)
    if not path:
        path = "."
    try:
        items = os.listdir(path)
        return f"Directory contents of '{path}':\n" + "\n".join(items)
    except Exception as e:
        return f"Error listing directory: {str(e)}"


def ask_user(question):
    print(f"❓ Agent Question: {question}")
    user_response = input("Your Answer > ")
    return user_response


available_tools = {
    "get_weather" : {
        "fn" : get_weather,
        "description" : "Takes a city name as an input and returns the current weather for the city"
    },
    "run_command" : {
        "fn" : run_command,
        "description" : "Takes a shell/CMD command as input to execute on system and returns stdout/stderr output. Can use standard git commands (git add, git commit, git push) to manage repositories."
    },
    "write_file" : {
        "fn" : write_file,
        "description" : "Writes content/code directly to a file. Input should be a JSON object/dictionary with 'filepath' (string) and 'content' (string) keys."
    },
    "read_file" : {
        "fn" : read_file,
        "description" : "Reads the text contents of a file. Input is the filepath string."
    },
    "list_directory" : {
        "fn" : list_directory,
        "description" : "Lists the contents of the given directory. Input is the directory path string (default '.')."
    },
    "ask_user" : {
        "fn" : ask_user,
        "description" : "Asks the user a question for clarification or input, and returns their response. Input is the question string."
    }
}

system_instruction = f"""
    You are an extremely helpful and capable AI Developer Assistant specialized in resolving user tasks.
    You operate in a start, plan, action, observe loop.
    For the given user query and available tools, plan the step by step execution. Based on the planning,
    select the relevant tool, perform the action, and then review the observation.
    
    The host operating system is Windows.

    Guidelines:
    1. Creating/Writing Code: Always use the 'write_file' tool instead of echo redirects.
    2. Git Operations: Use 'run_command' to run Git commands:
       - Run 'git status' to see what's changed.
       - Use 'git add <files>' to stage only the necessary changes.
       - Use 'git commit -m "<message>"' with a concise, descriptive commit message.
       - Use 'git push' (or 'git push -u origin main' if needed) to push changes.
    3. Self-Debugging: If a command or python script runs with an error, look at the error (stderr/stdout) and correct it.
    4. Clarification: If requirements are ambiguous or you need permission for something, use the 'ask_user' tool to ask.

    Rules:
    - Follow the Output JSON Format exactly.
    - Always perform one step at a time and wait for next input.
    - Carefully analyze the user query.

    Output JSON Format:
    {{
        "step": "string",
        "content": "string",
        "function": "The name of function if the step is action",
        "input": "The input parameter for the function (can be a string or a JSON object depending on the function)"
    }}

    Available Tools:
    - get_weather: Takes a city name as input and returns current weather.
    - run_command: Execute shell commands. Returns stdout and stderr. Use for running scripts or git commands.
    - write_file: Writes content to a file. Takes a JSON object with 'filepath' and 'content'.
    - read_file: Reads a file. Takes a filepath string.
    - list_directory: Lists folder files. Takes a directory path string.
    - ask_user: Asks user for input. Takes a question string.
    
    Example:
    User Query: What is the weather of new york?
    Output: {{ "step": "plan", "content": "The user is interested in weather data of new york" }}
    Output: {{ "step": "plan", "content": "From the available tools I should call get_weather" }}
    Output: {{ "step": "action", "function": "get_weather", "input": "new york" }}
    Output: {{ "step": "observe", "content": "12 Degree Cel" }}
    Output: {{ "step": "output", "content": "The weather for new york seems to be 12 degrees." }}
"""

messages = [
    { "role" : "system" , "content" : system_instruction}
]
while True:
    user_query = input("> ")
    if not user_query.strip():
        continue
    messages.append({"role" : "user" , "content" : user_query})

    while True:
        response = client.chat.completions.create(
            model="command-r-plus-08-2024",
            response_format={"type" : "json_object"},
            messages=messages
        )

        parsed_response = json.loads(response.choices[0].message.content)
        messages.append({"role": "assistant", "content": json.dumps(parsed_response)})

        if parsed_response.get("step") == "plan":
            print(f"🧠: {parsed_response.get('content')}")
            continue
        
        if parsed_response.get("step") == "action":
            tool_name = parsed_response.get("function")
            tool_input = parsed_response.get("input")

            if available_tools.get(tool_name, False) != False:
                output = available_tools[tool_name].get("fn")(tool_input)
                # Append observation as "user" role representing feedback from the environment
                messages.append({"role" : "user", "content" : json.dumps({"step" : "observe" , "content" : output})})
                continue
        
        if parsed_response.get("step") == "observe":
            print(f"🔍: {parsed_response.get('content')}")
            continue

        if parsed_response.get("step") == "output":
            print(f"🤖: {parsed_response.get('content')}")
            break