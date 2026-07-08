#!/usr/bin/env python3
import re
import sys
import random
import string

def obfuscate(code):
    # 1. Yorumları kaldır (tek satır)
    code = re.sub(r'--[^\n]*', '', code)
    
    # 2. Fazla boşlukları temizle
    code = re.sub(r'\s+', ' ', code)
    
    # 3. Yerel değişkenleri rastgele isimlerle değiştir
    var_map = {}
    counter = 0
    
    def replace_local(match):
        nonlocal counter
        var_name = match.group(1)
        new_name = '_' + ''.join(random.choices(string.ascii_letters + string.digits, k=8))
        var_map[var_name] = new_name
        return f'local {new_name}'
    
    code = re.sub(r'local\s+(\w+)', replace_local, code)
    
    # Eski isimleri yeni isimlerle değiştir (sadece tam kelime)
    for old, new in var_map.items():
        code = re.sub(r'\b' + re.escape(old) + r'\b', new, code)
    
    # 4. String literal'ları HEX'e çevir
    def hex_encode(match):
        s = match.group(1)
        hex_str = s.encode().hex()
        return f'(function() local h="{hex_str}" return (h:gsub("..", function(c) return string.char(tonumber(c,16)) end)) end)()'
    
    code = re.sub(r'"(.*?)"', hex_encode, code)
    
    return code

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python obfuscator.py <input_file> [output_file]")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else 'obfuscated_output.lua'
    
    with open(input_file, 'r', encoding='utf-8') as f:
        code = f.read()
    
    obf_code = obfuscate(code)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(obf_code)
    
    print(f"Obfuscated code written to {output_file}")
