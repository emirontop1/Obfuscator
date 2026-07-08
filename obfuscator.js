// Mobildeki hataları ekrana yazdırmak için Global Hata Yakalayıcı
window.onerror = function (message, url, lineNo) {
    let logDiv = document.getElementById("errorLog");
    logDiv.style.color = "#ff5555"; // Hata durumunda kırmızı yap
    logDiv.innerText = "HATA YAKALANDI:\n" + message + "\nSatır: " + lineNo;
    return false;
};

function runVMObfuscator() {
    // Konsolu temizle
    let logDiv = document.getElementById("errorLog");
    logDiv.style.color = "#ffb86c";
    logDiv.innerText = "İşlem başlatıldı...";

    let sourceCode = document.getElementById("inputCode").value;
    
    if (!sourceCode.trim()) {
        logDiv.innerText = "Uyarı: Obfuscate edilecek kod boş!";
        return;
    }

    let lines = sourceCode.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    let bytecode = [];
    let stringPool = [];

    lines.forEach((line) => {
        if (line.startsWith("print(") && line.endsWith(")")) {
            let match = line.match(/"([^"\\]*)"/);
            if (match) {
                stringPool.push(match[1]);
                bytecode.push({ op: 1, arg: stringPool.length - 1 });
            } else {
                stringPool.push(line);
                bytecode.push({ op: 99, arg: stringPool.length - 1 });
            }
        } else {
            stringPool.push(line);
            bytecode.push({ op: 99, arg: stringPool.length - 1 });
        }
    });

    // ASCII byte dönüştürücü (\xxx formatı)
    let convertToLuaBytes = (str) => {
        return str.split('').map(c => '\\' + c.charCodeAt(0).toString().padStart(3, '0')).join('');
    };

    let encryptedStrings = stringPool.map(s => `"${convertToLuaBytes(s)}"`).join(", ");
    let bytecodeData = bytecode.map(b => `{${b.op}, ${b.arg}}`).join(", ");

    // Web uyumlu, çökme riski azaltılmış VM şablonu
    let protectedCode = `--[[ VM Korumali Altyapi ]]
return (function(...)
    local _STR_POOL = { ${encryptedStrings} }
    local _BYTECODE = { ${bytecodeData} }
    
    local _IP = 1
    local _VM_RUN = true
    
    while _VM_RUN and _IP <= #_BYTECODE do
        local inst = _BYTECODE[_IP]
        local opcode = inst[1]
        local arg = inst[2]
        
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
end)(...)`;

    // Çıktıyı ekrana bas
    document.getElementById("outputCode").value = protectedCode;
    logDiv.innerText = "Başarılı! Kod başarıyla VM biçimine dönüştürüldü.";
}
