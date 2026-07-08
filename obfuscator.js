function obfuscateString(str) {
    // Yazıları bilgisayarın anlayacağı \x48\x65 formatına çevirir
    return str.replace(/"([^"\\]*)"/g, function(match, p1) {
        let hexed = "";
        for (let i = 0; i < p1.length; i++) {
            hexed += "\\" + p1.charCodeAt(i).toString(16);
        }
        return '"' + hexed + '"';
    });
}
// holly puhy

function startObfuscation() {
    let input = document.getElementById("inputCode").value;
    
    // 1. Aşama: Yazıları şifrele (Örn: "Merhaba" -> "\x4d\x65...")
    let result = obfuscateString(input);
    
    // 2. Aşama: Basitçe değişken isimlerini değiştir (Örn: 'mesaj' -> '_0xX1')
    result = result.replace(/\bmesaj\b/g, "_0xX1");
    
    // 3. Aşama: Başına bir filigran/imza ekle
    let finalCode = `-- Obfuscated by MyGitHubObfuscator\n${result}`;
    
    document.getElementById("outputCode").value = finalCode;
}

