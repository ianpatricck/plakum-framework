# Plakum Framework

Plakum é um projeto pequeno que consiste em simples testes de API, é inspirado fortemente em Express 
e mantém uma sintaxe semelhante. Seu núcleo é feito totalmente em TypeScript, no qual permite o uso de tipagens
personalizadas da própria ferramenta.

[![plakum.png](https://i.postimg.cc/d0bznfxj/plakum.png)](https://postimg.cc/qtGbv10N)

## Instalação e configuração

### NPM

```
$ npm install @types/node -D
$ npm install typescript plakum-framework
```

### Yarn

```
$ yarn add @types/node -D 
$ yarn add typescript plakum-framework
```

### tsconfig.json

Esta é a configuração mínima do TypeScript para o Plakum, mas pode-se derivar de acordo com seus objetivos.

```json
{
  "compilerOptions": {
    "target": "es2017",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "module": "commonjs",
    "rootDir": "./",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "allowJs": true,
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "noImplicitAny": false
  }
}
```

### Exemplo rápido

```index.ts```
```ts
import Plakum, { Request, Response } from 'plakum-framework';

const PORT = 8888;
const app = new Plakum();

app.json();
app.get('/', (req: Request, res: Response) => {
  return res.send({ message: "Hello World!" });
});

app.init(PORT, () => console.log(`Server is running on port ${PORT}`));
```

Agora compile e execute o código gerado em ```dist```.

```
$ tsc --build
$ node dist
```

## Importante

Lembre-se que este é um projeto em fase inicial e de modo algum deve ser usado para aplicações complexas ou em produção de alto nível.
Para uma melhor documentação e detalhamento acesse a Wiki deste repositório.

