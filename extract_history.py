import json

log_path = r'C:\Users\yaadv\.gemini\antigravity-ide\brain\602d096d-9d3f-49f9-8f4e-c5b35c71242a\.system_generated\logs\transcript_full.jsonl'
lines = open(log_path, 'r', encoding='utf-8').readlines()

user_inputs = []
for i, l in enumerate(lines):
    try:
        data = json.loads(l)
        if data.get('type') == 'USER_INPUT':
            user_inputs.append((i, data.get('content', '')))
    except:
        pass

print(f"Total user inputs: {len(user_inputs)}")
for i, (idx, content) in enumerate(user_inputs):
    print(f"Input {i+1} at line {idx}: {content[:50]!r}...")
