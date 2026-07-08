import js

# Sayfa ilk yüklendiğinde JavaScript köprüsünü uyaralım
try:
    js.setSystemReady()
except:
    pass

def py_obfuscate(source_code):
    """
    JavaScript'ten gelen ham Lua kodunu alır, 
    satır satır işleyerek şifreli bir VM yapısına dönüştürür.
    """
    if not source_code.strip():
        return "-- [Hata] Kod boş olamaz!"
        
    lines = source_code.split('\n')
    bytecode = []
    string_pool = []
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Basit bir analiz ve opcode üretimi
        if line.startswith("print(") and line.endswith(")"):
            # İçindeki stringi ayıkla
            content = line[6:-1].strip('"\'')
            string_pool.append(content)
            # Opcode 1: PRINT, Argüman: String havuzundaki sırası
            bytecode.append(f"{{1, {len(string_pool) - 1}}}")
        else:
            # Genel tüm kodları güvenli mod opcode'una atıyoruz
            string_pool.append(line)
            # Opcode 99: RAW_EXECUTE
            bytecode.append(f"{{99, {len(string_pool) - 1}}}")
            
    # String havuzunu Lua'nın anlayacağı şifreli byte (\xxx) formatına çevirelim
    encrypted_strings = []
    for s in string_pool:
        lua_bytes = "".join(f"\\{ord(c):03d}" for c in s)
        encrypted_strings.append(f'"{lua_bytes}"')
        
    str_pool_data = ", ".join(encrypted_strings)
    bytecode_data = ", ".join(bytecode)
    
    # Üretilecek Devasa Sanal Makine Şablonu
    vm_template = f"""--[[ 
    v1.0.0 PyScript VM Obfuscator
    Protected by Python Backend Inside Browser
]]
return (function(...)
    local _STR_POOL = {{ {str_pool_data} }}
    local _BYTECODE = {{ {bytecode_data} }}
    
    local _IP = 1
    local _VM_RUN = true
    
    while _VM_RUN and _IP <= #_BYTECODE do
        local inst = _BYTECODE[_IP]
        local opcode = inst[1]
        local arg = inst[2]
        
        -- VM Opcodes Handler
        if opcode == 1 then
            print(_STR_POOL[arg + 1])
        elseif opcode == 99 then
            local run = loadstring or load
            if run then
                run(_STR_POOL[arg + 1])()
            end
        end
        _IP = _IP + 1
    end
end)(...)"""

    return vm_template

# PyScript dünyasına bu fonksiyonu JavaScript'in çağırabilmesi için kaydediyoruz
import sys
from pyscript import window
window.py_obfuscate = py_obfuscate
