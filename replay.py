import json
import os
import subprocess

log_path = r'C:\Users\yaadv\.gemini\antigravity-ide\brain\602d096d-9d3f-49f9-8f4e-c5b35c71242a\.system_generated\logs\transcript_full.jsonl'
lines = open(log_path, 'r', encoding='utf-8').readlines()

# We want to replay all file modifications up to line 218 (just before Input 5).
for l in lines[:219]:
    try:
        data = json.loads(l)
        if data.get('type') == 'PLANNER_RESPONSE':
            tool_calls = data.get('tool_calls', [])
            for call in tool_calls:
                name = call.get('name')
                args = call.get('args', {})
                
                if name == 'write_to_file':
                    target = args.get('TargetFile')
                    content = args.get('CodeContent', '')
                    if target and content:
                        print(f"Writing {target}")
                        # ensure dir exists
                        os.makedirs(os.path.dirname(target), exist_ok=True)
                        with open(target, 'w', encoding='utf-8') as f:
                            f.write(content)
                            
                elif name == 'replace_file_content':
                    target = args.get('TargetFile')
                    replacement = args.get('ReplacementContent', '')
                    target_content = args.get('TargetContent', '')
                    if target and os.path.exists(target):
                        with open(target, 'r', encoding='utf-8') as f:
                            cur = f.read()
                        if target_content in cur:
                            cur = cur.replace(target_content, replacement)
                            with open(target, 'w', encoding='utf-8') as f:
                                f.write(cur)
                            print(f"Replaced content in {target}")
                            
                elif name == 'multi_replace_file_content':
                    target = args.get('TargetFile')
                    chunks = args.get('ReplacementChunks', [])
                    if target and os.path.exists(target):
                        with open(target, 'r', encoding='utf-8') as f:
                            cur = f.read()
                        for chunk in chunks:
                            tc = chunk.get('TargetContent', '')
                            rc = chunk.get('ReplacementContent', '')
                            if tc in cur:
                                cur = cur.replace(tc, rc)
                        with open(target, 'w', encoding='utf-8') as f:
                            f.write(cur)
                        print(f"Multi-replaced content in {target}")

    except Exception as e:
        print(e)
        pass

print("Finished restoring files from transcript history.")
