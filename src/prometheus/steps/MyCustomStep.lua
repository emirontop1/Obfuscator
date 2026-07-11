local Step = require("prometheus.step")
local MyCustomStep = Step:extend()

MyCustomStep.Name = "My Custom Obfuscation"
MyCustomStep.Description = "Kendi özel karartma mantığım."

function MyCustomStep:apply(ast, pipeline)
    -- Burada AST üzerinde gezinerek (visitast kullanarak) 
    -- değişken isimlerini, sayıları veya yapıları değiştirebilirsin.
    return ast
end

return MyCustomStep

