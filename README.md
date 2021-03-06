# Crunchyroll Quasar

Um site/aplicativo para assistir animes feito em quasar e api da Crunchyroll.

Demo: https://crunchyroll-quasar.netlify.app/

Metas a serem alcançadas:

- [x] Página inicial
- [x] Sistema de navegação
- [x] Integração da API da crunchyroll
- [x] Possibilidade de assistir
- [x] Internacionalização (Em andamento)
- [x] Função continuar assistindo
- [ ] Páginas restantes
- [ ] Logar pela crunchyroll
- [ ] Sincronizar com a conta da crunchyroll

Preview do projeto

![Preview](https://i.imgur.com/azwv1xN.png)
![Preview](https://i.imgur.com/FHvf4AO.png)
![Preview](https://i.imgur.com/ZT8wYaC.png)

## Instale as dependências

```bash
yarn
```

ou

```bash
npm install
```

### Iniciar o projeto em modo de desenvolvimento

```bash
quasar dev
```

### Fazer a build do projeto para produção

```bash
quasar build
```

### Para mais informações sobre:

Veja [Quasar Framework](https://quasar.dev/).

Tecnologias / Bibliotecas usadas:

- VueJs
- Quasar (Biblioteca de UI)
- VideoJs (Player de vídeo)
- Axios (Requisição para a API)
- Vue-Awesome-Swiper (Para o carrousel da página inicial)
- Vue-i18n (Internacionalização de strings)
- Localforage (Biblioteca para guardar dados de conteúdo longo na memória local)
- Vuex-Persist (Guardar o estado do vuex no localforage)
