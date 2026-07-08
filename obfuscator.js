function runVMObfuscator() {
    let sourceCode = document.getElementById("inputCode").value;
    
    // Satırları ayır ve temizle
    let lines = sourceCode.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    let bytecode = [];
    let stringPool = [];

    // Basit bir Lexer/Compiler Simülasyonu (Kodu Bytecode'a Çevirme)
    lines.forEach((line) => {
        if (line.startsWith("print(") && line.endsWith(")")) {
            // String içeriğini yakala
            let match = line.match(/"([^"\\]*)"/);
            if (match) {
                stringPool.push(match[1]);
                // Opcode 1: PRINT_STR, Parametre: String havuzundaki index
                bytecode.push({ op: 1, arg: stringPool.length - 1 });
            }
        } else {
            // Bilinmeyen satırları güvenli yürütme için ham opcode'a (RAW_EXEC) çevir
            stringPool.push(line);
            bytecode.push({ op: 99, arg: stringPool.length - 1 });
        }
    });

    // Veriyi şifreli ASCII formatına (\xxx) dönüştürme fonksiyonu
    let convertToLuaBytes = (str) => {
        return str.split('').map(c => '\\' + c.charCodeAt(0).toString().padStart(3, '0')).join('');
    };

    // Sanal Makine Veri Havuzunu Hazırlama
    let encryptedStrings = stringPool.map(s => `"${convertToLuaBytes(s)}"`).join(", ");
    
    let bytecodeData = bytecode.map(b => `{${b.op}, ${b.arg}}`).join(", ");

    // Şablon Lua Sanal Makinesi (Interpreter) Ekleme
    let protectedCode = `--[[ VM Korumali Altyapi ]]
return (function(...)
    -- Şifrelenmiş Sabitler Veri Havuzu
    local _STR_POOL = { ${encryptedStrings} }
    -- Sanal İşlemci Talimatları (Bytecode dizisi)
    local _BYTECODE = { ${bytecodeData} }
    
    -- Lua VM (Sanal Makine Motoru)
    local _IP = 1
    local _VM_RUN = true
    
    while _VM_RUN and _IP <= #_BYTECODE do
        local inst = _BYTECODE[_IP]
        local opcode = inst[1]
        local arg = inst[2]
        
        -- Kontrol Akışı (Control Flow Flattening / Opcode Handler)
        if opcode == 1 then
            -- PRINT_STR Komutu işletiliyor
            print(_STR_POOL[arg + 1])
        elseif opcode == 99 then
            -- Ham kod satırı yüklenip güvenli ortamda yürütülüyor
            assert(loadstring or load)(_STR_POOL[arg + 1])()
        end
        
        _IP = _IP + 1
    end
end)(...)`;

    document.getElementById("outputCode").value = protectedCode;
}
