 = 'C:\Users\yaadv\.gemini\antigravity-ide\brain\b7a4a001-8f2a-4374-b24b-63189e4116b3\.system_generated\logs\transcript_full.jsonl'
 = 'C:\Users\yaadv\OneDrive\Desktop\E-Bazaar\history'
New-Item -ItemType Directory -Force -Path  | Out-Null

 = Get-Content -Path 

foreach ( in ) {
     =  | ConvertFrom-Json
    if (.tool_calls) {
        foreach ( in .tool_calls) {
            if (.name -eq 'write_to_file' -or .name -eq 'replace_file_content' -or .name -eq 'multi_replace_file_content') {
                 = .args.TargetFile
                if () {
                     = Split-Path  -Leaf
                     = .step_index
                     = .args.CodeContent
                    if (.name -eq 'replace_file_content') {
                         = .args.ReplacementContent
                    } elseif (.name -eq 'multi_replace_file_content') {
                         = 'MULTI_REPLACE'
                    }
                    if () {
                         = Join-Path  "_"
                        Set-Content -Path  -Value 
                    }
                }
            }
        }
    }
}
Write-Host 'Extraction complete'
